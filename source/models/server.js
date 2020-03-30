import { Collection } from 'fireorm';

@Collection()
export default class TutelaryServer {
    id: string;
    name: string;
    since: Date;
    owners: Array|String;
    region: String;
}