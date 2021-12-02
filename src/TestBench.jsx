import PortasoundSlider from './PortasoundSlider';
import React from 'react';

const SLIDERS_PER_GROUP = 32;
export function TestBench(p) {
  const groups = [];
  for (let j = 0; j < p.params.length / SLIDERS_PER_GROUP; j++) {
    const sliders = [];
    for (let i = j * SLIDERS_PER_GROUP; i < p.params.length && i < (j+1) * SLIDERS_PER_GROUP; i++) {
      sliders.push(
        <>
          <PortasoundSlider {...p.params[i]} value={p.values[i]} handleParamChange={p.handleParamChange} label={
            <>
              <b>{p.params[i].shortName}</b>
              <span>{p.values[i].toString(2).padStart(4, '0')} <span
                style={{ opacity: 0.5 }}>{p.values[i]}</span></span>
            </>
          }/>
        </>
      );
    }
    groups.push(
      <div className="param-subgroup">
        {sliders}
      </div>
    );
  }
  return <>
    <h2 className="param-group-label label">Parameter Test Bench</h2>
    {groups}
  </>;
}
