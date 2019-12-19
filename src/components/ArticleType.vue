<template>
    <div class="app-container">

        <el-table v-loading="loading" :data="aeticleTypeList" @selection-change="handleSelectionChange">
            <el-table-column label="ID" align="center" prop="artId" />
            <el-table-column label="类别名称" align="center" prop="tcategoryName" />
            <el-table-column label="录入时间" align="center" prop="tcreate" />
            　　<el-table-column label="是否可用"  align="center">
            　　　　　　<template slot-scope="scope">
            　　　　　　　　<el-radio
                　　　　　　　　　　class="radio"
                　　　　　　　　　　v-model="scope.row.artJudge==1?fales:true"
                　　　　　　　　　　:disabled="false">
            　　　　　　　　&nbsp;</el-radio>
            　　　　　　</template>
            　　　　</el-table-column>

            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            type="text"
                            icon="el-icon-edit"
                            @click="copyText(scope.row.tcategoryName)"
                    >复制</el-button>
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
                aeticleTypeList: [],
                total: 0,
                pageSize: 3,
                currentPage: 1,
                iconFormVisible: false,
                rowIndex: null,
                addiconFormVisible: false,
            }
        },created() {
            this.showTable(this.currentPage, this.pageSize);
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
                this.$axios.post("/pageInfoArticleType.do", this.qs.stringify({
                    currentPage: this.currentPage,
                    pageSize: this.pageSize
                })).then((response) => {
                    this.aeticleTypeList = response.data.list;
                    this.total = response.data.total;
                }).catch((error) => {
                    alert(error) //请求失败返回的数据
                })
            }, copyText(tcategoryName) {
                const input = document.createElement('input')
                document.body.appendChild(input)
                input.setAttribute('value',tcategoryName)
                input.select()
                if (document.execCommand('copy')) {
                    document.execCommand('copy')
                }
                document.body.removeChild(input)
                this.$message({
                    type: 'success',
                    message: '复制成功!'
                });
            }
        }
    }
</script>

<style>

</style>