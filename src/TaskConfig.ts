import { Gulp, WatchEvent, WatchCallback } from 'gulp';

/**
 * project development build operation.
 * 
 * @export
 * @enum {number}
 */
export enum Operation {
    /**
     * build compile project.
     */
    build,
    /**
     * test project.
     */
    test,
    /**
     * e2e test project.
     */
    e2e,
    /**
     * release project.
     */
    release,
    /**
     * release and deploy project.
     */
    deploy
}

/**
 * object map.
 * 
 * @export
 * @interface IMap
 * @template T
 */
export interface IMap<T> {
    [K: string]: T;
}

/**
 * src
 */
export type Src = string | string[];

export type Task = (gulp: Gulp, config: TaskConfig) => Src | void;

/**
 * event option
 * 
 * @export
 * @interface EnvOption
 */
export interface EnvOption {
    /**
     * project root.
     * 
     * @type {string}
     * @memberOf EnvOption
     */
    root?: string;
    /**
     * help doc
     * 
     * @type {(boolean | string)}
     * @memberOf EnvOption
     */
    help?: boolean | string;
    test?: boolean | string;
    serve?: boolean | string;
    e2e?: boolean | string;
    release?: boolean;
    deploy?: boolean;
    watch?: boolean | string;
    /**
     * run spruce task.
     */
    task?: string;

    /**
     * project config setting.
     * 
     * @type {string}
     * @memberOf EnvOption
     */
    config?: string;

    // key?: number;
    // value?: number;
    // csv?: string;
    // dist?: string;
    // lang?: string;

    publish?: boolean | string;

    /**
     * group bundle.
     * 
     * @type {Src}
     * @memberOf EnvOption
     */
    grp?: Src;
}

/**
 * task loader option.
 * 
 * @export
 * @interface LoaderOption
 */
export interface LoaderOption {
    /**
     * loader type, default module.
     * 
     * @type {string}
     * @memberOf LoaderOption
     */
    type?: string;
    /**
     * module name or url
     * 
     * @type {string | Object}
     * @memberOf LoaderOption
     */
    module?: string | Object;

    /**
     * config module name or url.
     * 
     * @type {string | Object}
     * @memberOf LoaderOption
     */
    configModule?: string | Object;

    /**
     * config module name or url.
     * 
     * @type {string | Object}
     * @memberOf LoaderOption
     */
    taskModule?: string | Object;

    /**
     * task define.
     * 
     * @type {ITaskDefine}
     * @memberOf LoaderOption
     */
    taskDefine?: ITaskDefine;

    /**
     * custom external judage the object is right task func.
     * 
     * @param {*} mdl
     * @param {string} name
     * @returns {boolean}
     * 
     * @memberOf LoaderOption
     */
    isTaskFunc?(mdl: any): boolean;
    /**
     * custom external judage the object is right task define.
     * 
     * @param {*} mdl
     * @returns {boolean}
     * 
     * @memberOf LoaderOption
     */
    isTaskDefine?(mdl: any): boolean;
}

/**
 * loader to load tasks from directory.
 * 
 * @export
 * @interface DirLoaderOption
 * @extends {LoaderOption}
 */
export interface DirLoaderOption extends LoaderOption {
    /**
     * loader dir
     * 
     * @type {string[]}
     * @memberOf LoaderOption
     */
    dir?: string[];
    /**
     * config in directory. 
     * 
     * @type {string}
     * @memberOf DirLoaderOption
     */
    dirConfigFile?: string;
}


/**
 * transform interface.
 * 
 * @export
 * @interface ITransform
 * @extends {NodeJS.ReadWriteStream}
 */
export interface ITransform extends NodeJS.ReadWriteStream {
    /**
     * transform pipe
     * 
     * @param {NodeJS.ReadWriteStream} stream
     * @returns {ITransform}
     * 
     * @memberOf ITransform
     */
    pipe(stream: NodeJS.ReadWriteStream): ITransform;
}

