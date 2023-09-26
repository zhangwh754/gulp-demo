## Gulp Try

Gulp使用Demo

## Install

```bash
# 全局安装Gulp脚手架
npm install --global gulp-cli

# 安装为开发依赖
npm install gulp -D
```

## 初始化

### gulpfile.js

创建gulpfile.js。gulp执行时会自动去寻找这个文件

```js
exports.default = (cb) => {
  console.log("my task");
  cb();
};

// 或返回一个Promise
exports.default = () => {
  console.log("my task");
  
  return Promise.resolve();
};
```

控制台输入gulp会打印my task

## 串行(series)和并行(parallel)

- "串行" 表示任务按顺序一个接一个地执行，前一个任务完成后才会开始下一个任务。
- "并行" 表示任务同时执行，多个任务可以同时进行，而不需要等待前一个任务完成。

```js
const { series, parallel } = require("gulp");

const task1 = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(task1.name);
    }, 3000);
  });
};

const task2 = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(task2.name);
    }, 1000);
  });
};

// 串行任务，总耗时4s，task1先结束
// exports.default = series(task1, task2);

// 并行任务，总耗时3s，task2先结束
exports.default = parallel(task1, task2);
```

## 读取(src)和写入(dest)

Gulp中，src()一般表示读取文件系统的流，dest()一般表示写入文件系统的流

### [Demo]复制文件夹A到文件夹B

```js
const { src, dest } = require("gulp");

const copy = () => {
  return src("src/*").pipe(dest("dist/"));
};

exports.default = copy;
```

### [Demo]实时监听html和scss的修改，重载浏览器

gulp-watch库用于解决gulp自带watch只能刷新第一次的问题

```js
"use strict";

const gulp = require("gulp");
const watch = require("gulp-watch");
const sass = require("gulp-sass")(require("sass"));
const autoprefixer = require("gulp-autoprefixer");
const browserSync = require("browser-sync");

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
```

