<template>
	<view class="meituan" :style="zt_bg.bgc">
		<u-navbar :is-back="false" :border-bottom="false" title=" " :background="background">
			<view class="slot-wrap">
				<view class="center">
					<u-tabs name="cate_name" count="cate_count" :list="list" :is-scroll="false" :current="current" @change="change"
					 bg-color="background.backgroundColor" inactive-color="#FFF" active-color="#FFF"></u-tabs>
				</view>
			</view>
		</u-navbar>

		<view class="content">
			<!-- 正文内容 -->
			<view class="top">
				<image :src="zt_bg.top_bg" mode="widthFix"></image>
			</view>
			<view class="center">
				<!-- 导购三标栏 -->
				<view class="cen-top">
					<image :src="zt_bg.dh_bg" mode="widthFix"></image>
					<view class="y y1" :style="zt_bg.bgc"></view>
					<view class="y y2" :style="zt_bg.bgc"></view>
				</view>
				<!-- 二维码 -->
				<view class="cen-cen">
					<image :src="current_data[current].ewm" :show-menu-by-longpress="true"></image>
				</view>
				<view v-if="is_pay">
					<view class="cen-bottom" :style="zt_bg.topbtn_sls" @click="jump">领红包点外卖</view>
				</view>
				<view v-else>
					<view class="cen-bottom" :style="zt_bg.topbtn_sls">长按二维码保存到相册</view>
				</view>
				
			</view>
			<view class="bottom">
				<view class="btn flex justify-between">
					<view :style="zt_bg.bombtn1_sls" @click="share_img_click">分享赚钱</view>
					<view :style="zt_bg.bombtn2_sls" @click="cp_clipboard">复制文案</view>
				</view>
				<view class="bttext">
					返利注意事项:<br />
					1.领券下单均有返利,返利按照订单实际支付金额为准;<br />
					2.必须使用从本页获得的红包码领券,领券后使用红包下单才有返利;<br />
					3.领券后在红包有效期内下单均有返利;<br />
					4.饿了么绑定的手机号，需与领券登录的手机号—致;<br />
					5.下单后30分钟内会有订单返现提醒;<br />
					6.无论饿了么新老用户,每个手机号每天可领一次,红包金额随机发放;
				</view>
			</view>
		</view>

		<share-hb :bgImg="appInfo.poster_bg" :ewmImg="current_data[current].ewm" :isshow="isshow_share" @cloose_share_img="clooseShare"
		 v-if="isshow_share"></share-hb>



	</view>
</template>

