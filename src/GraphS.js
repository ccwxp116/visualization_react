import ReactECharts from 'echarts-for-react';
import { histogram } from 'echarts-stat';

export default function GraphS({ resultState }) {
  let rmv0 = resultState.map(({ MACS }) => MACS)
  let ct = -1

  for (let i = 0; i < rmv0.length; i++) {
    if (rmv0[i] === 0){
      ct = ct+1
      resultState.splice(i-ct,1)    
    }
  }

  const MACS_name = resultState.map( x => x['Node Name'] )

  let MACS_m = resultState.map( x => x['MACS']/1000000 )

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
    if(MACS_m[i]> median - 2 * IQR && MACS_m[i] < mean + 2 * IQR) {
      rgl_data.push(MACS_m[i])
    } else {
      otl_data.push(MACS_m[i])
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

  // outliers' node name and value
  var text_name = []
console.log([...new Set(bins.bins[0].sample)])
  for (let i = 0; i < bins.bins.length; i++) {
    let uniq = [...new Set(bins.bins[i].sample)]
    let inner = []
    if (bins.bins[i].sample.length != 0) {
      for (let j = 0; j < otl_data.length; j++) {
        if (uniq.includes(otl_data[j])) {
          inner.push(otl_data_name[j] + ": " + otl_data[j])
        }
      }
    } else {
      inner.push()
    }
    text_name.push(inner)
  }

  let otl_arr = []

  for (i = 0; i < text_name.length; i++) {
    otl_arr = {Node:text_name[i], Value:otl_bar[i]}
  }

  console.log(otl_arr)

  const options = {    
    title: {
      text: 'MACS Value Distribution of Conv Nodes',
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
        ${text_name}`
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
        barWidth: '99.3%',
        barCategoryGap: 0,
        data: rgl_bar,
        color: '#415AAA'
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