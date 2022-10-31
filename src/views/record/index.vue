<template>
  <div class="app-container">
    <el-form :inline="true" :model="listQuery" class="demo-form-inline">
      <el-form-item label="">
        <el-input style="width: 300px;" prefix-icon="el-icon-search" v-model="listQuery.parms" placeholder="设备名称/门店"></el-input>
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
        <el-button type="primary" icon="el-icon-search" @click="exportData">导出</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="recordList" v-loading="listLoading"  style="width: 100%;" border >
      <el-table-column align="center" label="ID" width="80" prop="id" sortable>
      </el-table-column>
      <el-table-column align="center" label="设备名称">
        <template slot-scope="scope">
          {{ scope.row.storeName }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="所属门店">
        <template slot-scope="scope">
          {{ scope.row.storeName}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="所有者信息">
        <template slot-scope="scope">
          {{ scope.row.owner }} 
        </template>
      </el-table-column>


      <el-table-column align="center" label="使用地点">
        <template slot-scope="scope">
          {{ scope.row.place}}
        </template>
      </el-table-column>
     
      <el-table-column align="center" label="启动时间">
        <template slot-scope="scope">
          {{ scope.row.startTime }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="160" >
        <template slot-scope="scope">
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getRecords" />
   
  </div>
</template>



<script>
import path from 'path'
import { deepClone,parseTime } from '@/utils'
import { rule } from '@/utils/validate'
import { getRecords,deleteRecord} from '@/api/record'
import Pagination from '@/components/Pagination'
import VDistpicker from 'v-distpicker'
import { mapGetters } from 'vuex'
import FileSaver from 'file-saver';
import XLSX from 'xlsx';
import Vue from "vue";
import JsonExcel from "vue-json-excel";

Vue.component("downloadExcel", JsonExcel);


const defaultRole = {
  storeName: '',
  machineBrand:'',
  owner: '',
  address: '',
  startTime: ''
}


export default {

  components: {
    Pagination,
    VDistpicker
  },
  data() {
    return {
      record: Object.assign({}, defaultRole),
      recordList: [],
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
        pageSize: 20,
        parms:'',
      },
  
    }
  },

  created() {
    this.getRecords();
  },
  computed: {
      ...mapGetters([
          'roles',
          'userType',
          'name',
          'userId'
      ]),
      changeText(){
          return function(value,code){
              let val = '';
              this.list[code].forEach((data)=>{
                  if(data.key==value){
                      val = data.text
                  }
              })
              console.log('val===',val)
              return val
          }
      }
  },
  methods: {
    handleFilter() {
      this.listQuery.page = 1
      this.getRecords()
    },
    async getRecords() {
      this.listLoading = true;
      const res = await getRecords(this.listQuery)
      this.recordList = res.data;
      this.total = res.counts;
      setTimeout(() => {
        this.listLoading = false
      }, 1.5 * 1000)

    },

    async exportData(){
      this.jsonToXLS(this.recordList)
    },

    jsonToXLS(data) {
  
      //导出excel
    },


  
    handleDelete({ $index, row }) {
      this.$confirm('确认要删除该使用记录?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await deleteRecord(row.id)
          this.getRecords();
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        })
        .catch(err => { console.error(err) })
    },
    confirmStore(){
      this.$refs['tempForm'].validate((valid) => {
        if (valid) {
          this.confirmRole()
        }
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
