<template>
    <el-form status-icon :rules="rules" ref="ruleForm"  :model="article"   label-width="100px" :label-position="labelPosition">
        <el-form-item label="图片" style="width: 300px"   prop="artImages">
            <el-upload
                    class="avatar-uploader"
                    action="https://www.mocky.io/v2/5185415ba171ea3a00704eed/posts/"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                <img v-if="article.artImages" :src="article.artImages" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
        </el-form-item>

        <el-form-item label="咨询名称" style="width: 300px"  prop="artName" >
            <el-input v-model="article.artName" placeholder="请输入咨询名称"></el-input>
        </el-form-item>

        <el-form-item label="所属分类"  style="width: 300px">
            <el-select v-model="listArticleType.artId" placeholder="请选择">
                <el-option
                        v-for="item in this.listArticleType"
                        :key="item.artId"
                        :label="item.tcategoryName"
                        :value="item.artId">
                </el-option>
            </el-select>
        </el-form-item>

        <el-form-item label="排序" style="width: 300px" prop="artSort">
            <el-input v-model="article.artSort" placeholder="请输入排序"></el-input>
        </el-form-item>


        <div>
            <el-form-item label="文章内容" prop="artContent" >
        <el-card style="height: 310px;">
            <quill-editor v-model="article.artContent" ref="myQuillEditor" style="height: 200px;" :options="editorOption">
                <!-- 自定义toolar -->
                <div id="toolbar" slot="toolbar">
                    <!-- Add a bold button -->
                    <button class="ql-bold" title="加粗">Bold</button>
                    <button class="ql-italic" title="斜体">Italic</button>
                    <button class="ql-underline" title="下划线">underline</button>
                    <button class="ql-strike" title="删除线">strike</button>
                    <button class="ql-blockquote" title="引用"></button>
                    <button class="ql-code-block" title="代码"></button>
                    <button class="ql-header" value="1" title="标题1"></button>
                    <button class="ql-header" value="2" title="标题2"></button>
                    <!--Add list -->
                    <button class="ql-list" value="ordered" title="有序列表"></button>
                    <button class="ql-list" value="bullet" title="无序列表"></button>
                    <!-- Add font size dropdown -->
                    <select class="ql-header" title="段落格式">
                        <option selected>段落</option>
                        <option value="1">标题1</option>
                        <option value="2">标题2</option>
                        <option value="3">标题3</option>
                        <option value="4">标题4</option>
                        <option value="5">标题5</option>
                        <option value="6">标题6</option>
                    </select>
                    <select class="ql-size" title="字体大小">
                        <option value="10px">10px</option>
                        <option value="12px">12px</option>
                        <option value="14px">14px</option>
                        <option value="16px" selected>16px</option>
                        <option value="18px">18px</option>
                        <option value="20px">20px</option>
                    </select>
                    <select class="ql-font" title="字体">
                        <option value="SimSun">宋体</option>
                        <option value="SimHei">黑体</option>
                        <option value="Microsoft-YaHei">微软雅黑</option>
                        <option value="KaiTi">楷体</option>
                        <option value="FangSong">仿宋</option>
                        <option value="Arial">Arial</option>
                    </select>
                    <!-- Add subscript and superscript buttons -->
                    <select class="ql-color" value="color" title="字体颜色"></select>
                    <select class="ql-background" value="background" title="背景颜色"></select>
                    <select class="ql-align" value="align" title="对齐"></select>
                    <button class="ql-clean" title="还原"></button>
                    <!-- You can also add your own -->
                </div>
            </quill-editor>
        </el-card>
            </el-form-item>
    </div>

        <el-form-item label="录入时间" required    style="width: 300px" prop="artCreate" >
            <el-form-item prop="tcreate">
                <el-date-picker
                        v-model="article.artCreate"
                        type="datetime"
                        placeholder="选择日期时间">
                </el-date-picker>
            </el-form-item>
        </el-form-item>

        <el-form-item label="是否可用" prop="artJudge"   style="width: 300px">
            <el-radio-group v-model="article.artJudge">
                <el-radio   label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
            </el-radio-group>
        </el-form-item>

        <el-form-item  style="width: 350px">
            <el-button type="primary" @click="saveArticle('ruleForm',listArticleType.artId)">提交</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>

    </el-form>
