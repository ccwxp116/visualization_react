import ReactECharts from 'echarts-for-react';
import { histogram } from 'echarts-stat';

export default function GraphM({ resultState }) {
  let rmv0 = resultState.map(({ MACS }) => MACS)
  let ct = -1

  for (let i = 0; i < rmv0.length; i++) {
    if (rmv0[i] === 0){
      ct = ct+1
      resultState.splice(i-ct,1)    
    }
  }

  const MACS_name = resultState.map(x=>x['MACS'] && ({Name:x['Node Name'],MACS:x['MACS']/1000000}))

  let MACS_m = rmv0.map( x => x/1000000 )

  // find outliers    
  let length = MACS_m.length
  let data = MACS_m.sort(function(a,b){return a-b})
  let sum=0

  for (let i=0; i<length; ++i) {
    sum+=data[i]
  }

  let mean = sum/length; 
  let median = data[Math.round(length/2)]
  let IQR = data[Math.round(3*length/4)] - data[Math.round(length/4)]
  let rgl_data = []
  let otl_data = []
  let otl_data_name = []

  for (let i=0; i<data.length; ++i) {
    if(data[i]> median - 2 * IQR && data[i] < mean + 2 * IQR) {
      rgl_data.push(data[i])
    } else {
      otl_data.push(data[i])
      otl_data_name.push(MACS_name[i])
    }
  }

  // histogram function
  let bins = histogram(MACS_m, "freedmanDiaconis")

  // find histogram data for regular data and outliers
  let otl_bar = []
  let rgl_bar = []

  for (let i=0; i<bins.customData.length; i++) {
    if ( bins.customData[i][0]> median - 2 * IQR && bins.customData[i][0] < mean + 2 * IQR){
      rgl_bar.push(bins.customData[i][2])
      otl_bar.push("")
    } else {
      otl_bar.push(bins.customData[i][2])
      rgl_bar.push("")
    }
  }  

  let text_axis = []

  for (let i = 0; i < bins.data.length; i++) {
    text_axis.push(bins.data[i][4])
  }

  const options = {    
    title: {
      text: 'AE YOLOV5',
      left: 'center',
      top: 20,
      itemGap: 40
    },
    grid: {
      left: '3%',
      right: '3%',
      bottom: '3%',
      containLabel: true
    },
    tooltip:{
      trigger: "item",
      formatter: function (params) {
        return `${params.seriesName}<br />
        ${params.name}: ${params.data}<br />
        1111 node name:value goes here`
        // ${params.text_name}
      }
    },
    xAxis: {
      scale: true, 
      name: "MACS Value (in million)",
      nameLocation: "middle",
      type: "category",
      show : true,
      data: text_axis,
      nameTextStyle:{
        lineHeight: 20
      },
      axisLabel:{
        rotate: 0
      }
    },
    yAxis: {
      name:"Number of Conv Node"
    },
    gird:{
      show: false
    },
    series: [
      {
        name: 'Data',
        type: 'bar',
        stack: "total",
        barWidth: '150%',
        barCategoryGap: 0,
        data: rgl_bar,
        color: 'purple'
      },{
        name: 'Outliers',
        type: 'bar',
        stack: "total",
        barWidth: '99.3%',
        barCategoryGap: 0,
        // tooltip: {
        //   formatter: function (params) {
        //     return '${params.seriesName}<br />${params.name}: ${params.data}<br />${params.text_name}.'
        //     }
        //   },
        data: otl_bar,
        color: '#BA1B1B'
      }
    ],
    legend: {
      orient: "horizontal",
      top: 20,
      right: 20
    }
  }



  return <ReactECharts option={options} />
}