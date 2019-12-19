<template>
	<div>
		<el-row style=" border-radius: 15px;background-color: #F2F6FC;">
			<el-form ref="form" :model="staffEmployee" label-width="80px">
				<br>
				<el-col :span="8" :offset="5">
					<div class="grid-content bg-purple">
						<el-form-item label="店铺名称">
							<el-select v-model="staffEmployee.sfStoreId" placeholder="请选择店铺名称">
								<el-option label="全部" value="0"></el-option>
								<el-option v-for="item in shopMessage" :key="item.spId" :label="item.spName" :value="item.spId" />
							</el-select>
						</el-form-item>
					</div>
				</el-col>
				<el-col :span="8">
					<div class="grid-content bg-purple">
						<el-form-item label="角色类型">
							<el-select v-model="staffEmployee.rid" placeholder="请选择角色类型">
								<el-option label="全部" value="0"></el-option>
								<el-option v-for="item in role" :key="item.id" :label="item.name" :value="item.id" />
							</el-select>
						</el-form-item>
					</div>
				</el-col>
				<el-col :span="8" :offset="5">
					<div class="grid-content bg-purple">
						<el-form-item label="账号状态">
							<el-select v-model="staffEmployee.sfAccountId" placeholder="账号状态">
								<el-option label="全部" value="2"></el-option>
								<el-option label="正常" value="1"></el-option>
								<el-option label="锁定" value="0"></el-option>
							</el-select>
						</el-form-item>
					</div>
				</el-col>
				<el-col :span="8">
					<div class="grid-content bg-purple">
						<el-form-item label="员工姓名">
							<el-input style="width:64%" v-model="staffEmployee.sfEmployName"></el-input>
						</el-form-item>
					</div>
				</el-col>
				<el-col :span="3" :offset="5">
					<div class="grid-content bg-purple">
						<el-form-item>
							<el-button type="primary" round :disabled="judge" @click="add">增加</el-button>
						</el-form-item>
					</div>
				</el-col>
				<el-col :span="3" :offset="5">
					<div class="grid-content bg-purple">
						<el-form-item>
							<el-button type="primary" round icon="el-icon-search" @click="onSubmit()">搜索</el-button>
						</el-form-item>
					</div>
				</el-col>
			</el-form>
		</el-row>
		<el-main>
			<el-table :data="list" style="width: 100%">
				<el-table-column prop="sfEmployeeId" label="员工编号" />
				<el-table-column prop="sfEmployName" label="员工姓名">
				</el-table-column>
				<el-table-column prop="sfEmloyeePhone" label="员工电话">
				</el-table-column>
				<el-table-column prop="spName" label="店铺名称">
				</el-table-column>
				<el-table-column prop="name" label="角色名称">
				</el-table-column>
				<el-table-column prop="sfAccountId" label="账号状态" :formatter="setSfAccountId">
				</el-table-column>
				<el-table-column prop="sfCreateTime" label="创建时间">
				</el-table-column>

				<el-table-column label="操作" width="300">
					<template slot-scope="scope">
						<el-button type="primary" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
						<el-button type="primary" size="small" @click="passwordEdit(scope.row)">修改密码</el-button>
						<el-button type="warning" size="small" @click="stop(scope.$index, scope.row)">停用</el-button>
						<el-button type="danger" size="small" @click="remove(scope.$index, scope.row)">删除</el-button>

						<!-- scope.row代表当前对应行 -->
					</template>
				</el-table-column>
			</el-table>
		</el-main>
		<!--:page-size表示每页显示的数据条数；
		    :total：表示总的数据数量；
		    :page-sizes：表示我们可以自定义每页显示的数量；
		    :currentPage:表示当前的页码；
		    @size-change="handleSizeChange"，@current-change="handleCurrentChange" 是el-pagination中的事件，表示每页显示的数据和页码的变化；
		    layout:表示分页栏的布局;
		    background:表示是否带背景色-->
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
		 :page-size="pageSize" layout="total, prev, pager, next" background :total="total"></el-pagination>

		<!-- 编辑弹窗  -->
		<el-dialog :before-close="handleClose" :title="dialogTitle" width="50%" :visible.sync="iconFormVisible">
			<el-form :model="staff" ref="form" label-width="80px">
				<el-form-item label="店铺名称">
					<el-select v-model="staff.spId" placeholder="请选择店铺名称">
						<el-option v-for="item in shopMessage" :key="item.spId" :label="item.spName" :value="item.spId" />
					</el-select>
				</el-form-item>
				<el-form-item label="角色类型">
					<el-select v-model="staff.id" placeholder="请选择角色类型">
						<el-option v-for="item in role" :key="item.id" :label="item.name" :value="item.id" />
					</el-select>
				</el-form-item>
				<el-form-item label="账号状态">
					<el-select v-model="staff.sfAccountId" placeholder="账号状态">
						<el-option v-for="item in sfAccountId" :key="item.id" :label="item.name" :value="item.id" />
					</el-select>
				</el-form-item>
				<el-form-item label="姓名">
					<el-input style="width:34%" v-model="staff.sfEmployName" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item label="手机">
					<el-input style="width:34%" :disabled="true" v-model="staff.sfEmloyeePhone" placeholder="手机"></el-input>
				</el-form-item>
			</el-form>

			<div slot="footer" class="dialog-footer">
				<el-button @click="iconFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="submitUser()">确 定</el-button>
			</div>
		</el-dialog>

		<!-- 修改密码弹窗  -->
		<el-dialog :before-close="handleClose" :title="dialogTitle" width="50%" :visible.sync="passwordVisible">
			<el-form :model="staff" ref="form" label-width="80px">
				<el-form-item label="登录密码">
					<el-input style="width:34%" v-model="staff.sfPassword" show-password placeholder="登录密码"></el-input>
				</el-form-item>
				<el-form-item label="确认密码">
					<el-input style="width:34%" v-model="staff.sfPassword1" show-password placeholder="确认密码"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="passwordVisible = false">取 消</el-button>
				<el-button type="primary" @click="submitUser()">确 定</el-button>
			</div>
		</el-dialog>


		<!-- 添加弹窗  -->
		<el-dialog :before-close="handleClose" :title="dialogTitle" width="50%" :visible.sync="addiconFormVisible">
			<el-form :model="staff" ref="form" label-width="80px">
				<el-form-item label="店铺名称">
					<el-select v-model="staff.sfStoreId" placeholder="请选择店铺名称">
						<el-option v-for="item in shopMessage" :key="item.spId" :label="item.spName" :value="item.spId" />
					</el-select>
				</el-form-item>
				<el-form-item label="角色类型">
					<el-select v-model="staff.rid" placeholder="请选择角色类型">
						<el-option v-for="item in role" :key="item.id" :label="item.name" :value="item.id" />
					</el-select>
				</el-form-item>
				<el-form-item label="账号状态">
					<el-select v-model="staff.sfAccountId" placeholder="账号状态">
						<el-option v-for="item in sfAccountId" :key="item.id" :label="item.name" :value="item.id" />
					</el-select>
				</el-form-item>
				<el-form-item label="姓名">
					<el-input style="width:34%" v-model="staff.sfEmployName" placeholder="姓名"></el-input>
				</el-form-item>

				<el-form-item label="登录密码">
					<el-input style="width:34%" v-model="staff.sfPassword" show-password placeholder="登录密码"></el-input>
				</el-form-item>

				<el-form-item label="手机">
					<el-input style="width:34%" v-model="staff.sfEmloyeePhone" placeholder="手机"></el-input>
				</el-form-item>
			</el-form>

			<div slot="footer" class="dialog-footer">
				<el-button @click="addiconFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="submitUser()">确 定</el-button>
			</div>
		</el-dialog>

	</div>
