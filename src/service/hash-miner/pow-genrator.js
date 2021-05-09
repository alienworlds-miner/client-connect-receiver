const { StaticPool } = require("node-worker-threads-pool");
const cpuNum = require('os').cpus().length;
const { resolve } = require('path');


class PoWGenerator {
  threadsNum = cpuNum;
  workersPool;

  constructor({ threadsNum = cpuNum, workerPath = './mine-worker.js' }) {
    this.threadsNum = threadsNum;
    this.workersPool = new StaticPool({
      size: this.threadsNum,
      task: resolve(__dirname, workerPath)
    });
  }

  async generate({ account, difficulty, lastMineTx }) {
    return await this.workersPool.exec({ account, difficulty, lastMineTx });
  }
}

module.exports = PoWGenerator;
