/**
 * The Page Object representation of the tweet dialog.
 */
var TweetPage = function () {

    var loginAndTweet = $locator('input[type=submit]');
    /**
     * Return the default text from the tweet dialog.
     * @returns {webdriver.promise.Promise<T>}
     */
    // this.defaultText = function () {
    //     driver.getAllWindowHandles().then(function (handles) {
    //         driver.switchTo().window(handles[1]);
    //     });
    //     driver.wait(function () {
    //         return driver.isElementPresent(loginAndTweet);
    //     }, 15000);
    //     driver.wait(function () {
    //         return driver.isElementPresent(loginAndTweet);
    //     }, 15000);
    //     return driver.executeScript('return window.getSelection().toString()');
    // };

    this.defaultText = function () {
            return driver.getAllWindowHandles().then(function (handles) {
                return driver.switchTo().window(handles[1]).then(function(){
                  // driver.executeScript("return navigator.userAgent").then(function(ua){
                  //   if(ua.indexOf("Macintosh") > -1){
                  //     driver.get("http://www.google.com").then(function(){
                  //       driver.executeScript("history.go(-1)");//.then(function(){
                  //       //   driver.wait(function () {
                  //       //       return driver.isElementPresent(loginAndTweet);
                  //       //   }, 15000);
                  //       // });
                  //     });
                  //   }
                  // });
                  driver.wait(function () {
                      return driver.isElementPresent(loginAndTweet);
                  }, 15000);
                  driver.wait(function () {
                      return driver.isElementPresent(loginAndTweet);
                  }, 15000);
            return driver.executeScript("return navigator.userAgent").then(function(ua){
                    if((ua.indexOf("iPhone; CPU iPhone") > -1)||(ua.indexOf("Linux; Android") > -1)){
                          return driver.sleep(10000).then(function(){
                            return driver.executeScript(function (){
                              var userSelection, ta;
                              if (window.getSelection && document.activeElement){
                                if (document.activeElement.nodeName == "TEXTAREA" ||
                                    (document.activeElement.nodeName == "INPUT" &&
                                    document.activeElement.getAttribute("type").toLowerCase() == "text")){
                                  ta = document.activeElement;
                                  userSelection = ta.value.substring(ta.selectionStart, ta.selectionEnd);
                                } else {
                                  userSelection = window.getSelection();
                                }
                              } else {
                                // all browsers, except IE before version 9
                                if (document.getSelection){
                                    userSelection = document.getSelection();
                                }
                                // IE below version 9
                                else if (document.selection){
                                    userSelection = document.selection.createRange();
                                }
                              }
                              return userSelection;
                            });
                          });
                      }else{
                        return driver.sleep(3000).then(function(){
                          return driver.executeScript(function (){
                            var userSelection, ta;
                            if (window.getSelection && document.activeElement){
                              if (document.activeElement.nodeName == "TEXTAREA" ||
                                  (document.activeElement.nodeName == "INPUT" &&
                                  document.activeElement.getAttribute("type").toLowerCase() == "text")){
                                ta = document.activeElement;
                                userSelection = ta.value.substring(ta.selectionStart, ta.selectionEnd);
                              } else {
                                userSelection = window.getSelection();
                              }
                            } else {
                              // all browsers, except IE before version 9
                              if (document.getSelection){
                                  userSelection = document.getSelection();
                              }
                              // IE below version 9
                              else if (document.selection){
                                  userSelection = document.selection.createRange();
                              }
                            }
                            return userSelection;
                          });
                        });
                      }
                    });
              });
                });
  };








};
module.exports = TweetPage;
