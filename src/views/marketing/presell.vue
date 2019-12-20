<template>
	<div id="app">
		<el-row>
			<el-col :span="1" class="grid"><el-button type="success" @click="addPurchase()" icon="el-icon-circle-plus-outline" round>新增团购</el-button></el-col>
			<div class="serach">
				<el-input placeholder="请输入搜索的词" v-model="Purchase.advanceNames" clearable style="width: 10.625rem;" @clear="getPurchaseList()"></el-input>
				<el-button type="success" @click="getPurchaseList" style="display: inline-block;">搜索</el-button>
			</div>
		</el-row>
		<br />
		<el-table :data="PurchaseList" border style="width: 100%" stripe ref="multipleTable" tooltip-effect="dark">
			<el-table-column label="序号" prop="advanceId" width="80px" align="center"></el-table-column>
			<el-table-column prop="advanceName" label="活动名称"></el-table-column>
			<el-table-column label="活动时长" width="250px">
				<template slot-scope="scope">
					<span>{{ scope.row.preSaleStartTime | formatDate }}</span>
					至
					<span>{{ scope.row.preSaleEndTime | formatDate }}</span>
				</template>
			</el-table-column>
			<el-table-column label="出货时间" width="170px">
				<template slot-scope="scope">
					<span>{{ scope.row.advanceTime | formatDate }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="advanceStatus" label="活动状态" :formatter="analysis"></el-table-column>
			<el-table-column label="创建时间" width="170px">
				<template slot-scope="scope">
					<span>{{ scope.row.gmtCreate | formatDate }}</span>
				</template>
			</el-table-column>
			<el-table-column label="修改时间" width="170px">
				<template slot-scope="scope">
					<span>{{ scope.row.gmtModified | formatDate }}</span>
				</template>
			</el-table-column>
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
						<el-form-item label="活动名称:"><el-input v-model="Purchase.advanceName" style="width:138px"></el-input></el-form-item>
					</el-col>
				</el-row>
				<template>
					<div class="block">
						<el-form-item label="活动时间:">
							<el-date-picker
								v-model="Purchase.preSaleStartTime"
								type="datetime"
								format="yyyy-MM-dd HH:mm:ss"
								value-format="yyyy-MM-dd HH:mm:ss"
								placeholder="选择日期"
							></el-date-picker>
							至
							<el-date-picker
								v-model="Purchase.preSaleEndTime"
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
						<el-form-item label="发货时间">
							<el-date-picker
								v-model="Purchase.advanceTime"
								type="datetime"
								format="yyyy-MM-dd HH:mm:ss"
								value-format="yyyy-MM-dd HH:mm:ss"
								placeholder="选择日期"
							></el-date-picker>
						</el-form-item>
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
				<el-button @click="handleDel()">提交</el-button>
				<el-button type="primary" @click="dialog2Visible = false">取消</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import axios from 'axios';
import myFormateDate from '../../assets/js/Date';
import qs from 'qs';
export default {
	data() {
		return {
			dialogVisible: false,
			dialog2Visible: false,
			total: 0,
			size: 5,
			page: 1,
			PurchaseList: [],
			Purchase: {},
			addFlag: true,
			curId: '',
			listData: [],
			value: []
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
			if (row.advanceStatus == '1') {
				return '活动正在进行中';
			} else if (row.advanceStatus == '0') {
				return '活动已失效';
			} else {
				return '--';
			}
		},
		analysiss(row) {
			return row.validHours + '小时';
		},
		handleClose(done) {
			done();
		},
		handleSizeChange(val) {
			this.size = val;
			this.getPurchaseList();
		},
		handleCurrentChange(val) {
			this.page = val;
			this.getPurchaseList();
		},
		async getPurchaseList() {
			try {
				let res = await axios.post(
					'/marketing/pageBrand',
					qs.stringify({
						start: this.page,
						pageSize: this.size,
						advanceName: this.Purchase.advanceNames
					})
				);
				this.total = res.data.total;
				this.PurchaseList = res.data.message;
			} catch (e) {
				console.log(e);
			}
		},
		async savePurchase() {
			try {
				if (this.addFlag) {
					let res = await axios.post(
						'/marketing/BrandInsertUpdate',
						qs.stringify({
							advanceName: this.Purchase.advanceName,
							advanceTime: this.Purchase.advanceTime,
							preSaleStartTime: this.Purchase.preSaleStartTime,
							preSaleEndTime: this.Purchase.preSaleEndTime,
							lists: this.value.join()
						})
					);
					this.dialogVisible = false;
					this.Purchase = {};
					this.$message({
						message: res.data.Msg,
						type: 'success'
					});
				} else {
					let res = await axios.post(
						'/marketing/updateSaleActivities',
						qs.stringify({
							advanceId: this.Purchase.advanceId,
							advanceName: this.Purchase.advanceName,
							advanceTime: this.Purchase.advanceTime,
							preSaleStartTime: this.Purchase.preSaleStartTime,
							preSaleEndTime: this.Purchase.preSaleEndTime,
							lists: this.value.join()
						})
					);

					this.dialogVisible = false;
					this.Purchase = {};
					this.$message({
						message: res.data.Msg,
						type: 'success'
					});
				}
				this.getPurchaseList();
			} catch (e) {
				console.log(e);
			}
		},
		delPurchase(row) {
			this.addFlag = false;
			this.dialog2Visible = true;
			this.curId = row.advanceId;
		},
		async handleDel() {
			try {
				let res = await axios.post(
					'/marketing/shagnchu',
					qs.stringify({
						id: this.curId
					})
				);
				this.curId = '';
				this.dialog2Visible = false;
				this.$message({
					message: res.data.Msg,
					type: 'success'
				});
				this.getPurchaseList();
			} catch (e) {
				console.log(e);
			}
		},
		editPurchase(row) {
			this.Purchase = row;
			let strNum = [];
			let str = this.Purchase.storeId.split(',');
			for (let i = 0; i < str.length; i++) {
				strNum.push(parseInt(str[i]));
			}
			this.value = strNum;
			this.dialogVisible = true;
			this.addFlag = false;
		},
		addPurchase() {
			this.Purchase = {};
			this.value = [];
			this.dialogVisible = true;
			this.addFlag = true;
		},
		generateData() {
			var data = [];
			axios.get('/marketing/mendian').then(({ data: result }) => {
				let list = result.message;
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
	filters: {
		formatDate(time) {
			let date = new Date(time);
			return myFormateDate.dateFormat(date, 'yyyy-MM-dd hh:mm:ss');
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
