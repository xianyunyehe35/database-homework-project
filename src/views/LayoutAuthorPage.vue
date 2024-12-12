<script setup>
import router from '@/router';
import { userStore } from '@/stores';
import { ref ,onBeforeMount} from 'vue';
import {PageQueryList} from '@/api/pagequery'
import { getManuscript,deleteManuscript,getTypelist,saveManuscript } from '@/api/manuscript';

const user=userStore();
const PageDto=ref({
  authorId:user.authorId,
  pageNum:1,
  pageSize:5,
  total:0,
  title:null,
  typeId:null

})
const tabledata=ref([])
//文章类型数组
const typelist=ref([])
// const test=async()=>{
//   const res= await PageQueryList(PageDto.value)
//   // console.log(res)
// }

//请求文章数据并渲染函数
const getTableData=async()=>{
  try {
    const res = await PageQueryList(PageDto.value);
    console.log(res);
    tabledata.value = res.data.data.list;
    PageDto.value.total = res.data.data.total;
  } catch (error) {
    
    throw error; // 重新抛出错误，以便外部的 try...catch 可以捕获
  }
}


onBeforeMount(async()=>{
  getTableData()

  //请求获取类型列表
  const typeres=await getTypelist()
  // console.log(typeres)
  typelist.value=typeres.data.data
  console.log(typelist.value)
})

const toLoginPage = () => {
  router.push({ path: '/login' });
};



const handDelete=async(row)=>{
  
  tabledata.value=tabledata.value.filter((item)=>{
    return item.manuscriptId!=row.manuscriptId
  })

  

  //发送请求更新数据库
  await deleteManuscript(row.manuscriptId);
}


//处理编辑的
const form=ref({
  manuscriptId:null,
  title:'',
  content:'',
  typeId:null
})
//控制抽屉显示
const drawer=ref(false)


const handleEdit=async(row)=>{
  // console.log(row)
  drawer.value=true //触发弹出表单，编辑数据
  const res=await getManuscript(row.manuscriptId)
  // console.log(res)

  
  form.value.manuscriptId=res.data.data.manuscriptId
  form.value.title=res.data.data.title
  form.value.content=res.data.data.content
  // console.log(typelist.value.filter(item => item.typeId == res.data.data.typeId)[0].typeName)
  
  //bug来源filteredType是文字而不是id
  const filteredType = typelist.value.filter(item => item.typeId == res.data.data.typeId)[0]

  if (filteredType) {
    form.value.typeId = filteredType.typeName;
  } else {
    form.value.typeId = '';
    console.error('No matching type found');
  }
  console.log(form.value)
}

const handleSave=async()=>{
  console.log(form.value)
  let res=await saveManuscript(form.value)
  // console.log(res)
  drawer.value=false
  getTableData()
}

const handleCancel=()=>{
  drawer.value=false
}

//处理筛选文章
const searchform=ref({
  title:'',
  typeId:'文学'
})


const sendSearch = async () => {
  console.log(PageDto.value);
  try {
    await getTableData(); // 使用 await 确保错误可以被捕获
  } catch (error) {
    // console.error(error); // 正确地记录或处理错误
    resetSearch();
  }
}

const resetSearch=()=>{
  PageDto.value.title=null
  PageDto.value.typeId=null
}
</script>



<template>
    <div class="common-layout">
      <el-container>
        <el-header>
          <span @click="toLoginPage">返回登录</span>
          <span>作者页面</span>
          <span>设置</span>
        </el-header>
        <el-main>

          <el-card style="width:80%;margin:0 auto;">
            <template #header>
              <!-- <el-button @click="test">测试</el-button> -->

              <div class="search-box">
                <div class="search-left">
                  <span style="margin-right: 10px;">标题</span>
                  <el-input  v-model="PageDto.title" style="width: 100px;margin-right: 50px;"></el-input>
                  <span style="margin-right: 10px;">选择文章类型</span>
                  <el-select v-model="PageDto.typeId" style="width: 100px; margin-right: 10px;" >  <!--el-select v-model='对象' 是选定好的选项的值绑定到对象  -->
                    <el-option v-for="item in typelist"  
                      :value="item.typeId" 
                      :key="item.typeId" 
                      :label="item.typeName">
                      
                    </el-option>
                  </el-select>

                  <el-button @click="sendSearch" type="primary">搜索</el-button>
                  <el-button @click="resetSearch" type="primary">重置</el-button>
                </div>
                
                
                <div class="search-action">
                    <el-button @click="handleAdd" type="primary">添加文章</el-button>
                </div>
              </div>
                
             
            </template>
            
            <el-table  :data="tabledata" :table-layout="'fixed'"  @row-click="handlerow">
              <el-table-column  prop="title"   label="标题" > </el-table-column>
              <el-table-column prop="content" label="内容" > </el-table-column>
              <el-table-column prop="submissionDate" label="上传时间" > </el-table-column>
              <el-table-column prop="typeName" label="类型" > </el-table-column>
              <el-table-column prop="status" label="状态" > </el-table-column>
              <el-table-column  label="操作" >
                <template #default="{row}">
                  <div>
                    <el-button type="primary" @click="handleEdit(row)">编辑</el-button>
                    <el-button type="danger"  @click="handDelete(row)" >删除</el-button>
                  </div>

                </template>
              
              </el-table-column>
              </el-table>
          </el-card>
          
          
            

          <el-pagination
            v-model:page-size="PageDto.pageSize"
            :page-sizes="[10, 20, 30]"
            v-model:current-page="PageDto.pageNum"
            v-model:total="PageDto.total"
            :background ="true"
            layout="total, sizes, prev, pager, next"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
          
        </el-main>

        <el-drawer v-model="drawer" title="编辑稿件" size="50%">
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

            <el-button @click="handleSave" type="primary">保存</el-button> 
            <el-button @click="handleCancel">取消</el-button>
          </template>
          
        </el-drawer>
      </el-container>
      
    </div>
</template>
  

<style>
.common-layout {
  height: 100vh;
  background-color: aqua;
}


.el-header {
  background-color: black;
  height: 60px;
  text-align: center;
  line-height: 60px;
  color: white;
  display: flex;
  justify-content: space-between;
}

.el-pagination {
  margin-top: 50px;
  display: flex;
  justify-content: center;
}

.el-table{
  width:80%;
  margin:0 auto;
  /* display: flex;
  justify-content: space-between; */
}

.contentClass{
  height: 200px;
  overflow: auto;
  
}
.search-box{
  display: flex;
  justify-content: space-between;
}

.search-left{
  display: flex;
  align-items: center;
}
.search-action{
  display: flex;
  align-items: center;
}
</style>