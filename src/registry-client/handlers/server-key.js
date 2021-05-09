const { OutcomingEvent } = require('../event');

module.exports = (payload, send) => {
  send(OutcomingEvent.SERVER_KEY, process.env.SERVER_KEY);
}
