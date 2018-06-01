<template>
  <div id="users">

      <!-- 查询 -->
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="formInline.openid" placeholder="请输入微信ID"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="formInline.phone" placeholder="请输入微信手机号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="formInline.myschool" placeholder="请输入学校"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="formInline.myclass" placeholder="请输入班级"></el-input>
      </el-form-item>
      <el-form-item>
      <el-select v-model="formInline.role" placeholder="请选择角色">
        <el-option label="普通用户" value="0"></el-option>
        <el-option label="活动管理员" value="1"></el-option>
        <el-option label="培训管理员" value="2"></el-option>
        <el-option label="超级管理员" value="3"></el-option>
        <el-option label="all" value="-1"></el-option>
      </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search"  @click="onSubmit" circle></el-button>
        <el-button type="primary" icon="el-icon-search" @click="resetForm('formInline')">重置</el-button>
      </el-form-item>
     </el-form>

      <!-- 列表 -->
    <el-table :data="tableData" style="width: 100%"   max-height="700" border v-loading="loading2" element-loading-text="拼命加载中"  @selection-change="handleSelectionChange">
       <!--
       <el-table-column type="selection"  fixed="left"></el-table-column>
       -->
      <el-table-column prop="id" label="用户ID" fixed="left"></el-table-column>
      <el-table-column prop="phone" label="微信手机号"></el-table-column>
      <el-table-column prop="nickName" label="微信昵称"></el-table-column>
      <el-table-column  label=" 角色">
          <template slot-scope="scope">
          <div>
              <span v-if="scope.row.role === 0"> 普通用户 </span>
              <span v-else-if="scope.row.role === 1">活动管理员</span>
              <span v-else-if="scope.row.role === 2">培训管理员 </span>
              <span v-else-if="scope.row.role === 3">超级管理员</span>
              <span v-else></span>
              <span style="margin-left: 3px;"> <el-button type="success" icon="el-icon-edit" size="mini" @click="roleedit(scope.$index)" circle></el-button></span>

              </div>
           </template>
      </el-table-column>
      <el-table-column prop="balance" label="余额"></el-table-column>
      <el-table-column prop="qq" label="qq"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="idcard" label="身份证号"></el-table-column>
      <el-table-column prop="myschool" label="学校"></el-table-column>
      <el-table-column prop="myclass" label="班级"></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
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

    <!-- Form -->
   <el-dialog title="修改角色" :visible.sync="dialogFormVisible" width="20%" center>
      <el-form :model="roleform" :rules="rules" ref="roleform" label-width="100px" class="demo-ruleForm" label-position="right">
        <el-form-item>
          <el-input v-model="roleform.id" type="hidden"></el-input>
        </el-form-item>
        <el-form-item label="微信昵称">
        <el-input v-model="roleform.nickName":disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="微信手机号">
             <el-input v-model="roleform.phone":disabled="true"></el-input>
        </el-form-item>
         <el-form-item label="角色" prop="role">
                        <el-select v-model="roleform.role" placeholder="请选择角色">
                          <el-option label="普通用户" value="0"></el-option>
                          <el-option label="活动管理员" value="1"></el-option>
                          <el-option label="培训管理员" value="2"></el-option>
                          <el-option label="超级管理员" value="3"></el-option>
                        </el-select>
        </el-form-item>
      </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogFormVisible=false">取消</el-button>
          <el-button type="primary" @click="rolesubmit('roleform')">确 定</el-button>
        </div>
    </el-dialog>
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
          phone: '',
          myschool: '',
          myclass: '',
          role:''
        },
        currentPage:1,
        total:0,
        pageSize:10,
        dialogFormVisible: false,
        roleform: {
            id: '',
            role:'' ,
            nickName:'',
            phone:''
        },
        loading2: false,
        multipleSelection: [],
        rules: {
          role: [
            { required: true, message: '请选择角色', trigger: 'blur' }
          ]
        }
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
          openid:  this.formInline.openid,
          phone:  this.formInline.phone,
          myschool:this.formInline.myschool,
          myclass: this.formInline.myclass,
          role:this.formInline.role
        };
        this.$http({
            url: this.$http.adornUrl(`/user/list`),
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
                  phone: '',
                  myschool: '',
                  myclass: '',
                  role:''
                }
      },
      roleedit(row){
        this.dialogFormVisible=true;
         let rowdata = this.tableData[row];
         this.roleform.id=rowdata.id
         this.roleform.role=rowdata.role+''
         this.roleform.nickName=rowdata.nickName
         this.roleform.phone=rowdata.phone
      },
      rolesubmit(formName){
        this.$refs[formName].validate((valid) => {
           if(valid){
              this.$http({
                   url: this.$http.adornUrl(`/user/refresh/role`),
                   method: 'post',
                   data: this.$http.postparam({
                   'id': this.roleform.id ,
                   'role':this.roleform.role
                   })
                 }).then(({data}) => {
                     if (data.success) {
                       this.$message({
                         message: '操作成功',
                         type: 'success',
                         duration: 1500
                     })
                      this.dialogFormVisible = false;
                      this.loadData()
                     } else {
                       this.$message.error(data.message)
                        return;
                     }
                   })
              }
       })
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      }
    }
  }
</script>
