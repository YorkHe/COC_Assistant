import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'

import VueSocketIO from 'vue-socket.io'

Vue.use(VueSocketIO, 'http://localhost:3000')

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
