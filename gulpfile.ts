import gulp from"gulp";
import browserify from"browserify";
import source from"vinyl-source-stream";
import tsify from "tsify";
import uglify from"gulp-uglify";
import watchify from"watchify";
import fancy_log from"fancy-log";
import es from'event-stream';
import rename from'gulp-rename';
import glob from 'glob';

import sourcemaps from"gulp-sourcemaps";
import buffer from "vinyl-buffer";

const bundle = function(done){

  const tasks = glob('./src/**/*.bundle.ts', function(err, files) {
    if(err) done(err);
    // map them to our stream function
    return files.map(function(entry) {
      return browserify({
        basedir: ".",
        debug: true,
        entries: [entry],
        cache: {},
        packageCache: {},
      }).plugin(tsify)
        .transform("babelify", {
          presets: ["es2015"],
          extensions: [".ts"],
        })
        .bundle()
        .pipe(source(entry))
        .pipe(rename({
          dirname: 'js',
          extname: '.js'
        }))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(uglify())
        .pipe(sourcemaps.write("./"))
        
        .pipe(gulp.dest("./dist"));
    });
  });

  done();
  // create a merged stream
  return es.merge.apply(null, tasks);
}

gulp.task("copy-html", function () {
  return gulp.src("./src/*.html").pipe(gulp.dest("dist"));
});
gulp.task(
  "default",
  gulp.series(gulp.parallel("copy-html"), bundle)
);
// watchedBrowserify.on("update", bundle);
// watchedBrowserify.on("log", fancy_log);