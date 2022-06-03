<template>
  <div id="hxwChinaTu" style="height:640px; width:600px; top: -148px;left:-60px; margin: 0 auto;position: relative;">

  </div>
</template>
<script>
  import echarts from 'echarts'
  import request from '@/utils/request'
  import {
    deviceMapDisplay
  } from '@/api/user'

  export default {
    props: {
      onresize: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        url: "/api/datacenter/statistics?indexNames=fp-map&hard=true",
        platNum: 1,
        mapData: [],
        provinceData: [],
        myChart: {},
        option: {}
      }
    },
    mounted() {
      setTimeout(() => {
        this.initMap();
      }, 100)
    },
    methods: {
      async initMap() {
        const {
          data
        } = await deviceMapDisplay();
        if (!data) return;
        var that = this;
        this.myChart = echarts.init(document.getElementById('hxwChinaTu'));
        data.forEach((item) => {
          item.name = item.machineProvice.replace(/省|自治区|回族|壮族|维吾尔|特别行政区/, "")
        })
        this.mapData = data;
        this.getMap();

        //初始化绘制全国地图配置
        this.option = {
          grid: {
            x: 0,
            y: 0,
            x2: 0,
            y2: 0
          },
          tooltip: {
            trigger: 'item',
            enterable: true,
            hideDelay: 1000,
            position: "top",
            formatter: function formatter(param) {
              // console.log(param)
              if (param.data) {
                var result = '';
                // 格式化租户综合金融平台下级行政区租户
                if (param.data.counts) {
                  var title2 = '<div>' + param.data.name + '：<span style="color:#f7b52b">' + param.data.counts +
                    '台</span></div>';
                  result += title2;
                }
                return result;
              } else {
                return param.name + '<div></div>';
              }
            }
          },
          animationDuration: 1000,
          animationEasing: 'cubicOut',
          animationDurationUpdate: 1000
        };
      },
      getMap() {
        request("/json/china.json")
          .then((res) => {
            //注册地图
            echarts.registerMap('china', res);
            //插入小旗子的数据
            this.provinceData = [];
            res.features.forEach((item, index) => {
              this.mapData.forEach((row, num) => {
                if (item.properties.name === row.name) {
                  this.provinceData.push({
                    "id": item.id,
                    "name": row.name,
                    "value": item.properties.cp,
                    "counts": row.counts || '10'
                  });
                }
              });
            });
            //绘制地图
            this.renderMap('china', this.mapData, false, '1', '全国分布图');
          })
      },
      renderMap(map, data, show, zoomdata, text) {
        var that = this;
        var platNum = 1;
        var provinceData = this.provinceData;
        data.forEach((item) => {
          item.label = {
            show: map == 'china' ? false : true,
          };
          item.itemStyle = {
            borderWidth: 2,
            areaColor: '#7695bb',
          };

        });
        this.option.geo = {
          map: 'china',
          zoom: 1,
          itemStyle: {
            areaColor: '#f4f4f4',
          },
          show: false,
        };
        if (map == 'china') {
          this.platNum = platNum;
          this.option.geo.show = true;
        }
        this.option.title = {
          text: '',
          subtext: '',
        };
        this.option.series = [{
            zoom: zoomdata,
            type: 'map',
            mapType: map,
            roam: false,
            nameMap: {
              'china': '中国'
            },
            label: {
              normal: {
                show: true,
                color: '#b4b4b4'
              },
              emphasis: {
                show: true,
                color: "#fff"
              }
            },
            itemStyle: {
              areaColor: 'transparent',
              borderColor: '#ccc',
              borderWidth: '1'
            },
            emphasis: {
              itemStyle: {
                areaColor: '#7695bb',
              }
            },
            data: data
          },
          {
            name: '红旗',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            symbolSize: 10,
            showEffectOn: 'render',
            rippleEffect: {
              brushType: 'stroke',
              scale: 6,
            },
            hoverAnimation: true,
            label: {
              formatter: '{b}',
              position: 'right',
              fontSize: 12,
              fontWeight: 'bold',
              textShadowBlur: 2,
              textShadowColor: '#f7b52b',
              color: '#2b2f3a',
              show: true
            },
            itemStyle: {
              color: '#f7b52b',
              shadowBlur: 6,
              shadowColor: '#333'
            },
            data: provinceData
          }

        ];

        // 使用刚指定的配置项和数据显示图表。
        this.myChart.setOption(this.option);
      }
    },
    watch: {
      onresize(val) {
        this.myChart.resize();
      }
    }
  }
</script>
