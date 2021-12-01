import { debounce } from 'lodash-es';

const paramsPss480 = [
  {
    name: 'Bank Number',
    shortName: 'Bank',
    range: 5,
    sysexByte: 0,
    sysexBit: 0,
    value: 0,
  },
  {
    name: 'Fine Detune (Modulator)',
    shortName: 'Detune',
    range: 15,
    sysexByte: 1,
    sysexBit: 4,
    value: 7,
    valueFn: fineDetuneFn,
  },
  {
    name: 'Fine Detune (Carrier)',
    shortName: 'Detune',
    range: 15,
    sysexByte: 2,
    sysexBit: 4,
    value: 7,
    valueFn: fineDetuneFn,
  },
  {
    name: 'Multiplier (Modulator)',
    shortName: 'Freq',
    range: 16,
    sysexByte: 1,
    sysexBit: 0,
    value: 3,
  },
  {
    name: 'Multiplier (Carrier)',
    shortName: 'Freq',
    range: 16,
    sysexByte: 2,
    sysexBit: 0,
    value: 1,
  },
  {
    name: 'Total Level (Modulator)',
    shortName: 'Level',
    range: 100,
    sysexByte: 3,
    sysexBit: 0,
    value: 58,
    valueFn: levelFn,
  },
  {
    name: 'Total Level (Carrier)',
    shortName: 'Level',
    range: 100,
    sysexByte: 4,
    sysexBit: 0,
    value: 88,
    valueFn: levelFn,
  },
  { // TODO: map to linear scaling; 0 is middle value
    name: 'Level Key Scaling (Hi) (Modulator)',
    shortName: 'Level (Hi)',
    range: 16,
    sysexByte: 5,
    sysexBit: 4,
    value: 0,
  },
  {
    name: 'Level Key Scaling (Lo) (Modulator)',
    shortName: 'Level (Lo)',
    range: 16,
    sysexByte: 5,
    sysexBit: 0,
    value: 0,
  },
  {
    name: 'Level Key Scaling (Hi) (Carrier)',
    shortName: 'Level (Hi)',
    range: 16,
    sysexByte: 6,
    sysexBit: 4,
    value: 0,
  },
  {
    name: 'Level Key Scaling (Lo) (Carrier)',
    shortName: 'Level (Lo)',
    range: 16,
    sysexByte: 6,
    sysexBit: 0,
    value: 0,
  },
  {
    name: 'Rate Key Scaling (Modulator)',
    shortName: 'Rate',
    range: 4,
    sysexByte: 7,
    sysexBit: 6,
    value: 0,
  },
  {
    name: 'Rate Key Scaling (Carrier)',
    shortName: 'Rate',
    range: 4,
    sysexByte: 8,
    sysexBit: 6,
    value: 0,
  },
  {
    name: 'Attack Rate (Modulator)',
    shortName: 'Attack',
    range: 64,
    sysexByte: 7,
    sysexBit: 0,
    value: 5,
    valueFn: invert64Fn,
  },
  {
    name: 'Attack Rate (Carrier)',
    shortName: 'Attack',
    range: 64,
    sysexByte: 8,
    sysexBit: 0,
    value: 5,
    valueFn: invert64Fn,
  },
  {
    name: 'Amplitude Modulation Enable (Modulator)',
    shortName: 'Amp. Mod. Enable',
    range: 2,
    sysexByte: 9,
    sysexBit: 7,
    value: 0,
  },
  {
    name: 'Amplitude Modulation Enable (Carrier)',
    shortName: 'Amp. Mod. Enable',
    range: 2,
    sysexByte: 10,
    sysexBit: 7,
    value: 0,
  },
  {
    name: 'Coarse Detune Enable (Modulator)',
    shortName: 'Coarse Det. Enable',
    range: 2,
    sysexByte: 9,
    sysexBit: 6,
    value: 0,
  },
  {
    name: 'Coarse Detune Enable (Carrier)',
    shortName: 'Coarse Det. Enable',
    range: 2,
    sysexByte: 10,
    sysexBit: 6,
    value: 0,
  },
  {
    name: 'Decay 1 Rate (Modulator)',
    shortName: 'Decay 1',
    range: 64,
    sysexByte: 9,
    sysexBit: 0,
    value: 40,
    valueFn: invert64Fn,
  },
  {
    name: 'Decay 1 Rate (Carrier)',
    shortName: 'Decay 1',
    range: 64,
    sysexByte: 10,
    sysexBit: 0,
    value: 48,
    valueFn: invert64Fn,
  },
  {
    name: 'Sine Table Form (Modulator)',
    shortName: 'Waveform',
    range: 4,
    sysexByte: 11,
    sysexBit: 6,
    value: 0,
  },
  {
    name: 'Sine Table Form (Carrier)',
    shortName: 'Waveform',
    range: 4,
    sysexByte: 12,
    sysexBit: 6,
    value: 0,
  },
  {
    name: 'Decay 2 Rate (Modulator)',
    shortName: 'Decay 2',
    range: 64,
    sysexByte: 11,
    sysexBit: 0,
    value: 59,
    valueFn: invert64Fn,
  },
  {
    name: 'Decay 2 Rate (Carrier)',
    shortName: 'Decay 2',
    range: 64,
    sysexByte: 12,
    sysexBit: 0,
    value: 59,
    valueFn: invert64Fn,
  },

  {
    name: 'Decay 1 Level (Modulator)',
    shortName: 'Sustain',
    range: 16,
    sysexByte: 13,
    sysexBit: 4,
    value: 3,
    valueFn: invert16Fn,
  },
  {
    name: 'Decay 1 Level (Carrier)',
    shortName: 'Sustain',
    range: 16,
    sysexByte: 14,
    sysexBit: 4,
    value: 3,
    valueFn: invert16Fn,
  },

  {
    name: 'Release Rate (Modulator)',
    shortName: 'Release',
    range: 16,
    sysexByte: 13,
    sysexBit: 0,
    value: 5,
    valueFn: invert16Fn,
  },
  {
    name: 'Release Rate (Carrier)',
    shortName: 'Release',
    range: 16,
    sysexByte: 14,
    sysexBit: 0,
    value: 5,
    valueFn: invert16Fn,
  },
  {
    name: 'Feedback',
    shortName: 'Feedback',
    range: 8,
    sysexByte: 15,
    sysexBit: 3,
    value: 0,
  },
  {
    name: 'Pitch Modulation Sensitivity (Vibrato)',
    shortName: 'Pitch Depth',
    range: 8,
    sysexByte: 16,
    sysexBit: 4,
    value: 4,
  },
  {
    name: 'Amplitude Modulation Sensitivity (Tremolo)',
    shortName: 'Level Depth',
    range: 4,
    sysexByte: 16,
    sysexBit: 0,
    value: 2,
  },
  {
    name: 'Sustain Release Rate (Modulator)',
    shortName: 'Sustain Release',
    range: 16,
    sysexByte: 20,
    sysexBit: 0,
    value: 9,
    valueFn: invert16Fn,
  },
  {
    name: 'Sustain Release Rate (Carrier)',
    shortName: 'Sustain Release',
    range: 16,
    sysexByte: 21,
    sysexBit: 0,
    value: 9,
    valueFn: invert16Fn,
  },
  {
    name: 'Vibrato Delay Time',
    shortName: 'Delay',
    range: 128,
    sysexByte: 22,
    sysexBit: 0,
    value: 63,
  },
  {
    name: 'Vibrato Enable',
    shortName: 'Vibrato',
    range: 2,
    sysexByte: 24,
    sysexBit: 7,
    value: 1,
  },
  {
    name: 'Sustain Enable',
    shortName: 'Sustain',
    range: 2,
    sysexByte: 24,
    sysexBit: 6,
    value: 0,
  },
].map((p, i) => { p.idx = i; return p });