</template>

<script>
	export default {
		data() {
			return {
				staffEmployee: {},
				staff: {},
				list: [], //获取遍历集合
				total: 0, //条数
				pageSize: 5,
				currentPage: 1,
				iconFormVisible: false, //判编辑图书的弹窗是否显示
				dialogTitle: '增加', //窗口的名称
				rowIndex: null, //获取选中的行数
				addiconFormVisible: false, //判断添加图书的弹窗是否显示
				judge: true, //判断按钮是否显示
				shopMessage: [],
				role: [],
				agoRid: '',
				sfAccountId: [{
					id: 1,
					name: '正常'
				}, {
					id: 0,
					name: '锁定'
				}],
				phone: '',
				passwordVisible: false,
			}
		}, //加载函数
		created() {
			this.getMessage();
			this.getRole();
			/**
			 * 需要用户角色中有admin角色 才能有增删改查的编辑权限  		
			 * 对权限的一个控制roles admin permissions book:add
			 */
			if ((localStorage.getItem('roles').indexOf('admin') > -1)) {
				this.judge = false;
			}
			//显示列表
			this.showTable();
			this.count();
		},
		methods: {
			handleSizeChange: function(size) {
				this.pageSize = size;
				console.log(this.pageSize); //每页下拉显示数据
				this.showTable();
			},
			handleCurrentChange: function(currentPage) {
				this.currentPage = currentPage;
				console.log(this.currentPage); //点击第几页
				this.showTable();
			},
			stop(index, row) {
				this.$confirm(`确定停用${row.sfEmployName}吗?`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'error',
				}).then(() => {
					this.$axios({
							method: "post",
							url: '/Staff/stopStaff',
							params: {
								"sfEmployeeId": row.sfEmployeeId //row返回的是一个对象
							}
						})
						.then(response => {
							var res = response.data;
							if (res.msg != null) {
								this.$message({
									message: '该用户未拥有该权限',
									type: 'warning'
								});
							} else {
								if (res == true) {
									this.$message({
										message: '停用成功',
										type: 'success'
									});
									this.list[index].sfAccountId = 0;
									this.total--;
								} else {
									this.$message.error('停用失败');
								}
							}
						})
						.catch(error => {
							this.$message.error('网络异常');
						});
				});
			},
			onSubmit() {
				this.showTable();
				this.count();
			},
			showTable() {
				this.$axios.post("/Staff/getStaffList", this.qs.stringify({
					currentPage: this.currentPage,
					pageSize: this.pageSize,
					sfStoreId: this.staffEmployee.sfStoreId,
					rId: this.staffEmployee.rid,
					sfAccountId: this.staffEmployee.sfAccountId,
					sfEmployName: this.staffEmployee.sfEmployName
				})).then((response) => {
					this.list = response.data;
				}).catch((error) => {
					this.$message.error('网络异常'); //请求失败返回的数据
				})
			},

			handleClose(done) {
				this.$confirm('确认关闭弹窗？')
					.then(_ => {
						done();
					})
					.catch(_ => {});
			},
			count() {
				this.$axios.post("/Staff/countStaff", this.qs.stringify({
					sfStoreId: this.staffEmployee.sfStoreId,
					rId: this.staffEmployee.rid,
					sfAccountId: this.staffEmployee.sfAccountId,
					sfEmployName: this.staffEmployee.sfEmployName
				})).then((response) => {
					this.total = response.data;
				}).catch((error) => {
					this.$message.error('网络异常'); //请求失败返回的数据
				})
			},
			handleEdit(index, row) { //打开编辑弹窗
				//设计弹窗标题
				this.dialogTitle = '编辑员工';
				this.staff = row;
				this.agoRid = this.staff.rid;
				//显示弹窗
				this.iconFormVisible = true;
				this.phone = this.staff.sfEmloyeePhone;
				//选中集合行数
				this.rowIndex = index;
			},
			passwordEdit(row) {
				this.dialogTitle = '修改密码';
				this.staff = row;
				this.passwordVisible = true;
			},
			submitUser() { //编辑窗口
				if (this.dialogTitle == '编辑员工') {
					//关闭编辑弹窗
					this.iconFormVisible = false;
					if (
						(this.staff.sfEmloyeePhone == null || this.staff.sfEmloyeePhone == '' || this.staff.sfEmloyeePhone == undefined) ||
						(this.staff.sfEmployName == null || this.staff.sfEmployName == '' || this.staff.sfEmployName == undefined)
					) {
						this.$message({
							message: '选项不能为空！',
							type: 'warning'
						});
					} else {
						/**
						 * $axios的post提交
						 * 参数
						 * 1：api接口路径
						 * 2：需要传入的参数  必须要使用this.qs.stringify的方式传入参数
						 * .then为成功后的请求
						 * .catch为失败的请求
						 */
						this.$axios.post("/Staff/updateStaff", this.qs.stringify({
							sfEmployeeId: this.staff.sfEmployeeId,
							sfStoreId: this.staff.sfStoreId,
							sfAccountId: this.staff.sfAccountId,
							sfEmloyeePhone: this.staff.sfEmloyeePhone,
							sfEmployName: this.staff.sfEmployName,
							sfPassword: this.staff.sfPassword,
							rid: this.staff.rid,
							agoRid: this.agoRid,
						})).then((response) => {
							var res = response.data;
							if (res.msg != null) {
								this.$message({
									message: '该用户未拥有该权限',
									type: 'warning'
								});
							} else {
								if (res == true) {
									this.$message({
										message: '编辑成功',
										type: 'success'
									});
									this.showTable();
									this.staff = {};
								} else {
									this.$message.error('编辑失败')
								}
							}
						}).catch((error) => {
							this.$message.error('网络异常'); //请求失败返回的数据
						});
					}

					return;
				} else if (this.dialogTitle == '增加员工') {
					//关闭添加弹窗
					this.addiconFormVisible = false;
					if ((this.staff.sfPassword == null || this.staff.sfPassword == '' || this.staff.sfPassword == undefined) ||
						(this.staff.sfEmloyeePhone == null || this.staff.sfEmloyeePhone == '' || this.staff.sfEmloyeePhone == undefined) ||
						(this.staff.sfEmployName == null || this.staff.sfEmployName == '' || this.staff.sfEmployName == undefined) ||
						(this.staff.sfStoreId == null || this.staff.sfStoreId == '' || this.staff.sfStoreId == undefined) ||
						(this.staff.sfAccountId == null || this.staff.sfAccountId == '' || this.staff.sfAccountId == undefined) ||
						(this.staff.rid == null || this.staff.rid == '' || this.staff.rid == undefined)
					) {
						this.$message({
							message: '选项不能为空！',
							type: 'warning'
						});
					} else {
						/**
						 * $axios的post提交
						 * 参数
						 * 1：api接口路径
						 * 2：需要传入的参数  必须要使用this.qs.stringify的方式传入参数
						 * .then为成功后的请求
						 * .catch为失败的请求
						 */
						this.$axios.post("/Staff/addStaff", this.qs.stringify({
							sfStoreId: this.staff.sfStoreId,
							sfAccountId: this.staff.sfAccountId,
							sfEmloyeePhone: this.staff.sfEmloyeePhone,
							sfEmployName: this.staff.sfEmployName,
							sfPassword: this.staff.sfPassword,
							rid: this.staff.rid
						})).then((response) => {
							var res = response.data;
							if (res.msg != null) {
								this.$message({
									message: '该用户未拥有该权限',
									type: 'warning'
								});
							} else {
								if (res != 0 && res != null) {
									this.$message({
										message: '添加成功',
										type: 'success'
									});
									this.showTable();
									this.total++;
									this.staff = {};
								} else {
									this.$message.error('添加失败');
								}
							}
						}).catch((error) => {
							this.$message.error('网络异常'); //请求失败返回的数据
						});
					}
					return;
				} else {
					this.passwordVisible = false;
					if (this.staff.sfPassword == null || this.staff.sfPassword == '' || this.staff.sfPassword == undefined) {
						this.$message({
							message: '密码不能为空！',
							type: 'warning'
						});
					} else if (this.staff.sfPassword.length < 8 || this.staff.sfPassword1.length < 8) {
						alert(this.staff.sfPassword1)
						this.$message({
							message: '密码不能少于八位！',
							type: 'warning'
						});
					} else if (this.staff.sfPassword !== this.staff.sfPassword1) {
						this.$message({
							message: '两次密码不匹配！',
							type: 'warning'
						});
					} else {
						this.$axios.post("/Staff/updateStaffPassword", this.qs.stringify({
							sfEmloyeePhone: this.staff.sfEmloyeePhone,
							sfEmployeeId: this.staff.sfEmployeeId,
							sfPassword: this.staff.sfPassword,
						})).then((response) => {
							var res = response.data;
							if (res.msg != null) {
								this.$message({
									message: '该用户未拥有该权限',
									type: 'warning'
								});
							} else {
								if (res != 0 && res != null) {
									this.$message({
										message: '修改成功',
										type: 'success'
									});
									this.staff.sfPassword = '';
									this.staff = {};
								} else {
									this.$message.error('修改失败');
								}
							}
						}).catch((error) => {
							this.$message.error('网络异常'); //请求失败返回的数据
						});
					}
					return;
				}
			},
			add() {
				//修改弹窗 标题
				this.dialogTitle = '增加员工';
				this.staff = {};
				//打开添加弹窗
				this.addiconFormVisible = true;
			},
			setSfAccountId(row) {
				if (row.sfAccountId === 0) {
					return '锁定';
				} else {
					return '正常';
				}
			},
			getMessage() {
				this.$axios.post("/Staff/getMessage", this.qs.stringify({})).then((response) => {
					var res = response.data;
					if (res.msg != null) {
						this.$message({
							message: '该用户未拥有该权限',
							type: 'warning'
						});
					} else {
						this.shopMessage = res;
					}
				}).catch((error) => {
					this.$message.error('网络异常'); //请求失败返回的数据
				});
			},
			getRole() {
				this.$axios.post("/Staff/getRole", this.qs.stringify({})).then((response) => {
					var res = response.data;
					if (res.msg != null) {
						this.$message({
							message: '该用户未拥有该权限',
							type: 'warning'
						});
					} else {
						this.role = res;
					}
				}).catch((error) => {
					this.$message.error('网络异常'); //请求失败返回的数据
				});
			},
			remove(index, row) { //删除一条记录
				this.$confirm(`确定删除${row.sfEmployName}吗?`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'error',
				}).then(() => {
					this.$axios({
							method: "post",
							url: '/Staff/deleteStaff',
							params: {
								"sfEmployeeId": row.sfEmployeeId //row返回的是一个对象
							}
						})
						.then(response => {
							var res = response.data;
							if (res.msg != null) {
								alert('该用户未拥有该权限')
							} else {
								if (res == true) {
									alert("删除成功");
									this.total--;
									this.list.splice(index, 1); //删除当前list对象
								} else {
									this.$message.error('删除失败');
								}
							}
						})
						.catch(error => {
							this.$message.error('网络异常');
						});
				});
			}
		}
	}
</script>

<style>
</style>
