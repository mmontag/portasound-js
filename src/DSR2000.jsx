import PortasoundSlider from './PortasoundSlider';
import React from 'react';
import PortasoundButton from './PortasoundButton';

const NUM_OPERATOR_PARAMS = 17;
const FIRST_OPERATOR_PARAM_IDX = 13;
function opToParamIdxFn(op) {
  const opIdx = {1: 3, 2: 1, 3: 2, 4: 0}[op];
  return paramIdx => {
    return paramIdx + opIdx * NUM_OPERATOR_PARAMS + FIRST_OPERATOR_PARAM_IDX;
  }
}

export function DSR2000(p) {
  return <>
    <div className="param-group">
      <h2 className="param-group-label label">Global</h2>
      <div className="param-subgroup">
        <h3 className="label">&nbsp;</h3>
        <PortasoundSlider {...p.params[0]} value={p.values[0]} handleParamChange={p.handleParamChange}/>

        <div className="inline">
        <table className="algorithms"><tbody>
        <tr>
          <td><img src="images/alg1.svg" onClick={(e) => p.handleParamChange(0, 0)}/></td>
          <td><img src="images/alg2.svg" onClick={(e) => p.handleParamChange(0, 1)}/></td>
          <td><img src="images/alg3.svg" onClick={(e) => p.handleParamChange(0, 2)}/></td>
          <td><img src="images/alg4.svg" onClick={(e) => p.handleParamChange(0, 3)}/></td>
        </tr>
        <tr>
          <td><img src="images/alg5.svg" onClick={(e) => p.handleParamChange(0, 4)}/></td>
          <td><img src="images/alg6.svg" onClick={(e) => p.handleParamChange(0, 5)}/></td>
          <td><img src="images/alg7.svg" onClick={(e) => p.handleParamChange(0, 6)}/></td>
          <td><img src="images/alg8.svg" onClick={(e) => p.handleParamChange(0, 7)}/></td>
        </tr>
        </tbody></table>
        </div>
        {[1, 2].map(idx =>
          <PortasoundSlider key={idx} {...p.params[idx]} value={p.values[idx]} handleParamChange={p.handleParamChange}/>
        )}
        <div className="button-column">
          {[3, 4].map(idx =>
            <PortasoundButton key={idx} {...p.params[idx]} value={p.values[idx]} handleParamChange={p.handleParamChange}/>
          )}
        </div>
      </div>
      <div className="param-subgroup">
        <h3 className="label">Low Freq Oscillator</h3>
        {[5, 6, 7, 8, 9, 10, 11, 12].map(idx =>
          <PortasoundSlider key={idx} {...p.params[idx]} value={p.values[idx]} handleParamChange={p.handleParamChange}/>
        )}
      </div>
      <div className="param-subgroup">
        <div className="button-column">
          <div className="button-container">
            <label htmlFor="demo" className="label">
              Demonstration Start/Stop
            </label>
            <button id="demo" className="yellow" onClick={p.toggleDemo}/>
          </div>
        </div>
      </div>
    </div>
    <br/>
    { // Operators
      [1, 2, 3, 4].map(op =>
      <div key={`op${op}`} className="param-group">
        <h2 className="param-group-label label">Operator {op}</h2>
        <div className="param-subgroup">
          <h3 className="label">Oscillator</h3>
          {[0, 1, 2, 3, 4].map(opToParamIdxFn(op)).map(idx =>
            <PortasoundSlider key={idx} {...p.params[idx]} value={p.values[idx]} handleParamChange={p.handleParamChange}/>
          )}
          <div className="button-column">
            {[5, 7].map(opToParamIdxFn(op)).map(idx =>
              <PortasoundButton key={idx} {...p.params[idx]} value={p.values[idx]} handleParamChange={p.handleParamChange}/>
            )}
          </div>
        </div>
        <div className="param-subgroup">
          <h3 className="label">Envelope</h3>
          {[8, 9, 10, 11, 12].map(opToParamIdxFn(op)).map(idx =>
            <PortasoundSlider key={idx} {...p.params[idx]} value={p.values[idx]} handleParamChange={p.handleParamChange}/>
          )}
        </div>
        <div className="param-subgroup">
          <h3 className="label">Key Scaling</h3>
          {[13, 14, 15, 16].map(opToParamIdxFn(op)).map(idx =>
            <PortasoundSlider key={idx} {...p.params[idx]} value={p.values[idx]} handleParamChange={p.handleParamChange}/>
          )}
        </div>
      </div>
    )}
  </>;
}
