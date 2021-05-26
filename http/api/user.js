import request from '../request.js';


// 登录
function wxlogin(data) {
	return request({
		url:'user/login/wxlogin',
		data,
		istoken:0,
		method:'POST',
		
	})
}

// 获取个人信息
function getUserInfo(data) {
	return request({
		url:'user/user/info',
		data
		
	})
}


// 更新个人信息
function updateInfo(data) {
	return request({
		url:'user/user/update',
		data,
		method:'POST',
		
	})
}


// 更新手机号
function updatephone(data) {
	return request({
		url:'user/user/wxBindMobile',
		data,
		method:'POST',
		
	})
}


// 绑定推荐人
function bindPromoter(data) {
	return request({
		url:'user/user/bindPromoter',
		data,
		method:'POST',
		
	})
}


// 查询订单
function getOrderList(data) {
	return request({
		url:'user/order/index',
		data
		
	})
}

// 获取资金记录列表
function getPayOrderList(data) {
	return request({
		url:'user/money/log',
		data,
		method:'POST',
		
	})
}


// 获取下级列表
function getTeamsList(data) {
	return request({
		url:'user/user/teams',
		data,
		method:'POST',
		
	})
}


// 申请提现
function withdrawal(data) {
	return request({
		url:'user/pay_order/takeOutMoney',
		data,
		method:'POST',
		
	})
}


// 兑换码使用
function pointsfor(data) {
	return request({
		url:'user/redeem_code/exchange',
		data,
		method:'POST',
		
	})
}

// 饿了么绑定授权
function eleauth_url(data) {
	return request({
		url:'user/tbk/auth_url',
		data,
		
	})
}



// 获取个人分享二维码(小程序码)
function getwxqrcode(data) {
	return request({
		url:'user/user/wxQrcode',
		data
	})
}


// 获取个人分享二维码(公众号二维码)
function getOffQrcode(data) {
	return request({
		url:'user/user/offQrcode',
		data
	})
}





export default {
	wxlogin,
	getUserInfo,
	updateInfo,
	updatephone,
	bindPromoter,
	getOrderList,
	getPayOrderList,
	getTeamsList,
	withdrawal,
	eleauth_url,
	getwxqrcode,
	getOffQrcode,
	pointsfor
}
