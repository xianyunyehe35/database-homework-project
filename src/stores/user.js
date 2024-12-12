import { defineStore } from "pinia";

export const userStore = defineStore("counter", {
    state: () => ({ 
        authorId:null,
        userName:null,
        password:null,
        jwtToken:null,
        isLogin:false,
    }),

    actions: {
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
        }
        
    },
    

    persist:true//启动持久化存储
});
