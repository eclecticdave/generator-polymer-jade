'use strict';
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to match all subyeoman:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
  // show elapsed time at the end
  require('time-grunt')(grunt);
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // configurable paths
  var yeomanConfig = {
    app: 'app',
    dist: 'dist'
  };

  grunt.initConfig({
    yeoman: yeomanConfig,
    watch: {
      options: {
        nospawn: true,
        livereload: true
      },<% if (cssProcessor === 'stylus') { %>
      stylus: {
        files: '<%%= yeoman.app %>/styles/**/*.styl',
        tasks: ['stylus']
      },<% } else if (cssProcessor === 'sass') { %>
      compass: {
        files: ['<%%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['compass:server']
      },<% } %>
      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
        },
        files: [
          '<%%= yeoman.app %>/*.html',
          '<%%= yeoman.app %>/elements/**/*.html',
          '{.tmp,<%%= yeoman.app %>}/styles/{,*/}*.css',
          '{.tmp,<%%= yeoman.app %>}/scripts/{,*/}*.js',
          '<%%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}'
        ]
      },
      jade: {
        files: '<%%= yeoman.app %>/**/*.jade',
        tasks: ['jade']
      }<% if (testFramework === 'jasmine') { %>,
      test: {
        files: ['<%%= yeoman.app %>/scripts/{,*/}*.js', 'test/spec/**/*.js'],
        tasks: ['test']
      }<% } %>
    }, <% if (cssProcessor === 'stylus') { %>
    stylus: {
      compile: {
        files: [{
          expand: true,
          cwd: '<%%= yeoman.app %>',
          src: ['**/*.styl', '!**/_*'],
          dest: '<%%= yeoman.dist %>',
          ext: '.css'
        }],
        options: {
          compress: false,
          // convert the css url() declaration into nib inline imaging function
          // this converts images smaller than 30kb to data url
          urlfunc: 'url'
        }
      }
    },<% } else if (cssProcessor === 'sass') { %>
    compass: {
      options: {
        sassDir: '<%%= yeoman.app %>/styles',
        cssDir: '<%%= yeoman.dist %>/styles',
        imagesDir: '<%%= yeoman.app %>/images',
        javascriptsDir: '<%%= yeoman.app %>/scripts',
        fontsDir: '<%%= yeoman.app %>/styles/fonts',
        importPath: '<%%= yeoman.app %>/bower_components',
        relativeAssets: true
      },
      dist: {},
      server: {
        options: {
          debugInfo: true
        }
      }
    },<% } %>
    connect: {
      options: {
        port: 9500,
        // change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, yeomanConfig.dist)
            ];
          }
        }
      },
      test: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, '.tmp'),
              mountFolder(connect, 'test'),
              mountFolder(connect, yeomanConfig.app)
            ];
          }
        }
      },
      dist: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, yeomanConfig.dist)
            ];
          }
        }
      }
    },
    open: {
      server: {
        path: 'http://localhost:<%%= connect.options.port %>'
      }
    },
    clean: {
      dist: ['.tmp', '<%%= yeoman.dist %>/*'],
      server: '.tmp'
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        '<%%= yeoman.app %>/scripts/{,*/}*.js',
        '!<%%= yeoman.app %>/scripts/vendor/*',
        'test/spec/{,*/}*.js'
      ]
    }<% if (testFramework === 'mocha') { %>,
    mocha: {
      all: {
        options: {
          run: true,
          urls: ['http://localhost:<%%= connect.options.port %>/index.html']
        }
      }
    }<% } else { %>,
    jasmine: {
      all:{
        src : '.tmp/scripts/combined-scripts.js',
        options: {
          keepRunner: true,
          specs : 'test/spec/**/*.js',
          vendor : [
            '<%%= yeoman.app %>/bower_components/jquery/jquery.js',
            '<%%= yeoman.app %>/bower_components/underscore/underscore.js',
            '<%%= yeoman.app %>/bower_components/backbone/backbone.js'
          ]
        }
      }
    }<% } %>,
    jade: {
      html: {
        files: [{
          expand: true,
          cwd: '<%%= yeoman.app %>',
          src: ['**/*.jade', '!**/_*'],
          dest: '<%%= yeoman.dist %>',
          ext: '.html'
        }],
        options: {
          client: false,
          pretty: true
          //basedir: '<%%= yeoman.app %>/jade',
          /*
          data: function(dest, src) {

            var page = src[0].replace(/app\/jade\/(.*)\/index.jade/, '$1');

            if (page == src[0]) {
              page = 'index';
            }

            return {
              page: page
            };
          }
          */
        }
      }
    },
    useminPrepare: {
      html: '<%%= yeoman.app %>/index.html',
      options: {
        dest: '<%%= yeoman.dist %>'
      }
    },
    usemin: {
      html: ['<%%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        dirs: ['<%%= yeoman.dist %>']
      }
    },
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg}',
          dest: '<%%= yeoman.dist %>/images'
        }]
      }
    },
    cssmin: {
      dist: {
        files: {
          '<%%= yeoman.dist %>/styles/main.css': [
            '.tmp/styles/{,*/}*.css',
            '<%%= yeoman.app %>/styles/{,*/}*.css'
          ]
        }
      }
    },
    htmlmin: {
      dist: {
        options: {
          /*removeCommentsFromCDATA: true,
          // https://github.com/yeoman/grunt-usemin/issues/44
          //collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeAttributeQuotes: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true*/
        },
        files: [{
          expand: true,
          cwd: '<%%= yeoman.app %>',
          src: '*.html',
          dest: '<%%= yeoman.dist %>'
        }]
      }
    },
    vulcanize: {
       default: {
          options: {},
          files: {
            '<%%= yeoman.dist %>/build.html': ['<%%= yeoman.app %>/index.html'],
          }
      }
    },
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%%= yeoman.app %>',
          dest: '<%%= yeoman.dist %>',
          src: [
            '*.{ico,txt}',
            '.htaccess',
            'elements/**',
            'lib-elements/**',
            'images/{,*/}*.{webp,gif}',
            'bower_components/**'
          ]
        }]
      }
    },
    bower: {
      all: {
        rjsConfig: '<%%= yeoman.app %>/scripts/main.js'
      }
    }
  });

  grunt.registerTask('server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'jade',
      <% if (cssProcessor === 'stylus') { %>'stylus',<% } %>
      <% if (cssProcessor === 'sass') { %>'compass:server',<% } %>
      'connect:livereload',
      'copy',
      'open',
      'watch'
    ]);
  });

  grunt.registerTask('test', [
    'clean:server',
    <% if(cssProcessor === 'stylus') { %>'stylus',<% } %>
    <% if(cssProcessor === 'sass') { %>'compass',<% } %>
    <% if(testFramework === 'mocha') { %>
    'connect:test',
    'mocha'<% } else { %>
    'jasmine',
    'watch:test'<% } %>
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'jade',
    <% if (cssProcessor === 'stylus'){ %>'stylus',<% } %>
    <% if (cssProcessor === 'sass'){ %>'compass:dist',<% } %>
    'vulcanize',
    'useminPrepare',
    'imagemin',
    'htmlmin',
    // 'concat',
    'cssmin',
    // 'uglify',
    'copy',
    'usemin'
  ]);

  grunt.registerTask('default', [
    'jshint',
    // 'test'
    'build'
  ]);
};
