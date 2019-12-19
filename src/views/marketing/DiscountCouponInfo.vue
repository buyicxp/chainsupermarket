<template>
 <div>
        <div class="tou">
            <el-button type="primary" @click="add()" icon="el-icon-edit">新增优惠券</el-button>
            <el-button type="danger" icon="el-icon-delete">删除</el-button>
        </div>
        <div class="table">
            <el-table
                    :data="tableData"
                    style="width: 100%">
                <el-table-column
                        label="ID"
                        width="50">
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{ scope.row.coupon.couponId }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="优惠券名称"
                        width="130">
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{ scope.row.coupon.couponName }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="优惠券类型"
                        width="100">
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{ scope.row.coupon.couponType.couponTypeName }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="优惠券金额"
                        width="100">
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{ scope.row.coupon.faceValue }}元</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="发放形式"
                        width="90">
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{ scope.row.coupon.distributionType.distributionName}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="发放总量"
                        width="90">
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{ scope.row.coupon.paymentAmount}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="起止时间"
                        width="105">
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{ scope.row.coupon.begintime}}{{ scope.row.coupon.endtime}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="发放限制"
                        width="100">
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{ scope.row.coupon.limitGet}}张/人</span>
                    </template>
                </el-table-column>

                <el-table-column
                        label="已领取"
                        width="70">
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{ scope.row.count }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                                size="mini"
                                type="warning"
                                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button
                            size="mini"
                            type="warning"
                            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        <el-button
                                size="mini"
                                type="warning">领取记录</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
 </div>
</template>

<script>
    export default {
        name: "DiscountCouponInfo",
        data() {
            return {
                //展示数据集合
                tableData: [],
                //优惠券集合
                coupons:[],
                count:0,
            }
        },
        created(){
            //查询所有优惠券
            this.find()
        },
        methods: {
            //跳转到添加页面
            add(){
                this.$router.replace('/AddDsicountCoupon')
            },
            //修改事件
            handleEdit(index, row) {
                console.log(index, row);
                localStorage.setItem('discountcoupon', row.coupon.couponId);
                this.$router.replace('/AddDsicountCoupon')
            },
            //删除事件
            handleDelete(index, row) {
                console.log(index, row);
                var that = this
                that.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let url = 'http://localhost:8080/discount/deldiscountcoupon'
                        console.log(row.coupon.couponId)
                        console.log(url)
                        that.$axios.get(url,{
                            params:{
                                couponId:row.coupon.couponId,
                            }}).then((response) => {
                            if(response.data=='修改失败'){
                                this.$message({
                                    type: 'success',
                                    message: '删除失败!'
                                });
                            }else{
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                                that.find()
                                console.log('1234556')
                            }
                        }).catch(function (error) {
                            console.log(error)
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                //刷新优惠券

            },
            //加载方法 ，查询所有优惠券
            find(){
                var that = this
                that.tableData=[]
                let url = 'http://localhost:8080/discount/findByAll'
                // console.log(url)
                this.$axios.get(url).then((response) => {
                    that.coupon = response.data
                    this.coupon.forEach(coupon => {
                        //转换时间格式
                        coupon.begintime=that.dateFormat(coupon.begintime)
                        coupon.endtime = that.dateFormat(coupon.endtime)

                        let urlone ='http://localhost:8080/discount/count?couponId='+coupon.couponId
                        //查询每张优惠券已领取多少
                        that.$axios.get(urlone).then((response) =>{
                            that.tableData.push({'coupon':coupon,'count':coupon.paymentAmount-response.data,})
                        })
                    })
                })
            },
            //转时间
            dateFormat:function(time) {
                var date=new Date(time);
                var year=date.getFullYear();
                /* 在日期格式中，月份是从0开始的，因此要加0
                 * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
                 * */
                var month= date.getMonth()+1<10 ? "0"+(date.getMonth()+1) : date.getMonth()+1;
                var day=date.getDate()<10 ? "0"+date.getDate() : date.getDate();
                var hours=date.getHours()<10 ? "0"+date.getHours() : date.getHours();
                var minutes=date.getMinutes()<10 ? "0"+date.getMinutes() : date.getMinutes();
                var seconds=date.getSeconds()<10 ? "0"+date.getSeconds() : date.getSeconds();
                // 拼接
                return year+"-"+month+"-"+day;
            }

         }
    }
</script>

<style scoped>
    .tou{
        text-align: left;
    }
</style>
