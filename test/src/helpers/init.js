"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
function default_1(browser, callback, url, preloadPlugins = true, loadPlugin, hideToolTips = true) {
    browser
        .url(url || 'http://127.0.0.1:8080')
        .pause(5000)
        .switchBrowserTab(0)
        .perform((done) => {
        if (!loadPlugin)
            return done();
        browser
            .pause(5000)
            .execute(function (loadPlugin) {
            localStorage.setItem('test-plugin-name', loadPlugin.name);
            localStorage.setItem('test-plugin-url', loadPlugin.url);
        }, [loadPlugin])
            .refreshPage()
            .perform(done());
    })
        .verifyLoad()
        .enableClipBoard()
        .perform((done) => {
        browser.execute(function () {
            function addStyle(styleString) {
                const style = document.createElement('style');
                style.textContent = styleString;
                document.head.append(style);
            }
            addStyle(`
          .popover {
            display:none !important;
          }
          `);
        }, [], done());
    })
        .perform(() => {
        browser.execute(function () {
            window.logs = [];
            console.browserLog = console.log;
            console.browserError = console.error;
            console.log = function () {
                window.logs.push(JSON.stringify(arguments));
                console.browserLog(...arguments);
            };
            console.error = function () {
                window.logs.push(JSON.stringify(arguments));
                console.browserError(...arguments);
            };
        });
    })
        .perform(() => {
        if (preloadPlugins) {
            initModules(browser, () => {
                browser
                    .pause(4000)
                    .clickLaunchIcon('solidity')
                    .waitForElementVisible('[for="autoCompile"]')
                    .click('[for="autoCompile"]')
                    .verify.elementPresent('[data-id="compilerContainerAutoCompile"]:checked')
                    .perform(() => { callback(); });
            });
        }
        else {
            callback();
        }
    });
}
exports.default = default_1;
function initModules(browser, callback) {
    browser
        .click('[data-id="verticalIconsKindpluginManager"]')
        .scrollAndClick('[data-id="pluginManagerComponentActivateButtonsolidityStaticAnalysis"]')
        .scrollAndClick('[data-id="pluginManagerComponentActivateButtondebugger"]')
        .scrollAndClick('[data-id="verticalIconsKindfilePanel"]')
        .clickLaunchIcon('settings')
        .click('*[data-id="settingsTabGenerateContractMetadataLabel"]')
        .setValue('[data-id="settingsTabGistAccessToken"]', process.env.gist_token)
        .click('[data-id="settingsTabSaveGistToken"]')
        .click('[data-id="settingsTabThemeLabelFlatly"]') // e2e tests were initially developed with Flatly. Some tests are failing with the default one (Dark), because the dark theme put uppercase everywhere.
        .perform(() => { callback(); });
}
//# sourceMappingURL=init.js.map