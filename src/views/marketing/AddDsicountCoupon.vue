<template>

    <div class="form">
        <el-form ref="form" :model="form" label-width="110px">
            <el-form-item label="优惠券名称:">
                <el-input v-model="form.couponName" placeholder="请输入优惠券名称"  style="width: 40%;"></el-input>
            </el-form-item>
            <el-form-item label="优惠券类型:" >
                <template>
                    <el-select v-model="form.couponType.couponTypeId" style="width: 12%;" clearable placeholder="请选择">
                        <el-option
                                v-for="item in CouponTypeList"
                                :key="item.couponTypeId"
                                :label="item.couponTypeName"
                                :value="item.couponTypeId">
                        </el-option>
                    </el-select>
                </template>
            </el-form-item>
            <el-form-item label="面值:">
                <el-input v-model="form.faceValue"  style="width: 9%;"></el-input>
            </el-form-item>
            <el-form-item label="发放类型:">
                <template>
                    <el-select v-model="form.distributionType.distributionId" style="width: 20%;" clearable placeholder="请选择">
                        <el-option
                                v-for="item in DistributionTypeList"
                                :key="item.distributionId"
                                :label="item.distributionName"
                                :value="item.distributionId">
                        </el-option>
                    </el-select>
                </template>
            </el-form-item>

            <el-form-item label="每人限领:">
                <el-input v-model="form.limitGet"  style="width: 5%;"></el-input>张
            </el-form-item>

            <el-form-item label="发放总量:">
                <el-input v-model="form.paymentAmount"  style="width: 5%;"></el-input>张
            </el-form-item>

            <el-form-item label="已发放:">
                <el-input v-model="form.couponCount"  style="width: 5%;" :disabled="true"></el-input>张
            </el-form-item>

            <el-form-item label="领取时间:">
                <el-date-picker
                        v-model="form.begintime"
                        type="datetime"
                        placeholder="选择日期时间">
                </el-date-picker>
                至
                <el-date-picker
                        v-model="form.endtime"
                        type="datetime"
                        placeholder="选择日期时间">
                </el-date-picker>
            </el-form-item>

            <el-form-item label="有效期:">

                <div class="radio">
                    <el-radio v-model="form.periodOfValidity" :label="0">
                        <span class="radiotext">自领取后</span><el-input v-model="form.effectiveDays"  style="width: 50px;"></el-input><span class="radiotext">天内有效</span>
                    </el-radio>
                </div>
                <div class="radio">
                    <el-radio v-model="form.periodOfValidity" :label="1">
                        <span class="radiotext">自领取后</span><el-input v-model="form.effectivePeriod"  style="width: 50px;"></el-input><span class="radiotext">天内生效，
                        生效后</span><el-input v-model="form.effectiveDays"  style="width: 50px;"></el-input><span class="radiotext">天失效</span>
                    </el-radio>
                </div>
                <div class="radio">
                    <el-radio v-model="form.periodOfValidity" :label="2">
                        <el-date-picker
                                v-model="form.startTime"
                                type="datetime"
                                placeholder="选择日期时间">
                        </el-date-picker>
                        至
                        <el-date-picker
                                v-model="form.deadline"
                                type="datetime"
                                placeholder="选择日期时间">
                        </el-date-picker>
                    </el-radio>
                </div>
            </el-form-item>


            <el-form-item label="计算时间方式:">
                <template>
                    <el-select v-model="form.ComputingTime.computingId" style="width: 20%;" clearable placeholder="请选择">
                        <el-option
                                v-for="item in ComputingTimeList"
                                :key="item.computingId"
                                :label="item.computingName"
                                :value="item.computingId">
                        </el-option>
                    </el-select>
                </template>
            </el-form-item>

            <el-form-item label="使用限制:">
                <template>
                    <el-select v-model="UsageRestriction.restrictionName" style="width: 10%;" clearable placeholder="请选择">
                        <el-option
                                v-for="item in UsageRestrictionList"
                                :key="item.value"
                                :label="item.value"
                                :value="item.value">
                        </el-option>
                    </el-select>
                    <span class="usage">
                        <el-time-select placeholder="起始时间" style="width: 13%;" v-model="UsageRestriction.startTime" :picker-options="{start: '08:30',step: '00:15',end: '18:30'}">
                        </el-time-select>
                    </span>
                    <span>至</span>
                    <span class="usage">
                        <el-time-select placeholder="结束时间" style="width: 13%;" v-model="UsageRestriction.stoptime" :picker-options="{ start: '08:30', step: '00:15',end: '18:30',minTime: startTim}">
                        </el-time-select>
                    </span>
                </template>
            </el-form-item>

            <el-form-item label="不可用类型:">
                <template>
                    <el-select v-model="UnavailableType.unavailableId" style="width: 20%;" clearable placeholder="请选择">
                        <el-option
                                v-for="item in CommdityTypeList"
                                :key="item.id"
                                :label="item.typename"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </template>
            </el-form-item>


            <el-form-item label="指定门店:">
                <template>
                    <el-select v-model="form.store.spId" style="width: 20%;" clearable placeholder="请选择">
                        <el-option
                                v-for="item in storeList"
                                :key="item.spId"
                                :label="item.spName"
                                :value="item.spId">
                        </el-option>
                    </el-select>
                </template>
            </el-form-item>

            <el-form-item label="订单金额:">
                <el-input v-model="form.money"  style="width: 5%;"></el-input>
            </el-form-item>

            <el-form-item label="优惠类型:">
                <template>
                    <el-select v-model="form.PreferentialType.preferentialId" style="width: 20%;" clearable placeholder="请选择">
                        <el-option
                                v-for="item in PreferentialTypeList"
                                :key="item.preferentialId"
                                :label="item.preferentialName"
                                :value="item.preferentialId">
                        </el-option>
                    </el-select>
                </template>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="onSubmit()" @keyup.enter.native="onSubmit()">立即创建</el-button>
                <el-button @click="cancle()">取消</el-button>
            </el-form-item>


        </el-form>

    </div>
