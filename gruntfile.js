'use strict';

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.initConfig({
    copy: {
      dist: {
        files: [
          {expand: true, src: ['**'], cwd: './src', dest: './dist'},
        ],
      }
    },
    clean: {
      dist: {
        src: ['dist'],
      },
    },
  });
  grunt.registerTask('build', ['clean', 'copy']);
};
