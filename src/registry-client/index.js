const WebSocket = require('ws');
const router = require('./event-router');

class RegistryClient {
  options = {
    server: process.env.REGISTRY_SERVER || 'ws://localhost:9977'
  }

  ws;
  onClose = noop;

  constructor(options = null) {
    if (options) {
      this.options = { ...this.options, ...options };
    }

    this.ws = new WebSocket(this.options.server);
    this.ws.on('open', () => {
      this.ws.on('message', message => this.handleMessage(message));
    });

    this.ws.on('close', () => {
      this.onClose();
    });
  }

  handleMessage(message) {
    console.log('>', message)
    try {
      message = JSON.parse(message);
      const { event, payload } = message;
      return router(event, payload, (event, payload) => this.sendEvent(event, payload), this.ws);
    } catch (ignore) {
      console.warn('Invalid message', message);
    }
  }

  sendEvent(event, payload) {
    const message = JSON.stringify({ event, payload });
    console.log('<', message);
    this.ws.send(message)
  }
}

function noop() {}

module.exports = RegistryClient;