</template>

<script>
    //查询所有优惠券类型
    //查询所有发放类型
    //查询计算时间方式
    //查询使用限制
    //查询不可用类型
    //查询所有门店
    //查询所有优惠类型
    //领取张数 int
    export default {
        name: "AddDsicountCoupon",
        data() {
            return {
                //判断操作
                verify:true,
                form: {
                    couponName:'',
                    //优惠券类型
                    couponType: {
                        couponTypeId:'',
                    },
                    faceValue:0,
                    distributionType:{
                        distributionId:''
                    },
                    limitGet:0,
                    paymentAmount:0,
                    //发放数量
                    couponCount:0,
                    begintime:'',
                    endtime:'',
                    periodOfValidity:0,
                    effectiveDays:0,
                    effectivePeriod:0,
                    startTime:'',
                    deadline:'',
                    ComputingTime:{
                        computingId:''
                    },
                    store:{
                        spId:''
                    },
                    money:0,
                    PreferentialType:{
                        preferentialId:''
                    }
                },
                //不可用类型对象
                UnavailableType:{
                    unavailableId:''
                },
                //使用限制对象
                UsageRestriction:{
                    unavailableId: '',
                    id:'',
                    typename:''
                },

                //优惠券类型
                CouponTypeList:[],
                //发放类型
                DistributionTypeList:[],
                //计算时间方式
                ComputingTimeList:[],
                //使用限制
                UsageRestrictionList:[
                    {value:'星期一'},
                    {value:'星期二'},
                    {value:'星期三'},
                    {value:'星期四'},
                    {value:'星期五'},
                    {value:'星期六'},
                    {value:'星期日'},
                ],
                //商品的所有分类
                CommdityTypeList:[],
                //门店
                storeList:[],
                //优惠类型
                PreferentialTypeList:[],
            }
        },
        created(){
            //加载优惠券
            this.selectDiscountCoupon();
            //加载下拉框的优惠券类型
            this.selectCouponType();
            // 加载下拉框的发放类型
            this.selectDistributionType();
            //加载下拉框的计算时间方式
            this.selectComputingTime();
            //加载使用限制
            this.selectUsageRestriction();
            //加载商品所有的类型
            this.selectCommdityType();
            //加载门店的下拉列表
            this.selectStoreList();
            //加载优惠类型
            this.selectPreferentialType();
        },
        methods: {
            //取消事件
            cancle(){
                this.$router.replace('/DiscountCouponInfo');
            },
            //提交事件
            onSubmit() {
                var that = this;
                //验证
                var judge = that.checks();
                console.log(judge);
                if(!judge){
                    console.log('跳出方法');
                    return;
                }
                //
                //
                if(that.verify == false){
                    console.log('添加操作');
                    //添加操作
                    var url = 'http://localhost:8080/discount/addCoupon';
                    console.log(url);
                    that.$axios.get(url,{
                        params:{
                            couponName: that.form.couponName,
                            couponTypeId: that.form.couponType.couponTypeId,
                            faceValue:that.form.faceValue,
                            distributionId: that.form.distributionType.distributionId,
                            limitGet:that.form.limitGet,
                            paymentAmount:that.form.paymentAmount,
                            begintime:that.dateFormat(that.form.begintime),
                            endtime:that.dateFormat(that.form.endtime),
                            periodOfValidity:that.form.periodOfValidity,
                            effectiveDays:that.form.effectiveDays,
                            effectivePeriod:that.form.effectivePeriod,
                            startTime:that.form.startTime,
                            deadline:that.form.deadline,
                            computingId:that.form.ComputingTime.computingId,
                            restrictionName:that.UsageRestriction.restrictionName,
                            restrictionBeginTime:that.UsageRestriction.startTime,
                            stoptime:that.UsageRestriction.stoptime,
                            spId:that.form.store.spId,
                            money:that.form.money,
                            preferentialId:that.form.PreferentialType.preferentialId,
                            goodsTypeId:that.UnavailableType.unavailableId
                        }
                    }
                    ).then((response) => {
                        console.log(response.data);
                        this.$router.replace('/DiscountCouponInfo');
                    }).catch(function (error) {
                        console.log(error)
                    })
                }else{
                    console.log('更新操作');
                    console.log(that.$route.query.couponId);
                    //更新操作
                    var url = 'http://localhost:8080/discount/updatediscountcoupon';
                    console.log(url);
                    that.$axios.get(url,{
                            params:{
                                couponId:that.$route.query.couponId,
                                couponName: that.form.couponName,
                                couponTypeId: that.form.couponType.couponTypeId,
                                faceValue:that.form.faceValue,
                                distributionId: that.form.distributionType.distributionId,
                                limitGet:that.form.limitGet,
                                paymentAmount:that.form.paymentAmount,
                                begintime:that.dateFormat(that.form.begintime),
                                endtime:that.dateFormat(that.form.endtime),
                                periodOfValidity:that.form.periodOfValidity,
                                effectiveDays:that.form.effectiveDays,
                                effectivePeriod:that.form.effectivePeriod,
                                startTime:that.form.startTime,
                                deadline:that.form.deadline,
                                computingId:that.form.ComputingTime.computingId,
                                restrictionName:that.UsageRestriction.restrictionName,
                                restrictionBeginTime:that.UsageRestriction.startTime,
                                stoptime:that.UsageRestriction.stoptime,
                                spId:that.form.store.spId,
                                money:that.form.money,
                                preferentialId:that.form.PreferentialType.preferentialId,
                                goodsTypeId:that.UnavailableType.unavailableId
                            }
                        }
                    ).then((response) => {
                        this.$router.replace('/DiscountCouponInfo');
                    }).catch(function (error) {
                        console.log(error)
                    })
                }

            },
            checks(){
                var that = this;
                //判断优惠券名称不能为空
                if(that.form.couponName === ''){
                    that.$alert('优惠券名称不能为空！');
                    return false;
                }
                //判断优惠券类型是否选择
                if(that.form.couponType.couponTypeId == ''){
                    that.$alert('请选择优惠券类型！');
                    return false;
                }
                //判断面值是否填写
                if(that.form.faceValue <=0){
                    that.$alert('面值必须大于0！');
                    return false;
                }
                //判断发放类型是否选择
                if(that.form.distributionType.distributionId == ''){
                    that.$alert('请选择发放类型！');
                    return false;
                }
                //判断每人限领
                if(that.form.limitGet <= 0){
                    that.$alert('每人限领必须大于0！');
                    return false;
                }
                //发放总量
                if(that.form.paymentAmount <= 0){
                    that.$alert('发放总量必须大于0！');
                    return false;
                }
                //领取时间
                if(that.form.begintime == '' || that.form.endtime == ''){
                    that.$alert('未设置领取时间！');
                    return false
                }

                //有效期判断
                if( that.form.periodOfValidity == 0 ){
                    if(that.form.effectiveDays<=0){
                        that.$alert('优惠券的有效期要大于0！');
                        return false;
                    }
                }else if(that.form.periodOfValidity==1){
                    if(that.form.effectiveDays<=0){
                        that.$alert('优惠券的有效期要大于0！');
                        return false;
                    }
                    console.log(that.form.effectivePeriod)
                    if(that.form.effectivePeriod<0){
                        that.$alert('优惠券的领取后生效天数不能小于0！');
                        return false;
                    }else if(that.form.effectivePeriod=='' || that.form.effectivePeriod==null){
                        that.$alert('优惠券的领取后生效天数不能为空！');
                        return false;
                    }
                }else if(that.form.periodOfValidity==2){
                    if(that.form.startTime == '' || that.form.deadline == ''){
                        that.$alert('未设置优惠券的有效期时间！');
                        return false;
                    }
                }

                //计算时间方式判断
                if(that.form.ComputingTime.computingId== ''){
                    that.$alert('请选择计算时间方式');
                    return false;
                }

                //使用限制不为空的时候
                if(that.UsageRestriction.restrictionName != null && that.UsageRestriction.restrictionName !=''){
                    if(that.UsageRestriction.startTime == null || that.UsageRestriction.stoptime == null
                        || that.UsageRestriction.startTime == '' || that.UsageRestriction.stoptime == ''){
                        that.$alert('未设置使用限制时间段！');
                        return false;
                    }
                }
                //判断订单金额
                if(that.form.money<0){
                    that.$alert('订单金额不能小于0！')
                    return false
                }

                if(that.form.PreferentialType.preferentialId==null || that.form.PreferentialType.preferentialId==''){
                    that.$alert('请选择优惠类型！')
                    return false;
                }
                return true
            },
            //查询优惠券
            selectDiscountCoupon(){
                var that = this;
                console.log('优惠券编号');
                console.log(that.$route.query.couponId );
                //判断有是什么操作，有值就是更新操作，没值就是添加操作
                if(that.$route.query.couponId == null || that.$route.query.couponId == ''){
                    that.verify = false;
                    return
                }
                let url = 'http://localhost:8080/discount/findDiscountCoupon?couponId='+that.$route.query.couponId;
                // console.log(url)
                console.log('查询优惠券');
                this.$axios.get(url).then((response) => {
                    var coupons = response.data;
                    console.log(coupons);
                    that.form.couponName = coupons.couponName;
                    that.form.couponType.couponTypeId = coupons.couponType.couponTypeId;
                    that.form.faceValue = coupons.faceValue;
                    that.form.distributionType.distributionId = coupons.distributionType.distributionId;
                    that.form.limitGet = coupons.limitGet;
                    that.form.paymentAmount = coupons.paymentAmount;
                    that.form.begintime = coupons.begintime;
                    that.form.endtime = coupons.endtime;
                    that.form.periodOfValidity = coupons.periodOfValidity;
                    that.form.effectiveDays = coupons.effectiveDays;
                    that.form.effectivePeriod = coupons.effectivePeriod;
                    that.form.startTime = coupons.startTime;
                    that.form.deadline = coupons.deadline;
                    that.form.ComputingTime.computingId = coupons.computingTime.computingId;
                    if(coupons.shop==null){
                        that.form.store.spId = '';
                    }else{
                        that.form.store.spId = coupons.shop.spId;
                    }
                    that.form.money = coupons.money;
                    that.form.PreferentialType.preferentialId = coupons.preferentialType.preferentialId;
                }).catch(function (error) {
                    console.log('出错优惠券')
                })

                let urlOne = 'http://localhost:8080/discount/usagerestriction?couponId='+that.$route.query.couponId;
                // console.log(url)
                console.log('查询使用限制');
                this.$axios.get(urlOne).then((response) => {
                    var UsageRestriction = response.data;
                    that.UsageRestriction.restrictionName = UsageRestriction.restrictionName;
                    that.UsageRestriction.startTime = UsageRestriction.restrictionBeginTime;
                    that.UsageRestriction.stoptime = UsageRestriction.stoptime;
                }).catch(function (error) {
                    console.log('出错使用限制')
                })

                let urlTwo = 'http://localhost:8080/discount/unavailabletype?couponId='+that.$route.query.couponId;
                // console.log(url)
                console.log('查询不可用类型');
                this.$axios.get(urlTwo).then((response) => {
                    var unavailabletype = response.data;
                    that.UnavailableType.unavailableId = unavailabletype.goodsTypeId;
                }).catch(function (error) {
                    console.log('出错不可用类型')
                });
            },
            //查询所有优惠券类型
            selectCouponType(){
                var that = this
                let url = 'http://localhost:8080/discount/coupontypes'
                // console.log(url)
                this.$axios.get(url).then((response) => {
                    that.CouponTypeList = response.data
                })
            },
            //查询所有发放类型
            selectDistributionType(){
                var that = this
                let url = 'http://localhost:8080/discount/distributiontypes'
                // console.log(url)
                this.$axios.get(url).then((response) => {
                    that.DistributionTypeList = response.data
                })
            },
            //查询所有计算时间方式
            selectComputingTime(){
                var that = this
                let url = 'http://localhost:8080/discount/computingtime'
                // console.log(url)
                this.$axios.get(url).then((response) => {
                    that.ComputingTimeList = response.data
                })
            },
            //查询使用限制
            selectUsageRestriction(){
                var that = this
                let url = 'http://localhost:8080/discount/usagerestriction?couponId='+that.form.couponId
                // console.log(url)
                this.$axios.get(url).then((response) => {
                    // that.PreferentialTypeList = response.data
                })
            },
            //查询所有的商品分类
            selectCommdityType(){
                var that = this
                let url = 'http://localhost:8080/goods/findByAll'
                // console.log(url)
                that.$axios.post(url).then((response) => {
                    that.CommdityTypeList = response.data
                })
            },
            //查询所有门店
            selectStoreList(){
                var that = this
                let url = 'http://localhost:8080/shop/findByAll'
                // console.log(url)
                that.$axios.post(url).then((response) => {
                    that.storeList = response.data
                })
            },
            //查询所有优惠类型
            selectPreferentialType(){
                var that = this
                let url = 'http://localhost:8080/discount/preferentialtype'
                // console.log(url)
                this.$axios.get(url).then((response) => {
                    that.PreferentialTypeList = response.data
                })
            },
            //转时间
            dateFormat:function(time) {
                var date=new Date(time);
                var year=date.getFullYear();
                /* 在日期格式中，月份是从0开始的，因此要加0
                 * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
                 * */
                var month= date.getMonth()+1<10 ? "0"+(date.getMonth()+1) : date.getMonth()+1;
                var day=date.getDate()<10 ? "0"+date.getDate() : date.getDate();
                var hours=date.getHours()<10 ? "0"+date.getHours() : date.getHours();
                var minutes=date.getMinutes()<10 ? "0"+date.getMinutes() : date.getMinutes();
                var seconds=date.getSeconds()<10 ? "0"+date.getSeconds() : date.getSeconds();
                // 拼接
                return year+"-"+month+"-"+day+" "+hours+":"+minutes+":"+seconds;
            }
        }
    }
</script>

<style scoped>
    .form{
        text-align: left;
    }
    .radio{
        padding-bottom: 15px;
    }
    .radiotext{
        padding-left: 5px;
        padding-right: 5px;
    }
    .radio:last-child{
        padding-bottom: 7px;
    }
    .usage{
        padding-left: 20px;
        padding-right: 20px;
    }
</style>
