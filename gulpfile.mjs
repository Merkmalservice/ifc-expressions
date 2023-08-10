import gulp from "gulp";
import ts from "gulp-typescript";
import { deleteAsync } from "del";
import uglify from "gulp-uglify";
import replace from "gulp-replace";
import fs from "fs";

const mjsProject = ts.createProject("tsconfig.json");
const cjsProject = ts.createProject("tsconfig-cjs.json");

gulp.task("clean", function () {
  return deleteAsync(["./dist", "./tmp", "./src/gen"]);
});
gulp.task("compress", function () {
  return gulp
    .src("dist/**/*.js", { sourcemaps: true })
    .pipe(uglify())
    .pipe(
      gulp.dest("dist", {
        sourcemaps: ".",
      })
    );
});
gulp.task("transpile-mjs", function () {
  return gulp
    .src(["src/**/*.ts", "generated/**/*.ts"], { sourcemaps: true })
    .pipe(replace(/from "([.\/]+(\w+\/)*\w+)";/g, 'from "$1.js";'))
    .pipe(mjsProject())
    .pipe(
      gulp.dest("dist/mjs/", {
        sourcemaps: ".",
      })
    );
});
gulp.task("transpile-cjs", function () {
  return gulp
    .src(["src/**/*.ts", "generated/**/*.ts"], { sourcemaps: true })
    .pipe(replace(/from "([.\/]+(\w+\/)*\w+)";/g, 'from "$1.js";'))
    .pipe(cjsProject())
    .pipe(gulp.dest("dist/cjs/", { sourcemaps: "." }));
});
gulp.task("writePackageJsons", function (callback) {
  fs.writeFile("./dist/cjs/package.json", '{ "type": "commonjs" }', callback);
  fs.writeFile("./dist/mjs/package.json", '{ "type": "module" }', callback);
});
gulp.task("copyDTS", function () {
  return gulp
    .src(["./dist/mjs/**/*.d.ts", "./dist/mjs/**/*.d.ts.map"])
    .pipe(gulp.dest("./dist/"));
});

gulp.task("deleteDuplicateDTS", function () {
  return deleteAsync(["./dist/mjs/**/*.d.ts*", "./dist/cjs/**/*.d.ts*"]);
});
gulp.task(
  "build",
  gulp.series(
    "transpile-cjs",
    "transpile-mjs",
    "copyDTS",
    "deleteDuplicateDTS",
    //"compress",
    "writePackageJsons"
  )
);
gulp.task("default", gulp.series("build"));
