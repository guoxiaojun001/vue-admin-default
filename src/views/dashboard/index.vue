<template>
  <div class="dashboard-container">
    <el-row v-if="userType=='admin'" :gutter="32">
      <el-col :xs="24" :sm="24" :lg="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>设备类型排名</span>
          </div>
          <div class="chart-wrapper">
            <pie-chart />
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>设备全国分布图</span>
          </div>
          <div class="chart-wrapper">
            <map-chart />
          </div>
        </el-card>
      </el-col>
    </el-row>
	<div v-else class="dashboard-text">欢迎使用！</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PieChart from '../../components/eCharts/PieChart.vue'
import mapChart from '../../components/eCharts/mapChart.vue'
import BarChart from '../../components/eCharts/BarChart.vue'

export default {
  name: 'Dashboard',
  components: {
    PieChart,
    mapChart,
    BarChart
  },
  computed: {
    ...mapGetters([
      'name',
	  'userType'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.box-card{
  height: 450px;
}
</style>
