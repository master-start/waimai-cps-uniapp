<template>
	<view class="share_img flex justify-center align-center" @touchmove.stop.prevent="clear">
		<view class="content" v-if="imgSrc != null">
			<view class="top">
				<view>
					<image :src="imgSrc" 
					:show-menu-by-longpress="true" 
					mode="widthFix"></image>
				</view>
				<view>长按图片发送朋友或保存</view>
			</view>
			<view class="bottom" @click="cloose_share_img">关闭</view>
		</view>

		<canvas :style="{width:widthIn*zoom+'px', height:heightIn*zoom+'px'}" canvas-id="graceCanvas" class="grace-canvas"></canvas>


	</view>
</template>

<script>
	export default {
		props: {
			bgImg: String, //背景图片
			ewmImg: String, //二维码图片
		},
		data() {
			return {
				imgSrc: null,
				widthIn: 650,
				heightIn: 1150,
				qrCodeWidth: 200, //二维码的宽度
				qrCodeX: 230, //二维码x坐标
				qrCodeY: 870, //二维码y坐标
				zoom: 1, //实际绘画出来的图片和界面上的规格比例
			}
		},
		created() {
			console.log('打开了分享海报传入的参数',this.bgImg,this.ewmImg);
		},
		// #ifdef MP-WEIXIN
		onReady() {
			console.log('分享海报开始生成');
			uni.showLoading({
				title: '海报生成中',
				mask: false
			});
			// 画布初始化
			this.context = uni.createCanvasContext('graceCanvas', this);
			this.draw();

		},
		// #endif
		// #ifdef H5
		mounted() {
			console.log('分享海报开始生成');
			uni.showLoading({
				title: '海报生成中',
				mask: false
			});
			// 画布初始化
			this.context = uni.createCanvasContext('graceCanvas', this);
			this.draw();
		
		},
		// #endif
		
		
		methods: {
			// 关闭
			cloose_share_img() {
				this.$emit('cloose_share_img')
			},
			// 阻止冒泡
			clear(e) {
				// TODO nvue 取消冒泡
				e.stopPropagation()
			},

			// 绘图相关

			// 海报绘制代码
			draw: function() {
				// 步骤 01. 绘制背景颜色
				this.step01();
				// 步骤 02. 绘制背景图片（如果需要，条件结构）
				if (this.bgImg != '') {
					console.log('this.bgImg', this.bgImg);
					this.drawBGIMG(this.bgImg, () => {
						// 步骤 03
						this.step03();
					});
				} else {
					this.step03();
				}
			},
			// 步骤 01 : 绘制背景颜色
			step01: function() {
				//如果有背景色就绘制
				if (this.bgColor) {
					this.context.setFillStyle(this.bgColor);
					this.context.fillRect(0, 0, this.widthIn, this.heightIn);
				}
			},

			// 绘制图片,参数 : 图片地址, 绘制完成后执行的回调函数
			drawBGIMG: function(img, callback) {
				console.log('步骤1：绘制背景图片');
				const that = this
				var zoom = this.zoom
				
				uni.downloadFile({
					url: img,
					success: (res) => {
						console.log('背景图下载成功', res.tempFilePath);
						if (res.statusCode == 200) {
							// 绘制
							uni.getImageInfo({
								src: res.tempFilePath,
								success: (res2) => {
									var bgImgHeight = (this.widthIn / res2.width) * res2.height;
									this.heightIn = parseInt(bgImgHeight)
									console.log('背景图信息及将要设置宽高', res2, this.widthIn, bgImgHeight);
									this.context.drawImage(res.tempFilePath, 0, 0, this.widthIn * zoom, bgImgHeight * zoom);
									callback();
								},
								fail(err) {
									console.log('背景图下载失败');
									uni.hideLoading()
								}
							});
						}
					},
					fail(err) {
						uni.hideLoading()
					}
				});
			
			
			},


			// 步骤 03 : 绘制二维码
			step03: function() {
				console.log("步骤 02. 绘制二维码")
				var that = this
				var zoom = this.zoom
				uni.downloadFile({
						url: that.ewmImg,
						success: (res) => {
							console.log('二维码下载成功', res.tempFilePath);
							if (res.statusCode == 200) {
								// 绘制
								uni.getImageInfo({
									src: res.tempFilePath,
									success: (res2) => {
										that.context.drawImage(res.tempFilePath, that.qrCodeX * zoom, that.qrCodeY * zoom, that.qrCodeWidth * zoom, that.qrCodeWidth *
											zoom);
										that.drawIt();
									},
									fail(err) {
										console.log('二维码下载失败');
										uni.hideLoading()
									}
								});
							}
						},
						fail(err) {
							uni.hideLoading()
						}
					});
			},


			// 最终绘制函数
			drawIt: function() {
				const that = this
				var zoom = this.zoom
				console.log("步骤3，最终绘制，渲染页面")
				
				// #ifdef MP-WEIXIN
				
				this.context.draw(true,
					setTimeout(() => {
						console.log("进入了回调")
						uni.canvasToTempFilePath({
							x: 0,
							y: 0,
							width: this.widthIn * zoom,
							height: this.heightIn * zoom,
							destWidth: this.widthIn * zoom,
							destHeight: this.heightIn * zoom,
							fileType: 'png',
							canvasId: 'graceCanvas',
							success: (res) => {
								// 在H5平台下，tempFilePath 为 base64
								uni.hideLoading()
								that.imgSrc = res.tempFilePath;
								console.log("最终绘制完成", res.tempFilePath)
							},
							fail: (err) => {
								console.log("最终绘制失败", err)
								uni.hideLoading()
							}
						}, that);
					}, 2000)


				);
			
			// #endif
			// #ifdef H5
			this.context.draw(true,() => {
				uni.canvasToTempFilePath({
					x: 0,
					y: 0,
					width: this.widthIn * zoom,
					height: this.heightIn * zoom,
					destWidth: this.widthIn * zoom,
					destHeight: this.heightIn * zoom,
					fileType: 'png',
					canvasId: 'graceCanvas',
					success: (res) => {
						// 在H5平台下，tempFilePath 为 base64
						uni.hideLoading()
						that.imgSrc = res.tempFilePath;
						console.log("最终绘制完成", res.tempFilePath)
					},
					fail: (err) => {
						console.log("最终绘制失败", err)
						uni.hideLoading()
					}
				});
			})
			
			// #endif
			
			
			},




			// 绘图相关


		}
	}
</script>


<style scoped lang="scss">
	.share_img {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 9999;
		width: 100vw;
		height: 100vh;
		background-color: rgba($color: #000, $alpha:0.3);

		.content {
			width: 630rpx;
			text-align: center;
			background-color: #fff;

			.top {
				padding-bottom: 20rpx;
				border-bottom: 1px solid #C0C4CC;
				color: #e84d00;

				image {
					margin-top: 40rpx;
					width: 500rpx;
					height: 800rpx;
				}
			}

			.bottom {
				width: 100%;
				padding: 30rpx 0;
				letter-spacing: 4rpx;
				font-size: 36rpx;
				color: #b3b3b3;
			}

		}

	}

	.grace-canvas {
		z-index: 99;
		top: 0;
		font-size: 0;
		display: flex;
		position: fixed;
		left: 9000px;

	}
</style>
