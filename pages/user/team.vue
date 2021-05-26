<template>
	<view class="team">
		<!-- #ifdef H5 -->
		<u-navbar back-icon-color="#fff" title="我的团队" title-color="#fff" :background="background" :border-bottom="false"></u-navbar>
		<!-- #endif -->
		
		<!-- 导航 -->
		<view class="tabs-box1">
			<u-tabs activeColor="#f29100" :list="list" :is-scroll="false" :current="current" @change="clitbs"></u-tabs>
		</view>

		<!-- 列表 -->
		<view class="page-box">
			<!-- 有订单的情况 -->
			<view class="tb1 flex justify-around align-center">
				<view>用户信息</view>
				<view>邀请时间</view>
			</view>

			<view class="team_content flex justify-between align-center" v-for="(item, index) in dataList" :key="res.id">
				<view class="tm_left flex justify-start align-center">
					<view>
						<image :src="item.avatar" mode=""></image>
					</view>
					<view class="u-m-l-20">
						<view class="usertitle ellipsis">{{item.username}}</view>
						<view class="userid">id:{{item.id}}</view>
					</view>
				</view>
				<view class="usertime u-font-14">
					{{item.join_team_time}}
				</view>

			</view>

			<!-- //加载提示 -->
			<view>
				<u-loadmore :status="loadStatus[current]" bgColor="#f2f2f2"></u-loadmore>
			</view>

		</view>



	</view>
</template>

<script>
	export default {
		name: 'team',
		data() {
			return {
				// #ifdef H5
					background: {
						backgroundColor:'#f33f5c'
					},
				// #endif
				
				dataList: [],
				list: [{
						name: '直接团队',
						id: 1
					},
					{
						name: '间接团队',
						id: 2
					}
				], //tabs列表
				a: '直接团队',
				b: '间接团队',
				current: 0, //当前选中tabs
				page: 1,
				loadStatus: ['loadmore', 'loadmore'],
			};
		},
		onLoad() {
			this.getTeamsList()
		},

		// 上拉加载事件
		onReachBottom() {
			console.log("触发了到底")
			// if (this.loadStatus[this.current] == 'nomore') {
			// 	uni.showToast({
			// 		title: '没有更多了'
			// 	});
			// 	return;
			// }
			this.loadStatus[this.current] = 'loading';
			this.getTeamsList();
			
		},
		methods: {

			// tab栏切换
			clitbs(index) {
				this.loadStatus[this.current] = 'loadmore';
				this.current = index;
				this.page = 1;
				this.dataList = []
				this.getTeamsList()
			},
			// 获取下级
			getTeamsList() {
								
				const that = this
				const data = {
					lv: this.list[this.current].id,
					page: this.page
				}
				
				this.$http.user.getTeamsList(data)
					.then(res => {
						if(res.data.list){
							that.page++;
							that.list[0].name = that.a + '(' + res.data.lv_1_count + ')'
							that.list[1].name = that.b + '(' + res.data.lv_2_count + ')'
							that.dataList = [...that.dataList, ...res.data.list]
							
							if (res.data.list.length < 20) {
								that.loadStatus[that.current] = 'nomore'
							}
						}
						console.log('获取下级', res)
					})
			},

		}
	}
</script>

<style scoped lang="scss">
	.team {
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

		.page-box {
			.tb1 {
				background-color: #fff;
				font-size: 34rpx;
				padding: 20rpx 0;
			}

			.team_content {
				background-color: #fff;
				font-size: 28rpx;
				padding: 20rpx 40rpx 20rpx 60rpx;
				border-bottom: 1px solid rgba($color: #ccc, $alpha: 0.3);

				.tm_left {
					.usertitle {
						max-width: 260rpx;
						margin-top: -2px;
						font-size: 26rpx;
					}

					.userid {
						margin-top: 3px;
						font-size: 26rpx;
						color: #878787;
					}

					image {
						width: 80rpx;
						height: 80rpx;
					}
				}


				.usertime {
					color: #878787;
				}
			}
		}

	}
</style>
