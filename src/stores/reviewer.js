// stores/authStore.js
import { defineStore } from 'pinia';

export const reviewerStore = defineStore('auth', {
  state: () => ({
    reviewerId:null,
    userName:null,
    password:null,
    token:null,
    isLogin:false,
    phone:null,
    reviewerFee:0,
    email:null,
  }),
  actions: {
    setReviewerInfo(userInfo){
      this.userName = userInfo.userName;
      this.password = userInfo.password;
      this.token = userInfo.token;
      this.reviewerFee = userInfo.reviewerFee;
      this.reviewerId = userInfo.reviewerId;
      this.phone = userInfo.phone;
      this.email = userInfo.email;

    },
    setPassword(password) {
      this.password = password;
    },
    setUserName(username) {
      this.userName = username;
    },
    setToken(token) {
      this.token = token;
    },
    setLogin(isLogin) {
      this.isLogin = isLogin;
    },
    setReviewerId(reviewerId) {
      this.reviewerId = reviewerId;
    },
    setReviewerFee(fee){
      this.reviewerFee = fee;
    },
    setPhone(phone){
      this.phone = phone;
    },
    setEmail(email){
      this.email = email;
    }
  },
  persist: true
});
