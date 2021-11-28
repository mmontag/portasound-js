import React from 'react';
import './App.css';
import { buildSysexDsr2000, buildSysexPss480, paramsDsr2000, paramsPss480, sendSysex } from './portasound';
import MIDIPlayer from 'midiplayer';
import MIDIFile from 'midifile';
import { PSS480 } from './PSS480';
import { DSR2000 } from './DSR2000';

const MIDI_OUTPUT_ID_KEY = "midiOutputId";
const LAYOUT_KEY = "parameterLayout";
const LAYOUTS = [
  {
    name: 'Yamaha PSS-480/580/680/780',
    params: paramsPss480,
    componentClass: PSS480,
    buildSysex: buildSysexPss480,
  },
  {
    name: 'Yamaha DSR-2000',
    params: paramsDsr2000,
    componentClass: DSR2000,
    buildSysex: buildSysexDsr2000,
  },
];

class App extends React.Component {
  constructor(props) {
    super(props);

    this.midiAccess = null; // WebMIDI object for internal access to MIDI devices
    this.midiPlayer = new MIDIPlayer(); // Init with null player
    this.state = {
      midiOutputs: [], // For UI/display only; midiAccess.outputs converted to array
      midiOutputId: 0, // For UI/display only, also used in localstorage
      sysexParams: paramsPss480,
      layout: 0,
    };
  }

  componentDidMount() {
    navigator.requestMIDIAccess({ sysex: true }).then(this.onMIDISuccess);

    const storedLayoutId = localStorage.getItem(LAYOUT_KEY);
    if (storedLayoutId != null) {
      this.updateLayout(storedLayoutId);
    }
  }

  handleLayoutChange = (e) => {
    this.updateLayout(parseInt(e.target.value));
  }

  updateLayout = (layout) => {
    this.setState({
      layout: layout,
      sysexParams: LAYOUTS[layout].params
    });
    localStorage.setItem(LAYOUT_KEY, layout);
  }

  updateMidiOutput = (midiOutputId) => {
    this.setState({ midiOutputId: midiOutputId });
    this.midiPlayer.stop();
    this.midiPlayer = new MIDIPlayer({ output: this.getMidiOutput() });
  }

  handleMidiOutputChange = (e) => {
    this.updateMidiOutput(e.target.value);
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
    if (storedMidiOutputId != null) {
      this.updateMidiOutput(storedMidiOutputId);
    }
  }

  toggleDemo = () => {
    if (this.demoPlaying) {
      this.midiStop();
    } else {
      this.midiPlay('/midi/polkadot.mid');
    }
    this.demoPlaying = !this.demoPlaying;
  }

  midiPlay = (filename) => {
    fetch(filename, { responseType: 'arraybuffer' })
      .then(response => response.arrayBuffer())
      .then(data => {
        console.log("Loaded %d bytes.", data.byteLength);
        const midiFile = new MIDIFile(data);
        this.midiPlayer.load(midiFile);
        this.midiPlayer.play(function() { console.log("MIDI file playback ended."); });
      });
  }

  midiStop = () => {
    this.midiPlayer.stop();
  };

  handleParamChange = (idx, value) => {
    const params = this.state.sysexParams;
    const param = params[idx];
    const bankNum = parseInt(params[0].value);
    const buildSysex = LAYOUTS[this.state.layout].buildSysex;

    param.value = Math.min(Math.max(value, 0), param.range - 1);
    this.setState({ sysexParams: params });

    sendSysex(this.getMidiOutput(), bankNum, buildSysex(params));
  }

  getMidiOutput = () => {
    return this.midiAccess.outputs.get(this.state.midiOutputId);
  }

  render() {
    const { sysexParams, midiOutputs, midiOutputId, layout } = this.state;
    const params = sysexParams;
    const LayoutComponent = LAYOUTS[layout].componentClass;

    return (
      <div className="App">
        <header>
          <div>
            <img src="/images/portasound-cyan.png" alt="Portasound"/>
            <img src="/images/js.png" alt="JS"/>
          </div>
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
        <p>
          Parameter Layout:{' '}
          <select id="layout" value={layout} onChange={this.handleLayoutChange}>
            {LAYOUTS.map((layout, idx) => (
              <option key={idx} value={idx}>{layout.name}</option>
            ))}
          </select>
        </p>

        <LayoutComponent params={params} handleParamChange={this.handleParamChange} toggleDemo={this.toggleDemo}/>
      </div>
    )
  }
}

export default App;
