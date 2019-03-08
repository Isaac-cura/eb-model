import { Model } from "../model/model";

interface testInterface{
    name:string;
    dat:Date,
    lastname:string;
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
