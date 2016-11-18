# packaged development-tool

This repo is for distribution on `npm`. The source for this module is in the
[main repo](https://github.com/zhouhoujun/development-tool/src/mastert).
Please file issues and pull requests against that repo.
This package use to develop kit for project development via gulp tasks.


Development tool can load task from module, directory, object or dynamic tasks.
dynamic load task and run task by command evn:
```shell

gulp [build] [--build]  [--test] [--e2e]  [--release] [--depoly] [--server] [--watch]

```

## Install

You can install this package either with `npm`.

### npm

```shell

npm install development-tool

```

You can `import` modules:

## import module

```ts
import * as gulp from 'gulp';
import  { Development } from 'development-tool';

```

## Create development tool

```ts
import * as gulp from 'gulp';
import  { Development } from 'development-tool';
Development.create(gulp, __dirname, {
    // any module implement ITaskDefine, or @tasks(...) decorator and @dynamicTask decorator task.
    tasks{src: 'src', dist: 'lib', loader: 'development-tool-*' }
});

//or create mutil task for web client, node server.
Development.create(gulp, __dirname, {
    tasks[
        // any module implement ITaskDefine, or @tasks(...) decorator and @dynamicTask decorator task.
        {src: 'src/client', dist: 'public', loader: 'development-tool-web', asserts:{...},  tasks:[...]  },
        // any module implement ITaskDefine, or @tasks(...) decorator and @dynamicTask decorator task.
        {src: 'src/server', dist: 'lib', loader: 'development-tool-node', asserts:{...}, tasks:[...] }
        ...
    ]
});

```

## Demo for node project

```ts

import * as gulp from 'gulp';
import { ITaskOption, Development } from 'development-tool';
// import 'development-tool-node';

Development.create(gulp, __dirname, {
    tasks: <ITaskOption>{
        src: 'src',
        dist: 'lib',
        buildDist: 'build',
        testSrc: 'test/**/*.spec.ts',
        loader: 'development-tool-node'
    }
});

```

## Demo for angular project

```ts

import * as gulp from 'gulp';

import { Pipe, Operation } from 'development-core';
import { TaskOption, Development } from 'development-tool';
import { IBundlesConfig } from 'development-tool-jspm';
const tslint = require('gulp-tslint');
const ngAnnotate = require('gulp-ng-annotate');
const cache = require('gulp-cached');
const rename = require('gulp-rename');
const jeditor = require('gulp-json-editor');


Development.create(gulp, __dirname, [{
    src: 'src',
    dist: 'dist/development',
    releaseDist: 'dist/production',
    testSrc: 'test/**/*.spec.ts',
    cleanSrc: (ctx) => {
        if (ctx.env.release || ctx.env.deploy) {
            return 'dist/production';
        } else {
            return 'dist/development/!(jspm_packages)**';
        }
    },
    loader: 'development-tool-web',
    assertsOrder: 1,
    asserts: {
        css: '',
        html: ['src/*.html', 'src/*.cshtml'],
        json: ['src/**/*.json', '!src/data/**/*.json', '!src**/jsconfig.json', '!src/config*.json'],
        config: {
            src(ctx) {
                if (ctx.env.config) {
                    return `src/config-${ctx.env.config}.json`;
                } else {
                    return 'src/config.json';
                }
            },
            watch: true, // add watch to this assert.
            loader: [
                {
                    name: 'config',
                    oper: Operation.default,
                    pipes: [
                        () => cache('config_json'),
                        () => rename('config.json'),
                        () => jeditor()
                    ]
                }
            ]
        },
        template: {
            src: 'src/**/*.tpl.html',
            loader: 'development-assert-templ'
        },
        ts: {
            src: ['src/**/*.ts', 'test/**/*.ts'],
            loader: {
                module: 'development-assert-ts',
                pipes: <Pipe[]>[
                    { name: 'tscompile', toTransform: () => tslint(), order: 2 },
                    { name: 'tscompile', toTransform: () => ngAnnotate(), order: 3 },
                ]
            }
        },
        jspmconfig: {
            src: 'src/jspm-config/*.js'
            watch: true // add watch to this assert.
        },
        js: {
            loader: {
                module: 'development-assert-js',
                pipes: <Pipe[]>[
                    { name: 'jscompile', toTransform: () => ngAnnotate(), order: 2 }
                ]
            }
        }
    },

    tasks: [
        <IBundlesConfig>{
            baseURL: '',
            src: ['dist/development/**/*.js', '!dist/development/jspm_packages/*'],
            dist: 'dist/production/bundles',
            mainfile: 'bundle.js',
            loader: 'development-tool-jspm',
            // bundles: {

            // }
        }
    ]

}]);

```

## add special pipe work via pipes ctx, add special output by ctx output in loader option

only dynamic task and IPipeTask (base class PipeTask) can add special pipe work.

```ts
import * as gulp from 'gulp';
import  { Development, IAssertOption, ITaskOption } from 'development-tool';
Development.create(gulp, __dirname, [
    {
        src: 'src',
        //testSrc: '...',
        //e2eSrc: '...',
        //watchSrc: '...'
        dist: 'lib',
        // buildDist:'build path',
        // releaseDist: 'release path',
        // depolyDist: 'depoly path'
        asserts:{
            // use IAsserts task to deal with ts file, if src not setting, use  src/**/*.ts
            // pipes, output is addation pipe work.
            ts: {
                loader: {
                    module:'development-assert-ts',
                    // add pipe works for module tasks.
                    pipe(stream, ctx, dist, gulp){ ... }
                    pipes: Pipe[] | (ctx, dist, gulp)=> Pipe[],
                    output: OutputPipe[] | (stream, ctx, dist, gulp)=> OutputPipe[]
                }
            },
            tsb:{
                src:'srcb/**/*.ts',
                loader:'development-assert-ts',
                // also can add pipe works for module tasks here.
                pipe(stream, ctx, dist, gulp){ ... }
                pipes: Pipe[] | (ctx, dist, gulp)=> Pipe[],
                output: OutputPipe[] | (stream, ctx, dist, gulp)=> OutputPipe[]
            }
            //default copy 'src/**/*.json' to dist. auto create json task and  json-watch task.
            json: '',
            //default copy to dist. auto create jpeg task and  jpeg-watch task.
            jpeg: ['src/apath/**/*.jpeg', 'src/bpath/**/*.jpeg'],
            //default copy to dist. auto create moduleBcss task and moduleBcss-watch task.
            moduleBcss: 'src/moduleB/**/*.css',
            // use default task to deal with ts file, if src must setting.
            less:<ITaskOption>{...},
            // use dynamic task to deal with html file, if src not setting, use src/**/*.html
            html:{loader: <IDynamicTaskOption[]>[}
            ...
        },
        loader: 'development-tool-node'
    }
]);
```

## Create development tool with addation sub tasks

```ts
Development.create(gulp, __dirname, {
    tasks:{
        src: 'src',
        dist: 'lib',
        loader: 'development-tool-web',
        tasks:[
            {
                src: 'files be dealt with',
                //testSrc: '...',
                //e2eSrc: '...',
                //watchSrc: '...'
                dist: 'dist path',
                // buildDist:'build path',
                // releaseDist: 'release path',
                // depolyDist: 'depoly path'
                // any module implement ITaskDefine, or @tasks(...) decorator and @dynamicTask decorator task.
                loader:'development-tool-*'
            },
            {
                src: ['src/apath/**/*.css', 'src/bpath/**/*.css'],
                //testSrc: '...',
                //e2eSrc: '...',
                //watchSrc: '...'
                dist: 'dist path',
                // buildDist:'build path',
                // releaseDist: 'release path',
                // depolyDist: 'depoly path'
                loader: {
                    // any module implement ITaskDefine, or @tasks(...) decorator and @dynamicTask decorator task.
                    dir: [path.join(__dirname, './src/mytasks')]
                },
                tasks: [
                    {
                        src: 'files be dealt with',
                        //testSrc: '...',
                        //e2eSrc: '...',
                        //watchSrc: '...'
                        dist: 'dist path',
                        // buildDist:'build path',
                        // releaseDist: 'release path',
                        // depolyDist: 'depoly path'
                        loader: {
                            // any module implement ITaskDefine, or @tasks(...) decorator and @dynamicTask decorator task.
                            dir: path.join(__dirname, './src/mytasks')
                        }
                    },
                    {
                        src: 'files be dealt with',
                        //testSrc: '...',
                        //e2eSrc: '...',
                        //watchSrc: '...'
                        dist: 'dist path',
                        // buildDist:'build path',
                        // releaseDist: 'release path',
                        // depolyDist: 'depoly path'
                        loader: {
                            // any module implement ITaskDefine, or @tasks(...) decorator and @dynamicTask decorator task.
                            module: path.join(__dirname, './src/mytasks/dosomething')
                        }
                    }
                ]
            }
            ...
        ]
    }
});
```

## Create development tool with dynamic tasks

```ts
import * as gulp from 'gulp';
import { Development } from 'development-tool';
import { ITaskOption, Src, Operation, IDynamicTaskOption } from 'development-core';

const del = require('del');
const cache = require('gulp-cached');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
let tsProject = ts.createProject('tsconfig.json');

Development.create(gulp, __dirname, {
    tasks: {
        src: 'src/**/*.ts',
        dist: 'lib',
        loader: <IDynamicTaskOption[]>[
            {
                name: 'clean',
                //the task for Operation type. default for all.
                //oper: Operation.release | Operation.depoly | Operation.build | Operation.test | Operation.e2e
                task: (ctx) => del(ctx.getDist())
            },
            {
                name: 'tscompile',
                //the task for Operation type. default for all.
                //oper: Operation.release | Operation.depoly | Operation.build | Operation.test | Operation.e2e
                pipes: [
                    () => cache('typescript'),
                    sourcemaps.init,
                    tsProject
                ],
                // set muti-output. no setting default output default one to "dist: 'lib'" .
                output: [
                    (tsmap, ctx) =>  tsmap['dts'].pipe(gulp.dest(ctx.getDist())),
                    (tsmap, ctx) =>  tsmap['js'].pipe(sourcemaps.write('./sourcemaps')).pipe(gulp.dest(ctx.getDist()))
                ]
            },
            {
                name: 'watch',
                //watch only for --watch env.
                watchTasks: ['tscompile']
            }
        ]
    }
});

```

## Create development tool with dynamic tasks, with task from module and asserts

Dynamic task can set special src filter, dist path, build path, release path,
test path, deploy path, e2e path. detail see `IDynamicTaskOption`  interface.

```ts
// or with task from module and asserts.
Development.create(gulp, __dirname, {
    tasks: {
        src: 'src/**/*.ts',
        dist: 'lib',
        asserts:{
            //default copy 'src/**/*.json' to dist. auto create json task and  json-watch task.
            json: '',
            //default copy to dist. auto create jpeg task and  jpeg-watch task.
            jpeg: ['src/apath/**/*.jpeg', 'src/bpath/**/*.jpeg'],
            //default copy to dist. auto create moduleBcss task and moduleBcss-watch task.
            moduleBcss: 'src/moduleB/**/*.css',
            // use IAsserts task to deal with ts file, if src not setting, use  src/**/*.ts
            // can add special pipe work via pipes ctx. add special output by ctx output
            ts:{ loader: {module:'development-assert-ts', pipes: Pipe[] | (ctx, dist, gulp)=> Pipe[], output: OutputPipe[] | (stream, ctx, dist, gulp)=> OutputPipe[] }},
            // use default task to deal with ts file, if src must setting.
            less:<ITaskOption>{...},
            // use dynamic task to deal with html file, if src not setting, use src/**/*.html
            html:{loader: <IDynamicTaskOption[]>[}
            ...
        },
        loader: {
            module:'module name',
            dynamicTasks:[
                {
                    name: 'clean',
                    task: (ctx) => del(ctx.getDist())
                },
                {
                    name: 'tscompile',
                    pipes(ctx){
                        return [
                        () => cache('typescript'),
                        sourcemaps.init,
                        tsProject
                    ]),
                    // set muti-output. no setting default output default one to "dist: 'lib'" .
                    output [
                        (tsmap, ctx) =>  tsmap['dts'].pipe(gulp.dest(ctx.getDist())),
                        (tsmap, ctx) =>  tsmap['js'].pipe(sourcemaps.write('./sourcemaps')).pipe(gulp.dest(ctx.getDist()))
                    ]
                },
                {
                    name: 'watch',
                    watchTasks: ['tscompile']
                }
            ]
        }
    }
});

// Dynamic task can set special src filter, dist path, build path,
// release path, test path, deploy path, e2e path. detail see  IDynamicTaskOption  interface
Development.create(gulp, __dirname, [
    {
        src: 'src',
        dist: 'lib',
        assertsOrder: 1,
        asserts: {
            ts: [
                {
                    name: 'tscompile',
                    //src: 'src/moduleA/**/*.ts'
                    //dist:'lib/ts',
                    pipes: [
                        () => cache('typescript'),
                        sourcemaps.init,
                        tsProject
                    ],
                    output: [
                        (tsmap, ctx, dt) => tsmap.dts.pipe(gulp.dest(ctx.getDist(dt))),
                        (tsmap, ctx, dt) => {
                            if (ctx.oper === Operation.release || ctx.oper === Operation.deploy) {
                                return tsmap.js
                                    .pipe(babel({
                                        presets: ['es2015']
                                    }))
                                    .pipe(uglify())
                                    .pipe(sourcemaps.write('./sourcemaps'))
                                    .pipe(gulp.dest(ctx.getDist(dt)));
                            } else {
                                return tsmap.js
                                    .pipe(sourcemaps.write('./sourcemaps'))
                                    .pipe(gulp.dest(ctx.getDist(dt)));
                            }
                        }
                    ]
                },
                {
                    name: 'watch',
                    watchTasks: ['tscompile']
                }
            ]
        },
        loader: [
            {
                name: 'test',
                src: 'test/**/*spec.ts',
                oper: Operation.test | Operation.release | Operation.deploy,
                pipes: [mocha],
                output: null
            },
            {
                name: 'clean',
                order: 0,
                task: (ctx) => del(ctx.getDist())
            }
        ]
    }
]);
```

https://github.com/zhouhoujun/development-tool.git
The mocks are then available at `jspm_components/development-tool/development-tool.js`.

## Documentation

Documentation is available on the
[development-tool docs site](https://github.com/zhouhoujun/development-tool).

## License

MIT © [Houjun](https://github.com/zhouhoujun/)