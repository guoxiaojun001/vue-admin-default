<template>
  <div class="app-container">
    <el-form :inline="true" :model="listQuery" class="demo-form-inline">
      <el-form-item label="">
        <el-input style="width: 300px;" prefix-icon="el-icon-search" v-model="listQuery.parms" placeholder="设备名称/设备类型/所有者/联系电话"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-edit" @click="handleAddMachine">创建</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="handleMessage">发送信息</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="warning" @click="handleNotice">发送通知</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="machineList" v-loading="listLoading" @selection-change="handleSelectionChange" ref="tb" style="width: 100%;"
              border>
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column align="center" label="设备名称" width="180">
        <template slot-scope="scope">
          {{ scope.row.machineInfo.machineBrand }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="所有者">
        <template slot-scope="scope">
          {{ scope.row.userInfo.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属门店">
        <template slot-scope="scope">
          {{ scope.row.userInfo.storeName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属地">
        <template slot-scope="scope">
          {{ scope.row.machineInfo.machineProvice}}{{ scope.row.machineInfo.machineCity}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="联系电话">
        <template slot-scope="scope">
          {{ scope.row.userInfo.telephone }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="合作方式">
        <template slot-scope="scope">
          {{ changeText(scope.row.machineInfo.cooperationMode,'cooperationMode') }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="授权状态">
        <template slot-scope="scope">
          {{ changeText(scope.row.machineInfo.machineStatus,'machineStatus') }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="设备类型">
        <template slot-scope="scope">
          {{ changeText(scope.row.machineInfo.machineType,'machineType') }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="功能类型">
        <template slot-scope="scope">
          {{ changeText(scope.row.machineInfo.machineFunction,'machineFunction') }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="工作时长">
        <template slot-scope="scope">
          {{ scope.row.machineInfo.usedDuration }}s
        </template>
      </el-table-column>
      <el-table-column align="center" label="访问记录">
        <template slot-scope="scope">
          <p>{{ scope.row.machineInfo.lastloginTime }}</p>
          <el-tag size="mini" :type="scope.row.machineInfo.onlineStatus?'success':'info'">{{ scope.row.machineInfo.onlineStatus?"在线":"离线"}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="240" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">修改</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
          <el-button type="warning" size="small" @click="handleLock(scope)">{{scope.row.machineInfo.lockStatus?'解锁':'锁定'}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.curPage" :limit.sync="listQuery.pageSize" @pagination="getMachines" />
    <el-dialog class="demo-form" :visible.sync="dialogVisible" :title="setDialogTitle(dialogType)" @close="dialogClose">
      <el-form :rules="addRules" :model="temp" ref="tempForm" label-width="100px" label-position="left" style="width: 80%; margin-left:10%;">
        <el-form-item label="设备名称" prop="machineBrand">
          <el-input v-model="temp.machineBrand" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="设备ID" prop="machineParam">
          <el-input v-model="temp.machineParam" placeholder="请输入设备ID" :disabled="dialogType!='new'"/>
        </el-form-item>
        <el-form-item label="所有者" prop="userId">
          <el-select v-if="userType=='admin'" v-model="temp.userId" placeholder="请选择" clearable class="filter-item">
            <el-option v-for="(item,index) in userList" :key="item.id" :label="item.username" :value="item.id"></el-option>
          </el-select>
          <el-input v-else v-model="name" readonly/>
        </el-form-item>
        <el-form-item label="所属门店" prop="storeId">
          <el-select v-model="temp.storeId" placeholder="请选择" clearable class="filter-item">
            <el-option v-for="item in storeList" :key="item.id" :label="item.storeName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属地" prop="machineCity">
          <v-distpicker :province="temp.machineProvice" :city="temp.machineCity" hide-area :placeholders="placeholders"  @selected="getAreaName" />
        </el-form-item>
        <el-form-item label="联系电话" prop="telephone">
          <el-input v-model="temp.telephone" placeholder="请输入联系电话" :disabled="dialogType!='new'" />
        </el-form-item>
        <el-form-item v-if="dialogType!='message'" label="工作时长(s)" prop="usedDuration" :disabled="dialogType!='new'">
          <el-col :span="12">
            <el-input v-model="temp.usedDuration" placeholder="请输入工作时长" />
          </el-col>
          <el-col v-if="dialogType!='new'" :offset="1" :span="4">
            <el-button type="danger" @click="temp.usedDuration=0">重置</el-button>
          </el-col>
        </el-form-item>
        <el-form-item label="合作方式" prop="cooperationMode">
          <el-select v-model="temp.cooperationMode" placeholder="请选择" clearable class="filter-item">
            <el-option v-for='item in list.cooperationMode' :key="item.key" :label="item.text" :value="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="授权状态" prop="machineStatus">
          <el-select v-model="temp.machineStatus" placeholder="请选择" clearable class="filter-item">
            <el-option v-for='item in list.machineStatus' :key="item.key" :label="item.text" :value="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备类型" prop="machineType">
          <el-select v-model="temp.machineType" placeholder="请选择" clearable class="filter-item">
            <el-option v-for='item in list.machineType' :key="item.key" :label="item.text" :value="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="功能类型" prop="machineFunction">
          <el-select v-model="temp.machineFunction" placeholder="请选择" clearable class="filter-item">
            <el-option label="美容美白" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="dialogType=='message'" label="apk附件：" prop="apkUpload">
          <el-upload
            ref="apkUpload"
            class="upload-demo"
            :limit="1"
            action="/dev-api/uploadFile/upload?fileType=apk"
            :before-upload="handleUpload"
            :on-success="handleSucess"
            :file-list="apkFileList">
            <el-button size="small" type="primary" @click='uploadType="apk"'>上传apk文件</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item v-if="dialogType=='message'" label="bin附件：" prop="binUpload">
          <el-upload
            ref="apkUpload"
            class="upload-demo"
            :limit="1"
            action="/dev-api/uploadFile/upload?fileType=apk"
            :before-upload="handleUpload"
            :on-success="handleSucess"
            :file-list="binFileList">
            <el-button size="small" type="primary" @click='uploadType="bin"'>上传bin文件</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmMachine">确认</el-button>
      </div>
    </el-dialog>
    <el-dialog class="demo-form" title="发送通知" :visible.sync="dialogNoticeVisible">
      <el-form :model="notice" label-width="100px" label-position="left" style="width: 80%; margin-left:10%;">
        <el-form-item label="标题">
          <el-input v-model="notice.title"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input type="textarea" :rows="6" v-model="notice.content"></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogNoticeVisible=false">取消</el-button>
        <el-button type="primary" @click="sendNotice">发送</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import path from 'path'
    import { deepClone } from '@/utils'
    import { getUsers} from '@/api/user'
    import { getAllStore } from '@/api'
    import { getMachine, addMachine, deleteMachine, updateMachine,sendMachine } from '@/api/machine'
    import Pagination from '@/components/Pagination'
    import VDistpicker from 'v-distpicker'
    import mqtt from "mqtt"
    import { mapGetters } from 'vuex'
    const defaultMachine = {
        machineAttribute: "",
        machineBrand: "",
        machineCity: "",
        machineCityId: "",
        machineFunction: "",
        machineParam: "",
        machineProvice: "",
        machineProviceId: "",
        machineStatus: "",
        cooperationMode:"",
        machineType: "",
        machineWorkTimeOnce: 0,
        usedDuration:0,
        userId:"",
        storeId:""
    }

    export default {
        name: 'Table',
        components: {
            Pagination,
            VDistpicker
        },
        data() {
            return {
                client: null,
                machineList: [],
                dialogVisible: false,
                dialogNoticeVisible: false,
                dialogType: 'new',
                listLoading: true,
                total: 0,
                listQuery: {
                    curPage: 1,
                    pageSize: 20,
                    parms: ''
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
                temp:Object.assign({}, defaultMachine),
                notice:{
                    title:"",
                    content:""
                },
                addRules: {
                    machineBrand:[{
                        required: true,
                        message: '请输入设备名称',
                        trigger: 'blur'
                    }],
                    machineParam:[{
                        required: true,
                        message: '请输入设备ID',
                        trigger: 'blur'
                    }],
                    telephone:[{
                        required: true,
                        message: '请输入联系电话',
                        trigger: 'blur'
                    }],
                    usedDuration:[{
                        required: true,
                        message: '请输入使用时长',
                        trigger: 'blur'
                    }],
                    userId:[{
                        required: true,
                        message: '请选择所有者',
                        trigger: 'change'
                    }],
                    storeId:[{
                        required: true,
                        message: '请选择所属门店',
                        trigger: 'change'
                    }],
                    cooperationMode:[{
                        required: true,
                        message: '请选择',
                        trigger: 'change'
                    }],
                    machineStatus:[{
                        required: true,
                        message: '请选择',
                        trigger: 'change'
                    }],
                    machineFunction:[{
                        required: true,
                        message: '请选择',
                        trigger: 'change'
                    }],
                    machineType:[{
                        required: true,
                        message: '请选择',
                        trigger: 'change'
                    }],
                    machineCity: [{
                        required: true,
                        message: '请选择所属地',
                        trigger: 'change'
                    }]
                },
                apkFileList: [],
                binFileList: [],
                uploadType:'',
                checkedGh:{},
                placeholders: {
                    province: '------- 省 --------',
                    city: '--- 市 ---',
                    area: '--- 区 ---',
                },
                apkUrl:'',
                binUrl:'',
                userList:[],
                storeList:[]
            }
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
                    return val
                }
            },
            setDialogTitle(){
                return function(value){
                    if(value=='new'){
                        return '创建'
                    }
                    if(value=='edit'){
                        return '修改'
                    }
                    if(value=='message'){
                        return '发送信息'
                    }
                }
            }
        },
        created() {
            // Mock: get all routes and roles list from server
            this.getMachines()
            this.initMqtt()
            this.getAllStore()
            if(this.userType == "admin"){
                this.getUsers()
            }
        },
        methods: {
            async getAllStore() {
                const res = await getAllStore(this.listQuery)
                this.storeList = res.data;
            },
            initMqtt() {
                let _this = this;
                var options = {
                    //mqtt客户端的id，这里面应该还可以加上其他参数，具体看官方文档
                    clientId: "mqttjs_" + Math.random().toString(16).substr(2, 8),
                    username: "admin",
                    password: "qunimabi#123$456",
                    clean: false
                };
                let commonApi = "ws://39.98.108.64:8083/mqtt";
                this.client = mqtt.connect(commonApi, options);
                this.client.on("connect", function () {
                    console.log("connect success!");
                    //此处需要订阅两个消息，先写死吧
                    let topic = '/' + _this.userId + '/device_status';
                    if (_this.userType === 'admin') {
                        topic = '/admin/device_status'
                    }
                    _this.client.subscribe(
                        topic,
                        _this.subscribeMesg
                    );

                });
                //如果连接错误，打印错误
                this.client.on("error", function (err) {
                    console.log("err=>", err);
                    this.client.end();
                });
                this.client.on("message", this.dealMessage);
            },
            // 订阅主题回掉函数
            subscribeMesg(err) {
                if (!err) {
                    console.log("订阅成功");
                } else {
                    console.log("订阅失败", err);
                }
            },
            //获取消息回掉函数
            dealMessage(topic, msg) {
                console.log(topic,msg)
            },
            dialogClose(){
                this.$refs['tempForm'].resetFields();
            },
            async getUsers() {
                const res = await getUsers({})
                this.userList = res.data;
            },
            getAreaName(data) {
                this.temp.machineProvice = data.province.value
                this.temp.machineCity = data.city.value
                this.temp.machineProviceId = data.province.code
                this.temp.machineCityId = data.city.code
            },
            getArea(data) {
                this.listQuery.machineProviceId = data.province.code
                this.listQuery.machineCityId = data.city.code
            },
            handleUpload(file){
                let reg = "";
                if(this.uploadType=='apk'){
                    reg = /\.apk$/
                }
                if(this.uploadType=='bin'){
                    reg = /\.bin/
                }
                if(!reg.test(file.name)){
                    this.$alert('文件格式错误，请上传'+this.uploadType+'文件', '提示', {
                        confirmButtonText: '确定',
                        callback: action => {}
                    });
                    return false
                }
            },
            handleSucess(response,file,fileList){
                if(this.uploadType=='apk'){
                    this.apkUrl = response;
                }
                if(this.uploadType=='bin'){
                    this.binUrl = response;
                }
            },
            handleSelectionChange(selection) {
                this.checkedGh = deepClone(Object.assign(selection[0].userInfo, selection[0].machineInfo))||{};
                if (selection.length > 1) {
                    this.$refs.tb.clearSelection();
                    this.$refs.tb.toggleRowSelection(selection.pop());
                }
            },
            handleFilter() {
                this.listQuery.page = 1
                this.getMachines()
            },
            async getMachines() {
                this.listLoading = true
                const res = await getMachine(this.listQuery)
                this.machineList = res.data;
                this.total = res.data.length;
                setTimeout(() => {
                    this.listLoading = false
                }, 1000)
            },
            handleMessage(){
                if(!this.checkedGh.id){
                    this.$alert('请选择一条设备信息', '提示', {
                        confirmButtonText: '确定',
                        callback: action => {}
                    });
                    return false
                }
                this.dialogType = 'message'
                this.dialogVisible = true;
                this.temp = deepClone(this.checkedGh);
            },
            handleNotice(){
                if(!this.checkedGh.id){
                    this.$alert('请选择一条设备信息', '提示', {
                        confirmButtonText: '确定',
                        callback: action => {}
                    });
                    return false
                }
                this.dialogNoticeVisible = true;
            },
            handleAddMachine() {
                this.dialogType = 'new'
                this.dialogVisible = true
                this.temp = Object.assign({}, defaultMachine);
                this.temp.userId = this.name;
                this.temp.userId = Number(this.userId);
            },
            handleEdit(scope) {
                this.dialogType = 'edit'
                this.dialogVisible = true
                this.temp = deepClone(Object.assign(scope.row.userInfo, scope.row.machineInfo));
                console.log(this.temp)
            },
            handleDelete({ $index, row }) {
                this.$confirm('确认要删除该设备?', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(async () => {
                        await deleteMachine(row.machineInfo.id)
                        this.getMachines()
                        this.$message({
                            type: 'success',
                            message: '删除成功'
                        })
                    })
                    .catch(err => {
                        console.error(err)
                    })
            },
            handleLock({ $index, row }) {
                let msg = row.machineInfo.lockStatus ? '解锁' : '锁定'
                this.$confirm('确认要' + msg + '该设备?', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        let topic = "/machineParam/device_status"; //和后台约定好的主题
                        const param = {
                            messsageType: 'vue_lock',
                            lockStatus: row.machineInfo.lockStatus ? 0 : 1,
                            userId: row.userInfo.id,
                            machineParam: row.machineInfo.machineParam
                        }
                        console.log("===============111======="+JSON.stringify(param));
                        this.client.publish(topic, JSON.stringify(param));
                        this.getMachines()
                    })
                    .catch(err => {
                        console.error(err)
                    })
            },
            confirmMachine(){
                this.$refs['tempForm'].validate((valid) => {
                    if (valid) {
                        this.confirmMachines()
                    }
                })
            },
            async confirmMachines() {
                let response = ""
                if(this.dialogType === 'edit'){
                    response = await updateMachine(this.temp)
                }
                if(this.dialogType === 'new'){
                    response = await addMachine(this.temp)
                }
                if(this.dialogType === 'message'){
                    let data ={
                        // message:encodeURIComponent(this.temp),
                        message:this.temp,
                        topic:'topic'
                    }
                    if(this.apkUrl){
                        data.message.apkUrl = this.apkUrl;
                    }
                    if(this.binUrl){
                        data.message.binUrl = this.binUrl;
                    }

                    console.log("===发送消息=====" + data);
                    response = await sendMachine(data)
                }
                if(response.success){
                    this.$alert(response.msg, '提示', {
                        confirmButtonText: '确定',
                        callback: action => {
                            this.getMachines()
                            this.dialogVisible = false;
                        }
                    });
                }
            },
            sendNotice(){
                let topic = "/machineParam/device_status"; //和后台约定好的主题
                const param = {
                    messsageType:'vue_notice',
                    title:this.notice.title,
                    content:this.notice.content,
                    machineParam:this.checkedGh.machineParam
                }
                this.client.publish(topic, JSON.stringify(param));
                this.dialogNoticeVisible = false;
            }
        }
    }
</script>

<style lang="scss" scoped>
  .demo-form{
    .el-dialog{
      min-width:300px;
    }
  }
  .app-container {
    .roles-table {
      margin-top: 30px;
    }

    .permission-tree {
      margin-bottom: 30px;
    }
  }
</style>
