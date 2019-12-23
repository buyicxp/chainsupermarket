<template>
	<div>
		<el-table :data="tableData" style="width: 100%">
			<el-table-column prop="discountCoupon.couponId" label="优惠券编号" width="100"></el-table-column>
			<el-table-column prop="discountCoupon.couponName" label="优惠券名称" width="180"></el-table-column>
			<el-table-column prop="userInfo.userName" label="用户姓名" width="180"></el-table-column>
			<el-table-column prop="drawTime" label="领取时间"></el-table-column>
		</el-table>
		<el-pagination
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
			:current-page="page.index"
			:page-sizes="5"
			:page-size="page.size"
			layout="total, sizes, prev, pager, next, jumper"
			:total="page.total"
		></el-pagination>
	</div>
	<!--<div class="block">-->
	<!--<el-pagination-->
	<!--@size-change="handleSizeChange"-->
	<!--@current-change="handleCurrentChange"-->
	<!--:current-page="currentPage4"-->
	<!--:page-sizes="[100, 200, 300, 400]"-->
	<!--:page-size="100"-->
	<!--layout="total, sizes, prev, pager, next, jumper"-->
	<!--:total="400">-->
	<!--</el-pagination>-->
	<!--</div>-->
</template>

<script>
export default {
	name: 'CouponCollectionInfo',
	data() {
		return {
			tableData: [],
			currentPage4: 4,
			page: {
				size: 4,
				index: 1,
				total: 0
			}
		};
	},
	created() {
		this.selectAll();
	},
	methods: {
		//查询领取记录
		selectAll() {
			console.log('查询有领取记录');
			var that = this;
			let url = 'http://localhost:8080/discount/selectUserAll?couponId=' + that.$route.query.couponId + '&pageNum=' + that.page.index + '&pageSize=' + that.page.size;
			that.$axios
				.post(url)
				.then(res => {
					that.tableData = res.data.list;
					this.page.total = res.data.total;
					console.log(res.data);
				})
				.catch(function(error) {
					console.log(error);
				});
		},
		handleSizeChange(val) {
			console.log(`每页 ${val} 条`);
		},
		handleCurrentChange(val) {
			console.log(`当前页: ${val}`);
			this.page.index = val;
			this.selectAll();
		}
	}
};
</script>

<style scoped></style>
