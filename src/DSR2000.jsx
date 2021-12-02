import PortasoundSlider from './PortasoundSlider';
import React from 'react';
import PortasoundButton from './PortasoundButton';

export function DSR2000(p) {
  return <>
    <div className="param-group">
      <h2 className="param-group-label label">Global</h2>
      <div className="param-subgroup">
        <h3 className="label">&nbsp;</h3>
        {[0, 29].map(idx =>
          <PortasoundSlider {...p.params[idx]} value={p.values[idx]} handleParamChange={p.handleParamChange}/>
        )}
        <div className="button-column">
          {[35, 36].map(idx => <>
            <PortasoundButton {...p.params[idx]} value={p.values[idx]} handleParamChange={p.handleParamChange}/>
          </>)}
        </div>
      </div>
      <div className="param-subgroup">
        <h3 className="label">Low Freq Oscillator</h3>
        {[30, 31, 34].map(idx =>
          <PortasoundSlider {...p.params[idx]} value={p.values[idx]} handleParamChange={p.handleParamChange}/>
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
    {[0, 1, 2, 3].map(i =>
      <div className="param-group">
        <h2 className="param-group-label label">OP {i + 1}</h2>
        <div className="param-subgroup">
          <h3 className="label">Oscillator</h3>
          {[6, 4, 2, 22].map(idx =>
            <PortasoundSlider {...p.params[idx]} value={p.values[idx]} handleParamChange={p.handleParamChange}/>
          )}
          <div className="button-column">
            {[16, 18].map(idx => <>
              <PortasoundButton {...p.params[idx]} value={p.values[idx]} handleParamChange={p.handleParamChange}/>
            </>)}
          </div>
        </div>
        <div className="param-subgroup">
          <h3 className="label">Envelope</h3>
          {[14, 20, 26, 24, 28, 33].map(idx =>
            <PortasoundSlider {...p.params[idx]} value={p.values[idx]} handleParamChange={p.handleParamChange}/>
          )}
        </div>
        <div className="param-subgroup">
          <h3 className="label">Key Scaling</h3>
          {[10, 9, 12].map(idx =>
            <PortasoundSlider {...p.params[idx]} value={p.values[idx]} handleParamChange={p.handleParamChange}/>
          )}
        </div>
      </div>
    )}
  </>;
}
