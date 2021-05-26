<template>
	<page-meta background-color-top="#f33f5c" background-color="#FFFFFF"></page-meta>
	<view class="container">

		<!-- #ifdef H5 -->
		<u-navbar :is-back="false" :title="appInfo.app_name" title-color="#fff" :background="background" :border-bottom="false"></u-navbar>
		<!-- #endif -->

		<view class="my_bg"></view>
		<view class="ho_swiper">
			<u-swiper :list="swiper_list" border-radius="10" name="img" bgColor="#fff" height="250" img-mode="widthFix"></u-swiper>
		</view>


		<view class="coupon" ref="coupon">

			<view class="tabs flex justify-around">
				<view class="tabs-item" @click="jump(projectList[2],1)">
					<view>
						<image src="../../static/tub1.png" mode=""></image>
					</view>
					<view>饿了么果蔬</view>
				</view>
				<view class="tabs-item" @click="jump(projectList[1],1)">
					<view>
						<image src="../../static/tub2.png" mode=""></image>
					</view>
					<view>美团商超</view>
				</view>
				<view class="tabs-item" @click="share_img_click">
					<view>
						<image src="../../static/tub3.png" mode=""></image>
					</view>
					<view>发送图文</view>
				</view>
				<label for="share">
					<view class="tabs-item">
						<view>
							<image src="../../static/tub4.png" mode=""></image>
						</view>
						<view>分享好友</view>
					</view>
				</label>
			</view>
			<button hidden id="share" type="default" open-type="share"></button>


			<view class="item" v-for="(v, i) in projectList" :key="i" @click="jump(v)">
				<view class="top flex align-center justify-between">
					<view class="left">
						<view class="title">{{v.title}}</view>
						<view class="info flex justify-start">
							<view class="price"><text class="p1">{{v.price}}</text>元</view>
							<view class="number">今日仅剩{{v.number}}个</view>
						</view>
						<view class="y y1"></view>
						<view class="y y2"></view>
					</view>
					<view class="right">免费领取</view>
				</view>

				<view class="logotext logotext2" v-if=" v.platform == 'meituan'">美团<br />外卖</view><!-- 左上角背景 -->
				<view class="logotext logotext2" v-if="v.platform == 'meituancard'">美团<br />信用卡</view>
				<view class="logotext logotext1" v-if="v.platform == 'ele'">饿了么</view><!-- 左上角背景 -->
				<view class="logotext logotext1" v-if="v.platform == 'elecard'">饿了么</view><!-- 左上角背景 -->
				
				<view class="logobg logobg2" v-if=" v.platform == 'meituan'">
					<image src="../../static/mtlogobg.png" mode=""></image>
				</view><!-- 左下角背景 -->
				
				<view class="logobg logobg2" v-if=" v.platform == 'meituancard'">
					<image src="../../static/mtlogobg.png" mode=""></image>
				</view><!-- 左下角背景 -->
				
				<view class="logobg logobg1" v-if=" v.platform == 'ele'">
					<image src="../../static/elmlogobg.png" mode=""></image>
				</view><!-- 左下角背景 -->
				
				<view class="logobg logobg1" v-if=" v.platform == 'elecard'">
					<image src="../../static/elmlogobg.png" mode=""></image>
				</view><!-- 左下角背景 -->
			</view>

			<share-img :bgImg="appInfo.poster_bg" :ewmImg="ewmImg" :isshow="isshow_share" @cloose_share_img="clooseShare" v-if="isshow_share"></share-img>
			
			<share-img :bgImg="mtcard_img" :isshow="ismtcard_show_share" @cloose_share_img="clooseShare" v-if="ismtcard_show_share"></share-img>
		
			<share-img :bgImg="elecard_img" :isshow="iselecard_show_share" @cloose_share_img="clooseShare" v-if="iselecard_show_share"></share-img>
		</view>
		
		
		<!-- 电影部分 -->
		<view class="movie">
			<view class="movie-head">
				<view class="movie-title">
					热映电影
				</view>
				<view class="movie-count">
					全部46部
				</view>
			</view>
			<view class="movie-list">
				<view class="item">
					<image class="cover" src="https://lanchong.oss-cn-beijing.aliyuncs.com/waimai/1.jpg" mode=""></image>
					<view class="name">
						寻龙传说
					</view>
					<view class="buy">
						已售空
					</view>
				</view>
				<view class="item">
					<image class="cover" src="https://lanchong.oss-cn-beijing.aliyuncs.com/waimai/2.png" mode=""></image>
					<view class="name">
						无依之地
					</view>
					<view class="buy">
						已售空
					</view>
				</view>
				<view class="item">
					<image class="cover" src="https://lanchong.oss-cn-beijing.aliyuncs.com/waimai/3.png" mode=""></image>
					<view class="name">
						唐人街探案3
					</view>
					<view class="buy">
						已售空
					</view>
				</view>
				<view class="item">
					<image class="cover" src="https://lanchong.oss-cn-beijing.aliyuncs.com/waimai/4.jpg" mode=""></image>
					<view class="name">
						送你一朵小红花
					</view>
					<view class="buy">
						已售空
					</view>
				</view>
			</view>
		</view>
		
		<view v-for="(item,index) in ad_list" :key="item.id">
			<view class="ad-view" v-if="item.img" v-on:click="webview(item.url)">
				<image :src="item.img"></image>
			</view>
		</view>

	</view>
