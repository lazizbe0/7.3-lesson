global.$ = {
  gulp: require("gulp"),
  bs: require("browser-sync").create(),
  glp: require("gulp-load-plugins")(),
  sass: require("gulp-sass")(require("sass")),
  path: {
    src: {
      html: "./app/src/*.{html,pug,jade}",
      style: "./app/src/style/*.{css,scss,less}",
      js: "./app/src/js/*.{js,ts}",
      fonts: "./app/src/fonts/**/*.*",
      images: "./app/src/images/**/*.*",
      library: "./app/src/library/**/**/*.*"
    },
    build: {
      html: "./app/build/",
      style: "./app/build/css/",
      js: "./app/build/js/",
      fonts: "./app/build/fonts/",
      images: "./app/build/images/",
      library: "./app/build/library/"
    },
    watch: {
      html: ["./app/src/*.{html,pug,jade}", "./app/src/view/*.{html,pug,jade}"],
      style: "./app/src/style/*.{css,scss,less}",
      js: "./app/src/js/*.{js,ts}",
      fonts: "./app/src/fonts/**/*.*",
      images: "./app/src/images/**/*.*",
      library: "./app/src/library/**/**/*.*"
      
    },
  },
};

taskList = {
  server: () => {
    $.gulp.task("server", () => {
      $.bs.init({
        server: {
          baseDir: "./app/build/",
        },
      });
    });
  },
  html: () => {
    $.gulp.task("html", () =>
      $.gulp
        .src($.path.src.html)
        .pipe($.glp.include())
        .pipe($.glp.pug({ pretty: true }))
        .pipe($.gulp.dest($.path.build.html))
        .on("end", $.bs.reload)
    );
  },
  style: () => {
    $.gulp.task("style", () =>
      $.gulp
        .src($.path.src.style)
        .pipe($.glp.sourcemaps.init())
        .pipe($.sass({ outputStyle: "expanded" }))
        .pipe($.glp.groupCssMediaQueries())
        
        .pipe(
          $.glp.autoprefixer({
            overrideBrowserslist: ["last 2 versions"],
            cascade: false
          })
        )
        .pipe($.glp.sourcemaps.write())
        .pipe($.gulp.dest($.path.build.style))
        .pipe($.glp.sourcemaps.init())
        .pipe($.sass({ outputStyle: "compressed" }))
        .pipe($.glp.rename({ extname: ".min.css" }))
        .pipe($.glp.sourcemaps.write())
        .pipe($.gulp.dest($.path.build.style))
        .on("end", $.bs.reload)
    );
  },
  js: () => {
    $.gulp.task("js", () =>
      $.gulp
        .src($.path.src.js)
        .pipe($.glp.include())
        .pipe($.glp.babel({
          presets: ['@babel/env']
        }))
        .pipe($.gulp.dest($.path.build.js))
        .pipe($.glp.uglify())
        .pipe($.glp.rename({extname: ".min.js"}))
        .pipe($.gulp.dest($.path.build.js))
        .on("end", $.bs.reload)
    );
  },
  fonts: () => {
    $.gulp.task("fonts", () =>
      $.gulp
        .src($.path.src.fonts)
        .pipe($.glp.ttf2woff2())
        .pipe($.gulp.dest($.path.build.fonts))
        .on("end", $.bs.reload)
    );
  },
  images: () => {
    $.gulp.task("images", () =>
      $.gulp
        .src($.path.src.images)
        .pipe($.glp.webp())
        .pipe($.gulp.dest($.path.build.images))
        .on("end", $.bs.reload)
    );
  },
  library: () => {
    $.gulp.task("library", () =>
      $.gulp
        .src($.path.src.library)
        .pipe($.gulp.dest($.path.build.library))
        .on("end", $.bs.reload)
    );
  },
  watch: () => {
    $.gulp.task("watch", () => {
      for (const key in $.path.watch) {
        $.gulp.watch($.path.watch[key], $.gulp.series(key));
      }
    });
  },
};

for (const key in taskList) {
  taskList[key]();
}

$.gulp.task(
  "default",
  $.gulp.series($.gulp.parallel("server","html", "style", "js", "fonts", "images", "library", "watch"))
);
