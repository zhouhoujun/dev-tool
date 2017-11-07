# packaged development-tool

`development-tool` is an automation tools kit, for Web Front end and nodejs development. It is a module bundler. It's main purpose is to bundle JavaScript files for usage in a browser or nodejs, yet it is also capable of transforming, bundling, or packaging just about any resource or asset.

This repo is for distribution on `npm`. The source for this module is in the
[main repo](https://github.com/zhouhoujun/development-tool/src/mastert).
Please file issues and pull requests against that repo.
This package use to develop kit for project development via gulp tasks.


Development tool can load task from module, directory, object or dynamic tasks.
dynamic load task and run task by command evn:

```shell

gulp start  [--build]  [--test] [--e2e]  [--release] [--depoly] [--server][--watch] [--task task1,task2]

gulp build [--build]  [--test] [--e2e]  [--release] [--depoly] [--server] [--watch]

```

## Install

You can install this package either with `npm`.

for nodejs develop, need install [development-tool-node](https://www.npmjs.com/package/development-tool-node)

for front-end develop install [development-tool-web](https://www.npmjs.com/package/development-tool-web)

you can bundle angularjs, angular, react, knockout, Vue, etc. ...
easy to packag your project in any modular.
use [development-tool-systemjs](https://www.npmjs.com/package/development-tool-systemjs) for bundle project, alse can
use [development-tool-jspm](https://www.npmjs.com/package/development-tool-jspm) for bundle project.

### npm

```shell

npm install development-tool

// for nodejs develop
npm install development-tool-node

// for front end develop
npm install development-tool-web


```



You can `import` modules:

## import module

```ts
import * as gulp from 'gulp';
import  { Development } from 'development-tool';

```

## Componse Context

 ```ts

import * as gulp from 'gulp';
import  { Development } from 'development-tool';

// create project.
let projectA = new Development({...});
// or
let projectA = Development.create(gulp, __dirname, [...]);

//add context component.
projectA.add(component);
// or
projectA.add(ITaskConfig);
// or
projectA.add(ITaskOption);

...
projectA.start();

```

## Refs Project compile together

 ```ts
import * as gulp from 'gulp';
import { Pipe, Operation, IMap, ITaskContext, IDynamicTaskOption, RunWay, IOrder } from 'development-core';
import { Development, ITaskOption } from 'development-tool';


Development.create(gulp, __dirname, [
    <ITaskOption>{
        name: 'serv',
        src: 'server',
        dist: 'dist',
        testSrc: 'server/test/**/*.spec.ts',
        cleanSrc: ['dist/!(development|production)'],
        refs: [
            // another project.
            (ctx) =>  pathstring;
            '../subSystem',
            {name: 'project_name', path:'_', cmd:'gulp build', args: '--release' },
            {name: (ctx) => 'project_name', path: (ctx) => 'path', cmd:(ctx) => 'gulp build', args: (ctx) => ['...'] }
        ],
        // default run parallel.
        refsRunWay: RunWay.parallel,
        // set refs projec run order.
        //refsOrder: Order,
        asserts: {
            // default config.
            // css:  Operation.default, jpeg: Operation.default, jpg: Operation.default, png: Operation.default, svg: Operation.default,ttf: Operation.default, woff: Operation.default, eot: Operation.default, ts:'development-asserts--ts'
            xlsx: Operation.default,
            pdf: Operation.default,
            template: {
                src: ['server/views/**/*.html', 'server/views/**/*.ejs'],
                dist: 'dist/views'
            },
            copys: { src: ['package.json', 'start.bat'], oper: Operation.deploy },
            pm2: {
                src: 'pm2.json',
                oper: Operation.deploy,
                loader: [{
                    pipes: [(ctx) => replace('"script": "dist/index.js",', '"script": "index.js",')]
                }]

            }
        },
        tasks: [
            {
                src: 'dist/config/*',
                dist: 'dist/config',
                loader: <IDynamicTaskOption>{
                    name: 'server-config',
                    oper: Operation.release | Operation.deploy,
                    pipes: [(ctx) => replace('./development', './production')]
                }
            }
        ],
        loader: 'development-tool-node'
    }
]).start();

 ```


## Demo for angular2 web site and server, docker build and publish.

```ts

import * as gulp from 'gulp';
import * as _ from 'lodash';
import { Pipe, Operation, IMap, ITaskContext, IDynamicTaskOption, RunWay, IOrder } from 'development-core';
import { Development, ITaskOption } from 'development-tool';
import { IBundlesConfig, IBundleGroup } from 'development-tool-systemjs';
import { IWebTaskOption } from 'development-tool-web';
import * as path from 'path';

const tslint = require('gulp-tslint');
const cache = require('gulp-cached');
const rename = require('gulp-rename');
const jeditor = require('gulp-json-editor');
const through = require('through2');
const JSONC = require('json-comments');
const replace = require('gulp-replace');
const del = require('del');
import * as htmlreplace from 'gulp-html-replace';
const htmlMin = require('gulp-minify-html');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const less = require('gulp-less');
const targz = require('tar.gz');
const zip = require('gulp-zip');

interface Packages {
    name: string;
    items?: string[];
    pattern?: string;
}

Development.create(gulp, __dirname, [
    <ITaskOption>{
        name: 'serv',
        src: 'server',
        dist: 'dist',
        testSrc: 'server/test/**/*.spec.ts',
        cleanSrc: 'dist/!(development|production)',
        asserts: {
            // default config.
            // css:  Operation.default, jpeg: Operation.default, jpg: Operation.default, png: Operation.default, svg: Operation.default,ttf: Operation.default, woff: Operation.default, eot: Operation.default, ts:'development-asserts--ts'
            xlsx: Operation.default,
            pdf: Operation.default,
            template: {
                src: ['server/views/**/*.html', 'server/views/**/*.ejs'],
                dist: 'dist/views'
            },
            copys: { src: ['package.json', 'start.bat'], oper: Operation.deploy },
            pm2: {
                src: 'pm2.json',
                oper: Operation.deploy,
                loader: [{
                    pipes: [(ctx) => replace('"script": "dist/index.js",', '"script": "index.js",')]
                }]
            }
        },
        tasks: [
            {
                src: 'dist/config/*',
                dist: 'dist/config',
                loader: <IDynamicTaskOption>{
                    name: 'server-config',
                    oper: Operation.release | Operation.deploy,
                    pipes: [(ctx) => replace('./development', './production')]
                }
            }
        ],
        loader: 'development-tool-node'
    },
    <IWebTaskOption>{
        name: 'web',
        src: 'client',
        test: false,
        dist: 'dist/development',
        releaseDist: 'dist/production',
        cleanSrc: (ctx) => {
            if (ctx.env.release || ctx.env.deploy) {
                let srcs: string[] = [];
                if (ctx.env.gb) {
                    srcs.push('dist/production/!(*.js)');
                } else {
                    srcs.push('dist/production');
                }
                if (ctx.oper & Operation.deploy) {
                    srcs.push('dist/development');
                }
                return srcs;
            } else {
                return 'dist/development';
            }
        },
        browsersync: {
            // serverBaseDir: ctx => [ctx.env.root, ctx.getDist()],
            files: ['node_modules/**/*']
            // , filesByCtx: ctx => {
            //     if (ctx.env['all']) {
            //         return ctx.toRootPath('../ism-client/node_modules/**/*')
            //     }
            //     return [];
            // }
        },
        karma: {
            // karmaBasePath: '', // ctx.getRootPath(), // 'dist/development',
            jspm: {
                systemjs: ['systemjs/dist/system-polyfills', 'systemjs/dist/system'],
                config: ['systemjs.config.js'],
                resource: 'assets'
            }
        },
        loader: 'development-tool-web',
        assertsOrder: total => 1 / total,
        // assertsRunWay: RunWay.sequence,
        // name: 'web',
        asserts: {
            // default config.
            // css:  Operation.default | Operation.autoWatch, jpeg: Operation.default | Operation.autoWatch, jpg: Operation.default | Operation.autoWatch, png: Operation.default | Operation.autoWatch, svg: Operation.default | Operation.autoWatch,ttf: Operation.default | Operation.autoWatch, woff: Operation.default | Operation.autoWatch, eot: Operation.default | Operation.autoWatch, ts:'development-asserts--ts'
            xlsx: Operation.default,
            pdf: Operation.default,
            bootstrapfonts: {
                src: 'node_modules/bootstrap/fonts/**',
                dist: ctx => ctx.parent.toDistPath('./assets/fonts')
            },
            awesomeFonts: {
                src: 'node_modules/font-awesome/fonts/**',
                dist: ctx => ctx.parent.toDistPath('./assets/fonts')
            },
            ioniconsFonts: {
                src: 'node_modules/ionicons/dist/fonts/**',
                dist: ctx => ctx.parent.toDistPath('./assets/fonts')
            },
            less: {
                src: 'client/**/*.less',
                loader: [{
                    oper: Operation.default | Operation.autoWatch,
                    pipes: [
                        (ctx) => less({
                            paths: [
                                ctx.toRootPath('client'),
                                ctx.toRootPath('node_modules')
                            ]
                        }).on('error', console.log),
                        ctx => replace('@import url(https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600,700,300italic,400italic,600italic);', '')
                    ]
                }]
            },
            scss: {
                src: 'client/**/*.scss',
                loader: [{
                    oper: Operation.default | Operation.autoWatch,
                    pipes: [
                        // () => cache('sass_files'),
                        (ctx) => sass({
                            outputStyle: 'compressed',
                            includePaths: [
                                ctx.toRootPath('client'),
                                ctx.toRootPath('node_modules')
                            ]
                        }).on('error', sass.logError)
                    ]
                }]
            },
            json: {
                src: ['client/**/*.json', '!client/data/**/*.json', '!client**/jsconfig.json', '!client/config*.json'],
                loader: [
                    {
                        oper: Operation.default | Operation.autoWatch,
                        pipes: [
                            () => cache('config_json'),
                            () => through.obj(function (file, encoding, callback) {
                                if (file.isNull()) {
                                    return callback(null, file);
                                }

                                if (file.isStream()) {
                                    return callback('doesn\'t support Streams');
                                }

                                var min = JSONC.minify(file.contents.toString('utf8'));
                                file.contents = new Buffer(min);
                                this.push(file);
                                callback();
                            })
                        ]
                    }
                ]
            },
            config: {
                src(ctx) {
                    if (ctx.env.config) {
                        return `client/${ctx.env.config}.json`;
                    } else {
                        return ctx.env.deploy ? 'client/config-deploy.json' : 'client/config.json';
                    }
                },
                loader: [
                    {
                        // name: 'config',
                        oper: Operation.default | Operation.autoWatch,
                        pipes: [
                            () => cache('config_json'),
                            () => through.obj(function (file, encoding, callback) {
                                if (file.isNull()) {
                                    return callback(null, file);
                                }

                                if (file.isStream()) {
                                    return callback('doesn\'t support Streams');
                                }

                                var min = JSONC.minify(file.contents.toString('utf8'));
                                file.contents = new Buffer(min);
                                this.push(file);
                                callback();
                            }),
                            () => rename('config.json'),
                            (ctx) => jeditor((json: any) => {
                                json.version = ctx.env['version'];
                                return json;
                            })
                        ]
                    }
                ]
            },
            html: ['client/*.html'],
            template: {
                src: ['client/**/*.template.html', 'client/**/*.component.html', 'client/**/*.tpl.html'],
                loader: [{
                    oper: Operation.default | Operation.autoWatch,
                    pipes: [
                        () => cache('component_template_cache'),
                        () => htmlMin({
                            empty: true,
                            spare: true,
                            quotes: true,
                            dom: {
                                lowerCaseAttributeNames: false,
                                lowerCaseTags: false
                            }
                        })]
                }]
            },
            ts: {
                uglify: true,
                sourceMaps: (ctx) => (ctx.oper & Operation.deploy) <= 0,
                src: ['client/**/*.ts', 'test/**/*.ts'],
                order: <IOrder>{ value: 1, runWay: RunWay.sequence },
                loader: 'development-assert-ts'
            },
            js: 'client/**/*.js'
        },
        subTaskOrder: total => 3 / total,
        tasks: [
            <IBundlesConfig>{
                index: ['client/index.html'],
                bundleBaseDir: 'dist/production',
                src: 'dist/production/**/*.js',
                dist: 'dist/production',
                systemConfig: 'dist/production/systemjs.config.js',
                mainfile: 'boot.js',
                loader: 'development-tool-systemjs',
                bust: (ctx) => ctx.env['version'] || ctx.getPackage()['version'],
                baseURL: (ctx) => {
                    return './';
                },
                includePackageFiles: [
                    'node_modules/systemjs/dist/system-polyfills.js',
                    'node_modules/systemjs/dist/system.js'
                ],
                dependencies: (ctx) => {
                    let config = require(ctx.toDistPath('systemjs.config.js')).default;
                    return _.keys(config.map);
                },
                bundles: (ctx) => {
                    let routes: Packages[] = [
                        { name: 'core', pattern: 'app/core/**/!(routing).module.js' },
                        { name: 'shared', pattern: 'app/shared/**/!(routing).module.js' },
                        { name: 'layout', pattern: 'app/layout/**/!(routing).module.js' },
                        { name: 'source', pattern: 'app/data-source/**/!(routing).module.js' },
                        { name: 'app', items: ['app/app.module.js', 'app/main.js'] }
                    ];
                    let dist = ctx.parent.getDist();
                    return Promise.all(_.map(routes, r => {
                        if (r.items) {
                            return {
                                name: r.name,
                                items: r.items
                            }
                        } else {
                            return ctx.fileFilter(path.join(dist, r.pattern), null, n => ctx.toUrl(dist, n))
                                .then(items => {
                                    return {
                                        name: r.name,
                                        items: items
                                    }
                                });
                        }
                    })).then(its => {
                        let bundle: IMap<IBundleGroup> = {};
                        its.forEach(it => {
                            let exclude = ['core', 'shared'];
                            if (it.name === 'core') {
                                exclude = [];
                            } else if (it.name === 'shared') {
                                exclude = ['core']
                            }
                            bundle[it.name] = {
                                combine: true,
                                exclude: exclude,
                                items: it.items
                            }
                        });
                        return bundle;
                    });
                },
                depsExclude: ['angular-i18n', 'rxjs', 'app', 'raphael', 'ag-grid', 'ionicons', 'font-awesome', 'plugin-babel', 'systemjs-babel-build', 'ts', 'typescript'],
                bundleDeps: (ctx, deps) => {
                    let libs = ['css', 'json', 'text',
                        'lodash', 'zone.js', 'reflect-metadata', 'moment', 'core-js-shim', 'url'];
                    let angularlibs = _.filter(deps, it => {
                        return it.indexOf('@angular') === 0 && it.indexOf('@angularclass') < 0;
                    });

                    let ngtools = ['angular2-highcharts', 'ng2-validation', 'ng2-file-upload', '@ngx-translate/core', '@ngx-translate/http-loader', '@ng-bootstrap/ng-bootstrap'];

                    return {
                        libs: {
                            combine: true,
                            items: libs
                        },
                        angularlibs: {
                            combine: true,
                            items: angularlibs,
                            exclude: ['libs']
                        },
                        tools: {
                            combine: true,
                            items: _.filter(deps, function (d) {
                                return libs.indexOf(d) < 0 && angularlibs.indexOf(d) < 0 && ngtools.indexOf(d) < 0;
                            }),
                            exclude: ['libs', 'angularlibs']
                        },
                        ngtools: {
                            combine: true,
                            items: ngtools,
                            exclude: ['libs', 'angularlibs', 'tools']
                        }
                        // ...
                    };
                }
                , pipes: [
                    () => replace(/\/{0,1}(\.\.\/)*node_modules\/bootstrap\/fonts/gi, '(/assets/fonts'),
                    () => replace(/\/{0,1}(\.\.\/)*node_modules\/font-awesome\/fonts/gi, '/assets/fonts'),
                    () => replace(/\/{0,1}(\.\.\/)*node_modules\/ionicons\/dist\/fonts/gi, '/assets/fonts')
                    () => uglify()
                ]
                , mainfilePipes: [
                    () => uglify()
                ]
            },
            {
                loader: <IDynamicTaskOption[]>[
                    {
                        name: 'clean-production',
                        oper: Operation.release,
                        task: (ctx) => del(ctx.toDistSrc(['app', 'common', 'jspm-config', 'assets/**/*.less', 'assets/**/*.scss']))
                    },
                    {
                        name: 'copy-index',
                        oper: Operation.default,
                        src: ctx => ctx.parent.toDistPath('./index.html'),
                        dist: 'dist/views',
                        pipes: []
                    }
                ]
            }
        ]
    },
    <ITaskOption>{
        name: 'publishHtml',
        oper: Operation.deploy,
        loader: [
            {
                name: 'copy',
                src: 'dist/production/**',
                dist: 'publish/html'
            },
            {
                name: 'zip',
                src: 'publish/html/**/*',
                dist: 'publish',
                pipes: [
                    (ctx) => zip('html.zip')
                ]
            },
            {
                name: 'gztar',
                task: (ctx) => {
                    // let version = ctx.env['version'] || ctx.getPackage()['version'];
                    return targz().compress(ctx.toRootPath('publish/html'), ctx.toRootPath(`publish/html.tar.gz`))
                        .catch(err => {
                            console.log(err);
                        })
                }
            },
            {
                name: 'clear',
                task: (ctx) => del(ctx.toRootPath('publish/html'))
            }
        ]
    },
    <ITaskOption>{
        name: 'docker',
        oper: Operation.deploy,
        tasks: [
            {
                src: 'dist/**',
                loader: [
                    {
                        name: 'clean-development',
                        task: (ctx) => del('dist/development')
                    }
                ]
            },
            {
                name: 'deploy-server',
                src: 'docker-compose.yml',
                dist: './publish',
                exportImage: true,
                version: (ctx) => ctx.env['version'] || ctx.getPackage()['version'],
                images: ['project_web', 'project_nginx'],
                service: 'www.project.com',
                user: 'user',
                psw: 'password',
                loader: 'development-tool-docker'
            }]
    }
])
    .start();


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
])
.start();

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
})
.start();

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
})
.start();

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
})
.start();

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
])
.start();

```

https://github.com/zhouhoujun/development-tool.git
The mocks are then available at `jspm_components/development-tool/development-tool.js`.

## Documentation

Documentation is available on the
[development-tool docs site](https://github.com/zhouhoujun/development-tool).

## License

MIT © [Houjun](https://github.com/zhouhoujun/)