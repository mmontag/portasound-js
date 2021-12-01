import React from 'react';
import './App.css';
import { sendSysexDsr2000, sendSysexPss480, paramsDsr2000, paramsPss480 } from './portasound';
import MIDIPlayer from 'midiplayer';
import MIDIFile from 'midifile';
import { PSS480 } from './PSS480';
import { DSR2000 } from './DSR2000';
import { TestBench } from './TestBench';

const MIDI_OUTPUT_ID_KEY = 'midiOutputId';
const PRESET_KEY = 'presetId';
const BANKS = [];
for (let i = 0; i < 3; i++) {
  BANKS[i] = [];
  for (let j = 0; j < 10; j++) {
    BANKS[i][j] = {
      name: `Preset ${j}`,
      values: [],
      isDirty: false,
      // TODO: originalValues restore point
    };
  }
}
const LAYOUT_KEY = 'parameterLayout';
const LAYOUTS = [
  {
    name: 'Yamaha PSS-480/580/680/780',
    params: paramsPss480,
    componentClass: PSS480,
    sendSysex: sendSysexPss480,
    presets: BANKS[0],
  },
  {
    name: 'Yamaha DSR-2000',
    params: paramsDsr2000,
    componentClass: DSR2000,
    sendSysex: sendSysexDsr2000,
    presets: BANKS[1],
  },
  {
    name: 'DSR-2000 Test Bench',
    params: paramsDsr2000,
    componentClass: TestBench,
    sendSysex: sendSysexDsr2000,
    presets: BANKS[2],
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
      // sysexParams: paramsPss480,
      layoutId: 0,
      presetId: 0,
    };
  }

  componentDidMount() {
    navigator.requestMIDIAccess({ sysex: true }).then(this.onMIDISuccess);

    const storedLayoutId = localStorage.getItem(LAYOUT_KEY);
    if (storedLayoutId != null) {
      this.updateLayout(parseInt(storedLayoutId));
    } else {
      this.updateLayout(0);
    }
    const storedPresetId = localStorage.getItem(PRESET_KEY);
    if (storedPresetId != null) {
      this.updatePreset(parseInt(storedPresetId));
    }
  }

  loadPresets = (layoutId) => {
    // let dirty = false;
    const layout = LAYOUTS[layoutId];
    const presets = layout.presets;
    for (let i = 0; i < presets.length; i++) {
      const storedPreset = localStorage.getItem(`bank_${layoutId}_preset_${i}`);
      if (storedPreset != null) {
        const preset = JSON.parse(storedPreset);
        if (preset.values.length !== layout.params.length) {
          console.log('Preset param length not equal to param definition length. Skipping preset load.');
        } else {
          presets[i] = { ...preset, isDirty: false };
          // dirty = true;
        }
      }
    }
    // if (dirty) this.forceUpdate();
  }

  handleSavePreset = (e) => {
    const { layoutId, presetId } = this.state;
    const preset = LAYOUTS[layoutId].presets[presetId];

    localStorage.setItem(`bank_${layoutId}_preset_${presetId}`, JSON.stringify({
      name: preset.name,
      values: preset.values,
    }));

    preset.isDirty = false;
    this.forceUpdate();
  }

  handlePresetChange = (e) => {
    const presetId = parseInt(e.target.value);
    this.updatePreset(this.state.layoutId, presetId);
  }

  handlePresetNameChange = (e) => {
    const { layoutId, presetId } = this.state;
    LAYOUTS[layoutId].presets[presetId].name = e.target.value;

    // TODO: Nested state hack
    this.forceUpdate();
  }

  updatePreset = (layoutId, presetId) => {
    // updates the preset (in memory/React state)
    const params = LAYOUTS[layoutId].params;
    if (LAYOUTS[layoutId].presets[presetId].values.length !== params.length) {
      // if preset is empty, copy default param values into bank preset.
      LAYOUTS[layoutId].presets[presetId].values = params.map(p => p.value);
    }
    this.setState({
      presetId: presetId,
    });
  }

  handleLayoutChange = (e) => {
    let layoutId = parseInt(e.target.value);
    this.updateLayout(layoutId);
    localStorage.setItem(LAYOUT_KEY, layoutId);
  }

  updateLayout = (layoutId) => {
    this.loadPresets(layoutId);
    this.updatePreset(layoutId, 0);
    this.setState({
      layoutId: layoutId,
    });
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
    if (storedMidiOutputId != null && midiAccess.outputs.get(storedMidiOutputId)) {
      this.updateMidiOutput(storedMidiOutputId);
    } else if (outputs.length > 0) {
      this.updateMidiOutput(outputs[0].id);
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
    const { layoutId, presetId } = this.state;
    const preset = LAYOUTS[layoutId].presets[presetId];
    const sendSysex = LAYOUTS[layoutId].sendSysex;
    const params = LAYOUTS[layoutId].params;
    const param = params[idx];

    value = Math.min(Math.max(value, 0), param.range - 1);

    // Hidden state
    if (value !== preset.values[idx]) {
      preset.values[idx] = value;
      preset.isDirty = true;

      // TODO: Hack for nested state
      this.forceUpdate();

      sendSysex(this.getMidiOutput(), preset.values);
    }
  }

  getMidiOutput = () => {
    return this.midiAccess.outputs.get(this.state.midiOutputId);
  }

  render() {
    const { midiOutputs, midiOutputId, layoutId, presetId } = this.state;
    const layout = LAYOUTS[layoutId];
    const params = layout.params;
    const presets = layout.presets;
    const values = presets[presetId].values;
    const LayoutComponent = layout.componentClass;

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
          <select id="layout" value={layoutId} onChange={this.handleLayoutChange}>
            {LAYOUTS.map((layout, idx) => (
              <option key={idx} value={idx}>{layout.name}</option>
            ))}
          </select>
        </p>
        <p>
          Preset Memory:{' '}
          <select id="preset" value={presetId} onChange={this.handlePresetChange}>
            {presets.map((preset, idx) => (
              <option key={idx} value={idx}>{idx}: {preset.name} {preset.isDirty && '*'}</option>
            ))}
          </select>
          <input type="text" onChange={this.handlePresetNameChange} value={presets[presetId].name}/>
          <button className="box-button" onClick={this.handleSavePreset}>Save</button>
        </p>
        {
          values.length === params.length &&
          <LayoutComponent params={params} values={values} handleParamChange={this.handleParamChange}
                           toggleDemo={this.toggleDemo}/>
        }
      </div>
    )
  }
}

export default App;
