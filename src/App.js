import './App.css';
import { useState } from 'react'
import GraphS from './GraphS'
import GraphM from './GraphM'
import GraphT_L from './GraphT_L'

function App() {
  const [resultState, set_resultState] = useState()
  const [resultState1, set_resultState1] = useState()
  const [resultState2, set_resultState2] = useState()

  if (!resultState) {
    const link = 'http://10.1.40.71:2000/dagview/onnx_summary?model_name=yolov5s_lousun2_simplify&version=4.0.11'
    fetch(link)
    .then(res => res.json())
    .then((res) => {
      if (res) {
        // resultState = res
        set_resultState(res)
      }
    })
  }

  if (!resultState) {
    const link = 'http://10.1.40.71:2000/dagview/onnx_summary?model_name=yolov5s_lousun2_simplify&version=4.0.11'
    fetch(link)
    .then(res => res.json())
    .then((res) => {
      set_resultState1(res)
    })
  }

  if (!resultState) {
    const link = 'http://10.1.40.71:2000/dagview/onnx_summary?model_name=yolov5s_lousun2_simplify&version=4.0.11'
    fetch(link)
    .then(res => res.json())
    .then((res) => {
      set_resultState2(res)
    })
  }

  return (
    <div className="App">
      {resultState && <GraphS resultState={resultState}/>}
      {resultState1 && <GraphM resultState={resultState1}/>}
      {resultState2 && <GraphT_L resultState={resultState1}/>}
    </div>
  );
}

export default App;
