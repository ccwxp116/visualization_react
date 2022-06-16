import ReactECharts from 'echarts-for-react';
import { histogram } from 'echarts-stat';

export default function GraphS({ resultState }) {
  // remove 0 for MACS data
// #region Methods
  let rmv0 = resultState.map(({ MACS }) => MACS);
  let totalcheck = resultState.map(({ Op }) => Op);
  let ct = -1;

  for (let i = 0; i < rmv0.length; i++) {
    if (rmv0[i] === 0 || totalcheck[i] === 'Total') {
      ct = ct+1;
      resultState.splice(i-ct,1); 
    }
  }

  const MACS_name = resultState.map(x => x['Node Name']);
  let MACS_m = resultState.map(x => x['MACS']/1000000);
// #endregion

  // find outliers 
// #region Methods
  let length = MACS_m.length;
  let data = [...MACS_m].sort(function(a,b){ return a-b });
  let Q3 = data[Math.round(3*length/4)];
  let Q1 = data[Math.round(length/4)];
  let IQR = Q3 - Q1;
  let rgl_data = [];
  let otl_data = [];
  let otl_data_name = [];

  for (let i = 0; i < data.length; i++) {
    if (MACS_m[i]> Q1 - 1.5 * IQR && MACS_m[i] < Q3 + 1.5 * IQR) {
      rgl_data.push(MACS_m[i]);
    } else {
      otl_data.push(MACS_m[i]);
      otl_data_name.push(MACS_name[i]);
    }
  }
// #endregion

  // histogram function
// #region Methods
  let bins = histogram(MACS_m, 'freedmanDiaconis');
// #endregion

  // find histogram data for regular data and outliers, and X Axis
// #region Methods
  let otl_bar = [];
  let rgl_bar = [];

  for (let i = 0; i < bins.customData.length; i++) {
    if (bins.customData[i][0] > Q1 - 1.5 * IQR
      && bins.customData[i][0] <  Q3 + 1.5 * IQR) {
      rgl_bar.push(bins.customData[i][2]);
      otl_bar.push(0);
    } else {
      otl_bar.push(bins.customData[i][2]);
      rgl_bar.push(0);
    }
  }  

  let text_axis = [];

  for (let i = 0; i < bins.data.length; i++) {
    text_axis.push(bins.data[i][4]);
  }
// #endregion

  // combine outliers' node name and value
// #region Methods
  var text_name = [];

  for (let i = 0; i < bins.bins.length; i++) {
    let uniq = [...new Set(bins.bins[i].sample)];
    let inner = [];
    if (bins.bins[i].sample.length != 0) {
      let inner2 =[];
      for (let j = 0; j < otl_data.length; j++) {
        if (uniq.includes(otl_data[j])) {
          inner2.push('<br />' + otl_data_name[j] + ': ' + otl_data[j]);
        }
      }
      inner2 = inner2.reduce((acc, curVal) => acc.concat(curVal), []);
      inner.push(inner2);
    } else {
      inner.push(0);
    }
    text_name.push(inner);
  }

  text_name = text_name.reduce((acc, curVal) => acc.concat(curVal), []);
// #endregion

  // put combined otl name-value and value together into array of objects to get input data
// #region Methods
  let otl_arr = [];

  for (let i = 0; i < text_name.length; i++) {
    let name_key = ['name', text_name[i]];
    let value_key = ['value', otl_bar[i]];
    otl_arr.push(name_key);
    otl_arr.push(value_key);
  }

  const arrayToObject = (arr = []) => {
    const res = {};
      for (let pair of arr) {
        const [key, value] = pair;
        res[key] = value;
      }
      return res;
  }

  let otl_obj = [];

  for (let i = 0; i < otl_arr.length; i+=2) {
    let obj = [otl_arr[i], otl_arr[1+i]];
    otl_obj.push(arrayToObject(obj));
  }
// #endregion

  // graph option
// #region Methods
  const options = {    
    title: {
      text: 'MACS Value Distribution',
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
    tooltip: {
      trigger: 'item'
    //   formatter: function (params) {
    //     return `${params.seriesName}<br />
    //     ${params.name}: ${params.data.value}<br />
    //     ${params.data.name}`
    //   }
    },
    xAxis: {
      scale: true, 
      name: 'MACS Value (in million)',
      nameLocation: 'middle',
      type: 'category',
      show : true,
      data: text_axis,
      nameTextStyle: {
        lineHeight: 20
      },
      axisLabel: {
        rotate: 0
      }
    },
    yAxis: {
      name: 'Number of Node'
    },
    gird: {
      show: false
    },
    series: [
      {
        name: 'Data',
        type: 'bar',
        stack: 'total',
        barWidth: '99.3%',
        barCategoryGap: 0,
        tooltip: {
          trigger: 'item',
          formatter: function (params) {
            return `${params.seriesName}<br />
            ${params.name}: ${params.data}`
          }},
        data: rgl_bar,
        color: '#415AAA'
      }, {
        name: 'Outliers',
        type: 'bar',
        stack: 'total',
        barWidth: '99.3%',
        barCategoryGap: 0,
        tooltip: {
          trigger: 'item',
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
      orient: 'horizontal',
      top: 20,
      right: 20
    }
  }
// #endregion
  
  return <ReactECharts option = { options } />
}