const paramsDsr2000 =[];
const dsrNibbles = [
  0, 1, 7, 0, 7, 1, 5, 3, 0, 1, 1, 9, 2, 0, 1, 8, 0, 4, 1, 15, 9, 11, 1, 15, 5, 15, 0,
  15, 0, 0, 1, 7, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 2, 0, 1, 0, 3, 0, 3, 1, 0, 3, 4, 0,
  0, 10, 0, 0, 4, 0, 5, 0, 4, 0, 4, 8, 1, 8, 3, 8, 1, 8, 1, 0, 15, 1, 14, 12, 12, 0, 0,
  0, 0, 0, 0, 0, 2, 2, 12, 0, 0, 2, 12, 0, 0, 2, 12, 5, 11, 1, 4, 0, 12, 1, 7, 7, 4, 2,
  1, 5, 2, 0, 1, 0, 0, 0, 0, 0, 1, 0, 7, 0, 4, 0, 4, 0, 4, 12, 9, 4, 5, 0, 4, 0, 4, 3,
  7, 1, 7, 7, 7, 4, 6, 0, 5, 4, 0, 7, 7, 0, 2, 0, 12, 0, 1, 15, 4, 0, 7, 0, 0];


let nibs;
// 02
nibs = hexToBytes('01080409000100030001010c020b03020004090f010b050f090f000f0009000908090009000000040006040f0f0203020107000601000200030000070000000200030e00090008000800000f010e0c08000000000000000200000000000000000000030d04060004010a0300020100000603000000000000000502070005000507070406000502070005000508090006060903000202060e 0002 00 00 0000 0007 0000');

