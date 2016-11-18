import * as mocha from 'mocha';
import { expect, assert } from 'chai';

import { ILoaderFactory, LoaderFactory } from '../src/loaderFactory';
import { Operation, ITask, ITaskConfig, ITaskContext } from 'development-core';
import { ITaskLoader } from '../src/ITaskLoader';
import { IDirLoaderOption, IDynamicLoaderOption, IAssertOption } from '../src/TaskOption';

let root = __dirname;
import * as path from 'path';

describe('LoaderFactory', () => {
    var factory: ILoaderFactory;

    beforeEach(() => {
        factory = new LoaderFactory();
    })

    it('create dynamic loader', async function () {
        let loader: ITaskLoader = factory.create({
            src: 'src',
            loader: []
        });

        let taskconfig: ITaskContext = await loader.loadContext({ config: 'test', watch: true });

        expect(taskconfig).to.not.null;
        expect(taskconfig).to.not.undefined;
        expect(taskconfig.env.config).to.equals('test');
        expect(taskconfig.oper).to.eq(Operation.build | Operation.watch);

        let option: IAssertOption = taskconfig.option;
        expect(Array.isArray(option.loader)).to.false;
        expect(Array.isArray(option.loader['dynamicTasks'])).to.true;

        let tasks = await loader.load(taskconfig);
        expect(tasks).not.null;
        expect(tasks.length).eq(0);
    });

    it('create dynamic loader with module', async function () {
        let loader: ITaskLoader = factory.create({
            src: 'src',
            loader: <IDynamicLoaderOption>{ module: path.join(root, './tasks/task.ts'), dynamicTasks: [] }
        });

        let taskconfig: ITaskContext = await loader.loadContext({ config: 'test', group: 'test' });

        expect(taskconfig).to.not.null;
        expect(taskconfig).to.not.undefined;
        expect(taskconfig.env.group).to.equals('test');
        expect(taskconfig.oper).to.eq(Operation.build);

        let option: IAssertOption = taskconfig.option;
        expect(Array.isArray(option.loader)).to.false;
        expect(Array.isArray(option.loader['dynamicTasks'])).to.true;

        let tasks = await loader.load(taskconfig);
        expect(tasks).not.null;
        expect(tasks.length).eq(1);


        let nogptaskconfig: ITaskContext = await loader.loadContext({ config: 'test' });

        expect(nogptaskconfig).to.not.null;
        expect(nogptaskconfig).to.not.undefined;
        expect(nogptaskconfig.env.group).to.undefined;
        expect(nogptaskconfig.oper).to.eq(Operation.build);

        let option2: IAssertOption = taskconfig.option;
        expect(Array.isArray(option2.loader)).to.false;
        expect(Array.isArray(option2.loader['dynamicTasks'])).to.true;

        let ntasks = await loader.load(nogptaskconfig);
        expect(ntasks).not.null;
        expect(ntasks.length).eq(1);
    });

    it('create directory loader', async function () {
        let loader: ITaskLoader = factory.create({
            src: 'src',
            loader: <IDirLoaderOption>{ dir: path.join(root, './tasks') }
        });

        let taskconfig: ITaskContext = await loader.loadContext({ config: 'test', deploy: true });

        expect(taskconfig).to.not.null;
        expect(taskconfig).to.not.undefined;
        expect(taskconfig.env.config).eq('test');
        expect(taskconfig.oper).eq(Operation.deploy);
        expect(taskconfig.option.src).to.eq('src');

        let tasks = await loader.load(taskconfig);
        expect(tasks).not.null;
        expect(tasks.length).eq(2);
    });


    it('create module loader', async function () {
        let loader: ITaskLoader = factory.create({
            src: 'src',
            loader: path.join(root, './tasks/config.ts')
        });

        let taskconfig: ITaskContext = await loader.loadContext({ config: 'test', release: true });
        expect(taskconfig).to.not.null;
        expect(taskconfig).to.not.undefined;
        expect(taskconfig.env.config).to.equals('test');
        expect(taskconfig.oper).eq(Operation.release);

        let tasks = await loader.load(taskconfig);
        expect(tasks).not.null;
        expect(tasks.length).eq(2);
    });


    it('create taskDefine object loader', async function () {
        let loader: ITaskLoader = factory.create({
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
            }
        });

        let taskconfig: ITaskContext = await loader.loadContext({ config: 'test', release: true });

        expect(taskconfig).to.not.null;
        expect(taskconfig).to.not.undefined;
        expect(taskconfig.env.config).to.equals('test');
        expect(taskconfig.oper).to.eq(Operation.release);

        let tasks = await loader.load(taskconfig);
        expect(tasks).not.null;
        expect(tasks.length).eq(0);

    });

});
