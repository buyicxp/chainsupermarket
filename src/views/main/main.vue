<template>
	<el-container style="height: 100%; border: 1px solid #eee">
		<!--头部-->
		<el-header height="60px" width="100%">
			<el-menu class="el-menu-demo" mode="horizontal" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
				<el-submenu index="2">
					<template slot="title">
						我的
					</template>
					<el-menu-item index="2-1">修改密码</el-menu-item>
					<el-menu-item index="2-2">我的信息</el-menu-item>
					<el-menu-item index="2-3">切换账号</el-menu-item>
				</el-submenu>
				<el-menu-item index="4" @click="clearCache">退出登录</el-menu-item>
			</el-menu>
		</el-header>
		<el-container>
			<el-row class="tac" style="background-color:white;text-align:left;padding-left:20px">
				<el-col :span="12" style="width:214px">
					<el-menu router default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
						<el-submenu index="1">
							<template slot="title">
								<i class="el-icon-menu">门店</i>
							</template>
							<el-menu-item-group>
								<el-menu-item index="2-1" @click="goTo('/ShopMessage')">门店列表</el-menu-item>
								<el-menu-item index="2-2" @click="goTo('/StaffList')">员工列表</el-menu-item>
							</el-menu-item-group>
						</el-submenu>

						<el-submenu index="2">
							<template slot="title">
								<i class="el-icon-menu">商品</i>
							</template>
							<el-menu-item-group>
								<el-menu-item index="/goodstype">商品分类</el-menu-item>
								<el-menu-item index="/Commodity">商品列表</el-menu-item>
							</el-menu-item-group>
						</el-submenu>

						<el-submenu index="3">
							<template slot="title">
								<i class="el-icon-menu">订单</i>
							</template>
							<el-menu-item-group>
								<el-menu-item index="/OrderForm">商品订单</el-menu-item>
							</el-menu-item-group>
						</el-submenu>

						<el-submenu index="4">
							<template slot="title">
								<i class="el-icon-menu">物流</i>
							</template>
							<el-menu-item-group>
<!--								<el-menu-item index="2-1" ><router-link to="/freight"  replace>物流管理</router-link></el-menu-item>-->
								<el-menu-item index="/freight">物流详情</el-menu-item>
							</el-menu-item-group>
						</el-submenu>

						<el-submenu index="5">
							<template slot="title">
								<i class="el-icon-menu">营销</i>
							</template>
							<el-submenu index="5-1">
								<template slot="title">满减满赠</template>
								<el-menu-item index="/fu">满减满赠</el-menu-item>
								<el-menu-item index="/add">新增满减满赠</el-menu-item>
							</el-submenu>
							<el-submenu index="5-2">
								<template slot="title">拼团管理</template>
								<el-menu-item index="/GroupActivities">拼团活动</el-menu-item>
							</el-submenu>
							<el-submenu index="5-3">
								<template slot="title">抢购管理</template>
								<el-menu-item index="/PanicBuying">抢购活动</el-menu-item>
							</el-submenu>
							<el-submenu index="5-4">
								<template slot="title">预售管理</template>
								<el-menu-item index="/presell">预售活动</el-menu-item>
							</el-submenu>
							<el-submenu index="5-5">
								<template slot="title">
									优惠券管理
								</template>
								<el-menu-item index="/DiscountCouponInfo">优惠券</el-menu-item>
								<el-menu-item index="/AddDsicountCoupon">优惠券设置</el-menu-item>
							</el-submenu>
						</el-submenu>
						<el-submenu index="6">
							<template slot="title">
								<i class="el-icon-menu">会员</i>
							</template>
							<el-menu-item index="/member">会员信息</el-menu-item>
							<el-menu-item index="/comments">会员评价信息</el-menu-item>
						</el-submenu>

						<el-submenu index="7">
							<template slot="title">
								<i class="el-icon-menu">文章</i>
							</template>
							<el-menu-item index="/Article">查看文章列表</el-menu-item>
							<el-menu-item index="/SaveArticle">添加文章列表</el-menu-item>
							<el-menu-item index="/ArticleType">查看文章分类</el-menu-item>
							<el-menu-item index="/SaveArticleType">添加文章分类</el-menu-item>



							<el-submenu index="2-4">
								<template slot="title">
									选项4
								</template>
								<el-menu-item index="2-4-1">选项4-1</el-menu-item>
							</el-submenu>
						</el-submenu>

						<el-submenu index="8">
							<template slot="title">
								<i class="el-icon-menu">广告</i>
							</template>
							<el-menu-item-group>
								<el-menu-item index="/advertisingList">广告列表</el-menu-item>
								<el-menu-item index="/advertisingType">广告类型</el-menu-item>
							</el-menu-item-group>
						</el-submenu>

						<el-submenu index="9">
							<template slot="title">
								<i class="el-icon-menu">系统</i>
							</template>
							<el-menu-item-group>
								<template slot="title">
									分组一
								</template>
								<el-menu-item index="2-1">选项1</el-menu-item>
								<el-menu-item index="2-2">选项2</el-menu-item>
							</el-menu-item-group>
							<el-menu-item-group title="分组2"><el-menu-item index="2-3">选项3</el-menu-item></el-menu-item-group>
							<el-submenu index="2-4">
								<template slot="title">
									选项4
								</template>
								<el-menu-item index="2-4-1">选项4-1</el-menu-item>
							</el-submenu>
						</el-submenu>
					</el-menu>
				</el-col>
			</el-row>
			<el-main><router-view /></el-main>
		</el-container>
	</el-container>
</template>

<script>
//映入 写好的cookie获取缓存
import { setCookie, getCookie } from '../../assets/cookie.js';

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
		clearCache() {
			//清除缓存
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
			localStorage.setItem('ms_username', ''); // 使用localstoage来记录登陆信息
			localStorage.setItem('roles', '');
			localStorage.setItem('permissions', '');

			this.$router.replace('/login');
		}
	}
};
</script>

<style></style>