/**
 * output transform. support typescript output.
 * 
 * @export
 * @interface Output
 * @extends {ITransform}
 */
export interface Output extends ITransform {
    dts?: ITransform;
    js?: ITransform
}

export type Pipe = (config?: TaskConfig) => ITransform | Promise<ITransform>;

export type OutputPipe = (map: Output, config?: TaskConfig) => ITransform | Promise<ITransform>;

/**
 * dynamic gulp task.
 * 
 * @export
 * @interface DynamicTask
 */
export interface DynamicTask {
    /**
     * task name
     * 
     * @type {string}
     * @memberOf DynamicTask
     */
    name: string;
    /**
     * task type.
     * 
     * @type {Operation}
     * @memberOf DynamicTask
     */
    oper?: Operation;

    /**
     * task is watch or not.
     * 
     * @type {(boolean|string)}
     * @memberOf DynamicTask
     */
    watch?: Array<string | WatchCallback>;
    /**
     * watch changed.
     * 
     * @param {WatchEvent} event
     * @param {TaskConfig} config
     * 
     * @memberOf DynamicTask
     */
    watchChanged?(event: WatchEvent, config: TaskConfig);
    /**
     * stream pipe.
     * 
     * @param {ITransform} gulpsrc
     * @param {TaskConfig} config
     * @returns {(ITransform | Promise<ITransform>)}
     * 
     * @memberOf DynamicTask
     */
    pipe?(gulpsrc: ITransform, config: TaskConfig): ITransform | Promise<ITransform>;

    /**
     * task pipe works.
     * 
     * @type {(Pipe| Pipe[])}
     * @memberOf DynamicTask
     */
    pipes?: Pipe | Pipe[];

    /**
     * output pipe task
     * 
     * @type {(OutputPipe | OutputPipe[])}
     * @memberOf DynamicTask
     */
    output?: OutputPipe | OutputPipe[];

    /**
     * custom task.
     * 
     * @param {TaskConfig} config
     * @param {Gulp} gulp
     * @returns {(void | ITransform | Promise<any>)}
     * 
     * @memberOf DynamicTask
     */
    task?(config: TaskConfig, gulp: Gulp): void | ITransform | Promise<any>;

}

/**
 * the option for loader dynamic build task.
 * 
 * @export
 * @interface DynamicLoaderOption
 * @extends {LoaderOption}
 */
export interface DynamicLoaderOption extends LoaderOption {
    /**
     * dynamic task
     * 
     * @type {(DynamicTask | DynamicTask[])}
     * @memberOf DynamicLoaderOption
     */
    dynamicTasks?: DynamicTask | DynamicTask[];
}

/**
 * asserts to be dealt with.
 * 
 * @export
 * @interface Asserts
 */
export interface Asserts {
    /**
     * the src file filter string. default 'src'.
     * 
     * @type {string}
     * @memberOf Asserts
     */
    src: Src;
    /**
     * default folder. if empty use parent setting, or ues 'dist'.
     */
    dist?: string;
    /**
     * build folder. if empty use parent setting, or ues 'dist'.
     * 
     * @type {string}
     * @memberOf Asserts
     */
    build?: string;
    /**
     * release folder. if empty use parent setting, or ues 'dist'.
     * 
     * @type {string}
     * @memberOf Asserts
     */
    release?: string;
    /**
     * deploy folder. if empty use parent setting, or ues 'dist'.
     * 
     * @type {string}
     * @memberOf Asserts
     */
    deploy?: string;
}

/**
 * task option setting.
 * 
 * @export
 * @interface TaskOption
 */
export interface TaskOption extends Asserts {
    /**
     * task loader
     * 
     * @type {(string | LoaderOption | DynamicTask | DynamicTask[])}
     * @memberOf TaskOption
     */
    loader: string | LoaderOption | DynamicTask | DynamicTask[];

    /**
     * external task for 
     * 
     * @memberOf TaskConfig
     */
    externalTask?: Task;
    /**
     * custom set run tasks sequence.
     * 
     * 
     * @memberOf TaskConfig
     */
    runTasks?: Src[] | ((oper: Operation, tasks: Src[], subGroupTask?: Src) => Src[]);

