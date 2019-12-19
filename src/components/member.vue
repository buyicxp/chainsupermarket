<template>
    <div class="app-container">
        <el-form id="pan">
            <div>
                <span>{{ counts }}</span> <br/>
                会员数量总计
            </div>
            <div>
                <span>{{ countNew }}</span> <br/>
                新增会员数
            </div>
        </el-form>
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
            <el-form-item label="用户ID" prop="vipId">
                <el-input
                        v-model="queryParams.vipId"
                        placeholder="输入ID号"
                        clearable
                        size="small"
                        @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="用户昵称" prop="vipMname">
                <el-input
                        v-model="queryParams.vipMname"
                        placeholder="输入昵称"
                        clearable
                        size="small"
                        @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="身份">
                <el-select v-model="queryParams.vipPosition" placeholder="全部" value="" size="small">
                    <el-option  v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                v-model="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="性别">
                <el-select v-model="queryParams.vipSex" placeholder="全部" value="-1" size="small">
                    <el-option v-for="item in option"
                               :key="item.value"
                               :label="item.label"
                               v-model="item.value"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
            <el-form-item label="消费次数" prop="vipNumber">
                <el-input
                        v-model="queryParams.vipNumber"
                        placeholder="输数字"
                        clearable
                        size="small"
                        @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="电话号码" prop="vipPhone">
                <el-input
                        v-model="queryParams.vipPhone"
                        placeholder="输入电话"
                        clearable
                        size="small"
                        @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="时间" prop="vipCreate" size="small">
                <el-date-picker
                        v-model="queryParams.getDates"
                        type="datetimerange"
                        range-separator="至"
                        @change="getDatetimes"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-upload" size="mini"  @click="exportExcel" style="background-color: #F56C6C">全部导出</el-button>
            </el-form-item>
        </el-form>
<!--        <el-form>-->
<!--            <el-form-item>-->
<!--                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>-->
<!--                <el-button icon="el-icon-upload" size="mini"  @click="exportExcel" style="background-color: #F56C6C">全部导出</el-button>-->
<!--            </el-form-item>-->
<!--        </el-form>-->

        <el-table  :data="list" id="out-table">
            <el-table-column label="用户ID" align="center"   prop="vipId" />
            <el-table-column label="头像" :show-overflow-tooltip = "true" width="50">
                　　<template slot-scope="scope">
                　　　　<img :src="scope.row.vipImages"   width="40" height="40" class="head_pic"/>
                　　</template>
            </el-table-column>
            <el-table-column label="昵称" align="center" prop="vipMname" />
            <el-table-column label="身份" align="center" prop="vipPosition" width="80px" />
            <el-table-column label="性别" align="center" prop="vipSex"  :formatter="formatter" width="60px"/>
            <el-table-column label="手机号码" align="center" prop="vipPhone" />
            <el-table-column label="访问时间" align="center" prop="vipCreate" />
            <el-table-column label="结束时间" align="center" prop="vipModified" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            type="text"
                            icon="el-icon-view"
                            @click="handleSelect(scope.$index,scope.row)"
                    >查询</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-size="pageSize"
                layout="total, prev, pager, next"
                background :total="total"
                class="aaa"
        ></el-pagination>

        <!--  编辑窗口  -->
        <el-dialog :title="title"  :visible.sync="open" width="500px">
            会员名称：{{ ss.vipMname }}
            <br/>
            会员卡号：{{ ss.vipCard }}
            <br/>
            详细地址：{{ ss.vipAddress }}
        </el-dialog>
    </div>
</template>

