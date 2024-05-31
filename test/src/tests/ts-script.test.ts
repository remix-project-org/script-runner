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
  'Should exec a web3 TS file': function (browser: NightwatchBrowser) {
    browser
        .waitForElementVisible('*[data-id="treeViewLitreeViewItemcontracts"]')
        .click('*[data-id="treeViewLitreeViewItemcontracts"]')
        .waitForElementVisible('*[data-id="treeViewLitreeViewItemcontracts/1_Storage.sol"]')
        .click('*[data-id="treeViewLitreeViewItemcontracts/1_Storage.sol"]')
        .pause(2000)
        .click('[data-id="play-editor"]')
        .waitForElementVisible('*[data-id="treeViewLitreeViewItemscripts"]')
        .click('*[data-id="treeViewLitreeViewItemscripts"]')
        .waitForElementVisible('*[data-id="treeViewLitreeViewItemscripts/deploy_with_web3.ts"]')
        .click('*[data-id="treeViewLitreeViewItemscripts/deploy_with_web3.ts"]')
        .click('[data-id="play-editor"]')
        .waitForElementContainsText('*[data-id="terminalJournal"]', 'deploying Storage', 60000)
        .waitForElementContainsText('*[data-id="terminalJournal"]', '0xd9145CCE52D386f254917e481eB44e9943F39138', 60000)
  },
  'Should exec an ethers TS file': function (browser: NightwatchBrowser) {
    browser
        .waitForElementVisible('*[data-id="treeViewLitreeViewItemscripts/deploy_with_ethers.ts"]')
        .click('*[data-id="treeViewLitreeViewItemscripts/deploy_with_ethers.ts"]')
        .click('[data-id="play-editor"]')
        .waitForElementContainsText('*[data-id="terminalJournal"]', 'deploying Storage', 60000)
        .waitForElementContainsText('*[data-id="terminalJournal"]', '0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8', 60000)
  }
}