    /**
     * sub tasks.
     * 
     * @type {(TaskOption | TaskOption[])}
     * @memberOf TaskOption
     */
    tasks?: TaskOption | TaskOption[];
}

/**
 * modules task define
 * 
 * @export
 * @interface ITaskDefine
 */
export interface ITaskDefine {
    /**
     * load config in modules
     * 
     * @param {Operation} oper
     * @param {TaskOption} option
     * @returns {TaskConfig}
     * 
     * @memberOf ITaskDefine
     */
    moduleTaskConfig(oper: Operation, option: TaskOption, env: EnvOption): TaskConfig

    /**
     * load task in modules.
     * 
     * @param {TaskConfig} config
     * @param {tasksInModule} findInModule
     * @param {tasksInDir} findInDir
     * @returns {Task[]}
     * 
     * @memberOf ITaskDefine
     */
    moduleTaskLoader?(config: TaskConfig): Promise<Task[]>;
}

// export interface TaskUtil {
//     files(directory: string, express?: ((fileName: string) => boolean)): string[];
//     gulpSrc(directory: string, expresion: Src): Src;
// }

/**
 * run time task config for setup task.
 * 
 * @export
 * @interface TaskConfig
 */
export interface TaskConfig {
    /**
     * custom global data cache.
     */
    globals?: any;
    /**
     * env
     * 
     * @type {EnvOption}
     * @memberOf TaskConfig
     */
    env: EnvOption;
    /**
     * run operation
     * 
     * @type {Operation}
     * @memberOf TaskConfig
     */
    oper: Operation;
    /**
     * task option setting.
     * 
     * @type {TaskOption}
     * @memberOf TaskConfig
     */
    option: TaskOption;

    /**
     * custom config run tasks sequence in.
     * 
     * @param {Src} [subGroupTask] sub tasks group tasks.
     * @param {Src[]} [tasks] task name sequence from register tasks.
     * @returns {Src[]}
     * 
     * @memberOf TaskConfig
     */
    runTasks?(subGroupTask?: Src, tasks?: Src[]): Src[];
    /**
     * custom print help.
     * 
     * @param {string} lang
     * 
     * @memberOf TaskConfig
     */
    printHelp?(lang: string): void;

    /**
     * find  task in module. default implement by loader.
     * 
     * @param {string} module
     * @returns {Promise<Task[]>}
     * 
     * @memberOf TaskConfig
     */
    findTasksInModule?(module: string): Promise<Task[]>;
    /**
     * find  task in directories. default implement by loader.
     * 
     * @param {Src} dirs
     * @returns {Promise<Task[]>}
     * 
     * @memberOf TaskConfig
     */
    findTasksInDir?(dirs: Src): Promise<Task[]>;

    /**
     * get dist of current state.  default implement in tools.
     * 
     * @param {Asserts} asserts
     * @returns {string}
     * 
     * @memberOf TaskConfig
     */
    getDist?(asserts?: Asserts): string;
    /**
     * filter file in directory.  default implement in tools.
     * 
     * @param {string} directory
     * @param {((fileName: string) => boolean)} [express]
     * @returns {string[]}
     * 
     * @memberOf TaskConfig
     */
    fileFilter?(directory: string, express?: ((fileName: string) => boolean)): string[];
    /**
     * filter file in directory.  default implement in tools.
     * 
     * @param {Gulp} gulp
     * @param {Src[]} tasks
     * @returns {Promise<any>}
     * 
     * @memberOf TaskConfig
     */
    runSequence?(gulp: Gulp, tasks: Src[]): Promise<any>;

    /**
     * dynamic register tasks.  default implement in tools.
     * 
     * @param {(DynamicTask | DynamicTask[])} tasks
     * @returns {Task[]}
     * 
     * @memberOf TaskConfig
     */
    dynamicTasks?(tasks: DynamicTask | DynamicTask[]): Task[]
}
