<template>
    <div>
        <el-main>
            <el-row class="box_3883X1">
                <el-col :span="12">
                    <div class="text_3884X1">添加产品</div>
                </el-col>
            </el-row>

            <el-row style="margin-top: 20px">
                <el-button class="text_4049X1" type="info" plain @click="active1">基本信息</el-button>
                <el-button class="text_4049X1" type="info" plain @click="active2">规格信息</el-button>
                <el-button class="text_4049X1" type="info" plain @click="active3">产品文件</el-button>  <!--plain 是有个选中样式-->
                <el-button class="text_4049X1" type="info" plain @click="active4">参与活动</el-button>
            </el-row>

            <el-row>
                <template>
                    <el-tabs v-model="activeName">
                        <!--基本信息-->
                        <el-tab-pane label="基本信息" name="first">
                            <el-row :gutter="10" class="text_guige">
                                <el-col :span="18">
                                    <div style="margin-top: 10px">基本信息</div>
                                </el-col>
                            </el-row>

                            <el-row>
                                <el-col :span="2" style="margin-top: 50px">产品名称:</el-col>
                                <el-col :span="3" style="margin-top: 40px">
                                    <el-input  v-model="name" placeholder=""></el-input>
                                </el-col>
                                <el-col :span="2" style="margin-top: 50px">产品重量:</el-col>
                                <el-col :span="3" style="margin-top: 40px">
                                    <el-input v-model="company" placeholder="kg" onblur="if (!(/^[\d]+\.?\d*$/.test(this.value)) ){alert('输入有误，请输入数字或小数点');}"></el-input>
                                </el-col>
                            </el-row>

                            <el-row>
                                <el-col :span="2" style="margin-top: 20px">卖点标题:</el-col>
                                <el-col :span="3" style="margin-top: 15px">
                                    <el-input v-model="title" placeholder=""></el-input>
                                </el-col>
                            </el-row>

                            <el-row>
                                <el-col :span="2" style="margin-top: 20px">产品编码:</el-col>
                                <el-col :span="3" style="margin-top: 15px">
                                    <el-input v-model="goodsCode" placeholder=""></el-input>
                                </el-col>
                            </el-row>

                            <el-row>
                                <el-col :span="2" style="margin-top: 20px">锁定库存:</el-col>
                                <el-col :span="3" style="margin-top: 15px">
                                    <el-input v-model="locking" placeholder="" onblur="if (!(/^[\d]+\.?\d*$/.test(this.value)) ){alert('输入有误，请输入数字或小数点');}"></el-input>
                                </el-col>
                                <el-col :span="2" style="margin-top: 20px">已购库存:</el-col>
                                <el-col :span="3" style="margin-top: 15px">
                                    <el-input v-model="already" placeholder="" onblur="if (!(/^[\d]+\.?\d*$/.test(this.value)) ){alert('输入有误，请输入数字或小数点');}"></el-input>
                                </el-col>
                            </el-row>

                            <el-row style="margin-top: 15px">
                                <el-col :span="2" style="margin-top: 5px">产品分类</el-col>
                                <el-col :span="3" style="margin-top: 5px">
                                    <template>
                                        <el-select v-model="typeVal" placeholder="请选择">
                                            <el-option
                                                    v-for="item in optionsType"
                                                    :key="item.id"
                                                    :label="item.typename"
                                                    :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </template>
                                </el-col>
                            </el-row>


                            <el-row style="">
                                <el-col :span="2" style="margin-top: 20px">产品大图:</el-col>
                                <el-col :span="3" style="margin-top: 15px;display: inline;">
                                    <el-upload class="upload-demo" ref="upload"
                                               action="http://localhost:8080/commodity/showPhoto"
                                               list-type="picture-card"
                                               :data="this.res"
                                               name="photo"
                                               :auto-upload="false">
                                        <i slot="default" class="el-icon-plus"></i>
                                        <div slot="file" slot-scope="{file}">
                                            <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
                                            <span class="el-upload-list__item-actions">
                                            <span class="el-upload-list__item-preview"
                                                  @click="handlePictureCardPreview(file)">
                                              <i class="el-icon-zoom-in"></i>
                                            </span>
                                            <span v-if="!disabled" class="el-upload-list__item-delete"
                                                  @click="handleDownload(file)">
                                              <i class="el-icon-download"></i>
                                            </span>
                                            <span v-if="!disabled" class="el-upload-list__item-delete"
                                                  @click="handleRemove(file)">
                                              <i class="el-icon-delete"></i>
                                            </span>
                                          </span>
                                        </div>
                                    </el-upload>
                                    <el-dialog :visible.sync="dialogVisible">
                                        <img width="100%" :src="dialogImageUrl" alt="">
                                    </el-dialog>
                                </el-col>
                            </el-row>

                            <el-row style="margin-top: 50px">
                                <el-button class="box_3896X1" type="info" @click="active2">下一步</el-button>
                            </el-row>
                        </el-tab-pane>


                        <!--规格信息-->
                        <el-tab-pane label="规格信息" name="second">

                            <el-row style="margin-top: 5px">
                                <el-button type="primary" @click="changeStatus">商品规格管理</el-button>
