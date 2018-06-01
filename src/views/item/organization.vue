<template>
  <div id="organization">
      <!-- 查询 -->
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="formInline.name"  placeholder="请输入机构名"></el-input>
      </el-form-item>
      <el-form-item>
       <el-button icon="el-icon-search"  @click="onSubmit" circle></el-button>
      </el-form-item>
     </el-form>

      <div style="margin-bottom: 5px;">
         <el-button type="primary" @click="dialogFormVisible=true,resetForm('addform')">添加</el-button>
      </div>

      <!-- 列表 -->
    <el-table :data="tableData" style="width: 100%"  max-height="700" border v-loading="loading2" element-loading-text="拼命加载中"  @selection-change="handleSelectionChange">
      <el-table-column type="selection" fixed="left"></el-table-column>
      <el-table-column prop="id" label="id"></el-table-column>
      <el-table-column prop="name" label="机构名"></el-table-column>
      <el-table-column prop="avatarUrl" label="机构url"></el-table-column>
       <<el-table-column label="机构用户">
        <template slot-scope="scope">
          <div>
              <span> {{scope.row.userList?scope.row.userList.length:0}}</span>
              <span style="margin-left: 3px;"> <el-button type="success" icon="el-icon-edit" size="mini" @click="useredit(scope.$index)" circle></el-button></span>
              </div>
         </template>
       </el-table-column>
      <el-table-column fixed="right" label="操作" align="center">
        <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit"  size="mini" @click="edit(scope.$index)" circle></el-button>
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

    <!-- 添加机构 -->
   <el-dialog title="添加机构" :visible.sync="dialogFormVisible" width="30%" center>
      <el-form :model="addform" :rules="rules" ref="addform" label-width="100px" class="demo-ruleForm" label-position="right">
        <el-form-item label="机构名" prop="name">
          <el-input v-model="addform.name"></el-input>
        </el-form-item>
         <el-form-item label="机构url"  prop="avatarUrl">
          <el-input v-model="addform.avatarUrl"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible=false">取消</el-button>
        <el-button type="primary" @click="addsubmit('addform')">确 定</el-button>
      </div>
    </el-dialog>


        <!-- 修改机构 -->
   <el-dialog title="修改机构" :visible.sync="editDialogFormVisible" width="30%" center>
      <el-form :model="editform" :rules="rules" ref="editform" label-width="100px" class="demo-ruleForm" label-position="right">
        <el-input v-model="editform.id" type="hidden"></el-input>
        <el-form-item label="机构名" prop="name">
            <el-input v-model="editform.name"></el-input>
        </el-form-item>
         <el-form-item label="机构url" prop="avatarUrl">
            <el-input v-model="editform.avatarUrl"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editDialogFormVisible=false">取消</el-button>
        <el-button type="primary" @click="editsubmit('editform')">确 定</el-button>
      </div>
    </el-dialog>

            <!-- 修改用户 -->
       <el-dialog title="机构用户" :visible.sync="userDialogFormVisible" width="60%" center>
          <el-form :model="userform" :rules="rules" ref="userform" label-width="100px" class="demo-ruleForm" label-position="right">
            <el-input v-model="userform.id" type="hidden"></el-input>
            <el-form-item label="机构名:" >
            {{userform.name}}
            </el-form-item>
          </el-form>

          <!-- 用户列表 -->
        <div style="margin-bottom: 5px;">
           <el-button type="primary" @click="userAddDialogFormVisible=true,resetForm('userAddform')">添加</el-button>
        </div>
        <el-table :data="userform.userList" style="width: 100%"  max-height="650" border v-loading="loading2" element-loading-text="拼命加载中">
          <el-table-column prop="id" label="id" type="hidden"></el-table-column>
          <el-table-column prop="name" label="姓名"></el-table-column>
          <el-table-column prop="nickName" label="姓名"></el-table-column>
          <el-table-column prop="phone" label="手机号"></el-table-column>
          <el-table-column fixed="right" label="操作" align="center">
            <template slot-scope="scope">
                 <i class="el-icon-remove"  @click="userremove(scope.$index)"></i>
            </template>
          </el-table-column>
        </el-table>

          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="userDialogFormVisible=false">取消</el-button>
            <el-button type="primary" @click="usersubmit('userform')">确 定</el-button>
          </div>

              <!-- 添加机构用户 -->
       <el-dialog title="添加机构用户" :visible.sync="userAddDialogFormVisible" width="30%" center append-to-body>
          <el-form :model="userAddform" :rules="rules" ref="userAddform" label-width="100px" class="demo-ruleForm" label-position="right">
            <el-form-item label="用户ID" prop="userid">
              <el-input v-model="userAddform.userid"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="userAddDialogFormVisible=false">取消</el-button>
            <el-button type="primary" @click="userAddsubmit('userAddform')">确 定</el-button>
          </div>
        </el-dialog>



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
          name: ''
        },
        currentPage:1,
        total:0,
        pageSize:10,
        dialogFormVisible: false,
        editDialogFormVisible: false,
        userDialogFormVisible: false,
        userAddDialogFormVisible: false,
        addform: {
            name: '',
            avatarUrl: ''
        },
        editform: {
            id:'',
            name: '',
            avatarUrl: ''
        },
        userform: {
            id:'',
            name: '',
            avatarUrl: '',
            userList:[]
        },
        userAddform: {
            userid:''
        },
        loading2: false,
        multipleSelection: [],
        rules: {
          name: [
            { required: true, message: '请输入机构名称', trigger: 'blur' }
          ],
          avatarUrl: [
            { required: true, message: '请输入机构url', trigger: 'blur' }
          ],
          userid: [
            { required: true, message: '请输入用户ID', trigger: 'blur' }
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
          name: this.formInline.name
        };
        this.$http({
            url: this.$http.adornUrl(`/organization/list`),
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
        this.loadData();
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
          if (valid) {
             this.$http({
                 url: this.$http.adornUrl(`/organization/add`),
                 method: 'post',
                 data: this.$http.postparam({
                 'name': this.addform.name ,
                 'avatarUrl': this.addform.avatarUrl
                 })
               }).then(({data}) => {
                   if (data.success) {
                     this.$message({
                       message: '操作成功',
                       type: 'success',
                       duration: 1500
                   })
                    this.dialogFormVisible = false;
                    this.resetForm(formName)
                    this.loadData()
                   } else {
                     this.$message.error(data.message)
                      return;
                   }
                 })
          }
        });
      },
      //修改机构
      edit(row) {
        let rowdata = this.tableData[row]
        this.editform.avatarUrl=rowdata.avatarUrl
        this.editform.id=rowdata.id
        this.editform.name=rowdata.name
        this.editDialogFormVisible=true
      },
      editsubmit(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
             this.$http({
                 url: this.$http.adornUrl(`/organization/refresh`),
                 method: 'post',
                 data: this.$http.postparam({
                 'id':   this.editform.id ,
                 'name': this.editform.name ,
                 'avatarUrl': this.editform.avatarUrl
                 })
               }).then(({data}) => {
                   if (data.success) {
                     this.$message({
                       message: '操作成功',
                       type: 'success',
                       duration: 1500
                   })
                    this.editDialogFormVisible = false;
                    this.resetForm(formName)
                    this.loadData()
                   } else {
                     this.$message.error(data.message)
                      return;
                   }
                 })
          }
        });
      },
        //修改机构用户
      useredit(row) {
        let rowdata = this.tableData[row]
        this.userform.avatarUrl=rowdata.avatarUrl
        this.userform.id=rowdata.id
        this.userform.name=rowdata.name
        this.userform.userList=rowdata.userList?rowdata.userList.slice(0):[]
        this.userDialogFormVisible=true
      },
      userremove(row){
         this.userform.userList.splice(row,1)
      },
      usersubmit(formName){
        let ids = [];
        this.userform.userList.forEach(row => {
           ids.push(row.id)
        });
       this.$http({
           url: this.$http.adornUrl(`/organization/refresh/user`),
           method: 'post',
           data: this.$http.postparam({
           'id':   this.userform.id ,
           'userids': ids.join(",")
           })
         }).then(({data}) => {
             if (data.success) {
               this.$message({
                 message: '操作成功',
                 type: 'success',
                 duration: 1500
             })
              this.userDialogFormVisible = false;
              this.resetForm(formName)
              this.loadData()
             } else {
               this.$message.error(data.message)
                return;
             }
           })
      },
      userAddsubmit(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
             this.$http({
                 url: this.$http.adornUrl(`/organization/add/user`),
                 method: 'post',
                 data: this.$http.postparam({
                 'id':   this.userAddform.userid
                 })
               }).then(({data}) => {
                   if (data.success) {
                     let flag=true
                     this.userform.userList.forEach(row => {
                        if(flag && row.id == data.data.user.id) {
                          flag=false
                        }
                     });
                    if (flag) {
                          this.userform.userList.push(data.data.user)
                          this.userAddDialogFormVisible = false;
                           this.$message({
                             message: '操作成功',
                             type: 'success',
                             duration: 1000
                         })
                    } else {
                     this.$message.error("该用户已绑定，无需重复添加")
                    }
                    this.resetForm(formName)
                   } else {
                     this.$message.error(data.message)
                      return;
                   }
                 })
          }
        });
      },
      //删除机构
      removeData(row) {
        let rowdata = this.tableData[row];
        this.$confirm('确定要删除机构"'+rowdata.name+'"?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
              url: this.$http.adornUrl(`/organization/delete`),
              method: 'post',
              data: this.$http.postparam({id: rowdata.id})
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
        }).catch(() => {});
      },

      //批量操作
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
              url: this.$http.adornUrl(`/organization/batchdelete`),
              method: 'post',
              data: this.$http.postparam({ids:ids.join(',')})
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
        }).catch(() => {});
      }
    }
  }
</script>
