import { Collection } from 'fireorm';

@Collection()
export default class TutelaryUser {
    id: string;
    name: string;
    servers: Array<string>;
    owners: Array | String;
    region: String;
}