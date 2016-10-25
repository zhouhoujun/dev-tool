// DynamicTask 
import * as gulp from 'gulp';
import { Development, TaskOption, Src, Operation, DynamicTask } from './src/tools';

const del = require('del');
const cache = require('gulp-cached');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
let tsProject = ts.createProject('tsconfig.json');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');

Development.create(gulp, __dirname, {
    tasks: <TaskOption>{
        src: 'src',
        dist: 'lib',
        runTasks(oper: Operation, tasks: Src[], subGroupTask?: Src, assertsTask?: Src): Src[] {
            assertsTask && tasks.splice(1, 0, assertsTask);
            subGroupTask && tasks.splice(1, 0, subGroupTask);
            return tasks;
        },
        asserts: {
            ts: {
                loader: [
                    {
                        name: 'tscompile',
                        pipes: [
                            () => cache('typescript'),
                            sourcemaps.init,
                            tsProject
                        ],
                        output: [
                            (tsmap, config) => tsmap.dts.pipe(gulp.dest(config.getDist())),
                            (tsmap, config) => {
                                if (config.oper === Operation.release || config.oper === Operation.deploy) {
                                    return tsmap.js
                                        .pipe(babel({
                                            presets: ['es2015']
                                        }))
                                        .pipe(uglify())
                                        .pipe(sourcemaps.write('./sourcemaps'))
                                        .pipe(gulp.dest(config.getDist()));
                                } else {
                                    return tsmap.js
                                        .pipe(sourcemaps.write('./sourcemaps'))
                                        .pipe(gulp.dest(config.getDist()));
                                }
                            }
                        ]
                    },
                    {
                        name: 'watch',
                        watch: ['tscompile']
                    }
                ]
            }
        },
        loader: <DynamicTask[]>[
            {
                name: 'clean',
                task: (config) => del(config.getDist())
            }
        ]
    }
});

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
