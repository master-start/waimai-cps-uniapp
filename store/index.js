import Vue from 'vue'
import Vuex from 'vuex'
import config from '../config.js'
Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		userInfo:{},//用户信息
		appInfo:{},
		ele_currentid:0,
		meituan_currentid:0,
		scene:null,//进入场景值
	},


	mutations: {
		setUserInfo(state,userinfo){
			state.userInfo = userinfo
		},
		setAppInfo(state,appInfo){
			state.appInfo = appInfo
		},
		setScene(state,scene){
			state.scene = scene
		},
		setele_currentid(state,ele_currentid){
			state.ele_currentid = ele_currentid
		},
		setmeituan_currentid(state,meituan_currentid){
			state.meituan_currentid = meituan_currentid
		}
	},

	getters: {

	},

	actions: {

	}
})

export default store
