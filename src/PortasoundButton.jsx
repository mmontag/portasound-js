import React, { PureComponent } from 'react';

class PortasoundButton extends PureComponent {
  handleButtonPress = (e) => {
    const value = (this.props.value === 0) ? 1 : 0;
    this.props.handleParamChange(this.props.paramIdx, value);
  }

  render() {
    const { value, paramIdx, shortName } = this.props;
    const id = 'input-' + paramIdx;

    return (
      <div className='button-container'>
        <label htmlFor={id} className='label'>
          {value === 1 ?
            <span className='button-lamp on'/>
            :
            <span className='button-lamp off'/>
          }
          {shortName}
        </label><br/>
        <button id={id} onClick={this.handleButtonPress}/>
      </div>
    );
  }
}

export default PortasoundButton;
