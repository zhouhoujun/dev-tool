import { ITaskLoader } from './ITaskLoader';
import { DirLoader } from './loaders/DirLoader';
import { IContext } from './IContext';
import { ITaskOption, ILoaderOption, IDynamicLoaderOption } from './TaskOption'
import { ModuleLoader } from './loaders/ModuleLoader';
import { DynamicLoader } from './loaders/DynamicLoader';
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
     * create loader;
     *
     * @param {IContext} context
     * @returns {ITaskLoader}
     *
     * @memberof ILoaderFactory
     */
    create(context: IContext): ITaskLoader;
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
    create(context: IContext): ITaskLoader {
        let option = context.option as ITaskOption;
        if (_.isString(option.loader)) {
            option.loader = {
                module: option.loader
            };
            return new ModuleLoader(context);
        } else if (_.isFunction(option.loader)) {
            option.loader = <IDynamicLoaderOption>{
                dynamicTasks: context.to(option.loader) as IDynamicLoaderOption[]
            };
            return new DynamicLoader(context);
        } else if (_.isArray(option.loader)) {
            option.loader = <IDynamicLoaderOption>{
                dynamicTasks: option.loader || []
            };
            return new DynamicLoader(context);
        } else if (option.loader) {
            // if config dir.
            if (option.loader['dir']) {
                return new DirLoader(context);
            }

            // dynamic task name.
            if (_.isString(option.loader['name'])) {
                option.loader = <IDynamicLoaderOption>{
                    dynamicTasks: option.loader
                };
                return new DynamicLoader(context);
            }

            // if config pipe and taskName.
            if (option.loader['dynamicTasks']) {
                return new DynamicLoader(context);
            }

            let loader: ITaskLoader = null;
            let loderOption: ILoaderOption = option.loader;
            switch (loderOption.type) {
                case 'dir':
                    loader = new DirLoader(context);
                    break;

                case 'dynamic':
                    loader = new DynamicLoader(context);
                    break;

                case 'module':
                default:
                    loader = new ModuleLoader(context);
                    break;
            }
            return loader;
        } else {
            console.log(chalk.cyan(<string>option.name), chalk.gray('loader not setting, use dynamic loader.'))
            option.loader = <IDynamicLoaderOption>{
                dynamicTasks: []
            };
            return new DynamicLoader(context);
        }
    }
}
