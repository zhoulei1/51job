<template>
  <div id="users">

      <!-- 查询 -->
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="formInline.name" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search"  @click="onSubmit" circle></el-button>
      </el-form-item>
     </el-form>

      <div style="margin-bottom: 5px;">
         <el-button type="primary" @click="dialogFormVisible=true,resetForm('addform')">添加</el-button>
      </div>

      <!-- 列表 -->
    <el-table :data="tableData" style="width: 100%"   max-height="650" border v-loading="loading2" element-loading-text="拼命加载中"  @selection-change="handleSelectionChange">
      <el-table-column type="selection"  fixed="left"></el-table-column>
      <el-table-column prop="id" label="id"></el-table-column>
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column prop="updateTime" label="更新时间"></el-table-column>
      <el-table-column fixed="right" label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeData(scope.$index)" circle></el-button>
          </template>
      </el-table-column>
    </el-table>



    <div style="margin-top: 5px;">
         <el-button type="primary" @click="batchRemove">批量删除</el-button>
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
   <el-dialog title="添加管理员" :visible.sync="dialogFormVisible" width="30%" center>
      <el-form :model="addform" :rules="rules" ref="addform" label-width="100px" class="demo-ruleForm" label-position="right">
        <el-form-item label="用户名" prop="bcname">
          <el-input v-model="addform.bcname"></el-input>
        </el-form-item>
         <el-form-item label="密码" prop="pass">
          <el-input v-model="addform.pass"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible=false">取消</el-button>
        <el-button type="primary" @click="addsubmit('addform')">确 定</el-button>
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
          username: ''
        },
        currentPage:1,
        total:0,
        pageSize:10,
        dialogFormVisible: false,
        addform: {
            bcname: '',
            pass: ''
        },
        loading2: false,
        multipleSelection: [],
        rules: {
          bcname: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          pass: [
            { required: true, message: '请输入密码', trigger: 'blur' }
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
          username: this.formInline.name
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
         if (this.$refs[formName]!==undefined) {
             this.$refs[formName].resetFields();
         }
      },
      addsubmit(formName){
        this.$refs[formName].validate((valid) => {
           if(valid){
              this.$http({
                   url: this.$http.adornUrl(`/user/add`),
                   method: 'post',
                   data: this.$http.postparam({
                   'username': this.addform.bcname ,
                   'password': this.addform.pass
                   })
                 }).then(({data}) => {
                     if (data.success) {
                       this.$message({
                         message: '操作成功',
                         type: 'success',
                         duration: 1500
                     })
                      this.resetForm(formName)
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
      removeData(row) {
        let rowdata = this.tableData[row];
        this.$confirm('确定要删除"'+rowdata.username+'"?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
              url: this.$http.adornUrl(`/user/delete`),
              method: 'post',
              data: this.$http.postparam({userid: rowdata.id})
            }).then(({data}) => {
                if (data && data.code === 200) {
                  this.$message({
                    message: '操作成功',
                    type: 'success',
                    duration: 1500
                  })
                  this.loadData()
                } else {
                  this.$message.error(data.message)
                }
              })
        }).catch(() => {
        });
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
     batchRemove() {
        let ids = [];
        this.multipleSelection.forEach(row => {
           ids.push(row.id)
        });
        if (ids.length==0) {
         this.$message.error("请至少选择一项")
         return;
        }
      this.$confirm('确定要删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
              url: this.$http.adornUrl(`/user/batchdelete`),
              method: 'post',
              data: this.$http.postparam({userids:ids.join(',')})
            }).then(({data}) => {
                if (data && data.code === 200) {
                  this.$message({
                    message: '操作成功',
                    type: 'success',
                    duration: 1500
                  })
                  this.loadData()
                } else {
                  this.$message.error(data.message)
                }
              })
        }).catch(() => {
        });
      }
    }
  }
</script>
