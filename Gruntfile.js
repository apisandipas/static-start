(function(){
  'use strict';
})();

var fs = require('fs'),
    path = require('path');

function middleware(connect, opts) {
  return [
    // Terminal request logging
    connect.logger('dev'),

    // Serve static files
    connect.static(opts.base),

    function(req, res, next) {
      // Fall through to 404 if there's a path extension.
      // Our Backbone routes don't have this so it must be a request for a
      // resource that's not there.
      if (path.extname(req.url) !== '') { return next(); }

      // Else render the index.html and let our router handle it.
      res.setHeader('Content-Type', 'text/html');
      res.writeHead(200);
      fs.createReadStream('index.html').pipe(res);
    }
  ];
}

module.exports = function(grunt) {
  
    require('time-grunt')(grunt); 
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        connect: {
          dev: {
            options: {
              port: 8000,
              // keepalive: true,
              middleware: middleware
            }
          }
        },

        sass: {
            files: {
              './assets/css/screen.css' : './src/scss/screen.scss'
            },
            dist: {
                options: {
                    style: 'compressed'
                },
              files: '<%= sass.files %>'
            },
            dev : {
              options: {
                style: 'nested'
              },
              files: '<%= sass.files %>'
            }
        },
        jshint: {
            options: {
              browser: true,
              '-W030': true,
              globals: {
                jQuery: true
              },
            },
            all: ['./assets/js/**/*.js', 'Gruntfile.js']
        },
        watch : {
            options: {
                livereload: true,
            },
            html: {
              files: ['index.html']
            },
            scss: {
              files: ['**/*.scss'],
              tasks: ['sass:dev']
            },
            scripts: {
              files: '<%= jshint.all %>',
              tasks: ['jshint']
            }
        }
    });


    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.registerTask('default', ['connect:dev','watch']);
    grunt.registerTask('build', ['sass:dist']);

  
};