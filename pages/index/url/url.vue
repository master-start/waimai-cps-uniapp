<template>
	<view>
		<web-view :src="url"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url:'https://www.baidu.com'
			}
		},
		onLoad(res) {
			console.log("载入的数据",res)
			this.url = res.url;
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
