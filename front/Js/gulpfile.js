// Utilities
let autoprefixer = require('autoprefixer');
let cssnano = require('cssnano');
let fs = require('fs');

// Gulp
let gulp = require('gulp');

// Gulp plugins
let concat = require('gulp-concat');
let gutil = require('gulp-util');
let header = require('gulp-header');
let postcss = require('gulp-postcss');
let rename = require('gulp-rename');
let runSequence = require('run-sequence');

// Misc/global vars
let pkg = JSON.parse(fs.readFileSync('package.json'));
let activatedAnimations = activateAnimations();

// Task options
let opts = {
  destPath: './',
  concatName: 'animate.css',

  autoprefixer: {
    browsers: ['> 1%', 'last 2 versions', 'Firefox ESR'],
    cascade: false,
  },

  minRename: {
    suffix: '.min',
  },

  banner: [
    '@charset "UTF-8";\n',
    '/*!',
    ' * <%= name %> -<%= homepage %>',
    ' * Version - <%= version %>',
    ' * Licensed under the MIT license - https://opensource.org/licenses/MIT',
    ' *',
    ' * Copyright (c) <%= new Date().getFullYear() %> <%= author.name %>',
    ' */\n\n',
  ].join('\n'),
};

// ----------------------------
// Gulp task definitions
// ----------------------------

gulp.task('createCSS', function () {
  return gulp
    .src(activatedAnimations)
    .pipe(concat(opts.concatName))
    .pipe(postcss([autoprefixer(opts.autoprefixer)]))
    .pipe(gulp.dest(opts.destPath))
    .pipe(postcss([cssnano({
      reduceIdents: {
        keyframes: false
      }
    })]))
    .pipe(rename(opts.minRename))
    .pipe(gulp.dest(opts.destPath));
});

gulp.task('addHeader', function () {
  return gulp
    .src('*.css')
    .pipe(header(opts.banner, pkg))
    .pipe(gulp.dest(opts.destPath));
});

gulp.task('default', gulp.series('createCSS', 'addHeader'));

// ----------------------------
// Helpers/functions
// ----------------------------

// Read the config file and return an array of the animations to be activated
function activateAnimations() {
  let categories = JSON.parse(fs.readFileSync('animate-config.json')),
    category,
    files,
    file,
    target = [],
    count = 0;

  for (category in categories) {
    if (categories.hasOwnProperty(category)) {
      files = categories[category];

      for (file in files) {
        if (files[file]) {
          // marked as true
          target.push('source/' + category + '/' + file + '.css');
          count += 1;
        }
      }
    }
  }
  // prepend base CSS
  target.push('source/_base.css');

  if (!count) {
    gutil.log('No animations activated.');
  } else {
    gutil.log(count + (count > 1 ? ' animations' : ' animation') + ' activated.');
  }

  return target;
}