<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="6"><div class="grid-content bg-purple">
                <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addInsert">新增评论</el-button>
                <el-button @click="delAll" icon="el-icon-delete">删除</el-button>
            </div></el-col>
            <el-col :span="12" :offset="6"><div class="grid-content bg-purple">
                <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
                    <el-form-item label="">
                        <el-select v-model="queryParams.all" placeholder="请选择" value="" size="small">
                            <el-option  v-for="item in opt"
                                        :key="item.value"
                                        :label="item.label"
                                        v-model="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="">
                        <el-input
                                v-model="queryParams.alls"
                                placeholder="请输入搜索条件"
                                clearable
                                size="small"
                                @keyup.enter.native="handleQuery"
                        />
                    </el-form-item>
                    <el-button @click="handleQuery">搜索</el-button>
                </el-form>
            </div></el-col>
        </el-row>
        <el-table  :data="list" id="out-table" v-loading="loading"
                   element-loading-text="拼命加载中"
                   element-loading-spinner="el-icon-loading"
                   element-loading-background="rgba(0, 0, 0, 0.8)"
                   @selection-change="handleSelectionChange">
            <el-table-column label="全部" type="selection" width="55" align="center" />
            <el-table-column label="头像" :show-overflow-tooltip = "true" width="50">
                　　<template slot-scope="scope">
                　　　　<img :src="scope.row.vipImages"   width="40" height="40" class="head_pic"/>
                　　</template>
            </el-table-column>
            <el-table-column label="昵称" align="center" prop="vipMname" width="80px"/>
            <el-table-column label="类型" align="center" prop="comoType" width="80px" />
            <el-table-column label="星级" align="center" prop="starred"   width="60px"/>
            <el-table-column label="评论类容" align="center" prop="commentContent" />
            <el-table-column label="管理员回复" align="center" prop="replyContent" />
            <el-table-column label="录入时间" align="center" prop="create" />
            <el-table-column label="状态" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            type="info" round
                            disabled
                    >推荐</el-button>
                    <el-button
                            size="mini"
                            type="primary" round
                            disabled
                    >可用</el-button>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            round
                            @click="handleUpdate(scope.row)"
                    >修改</el-button>
                    <el-button
                            size="mini"
                            round
                            @click="handleDelete(scope.$index,scope.row)"
                    >删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow" >确 定</el-button>
            </span>
        </el-dialog>

        <!--分页-->
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-size="pageSize"
                layout="total, prev, pager, next"
                background :total="total"
                class="aaa"
        ></el-pagination>

        <!-- 修改角色信息对话框 -->
        <el-dialog :title="title"  :visible.sync="open" width="550px">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="用户名称" prop="vipMname"  >
                    <el-input v-model="form.vipMname"  disabled />
                </el-form-item>
                <el-form-item label="类型" prop="comoType" >
                    <el-input v-model="form.comoType" disabled/>
                </el-form-item>
                <el-form-item label="星级" prop="starred" >
                    <el-input v-model="form.starred" disabled/>
                </el-form-item>
                <el-form-item label="评论类容" prop="commentContent" >
                    <el-input v-model="form.commentContent" disabled/>
                </el-form-item>
                <el-form-item label="管员回复" prop="replyContent" >
                    <el-input v-model="form.replyContent" type="textarea" />
                </el-form-item>
                <el-form-item label="录入时间" prop="create" >
                    <el-input v-model="form.create" disabled/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" >
                    <el-button type="primary" @click="submitForm">确 定</el-button>
                    <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                opt:[{
                    value: '',
                    label: '全部'
                },
                    {
                        value:'vipMname',
                        label:'名称'
                    },
                    {
                        value:'comoType',
                        label:'评论类型'
                    },
                    {
                        value:'starred',
                        label:'星级'
                    },
                    {
                        value:'create',
                        label:'录入时间'
                    }
                ],
                queryParams:{},
                list: [],
                total: 0,
                pageSize: 5,
                currentPage: 1,
                loading:true,
                title:'修改',
                delVisible:false,
                form:{},
                msg:"",//记录每一条的信息，便于取id
                ids:[],//存放删除的数据
                multipleSelection:[],//多选的数据
                open:false
            }
        },
        created(){
            this.showTable(this.currentPage, this.pageSize);
        },
        methods:{
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
                this.$axios.post("/selectCommonalitys.do", this.qs.stringify({
                    currentPage: this.currentPage,
                    pageSize: this.pageSize,
                })).then((response) => {
                    this.total = response.data.total;
                    this.list = response.data.list;
                    this.loading = false;
                }).catch((error) => {
                    alert(error) //请求失败返回的数据
                })
            },
            handleQuery(){
                this.$axios.post("/selectCommonalitys.do", this.qs.stringify({
                    currentPage: this.currentPage,
                    pageSize: this.pageSize,
                    all:this.queryParams.all,
                    alls:this.queryParams.alls
                })).then((response) => {
                    this.total = response.data.total;
                    this.list = response.data.list;
                    this.loading = false;
                }).catch((error) => {
                    alert(error) //请求失败返回的数据
                })
            },
            handleUpdate(row){
                this.title = '会员评论信息';
                this.id=row.id;
                this.open = true;
                this.$axios.post("/commonalitys.do?id="+this.id).then((response) => {
                    this.form = response.data;
                }).catch((error) => {
                    alert(error) //请求失败返回的数据
                })
            },
            cancel(){
                this.open = false;
            },
            submitForm(){
                this.$axios.post("/update.do", this.qs.stringify({
                    id:this.form.id,
                    replyContent:this.form.replyContent
                })).then((response) => {
                    var res = response.data;
                    if(res > 0){
                        this.$message({
                            message: '修改成功!'
                        });
                        this.open = false;
                        this.showTable();
                    }else {
                        this.$message({
                            message: '修改失败!'
                        });
                    }
                }).catch((error) => {
                    alert(error) //请求失败返回的数据
                })
            },
            //  多选数据
            handleSelectionChange(selection){
                this.multipleSelection = selection;
            },
            //单行删除
            handleDelete(index, row) {
                this.idx = index;
                this.msg=row;//每一条数据的记录
                this.ids.push(this.msg.id);//把单行删除的每条数据的id添加进放删除数据的数组
                this.delVisible = true;
            },
            //批量删除
            delAll() {
                this.delVisible = true;//显示删除弹框
                const length = this.multipleSelection.length;
                for (let i = 0; i < length; i++) {
                    this.ids.push(this.multipleSelection[i].id)
                }
            },
            // 确定删除
            deleteRow() {
                    this.$axios.post("/deleteIds.do?ids="+this.ids).then((response) => {
                        if(response.data == "删除成功"){
                            this.showTable();
                            this.$message.success('删除成功')
                        }
                    }).catch((error) => {
                        console.log(error);
                        this.$message.error('删除失败')
                    });
                    this.delVisible = false;//关闭删除提示模态框
                }
        }
    }
</script>

<style scoped>
    .el-row {
        margin-bottom: 20px;
    }
    :last-child {
         margin-bottom: 0;
     }
    .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }
    .row-bg {
        padding: 10px 0;
        background-color: #f9fafc;
    }
</style>