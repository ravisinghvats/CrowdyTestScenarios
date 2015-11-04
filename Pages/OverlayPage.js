/**
 * The Page Object Representation of the Overlay page.
 */
var OverlayPage = function() {
  // if(ios_safari){
  //   var overlaySelf = $locator('.cnoverlay-innercontainer');
  //   var overlayContentLink = $locator('.cnoverlay-articletitle');
  //   var overlayTwitterShare = $locator('.icon-twitter.share-twitter');
  // }else{
    var overlaySelf = $locator('.cnoverlay-innercontainer,.overlay-media');
    var overlayContentLink = $locator('a.cnClickSource,.overlayLeftPanel .content-title-link');
    var overlayContentTitle = $locator('.cnoverlay-articletitle,.overlayLeftPanel .content-title-link');
    var overlayTwitterShare = $locator('a.share-twitter,.overlayLeftPanel .btn.share-twitter');
    var loginAndTweet = $locator('input[type=submit]');
//  }


    var TweetAuthorLeft = $locatorxpath("//span[contains(@class,'overlay-author')]");
    //var FirstReTweetAuthorName = $locatorxpath("(//div[@class='overlayRightPanel']//blockquote//span[@class='username']/a)[1]");
    var FirstReTweetAuthorName = $locatorxpath("(//div[@class='overlayRightPanel' or @id='cnoverlay-contentContainer']//blockquote//span[@class='username']/a)[1]");

    var authorCount = $locatorxpath("(//div[@class='overlayRightPanel' or @id='cnoverlay-contentContainer']//blockquote//span[@class='username']/a)[1]");
    //var overlayArticleLinkonRight = $locator('.overlayRightPanel span.link:nth-child(1)>a');
    var overlayArticleLinkonRight = $locatorxpath("//div[@class='overlayRightPanel'or @id='cnoverlay-contentContainer']//span[@class='link'][1]/a");
    /**
     * Wait for the overlay page to be displayed.
     */
    this.isDisplayed = function(){
        return driver.wait(function () {
            return driver.isElementPresent(overlaySelf);
        }, 15000);
    };
    // this.getWindowcount =  function(){
    //
    // }

    var clickShareTweetIE = function(elm){
      return elm.click().then(function(){
          console.log("clicked");
        return driver.sleep(1000).then(function(){
          return driver.wait(function(){
                  return driver.getAllWindowHandles().then(function (handles) {
                       if(handles.length === 2){
                         return driver.switchTo().window(handles[1]).then(function(){
                           return driver.wait(function () {
                                return driver.isElementPresent(loginAndTweet);
                            }, 5000).then(function(ispresent){
                              if(!ispresent){
                                  return driver.close().then(function(){
                                    return driver.switchTo().window(handles[0]).then(function(){
                                      return false;
                                    });
                                  });
                              }else{
                                return true;
                              }
                            });
                         });
                       }else{
                         return driver.sleep(1000).then(function(){
                           return clickShareTweetIE(elm);
                         });
                       }
                  });
                }, 180000);
        });
      });
    };
    /**
     * Select the tweet option.
     */
    this.tweet = function() {
      return $element(overlayTwitterShare).then(function(elm){
        driver.sleep(3000).then(function(){
         driver.executeScript("return navigator.userAgent").then(function(ua){
           console.log("User Agent : " + ua);
           if(ua.indexOf("Macintosh") > -1){
             elm.click().then(function(){
               driver.wait(function(){
                       return driver.getAllWindowHandles().then(function (handles) {
                            return handles.length === 2;
                       });
                     }, 180000);
                      driver.sleep(5000);
             });

           }else if(ua.indexOf("Trident") > -1){
             driver.executeScript("arguments[0].scrollIntoView()", elm).then(function(){
               return clickShareTweetIE(elm);
             });
           }else{
            driver.executeScript("arguments[0].scrollIntoView()", elm).then(function(){
               driver.sleep(1000).then(function(){
                 browser.actions().mouseMove(elm).click().perform().then(function(){
                   driver.wait(function(){
                          return driver.getAllWindowHandles().then(function (handles) {
                              return handles.length === 2;
                          });
                        }, 180000);
               });
           });
         });
           }
          });
        });
    });
  };
  this.windowCount=function(count) {
      return function () {
          return driver.getAllWindowHandles().then(function (handles) {
              return handles.length === count;
          });
      };
  };
    /**
     * Get the topic text.
     * @returns {string|webdriver.promise.Promise<string>|webdriver.promise.Promise<string[]>}
     */
    this.getOverlayTitleText = function() {
        return $element(overlayContentTitle).getAttribute('textContent');
    };

    /*
     * Get Author name from first 5 re-tweets, Compare each with each other
     * If All are same then compare them with the Author name from the left*/

    this.validateNames = function(){
        driver.sleep(3000);
        return $element(FirstReTweetAuthorName).getText().then(function(txt){
                 return $elements($locatorxpath("//a[contains(text(),'"+txt+"')]/..")).then(function(elms){
                       return $elements($locatorxpath("//p[@class='content-twitter-tweet']")).then(function(retweetelms){
                            expect(Number(retweetelms.length)).toBe(Number(elms.length));
                            driver.sleep(2000);
                       });
                 });
        });
    };

    this.getOverlayTitleLink = function(){
      return $element(overlayContentLink).getAttribute('href');
    };
    this.getAllLinks = function(){
    return $elements(overlayArticleLinkonRight).then(function(articleLinks){
        var links = [];
        for(var i = 0; i < 2;i++){//articleLinks.length; i++){
        links.push(articleLinks[i].getAttribute('href'));
        }
      return links;
    });
  };
  this.setJasmineTimeOut = function(timeout){
    jasmine.DEFAULT_TIMEOUT_INTERVAL = timeout;
  };
  var navigateToLink = function(link){
      var currenturl;
    return driver.get(link).then(function(){
      driver.executeScript("return navigator.userAgent").then(function(ua){
        if((ua.indexOf("iPhone; CPU iPhone") > -1)){
            driver.sleep(15000);
          }
        });
      return driver.getCurrentUrl().then(function(currenturl){
        return getlink(currenturl);
      });
    });
return currenturl;
  };

  var getlink = function(link){
    return link;
  };


    this.getRedirectedUrls = function(links){
        var currenturls = [];
        var link;
            for (var i = 0; i < 2; i++){//links.length;i++){
              link = getlink(links[i]);
              //if(i==2){
              //  link = "www.google.com";
              //}
                currenturls.push(navigateToLink(link));
             }
         return currenturls;
       };


        var matchLinks = function(link,tlink){
          return getlink(link).then(function(elink){
              if(elink.substring(0, tlink.length) === tlink){
                    return true;
                  }else{
                    return false;
                  }
            });
        };
      this.validateLinksonLeft = function(titleLink,uris){
          getlink(titleLink).then(function(tlink){
             for(var i=0;i<uris.length;i++){
               getlink(uris[i]).then(function(elink){
                 expect(elink.substring(0, tlink.length)).toBe(tlink);
                 });
               }
           });
      };
};
module.exports = OverlayPage;
