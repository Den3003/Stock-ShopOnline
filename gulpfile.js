import gulp from 'gulp';
import browserSync from 'browser-sync';
import cssImport from 'gulp-cssimport';
import gulpCssimport from 'gulp-cssimport';
import {deleteSync} from 'del';
import ngrok from 'ngrok';

//! Задачи

export const html = () => gulp
  .src('src/*.html')
  .pipe(gulp.dest('dist'))
  .pipe(browserSync.stream());

export const css = () => gulp
  .src('src/styles/index.css')
  .pipe(gulpCssimport({
    extensions: ['css'],
  }))
  .pipe(gulp.dest('dist/styles'))
  .pipe(browserSync.stream());

export const js = () => gulp
  .src('src/script/**/*.js')
  .pipe(gulp.dest('dist/script'))
  .pipe(browserSync.stream());

export const copy = () => gulp
  .src([
    'src/fonts/**/*',
    'src/images/**/*'
  ], {
    base: 'src',
    encoding: false
  })
  .pipe(gulp.dest('dist'))
  .pipe(browserSync.stream({
    once: true
  }));

export const server = async (done) => {
  browserSync.init({
    ui: false,
    notify: false,
    server: {
      baseDir: 'dist'
    }
  })

  gulp.watch('./src/**/*.html', html);
  gulp.watch('./src/styles/**/*.css', css);
  gulp.watch('./src/script/**/*.js', js);
  gulp.watch(['./src/images/**/*','.src/fonts/**/*'], copy);

  if (process.argv.includes('--tunnel')) {  // Чтобы запустить gulp c туннелем надо использовать команду gulp --tunnel
    const url = await ngrok.connect(3000);
    console.log(`🚀 Публичный URL: ${url}`);
  }

  done();
};

export const clear = (done) => {
  deleteSync(['dist/**/*'], {
    force: true,
  });
  done();
};

//! Запуск

export const base = gulp.parallel(html, css, js, copy);

export const build = gulp.series(clear, base);

export default gulp.series(base, server);
