import * as _ from 'lodash';
import * as gulp from 'gulp';
import { readdirSync, lstatSync } from 'fs';
// import * as path from 'path';
import * as runSequence from 'run-sequence';
import * as minimist from 'minimist';
import { ITaskLoader } from './ITaskLoader';
import { LoaderFactory } from './LoaderFactory';
import { Src, Task, TaskOption, Operation, EnvOption, TaskConfig, TaskNameSequence } from './TaskConfig';
import { DevelopConfig } from './DevelopConfig';


export * from './DevelopConfig';
export * from './TaskConfig';
export * from './ITaskLoader';
export * from './LoaderFactory';
export * from './loaders/BaseLoader';

export class Development {
    static create(dirname: string, option?: DevelopConfig): Development {
        let devtool = new Development(dirname, option);
        gulp.task('build', () => {
            var options: EnvOption = minimist(process.argv.slice(2), {
                string: 'env',
                default: { env: process.env.NODE_ENV || 'development' }
            });
            return devtool.run(options);
        });

        gulp.task('default', ['build']);
        return devtool;
    }

    private constructor(private dirname: string, protected option: DevelopConfig) {
    }

    run(env: EnvOption) {

        if (!env.root) {
            env.root = this.dirname;
        }
        return Promise.all(
            _.map(_.isArray(this.option.tasks) ? <TaskOption[]>this.option.tasks : [<TaskOption>this.option.tasks], optask => {
                console.log('begin load task.', optask.loader);
                let loader = this.createLoader(optask);
                let oper;
                if (env.deploy) {
                    oper = Operation.deploy;
                } else if (env.release) {
                    oper = Operation.release;
                } else if (env.e2e) {
                    oper = Operation.e2e;
                } else if (env.test) {
                    oper = Operation.test;
                } else {
                    oper = Operation.build;
                }
                return loader.loadConfg(oper, env)
                    .then(cfg => {
                        if (cfg.env.help) {
                            if (cfg.printHelp) {
                                cfg.printHelp(_.isString(cfg.env.help) ? cfg.env.help : '');
                            } else {
                                this.printHelp(cfg.env.help);
                            }
                            return null;
                        } else {
                            return loader.load(oper)
                                .then(tasks => {
                                    return this.setup(cfg, tasks)
                                });
                        }
                    })
                    .then(tasksq => {
                        if (!tasksq) {
                            return null;
                        } else {
                            return new Promise((reslove, reject) => {
                                tasksq.push(() => {
                                    reslove();
                                });
                                runSequence.call(runSequence, tasksq);
                            });
                        }
                    });
            }));
    }

    protected toSquence(tasks: Array<Src | void>): TaskNameSequence {
        return <TaskNameSequence>_.filter(tasks, t => !!t);
    }

    protected setup(config: TaskConfig, tasks: Task[]): Promise<TaskNameSequence> {
        return Promise.all(_.map(tasks, t => {
            return t(config);
        }))
            .then(ts => {

                let tsqs: TaskNameSequence = config.runTasks ? config.runTasks() : this.toSquence(ts);
                if (config.option.runTasks) {
                    if (_.isArray(config.option.runTasks)) {
                        tsqs = config.option.runTasks;
                    } else if (_.isFunction(config.option.runTasks)) {
                        tsqs = config.option.runTasks(config.oper, tsqs);
                    }
                }
                return tsqs;

            });
    }

    protected createLoader(option: TaskOption): ITaskLoader {
        let loader = null;
        if (!_.isFunction(this.option.loaderFactory)) {
            let factory = new LoaderFactory();
            this.option.loaderFactory = (opt: TaskOption) => {
                return factory.create(opt);
            }
        }
        loader = this.option.loaderFactory(option);
        return loader;
    }


    protected printHelp(help: boolean | string) {
        if (help === 'en') {

            console.log(`
                /**\n
                 * gulp build [--env production|development] [--config name] [--aspnet] [--root rootPath] [--watch] [--test] [--serve] [--release]\n
                 * @params\n
                 *  --env  development or production;\n
                 *  --config app setting, name is the words(src/config-*.json)*; default settings: test, produce, beijing; Or you can add youself setting config file at the path and named as "src/config-*.json" /\n
                 *  --root rootPath, set relative path of the app root\n
                 *  --aspnet to set build as aspnet service or not.\n
                 *  --watch  watch src file change or not. if changed will auto update to node service. \n
                 *  --release release web app or not. if [--env production], default to release. \n
                 *  --test  need auto load test file to node service.\n
                 *  --testdata load test data when release.  \n
                 *  --serve start node web service or not.\n
                 * \nn\
                 * gulp test  start node auto test. Before test you need start anthor commond to watch file changed, and must with "--test" to load test file.\nn\
                 * gulp language [--localspath language path][--lang en][--csv filepath][--key 0][--value 1]\n
                 *  auto check and update language config from csv file to json file.\n
                 **/\n`);

        } else {

            console.log(`
                /**\n
                 * gulp build 启动编译工具 [--env production|development] [--config name] [--aspnet] [--root rootPath] [--watch] [--test] [--serve] [--release]\n
                 * @params\n
                 *  --env 发布环境 默认开发环境development;\n
                 *  --config 设置配置文件， name为配置文件(src/config-*.json)中*的名字; 默认配置有test, produce, beijing; 可以手动添加自己要的配置，配置文件命名路径规则src/config-*.json /\n
                 *  --root rootPath, 设置前端APP相对站点路径\n
                 *  --aspnet 是否发布为 aspnet服务环境\n
                 *  --watch  是否需要动态监听文件变化\n
                 *  --release 是否release编译, [--env production] 默认release \n
                 *  --test  启动自动化测试\n
                 *  --testdata 是否release编译加载test data。  \n
                 *  --serve  是否在开发模式下 开启node web服务\n
                 * \nn\
                 * gulp tools  启动工具集合\nn\
                 * @params\n
                 *  --language [--localspath language path][--lang en][--csv filepath][--key 0][--value 1]\n 设置多语言\n
                 *  --publish 发布git npm
                 **/\n`);

        }
    }
}


/**
 * filter fileName in directory.
 * 
 * @export
 * @param {string} directory
 * @param {((fileName: string) => boolean)} [express]
 * @returns {string[]}
 */
export function files(directory: string, express?: ((fileName: string) => boolean)): string[] {
    let res: string[] = [];
    express = express || ((fn) => true);
    _.each(readdirSync(directory), fname => {
        let filePn = directory + '/' + fname;
        var fst = lstatSync(filePn);
        if (!fst.isDirectory()) {
            if (express(filePn)) {
                res.push(filePn)
            }
        } else {
            res = res.concat(files(filePn, express))
        }
    });
    return res;
}
