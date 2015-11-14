var gulp = require("gulp");
// прописывает пути bower
var wiredep = require('wiredep').stream;
// сборка dist
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
// для удаления файлов
var clean = require('gulp-clean');
// создание локального сервера
var browserSync = require('browser-sync');
// позволяет удалять в автомате не используемые стили
var uncss = require('gulp-uncss');
// объединение стилей
var concatCss = require('gulp-concat-css');
// позволяет добавлять префиксы в css для поддержки в разных браузерах
var autoprefixer = require('gulp-autoprefixer');
// переименовывание
var rename = require("gulp-rename");
// уведомления
var notify = require("gulp-notify");
// Minify CSS 
//var csso = require('gulp-csso');
//Shorthand - обединяет селекторы
var shorthand = require('gulp-shorthand');



// Сервер
gulp.task('server', function () {
    browserSync({
        port: 9000,
        server: {
            baseDir: 'app'
        }
    });
});

// Clean
gulp.task('clean', function () {
    return gulp.src('dist', {read: false})
        .pipe(clean())
});

// Build
gulp.task('build', ['clean'], function () {
    var assets = useref.assets();

    return gulp.src('app/*.html')
        .pipe(assets)
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(notify("Build end!"))
        .pipe(gulp.dest('dist'))
});

// Bower
gulp.task('bower', function () {
    gulp.src('./app/index.html')
        .pipe(wiredep({
            directory : "app/bower"
        }))
        .pipe(gulp.dest('./app'))
});

// Uncss
gulp.task("uncss", function () {
    gulp.src('css/style.css')
        .pipe(uncss({
            html: ['app/index.html']
        }))
        .pipe(gulp.dest('app/css'))
});

// CSS
gulp.task("css", function () {
    gulp.src('css/*.css')
        .pipe(concatCss("main.css"))
        .pipe(shorthand())
        //.pipe(csso())
        .pipe(autoprefixer('last 15 versions'))
        .pipe(gulp.dest('app/css'))
});


// Слежка
gulp.task('watch', function () {
    gulp.watch('css/*.css', ['css']);
    gulp.watch([
        'app/*.html',
        'app/js/*.js',
        'app/css/*.css'
    ]).on('change', browserSync.reload);
});

// default
gulp.task('default', ['server', 'bower', 'css', 'watch']);