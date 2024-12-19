import axios from 'axios'
import { userStore ,reviewerStore} from '@/stores/index';
import { ElMessage } from 'element-plus';
import  router  from '@/router/index'
//这个是请求的基地址
const baseURL = 'http://localhost:8080'

//创建axios实例
const instance = axios.create({
  baseURL,
  timeout:50000
})


//设置拦截器
// 添加请求拦截器
instance.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    const user = userStore()
    const reviewer = reviewerStore()
    if(user.jwtToken&&user.isLogin){//判断是用户
      console.log("用户请求")
      config.headers["token"] = `${user.jwtToken}`;
        console.log(user.jwtToken)
    }
    if(reviewer.token&&reviewer.isLogin){//判断是评审人
      console.log("评审人请求")
      config.headers["token"] = `${reviewer.token}`;
    }
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
instance.interceptors.response.use(function (res) {
    // 对响应数据做点什么
    if (res.data.status === 200) {//res.data代表后端返回的数据
      console.log("操作成功") 
      console.log(res)
      return res
      }
      ElMessage({ message: res.data.message || '服务异常', type: 'error' })
      return Promise.reject(res.data)
  }, function (error) {
    // 对响应错误做点什么
    ElMessage({ message: error.message || '服务异常', type: 'error' })
    console.log(error)
    if (error.response) {
      ElMessage({ message: error.message || '服务异常', type: 'error' });
      if (error.response.status === 401) {
          router.push('/login'); // 跳转到登录页面
      }
      return Promise.reject(error);
    } else {
        // Handle network errors or errors where error.response is undefined
        ElMessage({ message: '网络错误或无响应数据', type: 'error' });
        return Promise.reject(new Error('Network error or no response'));
    }
  });


  export default instance
  export {baseURL}