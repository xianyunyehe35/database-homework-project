import request from "@/utils/request";

/**
 * 用户登录功能
 *
 * @param {string} userName 用户名
 * @param {string} userpassword 用户密码
 * @returns {Promise<any>} 登录结果
 */
export const Login=async(userName,passWord)=>{
    const res=await request.post('/user/login',{userName,passWord})
    return res

}

/**
 * 用户注册函数
 *
 * @param {string} userName 用户名
 * @param {string} userpassword 用户密码
 * @returns {Promise<void>} 无返回值
 */
export const Reginster=async(userName,password)=>{
    const res= await request.post('/user/register',{userName,password})
    return res;
}

