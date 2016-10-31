import * as _ from 'lodash';
import {
    bindingConfig, ITask, IEnvOption, Operation
    , ITaskOption, ILoaderOption, ITaskConfig, ITaskDefine
    , findTaskDefineInModule
} from 'development-core';
import { ITaskLoader } from '../ITaskLoader';
// import * as chalk from 'chalk';
import dynamicTaskDefine from './dynamicTaskDefine';
export abstract class BaseLoader implements ITaskLoader {

    protected option: ITaskOption;
    constructor(option: ITaskOption) {
        this.option = option;
    }

    load(cfg: ITaskConfig): Promise<ITask[]> {
        return this.getTaskDefine()
            .then(def => {
                if (def.loadTasks) {
                    return def.loadTasks(cfg);
                } else {
                    let mdl = this.getTaskModule();
                    return cfg.findTasks(mdl);
                }
            })
            .catch(err => {
                console.error(err);
            });
    }

    loadConfg(oper: Operation, env: IEnvOption): Promise<ITaskConfig> {

        return this.getTaskDefine()
            .then(def => {
                return def.loadConfig(oper, this.option, env);
            })
            .then(config => {
                return this.bindingConfig(config);
            })
            .catch(err => {
                console.error(err);
            });
    }

    protected bindingConfig(cfg: ITaskConfig): ITaskConfig {
        cfg = bindingConfig(cfg);
        return cfg;
    }

    protected getTaskDefine(): Promise<ITaskDefine> {
        return new Promise((resolve, reject) => {
            let loader: ILoaderOption = this.option.loader;

            if (loader.taskDefine) {
                resolve(loader.taskDefine);
            } else {
                let mdl = this.getConfigModule();
                findTaskDefineInModule(mdl)
                    .then(def => {
                        resolve(def);
                    })
                    .catch(err => {
                        resolve(dynamicTaskDefine(mdl));
                    });
            }
        });
    }

    protected getConfigModule(): string | Object {
        let loader: ILoaderOption = this.option.loader;
        return loader.configModule || loader.module;
    }

    protected getTaskModule(): string | Object {
        let loader: ILoaderOption = this.option.loader;
        return loader.taskModule || loader.module;
    }
}
