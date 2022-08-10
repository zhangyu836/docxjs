'use strict';

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.initConfig({
    babel: {
      options: {
        sourceMap: true,
        compact: false,
        presets: ['@babel/preset-env'],
      },
      dist: {
        files: [
          {
            expand: true,
            src: ['./src/**/*.js'],
            dest: './build/',
          },
        ],
      },
    },
    copy: {
      dist: {
        files: [
          {expand: true, src: ['**'], cwd: './src', dest: './dist'},
          {expand: true, src: ['**'], cwd: './build/src', dest: './dist/es5'},
        ],
      }
    },
    clean: {
      dist: {
        src: ['dist'],
      },
    },
  });
  grunt.registerTask('build', ['babel:dist', 'clean', 'copy']);
};
