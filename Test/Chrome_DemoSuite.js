/// < reference path="../Utils/angular-protractor.d.ts" />

var CrowdyNewsPage = require('../Pages/CrowdyNewsPage.js');
var OverlayPage = require('../Pages/OverlayPage.js');
var TweetPage = require('../Pages/TweetPage.js');
describe('Crowdy News Topic twitter sharing', function () {

    var crowdyNewsPage;
    var overlayPage;
    var tweetPage;

    /**
     * Set up before test methods.
     * Initiates all the page objects for testing.
     */
    //Initialize the Browser instance before each test.

    beforeEach(function (done) {
        crowdyNewsPage = new CrowdyNewsPage();
        overlayPage = new OverlayPage();
        tweetPage = new TweetPage();
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 6000000;
        driver.manage().timeouts().implicitlyWait(120000);
        browser.getCapabilities().then(function(caps) {
            if((caps.caps_.platform.valueOf().toLowerCase().trim() == new String('android').valueOf()) || (caps.caps_.platform.valueOf().toLowerCase().trim() == new String('ios').valueOf())){
            }else{
              driver.manage().window().maximize();
            }
        });
        browser.params.proxy.startHAR(browser.params.proxyData.port, 'CrowdyNewsTest', done);
    });

    it('should make correct XMLHttpRequest.', function (done) {
      var expectedUrl = 'http://statistics.crowdynews.com/bb?d=crowdynews&s=us-politics-demo&a=topic_elections-tube';
     var topic = 'republicans';
      //var topic = 'democrats';
       crowdyNewsPage.get();
       crowdyNewsPage.selectTopicItem(topic).then(function(){
         crowdyNewsPage.selectTopicbyText(topic,expectedUrl,done);
           });
       });

    it('should display a tweet pop up with the topic as the default text', function () {
        crowdyNewsPage.get();
        crowdyNewsPage.selectTopicWithTweetsMoreThan(40);
        overlayPage.isDisplayed();
        overlayPage.getOverlayTitleText().then(function (text) {
          console.log('Title Text : ' + text);
            overlayPage.tweet();
              tweetPage.defaultText().then(function(titleText){
                console.log('Title Text on popup : ' + titleText);
                driver.executeScript("return navigator.userAgent").then(function(ua){
                  if((ua.indexOf("iPhone; CPU iPhone") > -1)||(ua.indexOf("Linux; Android") > -1)){
                      console.log("Values in Mobile: " + ua);
                      driver.sleep(6000);
                    }else{
                      driver.sleep(2000);
                    }
                      driver.getAllWindowHandles().then(function (handles) {
                            driver.close().then(function(){
                              driver.switchTo().window(handles[0]).then(function(){
                                expect(titleText).toEqual(text);
                              });
                            });
                          });
                });
              });
        });
    });

    it('should have same author name on all the re-tweets displayed on right side.', function () {
        crowdyNewsPage.get();
        crowdyNewsPage.selectTopicWithTweetsMoreThan(40);
        overlayPage.isDisplayed();
        overlayPage.validateNames();
    });

    it('should redirect to same url where the original link on right navigates.', function () {
        var currentUrls;
        var actualValue;
        crowdyNewsPage.get();
        crowdyNewsPage.selectTopicWithTweetsMoreThan(40);
        overlayPage.isDisplayed();
        var titleLink = overlayPage.getOverlayTitleLink();
           overlayPage.getAllLinks().then(function(links){
           currentUrls = overlayPage.getRedirectedUrls(links);
           overlayPage.validateLinksonLeft(titleLink,currentUrls);
          });
        });
});
