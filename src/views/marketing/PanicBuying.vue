<template>
	<div id="app">
		<el-row>
			<el-col :span="1" class="grid"><el-button type="success" @click="addPurchase()" icon="el-icon-circle-plus-outline" round>新增活动</el-button></el-col>
			<div class="serach">
				<el-input placeholder="请输入搜索的词" v-model="Purchase.activityNamei" clearable style="width: 10.625rem;" @clear="getPurchaseList()"></el-input>
				<el-button type="success" @click="getPurchaseList()" style="display: inline-block;">搜索</el-button>
			</div>
		</el-row>
		<br />
		<el-table :data="PurchaseList" border style="width: 100%" stripe ref="multipleTable" tooltip-effect="dark">
			<el-table-column label="序号" type="index" width="80px" align="center">
				<template slot-scope="scope">
					<span>{{ (page - 1) * size + scope.$index + 1 }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="activityName" label="活动名称"></el-table-column>
			<el-table-column prop="activityNumber" label="限购数量" align="center"></el-table-column>
			<el-table-column label="活动时长" width="170px">
				<template slot-scope="scope">
					<span>{{ scope.row.activitystartTime }}</span>
					至
					<span>{{ scope.row.activityendTime }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="activitydTimeQuantum" label="活动状态" :formatter="analysis"></el-table-column>
			<el-table-column prop="gmtCreate" label="录入时间"></el-table-column>
			<el-table-column label="编辑" width="100">
				<template slot-scope="scope">
					<el-button type="primary" icon="el-icon-edit" size="mini" @click="editPurchase(scope.row)">修改</el-button>
				</template>
			</el-table-column>
			<el-table-column label="删除" width="100">
				<template slot-scope="scope">
					<el-button type="danger" icon="el-icon-delete" size="mini" @click="delPurchase(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--分页-->
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

		<el-dialog :title="addFlag ? '新增活动' : '修改活动'" style="text-align:left !important" :visible.sync="dialogVisible" :before-close="handleClose">
			<el-form ref="form" label-width="120px" style="display: block;">
				<el-row>
					<el-col :span="8">
						<el-form-item label="活动名称:"><el-input v-model="Purchase.activityName" style="width:138px"></el-input></el-form-item>
					</el-col>
				</el-row>
				<template>
					<div class="block">
						<el-form-item label="活动时间:">
							<el-date-picker
								v-model="Purchase.activitystartTime"
								type="datetime"
								format="yyyy-MM-dd HH:mm:ss"
								value-format="yyyy-MM-dd HH:mm:ss"
								placeholder="选择日期"
							></el-date-picker>
							至
							<el-date-picker
								v-model="Purchase.activityendTime"
								type="datetime"
								format="yyyy-MM-dd HH:mm:ss"
								value-format="yyyy-MM-dd HH:mm:ss"
								placeholder="选择日期"
							></el-date-picker>
						</el-form-item>
					</div>
				</template>
				<el-row>
					<el-col :span="8">
						<el-form-item label="限购数量:"><el-input v-model="Purchase.activityNumber" style="width:120px"></el-input></el-form-item>
					</el-col>
				</el-row>
				<el-form-item label="选择门店:">
					<template>
						<el-transfer
							style="text-align: left;line-height: 0px;"
							v-model="value"
							:data="this.listData"
							:titles="['所有门店', '已选择的门店']"
							:button-texts="['删除', '添加']"
						></el-transfer>
					</template>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="success" @click="savePurchase()" style="display: inline-block;">保存</el-button>
				<el-button type="primary" @click="dialogVisible = false" style="display: inline-block;">取消</el-button>
			</span>
		</el-dialog>
		<el-dialog title="提示" style="text-align:left !important" :visible.sync="dialog2Visible" :before-close="handleClose">
			<span>你确定要删除这个活动吗?</span>
			<span slot="footer" class="dialog-footer">
				<el-button @click="handleDel()" style="display: inline-block">提交</el-button>
				<el-button type="primary" @click="dialog2Visible = false" style="display: inline-block">取消</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import axios from 'axios';
import qs from 'qs';
import Date from '../../assets/js/Date';
export default {
	data() {
		return {
			dialogVisible: false,
			dialog2Visible: false,
			total: 0, //从第几条数据开始
			size: 5, //页大小
			page: 1, //当前页
			//查询显示的分页数据
			PurchaseList: [],
			//对象参数
			Purchase: {},
			addFlag: true, //添加还是修改判定,true为添加
			curId: '', //赋予当前选中行id
			listData: [], //shoplist，查询出来的门店
			value: [] //门店字符串数组
		};
	},
	watch: {
		total() {
			if (this.total == (this.page - 1) * this.size && this.total != 0) {
				this.page -= 1;
				this.getPurchaseList();
			}
		}
	},
	methods: {
		analysis(row) {
			if (row.activitydTimeQuantum == '1') {
				return '活动正在进行中';
			} else if (row.activitydTimeQuantum == '0') {
				return '活动已失效';
			} else {
				return '--';
			}
		},
		handleClose(done) {
			done();
		},
		//页大小
		handleSizeChange(val) {
			this.size = val;
			this.getPurchaseList();
		},
		//当前页
		handleCurrentChange(val) {
			this.page = val;
			this.getPurchaseList();
		},
		//分页查询的方法
		async getPurchaseList() {
			try {
				let res = await axios.post(
					'/marketings/selectMarket',
					qs.stringify({
						currentPage: this.page,
						pageSize: this.size,
						activityName: this.Purchase.activityNamei //搜索名称
					})
				);
				this.total = res.data.count;
				this.PurchaseList = res.data.result; //分页参数
				console.log(res.data.result);
				console.log(this.PurchaseList);
			} catch (e) {
				console.log(e);
			}
		},
		//添加或者修改的方法，按actitytiesId是不是为‘’判定
		async savePurchase() {
			try {
				let res = await axios.post(
					'/marketings/addMarket',
					qs.stringify({
						ctivityId: this.Purchase.ctivityId,
						activityName: this.Purchase.activityName,
						activityNumber: this.Purchase.activityNumber, //限购数量
						activitystartTime: this.Purchase.activitystartTime,
						activityendTime: this.Purchase.activityendTime,
						sophId: this.value.join() //店铺字符串
					})
				);
				this.dialogVisible = false;
				this.Purchase = {};
				this.$message({
					message: res.data.Msg,
					type: 'success'
				});
				this.getPurchaseList();
			} catch (e) {
				console.log(e);
			}
		},
		delPurchase(row) {
			this.addFlag = false;
			this.dialog2Visible = true;
			this.curId = row.ctivityId;
		},
		//删除
		async handleDel() {
			try {
				let res = await axios.post(
					'/marketings/delMarket',
					qs.stringify({
						lists: this.curId
					})
				);
				this.curId = '';
				this.dialog2Visible = false;
				this.$message({
					message: res.data.Msg,
					type: 'success'
				});
				alert('删除方法执行');
				//删除后再次调用查询方法
				this.getPurchaseList();
			} catch (e) {
				console.log(e);
			}
		},
		//显示当前行,修改判定
		editPurchase(row) {
			this.Purchase = row;
			console.log(this.Purchase);
			console.log(this.Purchase.sophId);
			let strNum = [];
			let str = this.Purchase.sophId.split(','); //门店编号，拆分
			for (let i = 0; i < str.length; i++) {
				strNum.push(parseInt(str[i]));
			}
			this.value = strNum; //赋值给value数组
			this.dialogVisible = true;
			this.addFlag = false; //修改判定
		},

		//添加显示弹框的方法
		addPurchase() {
			this.Purchase = {};
			this.value = [];
			this.dialogVisible = true;
			this.addFlag = true; //添加判定
		},
		//获取门店信息
		generateData() {
			var data = [];
			axios.get('/Purchase/shopList').then(({ data: result }) => {
				let list = result.shopList;
				list.forEach(({ spId, spName }) => {
					var k = {
						spId,
						spName
					};
					data.push({
						key: k.spId,
						label: k.spName
					});
				});
				this.listData = data;
			});
		}
	},
	mounted() {
		this.getPurchaseList();
		this.generateData();
	}
};
</script>

<style type="text/css">
#app {
	font-family: Helvetica, sans-serif;
	text-align: center;
}
#app .el-button {
	display: block;
	padding: 10px;
}
#app .serach {
	text-align: right;
}
</style>
