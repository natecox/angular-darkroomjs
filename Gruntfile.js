'use strict';

module.exports = function(grunt) {

  // configure the tasks
  grunt.initConfig({
    watch: {
      scripts: {
        files: 'lib/js/**/*.js',
        tasks: [ 'copy:main', 'uglify:main', 'clean:scripts' ]
      }
    },

    copy: {
      main: {
        cwd: 'lib',
        src: [ '**' ],
        dest: 'build/lib',
        expand: true
      }
    },

    clean: {
      build: {
        src: [ 'build' ]
      },
      lib: {
        src: [ 'build/lib' ]
      },
      scripts: {
        src: [ 'build/lib/js' ]
      }
    },

    uglify: {
      main: {
        options: {
          mangle: false,
          sourceMap: 'dist/js/angular-darkroom.min.js.map',
          sourceMappingURL: 'angular-darkroom.min.js.map'
        },
        files: {
          'dist/js/angular-darkroom.min.js': 'build/lib/js/angular-darkroom.js'
        }
      }
    }
  });

  // load the tasks
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // define the tasks
  grunt.registerTask(
    'build',
    'Compiles all of the assets and copies the files to the build directory.',
    [ 'clean:build', 'copy:main', 'uglify:main', 'clean:lib' ]
  );

  grunt.registerTask(
    'default',
    'Build, watch and launch server.',
    [ 'build', 'watch' ]
  );
};