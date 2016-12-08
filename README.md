# packaged development-tool

This repo is for distribution on `npm`. The source for this module is in the
[main repo](https://github.com/zhouhoujun/development-tool/src/mastert).
Please file issues and pull requests against that repo.
This package use to develop kit for project development via gulp tasks.


Development tool can load task from module, directory, object or dynamic tasks.
dynamic load task and run task by command evn:

```shell

gulp [build] [--build]  [--test] [--e2e]  [--release] [--depoly] [--server] [--watch]

gulp start --task task1,task2 [--build]  [--test] [--e2e]  [--release] [--depoly] [--server] [--watch]

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

Development.create(gulp, __dirname, [{
    src: 'src',
    dist: 'lib',
    buildDist: 'build',
    asserts:{
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
        json: ['src/**/*.json', '!src/data/**/*.json', '!src**/jsconfig.json', '!src/config*.json']
        ...
    },
    testSrc: 'test/**/*.spec.ts',
    loader: 'development-tool-node'
}]);

```

## Demo for angular project

```ts

import * as gulp from 'gulp';
import * as _ from 'lodash';
import { Pipe, IPipe, Operation, IMap, IDynamicTaskOption, RunWay } from 'development-core';
import { Development, IContext } from 'development-tool';
import { IBundlesConfig, IBundleGroup } from 'development-tool-jspm';
import { IWebTaskOption } from 'development-tool-web';
import { ITsTaskOption } from 'development-assert-ts';
import * as path from 'path';
const tslint = require('gulp-tslint');
const ngAnnotate = require('gulp-ng-annotate');
const cache = require('gulp-cached');
const rename = require('gulp-rename');
const jeditor = require('gulp-json-editor');
const through = require('through2');
const JSONC = require('json-comments');
const replace = require('gulp-replace');
const del = require('del');
const uglify = require('gulp-uglify');

Development.create(gulp, __dirname, [
    <IWebTaskOption>{
        src: 'src',
        dist: 'dist/development',
        releaseDist: 'dist/production',
        cleanSrc: (ctx) => {
            if (ctx.env.release || ctx.env.deploy) {
                if (ctx.env.gb) {
                    return ['dist/production/!(*.js)'];
                } else {
                    return 'dist/production';
                }
            } else {
                return 'dist/development';
            }
        },
        karma: {
            jspm: {
                resource: 'assets'
            }
        },
        loader: 'development-tool-web',
        assertsOrder: total => 1 / total,
        asserts: {
            css: '', less: '',
            jpeg: Operation.default, jpg: Operation.default, png: Operation.default, svg: Operation.default,
            ttf: Operation.default, woff: Operation.default, eot: Operation.default, xslx: Operation.default,
            pdf: Operation.default,
            html: 'src/*.html',
            json:['src/**/*.json', '!src/data/**/*.json', '!src**/jsconfig.json', '!src/config*.json'],
            config: {
                src(ctx) {
                    if (ctx.env.config) {
                        return `src/config-${ctx.env.config}.json`;
                    } else {
                        return 'src/config.json';
                    }
                },
                loader: []
            },
            template: {
                src: 'src/**/*.tpl.html',
                loader: 'development-assert-templ'
            },
            ts: {
                src: ['src/**/*.ts', 'test/**/*.ts'],
                uglify: false,
                loader: {
                    module: 'development-assert-ts',
                    pipes: <Pipe[]>[
                        { name: 'tscompile', toTransform: () => ngAnnotate(), order: total => 1 / total },
                    ]
                }
            },
            jspmconfig: {
                src: 'src/jspm-config/*.js',
                dist: 'dist/development/jspm-config',
                releaseDist: 'dist/production/jspm-config',
                watch: true,
                loader: [
                    {
                        pipes: <Pipe[]>[
                            // {
                            //     oper: Operation.build,
                            //     toTransform: () => replace(/dist\/jspm_packages/g, 'dist/jspm_packages')
                            // }
                        ]
                    }
                ]
            },
            js: ['src/**/*.js', '!src/jspm-config/**/*.js']
        },
        subTaskOrder: total => 3 / total,
        tasks: [
            <IBundlesConfig>{
                index: ['src/index.html', 'src/Index.cshtml'],
                bundleBaseDir: 'dist/production',
                src: 'dist/production/**/*.js',
                dist: 'dist/production',
                jspmConfig: 'dist/production/jspm-config/config.js',
                mainfile: 'bundle.js',
                loader: 'development-tool-jspm',
                bundles: (ctx) => {
                    let routes = [
                        'app/subapp1/routes.json',
                        'app/subapp2/routes.json',
                        'app/subapp3.json'
                    ];
                    let dist = ctx.parent.getDist();
                    return ctx.fileFilter(path.join(dist, 'common/**/*.js'), null, n => {
                        return ctx.toUrl(dist, n); // path.relative(dist, n).replace(/\\/g, '/').replace(/^\//g, '');
                    }).then(cits => {
                        let bundle: IMap<IBundleGroup> = {
                            commons: {
                                combine: true,
                                exclude: [],
                                items: cits
                            }
                        };
                        _.each(routes, (r, idx) => {
                            let rf = path.join(dist, r);
                            let route: any[] = require(rf);
                            if (route) {
                                let rs = r.split('/');
                                let name = rs[(rs.length - 2)];
                                let items = _.uniq(_.map(route, r => {
                                    return r.src;
                                }));
                                let exclude = [];
                                if (idx === (routes.length - 1)) {
                                    exclude = _.keys(bundle);
                                    items.push('app/app');
                                }

                                bundle[name] = {
                                    combine: true,
                                    items: items,
                                    exclude: exclude
                                }
                            }
                        });
                        return bundle;
                    });
                },
                depsExclude: ['angular-i18n', 'jquery'],
                bundleDeps: (ctx, deps) => {
                    let libs = ['bootstrap', 'bootstrap-less', 'css', 'less', 'json', 'lodash', 'text', 'url', 'normalize.css', 'spectrum', 'html2canvas', 'moment', 'highcharts'];
                    let cores = ['angular', 'oclazyload', 'angular-translate', 'angular-translate-loader-static-files', 'angular-messages'
                        , 'angular-ui-event', 'angular-ui-utils', 'angular-ui-validate', 'angular-ui-router', 'angular-loading-bar'
                        , 'ng-file-upload', 'angular-ui-bootstrap', 'ui-router-extras'];
                    return {
                        libs: {
                            combine: true,
                            items: libs
                        },
                        core: {
                            combine: true,
                            items: cores,
                            exclude: ['libs']
                        },
                        tools: {
                            combine: true,
                            items: _.filter(deps, function (d) {
                                return libs.indexOf(d) < 0 && cores.indexOf(d) < 0;
                            }),
                            exclude: ['libs', 'core']
                        },
                        components: {
                            combine: true,
                            items: _.filter(deps, function (d) {
                                return libs.indexOf(d) < 0 && cores.indexOf(d) < 0;
                            }),
                            exclude: ['libs', 'core', 'tools']
                        }
                    };
                },
                pipes: [
                    () => ngAnnotate(),
                    () => uglify()
                ]
            },
            {
                loader: <IDynamicTaskOption>{
                    name: 'clean-production',
                    oper: Operation.release,
                    task: (ctx) => del(ctx.toDistSrc(['app', 'common', 'data']))
                }
            }
        ]
    }
]);


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
        assertsOrder: 0.1,
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