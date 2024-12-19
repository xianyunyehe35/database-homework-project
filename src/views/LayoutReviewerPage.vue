<script setup>

import TestShow from '@/components/TestShow.vue'
import {ref ,onBeforeMount} from 'vue'
import {getTypelist,saveManuscript} from '@/api/manuscript'
import {reviewerStore} from '@/stores/index'



const reviewer=reviewerStore()

const pageDto=ref({
  authorId:null,
  pageNum:1,
  pageSize:5,
  total:0,
  title:null,
  typeId:null
})
//文章类型数组
const typelist=ref([])
onBeforeMount(async()=>{
  console.log("评阅人页面渲染")
  //请求获取类型列表
  const typeres=await getTypelist()
  // console.log("列表获取成功")
  // console.log(typeres)
  typelist.value=typeres.data.data
  
})



//修改文章状态
const confirmAction=async(manuscriptId,type)=>{
  const data={
    manuscriptId:manuscriptId,
    reviewerId:reviewer.reviewerId,
    status:type
  }
  const res=await saveManuscript(data)
  console.log(res)

  render.value.getTableData()
}




</script>

<template>

   



  <div class="common-layout">
   
    <Datashow :typeoflist="typelist" :pageDto="pageDto" ref="render" LoginStatus="reviewer">
        
        <template #heard>
          <h1>审核员页面</h1>
        </template>
        <template #action="{row, checkStatus,togglePopover ,changeStatus,ensureAction,cancelAction,getdoing}">
          <el-button type="success" @click="changeStatus(row.manuscriptId, 'Accepted')" :disabled="checkStatus(row.manuscriptId)!=='Submitted'">过审</el-button>
          <el-button type="danger" @click="changeStatus(row.manuscriptId, 'Rejected')" :disabled="checkStatus(row.manuscriptId)!=='Submitted'">拒绝</el-button>
          
      
          <el-popover :visible="togglePopover(row.manuscriptId)" :placement="top" >
            <p v-if="getdoing(row.manuscriptId)==='Accepted'">确定要过审吗？</p>
            <p v-else>确定要拒绝吗？</p>
            <el-button type="primary" @click="()=>{confirmAction(row.manuscriptId,getdoing(row.manuscriptId)), ensureAction(row.manuscriptId)}">确认</el-button>
            <el-button type="danger" @click="()=>{ cancelAction(row.manuscriptId)}">取消</el-button>
          </el-popover>
        </template>
    </Datashow>


  </div>
</template>

<style>
.common-layout {
  height: 100vh;
  background-color: aqua;
}
.search-action{
  display: flex;
  align-items: center;
}
</style>