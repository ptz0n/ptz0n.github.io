module.exports = function(grunt) {

  grunt.initConfig({

    jekyll: {
      options: {
        config: '_config.yml',
        raw: 'url: http://localhost:4000'
      },
      serve: {
        options: {
          serve: true
        }
      },
      build: {}
    },

    compass: {
      src: {
        options: {
          sassDir: '_sass',
          cssDir: 'css'
        }
      }
    },

    watch: {
      jekyll: {
        files: ['*/*.html','*/*.md', '!_site/*'],
        tasks: ['jekyll:build']
      },
      scss: {
        files: 'sass/*.scss',
        tasks: ['compass']
      },
      css: {
        files: 'css/*.css',
        options: {
          livereload: true
        },
      }
    },

    concurrent: {
      tasks: ['watch', 'jekyll:serve', 'compass'],
      options: {
        limit: 3,
        logConcurrentOutput: true
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-jekyll');
  grunt.loadNpmTasks('grunt-concurrent');

  grunt.registerTask('default', ['concurrent']);

};