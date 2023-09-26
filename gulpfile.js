"use strict";

const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const autoprefixer = require("gulp-autoprefixer");
const browserSync = require("browser-sync");
const { watch } = require("browser-sync");

const Asset = {
  html: "./*.html",
  js: "./src/js/**.js",
  sass: "./src/style/**.scss",
  images: "./src/static/**",
};

const browserTask = () => {
  browserSync.init({
    server: {
      baseDir: "./",
    },
  });

  watch(Asset.html, gulp.series(reloadTask));

  watch(Asset.sass, gulp.series(buildStyles, reloadTask));
};

const reloadTask = () => {
  browserSync.reload();
};

const buildStyles = () => {
  return gulp
    .src("src/style/*.scss")
    .pipe(sass())
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["> 1%", "last 2 versions"],
        cascade: false,
      })
    )
    .pipe(gulp.dest("dist/style"));
};

exports.default = browserTask;

exports.buildStyles = buildStyles;
