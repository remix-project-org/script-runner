'use strict'
import { NightwatchBrowser } from 'nightwatch'
import init from '../helpers/init'

module.exports = {
    before: function (browser: NightwatchBrowser, done: VoidFunction) {
        init(browser, done, 'http://127.0.0.1:8080?plugins=solidity,udapp', false, {
            name: 'scriptRunner',
            url: 'http://127.0.0.1:3000'
        })
    },
    'Should exec a zk-sync TS file': function (browser: NightwatchBrowser) {
        browser
            .addFile('zkSync.js', { content: zkSync })
            .executeScriptInTerminal('remix.execute("zkSync.js")')
            .waitForElementContainsText('*[data-id="terminalJournal"]', 'sepolia.era.zksync.dev', 60000)
    },
}


const zkSync = `
import {Provider} from 'zksync-ethers';

(async () => {
    try {
  
      const zkprovider = new Provider('https://sepolia.era.zksync.dev')
      console.log(zkprovider);
      
    } catch (e) {
      console.log(e.message)
    }
  })()
  
`