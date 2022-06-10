import './App.css';
import ReactECharts from 'echarts-for-react';
import { histogram } from 'echarts-stat';

function App() {
  let link = 'http://10.1.40.71:2000/dagview/onnx_summary?model_name=ae_yolov5'

fetch(link)

.then(res => res.json())

.then((result) => {

console.log(result)

})

  var rmv0 = result.map(({ MACS }) => MACS)

  let ct = -1

  for (var i = 0; i < rmv0.length; i++){
      if (rmv0[i] === 0){
    ct = ct+1
    result.splice(i-ct,1)    
  }}

  const MACS_name = result.map(x=>x['MACS'] && ({Name:x['Node Name'],MACS:x['MACS']/1000000}))

  // const MACS = onnx.map(({ MACS }) => MACS)

  // const WGT_name = onnx.map(x=>x['Weight'] && ({Name:x['Node Name'],Weight:x['Weight']}))

  // const WGT = onnx.map(({ Weight }) => Weight)

  //delete later
  var MACS = [
    203489280,
      120586240,
      271319040,
      120586240,
      30146560,
      135659520,
      30146560,
      135659520,
      135659520,
      60293120,
      135659520,
      60293120,
      135659520,
      135659520,
      90439680,
      135659520,
      90439680,
      135659520,
      135659520,
      964689920,
      60293120,
      67829760,
      60293120,
      67829760,
      33914880,
      75366400,
      67829760,
      75366400,
      67829760,
      33914880,
      90439680,
      67829760,
      90439680,
      67829760,
      33914880,
      105512960,
      67829760,
      105512960,
      67829760,
      33914880,
      964689920,
      60293120,
      33914880,
      60293120,
      33914880,
      8478720,
      67829760,
      33914880,
      67829760,
      33914880,
      8478720,
      75366400,
      33914880,
      75366400,
      33914880,
      8478720,
      82903040,
      33914880,
      82903040,
      33914880,
      8478720,
      90439680,
      33914880,
      90439680,
      33914880,
      8478720,
      97976320,
      33914880,
      97976320,
      33914880,
      8478720,
      105512960,
      33914880,
      105512960,
      33914880,
      8478720,
      113049600,
      33914880,
      113049600,
      33914880,
      8478720,
      964689920,
      30146560,
      8478720,
      30146560,
      8478720,
      2119680,
      32030720,
      8478720,
      32030720,
      8478720,
      2119680,
      33914880,
      8478720,
      33914880,
      8478720,
      2119680,
      35799040,
      8478720,
      35799040,
      8478720,
      2119680,
      37683200,
      8478720,
      37683200,
      8478720,
      2119680,
      39567360,
      8478720,
      39567360,
      8478720,
      2119680,
      455966720
  ] 
  // transformation:
  // var MACS_l = MACS.map( x => Math.log10(x))

  // var MACS_c = MACS.map( x => Math.cbrt(x) )

  // var MACS_s = MACS.map( x => Math.sqrt(x) )

  var MACS_m = MACS.map( x => x/1000000 )

  // find outliers    
  var length = MACS_m.length
  var data = MACS_m.sort(function(a,b){return a-b})
  var sum=0

  for (let i=0; i<length; ++i) {
    sum+=data[i]
  }

  var mean = sum/length; 
  var median = data[Math.round(length/2)]
  var IQR = data[Math.round(3*length/4)] - data[Math.round(length/4)]
  var rgl_data = []
  var otl_data = []
  var otl_data_name = []

  for (let i=0; i<data.length; ++i) {
    if(data[i]> median - 2 * IQR && data[i] < mean + 2 * IQR) {
      rgl_data.push(data[i])
    } else {
      otl_data.push(data[i])
      otl_data_name.push(MACS_name[i])
    }
  }

  // histogram function
  var bins = histogram(MACS_m, "freedmanDiaconis")

  // find histogram data for regular data and outliers
  var otl_bar = []

  var rgl_bar = []

  for (let i=0; i<bins.customData.length; i++) {
    if ( bins.customData[i][0]> median - 2 * IQR && bins.customData[i][0] < mean + 2 * IQR){
      rgl_bar.push(bins.customData[i][2])
      otl_bar.push("")
    } else {
      otl_bar.push(bins.customData[i][2])
      rgl_bar.push("")
    }
  }  

  var text_axis = []

  for (let i = 0; i < bins.data.length; i++) {
    text_axis.push(bins.data[i][4])
  }

  // var text_sub = []

  // for (let i = 0; i< MACS_name.length; i++) {
  //   text_sub.push("\n"+MACS_name[i].Name+": "+MACS_name[i].MACS)
  // }

  // outliers' node name and value
  // var text_name = []

  // for (let i = 0; i < bins.bins.length; i++) {
  //   let uniq = [...new Set(bins.bins[i].sample)]
  //   let inner = []
  //   if (bins.bins[i].sample.length != 0) {
  //     for (let j = 0; j < otl_data_name.length; j++) {
  //       if (uniq.includes(otl_data_name[j].MACS)) {
  //         inner.push(otl_data_name[j].Name + ": " + otl_data_name[j].MACS)
  //       } 
  //     }
  //   } else {
  //     inner.push("")
  //   }
  //   text_name.push(inner)
  // }

  // let otl_arr = []

  // for (i = 0; i < text_name.length; i++) {
  //   otl_arr[i] = {Node:text_name[i], Value:otl_bar[i]}
  // }

  // console.log(otl_arr)

// how to add tooltip or legend for each outlier????
// use tooltip formatter

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
  };

  return (
    <div className="App">
      <ReactECharts option={options} />
    </div>
  );
}

export default App;
