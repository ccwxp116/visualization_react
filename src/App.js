import './App.css';
import { useState } from 'react'
import GraphS from './GraphS'

function App() {
  const [resultState, set_resultState] = useState()
  const link = 'http://10.1.40.71:2000/dagview/onnx_summary?model_name=ADAS_V11&version=4.0.10'
  fetch(link)
  .then(res => res.json())
  .then((res) => {
    // if (res) {
    //   set_resultState(res)
    //   console.log(res, resultState)
    // }
  })

  return (
    <div className="App">
      <GraphS data={resultState}/>
    </div>
  );
}

export default App;
