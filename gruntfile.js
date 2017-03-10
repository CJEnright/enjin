module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    connect: {
      server: {
        options: {
          port: 8100
        }
      }
    },
    watch: {
      all: {
        options: {
          livereload: true
        },
        files: ['src/**/*'],
        tasks: ['browserify:vendor'],
      }
    },
    open: {
      all: {
        path: 'http://localhost:<%= connect.server.options.port%>'
      }
    },
    browserify: {
      vendor: {
        src: [ 'src/core.js' ],
        dest: 'public/enjin.js',
        options: {}
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-browserify')

  grunt.registerTask('serve', [
    'open',
    'connect:server',
    'watch'
  ]);
};