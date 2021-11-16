import React from 'react';
import './App.css';
import { paramsPss480 } from './portasound';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      midiOutputs: [],
      sysexParams: paramsPss480,
    }
  }

  componentDidMount() {
    navigator.requestMIDIAccess({ sysex: true }).then(this.onMIDISuccess);
  }

  handleMidiOutputChange = (e) => {
    this.midiOutput = this.midiAccess.outputs.get(e.target.value);
    localStorage.setItem('midiOutputDevice', e.target.value);
  }

  onMIDISuccess = (midiAccess) => {
    const logMidi = o => console.debug(`[MIDI ${o.type}] id: ${o.id.padEnd(14, ' ')} ` +
      `manufacturer: ${o.manufacturer.padEnd(20, ' ')} name: ${o.name.padEnd(20, ' ')}`);
    for (let entry of midiAccess.inputs) logMidi(entry[1]);
    for (let entry of midiAccess.outputs) logMidi(entry[1]);

    const outputs = [];
    for (let entry of midiAccess.outputs) {
      outputs.push(entry[1]);
    }

    this.midiAccess = midiAccess;
    this.setState({ midiOutputs: outputs });

    // let midiOutputHtml = '';
    // for (let entry of midiAccess.outputs) {
    //   let output = entry[1];
    //   midiOutputHtml += `
    //   <option value='${output.id}'>${output.name}</option>`;
    // }
    // midiOutputSelectorEl.innerHTML = midiOutputHtml;
    // midi = midiAccess;
    //
    // const storedMidiDevice = localStorage.getItem('midiOutputDevice');
    // if (storedMidiDevice) {
    //   midiOutputSelectorEl.value = storedMidiDevice;
    //   midiOutputSelectorEl.dispatchEvent(new Event('change'));
    // }
  }

  displayValues(value, sysexValue) {
    return (
      <>{value.toString().padStart(2, '0')}
        <span className="gray">{(sysexValue | 0).toString(2).padStart(8, '0')}</span>
      </>
    );
  }

  handleParamChange(idx, value) {
    const params = this.state.sysexParams;
    const param = params[idx];
    const bankNum = parseInt(params[0].value);
    param.value = value;

    sendSysex(bankNum, buildSysex(params));
  }

  render() {
    const { sysexParams, midiOutputs } = this.state;

    return (
      <div className="App">
        <h1>PortaSound PSS Sysex Editor</h1>
        <img src="/images/pss-480-yellow.png" width="500"/>
        <p>
          MIDI Device:
          <select id="midiOutput" onChange={this.handleMidiOutputChange}>
            {midiOutputs.map(output => (
              <option key={output.id} value={output.id}>{output.name}</option>
            ))}
          </select>
        </p>
        <table id="editor">
          <tbody>
          {sysexParams.map((param, i) => {
            const sysexValue = param.valueFn ? param.valueFn(param.value) : param.value;

            let ticks;
            if (param.range === 100) ticks = 11;
            else if (param.range === 128) ticks = 9;
            else if (param.range === 64) ticks = 9;
            else ticks = param.range;

            return (
              <tr key={i} className='param'>
                <td className='label'>{param.name}:</td>
                <td className='range-container'>
                  <div className='ticks'>{[...Array(ticks)].map((_, i) => <span key={i} className='tick'/>)}</div>
                  <input data-idx={i} type='range' min='0' max={param.range - 1}
                         value={param.value}
                         onChange={(e) => this.handleParamChange(i, e.target.value)}/>
                </td>
                <td className='label'>
                  <span id={'sysex-value-' + i}>{this.displayValues(param.value, sysexValue)}</span>
                </td>
              </tr>
            )
          })}
          </tbody>
        </table>
      </div>
    )
  }
}

export default App
