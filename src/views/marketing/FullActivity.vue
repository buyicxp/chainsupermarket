<template>
	<div>
		<el-main>
			   <el-row>
			   	<el-col :span="1" class="grid">
			   		<el-button
			   			type="success"
			   			icon="el-icon-circle-plus-outline"
			   			size="mini"
			   			round
						@click="addActivity()"
			   		>
			   			新建活动
			   		</el-button>
			   	</el-col>
			   </el-row>
			<!-- 根据活动名称查询数据（支持模糊查询） -->
			<div class="serach"><el-input placeholder="请输入搜索的词" v-model="fullActivity.activityName" clearable style="width: 10.625rem;" @clear="getActivityList()"></el-input>
			<el-button type="success" @click="getActivityList()" >搜索</el-button>
			</div>
			<!-- 满减满赠活动列表 -->
			<el-table :data="fullActivityList">
				<el-table-column prop="activityid" label="序号" width="70"></el-table-column>
				<el-table-column prop="activityName" label="活动名称" width="120"></el-table-column>
				<el-table-column prop="type.typeName" label="活动类型" width="80"></el-table-column>
				<el-table-column prop="activityTime" label="活动时间"  width="100" ></el-table-column>
				<el-table-column prop="range.activityRange" label="活动范围" width="100"></el-table-column>
				<el-table-column prop="activityState" label="活动状态" width="90"></el-table-column>
				<el-table-column prop="executingState" label="执行状态" width="100"></el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button size="mini" type="text" style="color: lightseagreen;" @click="handleDetail(scope.$index, scope.row)">详情</el-button>
						<el-button size="mini" type="text" style="color: #F56C6C;" @click="handleDelete(scope.$index, scope.row)">启用/停用</el-button>
					</template>
				</el-table-column>

				<el-table-column>
					<template slot-scope="scope">
						<el-button type="danger" icon="el-icon-delete" size="mini" @click="delBook(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:current-page="page"
				:page-sizes="[5, 10, 20]"
				:page-size="size"
				style="float:right"
				layout="total, sizes, prev, pager, next, jumper"
				:total="total"
			></el-pagination>
			<el-dialog title="提示" style="text-align:left !important" :visible.sync="dialog2Visible" :before-close="handleClose">
				<span>你确定要删除这条信息吗?</span>
				<span slot="footer" class="dialog-footer">
					<el-button @click="handleDel()">提交</el-button>
					<el-button type="primary" @click="dialog2Visible = false">取消</el-button>
				</span>
			</el-dialog>
			<el-dialog
			  title="活动详情"
			  :visible.sync="dialogVisible"
			  width="80%"
			  :before-close="handleClose">
			 <el-table :data="fullActivityById">
			 	<el-table-column prop="activityName" label="活动名称" width="120"></el-table-column>
			 	<el-table-column prop="type.typeName" label="活动类型" width="120"></el-table-column>
			 	<el-table-column prop="activityTime" label="活动时间"  width="120" ></el-table-column>
			 	<el-table-column prop="range.activityRange" label="活动范围" width="120"></el-table-column>
				<el-table-column prop="activityDetail" label="活动详情" width="300"></el-table-column>
				<el-table-column prop="goodsType.typename" label="参与活动类别" width="120"></el-table-column>
				<el-table-column prop="goodsCommodity.goodsName" label="参与活动商品" width="120"></el-table-column>
			 </el-table>
			</el-dialog>
		</el-main>
	</div>
</template>

<script>
import axios from 'axios';
import qs from 'qs';
export default {
	data() {
		return {
			dialogVisible: false,
			dialog2Visible: false,
			total: 0,
			size: 5,
			page: 1,
			fullActivityList: [],
			fullActivityById:[],
			fullActivity: {},
			curId: '',
		};
	},
	watch: {
		total() {
			if (this.total == (this.page - 1) * this.size && this.total != 0) {
				this.page -= 1;
				this.getActivityList();
			}
		}
	},
	methods: {
		handleClose(done) {
			this.dialogVisible = true;
			
			done();
		},
		handleSizeChange(val) {
			this.size = val;
			this.getActivityList();
		},
		handleCurrentChange(val) {
			this.page = val;
			this.getActivityList();
		},
		//跳转到新建活动页面
		addActivity(){
			this.$router.replace('/add');
			
		},
		//获取活动数据(模糊查询)
		async getActivityList() {
			try {
				let res = await axios.post(
					'http://localhost:8080/fullActivity/list',
					qs.stringify({
						index: this.page,
						pageSize: this.size,
						activityName:this.fullActivity.activityName,
					})
				);
				this.total = res.data.count;
				this.fullActivityList = res.data.pu.list;
			} catch (e) {
				console.log(e);
			}
		},
		//删除传值
		delBook(row) {
			this.fullActivity = row;
			this.dialog2Visible = true;
			this.curId = row.ID;
		},
		//删除数据（改变状态使数据不显示）
		async handleDel() {
			try {
				let res = await axios.post(
					'http://localhost:8080/fullActivity/delete',
					qs.stringify({
						activityid: this.fullActivity.activityid
						
					})
				);
				this.curId = '';
				this.dialog2Visible = false;
				this.$message({
					message: res.data.Msg,
					type: 'success'
				});
				this.getActivityList();
			} catch (e) {
				console.log(e);
			}
		},
		//启用/停用
		async handleDelete(index, row) {
			try {
				let res = await axios.post(
					'http://localhost:8080/fullActivity/update',
					qs.stringify({
						activityid: row.activityid,
						activityState: row.activityState
					})
				);
				this.dialog2Visible = false;
				this.dialogVisible = false;
				this.$message({
					message: res.data.Msg,
					type: 'success'
				});
				this.getActivityList();
			} catch (e) {
				console.log(e);
			}
		},
		//详情
	 async	handleDetail(index, row) {
		  console.log(row)
			try {
				let res = await axios.post(
					'http://localhost:8080/fullActivity/detail',
					qs.stringify({
						activityid: row.activityid,
						
					})
				);
				this.fullActivityById=[]
				this.fullActivityById.push(res.data.full);
				this.dialog2Visible = false;
				this.dialogVisible = true;
			} catch (e) {
				console.log(e);
			}
		}
	},
	mounted() {
		this.getActivityList();
	}
};
</script>

<style>
#app {
	font-family: Helvetica, sans-serif;
	text-align: center;
}
.serach{
	text-align: right;
}
.el-button {
	display: inline-block;
	padding: 10px;
}
</style>
