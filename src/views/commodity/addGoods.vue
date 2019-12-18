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
                                <el-button>管理规格选项</el-button>
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
                    sizeId: 0,//
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