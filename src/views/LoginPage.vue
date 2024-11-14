<script setup>
import { ref } from 'vue'
import { User,Lock } from '@element-plus/icons-vue'

const message=ref("welcome to LoginPage")

//控制登录状态
const userlogin=ref("true")
const userreigister=ref("false")
const changStatue=()=>{
 
    userlogin.value=!userlogin.value
  
 }

const toRegister=()=>{
  userreigister.value=!userreigister.value
}

const sendLogin=()=>{
  console.log("登录")
}

const sendRegiser=()=>{
  console.log("注册")
}
</script>



<template>
  <el-row class="login" :gutter="6">
    <el-col :span="12" class="left" >
    </el-col>
    
   <el-col :span="6" class="right" :offset="3">  <!-- 登陆界面右边-->
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
            <el-input  :prefix-icon="User" placeholder="用户名"/>
          </el-form-item>

          <el-form-item    >
            <el-input :prefix-icon="Lock"  placeholder="请输入密码" />
          </el-form-item>


          <el-form-item >
            <div @click="toRegister" style="font-weight: 500; cursor: pointer; ">注册</div>
          </el-form-item>
          <el-form-item >
            <el-button type="primary" style="width: 100%" @click="sendLogin">登录</el-button>
          </el-form-item>

          <el-form-item >

          </el-form-item>
        </el-form>

        <el-form v-else ><!--评阅人登录--->
          
          <el-form-item  >
            <h1 style="font-weight: 600;margin-top: 10px;">评阅人登录</h1>
          </el-form-item>
          
          <el-form-item    >
            <el-input  :prefix-icon="User" placeholder="用户名"/>
          </el-form-item>

          <el-form-item    >
            <el-input :prefix-icon="Lock"  placeholder="请输入密码" />
          </el-form-item>

          <el-form-item >
            <el-button type="primary" style="width: 100%">登录</el-button>
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
            <el-input  :prefix-icon="User" placeholder="新用户名"/>
          </el-form-item>

          <el-form-item    >
            <el-input :prefix-icon="Lock"  placeholder="请输入密码" />
          </el-form-item>

          <el-form-item>
            <div @click="toRegister" style="font-weight: 500;cursor: pointer;" > <-返回</div>
          </el-form-item>
         
          <el-form-item >
            <el-button type="primary" style="width: 100%" @click="sendRegiser">注册</el-button>
          </el-form-item>

          
        </el-form>
      </div>
      

    </el-col>
  </el-row>

  

</template>



<style>
.login {
  height: 100vh;
 
}

.left {
  background: url('@/assets/Login/login.png') no-repeat center center / cover; /* 优化显示 */
  border-radius: 0 20px 20px 0;
}

.right {
  
  padding-top: 400px;
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


