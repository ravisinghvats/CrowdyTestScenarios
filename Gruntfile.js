
module.exports = function(grunt) {
grunt.initConfig({
  pkg: grunt.file.readJSON('package.json'),
  protractor_webdriver: {
    update: {
      options: {
        command: 'webdriver-manager update',
      }
    },
    start: {
      options: {
        command: 'webdriver-manager start',
      }
    }
  },
  protractor: {
    options: {
              keepAlive: true,
          },
    firefox: {   // Grunt requires at least one target to run so you can simply put 'all: {}' here too.
      options: {
        configFile: "conf.js", // Target-specific config file
        args: {
          browser: 'firefox',
        //  seleniumAddress: 'http://172.16.18.77:4444/wd/hub',
        //  seleniumAddress: 'http://172.16.18.71:4444/wd/hub',
          seleniumAddress: 'http://172.16.28.82:4444/wd/hub',
          //seleniumAddress: 'http://192.168.0.3:4444/wd/hub',
        //seleniumAddress: 'http://localhost:4444/wd/hub',
        } // Target-specific arguments - https://github.com/teerapap/grunt-protractor-runner
      }
    },
    safari: {   // Grunt requires at least one target to run so you can simply put 'all: {}' here too.
      options: {
        configFile: "conf.js", // Target-specific config file
        args: {
        browser: 'safari',
        //  seleniumAddress: 'http://172.16.15.155:4444/wd/hub',
          seleniumAddress: 'http://172.16.18.77:4444/wd/hub',
        //  seleniumAddress: 'http://192.168.0.4:4444/wd/hub',
       } // Target-specific arguments - https://github.com/teerapap/grunt-protractor-runner
      }
    },
    chrome: {   // Grunt requires at least one target to run so you can simply put 'all: {}' here too.
      options: {
        configFile: "conf_chrome.js", // Target-specific config file
        args: {
         browser: 'chrome',
         //seleniumAddress: 'http://172.16.18.71:4444/wd/hub',
         seleniumAddress: 'http://172.16.28.82:4444/wd/hub',
         //seleniumAddress: 'http://192.168.0.3:4444/wd/hub',
         //seleniumAddress: 'http://192.168.0.4:4444/wd/hub',
          chromeOptions: {
        args: [
            '--start-maximized',
            '--ignore-certificate-errors'
        ]
    },
        } // Target-specific arguments - https://github.com/teerapap/grunt-protractor-runner
      }
    },
    IE: {   // Grunt requires at least one target to run so you can simply put 'all: {}' here too.
      options: {
        configFile: "conf.js", // Target-specific config file
        args: {
        browser: 'internet explorer',
          //seleniumAddress: 'http://172.16.18.71:4444/wd/hub',
          seleniumAddress: 'http://172.16.28.82:4444/wd/hub',
          //seleniumAddress: 'http://192.168.0.3:4444/wd/hub',
        } // Target-specific arguments - https://github.com/teerapap/grunt-protractor-runner
      }
    },
    android: {   // Grunt requires at least one target to run so you can simply put 'all: {}' here too.
      options: {
        configFile: "conf.js", // Target-specific config file
        args: {
          //seleniumAddress: 'http://172.16.18.71:4723/wd/hub',
          seleniumAddress: 'http://localhost:4723/wd/hub',
          //seleniumAddress: 'http://192.168.0.3:4444/wd/hub',
          capabilities: {
             build: "1",
             browserName: 'Chrome',
             'appium-version': '1.4.8',
             platformName: 'Android',
            deviceName: '5a56620f',
          },
        } // Target-specific arguments - https://github.com/teerapap/grunt-protractor-runner
      }
  },
  iPhone: {   // Grunt requires at least one target to run so you can simply put 'all: {}' here too.
    options: {
      configFile: "conf.js", // Target-specific config file
      args: {
        //seleniumAddress: 'http://172.16.18.71:4723/wd/hub',
      seleniumAddress: 'http://localhost:4728/wd/hub',
        //seleniumAddress: 'http://hub.browserstack.com/wd/hub',
        //seleniumAddress: 'http://192.168.0.3:4444/wd/hub',
        capabilities: {
          browserName: 'safari',
    'appium-version': '1.4.13',
    platformName: 'iOS',
    platformVersion: '8.3',
    deviceName: 'iPhone 6',
        },
      } // Target-specific arguments - https://github.com/teerapap/grunt-protractor-runner
    }
},
},
  concurrent: {
    options: {
    logConcurrentOutput: true
  },
  test_All: {
    tasks: ['firefox', 'chrome','safari','ie','android','iphone']
    //tasks: ['firefox', 'chrome','safari','ie']
  },
  test_mac: {
    tasks: ['firefox','safari']
  },
  mobile: {
    tasks: ['android','iphone']
  },
}
});
  grunt.registerTask('startServer', ['protractor_webdriver']);
  grunt.registerTask('default', ['protractor:firefox']);
  grunt.registerTask('chrome', ['protractor:chrome']);
  grunt.registerTask('firefox', ['protractor:firefox']);
  grunt.registerTask('safari', ['protractor:safari']);
  grunt.registerTask('ie', ['protractor:IE']);
  grunt.registerTask('android', ['protractor:android']);
  grunt.registerTask('iphone', ['protractor:iPhone']);
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.registerTask('all', ['concurrent:test_All']);
  grunt.registerTask('executeMac', ['concurrent:test_mac']);
  grunt.registerTask('mobile', ['concurrent:mobile']);
  grunt.loadNpmTasks('grunt-protractor-webdriver');
  grunt.loadNpmTasks('grunt-protractor-runner');
};
