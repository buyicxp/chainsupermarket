<template>
	<body id="poster">
	<el-form class="login-container" label-position="left"
			 label-width="0px" :model="userInfo">
		<h3 class="login_title">后台登录</h3>
		<el-form-item>
			<el-input type="text" v-model="userInfo.username"
					  auto-complete="off" placeholder="请输入账号"></el-input>
		</el-form-item>
		<el-form-item>
			<el-input type="password" v-model="userInfo.password"
					  auto-complete="off" placeholder="请输入密码"></el-input>
		</el-form-item>
		<el-form-item style="width: 100%">
			<el-button type="primary" style="width: 100%;background: #505458;border: none" v-on:click="submitUser()">登录</el-button>
		</el-form-item>
	</el-form>
	</body>
</template>

<script>

	import {Ht} from  "../../assets/Ht"
	import {
		setCookie,
		getCookie
	} from '../../assets/cookie.js';
	export default {
		data() {
			return {
				userInfo: {
					username: '',
					password: ''
				}
			}
		},
		methods: {
			submitUser() {
				alert(1);
				this.$axios.post("/user/login/", this.qs.stringify({
					'nickname': this.userInfo.username,
					'password': this.userInfo.password
				})).then((response) => {
					var res = response.data.msg;
					alert(res);
					if (res == '登录成功') {
						setCookie('roles', response.data.success.roleList,(24*60*60)); // 使用cookie来记录是否登陆，这边跨域
						let roles = getCookie('roles');
						localStorage.setItem("ms_username", this.username); // 使用localstoage来记录登陆信息
						localStorage.setItem("roles", response.data.success.roleList);
						localStorage.setItem("permissions", response.data.success.permissionList);
						this.$router.replace('/main'); //跳转
					} else {
						alert('登录失败')
					}
				}).catch((error) => {
					alert(error) //请求失败返回的数据
				})
			}
		}
	}
</script>

<style>
	#poster {
		height: 100%;
		width: 100%;
		background-size: cover;
		position: fixed;
		background-color: rgba(243, 152, 255, 0.2)
	}
	body{
		margin: 0px;
	}
	.login-container {
		border-radius: 15px;
		background-clip: padding-box;
		margin: 220px auto;
		width: 350px;
		padding: 35px 35px 15px 35px;
		background: #fff;
		border: 1px solid #eaeaea;
		box-shadow: 0 0 25px #cac6c6;
	}
	.login_title {
		margin: 0px auto 40px auto;
		text-align: center;
		color: #505458;
	}
</style>


