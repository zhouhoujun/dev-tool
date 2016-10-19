
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

export type Src = string | string[];
/**
 * type task name sequence 
 */
export type TaskNameSequence = Array<Src | Function>;

export type Task = (config: TaskConfig, callback?: Function) => Src | void;

export type tasksInDir = (dirs: Src) => Promise<Task[]>;

export type tasksInModule = (dirs: Src) => Promise<Task[]>;

export type moduleTaskConfig = (oper: Operation, option: TaskOption, env: EnvOption) => TaskConfig;

export type moduleTaskLoader = (oper: Operation, option: TaskOption, findInModule: tasksInModule, findInDir: tasksInDir) => Promise<Task[]>;

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

    key?: number;
    value?: number;
    csv?: string;
    dist?: string;
    lang?: string;

    publish?: boolean | string;

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
     * loader type.
     * 
     * @type {string}
     * @memberOf LoaderOption
     */
    type: string;
    /**
     * module name or url
     * 
     * @type {string}
     * @memberOf LoaderOption
     */
    module?: string;

    /**
     * config module name or url.
     * 
     * @type {string}
     * @memberOf LoaderOption
     */
    configModule?: string;

    /**
     * config module name or url.
     * 
     * @type {string}
     * @memberOf LoaderOption
     */
    taskModule?: string;

    /**
     * task config method name in module or task custom config builder.
     * 
     * 
     * @memberOf TaskOption
     */
    moduleTaskConfig?: string | moduleTaskConfig;

    /**
     * the task loader method name in module, or custom loader
     * 
     * @type {(string | moduleTaskLoader)}
     * @memberOf LoaderOption
     */
    moduleTaskloader?: string | moduleTaskLoader;

    /**
     * custom external judage the name is right task name, that method of module object.
     * 
     * @param {*} mdl
     * @param {string} name
     * @returns {boolean}
     * 
     * @memberOf LoaderOption
     */
    isTaskFunc?(mdl: any, name: string): boolean;
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
    /**
     * dir Config Builder name
     * 
     * @type {string}
     * @memberOf DirLoaderOption
     */
    dirmoduleTaskConfigName?: Src;
}

/**
 * task option setting.
 * 
 * @export
 * @interface TaskOption
 */
export interface TaskOption {
    /**
     * task loader
     * 
     * @type {string}
     * @memberOf TaskConfig
     */
    loader: LoaderOption;
    /**
     * the project src root folder. default 'src'.
     */
    src: string;
    /**
     * build folder. default 'dist'.
     */
    dist: string;

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
    runTasks?: TaskNameSequence | ((oper: Operation, tasks: TaskNameSequence) => TaskNameSequence);
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
     * @param {Operation} oper
     * @param {TaskOption} option
     * @param {tasksInModule} findInModule
     * @param {tasksInDir} findInDir
     * @returns {Task[]}
     * 
     * @memberOf ITaskDefine
     */
    moduleTaskLoader?(oper: Operation, option: TaskOption, findInModule: tasksInModule, findInDir: tasksInDir): Promise<Task[]>;
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
    env: EnvOption;
    oper: Operation;
    option: TaskOption;
    runTasks?(): TaskNameSequence;
    printHelp?(lang: string): void;
}
