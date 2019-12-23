<template>
	<div id="app">
		<el-row>
			<el-col :span="1" class="grid"><el-button type="success" @click="addadvType()" icon="el-icon-circle-plus-outline" round>新增广告类型</el-button></el-col>
		</el-row>
		<br />
		<el-table :data="advTypeList" border style="width: 100%" stripe ref="multipleTable" tooltip-effect="dark">
			<el-table-column label="序号" type="index" width="80px" align="center">
				<template slot-scope="scope">
					<span>{{ (page - 1) * size + scope.$index + 1 }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="advertisingName" label="类型名称"></el-table-column>
			<el-table-column prop="usable" label="状态" :formatter="analysis" align="center"></el-table-column>
			<el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
			<el-table-column prop="advertContent" label="说明" align="center"></el-table-column>
			<el-table-column label="编辑" width="100">
				<template slot-scope="scope">
					<el-button type="primary" icon="el-icon-edit" size="mini" @click="editadvType(scope.row)">修改</el-button>
				</template>
			</el-table-column>
			<el-table-column label="删除" width="100">
				<template slot-scope="scope">
					<el-button type="danger" icon="el-icon-delete" size="mini" @click="deladvType(scope.row)">删除</el-button>
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
		<el-dialog :title="addFlag ? '新增广告类型' : '修改广告类型'" style="text-align:left !important" :visible.sync="dialogVisible" :before-close="handleClose">
			<el-form ref="form" label-width="120px" style="display: block;content: 0px;">
				<el-row>
					<el-form-item label="广告类型:"><el-input style="width:200px" v-model="advType.advertisingName"></el-input></el-form-item>
					<el-form-item label="是否可用:">
						<template>
							<el-radio v-model="radio" label="1">是</el-radio>
							<el-radio v-model="radio" label="2">否</el-radio>
						</template>
					</el-form-item>
					<el-form-item label="排序:"><el-input style="width:50px" v-model="advType.orderByBy"></el-input></el-form-item>
				</el-row>
				<el-form-item label="说明:"><el-input type="textarea" :rows="6" style="width:500px" v-model="advType.advertContent"></el-input></el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="success" @click="saveadvType()" style="display: inline-block;">保存</el-button>
				<el-button type="primary" @click="dialogVisible = false" style="display: inline-block;">取消</el-button>
			</span>
		</el-dialog>
		<el-dialog title="提示" style="text-align:left !important" :visible.sync="dialog2Visible" :before-close="handleClose">
			<span>你确定要删除这个广告类型吗?</span>
			<span slot="footer" class="dialog-footer">
				<el-button @click="handleDel()">提交</el-button>
				<el-button type="primary" @click="dialog2Visible = false">取消</el-button>
			</span>
		</el-dialog>
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
			radio: '1',
			addFlag: true,
			advType: {},
			advTypeList: [],
			curId: '',
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
			if (row.usable == '1') {
				return '可用';
			} else if (row.usable == '2') {
				return '不可用';
			} else {
				return '--';
			}
		},
		handleClose(done) {
			done();
		},
		handleSizeChange(val) {
			this.size = val;
			this.getadvTypeList();
		},
		handleCurrentChange(val) {
			this.page = val;
			this.getadvTypeList();
		},
		async getadvTypeList() {
			try {
				let res = await axios.post(
					'/adver/List',
					qs.stringify({
						index: this.page,
						pageSize: this.size
					})
				);
				this.total = res.data.Total;
				this.advTypeList = res.data.pageUtil.list;
			} catch (e) {
				console.log(e);
			}
		},
		checks() {
			var obj = this;
			if (obj.advType.advertisingName == null) {
				obj.$alert('类型名称不能为空！');
				return false;
			}
			if (obj.value == 0) {
				obj.$alert('请选择广告分类');
				return false;
			}
			if (obj.AdVerTiList.commodityId == null) {
				obj.$alert('请输入商品id');
				return false;
			}
			return true;
		},
		async saveadvType() {
			var flag = this.checks();
			if (flag) {
				try {
					let res = await axios.post(
						'/adver/addAdvertisingTypeVO',
						qs.stringify({
							advertisingId: this.advType.advertisingId,
							advertisingName: this.advType.advertisingName,
							usable: this.radio,
							orderByBy: this.advType.orderByBy,
							advertContent: this.advType.advertContent
						})
					);
					this.dialogVisible = false;
					this.advType = {};
					this.$message({
						message: res.data.Msg,
						type: 'success'
					});
					this.getadvTypeList();
				} catch (e) {
					console.log(e);
				}
			}
		},
		deladvType(row) {
			this.addFlag = false;
			this.dialog2Visible = true;
			this.curId = row.advertisingId;
		},
		async handleDel() {
			try {
				let res = await axios.post(
					'/adver/del',
					qs.stringify({
						advertisingId: this.curId
					})
				);
				this.curId = '';
				this.dialog2Visible = false;
				this.$message({
					message: res.data.Msg,
					type: 'success'
				});
				this.getadvTypeList();
			} catch (e) {
				console.log(e);
			}
		},
		editadvType(row) {
			this.advType = row;
			this.dialogVisible = true;
			this.addFlag = false;
		},
		addadvType() {
			this.advType = {orderByBy:0};
			this.dialogVisible = true;
			this.addFlag = true;
		}
	},
	mounted() {
		this.getadvTypeList();
	}
};
</script>

<style scoped></style>
