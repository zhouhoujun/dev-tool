// DynamicTask 
import * as gulp from 'gulp';
import { IMap, Development, TaskConfig, DynamicTask } from './src/tools';
let del = require('del');
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
                task(config: TaskConfig) {
                    return del(config.option.dist);
                }
            },
            {
                name: 'tscompile',
                pipes: [
                    () => cache('typescript'),
                    sourcemaps.init,
                    tsProject
                ],
                output: [
                    (tsmap: IMap<NodeJS.ReadWriteStream>, config: TaskConfig) => {
                        return tsmap['dts'].pipe(gulp.dest(config.getDist()))
                    },
                    (tsmap: IMap<NodeJS.ReadWriteStream>, config: TaskConfig) => {
                        return tsmap['js'].pipe(sourcemaps.write('./sourcemaps')).pipe(gulp.dest(config.getDist()))
                    }
                ]
            },
            {
                name: 'watch',
                watch: ['tscompile']
            }
        ]
    }
});
