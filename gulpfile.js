var gulp = require ('gulp');
var sass = require ('gulp-sass');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var autoprefixer = require('gulp-autoprefixer');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var browserify = require('gulp-browserify');
var merge = require('merge-stream');

var SOURCEPATHS = {
	sassSource : 'src/scss/*.scss',
	htmlSource : 'src/*.html',
	jsSource : 'src/js/*.js'
}

var APPATH = {
	root: 'app/',
	css : 'app/css', 
	js : 'app/js'
}

gulp.task('clean-html', function() {
	return gulp.src(APPATH.root + '/*.html', {read: false, force: true })
		.pipe(clean());
});

gulp.task('clean-scripts', function() {
	return gulp.src(APPATH.js + '/*.js', {read: false, force: true })
		.pipe(clean());
});

gulp.task('sass', function() {
	var bootstrapCSS = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css');
	var sassFiles;


	sassFiles = gulp.src (SOURCEPATHS.sassSource)
		.pipe(autoprefixer())
		.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
		return merge(bootstrapCSS, sassFiles)
			.pipe(concat('app.css'))
			.pipe(gulp.dest(APPATH.css));
});
 
gulp.task('scripts', ['clean-scripts'], function() {
	gulp.src(SOURCEPATHS.jsSource)
		.pipe(concat('main.js'))
		.pipe(browserify())
		.pipe(gulp.dest(APPATH.js))
});

gulp.task ('copy', ['clean-html'], function() {
	gulp.src(SOURCEPATHS.htmlSource)
		.pipe(gulp.dest(APPATH.root))
}); 

gulp.task('serve', ['sass'], function() {
	browserSync.init([APPATH.css + '/*.css', APPATH.root + '/*.html', APPATH.js + '/*.js'], {
		server: {
			baseDir : APPATH.root
		}
	})
});

gulp.task('watch', ['serve', 'sass', 'copy', 'clean-html', 'clean-scripts', 'scripts'], function() {
	gulp.watch([SOURCEPATHS.sassSource], ['sass']);
	gulp.watch([SOURCEPATHS.htmlSource], ['copy']);
	gulp.watch([SOURCEPATHS.jsSource], ['scripts']);
});  

gulp.task('default', ['watch']);