import { Model } from "../model/model";

interface testInterface{
    name:string;
    lastname:string;
}

export class Test extends Model implements testInterface{
    public name:string = this.name || null;
    public lastname:string = this.lastname || null;
    constructor(rawObject = null){
        super(rawObject);
    }
    keys(keys:Array<keyof testInterface>):Array<string>{
        return keys;
    }
}