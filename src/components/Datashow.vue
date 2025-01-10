<script setup>
import router from '@/router';

import { ref ,onBeforeMount,defineExpose} from 'vue';
import {PageQueryList} from '@/api/pagequery'
import { getTypelist} from '@/api/manuscript';
import {userStore,reviewerStore} from '@/stores/index'

import {updateUserInfo} from '@/api/user'
import {updateReviewerInfo} from '@/api/reviewer'
const props=defineProps({
  typeoflist:{
    type:Array,
    default:()=>[]
  },
  pageDto:{
    type:Object,
    default:()=>{}
  },
  LoginStatus:{
    type:String,
  }

})

const typelist=ref(props.typeoflist)
const PageDto=ref(props.pageDto)

const handleCurrentChange=(page)=>{
  PageDto.value.pageNum=page
  getTableData()
}
const tabledata=ref([])
//控制每一行的弹窗
const popoverStates = ref({});
//------------请求文章数据并渲染函数
const getTableData=async()=>{
  try {
    console.log("请求文章数据")
    console.log(PageDto.value)
    const res = await PageQueryList(PageDto.value);
    console.log(res);
   
    tabledata.value = res.data.data.list.map(item => {
      // 假设后端返回的数据中包含了审核状态
      popoverStates.value[item.manuscriptId] = {
        visible: false,
        type: item.status,  // 'Accepted', 'Rejected', 或其他状态
        tempType:null,
        getdoing:null
      };
      return item;
    });
    console.log("请求文章数据")
    console.log(tabledata.value)
    PageDto.value.total = res.data.data.total;
    console.log(popoverStates.value)
  } catch (error) {
    console.error('Failed to fetch data:', error);
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
  router.push({ path: '/' });
};




//-----------处理筛选文章
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


const togglePopover = (rowId) => {
  
  return popoverStates.value[rowId].visible

};

const changeStatus=(rowId,type)=>{
  popoverStates.value[rowId].getdoing=type
  showPopover(rowId)
}
const showPopover=(rowId)=>{
  if(popoverStates.value[rowId]){
    popoverStates.value[rowId].visible=true
    
  }
 
}
const hidePopover = (rowId) => {
  if (popoverStates.value[rowId]) {
    popoverStates.value[rowId].visible = false;
  }
};



const checkStatus=(rowId)=>{
  return popoverStates.value[rowId] ? popoverStates.value[rowId].type : '';
}



const ensureAction=(rowId)=>{
  popoverStates.value[rowId].type=popoverStates.value[rowId].getdoing
  
  hidePopover(rowId)
}

const getdoing=(manuscriptId)=>{
  return popoverStates.value[manuscriptId].getdoing
} 
const cancelAction=(rowId)=>{
  
  hidePopover(rowId)
}

//抽屉个人信息部分
const drawer=ref(false)
const user=userStore()
const reviewer=reviewerStore()
const userInfo=ref({})


const rules={
  userName:[{required:true,message:"请输入用户名",trigger:"blur"},
    {notEmpty:true,message:"用户名不能为空",trigger:"blur"}
  ],
  email:[{required:true,message:"请输入邮箱",trigger:"blur"},
    {notEmpty:true,message:"邮箱不能为空",trigger:"blur"},
    {type:"email",message:"邮箱格式不正确",trigger:"blur"}
  ],
  phone:[{required:true,message:"请输入手机号",trigger:"blur"},
    {notEmpty:true,message:"手机号不能为空",trigger:"blur"},
    { pattern: /^[0-9]{10,11}$/,message:"手机号格式不正确",trigger:"blur"}
  ]
}

const toAccountInfo=()=>{
  drawer.value=true
  console.log(props.LoginStatus)
  console.log(user)
  if(props.LoginStatus==="author"){
    userInfo.value={...user}
   console.log("现在是作者")
    console.log(userInfo.value)
  }else{
    userInfo.value={...reviewer}
    console.log("现在是审核员")
    console.log(userInfo)

  }

}
const saveUserInfo=async()=>{
  console.log(userInfo.value)
  if(props.LoginStatus=="author"){  
    userInfo.value.authorFee=null
    await updateUserInfo(userInfo.value)
   
  }else{
    userInfo.value.reviewerFee=null
    await updateReviewerInfo(userInfo.value)
   
  }
  console.log("保存成功")
  drawer.value=false
}

//跳转账户信息
//对外提供接口
defineExpose({
  getTableData,
  tabledata
})

</script>

<template>

      <el-container>
        <el-header>
          <span @click="toLoginPage">返回登录</span>

          <!-- 头部插槽 定义页面-->
          <slot name="heard"></slot>

          <span @click="toAccountInfo">账户信息</span>
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
                
                
                <!-- <div class="search-action">
                    <el-button @click="handleAdd" type="primary">添加文章</el-button>
                </div> -->
                <slot name="addManuscript"></slot>
              </div>
                
             
            </template>
            <!-- 展示数据 -->
            <el-table   :data="tabledata" :table-layout="'fixed'"  max-height="500" @row-click="handlerow">
              <el-table-column  prop="title"   label="标题" > </el-table-column>
              <el-table-column prop="content" label="内容" show-overflow-tooltip> </el-table-column>
              <el-table-column prop="submissionDate" label="上传时间" > </el-table-column>
              <el-table-column prop="typeName" label="类型" > </el-table-column>
              <el-table-column  label="评阅人" > 
                <template #default="{row}">
                  {{row.reviewerName ? row.reviewerName : '暂无'}}
                </template>
              </el-table-column>
              <el-table-column prop="authorName" label="作者" > </el-table-column>
              <el-table-column prop="status" label="状态" > </el-table-column>
              <el-table-column  label="操作" >
                <template #default="{row}">
                  
                  <slot name="action"  :ensureAction="ensureAction"  
                        :cancelAction="cancelAction" :row="row"    
                        :checkStatus="checkStatus" :toggle-popover="togglePopover" 
                        :changeStatus="changeStatus" :hidePopover="hidePopover" 
                        :showPopover="showPopover"
                        :getdoing="getdoing" 
                        
                        
                  ></slot> 
                  
                </template>
              
              </el-table-column>
              </el-table>
          </el-card>
          
          
            

          <el-pagination
            v-model:page-size="PageDto.pageSize"
            :page-sizes="[5, 10,20]"
            v-model:current-page="PageDto.pageNum"
            v-model:total="PageDto.total"
            :background ="true"
            layout="total, sizes, prev, pager, next"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
          
        </el-main>

        
      </el-container>
      
    <el-drawer
      v-model="drawer"
      title="个人信息"
      :direction="rtl"
      
    >
      <el-form
        :model="userInfo"
        :rules="rules"

      >
        <el-form-item label="用户名" prop="userName">
          <el-input  v-model="userInfo.userName"/>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" >
          <el-input  v-model="userInfo.email"/>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input  v-model="userInfo.phone"/>
        </el-form-item>
        
      </el-form>

      <div v-if="props.LoginStatus=='author'">
        作者稿费:{{user.authorFee}}
      </div>      
      <div v-else>
        审核员稿费:{{reviewer.reviewerFee}}
      </div>
      <div >
        <el-button type="primary" @click="saveUserInfo">保存</el-button>
      </div>
    </el-drawer>
</template>

<style>



.el-header {
  background-color: black;
  height: 60px;
  text-align: center;
  line-height: 60px;
  color: white;
  display: flex;
  justify-content: space-between;
}

.el-main{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.el-container {
  display: flex;
  flex-direction: column;
  height: 100%; /* 确保容器填满父元素 */
}

.el-table {
  flex: 1; /* 让主内容区域填充所有可用空间 */
  overflow: auto; /* 如果内容过多，允许滚动 */
}

.el-pagination {
  margin-top: 50px;
  display: flex;
  justify-content: center;
}


.el-table{
  width:80%;
  margin:0 auto;
  width: 100%;
  margin: 0 auto;
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


</style>