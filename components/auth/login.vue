<template>
	<view class="login flex justify-center align-center" v-if="isshow">

		<view class="subject">
			<view  class="userAvatarUrl"><open-data type="userAvatarUrl" ></open-data></view>
			<view class="userNickName"><open-data type="userNickName"></open-data></view>
			<label for="userinfo"><view class="subject_item subject_login">微信一键登录</view></label>
			<view class="subject_item subject_item subject_nologin" @click="jumpindex">暂不登录</view>
		</view>
		
		
		
		
		<button v-show="false" id="userinfo" open-type="getUserInfo" @getuserinfo="getuserinfo"></button>
	</view>
</template>

<script>
	export default {
		props: {
			isshow: true,
			isauthuser: true,
		},
		data() {
			return {
				userinfo: null,
				code: null,
			};
		},
		created() {
			uni.login({
				success: (res) => {
					this.code = res.code
				}
			})
		},
		
		methods: {
			getuserinfo(e) {
				const that = this;
				console.log('授权用户信息', e)
				const data = e.detail.userInfo;

				that.$http.user.updateInfo(data)
					.then(res => {
						console.log('更新了用户信息', res)
						uni.$emit('getuserinfo')
					})
				
			},
		
			jumpindex(){
				uni.switchTab({
				    url: '/pages/index/index'
				});
			}
		},

	}
</script>

<style scoped lang="scss">
	.login {
		width: 100vw;
		height: 100vh;
		background-color: rgba($color:#000, $alpha:0.2);
		z-index: 99999;
		position: fixed;
		top: 0;
		left: 0;

		.subject {
			width: 500rpx;
			padding: 40rpx 20rpx;
			background-color: #fff;
			border-radius: 10rpx;
			font-size: 30rpx;

			.userAvatarUrl{
				width: 150rpx;
				height: 150rpx;
				margin: 0 auto;
				border-radius:50%;
				overflow: hidden;
								
			}
			
			.userNickName{
				text-align: center;
				margin-top: 20rpx;
			}
			
			.subject_item{
				width: 400rpx;
				text-align: center;
				padding: 20rpx 0;
				margin: 20rpx auto 0;
				border-radius:50rpx;
			}
			
			.subject_login{
					background-color: red;
					color: #fff;
			}
				

			}

	}
</style>
