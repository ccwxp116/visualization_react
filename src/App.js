import './App.css';
import ReactECharts from 'echarts-for-react';
import { histogram } from 'echarts-stat';

function App() {
  // API calls goes here to retrive
  var onnx = [{"Index":1,"Op":"Conv","Id":3.0,"Iy":640.0,"Ix":640.0,"IFMAP":1228800,"N":48.0,"D":3.0,"Ky":3.0,"Kx":3.0,"Weight":1296,"Od":48.0,"Oy":320.0,"Ox":320.0,"OFMAP":4915200,"MACS":132710400,"Node Name":"Conv_0"},{"Index":2,"Op":"Relu","Id":48.0,"Iy":320.0,"Ix":320.0,"IFMAP":4915200,"N":0.0,"D":0.0,"Ky":0.0,"Kx":0.0,"Weight":0,"Od":48.0,"Oy":320.0,"Ox":320.0,"OFMAP":4915200,"MACS":0,"Node Name":"Relu_1"},{"Index":3,"Op":"Conv","Id":48.0,"Iy":320.0,"Ix":320.0,"IFMAP":4915200,"N":96.0,"D":48.0,"Ky":3.0,"Kx":3.0,"Weight":41472,"Od":96.0,"Oy":160.0,"Ox":160.0,"OFMAP":2457600,"MACS":1061683200,"Node Name":"Conv_2"},{"Index":4,"Op":"Relu","Id":96.0,"Iy":160.0,"Ix":160.0,"IFMAP":2457600,"N":0.0,"D":0.0,"Ky":0.0,"Kx":0.0,"Weight":0,"Od":96.0,"Oy":160.0,"Ox":160.0,"OFMAP":2457600,"MACS":0,"Node Name":"Relu_3"},{"Index":5,"Op":"Conv","Id":96.0,"Iy":160.0,"Ix":160.0,"IFMAP":2457600,"N":48.0,"D":96.0,"Ky":1.0,"Kx":1.0,"Weight":4608,"Od":48.0,"Oy":160.0,"Ox":160.0,"OFMAP":1228800,"MACS":117964800,"Node Name":"Conv_4"}]
  
  var result = onnx.map(({ MACS }) => MACS)

  let ct = -1
  for (var i = 0; i < result.length; i++){
      if (result[i] === 0){
    ct = ct+1
    onnx.splice(i-ct,1)    
  }}

  var MACS_name = onnx.map(x=>x['MACS'] && ({Name:x['Node Name'],MACS:x['MACS']/1000000}))
  console.log(MACS_name)
  // // var MACS = onnx.map(({ MACS }) => MACS)
  // var WGT_name = onnx.map(x=>x['Weight'] && ({Name:x['Node Name'],Weight:x['Weight']}))
  // var WGT = onnx.map(({ Weight }) => Weight)

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
  // var MACS_l = MACS.map(x => Math.log10(x))

  // var MACS_c = MACS.map(x => Math.cbrt(x))

  // var MACS_s = MACS.map(x => Math.sqrt(x))

  var MACS_m = MACS.map(x => x/1000000)

  // find outliers    
  var length = MACS_m.length
  var data = MACS_m.sort(function(a,b){return a-b})
  var sum=0   
  var sumsq = 0
  for (let i=0; i<length; ++i) {
    sum+=data[i]
    sumsq+=data[i] * data[i]
  }
  var mean = sum/length; 
  var median = data[Math.round(length/2)]
  var LQ = data[Math.round(length/4)]
  var UQ = data[Math.round(3*length/4)]
  var IQR = UQ-LQ
  var rgl_data = new Array()
  var otl_data = new Array()
  for (let i=0; i<data.length; ++i) {
    if(data[i]> median - 2 * IQR && data[i] < mean + 2 * IQR) {
      rgl_data.push(data[i])
    } else {
      otl_data.push(data[i])
      // otl_data_name.push(MACS_name[i])
    }
  }
  console.log(otl_data)

  // histogram function
  // console.log(histogram)
  var bins = histogram(MACS_m, "freedmanDiaconis")
  console.log(bins)
  // find histogram data for regular data and outliers
  var otl_bar = new Array()
  var rgl_bar = new Array()
  for (let i=0; i<bins.customData.length; i++) {
    if ( bins.customData[i][0]> median - 2 * IQR && bins.customData[i][0] < mean + 2 * IQR){
      rgl_bar.push(bins.customData[i][2])
      otl_bar.push("")
    } else {
          otl_bar.push(bins.customData[i][2])
          rgl_bar.push("")
        }
      }  

  var text_axis = new Array ()
  for (let i = 0; i < bins.data.length; i++){
    text_axis.push(bins.data[i][4])
  }

  var text_sub = new Array ()
  for (let i = 0; i< MACS_name.length; i++){
    text_sub.push("\n"+MACS_name[i].Name+": "+MACS_name[i].MACS)
  }

  // outliers' node name and value
  // var text_name = new Array ()
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
  // let otl_arr = new Array ()
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
  };

  return (
    <div className="App">
      <ReactECharts option={options} />
    </div>
  );
}

export default App;
