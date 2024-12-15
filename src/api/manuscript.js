import request from '@/utils/request';

export const getManuscript = async (id) => {
    return await request.get(`/manuscript/getmanuscript/${id}`);
}

export const deleteManuscript = async (id) => {
    return await request.put(`/manuscript/del/${id}`);
}

export const getTypelist=()=>
{
    return request.get('/manutype/gettype')
}

export const saveManuscript=async(data)=>{
    return await request.put('/manuscript/changStatus',data)
}

export const addManuscript=async(data)=>{
    return await request.post('/manuscript/publish',data)
}
