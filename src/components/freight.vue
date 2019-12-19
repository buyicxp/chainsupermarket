<template>
    <div class="freight">
        <el-dialog id="showMap"
                title="查看地图"
                :visible.sync="mapVisible"
                width="75%"
                center>
            <baidu-map :center="center" :zoom="zoom" @ready="handler" id="bm-view"></baidu-map>
            <span slot="footer" class="dialog-footer">
        <!--<el-button @click="centerDialogVisible = false">取 消</el-button>-->
        <el-button type="primary" @click="mapVisible = false">确 定</el-button>
        </span>
        </el-dialog>

        <el-dialog
                title="提示"
                :visible.sync="notNull"
                width="30%"
                center>
            <span>{{warning}}</span>
            <span slot="footer" class="dialog-footer">
        <!--<el-button @click="centerDialogVisible = false">取 消</el-button>-->
        <el-button type="primary" @click="notNull = false">确 定</el-button>
        </span>
        </el-dialog>

        <el-button @click="openAdd()" type="primary" icon="el-icon-edit" circle></el-button>
        <el-dialog title="物流下单" :visible.sync="freightVisible">
            <el-form :model="addForm" ref="addForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="订单编号" prop="billFormId">
                    <el-input v-model="addForm.billFormId"></el-input>
                </el-form-item>
                <el-form-item label="订单价格" prop="billFormPrice">
                    <el-input v-model="addForm.billFormPrice"></el-input>
                </el-form-item>
                <el-form-item label="发货地址" prop="billStartAddress">
                    <el-input v-model="addForm.billStartAddress"></el-input>
                </el-form-item>
                <el-form-item label="到货地址" prop="billEndAddress">
                    <el-input v-model="addForm.billEndAddress"></el-input>
                </el-form-item>
                <el-form-item label="每公斤价格" prop="billPrice">
                    <el-input v-model="addForm.billPrice"></el-input>
                </el-form-item>
                <el-form-item label="订单重量" prop="billWeight">
                    <el-input v-model="addForm.billWeight"></el-input>
                </el-form-item>
                <el-form-item label="订单状态" prop="billState">
                    <el-select v-model="addForm.billState" placeholder="请选择物流状态">
                        <el-option label="未发货" value="0"></el-option>
                        <el-option label="已发货" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="运费" prop="billFreightCharge">
                    <el-input v-model="addForm.billFreightCharge"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitAddForm('addForm')">下单</el-button>
                    <el-button @click="resetForm('addForm');">重置</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <el-dialog title="编辑物流信息" :visible.sync="dialogTableVisible">

            <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="订单价格" prop="billFormPrice">
                    <el-input v-model="ruleForm.billFormPrice"></el-input>
                </el-form-item>
                <el-form-item label="发货地址" prop="billStartAddress">
                    <el-input v-model="ruleForm.billStartAddress"></el-input>
                </el-form-item>
                <el-form-item label="到货地址" prop="billEndAddress">
                    <el-input v-model="ruleForm.billEndAddress"></el-input>
                </el-form-item>
                <el-form-item label="每公斤价格" prop="billPrice">
                    <el-input v-model="ruleForm.billPrice"></el-input>
                </el-form-item>
                <el-form-item label="订单重量" prop="billWeight">
                    <el-input v-model="ruleForm.billWeight"></el-input>
                </el-form-item>
                <el-form-item label="订单状态" prop="billState">
                    <el-select v-model="ruleForm.billState" placeholder="请选择物流状态">
                        <el-option label="未发货" value="0"></el-option>
                        <el-option label="已发货" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="运费" prop="billFreightCharge">
                    <el-input v-model="ruleForm.billFreightCharge"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">修改</el-button>
                    <!--<el-button @click="resetForm('ruleForm')">重置</el-button>-->
                </el-form-item>
            </el-form>
        </el-dialog>


        <el-dialog
                title="提示"
                :visible.sync="centerDialogVisible"
                width="30%"
                center>
            <span>目标订单已发货,无法修改</span>
            <span slot="footer" class="dialog-footer">
        <!--<el-button @click="centerDialogVisible = false">取 消</el-button>-->
        <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
        </span>
        </el-dialog>

        <template>
            <el-table :data="tableData" @row-dblclick="update"  stripe @row-click="showMap"
                      style="width: 100%">
                <!--<el-table-column type="selection" width="55">-->
                <!--</el-table-column>-->
                <el-table-column
                        prop="billId"
                        label="物流编号"
                        width="140">
                </el-table-column>
                <el-table-column
                        prop="billFormId"
                        label="订单编号"
                        width="140">
                </el-table-column>
                <el-table-column
                        prop="billFormPrice"
                        label="订单价格"
                        width="140">
                </el-table-column>
                <el-table-column
                        prop="billStartAddress"
                        label="发货地址"
                        width="235">
                </el-table-column>
                <el-table-column
                        prop="billEndAddress"
                        label="到货地址"
                        width="235">
                </el-table-column>
                <el-table-column
                        prop="billPrice"
                        label="每公斤价格"
                        width="140">
                </el-table-column>
                <el-table-column
                        prop="billWeight"
                        label="订单重量"
                        width="140">
                </el-table-column>
                <el-table-column
                        prop="billState"
                        label="物流状态"
                        width="140">
                </el-table-column>
                <el-table-column
                        prop="billFreightCharge"
                        label="运费"
                        width="150">
                </el-table-column>
            </el-table>
        </template>

        <el-pagination
                v-if="page.total>page.size"
                background
                layout="prev, pager, next"
                @current-change="currentChange"
                :page-size="page.size"
                :current-page="page.current"
                :total="page.total">
        </el-pagination>
    </div>
