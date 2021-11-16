import { debounce } from 'lodash-es';

const paramsPss480 = [
  {
    name: 'Bank Number',
    range: 5,
    sysexByte: 0,
    sysexBit: 0,
    value: 0,
  },
  {
    name: 'Fine Detune (Modulator)',
    range: 15,
    sysexByte: 1,
    sysexBit: 4,
    value: 7,
    valueFn: fineDetuneFn,
  },
  {
    name: 'Fine Detune (Carrier)',
    range: 15,
    sysexByte: 2,
    sysexBit: 4,
    value: 7,
    valueFn: fineDetuneFn,
  },
  {
    name: 'Multiplier (Modulator)',
    range: 16,
    sysexByte: 1,
    sysexBit: 0,
    value: 8,
  },
  {
    name: 'Multiplier (Carrier)',
    range: 16,
    sysexByte: 2,
    sysexBit: 0,
    value: 2,
  },
  {
    name: 'Total Level (Modulator)',
    range: 100,
    sysexByte: 3,
    sysexBit: 0,
    value: 58,
    valueFn: levelFn,
  },
  {
    name: 'Total Level (Carrier)',
    range: 100,
    sysexByte: 4,
    sysexBit: 0,
    value: 88,
    valueFn: levelFn,
  },
  { // TODO: map to linear scaling; 0 is middle value
    name: 'Level Key Scaling (Hi) (Modulator)',
    range: 16,
    sysexByte: 5,
    sysexBit: 4,
    value: 0,
  },
  {
    name: 'Level Key Scaling (Lo) (Modulator)',
    range: 16,
    sysexByte: 5,
    sysexBit: 0,
    value: 0,
  },
  {
    name: 'Level Key Scaling (Hi) (Carrier)',
    range: 16,
    sysexByte: 6,
    sysexBit: 4,
    value: 0,
  },
  {
    name: 'Level Key Scaling (Lo) (Carrier)',
    range: 16,
    sysexByte: 6,
    sysexBit: 0,
    value: 0,
  },
  {
    name: 'Rate Key Scaling (Modulator)',
    range: 4,
    sysexByte: 7,
    sysexBit: 6,
    value: 0,
  },
  {
    name: 'Rate Key Scaling (Carrier)',
    range: 4,
    sysexByte: 8,
    sysexBit: 6,
    value: 0,
  },
  {
    name: 'Attack Rate (Modulator)',
    range: 64,
    sysexByte: 7,
    sysexBit: 0,
    value: 63,
  },
  {
    name: 'Attack Rate (Carrier)',
    range: 64,
    sysexByte: 8,
    sysexBit: 0,
    value: 63,
  },
  {
    name: 'Amplitude Modulation Enable (Modulator)',
    range: 2,
    sysexByte: 9,
    sysexBit: 7,
    value: 0,
  },
  {
    name: 'Amplitude Modulation Enable (Carrier)',
    range: 2,
    sysexByte: 10,
    sysexBit: 7,
    value: 0,
  },
  {
    name: 'Coarse Detune Enable (Modulator)',
    range: 2,
    sysexByte: 9,
    sysexBit: 6,
    value: 0,
  },
  {
    name: 'Coarse Detune Enable (Carrier)',
    range: 2,
    sysexByte: 10,
    sysexBit: 6,
    value: 0,
  },
  {
    name: 'Decay 1 Rate (Modulator)',
    range: 64,
    sysexByte: 9,
    sysexBit: 0,
    value: 31,
  },
  {
    name: 'Decay 1 Rate (Carrier)',
    range: 64,
    sysexByte: 10,
    sysexBit: 0,
    value: 31,
  },
  {
    name: 'Sine Table Form (Modulator)',
    range: 4,
    sysexByte: 11,
    sysexBit: 6,
    value: 0,
  },
  {
    name: 'Sine Table Form (Carrier)',
    range: 4,
    sysexByte: 12,
    sysexBit: 6,
    value: 0,
  },
  {
    name: 'Decay 2 Rate (Modulator)',
    range: 64,
    sysexByte: 11,
    sysexBit: 0,
    value: 4,
  },
  {
    name: 'Decay 2 Rate (Carrier)',
    range: 64,
    sysexByte: 12,
    sysexBit: 0,
    value: 4,
  },

  {
    name: 'Decay 1 Level (Modulator)',
    range: 16,
    sysexByte: 13,
    sysexBit: 4,
    value: 12,
    valueFn: decayLevelFn,
  },
  {
    name: 'Decay 1 Level (Carrier)',
    range: 16,
    sysexByte: 14,
    sysexBit: 4,
    value: 12,
    valueFn: decayLevelFn,
  },

  {
    name: 'Release Rate (Modulator)',
    range: 16,
    sysexByte: 13,
    sysexBit: 0,
    value: 9,
  },
  {
    name: 'Release Rate (Carrier)',
    range: 16,
    sysexByte: 14,
    sysexBit: 0,
    value: 9,
  },
  {
    name: 'Feedback',
    range: 8,
    sysexByte: 15,
    sysexBit: 3,
    value: 0,
  },
  {
    name: 'Pitch Modulation Sensitivity (Vibrato)',
    range: 8,
    sysexByte: 16,
    sysexBit: 4,
    value: 4,
  },
  {
    name: 'Amplitude Modulation Sensitivity (Tremolo)',
    range: 4,
    sysexByte: 16,
    sysexBit: 0,
    value: 2,
  },
  {
    name: 'Sustain Release Rate (Modulator)',
    range: 16,
    sysexByte: 20,
    sysexBit: 0,
    value: 5,
  },
  {
    name: 'Sustain Release Rate (Carrier)',
    range: 16,
    sysexByte: 21,
    sysexBit: 0,
    value: 5,
  },
  {
    name: 'Vibrato Delay Time',
    range: 128,
    sysexByte: 22,
    sysexBit: 0,
    value: 63,
  },
  {
    name: 'Vibrato Enable',
    range: 2,
    sysexByte: 24,
    sysexBit: 7,
    value: 1,
  },
  {
    name: 'Sustain Enable',
    range: 2,
    sysexByte: 24,
    sysexBit: 6,
    value: 0,
  },
];

