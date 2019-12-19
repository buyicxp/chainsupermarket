<template>
    <div>
    <el-row >
        <el-col :span="2" class="cols">
            门店名称
        </el-col>
        <el-col :span="6">
            <template>
                <el-select v-model="value" placeholder="请选择">
                    <el-option
                            v-for="item in options"
                            :key="item.spName"
                            :label="item.spName"
                            :value="item.spName">
                    </el-option>
                </el-select>
            </template>
        </el-col>
        <el-col :span="2" :offset="1" class="cols">
            营业状态
        </el-col>
        <el-col :span="6" >
            <template>
                <el-select v-model="value1" placeholder="请选择">
                    <el-option
                            v-for="item in operatings"
                            :key="item.value2"
                            :label="item.labe2"
                            :value="item.value2">
                    </el-option>
                </el-select>
            </template>
        </el-col>
        <el-col :span="6" :offset="1">
            <el-button type="success" @click="find">查询</el-button>
        </el-col>
    </el-row>
    <el-row class="row">
        <el-col :span="3" >
            <p class="font">门店列表 <p/>
        </el-col>
        <el-col :span="6" :offset="15" class="button">
            <template >
            <el-button  type="primary" @click="add">创建门店</el-button>
            </template>
        </el-col>
    </el-row>

    <el-row >
        <el-col :span="24">
            <el-table :data="list" stripe>
                <el-table-column prop="spId" label="门店ID" width="100">
                </el-table-column>
                <el-table-column prop="spName" label="门店名称" width="120">
                </el-table-column>
                <el-table-column prop="spCity" label="城市" width="120">
                </el-table-column>
                <el-table-column prop="spPhone" label="手机号" width="120">
                </el-table-column>
                <el-table-column prop="spOperating" label="营业状态" width="80">
                </el-table-column>
                <el-table-column prop="spCreationtime" label="创建时间" width="120" align="center" header-align="center" :formatter="formatDate">
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="warning" size="mini" :disabled="judge" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                        <el-button type="success" size="mini" :disabled="judge" @click="goTo('/product')">查看产品</el-button>
                        <span class="span"  v-if="scope.row.spOperating=='正常'"><el-button type="danger" size="mini" :disabled="judge" @click="startStop(scope.$index, scope.row)">停用</el-button>
                        </span>
                        <span class="span" v-else><el-button type="primary" size="mini" :disabled="judge" @click="startStop(scope.$index, scope.row)">启用</el-button>
                        </span>
                        <!-- scope.row代表当前对应行 -->
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
        <!-- 创建门店  -->
        <el-dialog :title="dialogTitle" width="50%" :visible.sync="addiconFormVisible">
            <el-form :inline="true" :model="MessageInfo" class="demo-form-inline">
                <el-form-item label="门店名称">
                    <el-input v-model="MessageInfo.spName" placeholder="请输入门店名称"></el-input>
                </el-form-item>
                <el-form-item label="店长姓名">
                    <el-input v-model="MessageInfo.spShopmanager" placeholder="请输入店长姓名"></el-input>
                </el-form-item>
                <el-form-item label="手机号码">
                    <el-input v-model="MessageInfo.spPhone" placeholder="请输入手机号码"></el-input>
                </el-form-item>
                <el-form-item label="初始密码">
                    <el-input v-model="MessageInfo.spInitialpass" type="password"></el-input>
                </el-form-item>
                <el-form-item label="门店电话">
                    <el-input v-model="MessageInfo.spShopphone" placeholder="请输入门店电话"></el-input>
                </el-form-item>
                <el-form-item label="门店地址">
                    <el-input v-model="MessageInfo.spAddress" placeholder="请输入门店地址"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addiconFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitMessage()">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 修改门店  -->
        <el-dialog :title="dialogTitle" width="50%" :visible.sync="iconFormVisible">
            <el-form :inline="true" :model="MessageInfo" class="demo-form-inline">
                <el-form-item label="门店名称">
                    <el-input v-model="MessageInfo.spName" placeholder="请输入门店名称"></el-input>
                </el-form-item>
                <el-form-item label="店长姓名">
                    <el-input v-model="MessageInfo.spShopmanager" placeholder="请输入店长姓名"></el-input>
                </el-form-item>
                <el-form-item label="手机号码">
                    <el-input v-model="MessageInfo.spPhone" placeholder="请输入手机号码"></el-input>
                </el-form-item>
                <el-form-item label="初始密码">
                    <el-input v-model="MessageInfo.spInitialpass"></el-input>
                </el-form-item>
                <el-form-item label="门店电话">
                    <el-input v-model="MessageInfo.spShopphone" placeholder="请输入门店电话"></el-input>
                </el-form-item>
                <el-form-item label="门店地址">
                    <el-input v-model="MessageInfo.spAddress" placeholder="请输入门店地址"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="iconFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitMessage()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                list: [], //获取遍历集合
                total: 0, //条数
                pageSize: 3,
                currentPage: 1,
                rowIndex: null, //获取选中的行数
                addiconFormVisible: false, //判断创建门店的弹窗是否显示
                iconFormVisible: false, //判编辑图书的弹窗是否显示
                MessageInfo: {
                    spId:'',//门店id
                    spName:'',//门店名称
                    spCity:'',//城市地址
                    spShopmanager:'',//店长
                    spPhone:'',//手机号
                    spOperating:'',//营业状态
                    spCreationtime:'',//创建时间
                    spInitialpass:'',//初始密码
                    spShopphone:'',//门店电话
                    spAddress:'',//门店地址
                }, //books对象
                dialogTitle: '创建门店', //窗口的名称
                operatings:[{
                    value2: '正常',
                    labe2: '正常营业'
                },{
                    value2: '停用',
                    labe2: '暂时营业'
                }
                ],
                options: [],
                value: '',
                value1: ''
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
            this.count();
            this.select();
        },
    methods: {
        goTo(path) {
            /**
             * 跳转页面
             * 参数path 为跳转的页面
             */
            this.$router.replace(path);
        },
        select:function(){
             this.$axios.post("/Message/listShopName").then((response) => {
                this.options = response.data;
             }).catch((error) => {
                alert(error) //请求失败返回的数据
             })
        },
        find(){
            this.$axios.post("/Message/listShop", this.qs.stringify({
                currentPage: this.currentPage,
                pageSize: this.pageSize,
                name:this.value,
                operating:this.value1
            })).then((response) => {
                this.list = response.data;
                console.log(response.data);
            }).catch((error) => {
                alert(error) //请求失败返回的数据
            }),
            this.$axios.post("/Message/countShop",this.qs.stringify({
                name:this.value,
                operating:this.value1
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
            this.$axios.post("/Message/listShop", this.qs.stringify({
                currentPage: this.currentPage,
                pageSize: this.pageSize
            })).then((response) => {
                this.list = response.data;
                console.log(response.data);
            }).catch((error) => {
                alert(error) //请求失败返回的数据
            })
        },
        count() {
            this.$axios.post("/Message/countShop").then((response) => {
                this.total = response.data;
            }).catch((error) => {
                alert(error) //请求失败返回的数据
            })
        },
        handleEdit(index, row) { //打开编辑弹窗
            //设计弹窗标题
            this.dialogTitle = '更改门店信息';
            //选中的对象赋值给Message对象
            this.MessageInfo = row;
            //显示弹窗
            this.iconFormVisible = true;
            //选中集合行数
            this.rowIndex = index;
        },
        startStop(index, row) { //启动和停用门
            //选中的对象赋值给Message对象
            this.MessageInfo = row;
            console.log(this.MessageInfo.spOperating);
            if(this.MessageInfo.spOperating=='正常'){
                this.MessageInfo.spOperating='停用'
            }else{
                this.MessageInfo.spOperating='正常'
            }
            this.$axios.post("/Message/disableShop",this.qs.stringify({
                id:this.MessageInfo.spId,
                operating:this.MessageInfo.spOperating
            })).then((response) => {
            }).catch((error) => {
                alert(error) //请求失败返回的数据
            })

        },
        submitMessage() { //编辑窗口
            if (this.dialogTitle === '更改门店信息') {
                /**
                 * 修改选中列表的books对象
                 */
                this.list[this.rowIndex].spName = this.MessageInfo.spName;
                this.list[this.rowIndex].spShopmanager = this.MessageInfo.spShopmanager;
                this.list[this.rowIndex].spPhone = this.MessageInfo.spPhone;
                this.list[this.rowIndex].spInitialpass = this.MessageInfo.spInitialpass;
                this.list[this.rowIndex].spShopphone = this.MessageInfo.spShopphone;
                this.list[this.rowIndex].spAddress = this.MessageInfo.spAddress;

                //关闭编辑弹窗
                this.iconFormVisible = false;

                /**
                 * $axios的post提交
                 * 参数
                 * 1：api接口路径
                 * 2：需要传入的参数  必须要使用this.qs.stringify的方式传入参数
                 * .then为成功后的请求
                 * .catch为失败的请求
                 */
                this.$axios.post("/Message/updateShop", this.qs.stringify({
                    'spName': this.MessageInfo.spName,
                    'spShopmanager': this.MessageInfo.spShopmanager,
                    'spPhone': this.MessageInfo.spPhone,
                    'spInitialpass': this.MessageInfo.spInitialpass,
                    'spShopphone': this.MessageInfo.spShopphone,
                    'spAddress': this.MessageInfo.spAddress,
                    'spId': this.MessageInfo.spId
                })).then((response) => {
                    var res = response.data;
                    if (res.msg != null) {
                        alert('该用户未拥有该权限')
                    } else {
                        if (res == true) {
                            alert('编辑成功');

                            this.BooksInfo = {};
                        } else {
                            alert('编辑失败')
                        }
                    }
                }).catch((error) => {
                    alert(error) //请求失败返回的数据
                });
                return;
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
        }
    }
</script>

<style scoped>
    .row{margin-top: 20px}
    .font{font-size: 20px}
    .cols{height:40px;line-height:40px;}
    .button{height:70px;line-height:70px;}
    .span{margin-left: 10px}
</style>