</template>

<script>
	import shareImg from '../../components/share_img/share_img.vue'
	export default {
		components: {
			shareImg
		},
		data() {
			return {
				// #ifdef H5
				background: {
					backgroundColor: '#f33f5c'
				},
				// #endif
				swiper_list: [], //banner图列表
				projectList: [
					{
						title: '美团外卖红包',
						price: '48',
						number: '102',
						platform: 'meituan',
						path: '/pages/meituan/meituan'
					},
					{
						title: '天天减6元,周周享五折',
						price: '6',
						number: '57',
						platform: 'meituancard',
						path: '/pages/meituan/meituan'
					},
					{
						title: '饿了么外卖红包',
						price: '66',
						number: '237',
						platform: 'ele',
						path: '/pages/ele/ele'
					},
					{
						title: '天天扫码活动',
						price: '10',
						number: '320',
						platform: 'elecard',
						path: '/pages/ele/ele'
					},
					
				], //列表
				lv_1_id: null,
				isshow_share: false,
				ismtcard_show_share:false,
				iselecard_show_share:false,
				mtcard_img:'https://cps.open-shop.cn/img/1622012673265.png',
				elecard_img:'https://cps.open-shop.cn/img/k7vXsdQxmI7zItg67rj6V1kSgyvkJJ.jpg',
				ewmImg: '', //推广二维码
				ad_list:[], //ad图列表
			};
		},
		computed: {
			userInfo() {
				return this.$store.state.userInfo
			},
			scene() {
				return this.$store.state.scene
			},
			appInfo() {
				if(this.$store.state.appInfo && this.$store.state.appInfo.app_name){
					uni.setNavigationBarTitle({
						title:this.$store.state.appInfo.app_name
					})
				}
				return this.$store.state.appInfo
			}
		},
		onLoad(e) {
			const that = this
			let is_rodom = uni.getStorageSync("rodom_num");
			
			if (!is_rodom) {
				this.assignment()
			} else {
				let assig = JSON.parse(is_rodom)
				if ((new Date()).getTime() - assig.timestamp > 60 * 60 * 1000) {
					this.assignment()
				} else {
					this.$set(this.projectList[1], 'number', assig.meituan_num)
					this.$set(this.projectList[2], 'number', assig.ele_num)

				}
				console.log('assig', assig, new Date().getTime());
			}

			uni.$once('binduser', () => { //绑定推荐人
				if (that.userInfo.lv_1_id == 0) {

					if (Object.keys(e).length > 0) {
						if (e.scene) { //扫描二维码参数
							let da = JSON.parse(that.$decode(decodeURIComponent(e.scene)))
							that.lv_1_id = da.lv_1_id
							console.log("扫描二维码初始加载", that.lv_1_id)
						}
						if (e.lv_1_id) { //分享卡片参数
							that.lv_1_id = e.lv_1_id
							console.log('分享卡片初始加载', that.lv_1_id)
						}
					} else { //不通过分享，无上级，不再绑定
						// #ifdef MP-WEIXIN
						let ruLaunch = wx.getLaunchOptionsSync()
						that.lv_1_id = ruLaunch.scene * -1;
						// #endif
						// #ifdef H5
						that.lv_1_id = -1;
						// #endif
						console.log("不通过分享初始加载", that.lv_1_id)
					}

					that.$http.user.bindPromoter({
							lv_1_id: that.lv_1_id
						})
						.then(res => {
							console.log('绑定', res)
						})
				}
			})

			this.getwxqrcode()
			//请求ad
			this.getAdlist()
			// 请球banner
			this.getBannerlist()
			
		},

		onShow() {
			this.$store.commit('setele_currentid', 0);
			this.$store.commit('setmeituan_currentid', 0);
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
			jump(item, currenid) {
				console.log("item",item)
				if(item.platform == 'meituancard'){
					this.mtcard_show_share();
					return;
				}
				if(item.platform == 'elecard'){
					this.elecard_show_share();
					return;
				}
				console.log('currenid', currenid);
				if (currenid) {
					console.log('真');
					item.platform == 'ele' ? this.$store.commit('setele_currentid', currenid) : this.$store.commit(
						'setmeituan_currentid', currenid);
				} else {
					console.log('假');
					item.platform == 'ele' ? this.$store.commit('setele_currentid', 0) : this.$store.commit('setmeituan_currentid', 0);
				}
				uni.switchTab({
					url: item.path
				});
			},
			
			webview(url){
				uni.reLaunch({
					url:"url/url?url=" + url
				})
			},

			//打开分享图文
			share_img_click() {
				this.isshow_share = true
			},
			
			mtcard_show_share(){
				this.ismtcard_show_share = true
			},
			elecard_show_share(){
				this.iselecard_show_share = true
			},
			// 关闭
			clooseShare() {
				this.isshow_share = false
				this.ismtcard_show_share = false
				this.iselecard_show_share = false
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

				this.$http.user.getwxqrcode()
					.then(res => {
						console.log("生成的二维码",res.data.img)
						that.ewmImg = res.data.img
					})
			},


			// 获取banner
			getBannerlist() {
				const that = this
				that.$http.index.getBannerlist()
					.then(res => {
						console.log("请求banner成功", res)
						that.swiper_list = res.data
					})
					.catch(err => {
						console.log("请求失败", err)
					})
			},
			
			//ad
			getAdlist(){
				const that = this
				that.$http.index.getAdlist()
					.then(res => {
						console.log("请求ad成功", res)
						that.ad_list = res.data
					})
					.catch(err => {
						console.log("请求失败", err)
					})
			},
			
			// 赋值
			assignment() {
				let rodom_num = {
					meituan_num: this.random_number(100, 500),
					ele_num: this.random_number(100, 500),
					timestamp: (new Date()).getTime()
				}
				this.$set(this.projectList[1], 'number', rodom_num.meituan_num)
				this.$set(this.projectList[2], 'number', rodom_num.ele_num)
				uni.setStorageSync('rodom_num', JSON.stringify(rodom_num))
				console.log('rodom_num', rodom_num);
			},

			//随机函数
			random_number(start, end) {
				let differ = end - start
				let random = Math.random()
				return (start + differ * random).toFixed(0)
			},

			// 截取字符串加省略号
			showText(text, numSub) {
				if (text == null) {
					return "";
				}
				if (text.length > numSub) {
					return text.substring(0, numSub - 1) + "...";
				}
				return text;
			}
		}
	};
