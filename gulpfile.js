const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const htmlmin = require('gulp-htmlmin');
const less = require('gulp-less');
const pump = require('pump');
const rename = require('gulp-rename');

gulp.task('assets', callback => {
    pump([
        gulp.src('source/assets/*.*'),
        gulp.dest('result/assets'),
    ], callback);
});

gulp.task('less', callback => {
    pump([
        gulp.src('source/styles/styles.less'),
        less(),
        gulp.dest('result'),
        rename({ suffix: '.min' }),
        cleanCSS({ level: 2 }),
        gulp.dest('result')
    ], callback);
});

gulp.task('minify', callback => {
    pump([
        gulp.src('source/views/*.html'),
        htmlmin({ collapseWhitespace: true }),
        gulp.dest('result')
    ], callback);
});

gulp.task('watch', ['assets', 'minify', 'less'], () => {
    gulp.watch('source/assets/*.*', ['assets']);
    gulp.watch('source/styles/*.less', ['less']);
    gulp.watch('source/views/*.html', ['minify']);
});
