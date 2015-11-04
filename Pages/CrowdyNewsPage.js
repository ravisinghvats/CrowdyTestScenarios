/**
 * The Page Object Representation of the Crowdy News page.
 */
 //var Proxy = require('browsermob-proxy').Proxy,Q = require('q');
var CrowdyNewsPage = function () {

    var topic = function (index) {
        return $locator('div[item=link]:nth-child(' + index + ')');
    };
    //var listItems = $locator('.cnMainMenu.cnSectionsMenu > li');
    var listItems = $locatorxpath('//li');
    var topics = $locator('div[item=link]');
    var tweetCount = $locator('.kudos-count');
  //  var topicDropDown = $locator('.cnMenuTrigger .icon-down-dir,.cnMenuTrigger');
    var topicDropDown = $locator('.icon-down-dir,.menu-select');
    var tweetCountxpath = function(index){
      return $locatorxpath("(//b[@class='kudos-count' and text()='"+index+"']/../..)[1]");
    };
    var overlayTwitterShare = $locator('a.share-twitter,.overlayLeftPanel .btn.share-twitter');
    /**
     * Navigate to the crowdy news page.
     */
    this.get = function () {
        driver.get('http://example.crowdynews.com/crowdynews/usa/politics/');
    };
    /**
     * Select any topic with a specified amount of tweets.
     * @param tweets - Desired number of tweets to be considered for selection.
     */
    this.selectTopicWithTweetsMoreThan = function (tweets) {
        driver.wait(function () {
            return driver.isElementPresent(topic(3))
        }, 30000);

          var $scope = {topicSelected: false};
              return $elements(topics).then(function (topicItem) {
                  for (var i = 0; i < topicItem.length; i++) {
                      $scope.element = topicItem[i];
                      return topicItem[i].findElement(tweetCount).getAttribute('textContent').then(function (text) {
                          if (Number(text) > tweets && $scope.topicSelected == false) {
                              console.log('TEXT : ' + text.trim());
                              return $element(tweetCountxpath(' '+text.trim()+' ')).click().then(function(){
                                    driver.sleep(2000);
                                    $scope.topicSelected = true;
                              });
                              //$scope.element.click();

                          }
                      });
                  }
              }, function () {
                  expect("Topic Selection").toBe("Successful, But found otherwise");
              });
        //  $element($locatorxpath("(//b[@class='kudos-count' and text()=' 65 ']/../..)[1]")).click();

    };


    this.selectTopicItem = function(select_topic){
      driver.wait(function () {
          return driver.isElementPresent(topic(3));
      }, 30000);
      return driver.executeScript("return navigator.userAgent").then(function(ua){
        var platformName;
        if(ua.indexOf("iPhone; CPU iPhone") > -1){
          platformName = "iPhone";
        }else if(ua.indexOf("Linux; Android") > -1){
          var $scope = {topicSelected: false};
            var listItems = $locatorxpath('//option');
            $elements(listItems).then(function (Items) {
                            for (var i = 0; i < Items.length; i++) {
                                Items[i].getAttribute('value').then(function (text) {
                                  console.log('Attribute : ' + text);
                                      if (text === select_topic) {
                                        $element($locatorxpath("//option[@value='"+text+"']")).getText().then(function (txt) {
                                          console.log('Attribute TEXT : ' + txt);
                                          $element(topicDropDown).sendKeys(txt);
                                          $scope.topicSelected = true;
                                        });
                                        return text;
                                        }
                                  });
                              }
                            }).then(function(){
                              driver.wait(function () {
                                  return driver.isElementPresent(topic(3))
                              }, 30000);
                              driver.sleep(5000);
                            });
        }else{
            var listItems = $locatorxpath('//li');
          $element(topicDropDown).click().then(function(){
            driver.sleep(1000).then(function(){
                $elements(listItems).then(function (Items) {
                          for (var i = 0; i < Items.length; i++) {
                              Items[i].findElement($locator('a')).then(function(elm){
                                elm.getAttribute('select-topic').then(function (text) {
                                    if (text === select_topic) {
                                        elm.click();
                                      }
                                });
                              });
                            }
                          }).then(function(){
                            driver.wait(function () {
                                return driver.isElementPresent(topic(3))
                            }, 30000);
                            driver.sleep(3000);
                          });
                      });
                });
        }

      });
  };

    var parseURL=function(harData,topicItem){
      var actualURL = driver.sleep(1000).then(function(){
        var dataArray = harData.split(',');
        var actualURL='';
          for(var dd in dataArray){
              if((dataArray[dd].indexOf('url":"http://statistics') > -1)&&(dataArray[dd].indexOf('topic_'+topicItem) > -1)){
                      if(actualURL.length>0){
                        actualURL = actualURL + '#'+(dataArray[dd].split('url":"')[1].split('&t=')[0]);
                      }else{
                        actualURL = (dataArray[dd].split('url":"')[1].split('&t=')[0]);
                      }
                }
          }
            return actualURL;
      });
      return actualURL;
    };

    this.selectTopicbyText=function(topicItem,expectedUrl,done){
      browser.params.proxy.getHAR(browser.params.proxyData.port, function (err, harData) {
        //console.log('Actual Data : ' + harData);
        parseURL(harData,topicItem).then(function(actualUrl){
          console.log('ActualUrl : ' + actualUrl);
           expect(actualUrl).toBe(expectedUrl);
           done();
         });
      });
    };
};

module.exports = CrowdyNewsPage;
