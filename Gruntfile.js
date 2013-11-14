module.exports = function(grunt) {

  var jsSrc = [
      "dev/js/Braitenberg.js",
      "dev/js/Lamp.js",
      "dev/js/Motor.js",
      "dev/js/Sensor.js",
      "dev/js/Vehicle.js"
  ];

  // files to exclude from validation & distribution
  var excludeJSFromDist = [];

  var filteredSrc = filterArray(jsSrc, excludeJSFromDist);
  function filterArray(srcArray, filterArray) {
    var filteredArray = srcArray.filter(
      function(el) {
        for(var i=0; i<filterArray.length; i++) {
          if(el.indexOf(filterArray[i]) != -1) {
            return false;
          }
        }
      });
    return filterArray;
  }

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),   
    // BUILD TASKS
    sass: {
      options: {
        style: "expanded",
        //require: "dev/sass_lib/math.rb",
        trace: true
      },
      dev: {
        files: {
          "dev/css/style.css":"dev/scss/style.scss"
        }
      }
    },
    concat: {
      dev: {
        src: jsSrc,
        dest:"dev/js/main.js"
      }
    },
    connect: {
      server: {
        options: {
          port: 8000,
          base: "dev/"
        }
      }
    },
    reload: {
      proxy: {
        host: "localhost",
        port: 8000
      }
    },
    watch: {
      all: {
        files: ["dev/*.html", "dev/css/*.css", "dev/scripts/**/*.js", "dev/img/*"],
        tasks: ["reload"]
      },
      scripts: {
        files:jsSrc,
        tasks:["concat:dev", "reload"],
        options: {
          interrupt: true
        }
      },
      stylesheets: {
        files:["dev/scss/*.scss"],
        tasks:["sass"],
        options: {
          interrupt: true
        }
      },
    },
    // VALIDATION TASKS
    htmllint: {
      all: ["dev/*.html"]
    },
    csslint: {
      base_theme: {
        src: "dev/css/*.css",
        rules: {
          "import": false,
          "compatible-vendor-prefixes": false,
          "duplicate-properties": false,
          "adjoining-classes": false,
          "font-sizes":false
        }
      }
    },
    jshint: {
      files: filteredSrc,
      options: {
        asi: true, // suppresses warnings about semi-colons
        laxcomma: true, // suppress comma-first coding style
        browser: true,
        devel: true,
        globals: {
          jquery: true
        }
      }
    },
    // BUILD TASKS
    clean: {
      build: ["dist/"],
      docs: ["docs/"]
    },
    cssmin: {
      add_banner: {
          options: {
              banner: "/*! <%= pkg.name %> v<%= pkg.version %> (<%= grunt.template.today('dd-mm-yyyy') %>) */\n"
          },
          files: {
              'dist/css/style.css': ['dev/css/*.css']
          }
      },
      minify: {
          expand: true,
          cwd: 'dist/css/',
          src: ['*.css', '!*.min.css'],
          dest: 'dist/css/'
      }
    },
    uglify: {
      options: {
        preserveComments: 'some',
        banner: "/*! <%= pkg.name %> V <%= pkg.version %> (<%= grunt.template.today('dd-mm-yyyy') %>) */\n"
      },
      dist: {
        files: {
          "dist/js/main.js":"dev/js/main.js"
        }
      }
    },
    copy: {
      main: {
        files: [
          {expand: true, cwd: "dev/", src: ["*.html"], dest: "dist/", filter: "isFile"}, // Includes files in path
          {expand: true, cwd: "dev/", src: ["*.ico"], dest: "dist/", filter: "isFile"},
          {expand: true, cwd: "dev/css/", src: ["*.css"], dest: "dist/css/", filter: "isFile"},
          {expand: true, cwd: "dev/img/", src: ["**"], dest: "dist/img/"}, // Includes files in path and its subdirs
          {expand: true, cwd: "dev/js/", src: ["**"], dest: "dist/js/"}
        ]
      }
    },
  });

  grunt.loadNpmTasks("grunt-contrib-sass");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-connect");
  grunt.loadNpmTasks("grunt-reload");
  grunt.loadNpmTasks("grunt-html");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks("grunt-jsdoc");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-uglify");

  grunt.registerTask("default", ["sass", "concat:dev", "connect", "reload", "watch"]);
  grunt.registerTask("validate", ["htmllint", "csslint", "jshint"]);
  grunt.registerTask("build", ["sass", "concat:dev", "clean:build", "copy", "cssmin", "uglify"]);

};