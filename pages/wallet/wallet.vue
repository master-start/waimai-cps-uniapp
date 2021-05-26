<template>
	<view class="wallet">
		<!-- #ifdef H5 -->
		<u-navbar back-icon-color="#fff" title="我的钱包" title-color="#fff" :background="background" :border-bottom="false"></u-navbar>
		<!-- #endif -->

		<!-- 导航tabs -->
		<view class="tabs-box1">
			<u-tabs activeColor="#f29100" :list="list" :is-scroll="false" :offset="[0,0]" :current="current" @change="clitbs"></u-tabs>
		</view>


		<!-- 积分兑换表单 -->
		<view v-if="current == 0" class="awal">
			<view class="awal_top u-p-40">
				<view>请输入积分兑换码</view>
				<view class="int"><input v-model.trim="Rcode" /></view>
				<view class="out" @click="clickdh">兑换</view>
			</view>

		</view>

		<!-- 提现记录内容 -->
		<view v-if="current == 1" class="recordlist">
			<view class="content_top">
				账户剩余<text class="g">{{userInfo.available_money || '0' | zeroize}}</text>元，累计提现<text class="o">{{userInfo.sum_take_out_money || '0' | zeroize}}</text>元
			</view>

			<!-- 列表 -->
			<view class="wt_list" v-if="true">

				<view class="wt_item flex justify-between align-center" v-for="(item, index) in walletList" :key="index">
					<view class="time">
						{{item.add_time | time_filter}}
					</view>
					<view class="u-flex-1">
						<view class="flex justify-between align-center">
							<view :class="{'g':iszf(item.money) , 'o':!iszf(item.money)}" style="font-size: 32rpx;">{{item.money | money_filter}}</view>
							<view class="u-font-12">余额{{item.changed_balance}}</view>
						</view>
						<view class="u-font-12">{{item.desc}}</view>
					</view>
				</view>
			</view>
			<!-- 没有数据提示 -->
			<view class="page-box" v-else>
				您还没有相关的收益数据数据
			</view>
			<!-- //加载提示 -->
			<view>
				<u-loadmore :status="loadStatus"></u-loadmore>
			</view>

		</view>

		<!-- 提现申请表单 -->
		<view v-if="current == 2" class="awal">
			<view class="awal_top u-p-40">
				<view>请输入提现金额，满1元可提现</view>
				<view class="int"><input v-model.trim="money" type="number" /></view>
				<view class="inter" v-if="money_inter">提现手续费{{money_inter}}元</view>
				<view class="out" @click="withdrawal">申请提现</view>
			</view>
			<view class="awal_bom">
				<view class="title">提现规则</view>
				<view class="awcontent">
					1.提现到当前微信<br />
					2.最低提现金额1元<br />
					3.提现实时到账
				</view>
			</view>
		</view>


	</view>
</template>

<script>
	export default {
		data() {
			return {
				// #ifdef H5
				background: {
					backgroundColor: '#f33f5c'
				},
				// #endif

				walletList: [],
				list: [{
						name: '兑换',
						id: 0
					},
					{
						name: '明细',
						id: 1
					},
					{
						name: '提现',
						id: 2
					}
				], //tabs列表
				money: null, //提现金额
				Rcode: null, //积分兑换码
				current: null, //当前选中tabs
				page: 1,
				loadStatus: 'loadmore',
			};
		},
		computed: {
			money_inter() { //提现手续费
				return parseFloat(this.money * this.appInfo.take_out_ratio).toFixed(2)
			},
			userInfo() {
				return this.$store.state.userInfo
			},
			appInfo() {
				return this.$store.state.appInfo
			}
		},
		onLoad(e) {
			console.log(e)
			if (e && e.currentid) { //有进入路径，转变
				this.current = e.currentid
			} else { //没有进入路径，设置默认1，并触发数据请求
				this.current = 1
			}

		},
		onReachBottom() {
			console.log("触发了到底")
			this.loadStatus = 'loading';
			this.getwalletlist()


		},

		methods: {
			// 获取提现列表数据
			getwalletlist() {
				const that = this

				uni.$emit('getuserinfo')

				console.log("页面数据")
				this.$http.user.getPayOrderList({
						page: this.page
					})
					.then(res => {

						that.page++;
						that.walletList = [...that.walletList, ...res.data]


						if (res.data.length < 20) {
							that.loadStatus = 'nomore'
						} else {
							that.loadStatus = 'loadmore';
						}

					})
			},
			// tab栏切换
			clitbs(index) {
				this.loadStatus = 'loadmore';
				this.page = 1;
				this.walletList = [];
				this.current = index;

			},

			// 申请提现
			withdrawal() {
				uni.showLoading({
					title: '请稍等'
				})
				if (!this.money) {
					uni.showToast({
						title: '请输入提现金额',
						icon: 'none',
						duration: 1500
					});
					return;
				}

				let sum = parseFloat(this.money_inter) + parseFloat(this.money)
				if (sum > this.userInfo.available_money) {
					uni.showToast({
						title: '账户余额不足，无法提现',
						icon: 'none',
						duration: 1500
					});
					return;
				}

				this.$http.user.withdrawal({
						money: this.money
					})
					.then(res => {
						console.log('提现成功', res)
						uni.showToast({
							title: '提现成功',
							icon: 'success',
							duration: 1500
						});
					})
					.catch(err => {
						console.log('提现失败', err)
						uni.showToast({
							title: err.msg,
							icon: 'none',
							duration: 1500
						});
					})
				this.money = null
			},

			// 兑换码使用
			clickdh() {
				const that = this
				uni.showLoading({
					title: '请稍等'
				})
				if (!this.Rcode) {
					uni.showToast({
						title: '请输入兑换码',
						icon: 'none',
						duration: 1500
					});
					return;
				}

				this.$http.user.pointsfor({
						code: this.Rcode
					})
					.then(res => {
						console.log('兑换码使用成功', res)
						uni.showToast({
							title: '兑换码使用成功',
							icon: 'success',
							duration: 1500
						});
						that.codepage = 1;
						that.RecodeList = [];
						that.getRecodelist()

					})
					.catch(err => {
						console.log('兑换码使用失败', err)
						uni.showToast({
							title: err.msg,
							icon: 'none',
							duration: 1500
						});
					})
				this.Rcode = null


			},

			iszf(val) {
				if (parseFloat(val) > 0) {
					return true
				} else {
					return false
				}
			},

		},
		watch: {
			current(val) {
				if (val == 1) {
					this.getwalletlist()
				}
			}
		},
		filters: {
			money_filter(val) {
				if (parseFloat(val) > 0) {
					return '+' + val
				} else {
					return val
				}
			},
			time_filter(val) {
				return val.substring(val.indexOf('-') + 1, val.length - 3)
			},
			zeroize(val) {
				return parseFloat(val).toFixed(2)
			}
		}
	};
