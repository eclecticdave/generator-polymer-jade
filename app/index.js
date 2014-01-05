var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');

module.exports = Generator;

function Generator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  var dirPath = '../templates';
  this.sourceRoot(path.join(__dirname, dirPath));

  this.testFramework = this.options['test-framework'] || 'mocha';


  this.hookFor(this.testFramework, {
    as: 'app',
    options: {
      options: {
        'skip-install': this.options['skip-install']
      }
    }
  });

  this.options = options;
}

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.askFor = function askFor() {
  var cb = this.async();
  //console.log(this.yeoman);
  console.log('Out of the box I include HTML5 Boilerplate and Polymer.');

  var prompts = [{
      type: 'list',
      name: 'cssProcessor',
      message: 'Would you like sass/compass or stylus as a css preprocessor',
      choices: ['stylus', 'sass', 'neither']
  },
  { type: 'confirm',
    name: 'uiElements',
    message: 'Include Polymer UI Elements?',
    default: true
  }];


  this.prompt(prompts, function (props) {
    // manually deal with the response, get back and store the results.
    // we change a bit this way of doing to automatically do this in the self.prompt() method.
    this.cssProcessor = props.cssProcessor;
    this.uiElements = props.uiElements

    cb();
  }.bind(this));
};

Generator.prototype.git = function git() {
  this.copy('gitignore', '.gitignore');
  this.copy('gitattributes', '.gitattributes');
};

Generator.prototype.bower = function bower() {
  this.copy('bowerrc', '.bowerrc');
  this.template('_bower.json', 'bower.json');
};

Generator.prototype.jshint = function jshint() {
  this.copy('jshintrc', '.jshintrc');
};

Generator.prototype.editorConfig = function editorConfig() {
  this.copy('editorconfig', '.editorconfig');
};

Generator.prototype.gruntfile = function gruntfile() {
  this.template('Gruntfile.js');
};

Generator.prototype.packageJSON = function packageJSON() {
  this.template('_package.json', 'package.json');
};

Generator.prototype.bootstrapImg = function bootstrapImg(){
  if (this.cssProcessor === 'sass') {
    this.copy('glyphicons-halflings.png', 'app/images/glyphicons-halflings.png');
    this.copy('glyphicons-halflings-white.png', 'app/images/glyphicons-halflings-white.png');
  }
}

Generator.prototype.mainStylesheet = function mainStylesheet() {
  var css = 'main.' + 
    (this.cssProcessor === 'sass' ? 'scss' :
     this.cssProcessor === 'stylus' ? 'styl' :
     'css');
  this.template(css, 'app/styles/' + css);
};

Generator.prototype.setupEnv = function setupEnv() {
  this.mkdir('app');
  this.mkdir('app/scripts');
  this.mkdir('app/scripts/vendor/');
  this.mkdir('app/styles');
  this.mkdir('app/images');
  this.mkdir('app/elements');
  this.template('404.html');
  this.template('favicon.ico');
  this.template('robots.txt');
  this.copy('htaccess', 'app/.htaccess');
  this.copy('list.jade', 'app/elements/list.jade');
  this.copy('greeting.jade', 'app/elements/greeting.jade');
  this.template('index.jade', 'app/index.jade');
};


Generator.prototype.install = function () {
  if (this.options['skip-install']) {
    return;
  }

  var done = this.async();
  this.installDependencies({
    skipMessage: this.options['skip-install-message'],
    skipInstall: this.options['skip-install'],
    callback: done
  });
}
