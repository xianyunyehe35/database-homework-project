import request from '@/utils/request'

export const ReviewerLogion=async (userName,password)=>{
    return await request({
        url:'/reviewer/login',
        method: 'post',
        data:{userName,password}
    })
}


