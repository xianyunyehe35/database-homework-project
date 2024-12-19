import request from '@/utils/request'

export const ReviewerLogion=async (userName,password)=>{
    return await request({
        url:'/reviewer/login',
        method: 'post',
        data:{userName,password}
    })
}

export const updateReviewerInfo=async(data)=>{
    return await request({
        url:'/reviewer/update',
        method: 'post',
        data
    })
}


