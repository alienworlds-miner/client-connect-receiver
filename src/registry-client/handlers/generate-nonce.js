const { OutcomingEvent } = require('../event');
const { nonceService } = require('./../../service')

module.exports = (payload, send) => {
  nonceService.generate(payload).then((result) => {
    send(OutcomingEvent.NONCE, result)
  })
}
