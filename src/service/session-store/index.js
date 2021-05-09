const fs = require('fs');
const path = require('path');

class SessionStore {
  filePath;
  data = {};

  constructor(filePath = path.resolve('.', 'store/sessions.json')) {
    this.filePath = filePath;
    this.readOrCreateStoreFile();
  }

  readOrCreateStoreFile() {
    try {
      fs.accessSync(this.filePath, fs.constants.F_OK)
    } catch (err) {
      console.log('creating session storage: ' + this.filePath);
      fs.writeFileSync(this.filePath, '{}', { flag: 'w+' })
      console.log('session storage was created: ' + this.filePath);
    }

    try {
      this.data = JSON.parse(fs.readFileSync(this.filePath, {flag: 'a+'}).toString());
    } catch (err) {
      console.error('failed to load data from session storage', err);
      throw err;
    }
  }

  store(accountName, sessionToken) {
    this.data[accountName] = sessionToken;
    fs.writeFileSync(this.filePath, JSON.stringify(this.data));
  }


  retrieve(accountName) {
    return this.data[accountName];
  }

  drop(accountName) {
    delete this.data[accountName];
    fs.writeFileSync(this.filePath, JSON.stringify(this.data));
  }
}

module.exports = SessionStore;
