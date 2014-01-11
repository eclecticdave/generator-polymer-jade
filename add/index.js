/*jshint latedef:false */
var path = require('path');
var util = require('util');
var fs = require('fs');
var yeoman = require('yeoman-generator');

module.exports = Generator;

function Generator() {
  yeoman.generators.Base.apply(this, arguments);

  var dirPath = '../templates';
  this.sourceRoot(path.join(__dirname, dirPath));

  // XXX default and banner to be implemented
  this.argument('attributes', {
    type: Array,
    defaults: [],
    banner: 'field[:type] field[:type]'
  });


  // parse back the attributes provided, build an array of attr
  this.attrs = this.attributes.map(function (attr) {
    var parts = attr.split(':');
    return {
      name: parts[0],
      type: parts[1] || 'string'
    };
  });

}

util.inherits(Generator, yeoman.generators.NamedBase);


Generator.prototype.askFor = function askFor() {

var cb = this.async();
var prompts = [
  {
    type: 'input',
    name: 'localElementSelection',
    message: 'Import local elements? (e.g "a.jade b.jade" or leave blank)',
    default: ""
  },{
    type: 'input',
    name: 'bowerElementSelection',
    message: 'Import installed Bower elements? (e.g "polymer-ajax" or leave blank)',
    default: ""
  }];


  this.prompt(prompts, function (props) {
    // manually deal with the response, get back and store the results.
    // we change a bit this way of doing to automatically do this in the self.prompt() method.
    this.localElementSelection = props.localElementSelection;
    this.bowerElementSelection = props.bowerElementSelection;

    cb();
  }.bind(this));
};

Generator.prototype.importElementsIntoIndex = function importElementsIntoIndex() {
  var importTagLines = '';
  var importLinkLines = '';

  if(this.localElementSelection){
    var imports = this.localElementSelection.split(' '); 
    imports.forEach(function(importItem){
      importItem = importItem.replace('.jade','');
      importTagLines = importTagLines + '    polymer-' + importItem + '\n';
      importItem = '    link(rel=\'import\', href=\'' + importItem + '.html\')';
      importLinkLines = importLinkLines + importItem + '\n';
    }.bind(this));
  }

  if(this.bowerElementSelection){
    var bowerImports = this.bowerElementSelection.split(' '); 
    bowerImports.forEach(function(importItem){
      importTagLines = importTagLines + '    ' + importItem + '\n';
      importItem = '    link(rel=\'import\', href=\'bower_components/' + importItem + '/' + importItem + '.html\')';
      importLinkLines = importLinkLines + importItem + '\n';
    }.bind(this));
  }

  var linkInsertPoint = '    // *** YEOMAN: INSERTION POINT FOR ELEMENT IMPORTS - DO NOT DELETE! ***';
  var tagInsertPoint = '    // *** YEOMAN: INSERTION POINT FOR ELEMENTS - DO NOT DELETE! ***';

  fs.readFile('app/index.jade', 'utf8', function(err, data) {
    if (err) {
      return console.log(err);
    }
    data = data.replace(linkInsertPoint, importLinkLines + linkInsertPoint);
    data = data.replace(tagInsertPoint, importTagLines + tagInsertPoint);

    fs.writeFileSync('app/index.jade', data); 
    console.log('index.jade Updated!');
  }.bind(this));
};

