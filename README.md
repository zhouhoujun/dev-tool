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
    tasks{src: 'src', dist: 'lib', loader: 'development-tool-*' } // any module implement ITaskDefine
});

//or create mutil task for web client, node server.
Development.create(gulp, __dirname, {
    tasks[
        {src: 'src/client', dist: 'public', loader: 'development-tool-web', tasks:[...] }, // any module implement ITaskDefine
        {src: 'src/server', dist: 'lib', loader: 'development-tool-node', tasks:[...] }
        ...
    ]
});

```

```ts
import * as gulp from 'gulp';
import  { Development } from 'development-tool';
import { NodeBuildOption } from 'development-tool-node';
Development.create(gulp, __dirname, {
    tasks:[
        <NodeBuildOption>{
            src: 'src',
            dist: 'lib',
            // build:'build path',
            // release: 'release path',
            // depoly: 'depoly path'
            asserts:{
                json: 'src/**/*.json',
                css:'src/common/**/*.css',
                moduleBcss: ['src/moduleB/**/*.css'],
                moduleAcss: {
                    src: ['src/apath/**/*.css', 'src/bpath/**/*.css'],
                    dist:'dist path',
                    build:'build path',
                    release: 'release path',
                    depoly: 'depoly path'
                },
                ...
            },
            loader: 'development-tool-node'
        }
    ]
});
```

## Create development tool with addation sub tasks

```ts
Development.create(gulp, __dirname, {
    tasks:{
        src: 'src',
        dist: 'lib',
        loader: 'development-tool-node',
        tasks:[
            {
                src: 'files be dealt with',
                dist: 'dist path',
                // build:'build path',
                // release: 'release path',
                // depoly: 'depoly path',
                loader:'development-tool-*' //the module must implement ITaskDefine.
            },
            {
                src: ['src/apath/**/*.css', 'src/bpath/**/*.css'],
                dist: 'dist path',
                // build:'build path',
                // release: 'release path',
                // depoly: 'depoly path',
                loader: {
                    configModule: path.join(__dirname, './src/task.ts'), //the module must implement ITaskDefine.
                    dir: [path.join(__dirname, './src/mytasks')]
                },
                tasks: [
                    {
                        src: 'files be dealt with',
                        dist: 'dist path',
                        // build:'build path',
                        // release: 'release path',
                        // depoly: 'depoly path',
                        loader: {
                            //./src/mytasks folder must has module implement ITaskDefine.
                            dir: path.join(__dirname, './src/mytasks')
                        }
                    },
                    {
                        src: 'files be dealt with',
                        dist: 'dist path',
                        // build:'build path',
                        // release: 'release path',
                        // depoly: 'depoly path',
                        loader: {
                            module: path.join(__dirname, './src/mytasks/dosomething'),
                            configModule: path.join(__dirname, './src/mytasks/config') //the module must implement ITaskDefine.
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
import { Development, TaskConfig, DynamicTask } from 'development-tool';

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
                task: (config) => del(config.option.dist)
            },
            {
                name: 'tscompile',
                pipes: [
                    () => cache('typescript'),
                    sourcemaps.init,
                    tsProject
                ],
                // set muti-output. no setting default output default one to "dist: 'lib'" .
                output: [
                    (tsmap, config) =>  tsmap.dts.pipe(gulp.dest(config.getDist())),
                    (tsmap, config) =>  tsmap.js.pipe(sourcemaps.write('./sourcemaps')).pipe(gulp.dest(config.getDist()))
                ]
            },
            {
                name: 'watch',
                watch: ['tscompile']
            }
        ]
    }
});


// or with task from module
Development.create(gulp, __dirname, {
    tasks: {
        src: 'src/**/*.ts',
        dist: 'lib',
        loader: {
            module:'module name',
            dynamicTasks:[
                {
                    name: 'clean',
                    task: (config) => del(config.option.dist)
                },
                {
                    name: 'tscompile',
                    pipes: [
                        () => cache('typescript'),
                        sourcemaps.init,
                        tsProject
                    ],
                    // set muti-output. no setting default output default one to "dist: 'lib'" .
                    output: [
                        (tsmap, config) =>  tsmap.dts.pipe(gulp.dest(config.getDist())),
                        (tsmap, config) =>  tsmap.js.pipe(sourcemaps.write('./sourcemaps')).pipe(gulp.dest(config.getDist()))
                    ]
                },
                {
                    name: 'watch',
                    watch: ['tscompile']
                }
            ]
        }
    }
});
```

https://github.com/zhouhoujun/development-tool.git
The mocks are then available at `jspm_components/development-tool/development-tool.js`.

## Documentation

Documentation is available on the
[development-tool docs site](https://github.com/zhouhoujun/development-tool).

## License

MIT © [Houjun](https://github.com/zhouhoujun/)