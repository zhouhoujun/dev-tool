// DynamicTask 
import * as gulp from 'gulp';
import { Development, DynamicTask } from './src/tools';

const del = require('del');
const cache = require('gulp-cached');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
let tsProject = ts.createProject('tsconfig.json');

Development.create(gulp, __dirname, {
    tasks: {
        src: 'src/**/*.ts',
        dist: 'lib',
        loader: <DynamicTask[]>[
            {
                name: 'clean',
                task: (config) => del(config.getDist())
            },
            {
                name: 'tscompile',
                pipes: [
                    () => cache('typescript'),
                    sourcemaps.init,
                    tsProject
                ],
                output: [
                    (tsmap, config) => tsmap.dts.pipe(gulp.dest(config.getDist())),
                    (tsmap, config) => tsmap.js.pipe(sourcemaps.write('./sourcemaps')).pipe(gulp.dest(config.getDist()))
                ]
            },
            {
                name: 'watch',
                watch: ['tscompile']
            }
        ]
    }
});
