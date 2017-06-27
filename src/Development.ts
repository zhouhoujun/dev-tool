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
        })

        this.builder();
    }

    /**
     * build context component.
     *
     * @protected
     * @memberof Development
     */
    protected builder() {
        let opt = this.option as ITaskOption;
        this.buildContext(opt, this);
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

    /**
     * build asserts tasks.
     *
     * @protected
     * @param {ITaskContext} ctx
     *
     * @memberOf Development
     */
    protected buildAssertContext(ctx: IContext) {
        let optask = <ITaskOption>ctx.option;
        // console.log('assert options:', optask);


        let tasks: ITaskOption[] = [];
        _.each(_.keys(optask.asserts), name => {
            let op: ITaskOption;
            let sr = optask.asserts[name];
            if (_.isString(sr)) {
                op = <ITaskOption>{ src: sr };
            } else if (_.isNumber(sr)) {
                // watch with Operation.autoWatch.
                op = <ITaskOption>{ loader: [{ oper: sr, name: name, pipes: [] }] };
            } else if (_.isFunction(sr)) {
                op = <ITaskOption>{ loader: sr };
            } else if (_.isArray(sr)) {
                if (sr.length > 0) {
                    if (!_.some(<string[]>sr, it => !_.isString(it))) {
                        op = <ITaskOption>{ src: <string[]>sr };
                    } else {
                        op = <ITaskOption>{ loader: <IDynamicTaskOption[]>sr, watch: true };
                    }
                }
            } else {
                op = sr;
            }

            if (_.isNull(op) || _.isUndefined(op)) {
                return;
            }
            if (!op.loader) {
                op.loader = [{ name: name, pipes: [], watch: true }]
            }
            op.name = op.name || ctx.subTaskName(name);
            op.src = op.src || (ctx.getSrc({ oper: Operation.default }) + '/**/*.' + name);
            // op.dist = op.dist || ctx.getDist({ oper: Operation.build });
            op.runWay = op.runWay || optask.assertsRunWay || RunWay.parallel;
            tasks.push(op);
        });
        // console.log('assert tasks:', tasks);
        this.buildContext(tasks, ctx);
    }

    protected buildContext(taskOptions: TaskOption, parent: IContext) {
        let tasks: ITaskOption[] = _.isArray(taskOptions) ? taskOptions : [taskOptions];

        tasks.forEach(optask => {
            if (optask.oper && this.oper && (this.oper & optask.oper) <= 0) {
                return;
            }
            let ctx = createConextInstance(optask, parent);
            if (optask.asserts) {
                let assert = createConextInstance(_.extend({ name: 'asserts', loader: [], asserts: optask.asserts, order: optask.assertsOrder, assertsRunWay: optask.assertsRunWay }), ctx);
                this.buildAssertContext(assert);
            }
            if (optask.tasks) {
                this.buildSubContext(ctx);
            }
        });
    }

    /**
     * build sub context.
     *
     * @protected
     * @param {IContext} ctx
     *
     * @memberOf Development
     */
    protected buildSubContext(ctx: IContext) {

        let optask = <ITaskOption>ctx.option;
        // console.log('task options:', optask);
        if (!optask.tasks) {
            return;
        }
        let tasks = _.isArray(optask.tasks) ? optask.tasks : [optask.tasks];
        let subtasks = tasks.map(subopt => {
            if (!subopt.order) {
                let subOrder = ctx.to(optask.subTaskOrder);
                if (!_.isNumber(subOrder) && subOrder) {
                    optask.order = optask.order || subOrder.runWay;
                } else if (optask.subTaskRunWay) {
                    subopt.order = { runWay: optask.subTaskRunWay };
                }
            }
            subopt.name = ctx.subTaskName(subopt.name);
            return subopt;
        });
        this.buildContext(subtasks, ctx);

    }
}
