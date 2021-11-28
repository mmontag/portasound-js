import PortasoundSlider from './PortasoundSlider';
import React from 'react';

export function DSR2000(p) {
  const sliders = [];
  for (let i = 0; i < p.params.length; i++) {
    sliders.push(
      <>
        <PortasoundSlider {...p.params[i]} handleParamChange={p.handleParamChange} label={
          <>
            <b>{p.params[i].shortName}</b>
            <span>{p.params[i].value.toString(2).padStart(4, '0')} <span style={{opacity: 0.5}}>{p.params[i].value}</span></span>
          </>
        }>
        </PortasoundSlider>
      </>
    );
  }
  return <>
    <h2 className="param-group-label label">DSR-2000</h2>
    <div className="param-subgroup">
      {sliders}
    </div>
  </>;
}
