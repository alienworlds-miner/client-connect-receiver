const { OutcomingEvent } = require('../event');
const { loginService } = require('./../../service')

module.exports = (payload, send) => {
  loginService.login(payload)
    .then(result => {
      send(OutcomingEvent.LOGGED_IN, { accountName: payload, success: true, payload: result })
    })
    .catch(err => {
      send(OutcomingEvent.LOGGED_IN, { accountName: payload, success: false, payload: err })
    })
}
