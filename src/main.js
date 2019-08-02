import Vue from 'vue'
import App from './App.vue'
import router from './router'

import 'normalize.css'

Vue.config.productionTip = false

//追加
import firebase from 'firebase/app'
// require("firebase/firestore")
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBDeinVc7W9F8bdPfqmu1QulEzz5NsTZ7U",
  authDomain: "moc-todo-app-3385f.firebaseapp.com",
  databaseURL: "https://moc-todo-app-3385f.firebaseio.com",
  projectId: "moc-todo-app-3385f",
  storageBucket: "",
  messagingSenderId: "161001393474",
  appId: "1:161001393474:web:c2c5cb7af693d430"
};
// 追加
firebase.initializeApp(firebaseConfig)

export const db = firebase.firestore();
// window.db = db

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
