<template>
    <div>

        <el-main>
            <div class="div_btn">
            <el-button type="danger" size="small" @click="$router.replace('/addGoods')">添加产品</el-button>
<!--                <el-button type="info" size="small" @click="add">Excl批量增加</el-button>-->
                <el-button type="info" size="small" @click="removerow">批量删除</el-button>
                <div class="div_form" style="display: inline-block">
                <el-form :inline="true" :model="commodity" class="demo-form-inline">
                    <el-form-item>
                        <el-select v-model="initial" size="small" placeholder="全部分类">
                            <el-option placeholder="全部分类" label="全部分类" value=""></el-option>
                            <el-option v-for="item in type" :key="item.id" :label="item.typename" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-input size="small" v-model="commodity.goodsName"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" @click="selectCommodity">搜索</el-button>
                    </el-form-item>
                </el-form>
                </div>
            </div>
            <el-table :data="list"
                      ref="multipleTable"
                      tooltip-effect="dark"
                      style="width: 100%"
                      @selection-change="selectionchange">
                <el-table-column type="selection" width="55" fixed>
                </el-table-column>
                <el-table-column prop="id" label="产品ID" width="150" fixed>
                </el-table-column>
                <el-table-column prop="picturepath" label="图标" width="150">
                      <template slot-scope="scope">
                        <img :src="scope.row.picturepath" style="width: 100px;height: 100px;display: block;"/>
                      </template>
                </el-table-column>
                <el-table-column prop="goodsName" label="标题" width="150">
                </el-table-column>
                <el-table-column prop="typeName" label="所属分类" width="150">
                </el-table-column>
                <el-table-column prop="goodsCode" label="商品码" width="150">
                </el-table-column>
                <el-table-column prop="createdate" label="创建时间" width="160">
                    <template slot-scope="scope">
                        <p>{{scope.row.createdate | formatDate  }}</p>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="230" fixed="right">
                    <template scope="scope">
                        <el-button ref="releaseStatus" type="warning" size="mini" @click="downCom(scope.$index, scope.row)">{{scope.row.upperDown==0 ? '下架' : '上架'}}</el-button>
                        <el-button type="primary" size="mini" @click="handleEdit(scope.$index, scope.row)">详情</el-button>
                        <el-button type="danger" size="mini" @click="delCommodity(scope.$index, scope.row)">删除</el-button>
                        <!-- scope.row代表当前对应行 -->
                    </template>
                </el-table-column>
            </el-table>
        </el-main>

        <!-- 弹窗  -->
        <el-dialog title="商品详情" width="50%" :visible.sync="iconFormVisible">
            <el-form :inline="true" :model="commodity" class="demo-form-inline">
                <el-form-item label="商品标题">
                    <el-input v-model="commodity.goodsName" readonly="readonly"></el-input>
                </el-form-item>
                <el-form-item label="录入日期">
                        <el-date-picker
                                v-model="commodity.createdate"
                                type="date"
                                placeholder="选择日期"
                        >
                        </el-date-picker>
                </el-form-item>
                <el-form-item label="所属分类">
                    <el-input v-model="commodity.typeName" readonly="readonly"></el-input>
                </el-form-item>
                <el-form-item label="商品编码">
                    <el-input v-model="commodity.goodsCode" readonly="readonly"></el-input>
                </el-form-item>
                <el-form-item label="零售价格">
                    <el-input v-model="commodity.price" readonly="readonly"></el-input>
                </el-form-item>
                <el-form-item label="商品重量">
                    <el-input v-model="commodity.weight" readonly="readonly"></el-input>
                </el-form-item>
                <el-form-item label="图片">
                    <img :src="commodity.picturepath" style="width: 100px;height: 100px;"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="close()">确 定</el-button>
            </div>
        </el-dialog>

        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-size="pageSize"
                layout="total, prev, pager, next"
                background
                :total="total"
        ></el-pagination>
    </div>
</template>

