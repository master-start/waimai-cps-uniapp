import Vue from 'vue'
import App from './App'
import store from './store'
import Api from './http/api.js'
let base64 = require('./components/js-base64/base64.js').Base64

Vue.config.productionTip = false

import uView from 'uview-ui';
Vue.use(uView);

Vue.prototype.$decode = base64.decode

Vue.prototype.$http = Api

// #ifdef H5
import wechat from './wechat.js'
if(wechat.isWechat()){
    Vue.prototype.$wechat = wechat;
}

// #endif

App.mpType = 'app'

const app = new Vue({
    ...App,
		store
})
app.$mount()
