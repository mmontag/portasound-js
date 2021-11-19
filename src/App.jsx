import React from 'react';
import './App.css';
import { buildSysex, paramsPss480, sendSysex } from './portasound';
import PortasoundSlider from './PortasoundSlider';
import PortasoundButton from './PortasoundButton';

const MIDI_OUTPUT_ID_KEY = "midiOutputId";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.midiAccess = null; // WebMIDI object for internal access to MIDI devices
    this.state = {
      midiOutputs: [], // For UI/display only; midiAccess.outputs converted to array
      midiOutputId: 0, // For UI/display only, also used in localstorage
      sysexParams: paramsPss480,
    };
  }

  componentDidMount() {
    navigator.requestMIDIAccess({ sysex: true }).then(this.onMIDISuccess);
  }

  handleMidiOutputChange = (e) => {
    this.setState({ midiOutputId: e.target.value });
    localStorage.setItem(MIDI_OUTPUT_ID_KEY, e.target.value);
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

    const storedMidiOutputId = localStorage.getItem(MIDI_OUTPUT_ID_KEY);
    if (storedMidiOutputId) {
      this.setState({ midiOutputId: storedMidiOutputId });
    }
  }

  handleParamChange = (idx, value) => {
    const params = this.state.sysexParams;
    const param = params[idx];
    const bankNum = parseInt(params[0].value);

    param.value = value;
    this.setState({ sysexParams: params });

    sendSysex(this.getMidiOutput(), bankNum, buildSysex(params));
  }

  getMidiOutput = () => {
    return this.midiAccess.outputs.get(this.state.midiOutputId);
  }

  render() {
    const { sysexParams, midiOutputs, midiOutputId } = this.state;

    return (
      <div className="App">
        <h1>PortaSound PSS Sysex Editor</h1>
        <img src="/images/pss-480-yellow.png" width="500" alt="PSS-480"/>
        <p>
          MIDI Device:
          <select id="midiOutput" value={midiOutputId} onChange={this.handleMidiOutputChange}>
            {midiOutputs.map(output => (
              <option key={output.id} value={output.id}>{output.name}</option>
            ))}
          </select>
        </p>
        <table id="editor">
          <tbody>
          {sysexParams.map((param, i) => {
            const sysexValue = param.valueFn ? param.valueFn(param.value) : param.value;
            const sysexBinary = (sysexValue | 0).toString(2).padStart(8, '0');
            const displayValue = param.value.toString().padStart(2, '0');

            return (
              <tr key={i} className='param'>
                <td className='label'>{param.name}:</td>
                <td>
                  {param.range === 2 ?
                    <PortasoundButton {...param}
                                      paramIdx={i}
                                      handleParamChange={this.handleParamChange}/>
                    :
                    <PortasoundSlider {...param}
                                      paramIdx={i}
                                      handleParamChange={this.handleParamChange}/>
                  }
                </td>
                <td className='label' title={sysexBinary}>
                  {displayValue}
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

export default App;
