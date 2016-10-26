// DynamicTask 
import * as gulp from 'gulp';
import { Development, TaskOption, Src, Operation, DynamicTask } from './src/tools';
import * as mocha from 'gulp-mocha';

const del = require('del');
const cache = require('gulp-cached');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
let tsProject = ts.createProject('tsconfig.json');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');

// build 1
Development.create(gulp, __dirname, [
    {
        src: 'src',
        dist: 'lib',
        loader: [
            {
                name: 'tscompile',
                src: 'src/**/*.ts',
                pipes: [
                    () => cache('typescript'),
                    sourcemaps.init,
                    tsProject
                ],
                output: [
                    (tsmap, config, dt) => tsmap.dts.pipe(gulp.dest(config.getDist(dt))),
                    (tsmap, config, dt) => {
                        if (config.oper === Operation.release || config.oper === Operation.deploy) {
                            return tsmap.js
                                .pipe(babel({
                                    presets: ['es2015']
                                }))
                                .pipe(uglify())
                                .pipe(sourcemaps.write('./sourcemaps'))
                                .pipe(gulp.dest(config.getDist(dt)));
                        } else {
                            return tsmap.js
                                .pipe(sourcemaps.write('./sourcemaps'))
                                .pipe(gulp.dest(config.getDist(dt)));
                        }
                    }
                ]
            },
            {
                name: 'test',
                src: 'test/**/*spec.ts',
                oper: Operation.test | Operation.release | Operation.deploy,
                pipe(src) {
                    return src.pipe(mocha())
                        .once('error', () => {
                            process.exit(1);
                        });
                }
            },
            {
                name: 'watch',
                watch: ['tscompile']
            },
            {
                name: 'clean',
                order: 0,
                task: (config) => del(config.getDist())
            }
        ]
    }
]);

// // build 2
// Development.create(gulp, __dirname, [
//     {
//         src: 'src',
//         dist: 'lib',
//         assertsOrder: 1,
//         asserts: {
//             ts: [
//                 {
//                     name: 'tscompile',
//                     pipes: [
//                         () => cache('typescript'),
//                         sourcemaps.init,
//                         tsProject
//                     ],
//                     output: [
//                         (tsmap, config) => tsmap.dts.pipe(gulp.dest(config.getDist())),
//                         (tsmap, config) => {
//                             if (config.oper === Operation.release || config.oper === Operation.deploy) {
//                                 return tsmap.js
//                                     .pipe(babel({
//                                         presets: ['es2015']
//                                     }))
//                                     .pipe(uglify())
//                                     .pipe(sourcemaps.write('./sourcemaps'))
//                                     .pipe(gulp.dest(config.getDist()));
//                             } else {
//                                 return tsmap.js
//                                     .pipe(sourcemaps.write('./sourcemaps'))
//                                     .pipe(gulp.dest(config.getDist()));
//                             }
//                         }
//                     ]
//                 },
//                 {
//                     name: 'watch',
//                     watch: ['tscompile']
//                 }
//             ]
//         },
//         loader: [
//             {
//                 name: 'test',
//                 src: 'test/**/*spec.ts',
//                 oper: Operation.test | Operation.release | Operation.deploy,
//                 pipes: [
//                     mocha
//                 ]
//             },
//             {
//                 name: 'clean',
//                 order: 0,
//                 task: (config, dt) => del(config.getDist(dt))
//             }
//         ]
//     }
// ]);

//// build 3
// Development.create(gulp, __dirname, {
//     tasks: {
//         src: 'src/**/*.ts',
//         dist: 'lib',
//         loader: <DynamicTask[]>[
//             {
//                 name: 'clean',
//                 task: (config) => del(config.getDist())
//             },
//             {
//                 name: 'tscompile',
//                 pipes: [
//                     () => cache('typescript'),
//                     sourcemaps.init,
//                     tsProject
//                 ],
//                 output: [
//                     (tsmap, config) => tsmap.dts.pipe(gulp.dest(config.getDist())),
//                     (tsmap, config) => {
//                         if (config.oper === Operation.release || config.oper === Operation.deploy) {
//                             return tsmap.js
//                                 .pipe(babel({
//                                     presets: ['es2015']
//                                 }))
//                                 .pipe(uglify())
//                                 .pipe(sourcemaps.write('./sourcemaps'))
//                                 .pipe(gulp.dest(config.getDist()));
//                         } else {
//                             return tsmap.js
//                                 .pipe(sourcemaps.write('./sourcemaps'))
//                                 .pipe(gulp.dest(config.getDist()));
//                         }
//                     }
//                 ]
//             },
//             {
//                 name: 'watch',
//                 watch: ['tscompile']
//             }
//         ]
//     }
// });
