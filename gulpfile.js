var gulp = require('gulp') ;
var sass = require('gulp-sass') ;
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var paths = {
    sass: ['scss/**/*.scss'],
    index: 'app/index.html',
    scripts: ['app/js/app.js', 'app/js/**/*.js'],
    styles: 'app/scss/**/*.*',
    templates: 'app/templates/**/*.*',
    images: 'app/img/**/*.*',
    lib: 'www/lib/**/*.*',
};

gulp.task('sass', function(done) {
    gulp.src('./scss/ionic.app.scss')
        .pipe(sass())
        .on('error', sass.logError)
        .pipe(gulp.dest('./www/css/'))
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest('./www/css/'))
        .on('end', done);
});


gulp.task('sass:watch', function () {
    gulp.watch('./sass/**/*.scss', ['sass']);
});

gulp.task('watch', function() {
    gulp.watch( "./stylesheets/**/*.scss", ["stylesheets"] );
    gulp.watch( "./html/**/*.html", ["html"] );
});


