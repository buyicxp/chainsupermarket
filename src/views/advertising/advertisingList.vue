<template>
	<div id="app">
		<el-row>
			<el-col :span="1" class="grid"><el-button type="success" @click="addAdVerTiList()" icon="el-icon-circle-plus-outline" round>新增广告</el-button></el-col>
			<div class="serach">
				<el-col :span="18">
					<template>
						<el-select v-model="value" placeholder="广告分类">
							<el-option label="全部" value="0"></el-option>
							<el-option v-for="item in TypeList" :key="item.advertisingId" :label="item.advertisingName" :value="item.advertisingId"></el-option>
						</el-select>
					</template>
				</el-col>
				<el-input placeholder="请输入搜索的词" v-model="AdVerTiList.adVerTiNamei" clearable style="width: 10.625rem;" @clear="getPurchaseList()"></el-input>
				<el-button type="success" @click="getAdVerTiList()" style="display: inline-block;">搜索</el-button>
			</div>
		</el-row>
		<br />
		<el-table :data="AdVerTiListVO" border style="width: 100%" stripe ref="multipleTable" tooltip-effect="dark">
			<el-table-column label="序号" type="index" width="80px" align="center">
				<template slot-scope="scope">
					<span>{{ (page - 1) * size + scope.$index + 1 }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="adVerTiImage" label="广告图标">
				<template slot-scope="scope">
					<img :src="scope.row.adVerTiImage" style="width: 60px;height: 60px;display: block;" />
				</template>
			</el-table-column>
			<el-table-column prop="adVerTiName" label="广告名称" align="center"></el-table-column>
			<el-table-column prop="adVerTiLink" label="广告链接" align="center"></el-table-column>
			<el-table-column prop="usable" label="是否可用" align="center" :formatter="analysis"></el-table-column>
			<el-table-column prop="enteringTime" label="录入时间"></el-table-column>
			<el-table-column prop="type[0].advertisingName" label="广告分类" align="center"></el-table-column>
			<el-table-column label="编辑" width="100">
				<template slot-scope="scope">
					<el-button type="primary" icon="el-icon-edit" size="mini" @click="editAdVerTiList(scope.row)">修改</el-button>
				</template>
			</el-table-column>
			<el-table-column label="删除" width="100">
				<template slot-scope="scope">
					<el-button type="danger" icon="el-icon-delete" size="mini" @click="delAdVerTiList(scope.row)">删除</el-button>
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
		<el-dialog :title="addFlag ? '新增广告' : '修改广告'" style="text-align:left !important" :visible.sync="dialogVisible" :before-close="handleClose">
			<el-form ref="form" label-width="120px" style="display: block;content: 0px;">
				<el-row>
					<el-col :span="8">
						<el-form-item label="广告图标:"><img v-if="imageUrl" :src="imageUrl" style="width: 120px;height: 120px;display: block;" /></el-form-item>
					</el-col>
					<el-col :span="5">
						<el-upload
							class="upload-demo"
							action="https://jsonplaceholder.typicode.com/posts/"
							:on-preview="handlePreview"
							:on-success="handleAvatarSuccess"
							:on-remove="handleRemove"
							:before-remove="beforeRemove"
							multiple
							:file-list="fileList"
						>
							<el-button size="small" type="primary">点击上传</el-button>
							<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
						</el-upload>
					</el-col>
					<el-col :span="8">
						<el-form-item label="广告链接:"><el-input v-model="AdVerTiList.adVerTiLink" style="width:180px"></el-input></el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="8">
						<el-form-item label="广告名称:"><el-input v-model="AdVerTiList.adVerTiName" style="width:138px"></el-input></el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="是否可用:">
							<template>
								<el-radio v-model="radio" label="1">是</el-radio>
								<el-radio v-model="radio" label="2">否</el-radio>
							</template>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="请选择分类:">
							<template>
								<el-select v-model="value" placeholder="广告分类">
									<el-option label="全部" value="0"></el-option>
									<el-option v-for="item in TypeList" :key="item.advertisingId" :label="item.advertisingName" :value="item.advertisingId"></el-option>
								</el-select>
							</template>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="8">
						<el-form-item label="广告排序:"><el-input v-model="AdVerTiList.orderByBy" style="width:80px"></el-input></el-form-item>
					</el-col>
					<el-col :span="15">
						<el-form-item label="选择广告商品:"><el-cascader v-model="values" :options="options" @change="handleChange"></el-cascader></el-form-item>
					</el-col>
				</el-row>
				<el-form-item label="内容:"><el-input v-model="AdVerTiList.advertContent" type="textarea" :rows="4"></el-input></el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="success" @click="saveAdVerTiList()" style="display: inline-block;">保存</el-button>
				<el-button type="primary" @click="dialogVisible = false" style="display: inline-block;">取消</el-button>
			</span>
		</el-dialog>
		<el-dialog title="提示" style="text-align:left !important" :visible.sync="dialog2Visible" :before-close="handleClose">
			<span>你确定要删除这个广告吗?</span>
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
			addFlag: true,
			AdVerTiListVO: [],
			AdVerTiList: {},
			curId: '',
			AdvertisingTypeVO: [],
			AdvertisingType: {},
			radio: '1',
			TypeList: [],
			value: '',
			imageUrl: '',
			file: '',
			fileList: [],
			typename: [],
			values: [],
			options: [
				{
					value: '1',
					label: '全场'
				}
			]
		};
	},
	watch: {
		total() {
			if (this.total == (this.page - 1) * this.size && this.total != 0) {
				this.page -= 1;
				this.getAdVerTiList();
			}
		}
	},
	created() {
		this.getAllGoods();
	},
	methods: {
		//级联转换器中显示范围，商品分类，商品
		getAllGoods() {
			var that = this;
			var url = 'http://localhost:8080/goodschild/findGT';
			// console.log(url)
			this.$axios.post(url).then(res => {
				// console.log(res.data);
				that.options.push({ value: '2', label: '部分商品', children: res.data });
				that.options.push({ value: '3', label: '指定商品', children: res.data });
			});
		},
		handlePreview(file) {
			console.log(file);
		},
		handleAvatarSuccess(res, file) {
			this.imageUrl = URL.createObjectURL(file.raw);
			//图片路径
		},
		handleRemove(file, fileList) {
			(this.imageUrl = ''), console.log(file, fileList);
		},
		beforeRemove(file, fileList) {
			return this.$confirm(`确定移除 ${file.name}？`);
		},
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
			this.getAdVerTiList();
		},
		handleCurrentChange(val) {
			this.page = val;
			this.getAdVerTiList();
		},
		async getAdVerTiList() {
			try {
				if(this.AdVerTiList.adVerTiNamei!=null && this.AdVerTiList.adVerTiNamei.trim()!=''){
					this.page=1
				}
				let res = await axios.post(
					'/adVer/getAdVerTiList',
					qs.stringify({
						index: this.page,
						pageSize: this.size,
						adVerTiName: this.AdVerTiList.adVerTiNamei,
						advertisingTypeId: this.value
					})
				);
				this.total = res.data.Total;
				this.AdVerTiListVO = res.data.pageUtil.list;
				this.TypeList = res.data.list;
			} catch (e) {
				console.log(e);
			}
		},
		checks() {
			var obj = this;
			if (obj.imageUrl == '') {
				obj.$alert('没有上传广告图片！');
				return false;
			}
			if (obj.AdVerTiList.adVerTiLink == null) {
				obj.$alert('广告链接不能为空！');
				return false;
			}
			if (obj.AdVerTiList.adVerTiName == null) {
				obj.$alert('广告名称不能为空！');
				return false;
			}
			if (obj.value == 0) {
				obj.$alert('请选择广告分类');
				return false;
			}
			if (obj.AdVerTiList.orderByBy == 0 && obj.AdVerTiList.orderByBy == '') {
				obj.$alert('请输入广告排序');
				return false;
			}
			if (obj.values[2] == null) {
				obj.$alert('请选择广告商品');
				return false;
			}
			return true;
		},
		async saveAdVerTiList() {
			var flag = this.checks();
			if (flag) {
				try {
					let res = await axios.post(
						'/adVer/save',
						qs.stringify({
							adVerTiListId: this.AdVerTiList.adVerTiListId,
							adVerTiImage: this.imageUrl,
							adVerTiName: this.AdVerTiList.adVerTiName,
							adVerTiLink: this.AdVerTiList.adVerTiLink,
							usable: this.radio,
							orderByBy: this.AdVerTiList.orderByBy,
							advertisingTypeId: this.value,
							commodityId: this.values[2],
							advertContent: this.AdVerTiList.advertContent
						})
					);
					(this.imageUrl = ''), (this.dialogVisible = false);
					this.AdVerTiList = {};
					this.$message({
						message: res.data.Msg,
						type: 'success'
					});
					this.getAdVerTiList();
				} catch (e) {
					console.log(e);
				}
			}
		},
		delAdVerTiList(row) {
			this.addFlag = false;
			this.dialog2Visible = true;
			this.curId = row.adVerTiListId;
		},
		async handleDel() {
			try {
				let res = await axios.post(
					'/adVer/del',
					qs.stringify({
						adVerTiListId: this.curId
					})
				);
				this.value = [];
				this.curId = '';
				this.dialog2Visible = false;
				this.$message({
					message: res.data.Msg,
					type: 'success'
				});
				this.getAdVerTiList();
			} catch (e) {
				console.log(e);
			}
		},
		editAdVerTiList(row) {
			this.AdVerTiList = row;
			this.dialogVisible = true;
			this.addFlag = false;
			this.imageUrl = this.AdVerTiList.adVerTiImage;
			this.fileList = [];
		},
		addAdVerTiList() {
			(this.imageUrl = ''), (this.fileList = []), (this.AdVerTiList = { orderByBy: 0 });
			this.value = [];
			this.dialogVisible = true;
			this.addFlag = true;
		}
	},
	mounted() {
		this.getAdVerTiList();
	}
};
</script>

<style type="text/css">
#app {
	font-family: Helvetica, sans-serif;
	text-align: center;
}
.serach {
	text-align: right;
}
</style>
