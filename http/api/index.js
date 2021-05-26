import request from '../request.js';

//  h5获取签名
function getSignature(data){
	return request({
		url:'user/wx/getSignature',
		data,
		istoken:0
	})
}


//  h5登录
function H5Login(data){
	return request({
		url:`user/wx/officialAccountLogin`,
		istoken:0,
		data
	})
}


// 获取首页活动数据
function getactivelist(data) {
	return request({
		url:'user/index/index',
		data,
		method:'POST',
		
	})
}
// 获取首页活动数据2无token
function getactivelist2(data) {
	return request({
		url:'user/index/index2',
		data,
		method:'POST',
		istoken:0
		
	})
}


// 获取首页banner
function getBannerlist(data) {
	return request({
		url:'user/index/banner',
		data,
		istoken:0
		
	})
}

// 获取首页ad
function getAdlist(data){
	return request({
		url:'user/index/ad',
		data,
		istoken:0
	})
}

// 获取app活动数据
function getApp(data) {
	return request({
		url:'user/setting/index',
		data,
		istoken:0
		
	})
}


// 获取饿了么跳转链接
function getItemLink(data) {
	return request({
		url:'user/index/get_url',
		data
		
	})
}

// 获取美团跳转链接
function get_meituan_url(data) {
	return request({
		url:'user/index/get_meituan_url',
		data
		
	})
}


// 获取美团二维码
function get_meituan_ewm(data) {
	return request({
		url:'user/index/get_meituan_qrcode',
		data
		
	})
}





export default {
	getSignature,
	H5Login,
	getactivelist,
	getactivelist2,
	getApp,
	getItemLink,
	getBannerlist,
	getAdlist,
	get_meituan_url,
	get_meituan_ewm
}
