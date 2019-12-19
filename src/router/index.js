import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [{
		path: '/',
		name: 'home',
		component: Home
	},
	{
		path: '/main',
		name: 'main',
		component: () => import( /* webpackChunkName: "about" */ '../views/main/main.vue'),
		meta: {
			title: '权限测试',
			permission: true //开启权限验证
		},
		children: 
		[
			{
				path: '/GroupActivities',
				name: 'GroupActivities',
				component: () => import( /* webpackChunkName: "about" */ '../views/marketing/GroupActivities.vue')
			},
			{
				path: '/fu',
				name:'fu',
				component: () => import( /* webpackChunkName: "about" */ '../views/marketing/FullActivity.vue')
			},
			//新建满减满赠页面
			{
				path: '/add',
				name:'add',
				component: () => import (  /* webpackChunkName: "about" */  '../views/marketing/AddActivity.vue') 
			},
			{
				path: '/advertisingType',
				name:'advertisingType',
				component: () => import( /* webpackChunkName: "about" */  '../views/advertising/advertisingType.vue')
			},
			{
				path: '/advertisingList',
				name:'advertisingList',
				component: () => import( /* webpackChunkName: "about" */  '../views/advertising/advertisingList.vue')
			},
			{
			  path: '/DiscountCouponInfo',
			  name: 'DiscountCouponInfo',
			  component: () => import( /* webpackChunkName: "about" */ '../views/marketing/DiscountCouponInfo.vue')
			},
			{
			  path: '/AddDsicountCoupon',
			  name: 'AddDsicountCoupon',
			  component: () => import( /* webpackChunkName: "about" */ '../views/marketing/AddDsicountCoupon.vue')
			},
			{
			  path: '/CouponCollectionInfo',
			  name: 'CouponCollectionInfo',
			  component: () => import( /* webpackChunkName: "about" */ '../views/marketing/CouponCollectionInfo.vue')
			},
			{
				path: "/goodstype",
				name: "goodstype",
				component: () => import('../views/commodity/goodstype.vue')
			},
			{
				path: "/Commodity",
				name: "Commodity",
				component: () => import('../views/commodity/Commodity.vue')
			},
			{
				path: "/orderform",
				name: "orderform",
				component: () => import('../views/orderform/OrderForm.vue')
			},
			{
				path: '/addGoods',
				name: 'addGoods',
				component: () => import('../views/commodity/addGoods.vue')
			},
		]
	},
	{
		path: '/login',
		name: 'login',
		component: () => import( /* webpackChunkName: "about" */ '../views/log/login.vue')
	},
	
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

export default router
