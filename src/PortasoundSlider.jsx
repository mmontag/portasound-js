import React, { PureComponent } from 'react';

class PortasoundSlider extends PureComponent {
  render() {
    const { value, range, idx, handleParamChange } = this.props;
    let ticks;
    if (range === 100) ticks = 11;
    else if (range === 128) ticks = 9;
    else if (range === 64) ticks = 9;
    else ticks = range;

    return (
      <div className='range-container'>
        <input type='range' min='0' max={range - 1}
               value={value}
               onChange={(e) => handleParamChange(idx, e.target.value)}/>
        <div className='ticks'>{[...Array(ticks)].map((_, i) => <span key={i} className='tick'/>)}</div>
      </div>
    );
  }
}

export default PortasoundSlider;
