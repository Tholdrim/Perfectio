const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const htmlmin = require('gulp-htmlmin');
const less = require('gulp-less');
const rename = require('gulp-rename');
const pump = require('pump');
const http = require('http');
const finalhandler = require('finalhandler');
const serveStatic = require('serve-static');

gulp.task('assets', callback => {
    pump([
        gulp.src('source/assets/*.*'),
        gulp.dest('result/assets'),
    ], callback);
});

gulp.task('less', callback => {
    pump([
        gulp.src('source/styles/styles.less'),
        less({ math: 'always' }),
        gulp.dest('result'),
        rename({ suffix: '.min' }),
        cleanCSS({ level: 2 }),
        gulp.dest('result')
    ], callback);
});

gulp.task('minify', callback => {
    pump([
        gulp.src('source/views/*.html'),
        htmlmin({ collapseWhitespace: true, removeComments: true }),
        gulp.dest('result')
    ], callback);
});

gulp.task('watch', () => {
    gulp.watch('source/assets/*.*', gulp.series('assets'));
    gulp.watch('source/styles/*.less', gulp.series('less'));
    gulp.watch('source/views/*.html', gulp.series('minify'));
});

gulp.task('server', () => {
    const serve = serveStatic('result');
 
    http.createServer((request, response) => {
        serve(request, response, finalhandler(request, response));
    }).listen(8080);
});

gulp.task('build', gulp.series(['assets', 'minify', 'less']));

gulp.task('default', gulp.series('build', gulp.parallel('watch', 'server')));
