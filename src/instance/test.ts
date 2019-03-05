import { Model } from "../model/model";

interface testInterface{
    name:string;
    lastname:string;
}

export class Test extends Model{

    protected readonly checkable:Array<keyof testInterface> = [
        "name",
        "lastname"
    ];

    constructor(rawObject = null){
        super(rawObject);
    }

    keys(keys:Array<keyof testInterface>):Array<string>{
        return keys;
    }
}