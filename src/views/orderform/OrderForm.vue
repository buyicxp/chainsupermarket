<template>
    <div style="text-align:left">
        <p>今日数据</p>
        <div class="box_today_data">
            <label>门店名称：
                <el-select v-model="shop_value">
                    <el-option
                            v-for="item in shop_options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </label>
            <br/>
            <div class="box_black"><br/><span style="font-size:larger;font-weight:bold">{{label_1}}</span><br/>营业金额总计
            </div>
            <div class="box_black"><br/><span style="font-size:larger;font-weight:bold">{{label_2}}</span><br/>优惠金额总计
            </div>
            <div class="box_black"><br/><span style="font-size:larger;font-weight:bold">{{label_3}}</span><br/>新增会员数
            </div>
            <div class="box_black"><br/><span style="font-size:larger;font-weight:bold">{{label_4}}</span><br/>订单数量总计
            </div>
        </div>
        <div style="margin-top:10px">
            <label>
                订单搜索：
                <el-input v-model="id" placeholder="请输入订单号" style="width:190px;display:inline-block" clearable/>
            </label>
            <label>
                <el-input v-model="userId" placeholder="请输入用户ID" style="width:190px;display:inline-block" clearable/>
            </label>
            <el-button style="margin-left:10px" @click="getData" :disabled="isRun">{{timeout_text}}</el-button>
            <label style="margin-left:50px">配送方式：
                <el-select v-model="dis_value">
                    <el-option
                            v-for="item in dis_options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </label>
            <label style="margin-left:10px">
                订单时间：
                <el-date-picker
                        @change="timeSelectedChange"
                        v-model="time"
                        type="datetimerange"
                        :picker-options="timeOptions"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                </el-date-picker>
            </label>
        </div>
        <el-button style="right:154px;top:370px;position:absolute;z-index:2" type="primary" size="mini"
                   @click="downloadExl">
            <i class="el-icon-circle-plus-outline">导出Excel</i>
        </el-button>
        <el-tabs v-model="order_state" @tab-click="handleClick">
            <el-tab-pane label="所有订单" name="所有订单" :disabled="isRun"/>
            <el-tab-pane label="待付款" name="0" :disabled="isRun"/>
            <el-tab-pane label="待发货" name="1" :disabled="isRun"/>
            <el-tab-pane label="已发货" name="2" :disabled="isRun"/>
            <el-tab-pane label="交易完成" name="3" :disabled="isRun"/>
            <el-tab-pane label="退款订单" name="4" :disabled="isRun"/>
            <el-tab-pane label="售后订单" name="5" :disabled="isRun"/>
        </el-tabs>
        <el-dialog title="订单详情" :visible.sync="detailDialogVisible" width="992px">
            <div style="width:960px;height:300px;overflow:auto">
                <el-table
                        ref="multipleTable"
                        :data="detailData"
                        tooltip-effect="dark"
                        style="width:910px"
                        border
                        @selection-change="handleSelectionChange"
                        @row-click="handleRowClick">
                    <el-table-column
                            type="selection"
                            width="40">
                    </el-table-column>
                    <el-table-column
                            prop="goodsId"
                            label="商品ID"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="goodsName"
                            label="商品名称"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="goodsImgUrl"
                            label="商品图标"
                            width="120">
                        <template slot-scope="scope">
                            <el-image :src="scope.row['goodsImgUrl']" referrerpolicy='no-referrer'/>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="conMoney"
                            label="商品价格"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="count"
                            label="商品数量"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            label="合计价格"
                            width="120">
                        <template slot-scope="scope">
                            {{scope.row["conMoney"]*scope.row["count"]}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button
                                    :disabled="scope.row['stat']>1"
                                    size="mini"
                                    plain
                                    @click="">发货
                            </el-button>
                            <el-button
                                    :disabled="scope.row['stat']===0||scope.row['stat']>3"
                                    size="mini"
                                    plain
                                    @click="">退款
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <el-button style="margin-left:800px;margin-top:10px" type="danger" size="medium"
                       :disabled="multipleSelection.length<=0">发货
            </el-button>
            <el-button style="margin-left:5px;margin-top:10px" type="danger" size="medium"
                       :disabled="multipleSelection.length<=0">退款
            </el-button>
            <el-divider/>
            <p>
                <span>配送方式：{{selectRow.dis}}</span>
                <span style="margin-left:50px">预约时间：{{selectRow.time}}</span>
                <span style="font-weight:bold;margin-left:400px">合计支付：{{sum}}元</span>
            </p>
            <p>联系人：{{selectRow.contact}}</p>
            <p>电话：{{selectRow.phone}}</p>
            <span>配送地址：{{selectRow.address}}</span>
            <el-button @click="detailDialogVisible=false" style="right:10px;position:absolute" plain>取消</el-button>
        </el-dialog>
        <el-dialog title="订单信息" :visible.sync="editDialogVisible" width="1080px">
            <div>
                <label style="margin-left:14px">用户ID：
                    <el-input style="width:140px;display:inline-block" readonly/>
                </label>
                <label style="margin-left:54px">订单号：
                    <el-input v-model="editRow['orderId']" style="width:140px;display:inline-block" readonly/>
                </label>
                <label style="margin-left:54px">总金额：
                    <el-input v-model="editData['conMoney']*editData['count']" style="width:140px;display:inline-block"
                              readonly/>
                </label>
            </div>
            <div style="margin-top:20px">
                <label>实际金额：
                    <el-input v-model="editRow['amount']" style="width:140px;display:inline-block"/>
                </label>
                <label style="margin-left:40px">使用积分：
                    <el-input style="width:140px;display:inline-block" readonly/>
                </label>
                <label style="margin-left:40px">回馈积分：
                    <el-input style="width:140px;display:inline-block" readonly/>
                </label>
            </div>
            <div style="margin-top:20px">
                <label>订单状态：
                    <el-select v-model="editOrderState" placeholder="请选择" style="width:140px">
                        <el-option
                                v-for="item in order_state_options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </label>
                <label style="margin-left:40px">支付状态：
                    <el-input v-model="editRow['defray']" style="width:140px;display:inline-block"/>
                </label>
                <label style="margin-left:40px">交货状态：
                    <el-input style="width:140px;display:inline-block" readonly/>
                </label>
            </div>
            <div style="margin-top:20px">
                <label style="margin-left:28px">姓名：
                    <el-input v-model="editData['contact']" style="width:140px;display:inline-block" readonly/>
                </label>
                <label style="margin-left:68px">电话：
                    <el-input v-model="editData['phone']" style="width:190px;display:inline-block" readonly/>
                </label>
                <label style="margin-left:18px">手机：
                    <el-input style="width:140px;display:inline-block" readonly/>
                </label>
            </div>
            <div style="margin-top:20px">
                <label style="margin-left:28px">地区：
                    <el-input style="width:190px;display:inline-block"/>
                    <el-input style="width:140px;display:inline-block"/>
                    <el-input style="width:120px;display:inline-block"/>
                </label>
            </div>
            <div style="margin-top:20px">
                <label style="margin-left:28px">地址：
                    <el-input style="width:422px;display:inline-block"/>
                </label>
                <label style="margin-left:40px">邮编：
                    <el-input style="width:140px;display:inline-block" readonly/>
                </label>
            </div>
            <div style="margin-top:20px">
                <label style="margin-left:28px">物流：
                    <el-input style="width:220px;display:inline-block"/>
                </label>
                <label style="margin-left:40px">物流编号：
                    <el-input style="width:314px;display:inline-block"/>
                </label>
            </div>
            <div style="margin-top:20px">
                <label>下单日期：
                    <el-input v-model="editRow['time']" style="width:220px;display:inline-block" readonly/>
                </label>
            </div>
            <p v-if="editOrderState===4" style="font-weight:bold">退款信息</p>
            <div v-if="editOrderState===4"
                 style="padding: 10px 20px;background-color:#fafafa;border-top:#c3c3c3 2px solid">
                <div style="padding-bottom:10px;border-bottom:#c3c3c3 1px dashed">
                    <span style="font-weight:bold">产品ID：</span>
                    <span>{{editData['goodsId']}}</span>
                    <span style="font-weight:bold;margin-left:100px">购买数量：</span>
                    <span>{{editData['count']}}</span>
                    <span style="font-weight:bold;margin-left:100px">产品价格：</span>
                    <span>{{editData['conMoney']}}</span>
                    <span style="font-weight:bold;margin-left:100px">产品名称：</span>
                    <span>{{editData['goodsName']}}</span>
                </div>
                <div style="padding-top:10px;padding-bottom:10px;border-bottom:#c3c3c3 1px dashed">
                    <span style="font-weight:bold">购买属性：</span>
                </div>
                <div style="padding-top:10px;padding-bottom:10px;border-bottom:#c3c3c3 1px solid">
                    <span style="font-weight:bold">其他：</span>
                </div>
                <div style="padding-top:10px">
                    <span style="font-weight:bold">退款原因：</span>
                    <span style="font-weight:bold;margin-left:300px">退款说明：</span>
                </div>
            </div>
            <div style="margin-top:20px">
                <el-button type="warning" @click="editDialogVisible=false" style="width:120px">保存</el-button>
                <el-button type="primary" @click="editDialogVisible=false" style="width:120px">返回</el-button>
            </div>
        </el-dialog>
        <el-table
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                style="width:1502px"
                border>
            <el-table-column
                    type="selection"
                    width="40">
            </el-table-column>
            <el-table-column
                    prop="orderId"
                    label="订单号"
                    width="220">
            </el-table-column>
            <el-table-column
                    v-if="stat!=='4'"
                    prop="count"
                    label="商品数量"
                    width="120">
            </el-table-column>
            <el-table-column
                    v-if="stat==='4'"
                    prop="name"
                    label="退款商品"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="amount"
                    label="实付金额"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="userName"
                    label="顾客信息"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="contactInformation"
                    label="联系方式"
                    width="160">
            </el-table-column>
            <el-table-column
                    prop="status"
                    label="订单状态"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="defray"
                    label="支付状态"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="dis"
                    label="配送方式"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="time"
                    label="下单时间"
                    width="152">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            type="primary"
                            plain
                            @click="handleDetail(scope.$index, scope.row)">详情
                    </el-button>
                    <el-button
                            size="mini"
                            plain
                            @click="handleEdit(scope.row)">修改
                    </el-button>
                    <el-button
                            :disabled="scope.row['del']!==0"
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.row)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[5,10,15,20]"
                :page-size="size"
                layout="total,sizes,prev,pager,next,jumper"
                :total="dataCount">
        </el-pagination>
    </div>
