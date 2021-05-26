<template>
	<view class="binding">
		<view class="bdsuccess" v-if="userInfo.tbk_r_id" >已绑定 {{userInfo.tbk_name}} 的饿了么账号</view>
		<view class="bdsuccess" v-else >请绑定饿了么账号</view>
		
		<view class="ewm_img">
			<image :src="'https://api.pwmqr.com/qrcode/create/?url='+encode_auth_url" :show-menu-by-longpress="true"></image>
		</view>
		<view class="content">
			【绑定步骤】</br>
			1.长按保存二维码到手机</br>
			2.打开饿了么，扫描二维码</br>
			3.点击授权，完成绑定</br>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				encode_auth_url: '', // 要生成的二维码值
			}
		},
		computed: {
			userInfo() {
				return this.$store.state.userInfo
			},
		},
		onLoad() {			
			uni.showLoading({
				title: '稍等一下'
			});
			this.getUrl()
		},
		methods: {
			getUrl(){
				const that = this
				this.$http.user.eleauth_url()
					.then(res => {
						console.log(res)
						uni.hideLoading()
						that.encode_auth_url = res.data.encode_auth_url
						
						
					})
			}

		},
	}
</script>

<style scoped lang="scss">
	.binding{
		.bdsuccess{
			    color: #00aaff;
			    margin-top: 50rpx;
			    font-size: 34rpx;
			    text-align: center;
		}
		.ewm_img {
			

			margin:  50rpx auto ;
			text-align: center;
			image{
				padding: 4rpx;
				border: 1px solid #000;
				width: 300rpx;
				height: 300rpx;
				vertical-align: middle;
			}
		}
		.content{
			padding: 40rpx;
			line-height: 70rpx;
			font-size: 36rpx;
		}
	}
</style>
