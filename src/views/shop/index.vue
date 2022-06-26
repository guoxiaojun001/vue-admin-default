<template>
  <div class="app-container">
    <el-form :inline="true" :model="listQuery" class="demo-form-inline">
      <el-form-item label="">
        <el-input style="width: 300px;" prefix-icon="el-icon-search" v-model="listQuery.parms" placeholder="门店名称/联系人电话"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-edit" @click="handleAddStore">创建</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="storeList" v-loading="listLoading"  style="width: 100%;" border >
      <el-table-column align="center" label="ID" width="80" prop="id" sortable>
      </el-table-column>
      <el-table-column align="center" label="门店名称">
        <template slot-scope="scope">
          {{ scope.row.storeName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属代理商">
        <template slot-scope="scope">
          {{ scope.row.agentId }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="门店地址">
        <template slot-scope="scope">
          {{ scope.row.address}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="联系人姓名">
        <template slot-scope="scope">
          {{ scope.row.contactPerson }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="联系人电话">
        <template slot-scope="scope">
          {{ scope.row.contactPhone }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="设备数量">
        <template slot-scope="scope">
          {{ scope.row.newDeviceCount }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">修改</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getAllStore" />
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'修改':'创建'" @close="dialogClose">
      <el-form ref="tempForm" :model="store" :rules="rules" label-width="100px" label-position="left" style="width: 80%; margin-left:10%;">
        <el-form-item label="门店名称" prop="storeName">
          <el-input v-model="store.storeName" placeholder="请输入门店名称" />
        </el-form-item>
        <el-form-item label="门店编号" prop="code">
          <el-input v-model="store.code" placeholder="请输入门店名称" />
        </el-form-item>
        <el-form-item label="所属代理商" prop="agentId">
          <el-select v-model="store.agentId" placeholder="请选择代理商" clearable class="filter-item">
            <el-option v-for="(item,index) in userList" :key="item.id" :label="item.username" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系人姓名" prop="contactPerson">
          <el-input v-model="store.contactPerson" placeholder="请输入联系人姓名" />
        </el-form-item>
        <el-form-item label="联系人电话" prop="contactPhone">
          <el-input v-model="store.contactPhone" placeholder="请输入联系人电话" />
        </el-form-item>
        <el-form-item label="设备数量" prop="newDeviceCount">
          <el-input v-model.number="store.newDeviceCount" placeholder="请输入设备数量" readonly disabled/>
        </el-form-item>
        <el-form-item label="创建时间" prop="createTime">
          <el-date-picker
            v-model="store.createTime"
            type="date"
            placeholder="选择创建时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="门店地址" prop="address">
          <el-input
            v-model="store.address"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="请输入门店地址"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmStore">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import path from 'path'
import { deepClone } from '@/utils'
import { rule } from '@/utils/validate'
import { getAllStore, addStore, updateStore, deleteStore } from '@/api'
import { getUsers} from '@/api/user'
import Pagination from '@/components/Pagination'
import VDistpicker from 'v-distpicker'
import { mapGetters } from 'vuex'

const defaultRole = {
  storeName: '',
  contactPerson: '',
  contactPhone: '',
  address: '',
  newDeviceCount: 0,
  agentId:'',
  code:"",
  createTime:new Date(),
  version:0
}

export default {
  components: {
    Pagination,
    VDistpicker
  },
  data() {
    return {
      store: Object.assign({}, defaultRole),
      storeList: [],
      userList:[],
      dialogVisible: false,
      dialogType: 'new',
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      list:{
          cooperationMode:[
              {text:'全款销售',key:'FullPayment'},
              {text:'定金销售',key:'Deposit'},
              {text:'分期付款',key:'Stages'},
              {text:'租赁',key:'Rent'},
              {text:'试用',key:'Trial'}
          ],
          machineStatus:[
              {text:'工作',key:'Working'},
              {text:'停止',key:'Idle'},
              {text:'黑名单',key:'Blacklist'}
          ],
          machineType:[
              {text:'光学类',key:'Optics'},
              {text:'射频类',key:'Radiofrequency'},
              {text:'超声类',key:'Ultrasonic'},
              {text:'基础类',key:'Basic'},
              {text:'其它',key:'Other'}
          ],
          machineFunction:[
              {text:'美容美白',key:1}
          ]
      },
      listLoading: true,
      total: 0,
      listQuery: {
        page: 1,
        limit: 20,
        parms:'',
      },
      rules: {
        storeName:[{
          required: true,
          message: '请输入门店名称',
          trigger: 'blur'
        }],
        code:[{
            required: true,
            message: '请输入门店编号',
            trigger: 'blur'
        }],
        agentId:[{
          required: true,
          message: '请输入所属代理商',
          trigger: 'blur'
        }],
        contactPerson:[{
          required: true,
          message: '请输入联系人姓名',
          trigger: 'blur'
        }],
        contactPhone:[{
          required: true,
          validator: rule.checkPhone,
          trigger: 'blur'
        }],
        newDeviceCount:[{
          required: true,
          message: '请输入设备数量',
          trigger: 'blur'
        }],
        createTime:[{
            required: true,
            message: '请输入门店创建时间',
            trigger: 'change'
        }],
        address:[{
          required: true,
          message: '请输入门店地址',
          trigger: 'blur'
        }]
      }
    }
  },
  created() {
    this.getAllStore();
    this.getUsers()
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
    dialogClose(){
      this.$refs['tempForm'].resetFields();
    },
    async getUsers() {
        const res = await getUsers({})
        if(this.userType == "admin"){
            this.userList = res.data.filter((item)=>{
                return item.userType != "admin"
            });
        }else{
            this.userList = res.data.filter((item)=>{
                return item.id == this.userId
            });
            this.store.agentId = Number(this.userId)
        }

    },
    handleFilter() {
      this.listQuery.page = 1
      this.getAllStore()
    },
    async getAllStore() {
      this.listLoading = true;
      const res = await getAllStore(this.listQuery)
      this.storeList = res.data;
      this.total = res.data.length;
      setTimeout(() => {
        this.listLoading = false
      }, 1.5 * 1000)
    },
    handleAddStore() {
      this.dialogType = 'new'
      this.dialogVisible = true;
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true;
      this.$nextTick(()=>{
          this.store = deepClone(scope.row)
      });
    },
    handleDelete({ $index, row }) {
      this.$confirm('确认要删除该门店?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await deleteStore(row.id)
          this.getAllStore();
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
    },
    async confirmRole() {
      const isEdit = this.dialogType === 'edit'
      this.store.name = this.store.username;
      let response = ""
      if (isEdit) {
        response = await updateStore(this.store)
      } else {
        response = await addStore(this.store)
      }
      this.getAllStore()
      this.dialogVisible = false
      this.$notify({
        title: isEdit?'修改成功':'添加成功',
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
