const SessionStore = require('./session-store');
const LoginService = require('./login-service');
const NonceService = require('./nonce-service');

const sessionStore = new SessionStore();
const nonceService = new NonceService();
const loginService = new LoginService(sessionStore);

module.exports = {
  sessionStore,
  nonceService,
  loginService
}
