<template>
    <el-form status-icon :rules="rules" ref="ruleForm"  :model="aeticleType"   label-width="100px" :label-position="labelPosition">
        <el-form-item label="类别名称" prop="tcategoryName"  style="width: 300px">
            <el-input v-model="aeticleType.tcategoryName"   placeholder="请输入类别名称" ></el-input>
        </el-form-item>

        <el-form-item label="分类简述" prop="tsketch" style="width: 500px" >
            <el-input
                    type="textarea"
                    :rows="3"
                    placeholder="请输入分类简述"
                    v-model="aeticleType.tsketch">
            </el-input>
        </el-form-item>

        <el-form-item label="录入时间" required    style="width: 300px">
            <el-form-item prop="tcreate">
            <el-date-picker
                    v-model="aeticleType.tcreate"
                    type="datetime"
                    placeholder="选择日期时间">
            </el-date-picker>
            </el-form-item>
        </el-form-item>

        <el-form-item label="是否可用" prop="artJudge"   style="width: 300px">
            <el-radio-group v-model="aeticleType.artJudge">
                <el-radio   label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
            </el-radio-group>
        </el-form-item>

        <el-form-item  style="width: 350px">
            <el-button type="primary" @click="saveArticleType('ruleForm',aeticleType.artJudge)">提交</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
    </el-form>

</template>
<script>
    export default {
        data() {
            return {
                labelPosition: 'left',
                aeticleType: {
                    tcategoryName: '',
                    tsketch:'',
                    tcreate:'',
                    artJudge:''
                },
                rules: {
                    tcategoryName: [
                        { required: true, message: '请输入类别名称', trigger: 'blur' }
                    ],
                    tsketch: [
                        { required: true, message: '请输入分类简述', trigger: 'blur' }
                    ],
                    tcreate: [
                        { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
                    ],
                    artJudge: [
                        { required: true, message: '请最少选择一个', trigger: 'change' }
                    ]
                }
            };
        },
        created() {
        },
        methods: {
            saveArticleType(formName,artJudge) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post("/insertArticleType.do", this.qs.stringify({
                            tcategoryName:this.aeticleType.tcategoryName,
                            tsketch:this.aeticleType.tsketch,
                            tcreate:this.formSetDate(this.aeticleType.tcreate),
                            artJudge:artJudge
                        })).then((response) => {
                            if(response.data==1){
                                this.$message({
                                    type: 'success',
                                    message: '添加成功'
                                });
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