function fineDetuneFn(val) {
  return ((val - 7 < 0) ? 0b1000 : 0) | Math.abs(val - 7);
}

function levelFn(val) {
  return 99 - val;
}

function decayLevelFn(val) {
  return 15 - val;
}

function buildSysex(params) {
  const bytes = [
    // Yamaha sysex header
    0xF0, 0x43, 0x76, 0x00,
  ];

  let data = [
    // Data contents: 33 bytes
    0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00,
    0x00,
  ];

  for (let i = 0; i < params.length; i++) {
    const param = params[i];
    const value = param.valueFn ? param.valueFn(param.value) : param.value;
    data[param.sysexByte] |= (value << param.sysexBit);
  }

  // Split bytes
  for (let i = 0; i < 33; i++) {
    const byte = data[i] || 0;
    const nibble1 = (byte >> 4) & 0x0F;
    const nibble2 = (byte >> 0) & 0x0F;
    bytes.push(nibble1, nibble2);
  }

  // Checksum on split bytes
  // http://www.muzines.co.uk/articles/everything-you-ever-wanted-to-know-about-system-exclusive/5722
  // checksum = ((NOT(sum AND 255)) AND 127)+1
  let checksum = 0;
  for (let i = 4; i < 70; i++) {
    checksum += bytes[i] || 0;
  }
  checksum = (~(checksum & 0xFF) + 1) & 0x7F;
  bytes.push(checksum);

  // End sysex
  bytes.push(0xF7);

  return bytes;
}

function bytesToString(data) {
  return ('[' + data.map(n => ('0' + n.toString(16)).slice(-2)).join(' ') + ']').toUpperCase();
}

function sendSysex(midiOutput, bankNum, bytes) {
  console.log('Sending...', bytesToString(bytes));
  midiOutput.send(bytes);
  // Change patch to the bank
  midiOutput.send([0xC0, 0x64 + bankNum]);
}

sendSysex = debounce(sendSysex, 500, { leading: false, trailing: true });

export {
  sendSysex,
  buildSysex,
  paramsPss480,
};
