import gulp from 'gulp';
import browserSync from 'browser-sync'; // Для обновления
import * as sassPkg from 'sass'; // Нужен для того чтобы работал наш gulp-sass, они взаимосвязанны 
import gulpSass from 'gulp-sass';
import rename from 'gulp-rename';
const sass = gulpSass(sassPkg);

import { deleteSync } from 'del'; // Для отчистки папки dist 
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
import svgSprite from 'gulp-svg-sprite';

import tap from 'gulp-tap'; // Пакет для лога что происходит в тасках 
import { stream as critical } from 'critical'; // Критические стили выделяем
import gulpif from 'gulp-if'; // Пакет для проверки условий(в каком случае использовать определенные таски в каком нет, но либо какие то функции вызывать) 

// Пакеты для стилей css

import postcss from 'gulp-postcss';
import postcssImport from 'postcss-import';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

import { exec } from 'child_process'; // прямой вызов webpack CLI через exec
import { once } from 'events';


const prepros = true;

let dev = false;  // Переключатель сборки

const path = {
  dist: {
    base: 'dist/',
    html: 'dist/', // Вдруг путь поменяется туда куда мы будем складывать html, то тогда необходимо будет здесь путь поменять
    css: 'dist/styles/',
    images: 'dist/images/',
    fonts: 'dist/fonts/',
  },
  src: {
    base: 'src/',
    html: 'src/*.html',
    pug: 'src/pug/*.pug', // Если используется pug
    scss: 'src/scss/**/*.scss',
    css: 'src/styles/index.css',
    images: 'src/images/**/*.{jpg,jpeg,png,svg,gif}',
    imagesF: 'src/images/**/*.{jpg,jpeg,png}', // Это для картинок которые будут переведены в другой формат
    svgSprite: 'src/svg/**/*.svg', // Где мы берем svg, специальная папка, в этой папке лежат именно те svg, которые мы хотим собрать в sprite.svg. Если используется файл sprite.svg
    assets: ['src/fonts/**/*.*', 'src/icons/**/*.*', 'src/video/**/*.*', 'src/public/**/*.*', 'src/robot.txt', 'src/site.webmanifest', 'src/sitemap.xml',],
  },
  watch: {
    html: 'src/**/*.html',
    js: 'src/script/**/*.js',
    pug: 'src/**/*.pug',
    css: 'src/styles/**/*.css',
    scss: 'src/scss/**/*.scss',
    svg: 'src/svg/**/*.svg',
    images: 'src/images/**/*.{jpg,jpeg,png,svg,gif}',
    imagesF: 'src/images/**/*.{jpg,jpeg,png}',
  }
}

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
  .src(path.src.html)
  .pipe(gulpif(!dev, htmlMin({
    removeComments: true,
    collapseWhitespace: true,
  })))
  .pipe(gulp.dest(path.dist.html))
  .pipe(browserSync.stream());

export const style = () => {
  if (prepros) {
    return gulp
      .src(path.src.scss)
      .pipe(gulpif(dev, sourcemaps.init()))
      .pipe(sass().on('error', sass.logError))
      .pipe(postcss([
        postcssImport(),
        autoprefixer(),
        !dev && cssnano() // минификация только в продакшн
      ].filter(Boolean)))
      .pipe(rename({
        suffix: '.min'
      }))
      .pipe(gulpif(dev, sourcemaps.write('../maps')))
      .pipe(gulp.dest(path.dist.css))
      .pipe(browserSync.stream());
  }

  return gulp
    .src(path.src.css)
    .pipe(gulpif(dev, sourcemaps.init()))
    .pipe(postcss([
        postcssImport(),
        autoprefixer(),
        !dev && cssnano() // минификация только в продакшн
      ].filter(Boolean)))
    .pipe(rename({
        suffix: '.min'
      }))
    .pipe(gulpif(dev, sourcemaps.write('../maps')))
    .pipe(gulp.dest(path.dist.css))
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
  .src(path.src.images, { encoding: false })
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
  .pipe(gulp.dest(path.dist.images))
  .pipe(tap(file => {
    console.log(`Обработан файл: ${file.relative}`);
  }))
  .pipe(browserSync.stream());

export const webp = () => gulp
  .src(path.src.imagesF, { encoding: false })
  .pipe(gulpWebp({
    quality: dev ? 100 : 70,
    method: 6,
  }))
  .pipe(gulp.dest(path.dist.images))
  .pipe(browserSync.stream({
    once: true
  }));

export const avif = () => gulp
  .src(path.src.imagesF, { encoding: false })
  .pipe(gulpAvif({
    quality: dev ? 100 : 70,
    verbose: true
  }))
  .pipe(gulp.dest(path.dist.images))
  .pipe(browserSync.stream({
    once: true
  }));

export const svg = () => gulp
  .src(path.src.svgSprite)
  .pipe(svgSprite({
    mode: {
      stack: {
        sprite: "../sprite.svg"
      }
    },
  }))
  .pipe(gulp.dest(path.dist.images))
  .pipe(browserSync.stream({
    once: true
  }));

export const critCSS = () => gulp
  .src('dist/index.html')
  .pipe(critical({
    base: path.dist.base,
    inline: true,
    css: ['dist/styles/index.min.css']
  }))
  .on('error', err => {
    console.error(err.message)
  })
  .pipe(gulp.dest(path.dist.base))

export const copy = () => gulp
  .src(path.src.assets[0], {
    base: 'src',
    encoding: false
  })
  .pipe(gulp.dest(path.dist.base))
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

  gulp.watch(path.watch.html, html);
  gulp.watch(prepros ? path.watch.scss : path.watch.css, style);
  gulp.watch(path.watch.svg, svg);
  gulp.watch(path.watch.images, img);
  gulp.watch(path.watch.js, js);
  gulp.watch('./src/fonts/**/*', copy);
  gulp.watch(path.watch.imagesF, webp);
  gulp.watch(path.watch.imagesF, avif);

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

export const base = gulp.parallel(html, style, js, img, webp, avif, svg, copy);

export const build = gulp.series(clear, base, critCSS);

export default gulp.series(develop, base, server);
