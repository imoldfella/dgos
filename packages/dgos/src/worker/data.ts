
// send options to get a config, use config to create a Db to use
export interface Options {
}
export interface Config {

}

export class Db {
    constructor(public config: Config) { }
}

export interface Shared {
    double(_: number): number
    config(o: Options): Config
}

// use like this 
// const x = 