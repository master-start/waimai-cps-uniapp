<template>
	<view>
		<view class="order">
			<!-- #ifdef H5 -->
			<u-navbar back-icon-color="#fff" title="我的订单" title-color="#fff" :background="background" :border-bottom="false"></u-navbar>
			<!-- #endif -->

			<!-- 导航tabs -->
			<view class="tabs-box1">
				<u-tabs activeColor="#f29100" :list="list" :is-scroll="false" :current="current" @change="clitbs"></u-tabs>
			</view>

			<navigator v-if="userInfo.tbk_r_id == 0" url="/pages/user/binding">
				<view class="tis" v-if="userInfo.tbk_r_id == 0">因未进行账号绑定，饿了么订单无法返佣</view>
			</navigator>

			<!-- 内容 -->
			<view>
				<!-- 总 -->
				<view class="content-title flex justify-around u-flex-1">
					<view>
						<view>总订单</view>
						<view>{{userInfo.count_order ||'0'}}</view>
					</view>
					<view>
						<view>待结算收益</view>
						<view>{{userInfo.disavailable_money || '0' | zeroize}}</view>
					</view>
					<view>
						<view>已结算收益</view>
						<view>{{userInfo.sum_order_money || '0' | zeroize}}</view>
					</view>
				</view>

				<!-- 列表 -->
				<view class="page-box" v-if="dataList.length!=0">
					<!-- 有订单的情况 -->

					<view class="order_content flex justify-between" v-for="(item, index) in dataList" :key="res.id">
						<view class="left flex align-center">
							<image v-if="item.platform == 'meituan'" src="../../static/mt-logo.png" mode="aspectFill"></image>
							<image v-if="item.platform == 'ele'" src="../../static/ele-logo.png" mode="aspectFill"></image>
						</view>
						<view class="right u-flex-1">
							<view>{{item.smstitle}}</view>
							<view class="tj">用户：{{item.promoter_name}}</view>
							<view class="time">
								{{item.add_time}}下单
								<text class="cr" v-if="item.status == 1 && item.platform == 'ele'">已付款</text>
								<text class="cr" v-if="item.status == 1 && item.platform == 'meituan'">已付款</text>
								<text class="cr" v-if="item.status == 8">已完成</text>
								<text class="cr" style="background-color: #C8C9CC;" v-if="item.status == 9">已退款</text>
							</view>
							<view class="right_item flex justify-around">
								<view>
									<view class="r_i_c">订单金额</view>
									<view>￥{{item.direct | zeroize}}</view>
								</view>
								<view>
									<view class="r_i_c">订单佣金</view>
									<view>￥{{item.my_commission | zeroize}}</view>
								</view>
								<view>
									<view class="r_i_c">订单平台</view>
									<view v-if="item.platform == 'meituan'">美团</view>
									<view v-if="item.platform == 'ele'">饿了么</view>
								</view>
							</view>
						</view>
						<view class="bj bj_w" v-if="item.commission_status == 1 && item.status != 9">待结算</view>
						<view class="bj" v-if="item.commission_status == 2 && item.status != 9">已结算</view>
					</view>


					<!-- //加载提示 -->
					<view>
						<u-loadmore :status="loadStatus[current]" bgColor="#f2f2f2"></u-loadmore>
					</view>

				</view>
				<!-- 没订单的情况 -->
				<view class="page-box" v-else>
					<view class="centre">
						<view class="explain">
							您还没有相关的订单数据
							<view class="tips">可以去看看有那些想买的</view>
						</view>
						<navigator url="/pages/index/index" open-type="switchTab">
							<view class="btn">随便逛逛</view>
						</navigator>
					</view>
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
				dataList: [],
				list: [{
						name: '全部',
						id: 0
					},
					{
						name: '待结算',
						id: 1
					},
					{
						name: '已结算',
						id: 2
					}
				], //tabs列表
				current: 0, //当前选中tabs
				page: 1,
				loadStatus: ['loadmore', 'loadmore', 'loadmore'],
			};
		},
		computed: {
			userInfo() {
				return this.$store.state.userInfo
			}
		},
		onLoad() {
			this.getOrderList();
		},
		// 下拉刷新事件
		onPullDownRefresh() {

			this.getOrderList();
		},
		// 上拉加载事件
		onReachBottom() {
			console.log("触发了到底")
			this.getOrderList();
			this.loadStatus[this.current] = 'loading';

		},
		methods: {
			// 页面数据
			getOrderList() {
				const that = this
				uni.showLoading({
					title: '获取订单中'
				});
				const data = {
					page: this.page,
					status: 0,
					commission_status: this.list[this.current].id
				}
				this.$http.user.getOrderList(data)
					.then(res => {
						console.log(res)
						uni.stopPullDownRefresh();
						if (res.data.length != 0) {
							that.loadStatus[that.current] = 'loadmore';
							that.page++;
							that.dataList = [...that.dataList, ...res.data]
						} else {
							that.loadStatus[that.current] = 'nomore';
						}
						uni.hideLoading()
					})
					.catch(err => {
						console.log(err)
						uni.hideLoading()
					})
			},

			// tab栏切换
			clitbs(index) {
				this.current = index;
				this.page = 1;
				this.dataList = []
				this.getOrderList()
			},
		},
		filters: {
			zeroize(val) {
				return parseFloat(val).toFixed(2)
			}
		}
	};
