<template>
	<page-meta background-color-top="#f33f5c" background-color="#FFFFFF"></page-meta>
	<view class="my">
		<!-- 导航头部 -->
		<u-navbar :is-back="false" title="个人中心" title-color="#fff" :background="background" :border-bottom="false"></u-navbar>

		<view class="my_bg"></view>


		<!-- 头部个人信息栏 -->
		<view class="flex user-box topinfo">
			<view class="head-picture u-m-r-20">
				<!-- #ifdef MP-WEIXIN -->
				<!-- <image :src="userInfo.avatar"></image> -->
				<open-data type="userAvatarUrl"></open-data>
				<!-- #endif -->
				<!-- #ifdef H5 -->
				<image :src="userInfo.avatar"></image>
				<!-- #endif -->
			</view>
			<view class="u-flex-1">
				
				<!-- #ifdef MP-WEIXIN -->
				<open-data type="userNickName"></open-data>
				<!-- #endif -->
				
				<!-- #ifdef H5 -->
				<view class="u-font-14 u-p-t-10">{{ userInfo.username || "0758923"}}</view>
				<!-- #endif -->
				
			<!-- 	<view v-if="appid!='wxf86d40ecd6914158'" class="u-font-12 u-p-t-10">ID:{{userInfo.id}}</view>
				<view v-if="appid=='wxf86d40ecd6914158'" class="u-font-12 u-p-t-10">微信公众号【外卖很忙】ID:{{userInfo.id}}</view> -->
				<view class="u-font-12 u-p-t-10">【我的外卖人生】ID:{{userInfo.id}}</view>
			</view>
		</view>
		<!-- 功能区域 -->
		<view class="fc">
			<!-- 中部余额表 -->

			<view class="price">
				<view class="top flex justify-between" style="border-bottom: 4px solid rgba($color:#ccc, $alpha:0.7);">
					<view>
						<view class="u-font-12">账户余额(元)</view>
						<view class="u-m-t-10">{{userInfo.available_money||'0'}}</view>
					</view>
					
					<view v-if="is_pay">
						<view class="right-1" @click="jumpwallet">提现</view>
					</view>
				</view>
				<view class="bottom flex justify-between">
					<view>
						<view class="u-font-12">待结算订单(单)</view>
						<view class="u-m-t-10">{{userInfo.count_pending_order || '0'}}</view>
					</view>
					<view>
						<view class="u-font-12">待结算佣金(元)</view>
						<view class="u-m-t-10">{{userInfo.disavailable_money || '0' | zeroize}}</view>
					</view>
					<view>
						<view class="u-font-12">累计提现(元)</view>
						<view class="u-m-t-10">{{userInfo.sum_take_out_money || '0' | zeroize}}</view>
					</view>
				</view>
			</view>

			<view class="ho_share flex">
				<view @click="share_img_click" class="share">
					<view>
						<image src="../../static/share_img.png" mode="widthFix"></image>
					</view>
					<view>发送图文</view>
				</view>
				<view>
					<navigator v-if="appInfo.open_share == 1" url="./team">
						<view>
							<image src="../../static/td.png" mode="widthFix"></image>
						</view>
						<view>团队列表</view>
					</navigator>
				</view>
				<view>
					<label for="share">
						<view>
							<image src="../../static/share.png" mode="widthFix"></image>
						</view>
						<view>分享好友</view>
					</label>
				</view>

				<button hidden id="share" type="default" open-type="share"></button>
			</view>

			<!-- 个人功能栏 -->
			<view class="u-m-t-10 fclist">
				<u-cell-group>
					<navigator url="/pages/wallet/wallet?currentid=0" v-if="is_pay">
						<u-cell-item title="积分兑换" :title-style="{'margin-left':'20rpx','font-weight': 'bold'}">
							<u-icon slot="icon" name="duihuan" custom-prefix="custom-icon" color="#d51539" size="40"></u-icon>
						</u-cell-item>
					</navigator>
					<navigator url="./order">
						<u-cell-item title="订单业绩" :title-style="{'margin-left':'20rpx','font-weight': 'bold'}">
							<u-icon slot="icon" name="file-text-fill" color="#7F8DD5" size="40"></u-icon>
							<u-icon name="backspace" custom-prefix="custom-icon" size="30" color="#888888"></u-icon>
						</u-cell-item>
					</navigator>
					<navigator url="/pages/wallet/wallet" v-if="is_pay">
						<u-cell-item title="钱包明细" :title-style="{'margin-left':'20rpx','font-weight': 'bold'}">
							<u-icon slot="icon" name="qianbao" custom-prefix="custom-icon" color="#25b5da" size="40"></u-icon>
						</u-cell-item>
					</navigator>

					<navigator url="./binding">
						
						<u-cell-item title="账号绑定" :title-style="{'margin-left':'20rpx','font-weight': 'bold'}">
							<!-- <u-icon slot="icon" name="rmb-circle-fill"  color="#25b5da" size="40"></u-icon> -->
							<u-icon slot="icon" name="binding" custom-prefix="custom-icon" color="#25b5da" size="34"></u-icon>
						</u-cell-item>
					</navigator>

					<!-- #ifdef MP-WEIXIN -->
					<label for="contact">
						<u-cell-item title="我的客服" :title-style="{'margin-left':'20rpx','font-weight': 'bold'}">
							<u-icon slot="icon" name="weixin-fill" color="#15D26E" size="40"></u-icon>
						</u-cell-item>
					</label>
					<!-- #endif -->

					<u-cell-item title="福利社群" :title-style="{'margin-left':'20rpx','font-weight': 'bold'}" @click="onshow_group">
						<u-icon slot="icon" name="red-packet-fill" color="#d51539" size="40"></u-icon>
					</u-cell-item>


				</u-cell-group>
			</view>


			<!-- 隐藏按钮 -->
			<button hidden id="contact" type="default" open-type="contact" @getphonenumber="decryptPhoneNumber">联系客服</button>

		</view>

		<!-- #ifdef MP-WEIXIN -->
		<auth :isshow="isshow" :isauthuser="isauthuser" :isauthphone="isauthphone"></auth>
		<!-- #endif -->

		<share-img :bgImg="appInfo.poster_bg" :ewmImg="ewmImg" :isshow="isshow_share" @cloose_share_img="clooseShare" v-if="isshow_share"></share-img>

		<!-- 二维码弹出层 -->
		<template v-if="show_group">
			<view class="mask" @touchmove.stop.prevent="clear" @click.stop="clear">
				<view class="kf" @longpress='longpress'>
					<view class="ewm_bg" @longpress='longpress'>
						<image class="qrcode" src="../../static/1.png"></image>
					</view>
					<view class="content">

						<!-- <image class="qrcode" @longpress='longpress' :src="qrcode"></image> -->
						<image class="qrcode" :src="appInfo.official_account_qrcode" :show-menu-by-longpress="true" @longpress='longpress'></image>
						<view class="tips" style="color: #DB0E19;">长按保存图片到相册</view>
						<view class="close">
							<icon color='white' size="32" type="cancel" @click="show_group=false" />
						</view>
					</view>
				</view>

			</view>

		</template>


	</view>
