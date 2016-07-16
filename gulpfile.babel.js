import path from 'path';
import fs from 'fs';
import { spawn } from 'child_process';

import gulp from 'gulp';
import gutil from 'gulp-util';
import del from 'del';
import eslint from 'gulp-eslint';
import babel from 'gulp-babel';
import mocha from 'gulp-mocha';
import babelRegister from 'babel-core/register';

const babelrc = JSON.parse(fs.readFileSync('.babelrc', 'utf8'));

// *** prod tasks *** //
gulp.task('build', ['clean'], () => {
  return gulp.src(['src/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(babel(babelrc))
    .on('error', gutil.log)
    .pipe(gulp.dest('dist'));
});

gulp.task('test', ['build'], () => {
  return gulp.src(['test/**/*.js'])
   .pipe(mocha({
     compilers: {
       js: babelRegister
     },
   }))
   .on('error', gutil.log);
});

gulp.task('clean', () => {
  return del(['dist/**/*.js', '!dist', '!dist/.gitkeep']);
});

// *** dev tasks *** //
const distDirRegExp = new RegExp(`(${__dirname}/).*?\/(.*)`);

function runTest({ filePath }) {
  return gulp.src(filePath.replace(distDirRegExp, '$1test/$2'))
    .pipe(mocha({
      compilers: {
        js: babelRegister
      }
    }))
     .on('error', (e) => {
       gutil.log(`${e.name}: ${e.message}`);
     })
    .on('end', () => {
      return gulp.src(filePath.replace(distDirRegExp, '$1src/$2'))
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(babel(babelrc))
        .on('error', gutil.log)
        .pipe(gulp.dest(path.dirname(filePath.replace(distDirRegExp, '$1dist/$2'))));
    });
}

gulp.task('watch-src-to-test', () => {
  return gulp.watch(['src/**/*.js'], (evt) => {
    return runTest({ filePath: evt.path });
  });
});

gulp.task('watch-test-to-test', () => {
  return gulp.watch(['test/**/*.js'], (evt) => {
    return runTest({ filePath: evt.path });
  });
});

gulp.task('dev', ['watch-src-to-test', 'watch-test-to-test']);

process.on('SIGINT', function() {
  process.stdout.write('\nCaught interrupt signal. exiting...\n');
  process.exit(0);
});
