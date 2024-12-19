<script setup>
import { ref ,onBeforeMount} from 'vue'
import { User,Lock } from '@element-plus/icons-vue'
import { userStore,reviewerStore } from '@/stores/index';

import { Login,Reginster } from '@/api/user';
import { ReviewerLogion } from '@/api/reviewer';

import router from '@/router';


//登录界面初始化
 const user = userStore()
  const reviewer=reviewerStore()
onBeforeMount(() => {
 
  user.setIsLogin(false)
  console.log("Updated user isLogin:", user.isLogin)
  user.setPassword("")
  user.setAuthorId("")
  reviewer.setLogin(false)
  reviewer.setPassword("")
  reviewer.setReviewerId("")
  
  
})

//控制登录状态
const userlogin=ref("true")
  const userreigister=ref("false")
const changStatue=()=>{
 
    userlogin.value=!userlogin.value
  
 }

const toRegister=()=>{
  userreigister.value=!userreigister.value
}


//作者信息和函数
//使用仓库并绑定到store中

const userName=ref(user.userName)
const passWord=ref(user.password)

const authorLogin=async()=>{
  console.log(userName.value,passWord.value)
  const res=await Login(userName.value,passWord.value)
 console.log(res)
  console.log("用户登录成功")
  user.setIsLogin(true)//说明是用户登录
  user.setUserInfo(res.data.data)
  console.log(user)
  router.push("/userLayout")//跳转到layout页面
}

const sendRegiser=async()=>{
  const res=  await Reginster(userName.value,passWord.value)
  console.log(res)
  console.log("注册成功")
  toRegister();//返回登录界面

}


//评审人信息和函数

const reviewerName=ref(reviewer.userName)
const passWord2=ref(reviewer.password)
const reviewerLogin=async()=>{
  const res = await ReviewerLogion(reviewerName.value, passWord2.value);
  console.log("评审人登录成功");
  console.log("返回的数据")
  console.log(res)
  reviewer.setLogin(true);
  reviewer.setReviewerInfo(res.data.data)
  
  console.log(reviewer)
  router.push("/reviewLayout");
  
}

</script>



<template>
  <el-row class="login" :gutter="6">
    <el-col :span="12" class="left" >
    </el-col>
    
   <el-col :span="6" class="right" :offset="3" > <!-- 登陆界面右边-->
      <div v-if="userreigister">
        
        <el-row >
          <el-col :span="12" :class="{choose1:true,active:userlogin,inactive:!userlogin}" style="border-right: 1px solid black;border-radius: 10px 0 0 10px;" @click="changStatue">用户登录</el-col>
          <el-col :span="12" :class="{choose1:true,active:!userlogin,inactive:userlogin}" style="border-radius: 0 10px 10px 0;"  @click="changStatue">评阅人登录</el-col>
        </el-row>
            
        <el-form v-if="userlogin" >
          
          <el-form-item  >
            <h1 style="font-weight: 600;margin-top: 10px;">登录</h1>
          </el-form-item>
          
          <el-form-item    >
            <!-- <el-input  :prefix-icon="User" placeholder="用户名"/> -->
             <el-input  :prefix-icon="User" placeholder="用户名" v-model="userName"/>
          </el-form-item>

          <el-form-item    >
            <el-input :prefix-icon="Lock"  placeholder="请输入密码" v-model="passWord" />
          </el-form-item>


          <el-form-item >
            <div @click="toRegister" style="font-weight: 500; cursor: pointer; ">去注册</div>
          </el-form-item>
          <el-form-item >
            <el-button type="primary" style="width: 100%" @click="authorLogin">登录</el-button>
          </el-form-item>

          <el-form-item >

          </el-form-item>
        </el-form>

        <el-form v-else ><!--评阅人登录--->
          
          <el-form-item  >
            <h1 style="font-weight: 600;margin-top: 10px;">评阅人登录</h1>
          </el-form-item>
          
          <el-form-item    >
            <el-input  :prefix-icon="User" placeholder="用户名" v-model="reviewerName"/>
          </el-form-item>

          <el-form-item    >
            <el-input :prefix-icon="Lock"  placeholder="请输入密码" v-model="passWord2" />
          </el-form-item>

          <el-form-item >
            <el-button type="primary" style="width: 100%" @click="reviewerLogin">登录</el-button>
          </el-form-item>

          
        </el-form>
      </div>
      <!-- 注册 -->
      <div v-else>
        <el-form>
          
          <el-form-item  >
            <h1 style="font-weight: 600;margin-top: 10px;">注册</h1>
          </el-form-item>
          
          <el-form-item    >
            <el-input  :prefix-icon="User" placeholder="新用户名" v-model="userName"/>
          </el-form-item>

          <el-form-item    >
            <el-input :prefix-icon="Lock"  placeholder="请输入密码" v-model="passWord"  />
          </el-form-item>

          <el-form-item>
            <div @click="toRegister" style="font-weight: 500;cursor: pointer;" > 返回</div>
          </el-form-item>
         
          <el-form-item >
            <el-button type="primary" style="width: 100%" @click="sendRegiser">作者注册</el-button>
          </el-form-item>

          
        </el-form>
      </div>
      

    </el-col>
  </el-row>

  

</template>



<style>
.login {
  min-height: 100vh;
 
}

.left {
  background: url('@/assets/Login/login.png') no-repeat center center / cover; /* 优化显示 */
  border-radius: 0 20px 20px 0;
}

.right {
  overflow-y: auto;
  padding-top: 300px;
}

.form{
  width: 400px;
  border-top: 1px solid #eee;
  
}



.choose1{
  width: 50%; 
  text-align: center;
   
}
.el-form-item{
  margin-bottom: 30px;
  
}
/* 下面两个类用来控制用户登录切换和评阅人登录 */
.active {
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
  background-color: #409EFF;
  color: white;
  transition: all 0.3s ease;
}

.inactive {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  background-color: #ffffff; /* 使用更浅的背景色 */
  color: #333;
  transition: all 0.3s ease;
}
</style>


