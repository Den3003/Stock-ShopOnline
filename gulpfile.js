import gulp from 'gulp';
import browserSync from 'browser-sync';
import sassPkg from 'sass';
import gulpSass from 'gulp-sass';
import { deleteSync } from 'del';
import ngrok from 'ngrok'; // Туннель для показа сайта
import htmlMin from 'gulp-htmlmin'; // Название импорта произвольное. Пакет для минификации html файлов
import sourcemaps from 'gulp-sourcemaps'; // Название импорта произвольное. Пакет для карты файлов(нахождении стилей конкретного элемента)

// Пакеты для Оптимизации изображений
import imagemin from 'gulp-imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import imageminGifsicle from 'imagemin-gifsicle';
import imageminSvgo from 'imagemin-svgo';

//Пакеты для конвертирования изображений в .webp и .avif
import gulpWebp from 'gulp-webp';
import gulpAvif from 'gulp-avif';

import tap from 'gulp-tap'; // Пакет для лога что происходит в тасках 
import { stream as critical } from 'critical'; // Критические стили
import gulpif from 'gulp-if'; // Пакет для проверки условий

// Пакеты для стилей css

import postcss from 'gulp-postcss';
import postcssImport from 'postcss-import';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

import { exec } from 'child_process'; // прямой вызов webpack CLI через exec




const prepros = true;

let dev = false;

const sass = gulpSass(sassPkg);

//! Задачи

// Отлавливаем все deprecated warnings
process.on('warning', (warning) => {
  if (warning.name === 'DeprecationWarning' && warning.code === 'DEP0180') {
    console.log('⚠️ Используется устаревший fs.Stats!');
    console.log('Сообщение:', warning.message);
    console.log('Stack:', warning.stack.split('\n')[1]); // только первая строка со стеком
  }
});


export const html = () => gulp
  .src('src/*.html')
  .pipe(htmlMin({
    removeComments: true,
    collapseWhitespace: true,
  }))
  .pipe(gulp.dest('dist'))
  .pipe(browserSync.stream());

export const style = () => {
  if (prepros) {
    return gulp
      .src('src/scss/**/*.scss')
      .pipe(gulpif(dev, sourcemaps.init()))
      .pipe(sass().on('error', sass.logError))
      .pipe(postcss([
        postcssImport(),
        autoprefixer(),
        !dev && cssnano() // минификация только в продакшн
      ].filter(Boolean)))
      .pipe(gulpif(dev, sourcemaps.write('../maps')))
      .pipe(gulp.dest('dist/styles'))
      .pipe(browserSync.stream());
  }

  return gulp
    .src('src/styles/index.css')
    .pipe(gulpif(dev, sourcemaps.init()))
    .pipe(postcss([
        postcssImport(),
        autoprefixer(),
        !dev && cssnano() // минификация только в продакшн
      ].filter(Boolean)))
    .pipe(gulpif(dev, sourcemaps.write('../maps')))
    .pipe(gulp.dest('dist/styles'))
    .pipe(browserSync.stream());
}

// JS (webpack напрямую)
export const js = (cb) => {
  const mode = dev ? 'development' : 'production';
  exec(`npx webpack --config webpack.config.js --mode ${mode}`, (err, stdout, stderr) => {
    browserSync.reload(); // обновляем браузер после пересборки
    cb(err);
  });
};

export const img = () => gulp
  .src('src/images/**/*.{jpg,jpeg,png,svg,gif}', { encoding: false })
  .pipe(gulpif(!dev, imagemin([
    imageminMozjpeg({ quality: 75, progressive: true }),
    imageminPngquant({ quality: [0.7, 0.9] }),
    imageminGifsicle({ interlaced: true }),
    imageminSvgo({
      plugins: [
        'preset-default',
        {
          name: 'removeViewBox',
          active: false
        }
      ]
    })
  ])))
  .pipe(gulp.dest('dist/images'))
  .pipe(tap(file => {
    console.log(`Обработан файл: ${file.relative}`);
  }))
  .pipe(browserSync.stream());

export const webp = () => gulp
  .src('src/images/**/*.{jpg,jpeg,png}')
  .pipe(gulpWebp({
    quality: 60
  }))
  .pipe(gulp.dest('dist/images'))
  .pipe(browserSync.stream());

export const avif = () => gulp
  .src('src/images/**/*.{jpg,jpeg,png}', { encoding: false })
  .pipe(gulpAvif({
    quality: 80,
    verbose: true
  }))
  .pipe(gulp.dest('dist/images'))
  .pipe(browserSync.stream());

export const critCSS = () => gulp
  .src('dist/index.html')
  .pipe(critical({
    base: 'dist/',
    inline: true,
    css: ['dist/styles/index.css']
  }))
  .on('error', err => {
    console.error(err.message)
  })
  .pipe(gulp.dest('dist'))

export const copy = () => gulp
  .src('src/fonts/**/*', {
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
  gulp.watch(prepros ? './src/scss/**/*.scss' : './src/styles/**/*.css', style);
  gulp.watch('src/images/**/*.{jpg,jpeg,png,svg,gif}', img);
  gulp.watch('./src/script/**/*.js', js);
  gulp.watch('./src/fonts/**/*', copy);
  gulp.watch('./src/images/**/*.{jpg,jpeg,png}', webp);
  gulp.watch('./src/images/**/*.{jpg,jpeg,png}', avif);

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

export const develop = async() => {
  dev = true;
}

export const base = gulp.parallel(html, style, js, img, webp, avif, copy);

export const build = gulp.series(clear, base, critCSS);

export default gulp.series(develop, base, server);