<script>
    import {Ht} from  "../assets/Ht"
    import FileSaver from "file-saver";
    import XLSX from "xlsx";
    export default {
        data(){
            return {
                list: [],
                total: 0,
                pageSize: 5,
                currentPage: 1,
                queryParams: {
                },
                rowIndex: null,
                open: false,
                vipSex: 0,
                options: [{
                    value: '',
                    label: '全部'
                }
                    ,{
                        value: '普通用户',
                        label: '普通用户'
                    }, {
                        value: '会员用户',
                        label: '会员用户'
                    }],
                option:[{
                    value: '-1',
                    label: '全部'
                }
                    ,{
                        value: '1',
                        label: '男'
                    },{
                        value: '2',
                        label: '女'
                    }
                ],
                counts: 0,
                countNew:0,
                ss:{},
                title:'',
                createTime:'',
                endTime:''
            }
        },created() {
            this.showTable(this.currentPage, this.pageSize);
            this.count();
            this.show();
            this.countNewMember();
        },
        methods: {
            handleSizeChange: function (size) {
                this.pageSize = size;
                console.log(this.pageSize); //每页下拉显示数据
                this.showTable(this.currentPage, this.pageSize);
            },
            handleCurrentChange: function (currentPage) {
                this.currentPage = currentPage;
                console.log(this.currentPage); //点击第几页
                this.showTable(this.currentPage, this.pageSize);
            },
            showTable(currentPage, pageSize) {
                this.$axios.post("/listMember.do", this.qs.stringify({
                    currentPage: this.currentPage,
                    pageSize: this.pageSize,
                })).then((response) => {
                    this.list = response.data.list;
                }).catch((error) => {
                    alert(error) //请求失败返回的数据
                })
            },
            count(){
                this.$axios.post("/count.do").then((response) => {
                    this.total = response.data;
                }).catch((error) => {
                    alert(error) //请求失败返回的数据
                })
            },
            countNewMember(){
                this.$axios.post("/countNew.do").then((response) => {
                    this.countNew = response.data;
                }).catch((error) => {
                    alert(error) //请求失败返回的数据
                })
            },
            handleQuery(){

                this.$axios.post("/listMember.do", this.qs.stringify({
                    currentPage: this.currentPage,
                    pageSize: this.pageSize,
                    vipId:this.queryParams.vipId,
                    vipMname:this.queryParams.vipMname,
                    vipPosition:this.queryParams.vipPosition,
                    vipNumber:this.queryParams.vipNumber,
                    vipPhone:this.queryParams.vipPhone,
                    vipSex:this.queryParams.vipSex,
                    vipCreate:this.createTime,
                    vipModified:this.endTime
                })).then((response) => {
                    this.total = response.data.total;
                    this.list = response.data.list;
                }).catch((error) => {
                    alert(error) //请求失败返回的数据
                })
            },
            show(){
                this.$axios.post("/count.do", this.qs.stringify({
                })).then((response) => {
                    this.counts = response.data;
                }).catch((error) => {
                    alert(error) //请求失败返回的数据
                })
            },
            formatter(row, column) {
                return row.vipSex === 1? "男" : "女";
            },
            formSetDate(row) { //修改日期格式
                let date = new Date(row);
                let Y = date.getFullYear() + '-';
                let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) + '-' : date.getMonth() + 1 + '-';
                let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
                let h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
                let m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':';
                let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
                return Y + M + D + h + m + s
            },
            //定义导出Excel表格事件
            exportExcel(){
                    /* 从表生成工作簿对象 */
                    var wb = XLSX.utils.table_to_book(document.querySelector("#out-table"));
                    /* 获取二进制字符串作为输出 */
                    var wbout = XLSX.write(wb, {
                        bookType: "xlsx",
                        bookSST: true,
                        type: "array"
                    });
                    try {
                        FileSaver.saveAs(
                            //Blob 对象表示一个不可变、原始数据的类文件对象。
                            //Blob 表示的不一定是JavaScript原生格式的数据。
                            //File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
                            //返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
                            new Blob([wbout], { type: "application/octet-stream" }),
                            //设置导出文件名称
                            "会员信息.xlsx"
                        );
                    } catch (e) {
                        if (typeof console !== "undefined") console.log(e, wbout);
                    }
                    return wbout;
                },
            handleSelect(index,row){
                this.title = '会员信息';
                this.vipId=row.vipId;
                this.open = true;
                this.rowIndex = index;
                this.$axios.post("/memberId.do?id="+this.vipId).then((response) => {
                    this.ss = response.data;
                }).catch((error) => {
                    alert(error) //请求失败返回的数据
                })
            },
            getDatetimes(con){
                if (con) {
                    this.createTime = this.formSetDate(con[0]);
                    this.endTime = this.formSetDate(con[1]);
                } else {
                    this.createTime = null;
                    this.endTime = null;
                }
            }
        }
    }
</script>

<style scoped>
    #pan div{
        width: 150px;
        height: 65px;
        background-color: black;
        color: #eeeeee;
        float: left;
        line-height:30px;
        margin-left: 60px;
        border-radius: 4px;
        padding-left: 55px;
    }
    #pan{
        width: 1248px;
        height: 90px;
    }
    #pan span {
        margin-left: 40px;
    }
</style>
