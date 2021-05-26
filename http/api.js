import request from './request.js'
import config from '../config.js'

import index from './api/index.js'
import user from './api/user.js'


/**
 function (data) {
 	return request({
 		url:'school/schoolList',//请求地址
 		data,//数据
 		method:'POST',//请求方式GET可忽略
 		istoken:0,//是否需要携带token,0为不携带，1为携带,默认1
 	})
 }
 */


module.exports = {
	index,
	user
}