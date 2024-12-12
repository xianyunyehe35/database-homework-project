// stores/authStore.js
import { defineStore } from 'pinia';

export const ReviewerStore = defineStore('auth', {
  state: () => ({
    reviewerId:null,
    username:null,
    password:null,
    token:null,
    isLogin:false
  }),
  actions: {
    
    setPassword(password) {
      this.password = password;
    },
    setUsername(username) {
      this.username = username;
    },
    setToken(token) {
      this.token = token;
    },
    setLogin(isLogin) {
      this.isLogin = isLogin;
    },
    setReviewerId(reviewerId) {
      this.reviewerId = reviewerId;
    }
  },
  persist: true
});