</template>

<script>
    export default {
        name: "demo1",
        data() {
            return {

                // 点击事件延迟执行
                clickTimer:null,

                // 地图相关参数
                map:null,
                walking:null,
                _points:[],
                center: {lng: 112.94547319535288, lat: 28.23488939994364},
                zoom: 3,

                target:{},
                dataJson: [],
                tableData: [],
                state: '',
                page: {
                    current: 1,
                    size: 3,
                    total: 0,

                },
                // 显示修改表单
                dialogTableVisible: false,
                // 物流已发货提示
                centerDialogVisible: false,
                // 物流下单表单
                freightVisible:false,
                // 地图
                mapVisible:false,

                // 数据校验提示
                notNull:false,
                warning:'',


                ruleForm: {
                    billFormPrice: '',
                    billStartAddress: '',
                    billEndAddress: '',
                    billPrice: '',
                    billWeight: '',
                    billState: '',
                    billFreightCharge: ''
                },
                addForm:{
                    billFormId:'',
                    billFormPrice: '',
                    billStartAddress: '',
                    billEndAddress: '',
                    billPrice: '',
                    billWeight: '',
                    billState: '',
                    billFreightCharge: ''
                }
            }
        },

        // 页面初始化时调用
        created() {
            this.listAllFreight();
        },
        beforeUpdate(){
            // 关闭页面监听
            if(!this.dialogTableVisible && !this.freightVisible){
                let _this = this;
                document.onkeydown=function (e) { //监听页面enter
                    if ( e.keyCode && e.keyCode == 13){
                        console.log("关闭监听")
                        return false;
                    }
                };

            }
        },

        methods: {

            // 地图准备方法
            handler ({BMap, map}) {
                let _this = this;
                _this.map = map;
                _this.walking = new BMap.DrivingRoute(map, {
                    renderOptions: {
                        map: map,
                        autoViewport: true
                    },
                    onPolylinesSet: function (routes) {
                        let searchRoute = routes[0].getPolyline();//导航路线
                        _this.map.addOverlay(searchRoute);
                    },
                });

                this.zoom = 15

            },

            // 路线规划
            path(){
                this.map.enableScrollWheelZoom();   //启用滚轮放大缩小，默认禁用
                this. map.clearOverlays() // 清除地图上所有的覆盖物
                var start = new BMap.Point(this._points[0].lng, this._points[0].lat);
                var end = new BMap.Point(this._points[1].lng, this._points[1].lat);
                this.walking.search(start,end);
                console.log("规划完成")
            },


            // 通过ajax获取数据
            listAllFreight() {
                // 将当前对象封装
                let that = this;

                let url =  "freight/freight.query?pageNum=" + that.page.current
                    + "&pageSize=" + that.page.size;

                // 调用Ajax的get方法
                this.$axios.get(url).then(rs => {
                    var data = rs.data;
                    that.page.total = data.total;
                    var obj = [];
                    data.list.forEach(function (value) {
                        var item = new Object();
                        item.billFormPrice = "￥" + value.billFormPrice;
                        item.billFreightCharge = "￥" + value.billFreightCharge;
                        item.billPrice = "￥" + value.billPrice;

                        if (value.billState == 0) {
                            item.billState = "未发货";
                        } else {
                            item.billState = "已发货";
                        }
                        item.billWeight = value.billWeight + "KG";
                        item.billFormId = value.billFormId;
                        item.billId = value.billId;
                        item.billEndAddress = value.billEndAddress;
                        item.billStartAddress = value.billStartAddress;
                        obj.push(item);
                    });
                    that.tableData = obj;
                    that.dataJson = data.list;


                }) .catch(function(err){
                    console.log(err);
                });

                // this.$http.get(url).then(result => {
                //     let rs = JSON.parse(result.body);
                //     console.log(rs);
                //     that.page.total = rs.total;
                //     that.tableData = rs.list;
                // })
            },

            update(row) {
                let _this = this;
                // console.log("双击");
                if (_this.clickTimer) {
                    window.clearTimeout(_this.clickTimer);
                    _this.clickTimer = null;
                }


                var data = {};
                // console.log(this.dataJson)
                this.dataJson.forEach(function (value) {
                    if (value.billId == row.billId) {
                        data = value;
                        data.billState = value.billState + ""
                    }
                });

                // console.log(data)

                this.ruleForm = data;
                this.open(row);
            },

            // 打开窗体
            open(row) {

                // console.log(row.billState);
                /*if (row == null) {
                    this.ruleForm = {
                        billFormPrice: '',
                        billStartAddress: '',
                        billEndAddress: '',
                        billPrice: '',
                        billWeight: '',
                        billState: '',
                        billFreightCharge: ''
                    }
                } else*/

                if (row.billState == '已发货') {
                    this.centerDialogVisible = true;
                    return;
                }

                let _this = this;
                document.onkeydown=function (e) { //监听页面enter
                    if ( e.keyCode && e.keyCode == 13){
                        _this.submitForm('ruleForm') // 需要执行的事件
                    }
                };


                this.target = row;
                this.dialogTableVisible = true
            },

            //分页点击事件
            currentChange(current) {
                this.page.current = current;

                this.listAllFreight();
            },

            // selectionChange(selection) {
            //     console.log(selection);
            // },

            submitForm(formName) {
                let that = this;

                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let url = "/freight/freight.update";
                        let data = that.ruleForm;

                        // 整理数据
                        data.billId = that.target.billId;
                        data.billFormId =  that.target.billFormId;

                        console.log(data);
                        // 封装数据
                        var params = new URLSearchParams();
                        params.append('billId', that.target.billId);
                        params.append('billFormId', that.target.billFormId);
                        params.append('billFormPrice', data.billFormPrice);
                        params.append('billStartAddress', data.billStartAddress);
                        params.append('billEndAddress', data.billEndAddress);
                        params.append('billPrice', data.billPrice);
                        params.append('billWeight', data.billWeight);
                        params.append('billState', data.billState);
                        params.append('billFreightCharge', data.billFreightCharge);
                        // console.log(params);

                        //调用axios的post方法
                        that.$axios.post(url,params,{
                            headers:{
                                'Allow-Control-Allow-Origin':'*'
                            }
                        }).then(function(response){
                            console.log(response);
                        }) .catch(function(err){
                            console.log(err);
                        });

                        that.dialogTableVisible = false;
                        that.listAllFreight();
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },

            // 显示地图
            showMap(row){
                // console.log("单击")

                let _this = this;
                if (_this.clickTimer) {
                    window.clearTimeout(_this.clickTimer);
                    _this.clickTimer = null;
                }

                _this.clickTimer = window.setTimeout(function() {
                    let url =  "freight/coord.do?startAddress=" + row.billEndAddress
                        + "&endAddress=" + row.billStartAddress;
                    _this.$axios.get(url).then(rs => {
                        _this._points = rs.data;
                        _this.path();
                    });
                    _this.mapVisible=true;
                }, 400);

            },


            // 打开物流下单
            openAdd(){
                let _this = this;
                // 开启页面enter监听
                // document.onkeydown=function (e) { //监听页面enter
                //     if ( e.keyCode && e.keyCode == 13){
                //         _this.submitAddForm('addForm') // 需要执行的事件
                //     }
                // };
                // console.log("打开监听");
                this.freightVisible = true;
            },

            // 物流下单
            submitAddForm(formName){
                var _this = this;

                // 定义正则
                var reg = /^[0-9]+(\.[0-9]+)?$/;        //大于0的浮点数

                // 数据校验
                if(_this.addForm.billFormId == null || _this.addForm.billFormId == ''){
                    _this.warning = '订单编号不能为空!';
                    _this.notNull = true;
                    return false;
                }else  if(_this.addForm.billFormPrice == null || _this.addForm.billFormPrice == ''){
                    _this.warning = '订单价格不能为空!';
                    _this.notNull = true;
                    return false;
                }else  if(!reg.test(_this.addForm.billFormPrice)){
                    _this.warning = '订单价格必须为大于0的浮点数!';
                    _this.notNull = true;
                    return false;
                }else  if(_this.addForm.billStartAddress == null || _this.addForm.billStartAddress == ''){
                    _this.warning = '发货地址必填!';
                    _this.notNull = true;
                    return false;
                }else  if(_this.addForm.billStartAddress == null || _this.addForm.billStartAddress == ''){
                    _this.warning = '到货地址必填!';
                    _this.notNull = true;
                    return false;
                }else  if(_this.addForm.billPrice == null || _this.addForm.billPrice == ''){
                    _this.warning = '请输入每公斤价格!';
                    _this.notNull = true;
                    return false;
                }else  if(!reg.test(_this.addForm.billPrice)){
                    _this.warning = '每公斤单价必须为大于0的浮点数!';
                    _this.notNull = true;
                    return false;
                }else  if(_this.addForm.billWeight == null || _this.addForm.billWeight == ''){
                    _this.warning = '请输入订单重量!';
                    _this.notNull = true;
                    return false;
                }else  if(!reg.test(_this.addForm.billWeight)){
                    _this.warning = '订单重量必须为大于0的浮点数!';
                    _this.notNull = true;
                    return false;
                }else  if(_this.addForm.billState == null || _this.addForm.billState == ''){
                    _this.warning = '请选择物流状态!';
                    _this.notNull = true;
                    return false;
                }else  if(_this.addForm.billFreightCharge == null || _this.addForm.billFreightCharge == ''){
                    _this.warning = '请输入运费!';
                    _this.notNull = true;
                    return false;
                }else  if(!reg.test(_this.addForm.billFreightCharge)){
                    _this.warning = '运费必须为大于0的浮点数!';
                    _this.notNull = true;
                    return false;
                }

                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let url = "/freight/freight.save";

                        let data = _this.addForm;

                        // 封装数据
                        var params = new URLSearchParams();
                        params.append('billFormId', data.billFormId);
                        params.append('billFormPrice', data.billFormPrice);
                        params.append('billStartAddress', data.billStartAddress);
                        params.append('billEndAddress', data.billEndAddress);
                        params.append('billPrice', data.billPrice);
                        params.append('billWeight', data.billWeight);
                        params.append('billState', data.billState);
                        params.append('billFreightCharge', data.billFreightCharge);

                        //调用axios的post方法
                        _this.$axios.post(url,params,{
                            headers:{
                                'Allow-Control-Allow-Origin':'*'
                            }
                        }).then(function(response){
                            console.log(response);
                        }) .catch(function(err){
                            console.log(err);
                        });

                        _this.listAllFreight();
                        _this.resetForm('addForm');
                        _this.freightVisible = false;
                    }else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .el-form-item {
        width: 65%;
        padding-left: 15%;
    }

    .el-dialog {
        margin-top: 0px;
    }

    #bm-view{
        width: 100%;
        height: 500px;
    }

    .anchorBL{
        display:none;
    }

    .BMap_cpyCtrl {
        display:none;
    }

</style>
