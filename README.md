# packaged development-tool

This repo is for distribution on `npm`. The source for this module is in the
[main repo](https://github.com/zhouhoujun/development-tool/src/mastert).
Please file issues and pull requests against that repo.
This package use to develop kit for project development via gulp tasks.

## Install

You can install this package either with `npm`.

### npm

```shell

npm install development-tool

```

You can `import` modules:

```ts
import * as gulp from 'gulp';
import  { Development, TaskOption } from 'development-tool';
import  { NodeBuildOption } from 'development-tool-node';
// import 'development-tool-*';
let tasks: TaskOption| TaskOption[]= [
    <NodeBuildOption>{
        src: 'src',
        dist: 'lib',
        asserts: {
            json: 'src/**/*.json',
            css: {src: 'src/**/*.css', dist:'lib/style'}
        },
        loader: {
            module: 'development-tool-node' //the module must implement ITaskDefine.
        },
        tasks: [
            {
                src: 'files be dealt with',
                dist: 'dist',
                loader:{
                    module:'development-tool-*' //the module must implement ITaskDefine.
                }
            },
            {
                src: 'src/**/*.css',
                dist: 'dist',
                loader: {
                    configModule: path.join(__dirname, './src/task.ts'), //the module must implement ITaskDefine.
                    dir: [path.join(__dirname, './src/mytasks')]
                },
                tasks: [
                    {
                        src: 'files be dealt with',
                        dist: 'dist',
                        loader: {
                            //./src/mytasks folder must has module implement ITaskDefine.
                            dir: path.join(__dirname, './src/mytasks')
                        }
                    },
                    {
                        src: 'files be dealt with',
                        dist: 'dist',
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
    ...
];
Development.create(gulp, __dirname, {
    tasks:tasks
});


```

https://github.com/zhouhoujun/development-tool.git
The mocks are then available at `jspm_components/development-tool/development-tool.js`.

## Documentation

Documentation is available on the
[development-tool docs site](https://github.com/zhouhoujun/development-tool).

## License

MIT © [Houjun](https://github.com/zhouhoujun/)