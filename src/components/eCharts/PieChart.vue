<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import { deviceRanking} from '@/api/user'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '320px'
    }
  },
  data() {
    return {
      chart: null,
      machineType:[
        {text:'光学类',key:'Optics'},
        {text:'射频类',key:'Radiofrequency'},
        {text:'超声类',key:'Ultrasonic'},
        {text:'基础类',key:'Basic'},
        {text:'其它',key:'Other'}
      ]
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    async initChart() {
      const {data} = await deviceRanking();
      if(data){
        let legendData = [];
        let seriesData = [];
        data.forEach((item)=>{
         const res = this.machineType.filter((data)=>{
            return data.key == item.machineType
          })
          let obj = {
            value:item.counts,
            name:res[0].text
          }
          seriesData.push(obj)
          legendData.push(res[0].text)
        })
        this.chart = echarts.init(this.$el, 'macarons')

        this.chart.setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            left: 'center',
            bottom: '10',
            data: legendData
          },
          series: [
            {
              name: 'WEEKLY WRITE ARTICLES',
              type: 'pie',
              roseType: 'radius',
              radius: [15, 95],
              center: ['50%', '38%'],
              data: seriesData,
              animationEasing: 'cubicInOut',
              animationDuration: 2600
            }
          ]
        })
      }
    }
  }
}
</script>
