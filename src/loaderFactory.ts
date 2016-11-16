import { ITaskLoader } from './ITaskLoader';
import { DirLoader } from './loaders/DirLoader';
import { ITaskOption, ILoaderOption, IDynamicLoaderOption, IEnvOption } from 'development-core';
import { ModuleLoader } from './loaders/ModuleLoader';
import { DynamicLoader } from './loaders/DynamicLoader';
import { CustomLoader } from './loaders/CustomLoader';
import * as _ from 'lodash';
import * as chalk from 'chalk';

/**
 * loader factory.
 * 
 * @export
 * @interface ILoaderFactory
 */
export interface ILoaderFactory {
    /**
     * create loader.
     * 
     * @param {ITaskOption} option
     * @param {IEnvOption} [env]
     * @returns {ITaskLoader}
     * 
     * @memberOf ILoaderFactory
     */
    create(option: ITaskOption, env?: IEnvOption): ITaskLoader;
}


/**
 * loader factory.
 * 
 * @export
 * @class LoaderFactory
 * @implements {ILoaderFactory}
 */
export class LoaderFactory implements ILoaderFactory {

    constructor() {
    }
    create(option: ITaskOption, env?: IEnvOption): ITaskLoader {

        if (_.isString(option.loader)) {
            option.loader = {
                module: option.loader
            };
            return new ModuleLoader(option);
        } else if (_.isFunction(option.loader)) {
            return new CustomLoader(option, option.loader);
        } else if (_.isArray(option.loader)) {
            option.loader = <IDynamicLoaderOption>{
                dynamicTasks: option.loader || []
            };
            return new DynamicLoader(option);
        } else if (option.loader) {
            // if config dir.
            if (option.loader['dir']) {
                return new DirLoader(option, env);
            }

            // dynamic task name.
            if (_.isString(option.loader['name'])) {
                option.loader = <IDynamicLoaderOption>{
                    dynamicTasks: option.loader
                };
                return new DynamicLoader(option);
            }

            // if config pipe and taskName.
            if (option.loader['dynamicTasks']) {
                return new DynamicLoader(option);
            }

            let loader: ITaskLoader = null;
            let loderOption: ILoaderOption = option.loader;
            switch (loderOption.type) {
                case 'dir':
                    loader = new DirLoader(option, env);
                    break;

                case 'dynamic':
                    loader = new DynamicLoader(option);
                    break;

                case 'module':
                default:
                    loader = new ModuleLoader(option, env);
                    break;
            }
            return loader;
        } else {
            console.log(chalk.cyan(<string>option.name), chalk.yellow('loader not setting, use dynamic loader.'))
            option.loader = <IDynamicLoaderOption>{
                dynamicTasks: []
            };
            return new DynamicLoader(option);
        }
    }
}
