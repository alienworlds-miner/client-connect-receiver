const OutcomingEvent = Object.freeze({
  SERVER_KEY: 'SERVER_KEY',
  NONCE: 'NONCE',
  LOGGED_IN: 'LOGGED_IN'
});

const IncomingEvent = Object.freeze({
  GET_SERVER_KEY: 'GET_SERVER_KEY',
  GENERATE_NONCE: 'GENERATE_NONCE',
  LOGIN: 'LOGIN'
});


module.exports = {
  OutcomingEvent,
  IncomingEvent
}
