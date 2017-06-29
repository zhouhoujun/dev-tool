import * as _ from 'lodash';
import { Gulp } from 'gulp';
import { Operation, ITaskConfig, Src, IAssertOption, IDynamicTaskOption, RunWay } from 'development-core';
import { TaskOption, ITaskOption } from './TaskOption';
import { IContext } from './IContext';
import { Context, createConextInstance } from './Context';

interface TaskSeq {
    opt: ITaskOption,
    seq: Src[]
}

/**
 * Development.
 *
 * @export
 * @class Development
 * @extends {Context}
 */
export class Development extends Context {

    /**
     * create development tool.
     *
     * @static
     * @param {Gulp} gulp
     * @param {string} root  root path.
     * @param {(ITaskConfig | Array<IAssertOption | ITaskOption | IDynamicTaskOption>)} setting
     * @param {any} [runWay=RunWay.sequence]
     * @returns {Development}
     *
     * @memberOf Development
     */
    static create(gulp: Gulp, root: string, setting: ITaskConfig | Array<IAssertOption | ITaskOption | IDynamicTaskOption>, name = '', runWay = RunWay.sequence): Development {
        let config: ITaskConfig;
        let option: ITaskOption;
        if (_.isArray(setting)) {
            config = { option: <ITaskOption>{ name: name, tasks: setting, runWay: runWay, loader: [] } };
        } else {
            config = setting;
            option = config.option as ITaskOption;
            option.name = option.name || name;
            if (!_.isUndefined(option.runWay)) {
                option.runWay = runWay;
            }
        }

        let devtool = new Development(config, root);
        devtool.start();
        return devtool;
    }

    /**
     * Creates an instance of Development.
     * @param {ITaskConfig} config
     * @param {string} root root path.
     * @param {IContext} [parent]
     * @memberof Development
     */
    public constructor(config: ITaskConfig, root: string, parent?: IContext) {
        super(config, parent);

        this.setConfig({
            env: { root: root },
            printHelp: this.cfg.printHelp || this.printHelp
        });
    }

    protected printHelp(help: string) {
        if (help === 'en') {

            console.log(`
                /**
                 * gulp [build] [--env production|development] [--context name] [--root path] [--watch] [--test] [--serve] [--release] [--task taskname]
                 * @params
                 *  --env  development or production;
                 *  --context app setting
                 *  --root path, set relative path of the development tool root.
                 *  --watch  watch src file change or not. if changed will auto update to node service.
                 *  --release release web app or not. if [--env production], default to release.
                 *  --test  need auto load test file to node service.
                 *  --deploy run deploy tasks to deploy project.
                 *  --serve start node web service or not.
                 *  --task taskname  spruce task taskname
                 **/`);

        } else {

            console.log(`
                /**
                 * gulp [build] [--env production|development] [--context name] [--root path] [--watch] [--test] [--serve] [--release] [--task taskname]
                 * @params
                 *  --env 发布环境 默认开发环境development;
                 *  --context 设置配置文件;
                 *  --root path, 设置编译环境相对路径
                 *  --watch  是否需要动态监听文件变化
                 *  --release 是否release编译, [--env production] 默认release
                 *  --test  启动自动化测试
                 *  --deploy 运行加载deploy tasks, 编译发布项目。
                 *  --serve  是否在开发模式下 开启node web服务
                 *  --task taskname  运行单独任务taskname
                 **/`);

        }
    }
}
