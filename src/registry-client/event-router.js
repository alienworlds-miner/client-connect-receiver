const { IncomingEvent } = require('./event');
const getServerKeyHandler = require('./handlers/server-key');
const generateNonceHandler = require('./handlers/generate-nonce');
const loginHandler = require('./handlers/login');

const routes = {
  [IncomingEvent.GET_SERVER_KEY]: getServerKeyHandler,
  [IncomingEvent.GENERATE_NONCE]: generateNonceHandler,
  [IncomingEvent.LOGIN]: loginHandler
}

module.exports = (event, payload, send, ws) => {
  if (routes[event]) {
    routes[event](payload, send, ws);
  }
};