</script>

<style lang="scss">
	page {
		background-color: #f7f5f5;
	}

	.container {
		font-size: 14px;
		line-height: 24px;
		position: relative;
		
		// 电影
		.movie{
			display: block;
			width: 700rpx;
			margin: 20rpx auto;
			background-color: white;
			border-radius: 20rpx;
			padding: 20rpx;
			.movie-head{
				display: flex;
				width: 700rpx;
				
				.movie-title{
					width: 350rpx;
					text-align: left;
					font-size: 30rpx;
					font-weight: 700;
				}
				.movie-count{
					width: 310rpx;
					text-align: right;
					font-size: 24rpx;
				}
			}
			.movie-list::-webkit-scrollbar {
				display:none;
			}
			.movie-list{
				display: block;
				margin-top: 20rpx;
				white-space: nowrap;
				overflow-x: scroll;

				.item{
					display: inline-block;
					width: 170rpx;
					margin-right: 10rpx;
					.cover{
						display: blcok;
						width: 160rpx;
						height: 250rpx;
						border-radius: 8rpx;
					}
					.name{
						font-size: 28rpx;
						font-weight: 700;
						width: 170rpx;
						text-overflow: hidden;
						white-space: nowrap;
					}
					.buy{
						width: 120rpx;
						height: 54rpx;
						line-height: 54rpx;
						// background-color: #EA5858;
						 background-color: #d8d8d8;
						border-radius: 40rpx;
						color: white;
						font-size: 26rpx;
						text-align: center;
						
					}
				}
			}
		}

		.my_bg {
			position: absolute;
			top: 0;
			left: 0;
			width: 750rpx;
			padding: 30rpx 20rpx;
		}

		.my_bg:after {
			width: 100%;
			height: 90px;
			position: absolute;
			left: 0;
			top: 0;
			content: '';
			border-radius: 0 0 10% 10%;
			background-color: #f33f5c;
		}

		.ho_swiper {
			padding: 30rpx;
			background-color: #ffffff;

			image {
				width: 100%;
			}

		}


		.coupon {
			margin-top: 20rpx;

			.tabs {
				padding: 30rpx 0;
				background-color: #fff;
				text-align: center;

				.tabs-item {
					image {
						width: 90rpx;
						height: 90rpx;
					}
				}

			}

			.item {
				position: relative;
				background-color: #ffffff;
				margin: 30rpx;
				border-radius: 26rpx;
				padding: 20rpx;
				overflow: hidden;

				.top {
					height: 156rpx;
					position: relative;
					z-index: 99;

					.left {
						width: 400rpx;
						height: 100%;
						line-height: 50rpx;
						border-right: 1px dashed #ebebeb;
						padding: 16rpx 14rpx 0 0;
						position: relative;
						left: 70rpx;
						font-size: 24rpx;

						.title {
							font-size: 30rpx;
							margin-bottom: 6rpx;
							color: #000;
							font-weight: bold;
						}

						.price {
							color: #F0394B;
							margin-right: 4px;

							.p1 {
								font-size: 54rpx;
								font-weight: bold;
								margin-right: 6rpx;
								position: relative;
								top: 8rpx;
							}
						}

						.number {
							margin-top: 12rpx;
							color: #8f525d;
							padding: 0 10rpx;
							height: 48rpx;
							line-height: 48rpx;
							background-color: #ffe7e3;
							border-radius: 10rpx;
						}


						image {
							width: 52rpx;
							height: auto;
							vertical-align: bottom;
						}



						.y {
							position: absolute;
							right: 0;
							background-color: #f7f5f5;
							width: 40rpx;
							height: 40rpx;
							border-radius: 50%;
						}

						.y1 {
							transform: translate(50%, -100%);
							top: 0;
						}

						.y2 {
							transform: translate(50%, 100%);
							bottom: 0;
						}
					}

					.right {
						width: 170rpx;
						height: 66rpx;
						border-radius: 30rpx;
						background: linear-gradient(100deg, #ec6f43, #ea4a36);
						color: #fff;
						font-size: 28rpx;
						line-height: 66rpx;
						text-align: center;
					}


				}

				.logotext {
					position: absolute;
					top: -18rpx;
					left: -56rpx;
					width: 170rpx;
					height: 90rpx;
					font-size: 22rpx;
					text-align: center;
					padding-top: 34rpx;
					padding-right: 6rpx;
					transform: rotate(-45deg);

				}

				.logotext1 {
					color: #fff;
					background: linear-gradient(180deg, #43AAF9, #4997DC);
					// background-color: #5FA6F5;

				}

				.logotext2 {
					line-height: 28rpx;
					padding-top: 28rpx;
					color: #7d6c2e;
					font-weight: bold;
					background: linear-gradient(180deg, #FEF17A, #F2D727);
				}


				.logobg {
					position: absolute;
					z-index: 9;


					image {
						width: 90rpx;
						height: 90rpx;
					}
				}

				.logobg1 {
					bottom: -30rpx;
					left: 0rpx;
				}

				.logobg2 {
					transform: rotate(-10deg);
					opacity: 0.2;

					image {
						width: 180rpx;
						height: 180rpx;
					}

					bottom: -80rpx;
					left: -50rpx;

				}


			}
		}
		
		.bomlist{
			padding-bottom: 40rpx;
			.item{
				background-color: #fff;
				width: 700rpx;
				border-radius: 30rpx;
				margin: 30rpx auto 0;
				padding: 30rpx;
				image{
					    height: 340rpx;
					    border-radius: 40rpx;
				}
				.f19{
					font-size: 38rpx;
				}
				.f17_c88{
					 font-size: 34rpx;
					 color: #888;
				}
			}
		}
		


		.ad-view {
			background-color: #fff;
			width: 700rpx;
			border-radius: 30rpx;
			margin:30rpx auto;
			text-align: center;
			image {
				width: 100%;
				height: 360rpx;
				margin: 0 auto;
				text-align: center;
				border-radius: 30rpx;
			}
		}
	}
</style>
