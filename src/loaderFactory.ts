import { ITaskLoader } from './ITaskLoader';
import { DirLoader } from  './loaders/DirLoader';
import { LoaderOption } from './TaskConfig';
import { ModuleLoader } from  './loaders/ModuleLoader';

/**
 * loader factory.
 * 
 * @export
 * @interface ILoaderFactory
 */
export interface ILoaderFactory {
    create(option: LoaderOption): ITaskLoader;
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
    create(option: LoaderOption): ITaskLoader {
        let loader = null;
        switch (option.type) {
            case 'dir':
                loader = new DirLoader(option.dir);
                break;

            case 'module':
            default:
                loader = new ModuleLoader(option.module);
                break;
        }
        return loader;
    }
}
