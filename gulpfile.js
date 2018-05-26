var fs = require('fs');
var gulp = require('gulp');
var browserSync = require('browser-sync');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var autoprefixer =require('gulp-autoprefixer');
var ejs = require("gulp-ejs");
var merge = require('merge-stream');

var jsonData = require('./_dev_files/json/index.json');

// viewに関するタスク
gulp.task('build-html', function(){
	var buildView = gulp.src('./_dev_files/parts_ejs/*.ejs')
	.pipe(ejs({
		jsonData: jsonData, //jsonData に data.json を取り込む
		fileKind: 'view'
	}))
	.pipe(rename({extname: '.html'}))
	.pipe(gulp.dest('./view_files'));
	
	var buildMock = gulp.src('./_dev_files/parts_ejs/*.ejs')
	.pipe(ejs({
		jsonData: jsonData, //jsonData に data.json を取り込む
		fileKind: 'mock'
	}))
	.pipe(rename({extname: '.html'}))
	.pipe(gulp.dest('./_upfiles/mock'));
	
	var buildStg = gulp.src('./_dev_files/parts_ejs/*.ejs')
	.pipe(ejs({
		jsonData: jsonData, //jsonData に data.json を取り込む
		fileKind: 'stg'
	}))
	.pipe(rename({extname: '.html'}))
	.pipe(gulp.dest('./_upfiles/stg'));
	
	return merge(buildView, buildMock, buildStg);
	
});

// cssに関するタスク
gulp.task('build-css', function () {
	gulp.src('./_dev_files/scss/*.scss')
	.pipe(sass({outputStyle: 'nested'}))
	.pipe(rename({extname: '.css'}))
	.pipe(autoprefixer({  //autoprefixerの実行
		browsers: ["last 2 versions"],
		cascade: false
	}))
	.pipe(gulp.dest('./base_files/css'));
});

// ローカルサーバーに関するタスク
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./view_files"
        }
    });
});

// 自動でローカルサーバーをリロードするタスク
gulp.task('bs-reload', function () {
    browserSync.reload();
});

// ファイルの変更を監視
gulp.task('watch', function() {
	gulp.watch(['./_dev_files/parts_ejs/*.ejs','./_dev_files/scss/*.scss','./base_files/css/*.css'], ['build-css','build-html','bs-reload'])
});

// デフォルトタスク
gulp.task('default', ['build-css','build-html','watch','browser-sync']);