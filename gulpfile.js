var gulp = require ('gulp');
var sass = require ('gulp-sass');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var autoprefixer = require('gulp-autoprefixer');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var browserify = require('gulp-browserify');
var merge = require('merge-stream');
var newer = require('gulp-newer');
var imagemin = require('gulp-imagemin');

var SOURCEPATHS = {
	sassSource : 'src/scss/*.scss',
	htmlSource : 'src/*.html',
	jsSource : 'src/js/*.js',
	imgSource : 'src/img/**'
}

var APPATH = {
	root: 'app/',
	css : 'app/css', 
	js : 'app/js',
	fonts : 'app/fonts',
	img : 'app/img'
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

gulp.task('images', function(){
	return gulp.src(SOURCEPATHS.imgSource)
		.pipe(newer(APPATH.img))
		.pipe(imagemin())
		.pipe(gulp.dest(APPATH.img));
});

gulp.task('moveFonts', function() {
	gulp.src('./node_modules/bootstrap/dist/fonts/*.{eot,ttf,svg,woff,woff2}')
		.pipe(gulp.dest(APPATH.fonts));
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

gulp.task('watch', ['serve', 'sass', 'copy', 'clean-html', 'clean-scripts', 'scripts', 'moveFonts', 'images'], function() {
	gulp.watch([SOURCEPATHS.sassSource], ['sass']);
	gulp.watch([SOURCEPATHS.htmlSource], ['copy']);
	gulp.watch([SOURCEPATHS.jsSource], ['scripts']);
});  

gulp.task('default', ['watch']);