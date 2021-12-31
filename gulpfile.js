const pump = require('pump');
const browserSync = require('browser-sync').create();
const gulp = Object.assign(require('gulp'), { cleanCss: require('gulp-clean-css'), minifyHtml: require('gulp-htmlmin'), less: require('gulp-less'), rename: require('gulp-rename') });

function assets(callback) {
    pump([
        gulp.src('source/assets/*.*'),
        gulp.dest('result/assets')
    ], callback);
}

function less(callback) {
    pump([
        gulp.src('source/styles/styles.less'),
        gulp.less({ math: 'always' }),
        gulp.dest('result'),
        gulp.rename({ suffix: '.min' }),
        gulp.cleanCss({ level: 2 }),
        gulp.dest('result')
    ], callback);
}

function minify(callback) {
    pump([
        gulp.src('source/views/*.html'),
        gulp.minifyHtml({ collapseWhitespace: true, removeComments: true }),
        gulp.dest('result')
    ], callback);
}

function other(callback) {
    pump([
        gulp.src('source/other/*.*'),
        gulp.dest('result')
    ], callback);
}

function server() {
    browserSync.init({ port: 8080, server: 'result', ui: false, watch: true });
}

function watch() {
    gulp.watch('source/assets/*.*', gulp.series(assets));
    gulp.watch('source/other/*.*', gulp.series(other));
    gulp.watch('source/styles/*.less', gulp.series(less));
    gulp.watch('source/views/*.html', gulp.series(minify));
}

exports.build =  gulp.series(assets, less, minify, other);
exports.default = gulp.series(exports.build, gulp.parallel(watch, server));
