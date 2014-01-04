/*jshint latedef:false */
var path = require('path');
var util = require('util');
var fs = require('fs');
var yeoman = require('yeoman-generator');

module.exports = Generator;

function Generator() {
  yeoman.generators.NamedBase.apply(this, arguments);

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
    type: 'checkbox',
    name: 'features',
    message: 'What more would you like?',
    choices: [
    { 
      value: 'includeConstructor',
      name: 'Would you like to include constructor=””?',
      checked: false
    },{
      value: 'includeImport',
      name: 'Import to your index.html using HTML imports?',
      checked: false
    }]
  },
  {
    type: 'input',
    name: 'otherElementSelection',
    message: 'Import local elements into this one? (e.g "a.html b.html" or leave blank)',
    default: ""
  },{
    type: 'input',
    name: 'bowerElementSelection',
    message: 'Import installed Bower elements? (e.g "polymer-ajax" or leave blank)',
    default: ""
  }];


  this.prompt(prompts, function (props) {

    var features = props.features;
    function hasFeature(feat) { return features.indexOf(feat) !== -1; }

    // manually deal with the response, get back and store the results.
    // we change a bit this way of doing to automatically do this in the self.prompt() method.
    this.includeConstructor = hasFeature('includeConstructor');
    this.includeImport = hasFeature('includeImport');
    this.otherElementSelection = props.otherElementSelection;
    this.bowerElementSelection = props.bowerElementSelection;

    cb();
  }.bind(this));
};

Generator.prototype.createImportLines = function createImportLines() {
  var elName = this.name;
  this.importTagLines = '';
  this.importLinkLines = '';
  if(this.otherElementSelection){
    var imports = this.otherElementSelection.split(' '); 
    imports.forEach(function(importItem){
      importItem = importItem.replace('.jade','');
      this.importTagLines = this.importTagLines + '    polymer-' + importItem + '\n';
      importItem = 'link(rel=\'import\', href=\'' + importItem + '.html\')';
      this.importLinkLines = this.importLinkLines + importItem + '\n';
    }.bind(this));
  }

  if(this.bowerElementSelection){
    var bowerImports = this.bowerElementSelection.split(' '); 
    bowerImports.forEach(function(importItem){
      this.importTagLines = this.importTagLines + '    ' + importItem + '\n';
      importItem = 'link(rel=\'import\', href=\'../bower_components/' + importItem + '/' + importItem + '.html\')';
      this.importLinkLines = this.importLinkLines + importItem + '\n';
    }.bind(this));
  }
};

Generator.prototype.createElementFiles = function createElementFiles() {
  var destFile = path.join('app/elements',this.name + '.jade');
  this.template('polymer-element' + '.jade', destFile);

  if(this.includeImport){
    var importItem = this.name;

    var importTagLine = '    polymer-' + importItem + '\n';
    importItem = '    link(rel=\'import\', href=\'elements/' + importItem + '.html\')';
    var importLinkLine = importItem + '\n';

    var linkInsertPoint = '    // *** YEOMAN: INSERTION POINT FOR ELEMENT IMPORTS - DO NOT DELETE! ***';
    var tagInsertPoint = '    // *** YEOMAN: INSERTION POINT FOR ELEMENTS - DO NOT DELETE! ***';

    fs.readFile('app/index.jade', 'utf8', function(err, data) {
      if (err) {
        return console.log(err);
      }
      data = data.replace(linkInsertPoint, importLinkLine + linkInsertPoint);
      data = data.replace(tagInsertPoint, importTagLine + tagInsertPoint);
  
      fs.writeFileSync('app/index.jade', data); 
    }.bind(this));
  }
};

