/*
 * angular-markdown-directive v0.3.1
 * (c) 2013-2014 Brian Ford http://briantford.com
 * License: MIT
 */

'use strict';

angular.module('btford.markdown', ['ngSanitize']).
  provider('markdownConverter', function () {
    var opts = {};
    showdown.setOption('literalMidWordUnderscores', true);
    showdown.setOption('tables', true);
    return {
      config: function (newOpts) {
        opts = newOpts;
      },
      $get: function () {
        return new showdown.Converter(opts);
      }
    };
  }).
  directive('btfMarkdown', ['$sanitize', 'markdownConverter', function ($sanitize, markdownConverter) {
    return {
      restrict: 'AE',
      link: function (scope, element, attrs) {
        if (attrs.btfMarkdown) {
          scope.$watch(attrs.btfMarkdown, function (newVal) {
          	var html = '';
          	if (newVal) {
          		newVal = newVal.replace(/\r\n/g, '\n'); 
            	newVal = newVal.replace(/\r/g, '\n');     
            	newVal = newVal.replace(/\n/g, '  \n'); 
            	html = $sanitize(markdownConverter.makeHtml(newVal));
          	}
            element.html(html);
          });
        } else {
          var text = element.text();
          if (text) {
              text = text.replace(/\r\n/g, '\n'); 
              text = text.replace(/\r/g, '\n'); 
              text = text.replace(/\n/g, '  \n'); 
          }
          var html = $sanitize(markdownConverter.makeHtml(text));
          element.html(html);
        }
      }
    };
  }]);
