<template>
    <div>

        <el-main>
            <div class="div_btn">
                <el-button type="danger" size="small" @click="$router.replace('/addGoods')">添加产品</el-button>
                <el-upload style="display: inline-block;margin-left: 10px" class="upload"
                           action=""
                           :multiple="false"
                           :show-file-list="false"
                           accept="csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                           :before-upload="resolver">
                    <el-button type="success" size="small">Excl批量增加</el-button>
                </el-upload>
                <el-button style="margin-left: 10px" type="info" size="small" @click="removerow">批量删除</el-button>
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
                            <img referrerpolicy='no-referrer' :src="scope.row.picturepath"
                                 style="width: 100px;height: 100px;display: block;"/>
                    </template>
                </el-table-column>
                <el-table-column prop="goodsName" label="标题" width="150">
                </el-table-column>
                <el-table-column prop="typeName" label="所属分类" width="150">
                </el-table-column>
                <el-table-column prop="goodsCode" label="商品码" width="150">
                </el-table-column>
                <el-table-column prop="createdate" label="创建时间" width="160">
                    <!-- <template slot-scope="scope">
                         <p>{{scope.row["createdate"]}}</p>
                     </template>-->
                    <template slot-scope="scope">
                        <p>{{scope.row.createdate | formatDate }}</p>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="230" fixed="right">
                    <template scope="scope">
                        <el-button ref="releaseStatus" type="warning" size="mini"
                                   @click="downCom(scope.$index, scope.row)">{{scope.row.upperDown==0 ? '下架' : '上架'}}
                        </el-button>
                        <el-button type="primary" size="mini" @click="handleEdit(scope.$index, scope.row)">详情
                        </el-button>
                        <el-button type="danger" size="mini" @click="delCommodity(scope.$index, scope.row)">删除
                        </el-button>
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

    import * as XLSX from "xlsx";

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
                initial: '',
                type: []
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
                if (row.upperDown === 0) {
                    this.$axios.post('/commodity/underCarriage', this.qs.stringify({"id": row.id})).then(result => {
                        if (result.data === true) {
                            alert("下架成功");
                            this.showTable(this.currentPage, this.pageSize);
                            this.count()
                        } else {
                            alert("下架失败")
                        }
                    })
                } else {
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
                        ccategoryid: this.initial
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
            close() {
                this.commodity = {};
                this.iconFormVisible = false;
            },
            getType() {
                this.$axios.post('/typeNameList').then(result => {
                    if (result.data.status === 200) {
                        this.type = result.data.message;
                    } else {
                        alert("获取数据失败");
                    }
                })
            },
            //Excl转JSON--批量文件上传
            resolver(e) {
                let file = e; // 文件信息
                if (!file) {
                    // 没有文件
                    return false
                } else if (!/\.(xls|xlsx)$/.test(file.name.toLowerCase())) {
                    // 格式根据自己需求定义
                    this.$message.error('上传格式不正确，请上传xls或者xlsx格式');
                    return false
                }
                const fileReader = new FileReader();
                fileReader.onload = (ev) => {
                    try {
                        const data = ev.target["result"];
                        const workbook = XLSX.read(data, {
                            type: 'binary' // 以字符编码的方式解析
                        });
                        const exlname = workbook.SheetNames[0]; // 取第一张表
                        const exl = XLSX.utils.sheet_to_json(workbook.Sheets[exlname]); // 生成json表格内容
                        let exl_data = [];
                        for (let i = 0; i < exl.length; i++) {
                            exl_data.push({
                                id: 0,//产品表编号
                                colorId: exl[i]["颜色"],//颜色表编号
                                sizeId: exl[i]["尺码"],//尺码表编号
                                details: exl[i]["详情"],//产品详情
                                goodsName: exl[i]["产品名称"],//产品名称
                                goodsTitle: exl[i]["卖点标题"],//产品卖点标题
                                typename: exl[i]["类型"],//类型名称
                                categoryId: exl[i]["产品分类表编号"],//产品分类表编号
                                goodsCode: exl[i]["商品码"],//商品码
                                picturePath: exl[i]["小图"],//产品图片路径
                                bigPicturePath: exl[i]["大图"],//产品大图路径
                                createDate: myFormateDate.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),//产品录入时间
                                price: exl[i]["价格/单位"],//产品价格
                                activityPrice: exl[i]["活动价"],//产品活动价格
                                weight: exl[i]["产品重量"],//产品重量
                                locking: exl[i]["锁定库存"],//锁定库存
                                already: exl[i]["已购库存"],//已购库存
                                disId: exl[i]["配送"],//配送id
                                activityId: exl[i]["团购活动"],//拼团活动编号
                                bounds: exl[i]["限时活动"],//限时活动编号
                                presell: exl[i]["预售活动"],//预售活动编号
                                upperDowm: exl[i]["上下架"],//产品上下架
                                del: exl[i]["删除状态"],//删除状态
                                putshelves: exl[i]["拉取产品"]//拉取产品
                            })
                        }
                        console.log(exl, exl_data);
                        this.$axios.post('/commodity/piAddGoods', exl_data).then(result => {
                            if (result.data.code === 200) {
                                this.$message.success("成功添加了" + result.data.data + "件产品")
                            } else {
                                this.$message.error("添加产品失败，正确的行数为：" + result.data.data)
                            }
                        }).catch(error => {
                            console.error(error);
                            this.$message.error("HTTP请求失败")
                        });
                        console.log(exl)
                    } catch (e) {
                        console.error(e);
                        this.$message.error("解析文件失败");
                        return false
                    }
                };
                fileReader.readAsBinaryString(file);
                return false
            }
        },
        filters: {
            formatDate(time) {
                let date = new Date(time);
                return myFormateDate.dateFormat(date, 'yyyy-MM-dd-hh:mm:ss');
            }
        }
    }
</script>

<style>
    .div_btn {
        transform: translate(-13%, -5%);
    }

    .div_form {
        transform: translate(5%, -15%);
    }
</style>
