/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    builtFolder: 'built',
      watch: {
          default: {
              files: ['src/*.js', 'src/*.css', 'src/gauge.html'],
              tasks: ['run'],
              options: {
                  spawn: false
              }
          }
      },
      copy: {
          js: {
              src: 'src/gauge.js',
              dest: 'dest/gauge.js'
          },
          css: {
              src: 'src/gauge.css',
              dest: 'dest/gauge.css'
          }/*,
          webcomponent: {
              src: 'src/gauge.html',
              dest: 'dest/gauge.html'
          }*/
      },
      uglify: {
          options: {
              mangle: true
          },
          main: {
              files: {
                  'dest/gauge.min.js': ['src/gauge.js']
              }
          }
      },
      replace: {
          dist: {
              options: {
                  patterns: [
                      {
                          match: /\/\/%gaugeMin%\/\//g,
                          replacement: '<%= grunt.file.read("dest/gauge.min.js") %>'
                      }
                  ]
              },
              files: [
                  {src: ['src/gauge.html'], dest: 'dest/gauge.html'}
              ]
          }
      }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-replace');

  // Default task.
  grunt.registerTask('run', ['copy', 'replace', 'uglify']);
  grunt.registerTask('default', ['watch']);

};