<script>
    import myFormateDate from "../../assets/js/Date";
    export default {
        data() {
            return {
                list: [],
                total: 0,
                pageSize: 3,
                currentPage: 1,
                iconFormVisible: false,
                commodity: {},
                isList: [],
                rowIndex: null,
                initial:'',
                type:[]
            }
        },
        created() {
            this.showTable(this.currentPage, this.pageSize);
            this.count();
            this.getType();
            this.showTable1();
        },
        methods: {
            handleSizeChange: function (size) {
                this.pageSize = size;
                console.log(this.pageSize);  //每页下拉显示数据
                this.showTable(this.currentPage, this.pageSize);
            },
            handleCurrentChange: function (currentPage) {
                this.currentPage = currentPage;
                console.log(this.currentPage);  //点击第几页
                this.showTable(this.currentPage, this.pageSize);

            },
            showTable(currentPage, pageSize) {
                // this.listLoading = true;
                this.$axios.post('/commodity/pageCommodity',
                    this.qs.stringify({
                        start: this.currentPage,
                        pageSize: this.pageSize
                    })).then(result => {
                    console.log(result);
                    if (result.data.status === 200) {
                        this.list = result.data.message;
                    } else {
                        alert("获取数据失败");
                    }
                })
            },
            count() {
                this.$axios.post('/commodity/count').then(result => {
                    this.total = result.data;
                }).catch((error) => {
                    alert(error)
                })
            },
            delCommodity(index, row) {
                this.$confirm(`确定删除${row.goodsTitle}吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error',
                }).then(() => {
                    this.list.splice(index, 1); //删除当前list对象
                    this.$axios.post('/commodity/delCommodity', this.qs.stringify({"id": row.id})).then(result => {
                        if (result.data === true) {
                            alert("删除成功");
                            this.showTable(this.currentPage, this.pageSize);
                            this.count()
                        } else {
                            alert("删除失败");
                        }
                    })
                })
            },
            downCom(index, row) {
                if(row.upperDown===0) {
                    this.$axios.post('/commodity/underCarriage', this.qs.stringify({"id": row.id})).then(result => {
                        if (result.data === true) {
                            alert("下架成功");
                            this.showTable(this.currentPage, this.pageSize);
                            this.count()
                        } else {
                            alert("下架失败")
                        }
                    })
                }else{
                    this.$axios.post('/commodity/grounding', this.qs.stringify({"id": row.id})).then(result => {
                        if (result.data === true) {
                            alert("上架成功");
                            this.showTable(this.currentPage, this.pageSize);
                            this.count()
                        } else {
                            alert("上架失败")
                        }
                    })
                }
            },
        selectCommodity() {
            this.$axios.post('/commodity/listCommodity',
                this.qs.stringify({
                    start: this.currentPage,
                    pageSize: this.pageSize,
                    goodsName: this.commodity.goodsName,
                    ccategoryid:this.initial
                })).then(result => {
                console.log(result);
                if (result.data.status === 200) {
                    this.list = result.data.message;
                } else {
                    alert("获取数据失败");
                }
            })
        },
        selectionchange(selection) { // 选择行里面的id
            this.isList = [];
            selection.forEach(element => {
                this.isList.push(element.id)
            })
        },
        removerow() {
            if (this.isList.length > 0) {
                this.$confirm(`确定删除吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(() => {
                    let idList = this.isList.toString();
                    this.$axios.post('/commodity/dele',
                        this.qs.stringify({isList: idList})).then(result => {
                        if (result.data === true) {
                            /* alert('删除成功')
                                location.reload() */
                            alert('删除成功');
                            this.showTable(this.currentPage, this.pageSize);
                            this.count()
                        }
                    })
                })
            }
        },
        handleEdit(index, row) {
            this.commodity = row;
            this.iconFormVisible = true;
            this.rowIndex = index;
        },
            close(){
                this.commodity={};
                this.iconFormVisible=false;
            },
            getType(){
                this.$axios.post('/typeNameList').then(result => {
                    if (result.data.status === 200) {
                        this.type = result.data.message;
                    } else {
                        alert("获取数据失败");
                    }
                })
            }
        },
        filters:{
            formatDate(time){
                let date = new Date(time);
                return myFormateDate.dateFormat(date,'yyyy-MM-dd-hh:mm:ss');
            }
        }
    }
</script>

<style>
    .div_btn{
        transform: translate(-13%, -5%);
    }
    .div_form{
        transform: translate(5%, -15%);
    }
</style>
