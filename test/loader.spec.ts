import * as mocha from 'mocha';
import { expect, assert } from 'chai';

import { ILoaderFactory, LoaderFactory } from '../src/loaderFactory';
import { Operation, ITask, ITaskConfig } from 'development-core';
import { ITaskLoader } from '../src/ITaskLoader';
import { IDirLoaderOption, IDynamicLoaderOption, ITaskOption } from '../src/TaskOption';
import { Context } from '../src/Context';

let root = __dirname;
import * as path from 'path';

describe('LoaderFactory', function () {
    var factory: ILoaderFactory;
    this.timeout(3000);

    beforeEach(() => {
        factory = new LoaderFactory();
    })

    it('create dynamic loader', async () => {
        let ctx = new Context({
            option: {
                src: 'src',
                loader: []
            },
            env: { config: 'test', watch: true }
        });


        let loader: ITaskLoader = factory.create(ctx);
        expect(ctx).to.not.null;
        expect(ctx).to.not.undefined;
        expect(ctx.env.config).to.equals('test');
        expect(ctx.oper).to.eq(Operation.build | Operation.watch);

        let option: ITaskOption = ctx.option;
        expect(Array.isArray(option.loader)).to.false;
        expect(Array.isArray(option.loader['dynamicTasks'])).to.true;

        let tasks = await loader.load();
        expect(tasks).not.null;
        expect(tasks.length).eq(0);
    });

    it('create dynamic loader with module', async () => {
        let ctx = new Context({
            option: {
                src: 'src',
                loader: <IDynamicLoaderOption>{ module: path.join(root, './tasks/task.ts'), dynamicTasks: [] }
            },
            env: { config: 'test', group: 'test' }
        });

        let loader: ITaskLoader = factory.create(ctx);

        expect(ctx).to.not.null;
        expect(ctx).to.not.undefined;
        expect(ctx.env.group).to.equals('test');
        expect(ctx.oper).to.eq(Operation.build);

        let option: ITaskOption = ctx.option;
        expect(Array.isArray(option.loader)).to.false;
        expect(Array.isArray(option.loader['dynamicTasks'])).to.true;


        let tasks = await loader.load();
        expect(tasks).not.null;
        expect(tasks.length).eq(1);


        let nogpctx = new Context({
            option: {
                src: 'src',
                loader: <IDynamicLoaderOption>{ module: path.join(root, './tasks/task.ts'), dynamicTasks: [] }
            },
            env: { config: 'test' }
        });
        let loader2: ITaskLoader = factory.create(nogpctx);

        expect(nogpctx).to.not.null;
        expect(nogpctx).to.not.undefined;
        expect(nogpctx.env.group).to.undefined;
        expect(nogpctx.oper).to.eq(Operation.build);

        let option2: ITaskOption = ctx.option;
        expect(Array.isArray(option2.loader)).to.false;
        expect(Array.isArray(option2.loader['dynamicTasks'])).to.true;

        let ntasks = await loader2.load();
        expect(ntasks).not.null;
        expect(ntasks.length).eq(1);
    });

    it('create directory loader', async () => {

        let ctx = new Context({
            option: {
                src: 'src',
                loader: <IDirLoaderOption>{ dir: path.join(root, './tasks') }
            },
            env: { config: 'test', deploy: true }
        })
        let loader: ITaskLoader = factory.create(ctx);

        expect(ctx).to.not.null;
        expect(ctx).to.not.undefined;
        expect(ctx.env.config).eq('test');
        expect(ctx.oper & Operation.deploy).eq(Operation.deploy);
        expect(ctx.option.src).to.eq('src');

        let tasks = await loader.load();
        expect(tasks).not.null;
        expect(tasks.length).eq(2);
    });


    it('create module loader', async function () {
        let ctx = new Context({
            option: {
                src: 'src',
                loader: path.join(root, './tasks/config.ts'),
            },
            env: {
                config: 'test',
                release: true
            }
        });
        let loader: ITaskLoader = factory.create(ctx);

        expect(ctx).to.not.null;
        expect(ctx).to.not.undefined;
        expect(ctx.env.config).to.equals('test');
        expect(ctx.oper).eq(Operation.release);

        let tasks = await loader.load();
        expect(tasks).not.null;
        expect(tasks.length).eq(2);
    });


    it('create taskDefine object loader', async () => {
        let ctx = new Context({
            option: {
                src: 'src',
                loader: {
                    taskDefine: {
                        loadConfig(option, env): ITaskConfig {
                            // register default asserts.
                            return <ITaskConfig>{
                                env: env,
                                option: option
                            }
                        },

                        loadTasks(config: ITaskConfig): Promise<ITask[]> {
                            return Promise.resolve([]);
                        }
                    }
                },
            },
            env: { config: 'test', release: true }
        });
        let loader: ITaskLoader = factory.create(ctx);

        expect(ctx).to.not.null;
        expect(ctx).to.not.undefined;
        expect(ctx.env.config).to.equals('test');
        expect(ctx.oper).to.eq(Operation.release);

        let tasks = await loader.load();
        expect(tasks).not.null;
        expect(tasks.length).eq(0);

    });

});
