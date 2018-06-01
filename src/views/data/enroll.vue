<template>
  <div id="enroll">

      <!-- 查询 -->
    <el-form :inline="true" :model="formInline"  class="demo-form-inline">
      <el-form-item>
        <el-input v-model="formInline.activityId" placeholder="请输入活动ID"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search"  @click="onSubmit('formInline')" circle></el-button>
      </el-form-item>
     </el-form>

      <!-- 列表 -->
    <el-table :data="tableData" style="width: 100%"   max-height="700" border v-loading="loading2" element-loading-text="拼命加载中">
      <el-table-column prop="activityName" label="活动名称"></el-table-column>
      <el-table-column prop="phone" label="报名电话"></el-table-column>
      <el-table-column prop="status" label="报名状态"></el-table-column>
      <el-table-column prop="type" label="付款类型"></el-table-column>
      <el-table-column prop="money" label="报名金额"></el-table-column>
      <el-table-column prop="head" label="定金"></el-table-column>
      <el-table-column prop="tail" label="尾款"></el-table-column>
      <el-table-column prop="time" label="报名时间"></el-table-column>
      <el-table-column prop="wtime" label="订单完成时间"></el-table-column>
      <el-table-column prop="headTime" label="定金完成时间"></el-table-column>
      <el-table-column prop="tailTime" label="尾款完成时间"></el-table-column>
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
          activityId: ''
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
          activityId: this.formInline.activityId
        };
        this.$http({
            url: this.$http.adornUrl(`/enroll/list`),
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
      onSubmit(formName) {
       if(!this.formInline.activityId){
         this.$message.error('请填写活动ID')
       } else {
         this.loadData();
       }
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