<!--                                <el-button>管理规格选项</el-button>-->
                            </el-row>
                            <el-row :gutter="10" class="text_guige">
                                <el-col :span="18">
                                    <div style="margin-top: 10px">创建新规格</div>
                                </el-col>
                            </el-row>

                            <el-row>
                                <el-col :span="2" style="margin-top: 35px">
                                    颜色:
                                </el-col>
                                <el-col :span="18" style="margin-top: 35px">
                                    <el-radio-group v-model="colorRad">
                                        <el-radio @change="getColorId" v-for="items in goodsColor"
                                                  :key="items.id"
                                                  :label="items.colourname"
                                                  :value="items.id"
                                        >
                                        </el-radio>
                                    </el-radio-group>
                                </el-col>
                            </el-row>

                            <el-row>
                                <el-col :span="2" style="margin-top: 25px">
                                    尺码:
                                </el-col>
                                <el-col class="box_left" :span="18" style="margin-top: 25px">
                                    <el-radio-group v-model="sizeRad">
                                        <el-radio @change="goodsSizeId" v-for="itemSize in goodsSize"
                                                  :key="itemSize.id"
                                                  :value="itemSize.id"
                                                  :label="itemSize.sizename">
                                        </el-radio>

                                    </el-radio-group>
                                </el-col>
                            </el-row>

                            <el-row :gutter="10" class="text_guige">
                                <el-col :span="18">
                                    <div style="margin-top: 10px">规格价格</div>
                                </el-col>
                            </el-row>

                            <el-row>
                                <el-col :span="2" style="margin-top: 50px">
                                    价格:
                                </el-col>
                                <el-col :span="3" style="margin-top: 40px">
                                    <el-input v-model="price" placeholder="￥" onblur="if (!(/^[\d]+\.?\d*$/.test(this.value)) ){alert('输入有误，请输入数字或小数点');}"></el-input>
                                </el-col>
                            </el-row>
                            <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
                            <el-row style="margin-top: 50px">
                                <el-button class="box_3896X1" type="danger" @click="active1">返回</el-button>
                                <el-button class="box_3896X1" type="info" @click="active3">下一步</el-button>
                            </el-row>
                        </el-tab-pane>


                        <!--产品详情-->
                        <el-tab-pane label="产品详情" name="third">
                            <el-row style="margin-top: 20px;margin-left: 70px">
                                <div class="components-container">
                                    <quill-editor v-model="content"
                                                  @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                                                  @change="onEditorChange($event)"
                                                  ref="myQuillEditor" style="width: 1200px; height: 500px;">
                                    </quill-editor>
                                </div>
                            </el-row>
                            <br><br><br><br><br><br><br>
                            <el-row style="margin-top: 50px">
                                <el-button class="box_3896X1" type="danger" @click="active2">返回</el-button>
                                <el-button class="box_3896X1" type="success" @click="getGoods">完成</el-button>
                                <el-button class="box_3896X1" type="info" @click="active4">下一步</el-button>
                            </el-row>
                        </el-tab-pane>


                        <!--参与活动-->
                        <el-tab-pane label="参与活动" name="fourth">

                            <el-row :gutter="10" class="text_3897X1">
                                <el-col :span="18">
                                    <div style="margin-top: 10px">拼团活动</div>
                                </el-col>
                                <el-col :span="4">
                                    <div style="margin-top: 10px">
                                        <el-radio v-model="radio" label="1" name="radios" @change="getHuodong1">选择
                                        </el-radio>
                                    </div>
                                </el-col>
                            </el-row>
                            <el-row style="margin-top: 35px">
                                <el-col :span="2" style="margin-top: 5px">
                                    活动选择
                                </el-col>
                                <el-col :span="3" style="margin-top: 5px">
                                    <template>
                                        <el-select v-model="va" placeholder="请选择">
                                            <el-option
                                                    v-for="item in options"
                                                    :key="item.activitiesId"
                                                    :label="item.activityName"
                                                    :value="item.activitiesId">
                                            </el-option>
                                        </el-select>
                                    </template>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="2" style="margin-top: 5px">
                                    活动价格
                                </el-col>
                                <el-col :span="6" style="margin-top: 5px">
                                    <el-input v-model="pInput" placeholder="￥" onblur="if (!(/^[\d]+\.?\d*$/.test(this.value)) ){alert('输入有误，请输入数字或小数点');}"></el-input>
                                </el-col>
                            </el-row>
                            <el-row :gutter="10" class="text_3897X1" style="margin-top: 50px">
                                <el-col :span="18">
                                    <div style="margin-top: 10px">限购活动</div>
                                </el-col>
                                <el-col :span="4">
                                    <div style="margin-top: 10px">
                                        <el-radio v-model="radio" label="2" name="radios" @change="getHuodong1">选择
                                        </el-radio>
                                    </div>
                                </el-col>
                            </el-row>
                            <el-row style="margin-top: 35px">
                                <el-col :span="2" style="margin-top: 5px">
                                    活动选择
                                </el-col>
                                <el-col :span="3" style="margin-top: 5px">
                                    <template>
                                        <el-select v-model="va2"  placeholder="请选择">
                                            <el-option
                                                    v-for="item in options2"
                                                    :key="item.advanceId"
                                                    :label="item.advanceName"
                                                    :value="item.advanceId">
                                            </el-option>
                                        </el-select>
                                    </template>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="2" style="margin-top: 5px">
                                    活动价格
                                </el-col>
                                <el-col :span="6" style="margin-top: 5px">
                                    <el-input v-model="xInput" placeholder="￥"onblur="if (!(/^[\d]+\.?\d*$/.test(this.value)) ){alert('输入有误，请输入数字或小数点');}"></el-input>
                                </el-col>
                            </el-row>
                            <el-row :gutter="10" class="text_3897X1" style="margin-top: 50px">
                                <el-col :span="18">
                                    <div style="margin-top: 10px">预售活动</div>
                                </el-col>
                                <el-col :span="4">
                                    <div style="margin-top: 10px">
                                        <el-radio v-model="radio" label="3" name="radios" @change="getHuodong1">选择
                                        </el-radio>
                                    </div>
                                </el-col>
                            </el-row>
                            <el-row style="margin-top: 35px">
                                <el-col :span="2" style="margin-top: 5px">
                                    活动选择
                                </el-col>
                                <el-col :span="3" style="margin-top: 5px">
                                    <template>
                                        <el-select v-model="va3"  placeholder="请选择">
                                            <el-option
                                                    v-for="item in options3"
                                                    :key="item.ctivityId"
                                                    :label="item.activityName"
                                                    :value="item.ctivityId">
                                            </el-option>
                                        </el-select>
                                    </template>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="2" style="margin-top: 5px">
                                    活动价格
                                </el-col>
                                <el-col :span="6" style="margin-top: 5px">
                                    <el-input v-model="yInput" placeholder="￥" onblur="if (!(/^[\d]+\.?\d*$/.test(this.value)) ){alert('输入有误，请输入数字或小数点');}"></el-input>
                                </el-col>
                            </el-row>
                            <br><br>
                            <el-row style="margin-top: 50px">
                                <el-button class="box_3896X1" type="danger" @click="active3">返回</el-button>
                                <el-button class="box_3896X1" type="success" @click="getGoods">完成</el-button>
                            </el-row>
                        </el-tab-pane>
                    </el-tabs>
                </template>
            </el-row>

        </el-main>


        <!--颜色表数据表-->
        <el-dialog
                :visible.sync="isShownUpdate"
                style="width: 1100px;
                       margin-left: 150px">
            <template>
                <el-table
                        :data="tableDataUpdate"
                        style="width: 100%">
                    <el-table-column
                            label="编号"
                            width="100">
                        <template slot-scope="scope">
                            <span style="margin-left: 10px">{{ scope.row.id }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column
                            label="名称"
                            width="100">
                        <template slot-scope="scope">
                            <span style="margin-left: 10px">{{ scope.row.colourname }}</span>
                        </template>
                    </el-table-column>
                    <div>
                        <el-table-column
                                label="图片"
                                width="100">
                            <template slot-scope="scope">
                                <span style="margin-left: 10px"><img src="scope.row.colourpath"></span>
                            </template>
                        </el-table-column>
                    </div>
                    <el-table-column label="操作">
                        <template slot-scope="scope">

                            <el-popover
                                    placement="left"
                                    width="200"
                                    trigger="click">
                                <el-input v-model="inputUpdate" placeholder="请输入选项值"  style="margin-bottom: 10px" ></el-input>
                                <div>
                                    修改小图:
                                    <el-upload
                                            class="avatar-uploader"
                                            action="https://jsonplaceholder.typicode.com/posts/"
                                            :show-file-list="false"
                                            :on-success="handleAvatarSuccess"
                                            :before-upload="beforeAvatarUpload">
                                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                    </el-upload>
                                </div>
                                <el-button style="margin-left: 50px"  type="primary" @click="specUpdate(scope.$index,scope.row.id)" round>确认修改</el-button>
                                <el-button
                                        slot="reference"
                                        size="mini"
                                        @click="handleEditUpdate(scope.$index, scope.row.colourname)">修改</el-button>
                            </el-popover>

                            <el-button
                                    size="mini"
                                    type="danger"
                                    @click="open(scope.$index, scope.row.id)">删除</el-button>
                        </template>
                    </el-table-column>

                </el-table>
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        background
                        layout="prev, pager, next"
                        :total="counts"
                        :page-size="pageSize"
                        :current-page="currentPage"
                >
                </el-pagination>
            </template>
        </el-dialog>

        <!--尺码表数据-->
        <el-dialog
                :visible.sync="isShownUpdateSize"
                style="width: 1100px;
                       margin-left: 150px">
            <template>
                <el-table
                        :data="tableDataSize"
                        style="width: 100%">
                    <el-table-column
                            label="编号"
                            width="150">
                        <template slot-scope="scope">
                            <span style="margin-left: 10px">{{ scope.row.sizeid }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column
                            label="名称"
                            width="200">
                        <template slot-scope="scope">
                            <span style="margin-left: 10px">{{ scope.row.sizename }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">

                            <el-popover
                                    placement="left"
                                    width="200"
                                    trigger="click">
                                <el-input v-model="inputSize" placeholder="请输入选项值"  style="margin-bottom: 10px" ></el-input>
                                <el-button style="margin-left: 50px"  type="primary" @click="specSize(scope.$index,scope.row.sizeid)" round>确认修改</el-button>
                                <el-button
                                        slot="reference"
                                        size="mini"
                                        @click="handleEditSize(scope.$index, scope.row.sizename)">修改</el-button>
                            </el-popover>

                            <el-button
                                    size="mini"
                                    type="danger"
                                    @click="openSize(scope.$index, scope.row.sizeid)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                        @size-change="handleSizeChangeSize"
                        @current-change="handleCurrentChangeSize"
                        background
                        layout="prev, pager, next"
                        :total="countSize"
                        :page-size="pageSizeShoe"
                        :current-page="currentPageSize"
                >
                </el-pagination>
            </template>
        </el-dialog>

        <el-dialog :visible.sync="isShown">
            <el-table
                    :data="tableData"
                    style="width: 100%">
                <el-table-column
                        label="购物选项"
                        width="120">
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{ scope.row.date }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="选项值"
                        width="300">
                    <template slot-scope="scope" >
                        <span style="margin-left: 10px"  v-for="site in scope.row.name">{{site.colourname }}</span>
                        <span style="margin-left: 10px"  v-for="site in scope.row.name">{{ site.sizename }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="210">
                    <template slot-scope="scope">
                        <el-popover
                                placement="left"
                                width="200"
                                trigger="click">
                            <el-input v-model="input" placeholder="请输入选项值" style="margin-bottom: 10px" ></el-input>
                            <div v-if="scope.$index==0">
                                添加小图:
                                <el-upload
                                        class="avatar-uploader"
                                        action="https://jsonplaceholder.typicode.com/posts/"
                                        :show-file-list="false"
                                        :on-success="handleAvatarSuccess"
                                        :before-upload="beforeAvatarUpload">
                                    <img v-if="imageUrl" :src="imageUrl" class="avatar">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                </el-upload>
                            </div>
                            <el-button style="margin-left: 50px"  type="primary" @click="specInsert(scope.$index)" round>确认添加</el-button>
                            <el-button
                                    slot="reference"
                                    size="mini"
                                    @click="handleInsert(scope.$index, scope.row)">添加</el-button>
                        </el-popover>


                        <el-button
                                style="margin-left: 20px"
                                size="mini"
                                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>

                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>


    </div>
</template>

<script>
    import {
        quillEditor
    } from 'vue-quill-editor'
    import 'quill/dist/quill.core.css'
    import 'quill/dist/quill.snow.css'
    import 'quill/dist/quill.bubble.css'

    import date from '../../assets/js/Date';

    export default {
        components: {quillEditor},
        data() {
            return {
                pageSize:"5",
                pageSizeShoe:"5",
                currentPage:"1",
                currentPageSize:"1",
                imageUrl: '',
                counts:0,
                countSize:0,
                input: '',
                inputUpdate: '',
                inputSize: '',
                isShown: false,
                isShownUpdate:false,
                isShownUpdateSize:false,
                tableData:[{
                    date:"颜色",
                    name:"颜色无数据",
                },{
                    date:"尺码",
                    name:"尺码无数据"
                }],
                tableDataUpdate:[{
                    date:"颜色",
                    name:"颜色无数据",
                },{
                    date:"尺码",
                    name:"尺码无数据"
                }
                ],
                tableDataSize:[{
                    date:"颜色",
                    name:"颜色无数据",
                },{
                    date:"尺码",
                    name:"尺码无数据"
                }
                ],

                //第一个页面
                name: '',//产品名称
                company: '',//产品单位
                title: '',//标题
                goodsCode: '',//产品编码
                locking: '',//锁定库存
                already: '',//已购库存
                // 下拉框属性
                optionsType: [],
                typeVal: '',//选中的值
                // 上传地址
                dialogImageUrl: '',
                bigDialogImageUrl: '',
                dialogVisible: false,
                disabled: false,//大图


                //第二个页面值
                price: '',
                reference: 'specifications.vue',
                colorRad: '',
                sizeRad: '',
                goodsColor: [],
                goodsSize: [],

                //第三个页面的值
                content: '',

                //第四个页面的值
                activeName: '',//活动名称
                config: {
                    initialFrameWidth: null,
                    initialFrameHeight: 350
                },
                radio: '', //保存单选选中的lable值
                va: '',
                options: [],
                va2: '',
                options2: [],
                va3: '',
                options3: [],
                pInput: '',//拼团活动输入框
                xInput: '',//限购活动输入框
                yInput: '',//预售活动输入框
                res: {
                    colorId: 0,
                    sizeId: 0,
                    details: '',//产品详情编号
                    goodsName: '',//名称
                    goodsTitle: '',//标题
                    categoryId: 9,//商品分类编号
                    goodsCode: '',//商品码
                    createDate: date.dateFormat(new Date(), 'yyyy-MM-dd'),//创建时间
                    price: 0.0,//价格
                    activityPrice: 0.0,//活动价格
                    weight: 0.0,//产品重量
                    locking: 0,//锁定库存
                    already: 0,//库存
                    activityId: 0,//拼团id
                    bounds: 0,//限购id
                    presell: 0//预售id
                },
                isNonempty:false//判断非空
            }
        }, computed: {
            editor() {
                return this.$refs.myQuillEditor.quill;
            },
        },
        created() {
            this.goodsType();
            this.active1();
            this.getSize();
            this.getColor();
        },
        methods: {
            open(index, row) {
                this.$confirm('此操作将删除该条记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.handleDelete(index, row);
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            openSize(index, row) {
                this.$confirm('此操作将删除该条记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.handleDeleteSize(index, row);
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
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
            handleSizeChangeSize: function(size) {
                this.pageSizeShoe = size;
                console.log(this.pageSizeShoe); //每页下拉显示数据
                this.showTableSize(this.currentPageSize, this.pageSizeShoe);
            },
            handleCurrentChangeSize: function(currentPage) {
                this.currentPageSize = currentPage;
                console.log(this.currentPage); //点击第几页
                this.showTableSize(this.currentPageSize, this.pageSizeShoe);
            },
            //颜色表总记录数方法
            selectCount() {
                this.$axios.post("/commodity/goodsCount").then((response) => {
                    this.counts =response.data
                })
            },
            //尺码表总记录数方法
            selectSizeCount() {
                this.$axios.post("/GoodsSize/goodsSizeCount").then((response) => {
                    this.countSize =response.data
                })
            },
            showTable(currentPage,pagseSize) {
                this.isShownUpdate=true;
                this.$axios.post("/commodity/pageInfoGoodsColour/", this.qs.stringify({
                    'currentPage': this.currentPage,
                    'pageSize': this.pageSize
                })).then((response) => {
                    this.tableDataUpdate=response.data
                })
            },
            showTableSize(currentPage,pagseSize) {
                this.isShownUpdateSize=true;
                this.$axios.post("/GoodsSize/goodsSizePage/", this.qs.stringify({
                    'currentPage': this.currentPageSize,
                    'pageSize': this.pageSizeShoe
                })).then((response) => {
                    this.tableDataSize=response.data
                })
            },
            specInsert(index){
                if(index==0){
                    if(!this.input==''){
                        this.$axios.post("/commodity/goodsStandardAdd/", this.qs.stringify({
                            'colourname': this.input,
                            'colourpath': this.imageUrl
                        })).then((response) => {
                            var res = response.data.toString()
                            if(res == 'true'){
                                this.input='';
                                this.imageUrl='';
                                alert("添加成功");
                                this.$axios.post("/commodity/StandardSelect/").then((response) => {
                                    this.tableData[0].name =response.data
                                    this.tableDataUpdate = response.data
                                })
                            }else{
                                alert("添加失败");
                            }
                        })
                    }else{
                        alert("请输入选项值");
                    }
                }else {
                    if (!this.input == '') {
                        this.$axios.post("/GoodsSize/goodsSizeInsert/", this.qs.stringify({
                            'sizeName': this.input
                        })).then((response) => {
                            var res = response.data.toString()
                            if (res == 'true') {
                                this.input = '';
                                alert("添加成功");
                                this.$axios.post("/GoodsSize/goodsSizeSelect/").then((response) => {
                                    this.tableData[1].name = response.data
                                })
                            } else {
                                alert("添加失败");
                            }
                        })
                    }else{
                        alert("请输入选项值");
                    }
                }
            },
            specUpdate(index,id){
                if(!this.inputUpdate==''){
                    this.$axios.post("/commodity/goodsStandardUpdate/", this.qs.stringify({
                        'id':id,
                        'colourname': this.inputUpdate,
                        'colourpath': this.imageUrl
                    })).then((response) => {
                        var res = response.data.toString()
                        if(res == 'true'){
                            this.input='';
                            this.imageUrl='';
                            alert("修改成功");
                            this.selectCount();
                            this.getStandardSelect();
                            this.showTable(this.currentPage,this.pageSize)
                        }else{
                            alert("修改失败");
                        }
                    })
                }else{
                    alert("选择项值不能为空");
                }


            },
            specSize(index,id){
                if(!this.inputUpdate=='') {
                    this.$axios.post("/GoodsSize/goodsSizeUpdate/", this.qs.stringify({
                        'sizeid': id,
                        'sizeName': this.inputSize
                    })).then((response) => {
                        alert(id + "dsfa")
                        var res = response.data.toString()
                        if (res == 'true') {
                            this.input = '';
                            alert("修改成功");
                            this.getStandardSelectSize();
                            this.showTableSize(this.currentPageSize, this.pageSizeShoe);
                        } else {
                            alert("修改失败");
                        }
                    })
                }else{
                    alert("选择项值不能为空");
                }
            },
            handleInsert(index, row) {
                console.log(index, row);
            },
            handleEdit(index, row) {
                if(index==0){
                    this.isShownUpdate = true
                    //调用查询颜色总记录数
                    this.selectCount();
                    this.showTable(this.currentPage,this.pageSize)
                }else{
                    this.isShownUpdateSize = true
                    this.selectSizeCount();
                    this.showTableSize(this.currentPageSize,this.pagseSizeShoe);
                }

            },
            handleEditUpdate(index,row) {
                this.inputUpdate = row
            },
            handleEditSize(index,row) {
                this.inputSize = row

            },
            handleDelete(index, row) {
                this.$axios.post("/commodity/goodsStandardDel/", this.qs.stringify({
                    'id':row,
                })).then((response) => {
                    var res = response.data.toString()
                    if(res == 'true'){
                        this.selectCount();
                        this.getStandardSelect();
                        this.showTable(this.currentPage,this.pageSize)
                    }else{
                        alert("删除失败");
                    }
                })
            },
            handleDeleteSize(index, row) {
                this.$axios.post("/GoodsSize/goodsSizeDel/", this.qs.stringify({
                    'sizeid':row,
                })).then((response) => {
                    var res = response.data.toString()
                    if(res == 'true'){
                        this.getStandardSelectSize();
                        this.showTableSize(this.currentPageSize,this.pageSizeShoe)
                    }else{
                        alert("删除失败");
                    }
                })
            },
            getStandardSelect(){
                this.$axios.post("/commodity/StandardSelect/").then((response) => {
                    this.tableData[0].name =response.data
                })
            },
            getStandardSelectSize(){
                this.$axios.post("/GoodsSize/goodsSizeSelect/").then((response) => {
                    this.tableData[1].name =response.data
                })
            },
            changeStatus: function () {
                if (this.isShown) {
                    this.isShown = false
                } else {
                    this.isShown = true
                }
                this.getStandardSelect();
                this.getStandardSelectSize();
            },
            handleAvatarSuccess(res, file) {

                this.imageUrl = URL.createObjectURL(file.raw);
                alert(this.imageUrl)
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },


            active1() {
                this.activeName = 'first';
            },
            active2() {
                this.activeName = 'second';
            },
            active3() {
                this.activeName = 'third';
            },
            active4() {
                this.activeName = 'fourth';
            },
            //产品分类
            goodsType() {
                this.$axios.post("/typeNameList").then(result => {
                    this.optionsType = result.data.message;

                }).catch(function (error) {
                    console.log(error)
                })
            },
            //图片路径
            /*handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePictureCardPreview(file) {
                alert(file.url);
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            //大图
            bigHandlePictureCardPreview(file) {
                this.bigDialogImageUrl = file.url;
                this.dialogVisible = true;
            },*/
            handleRemove(file) {
                console.log(file);
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            handleDownload(file) {
                console.log(file);
            },


            /*颜色*/
            getColor() {
                this.$axios.post('/commodity/StandardSelect').then(result => {
                    console.log(result.data);
                    this.goodsColor = result.data;
                })
            },
            getColorId() {
                for (let i = 0; i < this.goodsColor.length; i++) {
                    if (this.colorRad === this.goodsColor[i].colourname) {
                        this.res.colorId = this.goodsColor[i].id;
                        break;
                    }
                }
            },
            /*尺码*/
            getSize() {
                alert(this.sizeRad);
                this.$axios.post('/GoodsSize/goodsSizeSelect').then(result => {
                    console.log(result.data);
                    this.goodsSize = result.data;
                })
            },
            goodsSizeId() {
                for (let i = 0; i < this.goodsSize.length; i++) {
                    if (this.sizeRad === this.goodsSize[i].sizename) {
                        this.res.sizeId = this.goodsSize[i].sizeid;
                        break;
                    }
                }
            },


            //富文本编辑器区域
            onEditorReady(editor) { // 准备编辑器
            },
            onEditorBlur() {
            }, // 失去焦点事件
            onEditorFocus() {
            }, // 获得焦点事件
            onEditorChange() {// 内容改变事件
                this.$emit("input", this.content);
            },


            /*三个活动prop*/
            getHuodong1: function (result) {
                if (this.radio == 1) {
                    this.$axios.post('/Purchase/getAll').then(result => {
                        console.log(result.data);
                        this.options = result.data.data;
                    });
                    //保障之前操作的数据为空
                    this.options2 = [];
                    this.va2 = '';
                    this.options3 = [];
                    this.va3 = ''

                } else if (this.radio === 2) {
                    this.$axios.post('/marketing/shownaemid').then(result => {
                        console.log(result.data);
                        this.options2 = result.data.data;
                    });
                    this.options = [];//保障之前操作的数据为空
                    this.va = '';
                    this.options3 = [];
                    this.va3 = ''

                } else if (this.radio === 3) {
                    this.$axios.post('/marketings/show_name').then(result => {
                        console.log(result.data.data);
                        this.options3 = result.data.data;
                    });
                    this.options = [];//保障之前选择过的操作的数据为空
                    this.va = '';
                    this.options2 = [];
                    this.va2 = '';
                }
            },
            //非空判断
            Nonempty() {
                console.log("进入到非空判断中+++++"+this.isNonempty);
                if (this.res.goodsName.trim() === '') {
                    this.$alert("产品名称不能为空");
                    this.isNonempty =false;
                    this.active1();
               }else if (this.res.goodsTitle.trim() === '') {
                    this.$alert("产品标题不能为空");
                    this.isNonempty =false;
                    this.active1();
                }else if (this.res.goodsCode.trim() === '') {
                    this.$alert("产品编码不能为空");
                    this.isNonempty =false;
                    this.active1();
                }else if (this.res.weight === 0) {
                    this.$alert("产品重量不能为0");
                    this.isNonempty =false;
                    this.active1();
                }else if (this.res.locking === 0) {
                    this.$alert("锁定库存不能为0");
                    this.isNonempty =false;
                    this.active1();
                }else if (this.res.already === 0) {
                    this.$alert("已购库存不能为空");
                    this.isNonempty =false;
                }else if (this.res.categoryId === 0) {
                    this.$alert("产品类型不能为空");
                    this.isNonempty =false;
                    this.active1();
                }else if (this.res.price === 0) {
                    this.$alert("产品价格不能为空");
                    this.isNonempty =false;
                    this.active2();
                }else if(this.va !== '' && this.pInput === ''){
                    this.$alert("产品拼团活动价格不能为空");
                    this.isNonempty =false;
                    this.active4();
                }else if(this.va2 !== '' && this.xInput === ''){
                    this.$alert("产品限购活动价格不能为空");
                    this.isNonempty =false;
                    this.active4();
                }else if(this.va3 !== '' && this.yInput === ''){
                    this.$alert("产品预售活动价格不能为空");
                    this.isNonempty =false;
                    this.active4();
                }else {
                    //alert("非空判断通过");
                    this.isNonempty =true;
                }




            },
            /*提交*/
            getGoods() {
                this.res.goodsName = this.name;//产品名称
                this.res.goodsTitle = this.title;//卖点标题
                this.res.goodsCode = this.goodsCode;//商品码
                this.res.weight = parseFloat(this.company) || 0.0;//产品重量
                this.res.price = parseFloat(this.price) || 0.0;//价格
                this.res.locking = parseInt(this.locking) || 0;//锁定库存
                this.res.already = parseInt(this.already) || 0;//库存
                /*this.res.categoryId = parseInt(this.typeVal) || 0;*///产品分类id
                this.res.details = this.content;//产品详情
                this.res.activityId = parseInt(this.va) || 0;//拼团活动id
                this.res.bounds = parseInt(this.va2) || 0;//限购活动id
                this.res.presell = parseInt(this.va3) || 0;//预售活动id

                if (this.pInput !== '' && this.va !== '') {
                    this.res.activityPrice = parseFloat(this.pInput) || 0.0;//活动价格
                } else if (this.xInput !== '' && this.va2 !== '') {
                    this.res.activityPrice = parseFloat(this.xInput) || 0.0;//活动价格
                } else if (this.yInput !== '' && this.va3 !== '') {
                    this.res.activityPrice = parseFloat(this.yInput) || 0.0;//活动价格
                }


                this.Nonempty();//调用非空方法

                if(this.isNonempty){
                    this.$refs.upload.submit();
                    this.$notify({
                        title: '消息提示',
                        message:"添加成功"
                    });
                }

}
}
};

</script>

<style>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
    @keyframes dialog-fade-in {
        0% {
            transform: translate3d(0, 100%, 0);
            opacity: 0;
        }
        100% {
            transform: translate3d(0, 0, 0);
            opacity: 1;
        }
    }
    @keyframes dialog-fade-out {
        0% {
            transform: translate3d(0, 0, 0);
            opacity: 1;
        }
        100% {
            transform: translate3d(0, -100%, 0);
            opacity: 0;
        }
    }

    /*引入外部样式*/
    /*这个分号一定要写，要不会报错*/
    /*产品上传灰色框*/
    .box_3883X1 {
        width: 1439px;
        height: 70px;
        /*  left: 28px;*/
        color: rgba(80, 80, 80, 1);
        background-color: rgba(229, 229, 229, 1);
        font-size: 13px;
        line-height: 150%;
        text-align: center;

    }

    /*产品上传*/
    .text_3884X1 {
        width: 80px;
        height: 30px;
        left: 43px;
        top: 20px;
        color: rgba(0, 0, 0, 1);
        font-size: 20px;
        line-height: 150%;
        text-align: left;
        font-weight: bold;
        margin-top: 20px;
    }

    /*四个按钮*/
    .text_4049X1 {
        width: 252px;
        height: 48px;
        left: 193px;
        top: 89px;
        color: rgba(255, 255, 255, 1);
        background-color: rgba(115, 115, 115, 1);
        border-radius: 3px;
        font-size: 16px;
        line-height: 150%;
        text-align: center;
    }

    /*文本框*/
    /*.image_142X1{
        width: 1057px;
        height: 510px;
        left: 178px;
        top: 149px;
    }*/
    /*返回*/
    .box_3896X1 {
        width: 278px;
        height: 51px;
        left: 273px;
        top: 1081px;
        border-radius: 43px;
        font-size: 14px;
        line-height: 150%;
        text-align: center;
    }

    /*团购活动*/
    .text_3897X1 {
        width: 832px;
        height: 44px;
        left: 23px;
        top: 25px;
        color: rgba(80, 80, 80, 1);
        background-color: rgba(243, 243, 243, 1);
        font-size: 14px;
        line-height: 150%;
        text-align: left;
        font-weight: bold;
    }

    /* 规格的灰色栅格宽度*/
    .text_guige {
        width: 1400px;
        height: 44px;
        left: 23px;
        top: 25px;
        color: rgba(80, 80, 80, 1);
        background-color: rgba(243, 243, 243, 1);
        font-size: 14px;
        line-height: 150%;
        text-align: left;
        font-weight: bold;
    }

</style>