import React, { PureComponent } from 'react';

class PortasoundSlider extends PureComponent {
  render() {
    const { param, handleParamChange } = this.props;
    let ticks;
    if (param.range === 100) ticks = 11;
    else if (param.range === 128) ticks = 9;
    else if (param.range === 64) ticks = 9;
    else ticks = param.range;

    return (
      <div className='range-container'>
        <div className='ticks'>{[...Array(ticks)].map((_, i) => <span key={i} className='tick'/>)}</div>
        <input type='range' min='0' max={param.range - 1}
               value={param.value}
               onChange={handleParamChange}/>
      </div>
    );
  }
}

export default PortasoundSlider;