</template>

<script>
    import * as XLSX from "xlsx";

    Date.prototype.format = function (fmt) {
        const o = {
            "M+": this.getMonth() + 1,//月份
            "d+": this.getDate(),//日
            "h+": this.getHours(),//小时
            "m+": this.getMinutes(),//分
            "s+": this.getSeconds(),//秒
            "q+": Math.floor((this.getMonth() + 3) / 3),//季度
            "S": this.getMilliseconds()//毫秒
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (const k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(
                    RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    };
    export default {
        name: "OrderForm",
        data() {
            return {
                shop_options: [{
                    value: null,
                    label: '全部'
                }],
                shop_value: null,
                dis_options: [{
                    value: null,
                    label: '全部'
                }],
                dis_value: null,
                time: [new Date(0).format("yyyy-MM-dd hh:mm:ss"), new Date().format("yyyy-MM-dd hh:mm:ss")],
                timeOptions: {
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', [new Date().format("yyyy-MM-dd hh:mm:ss"), new Date().format("yyyy-MM-dd hh:mm:ss")]);
                        }
                    }, {
                        text: '近7天',
                        onClick(picker) {
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start.format("yyyy-MM-dd hh:mm:ss"), new Date().format("yyyy-MM-dd hh:mm:ss")]);
                        }
                    }, {
                        text: '近30天',
                        onClick(picker) {
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start.format("yyyy-MM-dd hh:mm:ss"), new Date().format("yyyy-MM-dd hh:mm:ss")]);
                        }
                    }]
                },
                order_state: '所有订单',
                tableData: [],
                multipleSelection: [],
                currentPage: 1,
                size: 5,
                timeout: 0,
                dataCount: 0,
                userId: null,
                stat: null,
                id: null,
                betTime: null,
                andTime: null,
                label_1: 0.0,
                label_2: 0.0,
                label_3: 0,
                label_4: 0,
                timeout_text: "搜索",
                isRun: false,
                detailDialogVisible: false,
                detailData: [],
                selectRow: {
                    address: "",
                    contact: "",
                    phone: "",
                    time: "",
                    dis: ""
                },
                sum: 0,
                editDialogVisible: false,
                editRow: {},
                editOrderState: null,
                order_state_options: [
                    {
                        value: null,
                        label: '全部'
                    },
                    {
                        value: 0,
                        label: '待付款'
                    },
                    {
                        value: 1,
                        label: '待发货'
                    },
                    {
                        value: 2,
                        label: '已发货'
                    },
                    {
                        value: 3,
                        label: '交易完成'
                    },
                    {
                        value: 4,
                        label: '退款订单'
                    },
                    {
                        value: 5,
                        label: '售后订单'
                    }
                ],
                editData: {}
            }
        },
        methods: {
            handleClick() {
                if (this.order_state === "所有订单") {
                    this.stat = null;
                } else {
                    this.stat = this.order_state
                }
                this.currentPage = 1;
                this.getData()
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
                let sum = 0;
                for (let i = 0; i < this.multipleSelection.length; i++) {
                    sum += this.multipleSelection[i]["conMoney"] * this.multipleSelection[i].count
                }
                this.sum = sum
            },
            handleRowClick(row) {
                this.selectRow = row
            },
            handleDetail(index, row) {
                this.getDetailData(row["orderId"])
            },
            handleEdit(row) {
                this.editRow = row;
                this.editOrderState = this.parseOrderState(row["status"]);
                this.$axios({
                    url: '/OrderForm/get',
                    method: 'get',
                    params: {
                        id: row.id
                    }
                }).then(response => {
                    this.editData = response.data.data;
                    this.editDialogVisible = true
                }).catch(error => {
                    console.error(error);
                    this.$message.error("HTTP请求失败")
                });
            },
            handleDelete(row) {
                this.$confirm("订单绝对ID：" + row.id + " 订单号：" + row["orderId"], "是否删除?", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    this.$axios({
                        url: '/bill/getDelMerchandiseOrder',
                        method: 'get',
                        params: {
                            id: row.id
                        }
                    }).then(response => {
                        if (response.data > 0) {
                            this.$message.success("删除成功")
                        } else {
                            this.$message.warning("删除失败或已删除")
                        }
                        row.del = 1
                    }).catch(error => {
                        console.error(error);
                        this.$message.error("HTTP请求失败")
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            handleSizeChange(val) {
                this.size = val;
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getData()
            },
            initData() {
                this.$axios({
                    url: '/Message/listShopName',
                    method: 'get'
                }).then(response => {
                    this.shop_options = [{
                        value: null,
                        label: '全部'
                    }];
                    for (let i = 0; i < response.data.length; i++) {
                        let temp = {
                            value: null,
                            label: ""
                        };
                        temp.value = response.data[i]["spId"];
                        temp.label = response.data[i]["spName"];
                        this.shop_options.push(temp)
                    }
                }).catch(error => {
                    console.error(error);
                    this.$message.error("HTTP请求失败")
                });
                this.$axios({
                    url: '/bill/getFindShopMemberNewCount',
                    method: 'get'
                }).then(response => {
                    this.label_3 = response.data
                }).catch(error => {
                    console.error(error);
                    this.$message.error("HTTP请求失败")
                });
                this.$axios({
                    url: '/bill/getFindShopBillCount',
                    method: 'get'
                }).then(response => {
                    this.label_4 = response.data
                }).catch(error => {
                    console.error(error);
                    this.$message.error("HTTP请求失败")
                });
                this.$axios({
                    url: '/bill/getFindShopBillMoneySum',
                    method: 'get'
                }).then(response => {
                    this.label_1 = response.data
                }).catch(error => {
                    console.error(error);
                    this.$message.error("HTTP请求失败")
                });
                this.$axios({
                    url: '/bill/getFindShopPreference',
                    method: 'get'
                }).then(response => {
                    this.label_2 = response.data
                }).catch(error => {
                    console.error(error);
                    this.$message.error("HTTP请求失败")
                });
            }
            ,
            getData() {
                if (this.timeout <= 0) {
                    this.$axios({
                        url: '/OrderForm/summary',
                        method: 'get',
                        params: {
                            index: (this.currentPage - 1) * this.size,
                            size: this.size,
                            userId: (this.userId + "").trim() === "" ? null : this.userId,
                            stat: this.stat,
                            id: (this.id + "").trim() === "" ? null : this.id,
                            betTime: this.betTime,
                            andTime: this.andTime,
                            shopId: this.shop_value
                        }
                    }).then(response => {
                        if (response.data.code === 200) {
                            this.tableData = response.data.data;
                            this.dataCount = response.data.count;
                            this.$message.success("加载成功");
                        } else {
                            console.error(response);
                            this.$message.error("错误码：" + response.data.code + " 错误提示：" + response.data.msg)
                        }
                    }).catch(error => {
                        console.error(error);
                        this.$message.error("HTTP请求失败")
                    });
                    this.timeout = 3;
                    if (!this.isRun) {
                        this.countDown()
                    }
                }
            },
            getDetailData(id) {
                this.$axios({
                    url: '/OrderForm/detail',
                    method: 'get',
                    params: {
                        id: id
                    }
                }).then(response => {
                    if (response.data.code === 200) {
                        this.detailData = response.data.data;
                        this.detailDialogVisible = true;
                    } else {
                        console.error(response);
                        this.$message.error("错误码：" + response.data.code + " 错误提示：" + response.data.msg)
                    }
                }).catch(error => {
                    console.error(error);
                    this.$message.error("HTTP请求失败")
                });
            },
            timeSelectedChange(con) {
                if (con) {
                    this.betTime = con[0];
                    this.andTime = con[1]
                } else {
                    this.betTime = null;
                    this.andTime = null
                }
            }, downloadExl() {
                const ws = XLSX.utils.json_to_sheet(this.getFormatData());
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
                XLSX.writeFile(wb, new Date().toLocaleString() + "订单数据.xlsx");
            }, getFormatData() {
                let result = [];
                for (let i = 0; i < this.tableData.length; i++) {
                    let res = {};
                    res["订单编号"] = this.tableData[i].id;
                    if (this.stat === "4") {
                        res["退款商品"] = this.tableData[i]["name"];
                    } else {
                        res["商品数量"] = this.tableData[i]["count"];
                    }
                    res["实付金额"] = this.tableData[i]["amount"];
                    res["顾客信息"] = this.tableData[i]["userName"];
                    res["联系方式"] = this.tableData[i]["contactInformation"];
                    res["订单状态"] = this.tableData[i].status;
                    res["支付状态"] = this.tableData[i]["defray"];
                    res["配送方式"] = this.tableData[i]["dis"];
                    res["下单时间"] = this.tableData[i]["time"];
                    result.push(res)
                }
                return result
            }, countDown() {
                if (this.timeout > 0) {
                    this.timeout--;
                    this.timeout_text = this.timeout;
                    this.isRun = true;
                    setTimeout(this.countDown, 1000)
                } else {
                    this.isRun = false;
                    this.timeout_text = "搜索"
                }
            }, parseOrderState(str) {
                for (let i = 0; i < this.order_state_options.length; i++) {
                    if (str === this.order_state_options[i].label) {
                        return this.order_state_options[i].value
                    }
                }
                return null
            }
        },
        mounted() {
            this.initData();
            this.getData()
        }
    }
</script>

<style scoped>
    .box_today_data {
        width: 1143px;
        height: 163px;
        left: 202px;
        top: 125px;
        color: rgba(80, 80, 80, 1);
        background-color: rgba(253, 249, 249, 1);
        border-radius: 10px;
        font-size: 14px;
        line-height: 150%;
        text-align: left;
        padding: 5px;
    }

    .box_black {
        margin: 10px;
        width: 258px;
        height: 79px;
        color: rgb(225, 225, 225);
        background-color: rgba(56, 56, 56, 1);
        border-radius: 6px;
        font-size: 14px;
        line-height: 150%;
        text-align: center;
        display: inline-block;
    }
</style>