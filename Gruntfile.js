/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    builtFolder: 'built',
      jasmine: {
          coverage: {
              src: 'src/gauge.js',
              options: {
                  outfile: 'test/spec_run.html',
                  specs: 'test/gauge.js',
                  keepRunner: true,
                  vendor: 'test/jquery.min.js',
                  styles: ['demo/styles.css', 'dest/gauge.css'],
                  template: require('grunt-template-jasmine-istanbul'),
                  templateOptions: {
                      coverage: 'test/coverage/coverage.json',
                      report: 'test/coverage',
                      thresholds: {
                          lines: 75,
                          statements: 75,
                          branches: 75,
                          functions: 90
                      }
                  }
              }
          }
      },
      watch: {
          default: {
              files: ['test/*.js', 'src/*.js', 'src/*.css'],
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
  grunt.registerTask('test', ['jasmine']);
  grunt.registerTask('run', ['copy', 'uglify', 'test']);
  grunt.registerTask('default', ['watch']);

};