</template>

<script>
    import {
        Quill,
        quillEditor
    } from 'vue-quill-editor'
    import 'quill/dist/quill.core.css'
    import 'quill/dist/quill.snow.css'
    import 'quill/dist/quill.bubble.css'

    //引入font.css
    import '../assets/font.css'

    // 自定义字体大小
    let Size = Quill.import('attributors/style/size')
    Size.whitelist = ['10px', '12px', '14px', '16px', '18px', '20px']
    Quill.register(Size, true)

    // 自定义字体类型
    var fonts = ['SimSun', 'SimHei', 'Microsoft-YaHei', 'KaiTi', 'FangSong', 'Arial', 'Times-New-Roman', 'sans-serif',
        '宋体', '黑体'
    ]
    var Font = Quill.import('formats/font')
    Font.whitelist = fonts
    Quill.register(Font, true)

    export default {
        name: 'FuncFormsEdit',
        components: {
            quillEditor
        },
        data() {
            return {
                labelPosition: 'left',
                listArticleType:{
                    artId:'',
                    tcategoryName:''
                },
                article:{
                    artImages:'',
                    artName:'',
                    artSort:'',
                    artCreate:'',
                    artJudge:'',
                    artContent:''
                },
                editorOption: {
                    placeholder: "请输入",
                    theme: "snow", // or 'bubble'
                    modules: {
                        toolbar: {
                            container: '#toolbar'
                        }
                    }
                },
                rules: {
                    artName: [
                        { required: true, message: '请输入文章咨询名称', trigger: 'blur' }
                    ],
                    artSort: [
                        { required: true, message: '请输入文章排序', trigger: 'blur' }
                    ],
                    artContent: [
                        { required: true, message: '请输入文章内容', trigger: 'blur' }
                    ],
                    artCreate: [
                        { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
                    ],
                    artJudge: [
                        { required: true, message: '请最少选择一个', trigger: 'change' }
                    ],
                    artImages: [
                        { required: true, message: '请选择图片', trigger: 'change' }
                    ]
                }
            }
        },created() {
            this.listArticleTypeFl();
        },  methods: {
            listArticleTypeFl(){
                this.$axios.post("/listAtricleType.do", this.qs.stringify({
                })).then((response) => {
                    this.listArticleType = response.data;
                }).catch((error) => {
                    alert(error) //请求失败返回的数据
                })
            },
            saveArticle(ruleForm,artId){
                this.$refs[ruleForm].validate((valid) => {
                    if (valid) {
                        this.$axios.post("/insertArticle.do", this.qs.stringify({
                            artImages:this.article.artImages,
                            artName:this.article.artName,
                            artCategoryId:artId,
                            artSort:this.article.artSort,
                            artCreate:this.formSetDate(this.article.artCreate),
                            artJudge:this.article.artJudge,
                            artContent:this.article.artContent.slice(3,-4)
                        })).then((response) => {
                            if(response.data==1){
                                this.$message({
                                    type: 'success',
                                    message: '添加成功'
                                });
                                this.resetForm("ruleForm")
                            }else {
                                this.$message({
                                    type: 'info',
                                    message: '添加失败'
                                });
                            }
                        }).catch((error) => {
                            alert(error) //请求失败返回的数据
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }, handleAvatarSuccess(res, file) {
                this.article.artImages = URL.createObjectURL(file.raw);
                alert(this.article.artImages)
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
            resetForm(ruleForm) {
                this.$refs[ruleForm].resetFields();
            },
            formSetDate(row) { //修改日期格式
                let date = new Date(row);
                let Y = date.getFullYear() + '-';
                let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) + '-' : date.getMonth() + 1 + '-';
                let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
                let h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
                let m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':';
                let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
                return Y + M + D + h + m + s
            }

        }
    }
</script>

<style >
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
</style>