</script>


<style lang="scss" scoped>
	.wallet {
		display: flex;
		flex-direction: column;
		height: calc(100vh - var(--window-top));
		width: 100%;
		background-color: $uni-bg-color;

		.tabs-box1 {
			position: fixed;
			top: var(--window-top);
			width: 750rpx;
			color: #303133;
			z-index: 99;
			background-color: #fff;
		}

	}

	// 没有提现数据样式
	.page-box {
		text-align: center;
		padding-top: 200rpx;
		margin: 0 auto;
		font-size: 32rpx;
		height: calc(100vh - var(--window-top) - 5px - 40px);

	}

	.recode_page-box {
		text-align: center;
		padding-top: 200rpx;
		margin: 0 auto;
		font-size: 32rpx;
		min-height: calc(100vh - var(--window-top) - 640rpx);

	}

	// 共头部样式
	.content-title {
		line-height: 80rpx;
		font-size: 24rpx;
		text-align: center;

	}

	.content_top {
		padding: 20rpx 0;
		text-align: center;
		background-color: #F2F2F2;
		color: #303133;

	}

	.recordlist {
		margin-top: 40px;
		background-color: #fff;
	}

	// 列表样式
	.wt_list {
		min-height: calc(100vh - var(--window-top) - 10rpx - 160rpx - 40rpx);

		.wt_item {
			border-bottom: 1px solid rgba($color: #ccc, $alpha: 0.3);
			padding: 16rpx 20rpx;
			text-align: center;
			text-align: left;
			line-height: 44rpx;
			color: #ccc;

			.time {
				line-height: 50rpx;
				text-align: center;
				width: 130rpx;
				margin-right: 20rpx;
				border-right: solid 1px rgba($color: #ccc, $alpha: 0.3);
			}



		}
	}

	.g {
		color: #f29100;
	}

	.o {
		color: #4dc891;
	}


	// 提现表单样式
	.awal {
		margin-top: 50px;

		.awal_top {
			background-color: #fff;
			margin-bottom: 30rpx;
			height: 306rpx;

			.int {
				font-size: 28rpx;
				color: #888;
				padding: 20rpx 0;
				border-bottom: 1px solid rgba($color: #C0C0C0, $alpha: 0.7);
			}

			.inter {
				font-size: 26rpx;
				color: #ccc;
			}

			.out {
				width: 100%;
				margin-top: 30rpx;
				line-height: 70rpx;
				text-align: center;
				color: #fff;
				background-color: #f4c242;
			}
		}

		.awal_bom {
			background-color: #fff;
			padding: 0 40rpx 30rpx;

			// margin-top: 30rpx;
			.title {
				color: #b69031;
				text-align: center;
				line-height: 80rpx;
				border-bottom: 1px solid rgba($color: #C0C0C0, $alpha: 0.7);
			}

			.awcontent {
				margin-top: 20rpx;
				line-height: 50rpx;
			}
		}


	}
</style>
