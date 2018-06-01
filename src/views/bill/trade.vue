<template>
  <div id="admin">
      <!-- 查询 -->
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item>
            <el-input v-model="formInline.prepay_id" placeholder="请输入订单ID"></el-input>
          </el-form-item>
      <el-form-item>
        <el-input v-model="formInline.openid" placeholder="请输入微信ID"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="formInline.status" placeholder="请选择订单状态">
          <el-option label="初始化" value="0"></el-option>
          <el-option label="过期" value="-1"></el-option>
          <el-option label="成功" value="1"></el-option>
          <el-option label="all" value="-100"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="formInline.channel" placeholder="请选择支付通道">
          <el-option label="微信" value="0"></el-option>
          <el-option label="余额" value="1"></el-option>
          <el-option label="all" value="-100"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="formInline.type" placeholder="请选择支付方式">
          <el-option label="全款" value="0"></el-option>
           <el-option label="定金" value="1"></el-option>
          <el-option label="all" value="-100"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search"  @click="onSubmit" circle></el-button>
        <el-button type="primary" icon="el-icon-search" @click="resetForm('formInline')">重置</el-button>
      </el-form-item>
     </el-form>

      <!-- 列表 -->
    <el-table :data="tableData" style="width: 100%"   max-height="700" border v-loading="loading2" element-loading-text="拼命加载中">
      <el-table-column prop="prepay_id" label="订单ID"></el-table-column>
      <el-table-column prop="openid" label="用户微信ID"></el-table-column>
      <el-table-column prop="money" label="金额"></el-table-column>
      <el-table-column prop="original" label="原价"></el-table-column>
      <el-table-column prop="original" label="tail"></el-table-column>
      <el-table-column  label="订单状态">
          <template slot-scope="scope">
              <span v-if="scope.row.status === 0"> 初始化 </span>
              <span v-else-if="scope.row.status === -1">过期</span>
              <span v-else-if="scope.row.status === 1">成功 </span>
              <span v-else></span>
           </template>
      </el-table-column>
      <el-table-column label="支付方式">
           <template slot-scope="scope">
               <span v-if="scope.row.type === 1"> 定金</span>
               <span v-else-if="scope.row.type ===2">余额</span>
               <span v-else-if="scope.row.type ===0">全款</span>
               <span v-else></span>
            </template>
      </el-table-column>
      <el-table-column  label="支付通道">
           <template slot-scope="scope">
               <span v-if="scope.row.channel ===1">余额</span>
               <span v-else-if="scope.row.channel ===0">微信</span>
               <span v-else></span>
            </template>
      </el-table-column>
      <el-table-column prop="activity.id" label="活动id"></el-table-column>
      <el-table-column prop="activity.id" label="活动名称"></el-table-column>
      <el-table-column prop="start" label="开始时间"></el-table-column>
      <el-table-column prop="expire" label="过期时间"></el-table-column>
      <el-table-column prop="complete" label="完成时间"></el-table-column>
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
          openid: '',
          prepay_id: '',
          status:'',
          type: '',
          channel: ''
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
          prepay_id: this.formInline.prepay_id,
          openid: this.formInline.openid,
          status: this.formInline.status,
          type: this.formInline.type,
          channel: this.formInline.channel
        };
        this.$http({
            url: this.$http.adornUrl(`/trade/list`),
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
             this.formInline= {
                openid: '',
                prepay_id: '',
                status:'',
                type: '',
                channel: ''
              }
      }
    }
  }
</script>
