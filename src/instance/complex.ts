import { Model,ComplexDefinition } from "../model/model";
import { type } from "os";
import { isDate } from "util";

interface testInterface{
    dates:Array<Date>;
    dat:Date,
}

type inf<T> = {
    [P in keyof T]
}

export class Complex extends Model{
    dat:Date;
    dates;
    name:string;
    protected  _checkable:Array<keyof testInterface> = [
    ];

    protected readonly _complex = {
        dat:Date,
        dates:{
            type:Date,
            iterable:true,
            alias:"fechas"
        },
        name:{
            alias:"nombre"
        }
    }

    constructor(rawObject = null){
        super(rawObject);
        this.init();
    }

    keys(keys:Array<keyof testInterface>):Array<string>{
        return keys;
    }
    
}
