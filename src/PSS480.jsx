import PortasoundSlider from './PortasoundSlider';
import PortasoundButton from './PortasoundButton';
import React from 'react';

export function PSS480(p) {
  return <>
    <div className="param-group">
      <h2 className="param-group-label label">Global</h2>
      <div className="param-subgroup">
        <h3 className="label">&nbsp;</h3>
        {[0, 29].map(idx =>
          <PortasoundSlider {...p.params[idx]} handleParamChange={p.handleParamChange}/>
        )}
        <div className="button-column">
          <PortasoundButton {...p.params[35]} handleParamChange={p.handleParamChange}/>
          <PortasoundButton {...p.params[36]} handleParamChange={p.handleParamChange}/>
        </div>
      </div>
      <div className="param-subgroup">
        <h3 className="label">Low Freq Oscillator</h3>
        {[30, 31, 34].map(idx =>
          <PortasoundSlider {...p.params[idx]} handleParamChange={p.handleParamChange}/>
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
    <div className="param-group">
      <h2 className="param-group-label label">Carrier</h2>
      <div className="param-subgroup">
        <h3 className="label">Oscillator</h3>
        {[6, 4, 2, 22].map(idx =>
          <PortasoundSlider {...p.params[idx]} handleParamChange={p.handleParamChange}/>
        )}
        <div className="button-column">
          <PortasoundButton {...p.params[16]} handleParamChange={p.handleParamChange}/>
          <PortasoundButton {...p.params[18]} handleParamChange={p.handleParamChange}/>
        </div>
      </div>
      <div className="param-subgroup">
        <h3 className="label">Envelope</h3>
        {[14, 20, 26, 24, 28, 33].map(idx =>
          <PortasoundSlider {...p.params[idx]} handleParamChange={p.handleParamChange}/>
        )}
      </div>
      <div className="param-subgroup">
        <h3 className="label">Key Scaling</h3>
        {[10, 9, 12].map(idx =>
          <PortasoundSlider {...p.params[idx]} handleParamChange={p.handleParamChange}/>
        )}
      </div>
    </div>
    <div className="param-group">
      <h2 className="param-group-label label">Modulator</h2>
      <div className="param-subgroup">
        <h3 className="label">Oscillator</h3>
        {[5, 3, 1, 21].map(idx =>
          <PortasoundSlider {...p.params[idx]} handleParamChange={p.handleParamChange}/>
        )}
        <div className="button-column">
          <PortasoundButton {...p.params[15]} handleParamChange={p.handleParamChange}/>
          <PortasoundButton {...p.params[17]} handleParamChange={p.handleParamChange}/>
        </div>
      </div>
      <div className="param-subgroup">
        <h3 className="label">Envelope</h3>
        {[13, 19, 25, 23, 27, 32].map(idx =>
          <PortasoundSlider {...p.params[idx]} handleParamChange={p.handleParamChange}/>
        )}
      </div>
      <div className="param-subgroup">
        <h3 className="label">Key Scaling</h3>
        {[8, 7, 11].map(idx =>
          <PortasoundSlider {...p.params[idx]} handleParamChange={p.handleParamChange}/>
        )}
      </div>
    </div>
  </>;
}
