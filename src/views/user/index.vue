<template>
  <div class="app-container">
    <el-form :inline="true" :model="listQuery" class="demo-form-inline">
      <el-form-item label="联系人">
        <el-input v-model="listQuery.name" placeholder="联系人"></el-input>
      </el-form-item>
      <el-form-item label="联系电话">
        <el-input v-model="listQuery.telephone" placeholder="联系电话"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-edit" @click="handleAddRole">创建</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="rolesList" v-loading="listLoading"  style="width: 100%;" border >
      <el-table-column align="center" label="ID" width="80" prop="id" sortable>
      </el-table-column>
      <el-table-column align="center" label="客户类型">
        <template slot-scope="scope">
          {{ scope.row.userType }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="单位名称" width="220">
        <template slot-scope="scope">
          {{ scope.row.companyName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="联系人" width="220">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="联系电话">
        <template slot-scope="scope">
          {{ scope.row.telephone }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="客户地址">
        <template slot-scope="scope">
          {{ scope.row.address}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">修改</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="rolesList.page" :limit.sync="rolesList.limit" @pagination="getUsers" />
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'修改':'创建'" @close="dialogClose">
      <el-form ref="tempForm" :model="role" :rules="rules" label-width="80px" label-position="left" style="width: 80%; margin-left:10%;">
        <el-form-item label="客户类型" prop="userType">
          <el-select v-model="role.userType" placeholder="请选择" clearable class="filter-item">
            <el-option label="经销商" value="admin"></el-option>
            <el-option label="代理商" value="normal"></el-option>
            <el-option label="终端客户" value="user"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单位名称" prop="companyName">
          <el-input v-model="role.companyName" placeholder="请输入单位名称" />
        </el-form-item>
        <el-form-item label="联系人" prop="username">
          <el-input v-model="role.username" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="role.password" placeholder="请输入密码" show-password/>
        </el-form-item>
        <el-form-item label="联系电话" prop="telephone">
          <el-input v-model="role.telephone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="客户地址" prop="address">
          <el-input
                      v-model="role.address"
                      :autosize="{ minRows: 2, maxRows: 4}"
                      type="textarea"
                      placeholder="请输入客户地址"
                    />
        </el-form-item>
        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model="role.email" placeholder="请输入电子邮箱" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmUser">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import path from 'path'
import { deepClone } from '@/utils'
import { rule } from '@/utils/validate'
import { getUsers, addUser, deleteUser, updateUser } from '@/api/user'
import Pagination from '@/components/Pagination'
import VDistpicker from 'v-distpicker'

const defaultRole = {
  username: '',
  password: '',
  telephone: '',
  address: '',
  email: '',
  roleId:'2',
  userType:''
}

export default {
  components: {
    Pagination,
    VDistpicker
  },
  data() {
    return {
      role: Object.assign({}, defaultRole),
      routes: [],
      rolesList: [],
      dialogVisible: false,
      dialogType: 'new',
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      listLoading: true,
      total: 0,
      listQuery: {
        page: 1,
        limit: 20,
        name: '',
        telephone: '',
      },
      rules: {
        userType:[{
          required: true,
          message: '请输入客户类型',
          trigger: 'blur'
        }],
        companyName:[{
          required: true,
          message: '请输入单位名称',
          trigger: 'blur'
        }],
        username:[{
          required: true,
          message: '请输入联系人',
          trigger: 'blur'
        }],
        password:[{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }],
        telephone:[{
          required: true,
          validator: rule.checkPhone,
          trigger: 'blur'
        }],
        email:[{
          validator: rule.email,
          trigger: 'blur'
        }]
      }
    }
  },
  created() {
    this.getUsers()
  },
  methods: {
    dialogClose(){
      this.$refs['tempForm'].resetFields();
    },
    getAreaName(data) {
      this.role.userProvice = data.province.value
      this.role.userCity = data.city.value
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getUsers()
    },
    async getUsers() {
      this.listLoading = true;
      const res = await getUsers(this.listQuery)
      this.rolesList = res.data;
      this.total = res.data.length;
      setTimeout(() => {
        this.listLoading = false
      }, 1.5 * 1000)
    },
    handleAddRole() {
      this.dialogType = 'new'
      this.dialogVisible = true;
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true;
      this.role = deepClone(scope.row)
      this.role.password = "";
    },
    handleDelete({ $index, row }) {
      this.$confirm('确认要删除该用户?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await deleteUser(row.id)
          this.getUsers();
          //this.rolesList.splice($index, 1)
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        })
        .catch(err => { console.error(err) })
    },
    confirmUser(){
      this.$refs['tempForm'].validate((valid) => {
        if (valid) {
          this.confirmRole()
        }
      })
    },
    async confirmRole() {
      const isEdit = this.dialogType === 'edit'
      this.role.name = this.role.username;
      let response = ""
      if (isEdit) {
        response = await updateUser(this.role)
      } else {
        response = await addUser(this.role)
      }
      this.getUsers()
      this.dialogVisible = false
      this.$notify({
        title: '添加成功',
        dangerouslyUseHTMLString: true,
        type: 'success'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
