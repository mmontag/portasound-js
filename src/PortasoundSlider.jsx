import React, { PureComponent } from 'react';

class PortasoundSlider extends PureComponent {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }

  componentDidMount() {
    this.inputRef.current.addEventListener('wheel', this.handleWheel, { passive: false });
  }

  componentWillUnmount() {
    this.inputRef.current.removeEventListener('wheel', this.handleWheel, { passive: false });
  }

  handleWheel = (e) => {
    e.preventDefault();
    const { idx, value, range, handleParamChange } = this.props;
    const delta = range > 16 ?
      Math.floor(e.deltaY / 4) : // Use wheel acceleration
      e.deltaY > 0 ? 1 : -1;     // Use 1 / -1
    handleParamChange(idx, value - delta);
  }

  render() {
    const { value, range, name, shortName, idx, handleParamChange, label } = this.props;
    let ticks;
    if (range === 100) ticks = 11;
    else if (range === 128) ticks = 9;
    else if (range === 64) ticks = 9;
    else if (range === 32) ticks = 17;
    else if (range > 32) ticks = 8;
    else ticks = range;

    return (
      <div key={'vert' + idx} className='vertical-slider-with-label' title={name}>
        <div className='label'>{ label || shortName}</div>
        <div className='vertical-slider'>
          <div className='range-container'>
            <input type='range' min='0' max={range - 1}
                   value={value}
                   ref={this.inputRef}
                   onChange={(e) => handleParamChange(idx, e.target.value)}/>
            <div className='ticks'>{[...Array(ticks)].map((_, i) => <span key={i} className='tick'/>)}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default PortasoundSlider;
