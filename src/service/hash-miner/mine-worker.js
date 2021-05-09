const { generateHash } = require('./pow-algorithm');
const { parentPort } = require("worker_threads");

parentPort.on('message', async ({ account, difficulty, lastMineTx }) => {
  parentPort.postMessage(generateHash({ account, difficulty, lastMineTx }));
});

