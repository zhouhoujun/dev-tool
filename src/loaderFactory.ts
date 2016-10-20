import { ITaskLoader } from './ITaskLoader';
import { DirLoader } from  './loaders/DirLoader';
import { TaskOption } from './TaskConfig';
import { ModuleLoader } from  './loaders/ModuleLoader';

/**
 * loader factory.
 * 
 * @export
 * @interface ILoaderFactory
 */
export interface ILoaderFactory {
    create(option: TaskOption): ITaskLoader;
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
    create(option: TaskOption): ITaskLoader {
        let loader = null;
        console.log('create loader via type:', option.loader.type);
        switch (option.loader.type) {
            case 'dir':
                loader = new DirLoader(option);
                break;

            case 'module':
            default:
                loader = new ModuleLoader(option);
                break;
        }
        return loader;
    }
}
