import { defineStore } from "pinia";

export const userStore = defineStore("counter", {
    state: () => ({ 
        authorId:null,
        userName:null,
        password:null,
        jwtToken:null,
        isLogin:false,
        authorFee:0,
        email:null,
        phone:null,
    }),

    actions: {
        setUserInfo(userInfo){
            this.userName = userInfo.userName;
            this.email = userInfo.email;
            this.phone = userInfo.phone;
            this.authorFee = userInfo.authorFee;
            this.authorId = userInfo.authorId;
            this.jwtToken = userInfo.token;
        },
        setUserName(name){
            this.userName = name;
        },
        setPassword(password){
            this.password = password;
        },
        setJwtToken(token){
            this.jwtToken = token;
        },

        setIsLogin(status){
            this.isLogin = status;
        },

        setAuthorId(id){
            this.authorId = id;
        },
        setAuthorFee(fee){
            this.authorFee = fee;
        },
        setPhone(phone){
            this.phone = phone;
        },
        setEmail(email){
            this.email = email;
        }
        
    },
    

    persist:true//启动持久化存储
});
