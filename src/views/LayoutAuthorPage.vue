<script setup>
import {ElMessage} from 'element-plus'
import Datashow from '@/components/Datashow.vue';
import {ref,onBeforeMount} from 'vue'
import { deleteManuscript,addManuscript ,getTypelist,saveManuscript} from '@/api/manuscript';
import { userStore } from '@/stores';
import {aliPay} from '@/api/aliPay'

const render=ref(null)
const user=userStore()
const pageDto=ref({
  authorId:user.authorId,
  pageNum:1,
  pageSize:5,
  total:0,
  title:null,
  typeId:null
})

//文章类型数组
const typelist=ref([])
onBeforeMount(async()=>{
  console.log("作者页面渲染")
  //请求获取类型列表
  const typeres=await getTypelist()
  // console.log(typeres)
  typelist.value=typeres.data.data
  // console.log(typelist.value)
})



//-----------处理添加文章

const isAdd=ref(false)
const handleAdd=()=>{
  drawer.value=true
  isAdd.value=true
  isEdit.value=false
  form.value.manuscriptId=null
  form.value.title=null
  form.value.content=null
  form.value.typeId=1
  form.value.authorId=user.authorId
  
}

//添加文章的支付功能
//关于支付功能，建立WebSocket连接，监听支付结果
const socketUrl=`ws://localhost:8080/imserver/${user.authorId}`
socketUrl.replace("http","ws").replace("https","ws")
const socket=new WebSocket(socketUrl)


socket.onopen=(event)=>{
  console.log("WebSocket连接成功")
}
socket.onmessage=(event)=>{
  console.log("收到支付结果")
  console.log(event.data)
  if(event.data=="success"){
    ElMessage.success("支付成功")
    handlePublish()
  }else{
    ElMessage.error("支付失败")
  }

}
socket.close=(event)=>{
  console.log("WebSocket连接关闭")
}


//发起支付
const handlePay=async()=>{
  const res=await aliPay(user.authorId)
  const url=res.data.message
  window.open(url)
}



const handlePublish=async()=>{
  if(form.value.title==null){
    ElMessage.error('请输入标题')
    return
  }
  if(form.value.content==null){
    ElMessage.error('请输入内容')
    return
  }

  
  
  await addManuscript(form.value)
  drawer.value=false
  isAdd.value=false

  render.value.getTableData()
}



//--处理删除文章
const handDelete=async(row)=>{
  await deleteManuscript(row.manuscriptId);
  // 检查当前页数据是否为0
  console.log(render.value.tabledata)
  if (render.value.tabledata.length === 1) {
    // 如果是最后一条数据，且当前页码大于1，则自动跳转到前一页
    if (pageDto.value.pageNum > 1) {
      pageDto.value.pageNum--;
    }
  }
  render.value.getTableData(); // 重新获取数据
}

//------处理编辑的 --不被组件化的
const form=ref({
  manuscriptId:null,
  title:'',
  content:'',
  typeId:null,
  authorId:null
})
//控制抽屉显示
const drawer=ref(false)
const isEdit=ref(false)

const handleEdit=async(row)=>{
  console.log(row)
  drawer.value=true //触发弹出表单，编辑数据
  isEdit.value=true
  isAdd.value=false
  //const res=await getManuscript(row.manuscriptId)
  // console.log(res)

  
  form.value.manuscriptId=row.manuscriptId
  form.value.title=row.title
  form.value.content=row.content
  // console.log(typelist.value.filter(item => item.typeId == res.data.data.typeId)[0].typeName)
  
  //bug来源filteredType是文字而不是id
  const filteredType = typelist.value.filter(item => item.typeId == row.typeId)[0]
  // console.log("filteredType")
  // console.log(filteredType)
  if (filteredType) {
    form.value.typeId = filteredType.typeId;
  } else {
    form.value.typeId = '';
    console.error('No matching type found');
  }
 
}

const handleSave=async()=>{
  // console.log(form.value)
  if(form.value.title==null){
    ElMessage.error('请输入标题')
    return
  }
  if(form.value.content==null){
    ElMessage.error('请输入内容')
    return
  }
  let res=await saveManuscript(form.value)
  // console.log(res)
  drawer.value=false
  render.value.getTableData()
}

const handleCancel=()=>{
  drawer.value=false
}

</script>

<template>
   <div class="common-layout">
   
      <Datashow :typeoflist="typelist" :pageDto="pageDto" ref="render" LoginStatus="author">
        <template #heard>
          <h1>作者页面</h1>
        </template>
        <template #action="{row}">
          <el-button type="primary" @click="handleEdit(row)" >编辑</el-button>
          <el-button type="danger"  @click="handDelete(row)" >删除</el-button>
        </template>

        <template #addManuscript>
          <div class="search-action">
                    <el-button @click="handleAdd" type="primary">添加文章</el-button>
          </div>
        </template>
      </Datashow>

      <el-drawer v-model="drawer" :title="isEdit?'编辑稿件':'发布文章'" size="50%">
            <el-form :data="form">
              <el-form-item  label="标题">
                <el-input v-model="form.title" />
              </el-form-item>

              <el-form-item label="内容" v-model="form.content" >
                  <el-input :class="['contentClass']"  
                    v-model="form.content"  
                    type="textarea"
                    :rows="10" 
                    />       
              </el-form-item>
            
              <el-form-item label="分类">
                <el-select v-model="form.typeId" >  <!--el-select v-model='对象' 是选定好的选项的值绑定到对象  -->
                  <el-option v-for="item in typelist"  
                    :value="item.typeId" 
                    :key="item.typeId" 
                    :label="item.typeName">
                    
                  </el-option>
                </el-select>

              </el-form-item>
            </el-form>

            <template #footer>
              <div v-if="isEdit">
                <el-button @click="handleSave" type="primary">保存</el-button> 
                <el-button @click="handleCancel">取消</el-button>
              </div>
              <div v-else-if="isAdd">
                <el-button type="primary" @click="handlePay">发布文章</el-button>
              </div>
            </template>
            
      </el-drawer>
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