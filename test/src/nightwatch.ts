module.exports = {
  src_folders: ['dist/tests'],  // Location of your test files
  custom_commands_path: ['dist/commands'],
  webdriver: {
    start_process: true,  // Start ChromeDriver process
    server_path: 'tmp/webdrivers/node_modules/chromedriver/bin/chromedriver',  // Path to ChromeDriver
    port: 9517 // Default port for ChromeDriver
  },
  test_settings: {
    default: {
      globals: {
        waitForConditionTimeout: 10000,
        asyncHookTimeout: 100000
      },
      screenshots: {
        enabled: true,
        path: './reports/screenshots',
        on_failure: true,
        on_error: true
      },
      desiredCapabilities: {
        'browserName': 'chrome',
        'javascriptEnabled': true,
        'acceptSslCerts': true,
        'goog:chromeOptions': {
          args: ['window-size=2560,1440', '--no-sandbox', '--verbose']
        }
      }
    }
  }
};
