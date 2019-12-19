<template>
	<div class="form">
		<el-form ref="form" label-width="120px" style="display: block;content: 0px;">
			<el-row>
				<el-form-item label="广告类型:"><el-input style="width:200px" v-model="advType.advertisingName"></el-input></el-form-item>
				<el-form-item label="是否可用:" >
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
			<el-button type="success" @click="savePurchase()" style="display: inline-block;">保存</el-button>
			<el-button type="primary" @click="dialogVisible = false" style="display: inline-block;">取消</el-button>
		</span>
	</div>
</template>

<script>
import axios from 'axios';
import qs from 'qs';
export default {
	data() {
		return {
			radio: '1',
			dialogVisible: false,
			addFlag: true,
			advType: {},
		};
	},
	methods: {
		async savePurchase() {
			try {
				let res = await axios.post(
					'/adver/addAdvertisingTypeVO',
					qs.stringify({
						advertisingName: this.advType.advertisingName,
						usable: this.radio,
						orderByBy: this.advType.orderByBy,
						advertContent: this.advType.advertContent,
					})
				);
				this.dialogVisible = false;
				this.advType = {};
				this.$message({
					message: res.data.Msg,
					type: 'success'
				});
				this.getPurchaseList();
			} catch (e) {
				console.log(e);
			}
		},
	}
};
</script>

<style scoped>
.form {
	text-align: left;
}
</style>
