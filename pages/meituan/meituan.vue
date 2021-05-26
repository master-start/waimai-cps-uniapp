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
					1.美团外卖，必须使用带有渠道专享标记的优惠卷才有返利<br />
					2.领券后在红包有效期内下单均有返利;<br />
					3.美团绑定的手机号，需与领券登录的手机号—致;<br />
					4.下单后第二天上午10点会有订单返现提醒<br />
					5.无论美团新老用户,每个手机号每天可领一次,红包金额随机发放;
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
					actId: '2'
				}, {
					name: '商超',
					actId: '4'
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
				shuju1: { //美团商超颜色
					backgroundColor: '#5ddd24',
					bgc: 'background-color:#5ddd24',
					top_bg: '../../static/meituan1_bg_hb.jpg',
					dh_bg: '../../static/meituan1_ydl.jpg',
					topbtn_sls: 'background-color: #32b766;color: #fff;',
					bombtn1_sls: 'color: #9e7b45;background-image: linear-gradient( #fdf0c3,#f7c882);',
					bombtn2_sls: 'color: #45a61b;background-color: #fff;',
				},
				shuju0: { //美团外卖颜色
					backgroundColor: '#feac00',
					bgc: 'background-color:#fdc413',
					top_bg: '../../static/meituan2_bg_hb.jpg',
					dh_bg: '../../static/meituan2_ydl.jpg',
					topbtn_sls: 'background-color: #ff6100;color: #fff;',
					bombtn1_sls: 'color: #fff;background-color: #ff4401;',
					bombtn2_sls: 'color: #1c4c60;background-color: #fff;',
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
			this.is_pay = this.appInfo.is_pay
			this.current = this.$store.state.meituan_currentid
			this.change(this.current)
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
					data: this.appInfo.share_content_meituan,
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
				this.current = index
				this.$store.commit('setmeituan_currentid', index)
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
						actId: this.list[this.current].actId
					}
					this.$http.index.get_meituan_ewm(data)
						.then(res => {
							let ewmSrc = res.data;
							that.$set(that.current_data[that.current], 'ewm', ewmSrc)
							uni.hideLoading()
							console.log('美团获取二维码', ewmSrc);
						})
					this.$http.index.get_meituan_url({
							actId: this.list[this.current].actId,
							linkType: 4
						})
						.then(res => {
							that.$set(that.current_data[that.current], 'url', res.data)
							console.log('美团获取跳转链接', res);
						})
				}

			},
			//小程序跳转
			jump() {
				uni.navigateToMiniProgram({
					appId: 'wxde8ac0a21135c07d',
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
