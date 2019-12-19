<template>
    <div>
        <el-main>
            <div class="div_btn_">
                <el-button type="danger" size="small" @click="add">新增父类</el-button>
                <!--                <el-button type="info" size="small" @click="add">Excl批量增加</el-button>-->
                <el-button type="info" size="small" @click="removerow">批量删除</el-button>
            </div>
            <el-table :data="list"
                      style="width: 100%;margin-bottom: 20px;"
                      row-key="id"
                      border
                      :tree-props="{children: 'childList', hasChildren: 'hasChildren'}"
                      @selection-change="selectionchange">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column prop="id" label="分类ID" width="150">
                    <template slot-scope="scope">{{transeId(scope.row)}}</template>
                </el-table-column>
                <el-table-column prop="typename" label="分类名称" width="150">
                </el-table-column>
                <el-table-column prop="typecount" label="商品数量" width="150">
                </el-table-column>
                <el-table-column prop="creatadate" label="录入时间">
                    <template slot-scope="scope">
                        <p>{{scope.row["creatadate"]}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" size="small" v-if="scope.row.stop===1"
                                   @click="start(scope.$index, scope.row)">启用
                        </el-button>
                        <el-button type="primary" size="small" v-if="scope.row.stop===0"
                                   @click="blockes(scope.$index, scope.row)">停用
                        </el-button>
                        <el-button type="info" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="danger" size="small" id="delete" @click="remove(scope.$index, scope.row)">删除
                        </el-button>
                        <el-button type="success" size="small" v-if="scope.row.parentId===0"
                                   @click="addzi(scope.$index,scope.row)">新增子类
                        </el-button>
                        <!-- scope.row代表当前对应行 -->
                    </template>
                </el-table-column>
            </el-table>
        </el-main>

        <!-- 父增加弹窗  -->
        <el-dialog :title="dialogTitle" width="50%" :visible.sync="addiconFormVisible">
            <el-form :inline="true" :model="goodstype" class="demo-form-inline">
                <el-form-item label="分类名称">
                    <el-input v-model="goodstype.typename"></el-input>
                </el-form-item>
                <el-form-item label="商品数量">
                    <el-input v-model="goodstype.typecount"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addiconFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitBrand">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 子增加弹窗  -->
        <el-dialog :title="dialogTitle" width="50%" :visible.sync="addziiconFormVisible">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="分类名称">
                    <el-input v-model="name"></el-input>
                </el-form-item>
                <el-form-item label="商品数量">
                    <el-input v-model="count"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addziiconFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitBrand">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 修改弹窗  -->
        <el-dialog :title="dialogTitle" width="50%" :visible.sync="iconFormVisible">
            <el-form :inline="true" :model="goodstype" class="demo-form-inline">
                <el-form-item label="分类名称">
                    <el-input v-model="goodstype.typename"></el-input>
                </el-form-item>
                <el-form-item label="商品数量">
                    <el-input v-model="goodstype.typecount"></el-input>
                </el-form-item>
                <!--                <el-form-item label="录入日期">-->
                <!--                    <el-date-picker-->
                <!--                            v-model="commodity.createdate"-->
                <!--                            type="date"-->
                <!--                            placeholder="选择日期">-->
                <!--                    </el-date-picker>-->
                <!--                </el-form-item>-->
                <!--                <el-form-item label="所属分类">-->
                <!--                    <el-input v-model="commodity.typeName"></el-input>-->
                <!--                </el-form-item>-->
                <!--                <el-form-item label="商品编码">-->
                <!--                    <el-input v-model="commodity.goodsCode"></el-input>-->
                <!--                </el-form-item>-->
                <!--                <el-form-item label="零售价格">-->
                <!--                    <el-input v-model="commodity.price"></el-input>-->
                <!--                </el-form-item>-->
                <!--                <el-form-item label="商品重量">-->
                <!--                    <el-input v-model="commodity.weight"></el-input>-->
                <!--                </el-form-item>-->
                <!--                <el-form-item label="图片">-->
                <!--                    <img :src="commodity.picturepath" style="width: 100px;height: 100px;"/>-->
                <!--                </el-form-item>-->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="iconFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitBrand">确 定</el-button>
            </div>
        </el-dialog>


        <!--        <el-dialog :title="dialogTitle" width="50%" :visible.sync="iconFormVisible">-->
        <!--            <el-form-item label="分类名称">-->
        <!--                <el-input placeholder="品牌名"></el-input>-->
        <!--            </el-form-item>-->
        <!--            <div slot="footer" class="dialog-footer">-->
        <!--                <el-button @click="iconFormVisible = false">取 消</el-button>-->
        <!--                <el-button type="primary" @click="submitBrand()">确 定</el-button>-->
        <!--            </div>-->
        <!--        </el-dialog>-->

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
                background
                :total="total"
        ></el-pagination>
    </div>
</template>

<script>
    export default {
        //name: "goodstype",
        data() {
            return {
                list: [],
                total: 0,
                pageSize: 3,
                currentPage: 1,
                iconFormVisible: false,
                goodstype: {
                    typename:'',
                },
                //给值重新赋一个对象，如果用双向绑定会页面改变
                name:'',
                count:'',
                dialogTitle: '增加',
                rowIndex: null,
                addiconFormVisible: false,
                addziiconFormVisible: false,
            }
        },
        created() {
            this.showTable(this.currentPage, this.pageSize);
        },
        methods: {
            handleSizeChange(size) {
                this.pageSize = size;
                console.log(this.pageSize);  //每页下拉显示数据
                this.showTable(this.currentPage, this.pageSize);
            },
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage;
                console.log(this.currentPage);  //点击第几页
                this.showTable(this.currentPage, this.pageSize);
            },
            showTable() {
                this.$axios.post('/goodstype',
                    this.qs.stringify({start: this.currentPage, pageSize: this.pageSize})).then(result => {
                    console.log(result);
                    if (result.data.status === 200) {
                        this.list = result.data.message;
                        this.total = result.data["count"];
                        //this.$message.success("加载成功");
                    } else {
                        this.$message.error("获取数据失败");
                    }
                })
            },
            remove(index, row) {
                if (row.parentId === 0) {
                    this.$confirm(`不能删除父类`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                    });
                    return;
                }
                this.$confirm(`确定删除${row.typename}吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    this.list.splice(index, 1); //删除当前list对象
                    this.$axios.post('/del', this.qs.stringify({"id": row.id})).then(result => {
                        if (result.data === true) {
                            this.$message.success("删除成功");
                            this.showTable(this.currentPage, this.pageSize);
                        } else {
                            this.$message.warning("删除失败");
                        }
                    })
                })
            },
            // 批量删除选择行里面的id
            selectionchange(selection) {
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
                        let list = this.isList.toString();
                        this.$axios.post('/pidel', this.qs.stringify({isList: list})).then(result => {
                            if (result.data === true) {
                                this.$message.success('删除成功');
                                this.showTable(this.currentPage, this.pageSize);
                            }
                        })
                    })
                }
            },
            submitBrand() {
                var that =this;
                //var ctime = this.brand.ctime;
                //var date = myFormateDate.dateFormat(new Date(ctime),'yyyy-MM-dd');
                if (this.dialogTitle === '分类编辑') {
                    // if (that.goodstype.typename == null || that.goodstype.typename == ''){
                    //     that.$alert("名称不能为空，请您重新输入");
                    //     return
                    // }
                    // if(that.goodstype.typecount == null){
                    //     that.$alert("数量不能为空，请您重新输入");
                    //     return
                    // }
                    //this.list[this.rowIndex].name=this.goodstype.typename
                    //this.list[this.rowIndex].ctime=this.goodstype.typecount;
                    let s = {
                        "typename": this.goodstype.typename,
                        "typecount": parseInt(this.goodstype.typecount),
                        "id": parseInt(this.goodstype.id)
                    };
                    //页面数据打印到控制台
                    console.log(s);
                    this.$axios.post('/update', s).then(result => {
                        if (result.data > 0) {
                            this.$message.success('编辑成功');
                            this.iconFormVisible = false;
                            this.goodstype = {};
                            this.showTable(this.currentPage, this.pageSize);
                        } else {
                            this.$message.warning('编辑失败');
                        }
            })
                } else if (this.dialogTitle === '新增父类') {
                    console.log(that.goodstype.typename);
                    if (that.goodstype.typename === null || that.goodstype.typename === ''){
                        that.$alert('名称不能为空，请您重新输入');
                        return
                    }
                    if(that.goodstype.typecount === null){
                        that.$alert('数量不能为空，请您重新输入');
                        return
                    }
                    let as = {
                        "typename": this.goodstype.typename,
                        "typecount": parseInt(this.goodstype.typecount)
                    };
                    //页面数据打印到控制台
                    console.log(as);
                    this.$axios.post('/addfu', as).then(result => {
                        if (result.data > 0) {
                            this.$message.success('父类新增成功');
                            this.addiconFormVisible = false;
                            //this.brand.id=result.data;
                            //this.list.splice(0, 0, this.goodstype);//添加到第一行
                            this.goodstype = {};
                            this.showTable(this.currentPage, this.pageSize);
                        } else {
                            this.$message.warning("父类新增失败");
                        }
                    })
                } else {
                    //添加子分类
                    if (that.name == null || that.name === ''){
                        that.$alert("名称不能为空，请您重新输入");
                        return
                    }
                    if(that.count == null){
                        that.$alert("数量不能为空，请您重新输入");
                        return
                    }
                    let as = {
                        "typename": this.name,
                        "typecount": parseInt(this.count),
                        "parentId": parseInt(this.goodstype.parentId),
                        "id": parseInt(this.goodstype.id)
                    };
                    //页面数据打印到控制台
                    console.log(as);
                    this.$axios.post('/addzi', as).then(result => {
                        if (result.data > 0) {
                            this.$message.success('子类新增成功');
                            this.addziiconFormVisible = false;
                            this.goodstype = {};
                            this.showTable(this.currentPage, this.pageSize);
                        } else {
                            this.$message.warning("子类新增失败");
                        }

                    });
                }
            },
            //启用
            start(index, row) {
                //alert("sb");
                this.$confirm(`是否启用该分类?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post('/one?id=' + row.id + '&&stop=0&&parentid=' + row.parentId + '', this.qs.stringify({})).then(result => {
                        if (result.data > 0) {
                            this.$message({
                                type: 'success',
                                message: '操作成功!'
                            });
                            this.showTable(this.currentPage, this.pageSize);
                        } else {
                            this.$message.error('操作失败，请联系管理员');
                        }
                    }).catch(err => {
                        console.log(err);
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消启用'
                    });
                });
            },
            //判断父子ID一样显示
            transeId(row) {
                if (row["parentId"] === 0) {
                    return row["id"]
                } else {
                    return row["parentId"]
                }
            },
            //停用
            blockes(index, row) {
                //alert("ss");
                this.$confirm('是否停用该分类?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // this.$axios.post('/del', this.qs.stringify({"id":row.id})).then(result => {
                    this.$axios.post('/one?id=' + row.id + '&&stop=1&&parentid=' + row.parentId + '', this.qs.stringify({})).then(result => {
                        if (result.data > 0) {
                            this.$message({
                                type: 'success',
                                message: '操作成功!'
                            });
                            this.showTable(this.currentPage, this.pageSize);
                        } else {
                            this.$message.error('操作失败，请联系管理员');
                        }
                    }).catch(err => {
                        console.log(err);
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消停用'
                    });
                })
            },
            add() {
                this.dialogTitle = '新增父类';
                this.goodstype = {};
                this.addiconFormVisible = true;
            },
            addzi(index,row) {
                this.dialogTitle = '新增子类';
                this.goodstype = row;
                //this.goodstype = {};
                this.addziiconFormVisible = true;
            },
            handleEdit(index, row) {
                this.dialogTitle = '分类编辑';
                this.goodstype = row;
                this.iconFormVisible = true;
                //this.rowIndex = index;
            //},
            // feinull(){
            //     if (this.goodstype.typename===''||this.goodstype.typename === null ||
            //         this.goodstype.typecount===''||this.goodstype.typecount === null){
            //         this.$alert("内容不能为空，请您重新输入");
            //         //return;
            //     }
            // }
        },
        //filters: {
        // formatDate(time) {
        //     let date = new Date(time);
        //     return myFormateDate.dateFormat(date, 'yyyy-MM-dd');
        // }
        }
    }
</script>

<style>
    .div_btn_ {
        transform: translate(-42%, -50%);
    }
</style>