</template>

<script>
	// #ifdef MP-WEIXIN
	import auth from '../../components/auth/login.vue'
	// #endif
	import shareImg from '../../components/share_img/share_img.vue'

	export default {
		name: 'user',
		components: {
			// #ifdef MP-WEIXIN
			auth,
			// #endif
			shareImg
		},
		data() {
			return {
				background: {
					// backgroundImage: 'linear-gradient(45deg, rgb(243, 63, 92), rgb(254, 107, 64))',
					backgroundColor: 'rgba(0,0,0,0)'
				},
				// #ifdef MP-WEIXIN
				isshow: false,
				isauthuser: false,
				isauthphone: false,
				// #endif
				show_group: false,
				ewmtimer: null,
				isshow_share: false,
				appid:'',		//小程序的appid
				ewmImg: '', //推广二维码
				is_pay:0,
			}
		},
		computed: {
			userInfo() {
				return this.$store.state.userInfo
			},
			appInfo() {
				return this.$store.state.appInfo
			}
		},
		onLoad() {
			const that = this
			uni.showLoading({
				title: '加载中'
			});
			
			this.appid=this.appInfo.appid
			this.is_pay = this.appInfo.is_pay
			
			// #ifdef MP-WEIXIN
			
			uni.$on('login', () => { //监听app login登录然后获取授权状态
				uni.getSetting({
					success(res) {
						let au = res.authSetting
						that.isauthuser = au['scope.userInfo'];
			
						if (!(that.isauthuser)) {
							that.isshow = true
						} else {
							that.isshow = false
							uni.$off('login')
						}
						console.log('用户授权', that.isshow)
					}
				})
			})
			// #endif

			this.getwxqrcode()

		},
		onShow() {
			uni.$emit('getuserinfo')
		},

		// 分享好友
		onShareAppMessage(res) {

			if (res.from === 'button') { // 来自页面内分享按钮
				console.log(res.target)
			}
			if (this.userInfo && this.userInfo.id) {
				let lv_1_id = this.userInfo.id
				return {
					title: this.appInfo.share_title,
					path: `/pages/index/index?lv_1_id=${lv_1_id}`
				}
			} else {
				return {
					title: this.appInfo.share_title,
					path: `/pages/index/index`
				}
			}
		},
		// 分享朋友圈
		onShareTimeline(res) {
			if (res.from === 'button') { // 来自页面内分享按钮
				console.log(res.target)
			}
			if (this.userInfo && this.userInfo.id) {
				let lv_1_id = this.userInfo.id
				return {
					title: this.appInfo.share_title,
					path: `/pages/index/index?lv_1_id=${lv_1_id}`
				}
			} else {
				return {
					title: this.appInfo.share_title,
					path: `/pages/index/index`
				}
			}

		},
		methods: {
			//打开分享图文
			share_img_click() {
				this.isshow_share = true
			},
			// 关闭
			clooseShare() {
				this.isshow_share = false
			},
			// 获取分享图片
			getwxqrcode() {
				const that = this
				let istoken1 = uni.getStorageSync('token')

				if (!istoken1) { //判断有没有token，没有token，跳过本次请求，延时0.1s重新请求
					clearTimeout(that.ewmtimer);
					this.ewmtimer = setTimeout(() => {
						console.log("请求二维码")
						that.getwxqrcode();
					}, 500)
					return;
				}
				// 海报显示小程序码
				this.$http.user.getwxqrcode()
					.then(res => {
						that.ewmImg = res.data.img
					})
					
				// //海报显示公众号二维码
				// this.$http.user.getOffQrcode()
				// 	.then(res => {
				// 		that.ewmImg = res.data.img
				// 	})
			},
			// 去提现跳转
			jumpwallet() {
				uni.navigateTo({
					url: '../wallet/wallet?currentid=2',
				});
			},
			onshow_group() {
				this.show_group = true
			},
			// 阻止冒泡
			clear(e) {
				// TODO nvue 取消冒泡
				e.stopPropagation()
			},
			//长按
			longpress() {
				var res = wx.getSystemInfoSync()
				if (res.platform != 'ios') {
					return
				}
				var that = this
				var data = this.ewmSrc
				uni.downloadFile({
					url: data, //获取需要保存的二维码
					success(res) {
						// 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
						if (res.statusCode === 200) {
							uni.saveImageToPhotosAlbum({
								filePath: res.tempFilePath,
								success(res) {
									uni.showToast({
										title: '保存成功',
									})
								},
								fail(err) {
									console.log(err)
								}
							})

						}
					},
					fail(err) {
						console.log(err);
					}
				})

			},
		},
		filters: {
			zeroize(val) {
				return parseFloat(val).toFixed(2)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.my {
		height: 100vh;
		background-color: $uni-bg-color;
		position: relative;

		.my_bg {
			position: absolute;
			top: 0;
			left: 0;
			width: 750rpx;
		}

		.my_bg:after {

			width: 100%;
			height: 450rpx;
			position: absolute;
			left: 0;
			top: 0;
			content: '';
			border-radius: 0 0 5% 5%;
			background-image: linear-gradient(110deg, rgb(243, 63, 92), rgb(254, 107, 64));
		}

		.topinfo {
			position: relative;
			z-index: 999;
			color: #fff;
			padding: 20rpx;

			.head-picture {
				height: 50px;
				width: 50px;
				margin-left: 20rpx;
				background: #fff;
				border: 5upx solid #fff;
				border-radius: 50%;
				overflow: hidden;

				image {
					height: 100%;
					width: 100%;

				}
			}

			.auth {
				width: 100rpx;
				height: 50rpx;
				padding-top: 6rpx;
				margin-top: 30rpx;
				text-align: center;
				color: #626262;
				border-radius: 50rpx;
				background-color: rgba($color: #fff, $alpha: 0.7);
			}


		}



		.fc {
			position: relative;
			// top: -150rpx;

			.price {
				color: rgb(222, 224, 203);
				background-image: linear-gradient(180deg, rgb(73, 73, 70), rgb(28, 30, 29));
				border-radius: 15rpx;
				padding: 40rpx 50rpx;
				margin: 10rpx 20rpx;
				font-size: 40rpx;
				box-shadow: 1px 1px 5px #C8C9CC;

				.bottom {
					margin-top: 40rpx;
				}

			}

			.ho_share {
				font-size: 28rpx;
				padding: 30rpx 0;
				margin: 16rpx 0;
				background-color: #ffffff;


				image {
					width: 60rpx;
					height: 60rpx;
					margin-bottom: 20rpx;
					vertical-align: middle;
					// margin-right: 20rpx;
				}

				&>view {
					flex: 1;
					text-align: center;
				}
			}

			.my-info-1 {
				background-color: #494949;
				color: #fff;
				border-top-left-radius: 15rpx;
				border-top-right-radius: 15rpx;
			}

			.my-info-2 {
				background-color: #494949;
				color: #fff;
				border-bottom-left-radius: 15rpx;
				border-bottom-right-radius: 15rpx;
			}

		}

		.fclist {
			// border-top: 4px solid rgba($color:#ccc, $alpha:0.7);
		}

		.right-1 {
			width: 170rpx;
			height: 60rpx;
			border-radius: 30rpx;
			margin: 0 auto;
			background: linear-gradient(90deg, #F6445D, #ec6f43);
			color: #fff;
			font-size: 28rpx;
			line-height: 60rpx;
			text-align: center;
		}


		.show_group {
			position: absolute;
			top: 0;
			left: 0;
			z-index: 999999;
			width: 100vw;
			height: 100vh;
			background-color: rgba($color: #000000, $alpha: 0.6);


		}

		.mask {
			position: fixed;
			height: 100vh;
			width: 100vw;
			background-color: rgba(0, 0, 0, 0.4);
			top: 0;
			left: 0;
			z-index: 99999;
			display: flex;
			align-items: center;
			justify-content: center;


			.kf {
				width: 600rpx;
				height: 680rpx;
				background-color: #fff;
				text-align: center;
				position: relative;

				.ewm_bg {
					position: absolute;
					top: 45%;
					left: 50%;
					transform: translate(-50%, -50%);

					image {
						width: 500rpx;
						height: 500rpx;
					}

				}

				.content {
					position: relative;
					top: 23%;

					.qrcode {
						width: 330rpx;
						height: 330rpx;
					}

					.tips {
						display: block;
						font-size: 28rpx;
						text-align: center;
						margin-top: 96rpx;
					}

					.close {
						position: absolute;
						bottom: -230rpx;
						left: 50%;
						transform: translate(-50%, -50%);
						/* 50%为自身尺寸的一半 */
						padding: 14rpx 20rpx;
						text-align: center;
					}

				}
			}


		}


	}
</style>
