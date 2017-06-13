import { ITaskDefine } from 'development-core';
import { ITaskOption, ILoaderOption } from '../TaskOption';
import { BaseLoader } from './BaseLoader';
import { IContext } from '../IContext';
import taskDefine from '../utils/taskDefine';
import * as chalk from 'chalk';

export class ModuleLoader extends BaseLoader {

    constructor(ctx: IContext) {
        super(ctx);
    }

    protected loadTaskDefine(): ITaskDefine | Promise<ITaskDefine> {
        return new Promise((resolve, reject) => {
            let loader = <ILoaderOption>this.option.loader;
            if (loader) {
                if (loader.taskDefine) {
                    resolve(loader.taskDefine);
                } else {
                    let mdl = this.getConfigModule();
                    this.ctx.findTaskDefine(mdl)
                        .then(def => {
                            if (def) {
                                resolve(def);
                            } else {
                                resolve(taskDefine(this.getTaskModule()));
                            }
                        })
                        .catch(err => {
                            console.error(chalk.red(err));
                            resolve(taskDefine(this.getTaskModule()));
                        });
                }
            } else {
                reject('loader not found.');
            }
        });
    }
}
