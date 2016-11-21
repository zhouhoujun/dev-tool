/// <reference types="mocha"/>
import * as _ from 'lodash';
import * as path from 'path';
import { IDynamicTaskOption, Operation, IDynamicTasks, dynamicTask } from 'development-core';
// import * as chalk from 'chalk';
import * as mocha from 'gulp-mocha';
import { NodeTaskOption } from './NodeTaskOption';


const del = require('del');
const cache = require('gulp-cached');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');


@dynamicTask
export class TestTask implements IDynamicTasks {
    tasks() {
        let nodeDynamicTasks: IDynamicTaskOption[] = [
            {
                name: 'clean',
                order: 0,
                task: (config) => del(config.getDist())
            },
            {
                name: 'test',
                src: 'test/**/*spec.ts',
                order: 0.1,
                oper: Operation.test | Operation.release | Operation.deploy,
                pipes: [mocha],
                output: null
            }
        ];
        return nodeDynamicTasks;
    }
}

@dynamicTask({
    group: 'ts'
})
export class TypeScriptTask implements IDynamicTasks {

    tasks() {
        let tsDynamicTasks = <IDynamicTaskOption[]>[
            {
                name: 'ts-compile',
                pipes(config) {
                    let option = <NodeTaskOption>config.option;
                    // console.log(config);
                    let tsProject = ts.createProject(path.join(config.env.root, option.tsconfig || './tsconfig.json'));
                    return [
                        () => cache('typescript'),
                        sourcemaps.init,
                        tsProject
                    ]
                },
                output: [
                    (tsmap, config, dt, gulp) => tsmap.dts.pipe(gulp.dest(config.getDist(dt))),
                    (tsmap, config, dt, gulp) => {
                        let option = <NodeTaskOption>config.option;
                        if (config.oper === Operation.release || config.oper === Operation.deploy) {
                            return tsmap.js
                                .pipe(babel(option.tsBabelOption || {
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
                name: 'ts-watch',
                oper: Operation.build | Operation.e2e | Operation.test,
                watchTasks: ['ts-compile']
            }
        ];
        return tsDynamicTasks;
    }
}
