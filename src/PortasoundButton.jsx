import React, { PureComponent } from 'react';

class PortasoundButton extends PureComponent {
  handleButtonPress = (e) => {
    const value = (this.props.value === 0) ? 1 : 0;
    this.props.handleParamChange(this.props.idx, value);
  }

  render() {
    const { value, idx, shortName } = this.props;
    const id = 'input-' + idx;

    return (
      <div className='button-container'>
        <label htmlFor={id} className='label'>
          {value === 1 ?
            <span className='button-lamp on'/>
            :
            <span className='button-lamp off'/>
          }
          {shortName}
        </label>
        <button id={id} onClick={this.handleButtonPress}/>
      </div>
    );
  }
}

export default PortasoundButton;