</script>


<style lang="scss" scoped>
	.order {
		// display: flex;
		// flex-direction: column;
		height: calc(100vh - var(--window-top));
		background-color: $uni-bg-color;
		width: 100%;

		.tabs-box1 {
			color: #303133;
			position: sticky;
			top: var(--window-top);
			z-index: 99;
			background-color: #fff;
		}

	}

	.tis {
		width: 100%;
		height: 80rpx;
		color: #fff;
		letter-spacing: 4rpx;
		background-color: rgba($color: #000000, $alpha: 0.4);
		line-height: 80rpx;
		font-size: 28rpx;
		text-align: center;
	}

	.order_content {
		background-color: #ffffff;
		margin: 20rpx 0;
		border-radius: 20rpx;
		padding: 20rpx;
		font-size: 28rpx;
		overflow: hidden;
		position: relative;

		.bj {
			position: absolute;
			right: -55rpx;
			top: 24rpx;
			width: 200rpx;
			height: 40rpx;
			text-align: center;
			background-color: #2B85E4;
			color: #fff;
			transform: rotate(45deg);
		}

		.bj_w {
			background-color: #888;
			color: #fff;

		}

		.left {
			image {
				width: 200rpx;
				height: 200rpx;
				border-radius: 10rpx;
			}
		}

		.right {
			margin-left: 20rpx;
			font-size: 26rpx;

			.time {
				color: #C0C0C0;
				margin: 16rpx 0;

				.cr {
					text-align: center;
					margin-left: 10rpx;
					background-color: #FF642D;
					padding: 4rpx 10rpx;
					border-radius: 20rpx;
					color: #fff;
				}
			}

			.tj {
				margin: 10rpx 0;
			}

			.right_item {
				text-align: left;

				.r_i_c {
					margin-bottom: 10rpx;
					color: #C0C0C0;
				}

				>view {
					flex: 1;
				}

			}

		}

	}

	.centre {
		text-align: center;
		margin: 200rpx auto;
		font-size: 32rpx;

		.tips {
			font-size: 24rpx;
			color: #999999;
			margin-top: 20rpx;
		}

		.btn {
			margin: 80rpx auto;
			width: 200rpx;
			border-radius: 32rpx;
			line-height: 64rpx;
			color: #ffffff;
			font-size: 26rpx;
			background: linear-gradient(270deg, rgba(249, 116, 90, 1) 0%, rgba(255, 158, 1, 1) 100%);
		}
	}

	.content-title {
		line-height: 50rpx;
		padding-top: 20rpx;
		// background-color: rgba($color: #999, $alpha: 0.1);
		text-align: center;

		>view {
			flex: 1;
		}
	}
</style>
