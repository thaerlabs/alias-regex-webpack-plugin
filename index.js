var fs = require('fs');
var path = require('path');

var resolutionCacheMap = {};

class AliasOverridePlugin {

  /**
   * @param pathRegExp
   * @param pathReplacement
   * @param exts
   * @constructor
   */
  constructor(pathRegExp, pathReplacement, exts) {
    this.pathRegExp = pathRegExp;
    this.pathReplacement = pathReplacement;
    this.exts = exts || ['jsx', 'js'];
  }

  apply(resolver) {
    var pathRegExp = this.pathRegExp;
    var pathReplacement = this.pathReplacement;
    var exts = this.exts;

    resolver.plugin("normal-module-factory", function (nmf) {
      nmf.plugin("before-resolve", function (result, callback) {
        if (!result) return callback();

        // test the request for a path match
        if (pathRegExp.test(result.request)) {
          // if it already has been resolved and cached return it
          if (resolutionCacheMap[result.request]) {
            result.request = resolutionCacheMap[result.request];
            return callback(null, result);
          }

          const newFilePath = result.request.replace(pathRegExp, pathReplacement);
          const fileExists = fs.existsSync(newFilePath);

          // check for the file path after replacement, if exists, return it
          if (fileExists) {
            resolutionCacheMap[result.request] = newFilePath;
            result.request = newFilePath;
            return callback(null, result);
          } else {
            const fileExtension = path.extname(newFilePath);

            // if the module doesn't have an extension, append the extension and check for it
            if (!fileExtension) {
              let foundFile = false;
              exts.forEach(function (extension) {
                const newFilePathWithExt = `${newFilePath}.${extension}`;
                if (!foundFile && fs.existsSync(newFilePathWithExt)) {
                  foundFile = true;
                  resolutionCacheMap[result.request] = newFilePathWithExt;
                  result.request = newFilePathWithExt;
                  return callback(null, result);
                }
              });
              if (!foundFile) {
                return callback(null, result);
              }
            } else {
              return callback(null, result);
            }
          }

        } else {
          return callback(null, result);
        }
      });
    });
  }
}

module.exports = AliasOverridePlugin;
