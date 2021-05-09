const axios = require('axios');
const puppeteer = require('puppeteer');

class LoginService {
  sessionStore = null;
  accountsInfo = {};

  constructor(sessionStore) {
    this.sessionStore = sessionStore;
  }

  async login(accountName) {
    try {
      const userInfo = await this.fetchAccountKeys(accountName);
      if (userInfo.accountName !== accountName) {
        throw new Error(`Requested account does not with the authorized one. Expected: ${accountName}, actual: ${userInfo.accountName}`);
      }
      this.accountsInfo[accountName] = userInfo;
      return this.accountsInfo[accountName];
    } catch (err) {
      console.warn(`[${accountName}] Login required, reason: ${err.message}`);
      return await this.loginViaBrowser(accountName);
    }
  }

  async loginViaBrowser(accountName) {
    const browser = await puppeteer.launch({ headless: false })
    const loginCheckingPage = await browser.newPage();
    const page = await browser.newPage();
    await loginCheckingPage.goto('https://all-access.wax.io')
    await page.goto('https://all-access.wax.io');
    await loginCheckingPage.evaluate((accountName) => {
      document.querySelector('title').text = accountName;
    }, accountName)
    const sessionToken = await loginCheckingPage.evaluate(async () => {
      return await new Promise(resolve => {
        const checkInterval = setInterval(async () => {
          try {
            let response = await (await fetch('https://all-access.wax.io/api/session')).json();
            resolve(response.token);
            clearInterval(checkInterval);
          } catch (ignore) {}
        }, 1500);
      })
    });
    await browser.close();
    this.sessionStore.store(accountName, sessionToken);
    return this.login(accountName);
  }

  async fetchAccountKeys(accountName) {
    let sessionToken = this.sessionStore.retrieve(accountName);
    if (!sessionToken) {
      throw new Error('No session_token in storage for ' + accountName);
    }
    const { data } = await axios.get(`https://public-wax-on.wax.io/wam/users`, {
      headers: {
        'x-access-token': sessionToken
      }
    });
    return { ...data, sessionToken };
  }
}

module.exports = LoginService;
