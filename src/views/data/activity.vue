<template>
  <div id="admin">

      <!-- 查询 -->
    <el-form :inline="true" :model="formInline"  class="demo-form-inline">
      <el-form-item>
        <el-input v-model="formInline.name" placeholder="请输入活动名称"></el-input>
      </el-form-item>

      <el-form-item>
      <el-select v-model="formInline.type" placeholder="请选择活动类型">
        <el-option label="活动" value="0"></el-option>
        <el-option label="培训" value="1"></el-option>
        <el-option label="考试" value="2"></el-option>
        <el-option label="all" value="-100"></el-option>
      </el-select>
      </el-form-item>

        <el-form-item>
        <el-select v-model="formInline.status" placeholder="请选择活动状态">
          <el-option label="进行中" value="0"></el-option>
          <el-option label="已结束" value="1"></el-option>
          <el-option label="all" value="-100"></el-option>
        </el-select>
        </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search"  @click="onSubmit" circle></el-button>
      </el-form-item>
     </el-form>

      <!-- 列表 -->
    <el-table :data="tableData" style="width: 100%"   max-height="700" border v-loading="loading2" element-loading-text="拼命加载中">
      <el-table-column prop="id" label="活动ID"></el-table-column>
      <el-table-column prop="name" label="活动名称"></el-table-column>
      <el-table-column  label="活动类型">
           <template slot-scope="scope">
               <span v-if="scope.row.type === 1">培训</span>
               <span v-else-if="scope.row.type ===2">考试</span>
               <span v-else-if="scope.row.type ===0">活动</span>
               <span v-else></span>
            </template>
      </el-table-column>
      <el-table-column  label="活动状态">
           <template slot-scope="scope">
               <span v-if="scope.row.status === 0">进行中</span>
               <span v-else-if="scope.row.status ===1">已结束</span>
               <span v-else></span>
            </template>
      </el-table-column>
      <el-table-column prop="money" label="费用"></el-table-column>
      <el-table-column prop="quota" label="名额"></el-table-column>
      <el-table-column prop="enrollNum" label="已报名"></el-table-column>
      <el-table-column prop="attentionNum" label="关注数"></el-table-column>
      <el-table-column prop="readNumber" label="阅读数"></el-table-column>
      <el-table-column prop="shareNumber" label="分享数"></el-table-column>
      <el-table-column prop="signNum" label="已签到数"></el-table-column>
      <el-table-column prop="start" label="活动开始时间"></el-table-column>
      <el-table-column prop="end" label="活动结束"></el-table-column>
      <el-table-column prop="creatTime" label="创建时间"></el-table-column>
    </el-table>

    <div style="margin-top: 5px;">
         <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            style="float:right"
            background
            > </el-pagination>
    </div>

  </div>
</template>

<style type="text/css">
</style>
<script type="text/javascript">
  export default {
    data() {
      return {
        tableData: [],
        formInline: {
          name: '',
          type:'',
          status:''
        },
        currentPage:1,
        total:0,
        pageSize:10,
        loading2: false
      }
    },
    mounted() {
      this.loadData();
    },
    methods: {
      //加载数据
      loadData() {
        this.loading2 = true;
        var params = {
          page: this.currentPage,
          pageSize: this.pageSize,
          name: this.formInline.name,
          type:this.formInline.type,
          status:this.formInline.status
        };
        this.$http({
            url: this.$http.adornUrl(`/activity/list`),
            method: 'post',
            data: this.$http.postparam(params)
          }).then(function({data}){
          this.tableData = data.data.list;
          this.total = data.data.total;
          this.loading2 = false;
        }.bind(this)).catch(function (error) {
            this.loading2 = false;
            console.log(error);
        }.bind(this));
      },
      //查询
      onSubmit() {
      this.loadData();
      },
      //改变分页大小
      handleSizeChange(val) {
        this.pageSize = val;
      },
      //跳转页数
      handleCurrentChange(val) {
        this.currentPage = val;
        this.loadData();
      },
      resetForm(formName) {
         if (this.$refs[formName]!==undefined) {
             this.$refs[formName].resetFields();
         }
      }
    }
  }
</script>
