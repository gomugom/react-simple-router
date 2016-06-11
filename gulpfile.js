const   gulp        = require('gulp'),
        gutil       = require('gulp-util'),
        react       = require('gulp-react'),
        clean       = require('gulp-clean'),
        sass        = require('gulp-sass'),
        sourcemaps  = require('gulp-sourcemaps'),
        rename      = require('gulp-rename'),
        plumber     = require('gulp-plumber'),
        webpack     = require('webpack-stream'),
        browserSync = require('browser-sync'),
        runSequence = require('run-sequence'),

        baseDir = 'app',
        dirs  = {
            html : baseDir,
            scss : baseDir + '/scss',
            css  : baseDir + '/css',
            js   : baseDir + '/js',
            jsx  : baseDir + '/jsx'
        },
        files = {
            html : dirs.html + '/**/*.html',
            scss : dirs.scss + '/*.scss',
            css  : dirs.css  + '/**/*.css',
            js   : dirs.js   + '/**/*.js',
            jsx  : dirs.jsx  + '/**/*.jsx'
        };

gulp
.task('style', () =>
    gulp.src(files.scss)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dirs.css))
)
.task('jsClean', () =>
    gulp.src(files.js, {read: false})
    .pipe(clean())
)
.task('reactify', () => 
    gulp.src(files.jsx)
    .pipe(react())
    .pipe(gulp.dest(dirs.js))
)
.task('packJs', () => 
    gulp.src(dirs.js + '/app.js')
    .pipe(webpack({
        output : { filename: 'bundle.js' }
    }))
    .pipe(gulp.dest(dirs.js + '/'))
)
.task('browserSync', ()=> {
	browserSync({
		server: {
			baseDir,
			routes: {
                "/node_modules": "node_modules"
			}
		},
        port: 4000,
        ui: {
            port: 4010
        }
	});
})
.task('watch', () => {
    gulp.watch(dirs.scss + '/**/*.scss', ['style']);
    gulp.watch(files.jsx, _=>{ runSequence('reactify', 'packJs'); });
	gulp.watch(files.html, browserSync.reload);
    gulp.watch(files.css, browserSync.reload);
	gulp.watch(dirs.js + '/bundle.js', browserSync.reload);
})

.task('default', (callback) => {
	runSequence('jsClean', ['style', 'reactify'], 'packJs', ['browserSync', 'watch'], callback);
});