<template>
	<div class="add">
		<el-form ref="form" :model="fullActivity" label-width="90px">
			<el-form-item label="活动名称">
				<el-input v-model="fullActivity.activityName" style="width: 40%;"></el-input>
			</el-form-item>
			<el-form-item label="活动说明">
				<el-input type="textarea" v-model="fullActivity.activityDetail" style="width: 40%;"></el-input>
			</el-form-item>
			<el-form-item label="活动时间">
				<el-date-picker v-model="fullActivity.activityTime" type="date" placeholder="选择日期"></el-date-picker>
			</el-form-item>
			<el-form-item label="活动范围">
				<el-cascader v-model="value" :options="options" @change="handleChange"></el-cascader>
			</el-form-item>
			<el-form-item>
				<el-radio v-model="fullActivity.type.typeid" label="1">满减活动</el-radio>
				<el-radio v-model="fullActivity.type.typeid" label="2">满赠活动</el-radio>
			</el-form-item>
			<el-form-item label="单笔金额满:">
				<el-input v-model="fullActivity.money" style="width: 20%;"></el-input>
			</el-form-item>

			<el-form-item>
				<el-button type="primary" @click="add()" @keyup.enter.native="add()">添加</el-button>
				<el-button>取消</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>
<script>
import axios from 'axios';
import qs from 'qs';
export default {
	data() {
		return {
			//判断添加
			dialogVisible: true,
			//活动编号
			activityid:'',
			fullActivity:{
				activityName:'',
				activityDetail:'',
				activityTime:'',
				type:{
					typeid:'',
				},
				money:'',
			},
			// fullActivity:{},
			goods: {},
			goodsList: [],
			curId: '',
			value: [],
			options: [
				{
					value: '1',
					label: '全场',
				},
			],
			goodTypeList:[],
			commodityList:[],
			emulateJSON:true
		};
	},
	created() {
		this.getAllGoods();
	},
	methods: {
		//级联转换器中显示范围，商品分类，商品
		 getAllGoods() {
			var that = this;
			var url = 'http://localhost:8080/goodschild/findGT';
			// console.log(url)
			this.$axios.post(url).then((res) =>{
				// console.log(res.data);
				that.options.push({value: '2',label: '部分商品',children: res.data});
				that.options.push({value: '3',label: '指定商品',children: res.data});
			})
		},
		//转换时间
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
        },
		//添加
		add() {
			var that = this;
			 //验证
			 var judge = that.checks();
			  console.log(judge);
			  if(!judge){
			      console.log('跳出方法');
			      return;
			  }
			let url = 'http://localhost:8080/fullActivity/add';
			that.$axios.get(url,{
				params:{
						activityName: that.fullActivity.activityName,
						typeid:that.fullActivity.type.typeid,
						activityTime: that.dateFormat(that.fullActivity.activityTime),
						rangeid:that.value[0],
						activityState:'停用',
						executingState:'未执行',
						activityDetail: that.fullActivity.activityDetail,
						deleteState:0,
						goodsCommodityId:that.value[2],
						goodsTypeId:that.value[1],
						money:that.fullActivity.money
				}
			}).then((res) => {
				console.log(res.data);
				this.$router.replace('/fu')

			}).catch(function(e){
				console.log(e)
			})
		},
			//非空判断
			  checks(){
				   var that = this;
				  //判断活动名称
				  if(that.fullActivity.activityName==""){
					  that.$alert('活动名称不能为空！');
					  return false;
				  }
				  //判断活动名称
				  if(that.fullActivity.activityDetail==""){
				  	  that.$alert('活动说明不能为空！');
				  	  return false;
				  }
				  //判断活动时间
				  if(that.fullActivity.activityTime==""){
				  	  that.$alert('未选择活动时间！');
				  	  return false;
				  }
				  // //判断活动范围
				  // if(that.fullActivity.value==""){
				  // 	  that.$alert('未选择活动范围！');
				  // 	  return false;
				  // }
				  //判断活动类型
				  if(that.fullActivity.type.typeid==""){
				  	  that.$alert('未选择活动类型！');
				  	  return false;
				  }
				  //判断参加活动金额
				  if(that.fullActivity.money==""){
				  	  that.$alert('未规定参加活动金额！');
				  	  return false;
				  }
				  return true;
			  }
			
	},
	}
</script>

<style>
.add {
	text-align: left;
}
</style>
