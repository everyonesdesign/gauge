/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    builtFolder: 'built',
      watch: {
          default: {
              files: ['src/*.js', 'src/*.css'],
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
          },
          webcomponent: {
              src: 'src/gauge.html',
              dest: 'dest/gauge.html'
          }
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
      }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task.
  grunt.registerTask('run', ['copy', 'uglify']);
  grunt.registerTask('default', ['watch']);

};
