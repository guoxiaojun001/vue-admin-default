<template>
  <div class="app-container">
    <el-form :inline="true" :model="listQuery" class="demo-form-inline">
      <el-form-item label="">
        <el-input style="width: 300px;" prefix-icon="el-icon-search" v-model="listQuery.parms" placeholder="订单号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="rolesList" v-loading="listLoading"  style="width: 100%;" border >
      <el-table-column align="center" label="ID" width="80" prop="id" sortable>
      </el-table-column>
      <el-table-column align="center" label="订单号">
        <template slot-scope="scope">
          {{ scope.row.orderNo }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="订单类型">
        <template slot-scope="scope">
          {{ scope.row.orderType }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="订单状态">
        <template slot-scope="scope">
          {{ scope.row.orderStatus }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="下单时间">
        <template slot-scope="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作时间">
        <template slot-scope="scope">
          {{ scope.row.operationTime}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="价格">
        <template slot-scope="scope">
          {{ scope.row.price}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="付款状态">
        <template slot-scope="scope">
          {{ scope.row.payStatus}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="下单人">
        <template slot-scope="scope">
          {{ scope.row.machineParam}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">查看</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getOrderList" />
    <el-dialog :visible.sync="dialogVisible" title="详情" @close="dialogClose">
      <el-form ref="tempForm" :model="role" label-width="80px" label-position="left" style="width: 80%; margin-left:10%;">
        <el-form-item label="订单号" prop="companyName">
          <el-input v-model="role.orderNo" readonly/>
        </el-form-item>
        <el-form-item label="订单类型" prop="companyName">
          <el-input v-model="role.orderType" readonly/>
        </el-form-item>
        <el-form-item label="订单状态" prop="companyName">
          <el-input v-model="role.orderStatus" readonly/>
        </el-form-item>
        <el-form-item label="下单时间" prop="companyName">
          <el-input v-model="role.createTime" readonly/>
        </el-form-item>
        <el-form-item label="项目内容" prop="companyName">
          <el-input v-model="role.orderContent" readonly/>
        </el-form-item>
        <el-form-item label="操作时间" prop="companyName">
          <el-input v-model="role.operationTime" readonly/>
        </el-form-item>
        <el-form-item label="价格" prop="companyName">
          <el-input v-model="role.price" readonly/>
        </el-form-item>
        <el-form-item label="付款状态" prop="companyName">
          <el-input v-model="role.payStatus" readonly/>
        </el-form-item>
        <el-form-item label="下单人" prop="companyName">
          <el-input v-model="role.machineParam" readonly/>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { getOrderList,deleteOrder } from '@/api'
import Pagination from '@/components/Pagination'

export default {
  components: {
    Pagination
  },
  data() {
    return {
      role: {},
      rolesList: [],
      dialogVisible: false,
      listLoading: true,
      total: 0,
      listQuery: {
        page: 1,
        limit: 20,
        parms: '',
      }
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    dialogClose(){
      this.dialogVisible = false;
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getOrderList()
    },
    async getOrderList() {
      this.listLoading = true;
      const res = await getOrderList(this.listQuery)
      this.rolesList = res.data;
      this.total = res.data.length;
      setTimeout(() => {
        this.listLoading = false
      }, 1.5 * 1000)
    },
    handleEdit(scope) {
      this.dialogVisible = true;
      this.role = deepClone(scope.row)
    },
    handleDelete({ $index, row }) {
      this.$confirm('确认要删除该订单?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await deleteOrder(row.id)
          this.getOrderList();
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        })
        .catch(err => { console.error(err) })
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
