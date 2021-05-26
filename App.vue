<script>
	export default {
		onLaunch: async function(e) {
			const that = this

			console.log('小程序App Launch', e)


			// #ifdef MP-WEIXIN
			that.$store.commit('setScene', e.scene)

			this.$http.index.getApp()
				.then(res => {
					console.log(res)
					this.$store.commit('setAppInfo', res.data)
				})
				
			uni.login({ //微信小程序登录取code
				provider: 'weixin',
				success: function(loginRes) {
					that.$http.user.wxlogin({
							code: loginRes.code
						}) //微信小程序登录取token
						.then(res => {
							uni.setStorageSync('token', res.data.token)
							uni.$emit('getuserinfo') //发送获取用户信息的全局请求
						})
						.catch(err => {
							console.log('请求登录接口出错', err)
						})
				},
				fail: function(err) {
					console.log(err);
				}
			});
			
			// #endif

			// #ifdef H5
			that.$store.commit('setScene', -1)

			this.$http.index.getApp()
				.then(AppInfo => {
					console.log('AppInfo', AppInfo)
					that.$store.commit('setAppInfo', AppInfo.data)
					uni.setStorageSync("office_appid", AppInfo.data.official_account_appid); //在localStorage中存储office_appid
					uni.setStorageSync("is_pay", AppInfo.data.is_pay);
				})

			let office_appid = uni.getStorageSync("office_appid");

			if (office_appid) {
				that.authorization(office_appid)
			} else {
				this.$http.index.getApp()
					.then(AppInfo => {
						console.log('AppInfo', AppInfo)
						that.$store.commit('setAppInfo', AppInfo.data)
						uni.setStorageSync("is_pay", AppInfo.data.is_pay);
						uni.setStorageSync("office_appid", AppInfo.data.official_account_appid); //在localStorage中存储office_appid
						office_appid = AppInfo.data.official_account_appid;
						that.authorization(office_appid)
					})
			}
			// #endif

			//监听getuserinfo事件执行获取用户信息并提交
			uni.$on('getuserinfo', () => {
				that.$http.user.getUserInfo()
					.then(res => { //获取用户信息
						that.$store.commit('setUserInfo', res.data)
						uni.$emit('binduser')
						// #ifdef MP-WEIXIN
						uni.$emit('login', res.data.mobile)
						// #endif
						uni.hideLoading()
					})
					.catch(err => {
						uni.hideLoading()
					})
			})
		},
		methods: {
			// #ifdef H5
			getUrlKey: function(name) { // 获取url参数
				//获取url 参数
				return (decodeURIComponent((new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)").exec(location.href) || [,
					""
				])[1].replace(/\+/g, "%20")) || null);
			},
			authorization(office_appid) { //传入公众号appid，走授权
				/**
				 * 上线用此注释下代码
				 * @param {Object} 直接使用token，进行调试
				 * start
				 */
				var code = this.$route.query.code || this.getUrlKey("code");

				if (!code) { //授权获取openid
					let urlNow = encodeURIComponent(window.location.href);
					let scope = "snsapi_base"; //  snsapi_base snsapi_userinfo   //静默授权 用户无感知
					let appid = office_appid;
					let state = "123";
					let url =`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${urlNow}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`;

					window.location.href = url;
				} else {					
					this.$http.index.H5Login({
							code: code
						}) //微信小程序登录取token
						.then(res => {
							uni.setStorageSync('token', res.data.token)
							uni.$emit('getuserinfo') //发送获取用户信息的全局请求
						})
						.catch(err => {
							console.log('请求登录接口出错', err)
						})
						this.$wechat.share()
				}
				/**
				 * end
				 */


				/**
				 * @param {Object} 直接使用token，进行调试
				 * start
				 */
				let token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9pbGFuY2hvbmcuY24iLCJpYXQiOjE2MTE3MTYxMTUsIm5iZiI6MTYxMTcxNjExNSwiZXhwIjoxNjQzMjUyMTE1LCJkYXRhIjp7ImlkIjo3MTIsInRia19yX2lkIjowLCJ1c2VybmFtZSI6Ilx1NzUyOFx1NjIzNzMxODk2IiwidGJrX25hbWUiOm51bGwsIm1vYmlsZSI6IjAiLCJ3ZWNoYXQiOiIwIiwidGJrX3Nlc3Npb25rZXkiOm51bGwsImF2YWlsYWJsZV9tb25leSI6IjAuMDAiLCJkaXNhdmFpbGFibGVfbW9uZXkiOiIwLjAwIiwid3hfb3BlbmlkIjoib0ZTQzA1aVEwNE9YSlJIZEZaZ2IwV1cycTVtYyIsInZpcCI6MCwidmlwX2NvZGUiOjAsImpvaW5fdGVhbV90aW1lIjpudWxsLCJsdl8xX2lkIjotMSwibHZfMl9pZCI6LTEsImx2XzFfaW5jb21lIjoiMC4wMCIsImx2XzJfaW5jb21lIjoiMC4wMCIsImF2YXRhciI6Imh0dHBzOlwvXC9sYW5jaG9uZy5vc3MtY24tYmVpamluZy5hbGl5dW5jcy5jb21cL2xhbmNob25nXC9sb2dvLnBuZyIsImdlbmRlciI6MSwiZW1haWwiOm51bGwsInN0YXR1cyI6MSwiYWRkX3RpbWUiOiIyMDIxLTAxLTI2IDE3OjQxOjExIn19.4qncKwzCtaowJ5yorFe26l_6y4ZRl8ArxNkmKowcDn4';
				uni.setStorageSync('token', token)
				uni.$emit('getuserinfo') //发送获取用户信息的全局请求
				//end

			},
			// #endif

		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	@import "./static/iconfont.css";
	@import "uview-ui/index.scss";

	* {
		box-sizing: border-box;
	}

	.flex {
		display: flex;
	}

	.align-center {
		align-items: center;
	}

	.self-center {
		align-self: flex-center;
	}

	.justify-start {
		justify-content: flex-start;
	}

	.justify-end {
		justify-content: flex-end;
	}

	.justify-center {
		justify-content: center;
	}

	.justify-between {
		justify-content: space-between;
	}

	.justify-around {
		justify-content: space-around;
	}

	.ellipsis {
		/*文字溢出隐藏*/
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
</style>
