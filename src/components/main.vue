<template>
	<el-container style="height: 100%; border: 1px solid #eee">
		<!--头部-->
		<el-header height="80px" width="100%">
			<el-menu :default-active="activeIndex2" class="el-menu-demo" mode="horizontal" background-color="#545c64" text-color="#fff"
					 active-text-color="#ffd04b">
				<el-submenu index="2">
					<template slot="title">我的</template>
					<el-menu-item index="2-1">修改密码</el-menu-item>
					<el-menu-item index="2-2">我的信息</el-menu-item>
					<el-menu-item index="2-3">切换账号</el-menu-item>
				</el-submenu>
				<el-menu-item index="4" @click="clearCache">退出登录</el-menu-item>
			</el-menu>
		</el-header>
		<el-container style="overflow-y: hidden;">

			<el-row class="tac">
				<el-col :span="12" style="width: 214px">
					<el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
						<el-submenu index="1">
							<template slot="title"><i class="el-icon-menu"></i>门店</template>
							<el-menu-item-group>
								<el-menu-item index="2-1" @click="goTo('/ShopMessage')">门店列表</el-menu-item>
								<el-menu-item index="2-2" @click="goTo('/StaffList')">员工列表</el-menu-item>
							</el-menu-item-group>
						</el-submenu>

						<el-submenu index="2">
							<template slot="title"><i class="el-icon-menu"></i>商品</template>
							<el-menu-item-group>
								<template slot="title">分组一</template>
								<el-menu-item index="2-1">选项1</el-menu-item>
								<el-menu-item index="2-2">选项2</el-menu-item>
							</el-menu-item-group>
							<el-menu-item-group title="分组2">
								<el-menu-item index="2-3">选项3</el-menu-item>
							</el-menu-item-group>
							<el-submenu index="2-4">
								<template slot="title">选项4</template>
								<el-menu-item index="2-4-1">选项4-1</el-menu-item>
							</el-submenu>
						</el-submenu>

						<el-submenu index="3">
							<template slot="title"><i class="el-icon-menu"></i>订单</template>
							<el-menu-item-group>
								<template slot="title">分组一</template>
								<el-menu-item index="2-1">选项1</el-menu-item>
								<el-menu-item index="2-2">选项2</el-menu-item>
							</el-menu-item-group>
							<el-menu-item-group title="分组2">
								<el-menu-item index="2-3">选项3</el-menu-item>
							</el-menu-item-group>
							<el-submenu index="2-4">
								<template slot="title">选项4</template>
								<el-menu-item index="2-4-1">选项4-1</el-menu-item>
							</el-submenu>
						</el-submenu>

						<el-submenu index="4">
							<template slot="title"><i class="el-icon-menu"></i>会员</template>
							<el-menu-item-group>
								<template slot="title">会员</template>
								<el-menu-item index="2-1">
									<router-link to="/member"  replace>会员信息</router-link>
								</el-menu-item>
								<el-menu-item index="2-2">
									<router-link to="/comments"  replace>会员评价信息</router-link>
								</el-menu-item>
							</el-menu-item-group>
						</el-submenu>

						<el-submenu index="5">
							<template slot="title"><i class="el-icon-menu"></i>营销</template>
							<el-menu-item-group>
								<template slot="title">分组一</template>
								<el-menu-item index="2-1">选项1</el-menu-item>
								<el-menu-item index="2-2">选项2</el-menu-item>
							</el-menu-item-group>
							<el-menu-item-group title="分组2">
								<el-menu-item index="2-3">选项3</el-menu-item>
							</el-menu-item-group>
							<el-submenu index="2-4">
								<template slot="title">选项4</template>
								<el-menu-item index="2-4-1">选项4-1</el-menu-item>
							</el-submenu>
						</el-submenu>

						<el-submenu index="6">
							<template slot="title"><i class="el-icon-menu"></i>文章</template>
							<el-menu-item-group>
								<template slot="title">文章列表</template>
								<el-menu-item index="2-1" ><router-link to="/Article"  replace>查看文章列表</router-link></el-menu-item>
								<el-menu-item index="2-2"><router-link to="/SaveArticle"  replace>添加文章列表</router-link></el-menu-item>
							</el-menu-item-group>
							<el-menu-item-group>
								<template slot="title" >文章分类</template>
								<el-menu-item index="2-1" ><router-link to="/ArticleType"  replace>查看文章分类</router-link></el-menu-item>
								<el-menu-item index="2-2"><router-link to="/SaveArticleType"  replace>添加文章分类</router-link></el-menu-item>
							</el-menu-item-group>
						</el-submenu>

						<el-submenu index="7">
							<template slot="title"><i class="el-icon-menu"></i>广告</template>
							<el-menu-item-group>
								<template slot="title">分组一</template>
								<el-menu-item index="2-1">选项1</el-menu-item>
								<el-menu-item index="2-2">选项2</el-menu-item>
							</el-menu-item-group>
							<el-menu-item-group title="分组2">
								<el-menu-item index="2-3">选项3</el-menu-item>
							</el-menu-item-group>
							<el-submenu index="2-4">
								<template slot="title">选项4</template>
								<el-menu-item index="2-4-1">选项4-1</el-menu-item>
							</el-submenu>
						</el-submenu>

						<el-submenu index="8">
							<template slot="title"><i class="el-icon-menu"></i>系统</template>
							<el-menu-item-group>
								<template slot="title">物流</template>
								<el-menu-item index="2-1" ><router-link to="/freight"  replace>物流管理</router-link></el-menu-item>
								<el-menu-item index="2-2">选项2</el-menu-item>
							</el-menu-item-group>
							<el-menu-item-group title="分组2">
								<el-menu-item index="2-3">选项3</el-menu-item>
							</el-menu-item-group>
							<el-submenu index="2-4">
								<template slot="title">选项4</template>
								<el-menu-item index="2-4-1">选项4-1</el-menu-item>
							</el-submenu>
						</el-submenu>

						<!-- <el-menu-item index="/BooksList" @click="goTo('/BooksList')">
                                            <i class="el-icon-menu"></i>
                                            <span slot="title">图书管理</span>
                                        </el-menu-item> -->
					</el-menu>
				</el-col>
			</el-row>

			<el-main>
				<router-view />
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
	//映入 写好的cookie获取缓存
	import {
		setCookie,
		getCookie
	} from '../assets/cookie.js';
	export default {
		data() {
			return {};
		},
		created() {},
		methods: {
			handleOpen(key, keyPath) {
				console.log(key, keyPath);
			},
			handleClose(key, keyPath) {
				console.log(key, keyPath);
			},
			goTo(path) {
				/**
				 * 跳转页面
				 * 参数path 为跳转的页面
				 */
				this.$router.replace(path);
			},
			clearCache() { //清除缓存
				/**
				 * 修改缓存
				 * 参数、
				 * 1：缓存名称
				 * 2：缓存内容
				 * 3：缓存有效时间   -1失效
				 */
				setCookie('roles', '', -1);
				/**
				 * 清空localStorage中的缓存信息
				 */
				localStorage.setItem("ms_username", ''); // 使用localstoage来记录登陆信息
				localStorage.setItem("roles", '');
				localStorage.setItem("permissions", '');

				this.$router.replace('/login');
			}
		}
	};
</script>

<style>
</style>
