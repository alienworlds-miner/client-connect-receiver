const { createHash } = require('crypto');

function generateHash({ account, difficulty, lastMineTx }) {
  const log = msg => console.log(`${new Date().toISOString()} [${account}]: ${msg}`);
  let accountArray = nameToArray(account).slice(0, 8);
  let lastMineTxArray = fromHexString(lastMineTx).slice(0, 8);

  let last;
  let randArray;
  let good = false;
  let iteration = 1;
  let hexPrefix = '000000';
  const isWam = account.substr(-4) === '.wam'

  log(`Calculating PoW with: difficulty = ${difficulty} lastMineTx = ${lastMineTx}`);

  if (isWam) {
    log(`Using WAM account`);
    hexPrefix = '0000';
  }

  let hexDigest;
  let execTime = process.hrtime();

  do {
    ({good, randArray, last, hexDigest} = generationStep({ baseArray: [...accountArray, ...lastMineTxArray], difficulty, hexPrefix}));
    iteration++;
    if (!good) {
      hexDigest = null;
      if (iteration % 1000000 === 0) {
        log(`Still mining - tried ${iteration} iterations`);
      }
    }
  } while (!good);
  execTime = process.hrtime(execTime);
  const randString = toHex(randArray);

  log(`Found hash in ${iteration} iterations with ${account} ${randString}, last = ${last}, hex_digest ${hexDigest} taking ${execTime[0]}.${execTime[1]}s`)

  return { account, randString, hexDigest };
}

function generationStep({ baseArray, difficulty, hexPrefix }) {
  const randArray = getRand();
  const hash = createHash('sha256');
  hash.update(new Uint8Array([...baseArray, ...randArray]).slice(0, 24));
  const hexDigest = hash.digest('hex');
  let last, good = false;
  if (hexDigest.startsWith(hexPrefix)) {
    last = parseInt(hexDigest.substr(hexPrefix.length, 1), 16);
    good = last <= difficulty;
  }
  return { good, randArray, last, hexDigest }
}

function getRand() {
  const arr = new Uint8Array(8);
  for (let i = 0; i < 8; i++) {
    arr[i] = Math.floor(Math.random() * 255);
  }
  return arr;
}

function toHex(buffer) {
  return [...new Uint8Array(buffer)]
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}


function nameToArray(s) {
  if (typeof s !== 'string') {
    throw new Error('Expected string containing name');
  }
  const regex = new RegExp(/^[.1-5a-z]{1,12}[.1-5a-j]?$/);
  if (!regex.test(s)) {
    throw new Error('Name should be less than 13 characters, or less than 14 if last character is between 1-5 or a-j, and only contain the following symbols .12345abcdefghijklmnopqrstuvwxyz'); // eslint-disable-line
  }
  const charToSymbol = function (c) {
    if (c >= 'a'.charCodeAt(0) && c <= 'z'.charCodeAt(0)) {
      return (c - 'a'.charCodeAt(0)) + 6;
    }
    if (c >= '1'.charCodeAt(0) && c <= '5'.charCodeAt(0)) {
      return (c - '1'.charCodeAt(0)) + 1;
    }
    return 0;
  };
  const a = new Uint8Array(8);
  let bit = 63;
  for (let i = 0; i < s.length; ++i) {
    let c = charToSymbol(s.charCodeAt(i));
    if (bit < 5) {
      c = c << 1;
    }
    for (let j = 4; j >= 0; --j) {
      if (bit >= 0) {
        a[Math.floor(bit / 8)] |= ((c >> j) & 1) << (bit % 8);
        --bit;
      }
    }
  }
  return a;
}

function fromHexString(hexString) {
  return new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
}

module.exports = {
  generateHash,
  generationStep,
  fromHexString,
  nameToArray,
  getRand,
  toHex,
}
