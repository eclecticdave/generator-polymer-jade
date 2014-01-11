## Yeoman generator for Polymer projects using Jade.

<img src="http://i.imgur.com/J7bp9al.png" width="250px"/>

## Introduction

[Polymer](http://www.polymer-project.org/) is a library of polyfills and sugar which enable the use of Web Components in modern browsers. The project allows developers to build apps using the platform of tomorrow and inform the W3C of places where in-flight specifications can be further improved.

`generator-polymer-jade` provides Polymer scaffolding using [Yeoman](http://yeoman.io) (a scaffolding tool for the web), letting you easily create and customize Polymer (custom) elements via the command-line and import them using HTML Imports. This saves you time writing boilerplate code so you can start writing up the logic to your components straight away.

`generator-polymer-jade` is based on `generator-polymer` generating Jade files instead of HTML files.  It is also possible to use either SCSS or Stylus.


## Features

* Scaffolding for Polymer elements & Custom elements
* Minimal HTML5 Boilerplate
* Wire up HTML imports
* Edit and LiveReload
* Support for SASS Bootstrap 3.0 or Stylus
* Fully integrated Jade (all elements are created as Jade files)
* JSHint linting for projects
* HTML/CSS/JS optimization
* `grunt-vulcanize` support for inlining HTML Imports, scripts and stylesheets.

## Installation

```
# Install the generator
$ npm install -g generator-polymer-jade

# Make a new directory and cd into it
$ mkdir my-new-project && cd $_

# Start using the generator
$ yo polymer-jade

# Preview what was scaffolded
# Edit and the browser live reloads
$ grunt server

# Scaffold your own elements
$ yo polymer-jade:element foo

# Build your project, creating an optimized build
$ grunt build
```

## Getting started

TODO

Available generators:

* `polymer-jade:app` is used to scaffold your initial index.html/workflow/grunt tasks recommended for the project

* `polymer-jade:element` is used to scaffold out new individual Polymer elements. For example: `yo polymer-jade:element carousel`

* `polymer-jade:add` is used to add an existing element to index.jade.  The element can be a local one created with `polymer-jade:element`, or it can be one installed using bower, for example one of the polymer-ui elements. 


## Options

* `--skip-install`

  Skips the automatic execution of `bower` and `npm` after
  scaffolding has finished.

* `--test-framework=[framework]`

  Defaults to `mocha`. Can be switched for
  another supported testing framework like `jasmine`.


## Bower

Once the generator/yo is installed, you'll also have access to Bower, where you can now install individual Polymer elements for use in your project. For example:

```
# Install a Polymer ajax element
$ bower install Polymer/polymer-ajax --save

# Install a tabs element
$ bower install Polymer/polymer-ui-tabs --save

# Install a ratings elements
$ bower install Polymer/polymer-ui-ratings --save
```

If you wish to include one of these elements in a new element you are scaffolding, you can use the final prompt in `yo polymer-jade:element`  and just type in the element name. e.g:

```
[?] Import installed Bower elements? (e.g "polymer-ajax" or leave blank)
polymer-ui-ratings
```
## Contribute

When submitting a bugfix, write a test that exposes the bug and fails before applying your fix. Submit the test alongside the fix.

When submitting a new feature, add tests that cover the feature.


## License

[BSD license](http://opensource.org/licenses/bsd-license.php)
