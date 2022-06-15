import ReactECharts from 'echarts-for-react';
import { histogram } from 'echarts-stat';

export default function GraphS({ resultState }) {
  let rmv0 = resultState.map(({ Weight }) => Weight)
  let totalcheck = resultState.map(({ Op }) => Op)

  let ct = -1
  console.log(resultState)

  for (let i = 0; i < rmv0.length; i++) {
    if (rmv0[i] === 0 || totalcheck[i] === 'Total'){
      ct = ct+1
      resultState.splice(i-ct,1)    
    }
  }

  const Weight_name = resultState.map( x => x['Node Name'] )
console.log(Weight_name)
  let Weight = resultState.map( x => x['Weight'])

  // find outliers    
  let length = Weight.length
  let data = [...Weight].sort(function(a,b){return a-b})
  let sum=0

  for (let i = 0; i < length; i++) {
    sum+=data[i]
  }

  let mean = sum/length; 
  let median = data[Math.round(length/2)]
  let Q3 = data[Math.round(3*length/4)]
  let Q1 = data[Math.round(length/4)]
  let IQR = Q3 - Q1
  let rgl_data = []
  let otl_data = []
  let otl_data_name = []

  for (let i = 0; i < data.length; i++) {
    if(Weight[i]> Q1 - 1.5 * IQR && Weight[i] < Q3 + 1.5 * IQR) {
      rgl_data.push(Weight[i])
    } else {
      otl_data.push(Weight[i])
      otl_data_name.push(Weight_name[i])
    }
  }
console.log(Weight)
console.log(rgl_data)
  // histogram function
  let bins = histogram(Weight, "freedmanDiaconis")

  // find histogram data for regular data and outliers
  let otl_bar = []
  let rgl_bar = []

  for (let i = 0; i < bins.customData.length; i++) {
    if ( bins.customData[i][0]> median - 2 * IQR && bins.customData[i][0] < mean + 2 * IQR){
      rgl_bar.push(bins.customData[i][2])
      otl_bar.push(0)
    } else {
      otl_bar.push(bins.customData[i][2])
      rgl_bar.push(0)
    }
  }  
console.log(otl_bar)
  let text_axis = []

  for (let i = 0; i < bins.data.length; i++) {
    text_axis.push(bins.data[i][4])
  }

  // outliers' node name and value
  var text_name = []
  for (let i = 0; i < bins.bins.length; i++) {
    let uniq = [...new Set(bins.bins[i].sample)]
    let inner = []
    if (bins.bins[i].sample.length != 0) {
      let inner2 =[]
      for (let j = 0; j < otl_data.length; j++) {
        if (uniq.includes(otl_data[j])) {
          inner2.push( "<br />" + otl_data_name[j] + ": " + otl_data[j])
        }
      }
      inner2 = inner2.reduce((acc, curVal) => acc.concat(curVal), [])
      inner.push(inner2)
    } else {
      inner.push(0)
    }
    text_name.push(inner)
  }

  text_name = text_name.reduce((acc, curVal) => acc.concat(curVal), [])
console.log(text_name)

  // put them together into array of objects
  let otl_arr = []

  for (let i = 0; i < text_name.length; i++) {
    let name_key = ['name', text_name[i]]
    let value_key = ['value', otl_bar[i]]
    otl_arr.push(name_key)
    otl_arr.push(value_key)
  }
console.log(otl_arr)
  const arrayToObject = (arr = []) =>{
    const res = {}
      for(let pair of arr) {
        const [key, value] = pair
        res[key] = value
      }
      return res
  }

  let otl_obj = []

  for (let i = 0; i < otl_arr.length; i+=2) {
    let obj = [otl_arr[i], otl_arr[1+i]]
    otl_obj.push(arrayToObject(obj))
  }

  console.log(otl_obj)

  const options = {    
    title: {
      text: 'Weight Distribution',
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
      trigger: "item"
    //   formatter: function (params) {
    //     return `${params.seriesName}<br />
    //     ${params.name}: ${params.data.value}<br />
    //     ${params.data.name}`
    //   }
    },
    xAxis: {
      scale: true, 
      name: "Weight",
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
      name:"Number of Node"
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
        tooltip:{
          trigger: "item",
          formatter: function (params) {
            return `${params.seriesName}<br />
            ${params.name}: ${params.data}`
          }},
        data: rgl_bar,
        color: '#415AAA'
      }, {
        name: 'Outliers',
        type: 'bar',
        stack: "total",
        barWidth: '99.3%',
        barCategoryGap: 0,
        tooltip:{
          trigger: "item",
          formatter: function (params) {
            return `${params.seriesName}<br />
            ${params.name}: ${params.data.value}<hr>
            Node${params.data.name}`
          }
        },
        data: otl_obj,
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