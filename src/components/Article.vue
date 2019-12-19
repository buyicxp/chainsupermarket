<template>
    <div class="app-container">

        <el-form :inline="true" :model="listArticleType" class="demo-form-inline" >
            <el-form-item label="咨询名称">
                <el-input v-model="listArticleType.artName" placeholder="请输入咨询名称"></el-input>
            </el-form-item>

            <el-form-item label="所属分类">
                <el-select v-model="listArticleType.artId" placeholder="请选择">
                    <el-option label="全部" value="0" >全部</el-option>
                    <el-option
                            v-for="item in listArticleType"
                            :key="item.artId"
                            :label="item.tcategoryName"
                            :value="item.artId">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="listArticleMhcx(listArticleType.artName,listArticleType.artId)">查询</el-button>
            </el-form-item>
        </el-form>

        <el-table v-loading="loading" :data="aeticleList" @selection-change="handleSelectionChange">
            <el-table-column label="ID" align="center" prop="artId" />
            <el-table-column label="头像" :show-overflow-tooltip = "true" width="50">
                　　<template slot-scope="scope">
                　　　　<img :src="scope.row.artImages"   width="40" height="40" class="head_pic"/>
                　　</template>
            </el-table-column>

            <el-table-column label="咨询名称" align="center" prop="artName" />
            <el-table-column label="所属分类" align="center" prop="articleType.tcategoryName" />

            　　<el-table-column label="是否可用"  align="center">
            　　　　　　<template slot-scope="scope">
            　　　　　　　　<el-radio
                　　　　　　　　　　class="radio"
                　　　　　　　　　　v-model="scope.row.artJudge==1?fales:true"
                　　　　　　　　　　:disabled="false">
            　　　　　　　　&nbsp;</el-radio>
            　　　　　　</template>
            　　　　</el-table-column>
            <el-table-column label="排序" align="center" prop="artSort" />
            <el-table-column label="录入时间" align="center" prop="artCreate" />

            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            type="text"
                            icon="el-icon-edit"
                            @click="copyText(scope.row.artName)"
                    >复制</el-button>
                    <el-button
                            size="mini"
                            type="text"
                            icon="el-icon-delete"
                            @click="removeArticle(scope.row.artId)"
                    >删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 paging -->
        <!--:page-size表示每页显示的数据条数；
            :total：表示总的数据数量；
            :page-sizes：表示我们可以自定义每页显示的数量；
            :currentPage:表示当前的页码；
            @size-change="handleSizeChange"，@current-change="handleCurrentChange" 是el-pagination中的事件，表示每页显示的数据和页码的变化；
            layout:表示分页栏的布局;
            background:表示是否带背景色-->
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-size="pageSize"
                layout="total, prev, pager, next"
                background :total="total">
        </el-pagination>

    </div>
</template>

<script>
    export default {
        data(){
            return {
                aeticleList: [],
                listArticleType:{
                    artId:'',
                    tcategoryName:'',
                    artName:''
                },
                total: 0,
                pageSize: 3,
                currentPage: 1,
                iconFormVisible: false,
                rowIndex: null,
                addiconFormVisible: false,
            }
        },created() {
            this.showTable(this.currentPage, this.pageSize);
            this.listArticleTypeFl();
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
                this.$axios.post("/pageInfoArticle.do", this.qs.stringify({
                    currentPage: this.currentPage,
                    pageSize: this.pageSize
                })).then((response) => {
                    this.aeticleList = response.data.list;
                    this.total = response.data.total;
                }).catch((error) => {
                    alert(error) //请求失败返回的数据
                })
            }, copyText(artName) {
                const input = document.createElement('input')
                document.body.appendChild(input)
                input.setAttribute('value',artName)
                input.select()
                if (document.execCommand('copy')) {
                    document.execCommand('copy')
                }
                document.body.removeChild(input)
                this.$message({
                    type: 'success',
                    message: '复制成功!'
                });
            },listArticleTypeFl(){
                this.$axios.post("/listAtricleType.do", this.qs.stringify({
                })).then((response) => {
                    this.listArticleType = response.data;
                }).catch((error) => {
                    alert(error) //请求失败返回的数据
                })
            },listArticleMhcx(artName,artId){
                this.$axios.post("/pageInfoArticle.do", this.qs.stringify({
                    currentPage:1 ,
                    pageSize: 3,
                    artName:artName,
                    artId:artId
                })).then((response) => {
                    this.aeticleList = response.data.list;
                    this.total = response.data.total;
                }).catch((error) => {
                    alert(error) //请求失败返回的数据
                })
            },removeArticle(artId) {
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post("/deleteArticle.do", this.qs.stringify({
                        artId:artId
                    })).then((response) => {
                       let artId = response.data;
                        if(artId==1){
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.showTable(1,3);
                        }else{
                            this.$message({
                                type: 'info',
                                message: '删除失败'
                            });
                        }
                    }).catch((error) => {
                        alert(error) //请求失败返回的数据
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }
        }
    }
</script>

<style>

</style>