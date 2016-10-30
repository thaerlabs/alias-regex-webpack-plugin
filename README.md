# alias-regex-webpack-plugin

[Webpack](http://webpack.github.io) plugin that provides a convenience to override modules `require` paths, with an external set of matching files.

## Idea

Webpack has a comprehensive [aliasing](http://webpack.github.io/docs/configuration.html#resolve-alias) mechanism, that can be used to point paths to different locations.  This essentially does the same, with one difference.  When specifying an override for a certain path, if a matching file exists at the override location, it will be resolved instead of the original file.  If no file exists, the original file is resolved.

The plugin was conceived as a solution to `skinning` a complex vanilla application, where any of the original application dependencies, could be directly overriden with an alternative.  

``` js
// SomeView.js  
import 'app/view/SomeView.scss'

// SomeParent.js  
import SomeView from 'app/view/SomeView'
```

Say we want to override the styles and view with different files, we'd simply add a path override config, providing the files to use in their place.

``` js
// webpack.config.js
import AliasRegexOverridePlugin from 'alias-regex-webpack-plugin'

const webpackConfig = {
    plugins: [
        new AliasRegexhOverridePlugin(/^app\/view/, './node_modules/SomeExternalSkin/src')
    ]
}

```

## Installation

Install via [npm](https://www.npmjs.com/package/alias-regex-webpack-plugin):

``` js
npm install --save-dev alias-regex-webpack-plugin
```

## Api

``` js
new AliasRegexhOverridePlugin(pathRegExp, pathReplacement, extensions)
```

* `pathRegExp` _(required)_ `regexp` the `RegExp` to match paths against.  
* `pathReplacement` _(required)_ `string` the path to replace matches with
* `extensions` _(optional)_ `array` of extensions to resolve against _(default: ['jsx', 'js'])_

## Roadmap

* Add test suite

--

[_License (MIT)_](https://github.com/thaerlabs/alias-regex-webpack-plugin/blob/master/docs/LICENSE.md)
