// 自己封装的 uni.request 工具类
import request from './http/request.js'
import api from './http/api.js'
import store from './store/index.js'
var jweixin = require('./jweixin/index.js');

export default {
	//判断是否在微信中  
	isWechat: function() {
		var ua = window.navigator.userAgent.toLowerCase();
		if (ua.match(/micromessenger/i) == 'micromessenger') {
			console.log('是微信客户端')
			return true;
		} else {
			console.log('不是微信客户端')
			return false;
		}
	},

	//判断是否IOS环境
	isIOS: function() {
		let isIphone = navigator.userAgent.includes("iPhone");
		let isIpad = navigator.userAgent.includes("iPad");
		return isIphone || isIpad;
	},

	//初始化sdk配置  
	initjssdk() {

		return new Promise(async (resolve, reject) => {
			let office_appid = localStorage.getItem("office_appid");
			console.log('wechat时 office_appid',office_appid);
			let {data: appdata} = await api.index.getSignature({url: encodeURIComponent(location.href.split('#')[0])})
			appdata.time += '';
			jweixin.config({
				debug: false, // 开启调试模式,
				appId: office_appid, // 必填，公众号的唯一标识
				timestamp: appdata.time, // 必填，生成签名的时间戳
				nonceStr: appdata.noncestr, // 必填，生成签名的随机串
				signature: appdata.signature, // 必填，签名
				jsApiList: [
					'onMenuShareWeibo',
					'onMenuShareQZone',
					'updateTimelineShareData',
					'updateAppMessageShareData',
				]
			})
			resolve()
		})

	},

	//在需要自定义分享的页面中调用  

	share() {
		if (!this.isWechat()) {
			return;
		}

		this.initjssdk()
			.then(res => {
				jweixin.ready(() => {
						var shareData = {
							title: store.appInfo.share_title,
							desc: '美团饿了么大额红包，每日可领',
							link: location.href.split('#')[0],
							trigger: function(res) {
								// 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
								console.log('用户点击发送给朋友');
							},
							success: function(res) {
								console.log('已分享');
							},
							cancel: function(res) {
								console.log('已取消');
							},
							fail: function(res) {
								console.log(JSON.stringify(res));
							}
						};

						//自定义分享按钮的分享内容
						jweixin.onMenuShareWeibo(shareData);
						jweixin.onMenuShareQZone(shareData);
						jweixin.updateAppMessageShareData(shareData);
						jweixin.updateTimelineShareData(shareData);
					}),
					// config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
					jweixin.error(function(res) {
						console.log('config信息验证失败会执行error函数', res)
					});

			})

	},

}
