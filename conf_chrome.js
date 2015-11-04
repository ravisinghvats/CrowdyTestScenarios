var path = require('path');
var basePath = __dirname;
var ReportCSSPath = '../resultformat/style.css';
var today = new Date(),
	  timeStamp = today.getMonth() + 1 + '-' + today.getDate() + '-' + today.getFullYear() + '-' + today.getHours() + 'H_'+ today.getMinutes() + 'M_' + today.getSeconds() + 'S' ;
var random_Num = Math.floor(Math.random() * (999 - 100 + 1)) + 100;
var Proxy = require('browsermob-proxy').Proxy,Q = require('q');
//var Q = require("q");
exports.config = {
	 params: {
				proxy:'',
	 			proxyData:''
    },
	capabilities: {
		proxy: {
			proxyType: 'manual',
			httpProxy: 'http://172.16.18.77:8888',
			sslProxy: 'http://172.16.18.77:8888'
		},
		//acceptSslCerts: true
	},
    specs: ['Test/Chrome_DemoSuite.js'],
	//	allScriptsTimeout: 60000,

    /**
     * Sauce Execution Set up for mobile automation (android).
     * Since sauce does not support execution on Chrome the default browser is being used.
     */
    sauceUser: process.env.SAUCE_USER,
    sauceKey: process.env.SAUCE_KEY,
    framework: 'jasmine2',
    onPrepare: function () {
        /**
         * Set up for non angular testing.
         */
        browser.ignoreSynchronization = true;
        global.driver = browser.driver;
        driver.manage().timeouts().implicitlyWait(120000);
				browser.getCapabilities().then(function (cap) {
  			browser.browserName = cap.caps_.browserName;
			});

				global.$originalTimeout = function(){
					return jasmine.DEFAULT_TIMEOUT_INTERVAL;
				};
        /**
         * Abstraction for findElement.
         */
        global.$element = function (locator) {
            return driver.findElement(locator);
        };

        /**
         * Abstraction for findElements.
         */
        global.$elements = function (locator) {
            return driver.findElements(locator);
        };

        /**
         * Abstraction for locator strategy.
         */
        global.$locator = function (byCss) {
            return by.css(byCss);
        };

        global.$locatorxpath = function (byXpath) {
            return by.xpath(byXpath);
        };
				var proxy = new Proxy();
				var noVal = Q.ninvoke(proxy, 'start', 8888).then(function (data) {
					console.log('data', data);
					console.log('arguments', arguments);
					browser.params.proxy = proxy;
					browser.params.proxyData = data;
					return data;
				}, function () {
					console.log('start failed');
				});
				/**
         * Report Listener set up.
         */
				var Jasmine2HtmlReporter = require('protractor-jasmine2-html-reporter');
				return browser.getCapabilities().then(function (cap) {
				        browser.browserName = cap.caps_.browserName;
							//var platformName = cap.caps_.platform.valueOf().toLowerCase();
							driver.executeScript("return navigator.userAgent").then(function(ua){
									var platformName;
			            if(ua.indexOf("Macintosh") > -1){
										platformName = "Mac_Machine";
									}else if(ua.indexOf("iPhone; CPU iPhone") > -1){
										platformName = "iPhone";
									}else if(ua.indexOf("Linux; Android") > -1){
										platformName = "Android";
									}else{
										platformName="Windows";
										console.log('platformName for Cheme L ' + platformName);
									}
									jasmine.getEnv().addReporter(new Jasmine2HtmlReporter({
					            savePath: './Reports/'+platformName+'_'+browser.browserName+'/HtmlReports_'+timeStamp+'/',
											screenshotsFolder: 'images',
											takeScreenshots: true,
	   									takeScreenshotsOnlyOnFailures: true,
											ignoreSkippedSpecs: true
					        }));
								});
				    });


    },
		onComplete: function () {
		console.log('onComplete');
		return Q.ninvoke(browser.params.proxy, 'stop', browser.params.proxy);
		}
};
