import { IContextDefine, ITaskOption, findTaskDefineInModule, IEnvOption, ILoaderOption, taskDefine2Context } from 'development-core';
import { BaseLoader } from './BaseLoader';
import contextDefine from '../utils/contextDefine';
import * as chalk from 'chalk';

export class ModuleLoader extends BaseLoader {

    constructor(option: ITaskOption, env?: IEnvOption) {
        super(option, env);
    }

    protected getContextDefine(): IContextDefine | Promise<IContextDefine> {
        return new Promise((resolve, reject) => {
            let loader = <ILoaderOption>this.option.loader;
            if (loader) {
                if (loader.contextDefine) {
                    resolve(loader.contextDefine);
                } else if (loader.taskDefine) {
                    resolve(taskDefine2Context(loader.taskDefine));
                } else {
                    let mdl = this.getConfigModule();
                    findTaskDefineInModule(mdl)
                        .then(def => {
                            if (def) {
                                resolve(def);
                            } else {
                                resolve(contextDefine(this.getTaskModule()));
                            }
                        })
                        .catch(err => {
                            console.error(chalk.red(err));
                            resolve(contextDefine(this.getTaskModule()));
                        });
                }
            } else {
                reject('loader not found.');
            }
        });
    }
}