<script>
	import shareHb from '../../components/share_hb2/share_hb2.vue'

	export default {
		components: {
			shareHb
		},
		data() {
			return {
				notitle: '',
				list: [{
					name: '外卖',
					activity_material_id: '20150318020002597'
				}, {
					name: '果蔬',
					activity_material_id: '1585018034441'
				}],
				current: 0,
				background: {},
				zt_bg: {},
				current_data: [{
					ewm: '',
					url: ''
				}, {
					ewm: '',
					url: ''
				}],
				shuju0: { //美团外卖颜色
					backgroundColor: '#027ed8',
					bgc: 'background-color:#027ed8',
					top_bg: '../../static/ele_bg_hb.jpg',
					dh_bg: '../../static/ele1_ydl.jpg',
					topbtn_sls: 'background-color: #1280d9;color: #fff;',
					bombtn1_sls: 'color: #0f5195;background-color: #fadca0;',
					bombtn2_sls: 'color: #194a5d;background-color: #fff;',
				},
				shuju1: { //美团商超颜色
					backgroundColor: '#12c293',
					bgc: 'background-color:#4edba6',
					top_bg: '../../static/ele2_bg_hb.jpg',
					dh_bg: '../../static/ele2_ydl.jpg',
					topbtn_sls: 'background-color: #11c296;color: #fff;',
					bombtn1_sls: 'color: #0f5195;background-color: #fadca0;',
					bombtn2_sls: 'color: #194a5d;background-color: #fff;',
				},
				isshow_share: false,
				is_pay:0,
			}
		},
		computed: {
			appInfo() {
				return this.$store.state.appInfo
			}
		},
		onShow(e) {
			this.current = this.$store.state.ele_currentid
			this.change(this.current)
			this.is_pay = this.appInfo.is_pay
		},
		onLoad() {
			this.is_pay = this.appInfo.is_pay
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

			// 复制到剪切板
			cp_clipboard() {
				uni.setClipboardData({
					data: this.appInfo.share_content_ele,
					success: function() {
						uni.showToast({
							title: '内容已复制'
						})
						console.log('剪切板内容设置成功');
					}
				});
			},

			// 切换
			change(index) {
				this.current = index;
				this.$store.commit('setele_currentid', index);
				if (this.current == 0) {
					this.background.backgroundColor = this.shuju0.backgroundColor
					this.zt_bg = this.shuju0
				} else {
					this.background.backgroundColor = this.shuju1.backgroundColor
					this.zt_bg = this.shuju1
				}
				this.getactivi()
			},
			// 数据请求
			getactivi() {

				if (!this.current_data[this.current].ewm) {
					uni.showLoading({
						title: '加载中',
						mask: true
					})
					const that = this
					let data = {
						activity_material_id: this.list[this.current].activity_material_id
					}
					this.$http.index.getItemLink(data)
						.then(res => {
							console.log('饿了么获取', res);
							that.$set(that.current_data[that.current], 'ewm', res.data.data.wx_qrcode_url)
							that.$set(that.current_data[that.current], 'url', res.data.data.wx_miniprogram_path)
							uni.hideLoading()
						})
					uni.hideLoading();
				}

			},
			//小程序跳转
			jump() {
				uni.navigateToMiniProgram({
					appId: 'wxece3a9a4c82f58c9',
					path: this.current_data[this.current].url
				})
				console.log('我点击了跳转');
			},
		},
	}
</script>

<style scoped lang="scss">
	.meituan {
		// height: 100vh;

		.content {
			.top {
				width: 750rpx;

				image {
					width: 100%;
					vertical-align: bottom;
				}
			}

			.center {
				background-color: #fff;
				width: 650rpx;
				margin: 0 auto;
				padding-bottom: 50rpx;
				border-radius: 20rpx;
				text-align: center;

				.cen-top {
					padding: 20rpx;
					border-bottom: dashed 1px rgba($color: #ccc, $alpha: 1);
					position: relative;

					image {
						width: 100%;
					}

					.y {
						width: 60rpx;
						height: 60rpx;
						position: absolute;
						bottom: 0;
						border-radius: 50%;
					}

					.y1 {
						left: 0;
						transform: translate(-50%, 50%);
					}

					.y2 {
						right: 0;
						transform: translate(50%, 50%);
					}

				}

				.cen-cen {
					margin: 40rpx 0 20rpx;

					image {
						width: 340rpx;
						height: 340rpx;
					}
				}

				.cen-bottom {
					width: 550rpx;
					margin: 10rpx auto 0;
					font-size: 42rpx;
					height: 100rpx;
					line-height: 100rpx;
					text-align: center;
					border-radius: 100rpx;
				}


			}

			.bottom {
				width: 650rpx;
				margin: 30rpx auto 0;
				padding-bottom: 100rpx;

				.btn {
					view {
						width: 47%;
						text-align: center;
						line-height: 80rpx;
						font-size: 36rpx;
						letter-spacing: 4rpx;
						border-radius: 10rpx;
					}

				}

				.bttext {
					color: #fff;
					line-height: 50rpx;
					margin-top: 40rpx;

					text {
						color: rgb(236, 76, 21)
					}
				}
			}
		}

	}

	.slot-wrap {
		display: flex;
		align-items: center;
		width: 750rpx;

		.center {
			width: 300rpx;
			margin:  0 auto;
		}

	}
</style>
