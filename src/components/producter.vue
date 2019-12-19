<template>
    <div>
        <el-row >
            <el-col :span="3" >
                <dvi>
                    <el-button type="primary" size="mini" @click="goTo('/product')">产品上架</el-button>
                </dvi>
            </el-col>
            <el-col :span="14" >
                <el-row >
                    <el-col :span="6" >
                            <el-select v-model="value1" placeholder="全部分类" size="mini">
                                <el-option
                                        v-for="item in options"
                                        :key="item.typename"
                                        :label="item.typename"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                    </el-col>
                    <el-col :span="6" >
                            <template>
                                <el-input v-model="value" placeholder=" 输入搜索的词" size="mini"></el-input>
                            </template>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="3" >
                <el-button type="success" size="mini" @click="find">查询</el-button>
            </el-col>
        </el-row>


        <el-row >
            <el-col :span="24">
                <el-table :data="list">
                    <el-table-column prop="id" label="商品编号" width="200">
                    </el-table-column>
                    <el-table-column prop="picturePath" label="图片" width="200">
                        <template slot-scope="scopep">
                            <img :src="scopep.row.picturePath" style="width: 100px;height:100px;display: block">
                        </template>
                    </el-table-column>
                    <el-table-column prop="goodsTitle" label="商品名称" width="200">
                    </el-table-column>
                    <el-table-column prop="typename" label="分类" width="200">
                    </el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button type="danger" size="mini" :disabled="judge" @click="updateProduct(scope.$index, scope.row)">拉取产品</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <el-row >
            <el-col :span="8" :offset="16">
                <!-- 分页 paging -->
                <!--:page-size表示每页显示的数据条数；
                    :total：表示总的数据数量；
                    :page-sizes：表示我们可以自定义每页显示的数量；
                    :currentPage:表示当前的页码；
                    @size-change="handleSizeChange"，@current-change="handleCurrentChange" 是el-pagination中的事件，表示每页显示的数据和页码的变化；
                    layout:表示分页栏的布局;
                    background:表示是否带背景色-->
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
                               :page-size="pageSize" layout="total, prev, pager, next" background :total="total"></el-pagination>
            </el-col>
        </el-row>
    </div>

</template>