// 01
// nibs = hexToBytes('030b0700040003010200010f0108020600000501000f040f0501000f0006000c080600000000000900000605020202020f08000600020201020000040003000400040901080008000b00000f010e0c08000002070001000200000000000000000000030800070000000f0207030205020500000002040003000500050005000508070e07000507070e0704070a0704060005030002010b04 0002 00 01 0000 0007 0000');
for (let i = 0; i < 162; i++) {
  paramsDsr2000.push({
    idx: i,
    name: 'Param ' + i,
    shortName: ((i%2)?'':((i/2)|0)),
    range: 16,
    sysexByte: (i/2)|0,
    sysexBit: ((i+1)%2) * 4,
    value: nibs[i],
  });
}



function fineDetuneFn(val) {
  return ((val - 7 < 0) ? 0b1000 : 0) | Math.abs(val - 7);
}

function levelFn(val) {
  return 99 - val;
}

function invert16Fn(val) {
  return 15 - val;
}

function invert64Fn(val) {
  return 63 - val;
}

function hexToBytes(text) {
  const bytes = [];
  let hex = text.toLowerCase().replace(/[^abcdef0123456789]/gi, '');
  if (hex.length % 2 !== 0) throw new Error('Hex char length must be multiple of 2.');
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(parseInt(hex.substr(i, 2), 16));
  }
  return bytes;
}


function buildSysexDsr2000(params) {
  const header = [
    // Yamaha DSR-2000 voice bulk dump sysex header
    0xF0, 0x43, 0x73, 0x0d, 0x06, 0x50, 0x00, 0x00
  ];
  const length = [ 0x0a, 0x05 ];

  const data = [];
  for (let i = 0; i < params.length; i++) {
    const param = params[i];
    const value = param.valueFn ? param.valueFn(param.value) : param.value;
    data[param.sysexByte] |= (value << param.sysexBit);
  }
  console.log('data:', bytesToHex(data));

  const voiceNum = 0x01;
  const splitData = data.map(splitByte).flat();
  const innerChecksum = splitByte(checksum(data));
  const outerChecksum = yamahaChecksum([voiceNum, ...splitData, ...innerChecksum]);
  const bytes = [...header, ...length, voiceNum, ...splitData, ...innerChecksum, outerChecksum, 0xf7];
  console.log('Composed DSR-2000 message:', bytesToHex(bytes));
  return bytes;
}

function splitByte(byte) {
  if (byte < 0) byte += 256;
  return [(byte >> 4) & 0x0f, byte & 0x0f];
}

function yamahaChecksum(bytes) {
  // http://www.muzines.co.uk/articles/everything-you-ever-wanted-to-know-about-system-exclusive/5722
  // checksum = ((NOT(sum AND 255)) AND 127)+1
  let checksum = 0;
  for (let i = 0; i < bytes.length; i++) {
    checksum += bytes[i] || 0;
  }
  checksum = (~(checksum & 0xFF) + 1) & 0x7F;
  return checksum;
}

function checksum(bytes) {
  let checksum = 0;
  for (let i = 0; i < bytes.length; i++) {
    checksum += bytes[i] || 0;
  }
  // checksum = (~(checksum & 0xFF) + 1) & 0x7F;
  checksum = ~(checksum & 0xFF);
  return checksum;
}

function buildSysexPss480(params) {
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

function bytesToHex(bytes) {
  if (!Array.isArray(bytes)) bytes = [bytes];
  for (var hex = [], i = 0; i < bytes.length; i++) {
    var current = bytes[i] < 0 ? bytes[i] + 256 : bytes[i];
    hex.push((current >>> 4).toString(16));
    hex.push((current & 0xF).toString(16));
  }
  return hex.join('');
}

function bytesToString(data) {
  return ('[' + data.map(n => ('0' + n.toString(16)).slice(-2)).join(' ') + ']').toUpperCase();
}

function sendSysexPss480(midiOutput, params) {
  // TODO: move bank num out of preset/params
  const bankNum = parseInt(params[0].value);
  const bytes = buildSysexPss480(params);
  console.log('Sending...', bytesToString(bytes));
  midiOutput.send(bytes);
  // Program Change to force refresh (0 to 4)
  midiOutput.send([0xC0, bankNum]);
}
sendSysexPss480 = debounce(sendSysexPss480, 500, { leading: false, trailing: true });

function sendSysexDsr2000(midiOutput, params) {
  const bytes = buildSysexDsr2000(params);
  console.log('Sending...', bytesToString(bytes));
  midiOutput.send(bytes);

  // TODO: fix hardcoded dsr 2000 voice number
  midiOutput.send([0xC0, 0x01]);
}
sendSysexDsr2000 = debounce(sendSysexDsr2000, 500, { leading: false, trailing: true });

export {
  sendSysexPss480,
  sendSysexDsr2000,
  paramsPss480,
  paramsDsr2000,
};
