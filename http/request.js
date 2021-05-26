import config from '../config.js'
import store from '../store/index.js'

const url_ = config.baseUrl

function request(res) {

	// url,data = {},istoken = 1
	const that = this
	const url = res.url;
	const data = res.data;
	const method = res.method;
	const istoken = res.istoken == 0 ? res.istoken:1;
	
	return new Promise((resolve, rejectd) => {
		let token, 
		req_hea,
		req_data, 
		full_path = url;
		req_data = { ...data};
		
		
		// 判断需不需要token验证
		if (istoken == 1) {
			// token = uni.getStorageSync('token')//获取本地数据缓存的token
			req_data.token = uni.getStorageSync('token')
			// 判断token是否存在，不存在更改状态rejectd
			// if (!req_data.token) {
			// 	return rejectd('token不存在')
			// }
		}
		// 判断url是不是完整路径
		if (url.indexOf('https') == -1) {
			full_path = url_ + url
		}
		
		// 判断是不是post,添加请求头
		if (method == 'POST') {
			req_hea = {
				header: {
					'content-type': 'application/x-www-form-urlencoded'
				},
				method: 'POST'
			}
		}
		

		uni.request({
			url: full_path,
			data: req_data,
			...req_hea,
			success(res) {
				if (res.data.code == 200) {
					resolve(res.data)
										
				} else if (res.statusCode == 500 || res.statusCode == 404) {
					rejectd(res.statusCode)
				} else if (res.data.code == 300) {
					console.log('token300了')					
					
					uni.showToast({
						title: "请先授权",
						icon: "none"
					})
					
				} else {
					rejectd(res.data)
					uni.showToast({
						title: res.data.msg,
						icon: 'none'
					})
				}
			},
			fail(err) {
				uni.showToast({
					icon: "none",
					title: "网络连接错误"
				})
				console.log('err', err)
				rejectd(err)
			}
		})
	})
}

export default request