<script>
    export default {
        data() {
            return {
                list: [], //获取遍历集合
                total: 0, //条数
                pageSize: 4,
                currentPage: 1,
                rowIndex: null, //获取选中的行数
                addiconFormVisible: false, //判断创建门店的弹窗是否显示
                iconFormVisible: false, //判编辑图书的弹窗是否显示
                en:'',
                MessageInfo: {
                    id:'',//产品id
                    picturePath:'',//产品图片
                    goodsTitle:'',//产品标题
                    categoryId:'',//分类id
                    activityPrice:'',//活动价
                    price:'',//价格
                    weight:'',//产品重量
                    locking:'',//锁定库存
                    disId:'',//物流
                    goodsName:'',//分类名称
                    upperDowm:'',//
                }, //books对象
                dialogTitle: '创建门店', //窗口的名称
                options: [],
                value: '',
                value1:'',

            }
        }, //加载函数
        created() {
            /**
             * 需要用户角色中有admin角色 才能有增删改查的编辑权限
             * 对权限的一个控制
             */
            // if ((localStorage.getItem('roles').indexOf('admin') > -1)) {
            //     this.judge = false;
            // }
            //显示列表
            this.showTable(this.currentPage, this.pageSize);
            //条数
            console.log("12312");
            this.count();
            this.select();
        },

        methods: {
            goTo(path) {
                console.log("adsfasdfadsfsadfasdf");
                /**
                 * 跳转页面
                 * 参数path 为跳转的页面
                 */
                this.$router.replace(path);
            },
            select:function(){
                this.$axios.post("/typeNameList").then((response) => {
                    console.log(response.data);
                    this.options = response.data.message;
                    console.log(this.options);
                }).catch((error) => {
                    alert(error) //请求失败返回的数据
                })
            },
            find() {
                this.$axios.post("/commodity/listProductshelves", this.qs.stringify({
                    start: this.currentPage,
                    pageSize: this.pageSize,
                    goodsTitle: this.value,
                    categoryid: this.value1
                })).then((response) => {
                    this.list = response.data.message;
                    console.log(response.data);

                }).catch((error) => {
                    alert(error) //请求失败返回的数据
                }),
                    this.$axios.post("/commodity/count", this.qs.stringify({
                        goodsTitle: this.value,
                        categoryid: this.value1
                    })).then((response) => {
                        this.total = response.data;
                    }).catch((error) => {
                        alert(error) //请求失败返回的数据
                    })
            },
            handleSizeChange: function(size) {
                this.pageSize = size;
                console.log(this.pageSize); //每页下拉显示数据
                this.showTable(this.currentPage, this.pageSize);
            },
            handleCurrentChange: function(currentPage) {
                this.currentPage = currentPage;
                console.log(this.currentPage); //点击第几页
                this.showTable(this.currentPage, this.pageSize);
            },
            showTable(currentPage, pageSize) {
                //axios获取books列表
                this.$axios.post("/commodity/listProductshelves", this.qs.stringify({
                    start: this.currentPage,
                    pageSize: this.pageSize
                })).then((response) => {
                    this.list = response.data.message;
                    console.log("撒旦"+response.data.message);
                }).catch((error) => {
                    alert(error) //请求失败返回的数据
                })
            },
            count() {
                this.$axios.post("/commodity/count").then((response) => {
                    this.total = response.data;
                }).catch((error) => {
                    alert(error) //请求失败返回的数据
                })
            },
            startStop(index, row) { //启动和停用门
                console.log(row.upperDowm)
                let _this = this;
                //选中的对象赋值给Message对象
                this.MessageInfo = row;
                console.log(this.MessageInfo.upperDowm);
                if(this.MessageInfo.upperDowm=='1'){
                    this.$axios.post("/commodity/grounding",this.qs.stringify({
                        id:this.MessageInfo.id
                    })).then((response) => {
                        if (response.data == true) {
                            alert('产品上架成功');
                            _this.MessageInfo.upperDowm="2"
                        } else {
                            alert('产品上架失败');
                        }
                    }).catch((error) => {
                        alert(error) //请求失败返回的数据
                    })
                }else{
                    this.$axios.post("/commodity/underCarriage",this.qs.stringify({
                        id:this.MessageInfo.id
                    })).then((response) => {
                        if (response.data == true) {
                            alert('产品下架成功');
                            _this.MessageInfo.upperDowm="1"
                        } else {
                            alert('产品下架失败');
                        }
                    }).catch((error) => {
                        alert(error) //请求失败返回的数据
                    })
                }
            },
            handleEdit(index, row) { //打开编辑弹窗
                //设计弹窗标题
                this.dialogTitle = '更改门店信息';
                //选中的对象赋值给books对象
                this.BooksInfo = row;
                //显示弹窗
                this.iconFormVisible = true;
                //选中集合行数
                this.rowIndex = index;
            },
            submitMessage() { //编辑窗口
                if (this.dialogTitle === '更改门店信息') {

                } else {
                    //关闭添加弹窗
                    this.addiconFormVisible = false;
                    /**
                     * $axios的post提交
                     * 参数
                     * 1：api接口路径
                     * 2：需要传入的参数  必须要使用this.qs.stringify的方式传入参数
                     * .then为成功后的请求
                     * .catch为失败的请求
                     */
                    this.$axios.post("/Message/saveShop", this.qs.stringify({
                        'spName': this.MessageInfo.spName,
                        'spShopmanager': this.MessageInfo.spShopmanager,
                        'spPhone': this.MessageInfo.spPhone,
                        'spInitialpass': this.MessageInfo.spInitialpass,
                        'spShopphone': this.MessageInfo.spShopphone,
                        'spAddress': this.MessageInfo.spAddress
                    })).then((response) => {
                        var res = response.data;
                        if (res.msg != null) {
                            alert('该用户未拥有该权限')
                        } else {
                            if (res != '0') {
                                alert('添加成功');
                                //条数+1
                                this.total++;
                                //res 返回的是添加记录的id
                                this.MessageInfo.spId = res;
                                //追加一条记录到list数组中
                                this.list.splice(0, 0, this.MessageInfo); //添加到第一行
                                //清空books
                                this.MessageInfo = {};
                            } else {
                                alert('添加失败')
                            }
                        }
                    }).catch((error) => {
                        alert(error) //请求失败返回的数据
                    });
                    return;
                }
            },
            add() {
                //修改弹窗 标题
                this.dialogTitle = '增加';
                //清空books
                this.MessageInfo = {};
                //打开添加弹窗
                this.addiconFormVisible = true;
            },
            formSetDate(row) { //修改日期格式
                let date = new Date(row.recordDate);
                let Y = date.getFullYear() + '-';
                let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) + '-' : date.getMonth() + 1 + '-';
                let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
                return Y + M + D + '00:00:00';
            },
            remove(index, row) { //删除一条记录
                this.$confirm(`确定删除${row.id}号产品吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error',
                }).then(() => {
                    this.$axios({
                        method: "post",
                        url: '/commodity/delBooks',
                        params: {
                            "id": row.id //row返回的是一个对象
                        }
                    })
                        .then(response => {
                            var res = response.data;
                            if (res.msg != null) {
                                alert('该用户未拥有该权限')
                            } else {
                                if (res == true) {
                                    alert("删除成功");
                                    this.total--;
                                    this.list.splice(index, 1); //删除当前list对象
                                } else {
                                    alert("删除失败");
                                }
                            }
                        })
                        .catch(error => {
                            console.log(error);
                        });
                });
            },
            updateProduct(index, row) { //拉取一条记录
                this.$confirm(`确定拉取${row.id}号产品吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error',
                }).then(() => {
                    this.$axios({
                        method: "post",
                        url: '/commodity/updateProduct',
                        params: {
                            "id": row.id,//row返回的是一个对象
                            "putshelves":1
                        }
                    })
                        .then(response => {
                            var res = response.data;
                            if (res.msg != null) {
                                alert('该用户未拥有该权限')
                            } else {
                                if (res == true) {
                                    alert("拉取成功");
                                    this.total--;
                                    this.list.splice(index, 1); //删除当前list对象
                                } else {
                                    alert("拉取失败");
                                }
                            }
                        })
                        .catch(error => {
                            console.log(error);
                        });
                });
            }
        }
    }
</script>

<style scoped>
    .row{margin-top: 20px}
    .font{font-size: 5px}
    .chanp{
        text-align: left;
    }
    .fenl{
        margin-top: -28px;
        margin-left: 200px;
    }
    .sous{
        margin-top: -28px;
        margin-left: 330px;
    }
</style>