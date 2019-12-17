<template>
  <div id="app">
    <el-menu
      class="el-menu-demo"
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <el-menu-item index="1">拼团活动</el-menu-item>
    </el-menu>
    <br />
    <el-row>
      <el-col :span="1" class="grid">
        <el-button
          type="success"
          @click="addPurchase()"
          icon="el-icon-circle-plus-outline"
          round
        >新增团购</el-button>
      </el-col>
			<div class="serach">
				<el-input placeholder="请输入搜索的词" v-model="Purchase.activityNamei" clearable style="width: 10.625rem;" @clear="getPurchaseList()"></el-input>
				<el-button type="success" @click="getPurchaseList()" style="display: inline-block;">搜索</el-button>
			</div>
    </el-row>
		<br />
    <el-table 
      :data="PurchaseList"
      border
      style="width: 100%"
      stripe
      ref="multipleTable"
      tooltip-effect="dark"
    >
      <el-table-column label="序号" type="index" width="80px" align="center">
        <template slot-scope="scope">
          <span>{{(page - 1) * size + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="activityName" label="拼团名称" ></el-table-column>
      <el-table-column prop="activityNumber" label="默认拼团人数" align="center"></el-table-column>
      <el-table-column prop="validHours" label="拼团时限" :formatter='analysiss' align="center"></el-table-column>
			<el-table-column label="活动时长" width="170px">
				<template slot-scope="scope">
					<span>{{(scope.row.startTime)}}</span>至<span>{{(scope.row.endTime)}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="activitySameTime" label="用户限参团数" align="center"></el-table-column>
			<el-table-column prop="activityState" label="活动状态" :formatter='analysis'></el-table-column>
			<el-table-column prop="creationTime" label="录入时间"></el-table-column>
      <el-table-column label="编辑" width="100">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="editPurchase(scope.row)">修改</el-button>
        </template>
      </el-table-column>
      <el-table-column label="删除" width="100">
        <template slot-scope="scope">
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="delPurchase(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[5, 10, 20]"
      :page-size="size"
      style="float:right"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <el-dialog
      :title="addFlag?'新增活动':'修改活动'"
      style="text-align:left !important"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
    >
      <el-form ref="form" label-width="120px" style="display: block;content: 0px;">
				<el-row>
					<el-col :span="8">
						<el-form-item label="拼团名称:">
							<el-input v-model="Purchase.activityName" style="width:138px"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="默认拼团人数:">
							<el-input v-model="Purchase.activityNumber" style="width:80px"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="拼团时限:">
							<el-input v-model="Purchase.validHours" style="width:80px"></el-input>小时
						</el-form-item>
					</el-col>
				</el-row>
				<template>
					<div class="block">
						<el-form-item label="活动时间:">
							<el-date-picker
							  v-model="Purchase.startTime"
							  type="datetime"
								format="yyyy-MM-dd HH:mm:ss"
								value-format="yyyy-MM-dd HH:mm:ss"
							  placeholder="选择日期">
							</el-date-picker>至
							<el-date-picker
							  v-model="Purchase.endTime"
							  type="datetime"
								format="yyyy-MM-dd HH:mm:ss"
								value-format="yyyy-MM-dd HH:mm:ss"
							  placeholder="选择日期">
							</el-date-picker>
						</el-form-item>
						
					</div>
				</template>
				<el-row>
					<el-col :span="8">
						<el-form-item  label="用户同时参团数:">
							<el-input v-model="Purchase.activitySameTime" style="width:80px"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="参团可购买件数:">
							<el-input v-model="Purchase.limitedQuantity" style="width:80px"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="其他参数人数,多个英文逗号隔开:">
							<el-input v-model="Purchase.parameters"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-form-item label="说明:">
					<el-input
						type="textarea"
						:rows="4" 
						v-model="Purchase.remarks">
					</el-input>
				</el-form-item>
				<el-form-item label="选择门店:">
					<template>
						<el-transfer
							style="text-align: left;line-height: 0px;"
							v-model="value"
							:data="this.listData"
							:titles="['所有门店', '已选择的门店']"
							:button-texts="['删除', '添加']"
						>
						</el-transfer>
					</template>
				</el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="success" @click="savePurchase()" style="display: inline-block;">保存</el-button>
        <el-button type="primary" @click="dialogVisible = false" style="display: inline-block;">取消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="提示"
      style="text-align:left !important"
      :visible.sync="dialog2Visible"
      :before-close="handleClose"
    >
      <span>你确定要删除这个活动吗?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleDel()">提交</el-button>
        <el-button type="primary" @click="dialog2Visible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import qs from "qs";
export default {
  data() {
    return {
      dialogVisible: false,
      dialog2Visible: false,
      total: 0,
      size: 5,
      page: 1,
      PurchaseList: [],
      Purchase: {},
      addFlag: true,
      curId: "",
			listData:[],
			value:[],
    };
  },
  watch:{
      total(){
        if(this.total==(this.page-1)*this.size && this.total!=0){
          this.page-=1;
          this.getPurchaseList()
        }
      }
    },
  methods: {
		analysis(row){
			if (row.activityState == '1') {
				return "活动正在进行中"
			} else if (row.activityState == '0') {
				return "活动已失效"
			}else{
				return "--"
			}
		},
		analysiss(row){
			return row.validHours+"小时"
		},
    handleClose(done) {
      done();
    },
    handleSizeChange(val){
      this.size = val
      this.getPurchaseList()
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getPurchaseList();
    },
    async getPurchaseList() {
      try {
        let res = await axios.post(
          "/Purchase/list",
          qs.stringify({
            index: this.page,
            pageSize: this.size,
						activityName: this.Purchase.activityNamei,
          })
        );
        this.total = res.data.Total;
        this.PurchaseList = res.data.pageUtil.list;
      } catch (e) {
        console.log(e);
      }
    },
    async savePurchase() {
      try {
        let res = await axios.post(
          "/Purchase/save",
          qs.stringify({
						activitiesId: this.Purchase.activitiesId,
						activityName: this.Purchase.activityName,
						activityNumber: this.Purchase.activityNumber,
						activitySameTime: this.Purchase.activitySameTime,
						validHours: this.Purchase.validHours,
						limitedQuantity: this.Purchase.limitedQuantity,
						startTime: this.Purchase.startTime,
						endTime: this.Purchase.endTime,
						storeId: this.value.join(),
						parameters:this.Purchase.parameters,
						remarks:this.Purchase.remarks,
          })
        );
        this.dialogVisible = false;
        this.Purchase = {};
        this.$message({
          message: res.data.Msg,
          type: "success"
        });
        this.getPurchaseList();
      } catch (e) {
        console.log(e);
      }
    },
    delPurchase(row) {
      this.addFlag = false;
      this.dialog2Visible = true;
      this.curId = row.activitiesId;
    },
    async handleDel() {		
      try {
        let res = await axios.post(
          "/Purchase/del",
          qs.stringify({
            activitiesId: this.curId
          })
        );
        this.curId = "";
        this.dialog2Visible = false;
        this.$message({
          message: res.data.Msg,
          type: "success"
        });
        this.getPurchaseList();
      } catch (e) {
        console.log(e);
      }
    },
    editPurchase(row) {
      this.Purchase = row;
			let strNum =[];
			let str=this.Purchase.storeId.split(",");
			for (let i=0;i<str.length;i++){
				strNum.push(parseInt(str[i]));
			}		
			this.value = strNum;		
      this.dialogVisible = true;
      this.addFlag = false;
    },
		addPurchase() {
			this.Purchase = {};
			this.value = [];
			this.dialogVisible = true;
			this.addFlag = true;
		},
		generateData() {
			var data = [];
		  axios.get("/Purchase/shopList").then(({data:result})=>{
		  	let list = result.shopList;
				list.forEach(({spId,spName})=>{
					var k={
						spId,
						spName,
					}				
					data.push({
						key:k.spId,
						label:k.spName,
					});
				});
				this.listData=data;
			});
		},
  },
  mounted() {
    this.getPurchaseList();
		this.generateData();
  }
};
</script>

<style type="text/css">
#app {
  font-family: Helvetica, sans-serif;
  text-align: center;
}
.el-button {
	display: block;
	padding: 10px;
}
.serach{
	text-align: right;
}
</style>
