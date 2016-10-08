# packaged development-tool

This repo is for distribution on `npm`. The source for this module is in the
[main repo](https://github.com/zhouhoujun/development-tool/src/mastert).
Please file issues and pull requests against that repo.
This package use to bundle jspm project by custom group. 

## Install

You can install this package either with `npm`.

### npm

```shell

npm install development-tool

```

You can `import` modules:

```js

import  { JSPMBuilder } from 'development-tool';

builder = new JSPMBuilder(options);
//bundle all ,setting in options.
builder.bundle();
//only bundle group1, setting in options .
builder.bundle('group1');
//bundle 'group1','group2','group2', setting in options .
builder.bundle(['group1','group2','group2'])

```

### jspm

```shell
jspm install github:zhouhoujun/development-tool
```
https://github.com/zhouhoujun/development-tool.git
The mocks are then available at `jspm_components/development-tool/development-tool.js`.

## Documentation

Documentation is available on the
[development-tool docs site](https://github.com/zhouhoujun/development-tool).

## License

MIT © [Houjun](https://github.com/zhouhoujun/)