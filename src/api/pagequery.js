import request 	from '@/utils/request';

export const PageQueryList=async(PageDto)=>{
    return await request({
        url:'manuscript/getpage',
        method:'post',
        data:{
            authorId:PageDto.authorId,
            pageSize:PageDto.pageSize,
            pageNum:PageDto.pageNum,
            title:PageDto.title,
            typeId:PageDto.typeId
        }

    })
}