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

let tasks: TaskOption| TaskOption[];
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