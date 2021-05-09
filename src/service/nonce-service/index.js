const { create } = require('../hash-miner');

class NonceService {
  powGenerator;


  constructor() {
    let cpuNum = parseInt(process.env.CPU_THEADS);
    this.powGenerator = create(cpuNum > 0 ? cpuNum : null);
  }

  async generate({ account, difficulty, lastMineTx }) {
    return await this.powGenerator.generate({ account, difficulty, lastMineTx })
  }
}

module.exports = NonceService;
