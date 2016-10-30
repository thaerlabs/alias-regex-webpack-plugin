'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fs = require('fs');
var path = require('path');

var resolutionCacheMap = {};

var AliasOverridePlugin = function () {

  /**
   * @param pathRegExp
   * @param pathReplacement
   * @param exts
   * @constructor
   */
  function AliasOverridePlugin(pathRegExp, pathReplacement, exts) {
    _classCallCheck(this, AliasOverridePlugin);

    this.pathRegExp = pathRegExp;
    this.pathReplacement = pathReplacement;
    this.exts = exts || ['jsx', 'js'];
  }

  _createClass(AliasOverridePlugin, [{
    key: 'apply',
    value: function apply(resolver) {
      var pathRegExp = this.pathRegExp;
      var pathReplacement = this.pathReplacement;
      var exts = this.exts;

      resolver.plugin("normal-module-factory", function (nmf) {
        nmf.plugin("before-resolve", function (result, callback) {
          if (!result) return callback();

          // test the request for a path match
          if (pathRegExp.test(result.request)) {
            var _ret = function () {
              // if it already has been resolved and cached return it
              if (resolutionCacheMap[result.request]) {
                result.request = resolutionCacheMap[result.request];
                return {
                  v: callback(null, result)
                };
              }

              var newFilePath = result.request.replace(pathRegExp, pathReplacement);
              var fileExists = fs.existsSync(newFilePath);

              // check for the file path after replacement, if exists, return it
              if (fileExists) {
                resolutionCacheMap[result.request] = newFilePath;
                result.request = newFilePath;
                return {
                  v: callback(null, result)
                };
              } else {
                var fileExtension = path.extname(newFilePath);

                // if the module doesn't have an extension, append the extension and check for it
                if (!fileExtension) {
                  var _ret2 = function () {
                    var foundFile = false;
                    exts.forEach(function (extension) {
                      var newFilePathWithExt = newFilePath + '.' + extension;
                      if (!foundFile && fs.existsSync(newFilePathWithExt)) {
                        foundFile = true;
                        resolutionCacheMap[result.request] = newFilePathWithExt;
                        result.request = newFilePathWithExt;
                        return callback(null, result);
                      }
                    });
                    if (!foundFile) {
                      return {
                        v: {
                          v: callback(null, result)
                        }
                      };
                    }
                  }();

                  if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
                } else {
                  return {
                    v: callback(null, result)
                  };
                }
              }
            }();

            if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
          } else {
            return callback(null, result);
          }
        });
      });
    }
  }]);

  return AliasOverridePlugin;
}();

module.exports = AliasOverridePlugin;