const PoWGenerator = require('./pow-genrator');

module.exports = {
  PoWGenerator,
  create(maxWorkers) {
    if (maxWorkers) {
      return new PoWGenerator({ threadsNum: maxWorkers});
    }
    return new PoWGenerator({});
  }
}
