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
		children: [ {
			//商品类型
			path: "/goodstype",
			name: "goodstype",
			component: () => import('../views/commodity/goodstype.vue')
		},
		{
			//商品列表
			path: "/Commodity",
			name: "Commodity",
			component: () => import('../views/commodity/Commodity.vue')
		},
		{
			//订单页面
			path: "/orderform",
			name: "orderform",
			component: () => import('../views/orderform/OrderForm.vue')
		},
			{
				//产品增加页面
				path: '/addGoods',
				name: 'addGoods',
				component: () => import('../views/commodity/addGoods.vue')
			}
		]
	},
	{
		path: '/login',
		name: 'login',
		component: () => import( /* webpackChunkName: "about" */ '../views/log/login.vue')
	}
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

export default router
