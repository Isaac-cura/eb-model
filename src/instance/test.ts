import { Model } from "../model/model";
import { type } from "os";
import { isDate } from "util";

interface testInterface{
    name:string;
    dat:Date,
    lastname:string;
}

type inf<T> = {
    [P in keyof T]
}

export class Test extends Model{

    protected readonly _checkable:Array<keyof testInterface> = [
        "name",
        "lastname"
    ];


    constructor(rawObject = null){
        super(rawObject);
        this.init();
    }

    keys(keys:Array<keyof testInterface>):Array<string>{
        return keys;
    }
    
}
