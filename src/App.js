import './App.css';
import ReactECharts from 'echarts-for-react';
import { histogram } from 'echarts-stat';

function App() {
  // API calls goes here to retrive
  let link = 'http://10.1.40.71:2000/dagview/onnx_summary?model_name=ae_yolov5'
  let options = {}
  fetch(link)
  .then(res => res.json())
  .then((result) => {
    console.log(result)
    var rmv0 = onnx.map(({ MACS }) => MACS)

    let ct = -1
    for (var i = 0; i < rmv0.length; i++){
        if (rmv0[i] === 0){
      ct = ct+1
      onnx.splice(i-ct,1)    
    }}
  
    var MACS_name = onnx.map(x=>x['MACS'] && ({Name:x['Node Name'],MACS:x['MACS']}))
    console.log(MACS_name)
    var MACS = onnx.map(({ MACS }) => MACS)
    // var WGT_name = onnx.map(x=>x['Weight'] && ({Name:x['Node Name'],Weight:x['Weight']}))
    // var WGT = onnx.map(({ Weight }) => Weight)
  
    // find outliers    
    var length = MACS.length
    var data = MACS.sort(function(a,b){return a-b})
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
    var bins = histogram(MACS,'freedmanDiaconis')
    // console.log(bins)
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
    
  // how to add tooltip or legend for each outlier????
  // what i want for input: [{},{},{name:"node1:xxxx, node 2:xxxx"}]
  
    options = {    
      title: {
          text: 'MACS Value Distribution of Conv Nodes',
          left: 'center',
          top: 20,
          itemGap: 40,
          subtext:  '{a|' + text_sub + '}' ,
          // subtext: text_sub,
          subtextStyle:{
              textBoarderType:"dashed",
              align: 'left',
              color: '#BA1B1B',
              rich:{
                a:{
                  // backgroundColor: "#FFEDE9",
                  // borderColor: "#BA1B1B"
                  // borderWidth: 1
                }
              }
          }
      },
      grid: {
          left: '3%',
          right: '3%',
          bottom: '3%',
          containLabel: true
      },
      tooltip:{},
      xAxis: {
          scale: true, 
          name: "MACS Value",
          nameLocation: "middle",
          type: "category",
          show : true,
          data: text_axis
      },
      yAxis: {
          name:"Number of Conv Node"
      },
      series: [
          {
          name: 'Data',
          type: 'bar',
          stack: "total",
          barWidth: '99.3%',
          barCategoryGap: 0,
          label: {
              normal: {
                  show: false,
                  position: 'top'
                  }
              },
              data: rgl_bar,
              color: '#415AAA'
          },{
          name: 'Outliers',
          type: 'bar',
          stack: "total",
          barWidth: '99.3%',
          barCategoryGap: 0,
          label: {
              normal: {
                  show: false,
                  position: 'top'
                  }
              },
          data: otl_bar,
          color: '#BA1B1B'
          }
      ],
      label: {
          normal: {
              show: true,
              position: 'top'
              }
      },
      legend: {
          orient: "vertical",
          top: 45
      }
    }
  });
}

  return (
    <div className="App">
      <ReactECharts option={options} />
    </div>
  );
}

export default App;
