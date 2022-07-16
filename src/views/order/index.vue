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
      <el-table-column align="center" label="订单状态">
        <template slot-scope="scope">
          {{ changeText(scope.row.orderStatus,'orderStatus') }}
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
      <el-table-column align="center" label="充值次数">
        <template slot-scope="scope">
          {{ scope.row.price}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="付款状态">
        <template slot-scope="scope">
          {{ changeText(scope.row.payStatus,'orderStatus') }}
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
        <el-form-item label="订单号" prop="orderNo">
          <el-input v-model="role.orderNo" disabled/>
        </el-form-item>
        <el-form-item label="下单时间" prop="createTime">
          <el-input v-model="role.createTime" disabled/>
        </el-form-item>
        <el-form-item label="项目内容" prop="orderContent">
          <el-input v-model="role.orderContent" disabled/>
        </el-form-item>
        <el-form-item label="操作时间" prop="operationTime">
          <el-input v-model="role.operationTime" disabled/>
        </el-form-item>
        <el-form-item label="充值次数" prop="price">
          <el-input v-model="role.price" disabled/>
        </el-form-item>
        <el-form-item label="订单状态" prop="orderStatus">
          <el-select v-model="role.orderStatus" placeholder="请选择" clearable class="filter-item">
            <el-option v-for='item in list.orderStatus' :key="item.key" :label="item.text" :value="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="付款状态" prop="payStatus">
          <el-select v-model="role.payStatus" placeholder="请选择" clearable class="filter-item">
            <el-option v-for='item in list.payStatus' :key="item.key" :label="item.text" :value="item.key"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmOrder">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { getOrderList,deleteOrder,updateOrder } from '@/api'
import Pagination from '@/components/Pagination'
const defaultOrder = {
    "agentId": "",
    "createTime": "",
    "machineParam": "",
    "operationTime": new Date(),
    "orderContent": "",
    "orderNo": "",
    "orderStatus": "",
    "payStatus": "1",
    "price": "",
    "store_id": ""
}
export default {
  components: {
    Pagination
  },
  data() {
    return {
      role:Object.assign({}, defaultOrder),
      rolesList: [],
      dialogVisible: false,
      listLoading: true,
      total: 0,
      listQuery: {
        page: 1,
        limit: 20,
        parms: '',
      },
      list:{
          orderStatus:[
              {text:'待支付',key:1},
              {text:'已经支付',key:2},
              {text:'取消',key:3}
          ],
          payStatus:[
              {text:'待支付',key:1},
              {text:'已经支付',key:2},
              {text:'取消',key:3}
          ]
      }
    }
  },
  created() {
    this.getOrderList()
  },
  computed: {
    changeText(){
        return function(value,code){
            let val = '';
            this.list[code].forEach((data)=>{
                if(data.key==value){
                    val = data.text
                }
            })
            return val
        }
    }
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
      this.role = deepClone(scope.row);
      this.dialogVisible = true;
    },
    async confirmOrder(){
        const response = await updateOrder(this.role);
        if(response.success){
            this.$alert(response.msg, '提示', {
                confirmButtonText: '确定',
                callback: action => {
                    this.getOrderList()
                    this.dialogVisible = false;
                }
            });
        }
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
