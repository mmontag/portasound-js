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
    const params = sysexParams;

    return (
      <div className="App">
        <header>
          <img src="/images/portasound-cyan.png" alt="Portasound"/>
          <img src="/images/pss-480-yellow.png" alt="PSS-480"/>
          <h1>Sysex Editor for Portasound Series Keyboards</h1>
        </header>
        <p>
          MIDI Device:{' '}
          <select id="midiOutput" value={midiOutputId} onChange={this.handleMidiOutputChange}>
            {midiOutputs.map(output => (
              <option key={output.id} value={output.id}>{output.name}</option>
            ))}
          </select>
        </p>
        <div className='param-group'>
          <h2 className='param-group-label label'>Carrier</h2>
          <div className='param-subgroup'>
            <h3 className='label'>Oscillator</h3>
            {[params[6], params[4], params[2], params[22]].map(param => (
              <div className='vertical-slider-with-label'>
                <div className='label'>{param.shortName}</div>
                <div key={'vert' + param.idx} className='vertical-slider'>
                  <PortasoundSlider {...param}
                                    handleParamChange={this.handleParamChange}/>
                </div>
              </div>
            ))}
            <div className='button-column'>
              <PortasoundButton {...params[16]} handleParamChange={this.handleParamChange}/>
              <PortasoundButton {...params[18]} handleParamChange={this.handleParamChange}/>
            </div>
          </div>
          <div className='param-subgroup'>
            <h3 className='label'>Envelope</h3>
            {[params[14], params[20], params[26], params[24], params[28], params[33]].map(param => (
              <div className='vertical-slider-with-label'>
                <div className='label'>{param.shortName}</div>
                <div key={'vert' + param.idx} className='vertical-slider'>
                  <PortasoundSlider {...param}
                                    handleParamChange={this.handleParamChange}/>
                </div>
              </div>
            ))}
          </div>
          <div className='param-subgroup'>
            <h3 className='label'>Key Scaling</h3>
            {[params[10], params[9], params[12]].map(param => (
              <div className='vertical-slider-with-label'>
                <div className='label'>{param.shortName}</div>
                <div key={'vert' + param.idx} className='vertical-slider'>
                  <PortasoundSlider {...param}
                                    handleParamChange={this.handleParamChange}/>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className='param-group'>
          <h2 className='param-group-label label'>Modulator</h2>
          <div className='param-subgroup'>
            <h3 className='label'>Oscillator</h3>
            {[params[5], params[3], params[1], params[21]].map(param => (
              <div className='vertical-slider-with-label'>
                <div className='label'>{param.shortName}</div>
                <div key={'vert' + param.idx} className='vertical-slider'>
                  <PortasoundSlider {...param}
                                    handleParamChange={this.handleParamChange}/>
                </div>
              </div>
            ))}
            <div className='button-column'>
              <PortasoundButton {...params[15]} handleParamChange={this.handleParamChange}/>
              <PortasoundButton {...params[17]} handleParamChange={this.handleParamChange}/>
            </div>
          </div>
          <div className='param-subgroup'>
            <h3 className='label'>Envelope</h3>
            {[params[13], params[19], params[25], params[23], params[27], params[32]].map(param => (
              <div className='vertical-slider-with-label'>
                <div className='label'>{param.shortName}</div>
                <div key={'vert' + param.idx} className='vertical-slider'>
                  <PortasoundSlider {...param}
                                    handleParamChange={this.handleParamChange}/>
                </div>
              </div>
            ))}
          </div>
          <div className='param-subgroup'>
            <h3 className='label'>Key Scaling</h3>
            {[params[8], params[7], params[11]].map(param => (
              <div className='vertical-slider-with-label'>
                <div className='label'>{param.shortName}</div>
                <div key={'vert' + param.idx} className='vertical-slider'>
                  <PortasoundSlider {...param}
                                    handleParamChange={this.handleParamChange}/>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className='param-group'>
          <h2 className='param-group-label label'>Global</h2>
          <div className='param-subgroup'>
            <h3 className='label'>&nbsp;</h3>
            {[params[0], params[29]].map(param => (
              <div className='vertical-slider-with-label'>
                <div className='label'>{param.shortName}</div>
                <div key={'vert' + param.idx} className='vertical-slider'>
                  <PortasoundSlider {...param}
                                    handleParamChange={this.handleParamChange}/>
                </div>
              </div>
            ))}
            <div className='button-column'>
              <PortasoundButton {...params[35]} handleParamChange={this.handleParamChange}/>
              <PortasoundButton {...params[36]} handleParamChange={this.handleParamChange}/>
            </div>
          </div>
          <div className='param-subgroup'>
            {[params[30], params[31], params[34]].map(param => (
              <div className='vertical-slider-with-label'>
                <div className='label'>{param.shortName}</div>
                <div key={'vert' + param.idx} className='vertical-slider'>
                  <PortasoundSlider {...param}
                                    handleParamChange={this.handleParamChange}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
}

export default App;
