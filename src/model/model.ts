
/**
 * Class model to extends another model classes with common useful methods and properties
 * @class
 */
export abstract class Model{
    /**Complex objects (Iterables,instances,checkeables,alias) */
    protected _complex:Object = this._complex || {};
    private _alias:Object = this._alias || {};
    private _iterables:Array<String> =this._iterables || [];

    protected _checkable:Array<string> = [];
    /**
     * @property keys to be deleteds in exporteds objects 
     */
    private toDelete = ["toDelete","rawObject"];

    constructor(protected rawObject = null){
    }

    /**
     * @method deleteKeys - delete keys of array
     * @param array - the array of keys which be applied minus operation with the toDelete array
     */
    private deleteKeys(array:Array<string>):Array<string>{
        for(let i in this.toDelete)
            if(~array.indexOf(this.toDelete[i]))
                array.splice(array.indexOf(this.toDelete[i]),1);
        return array;
    }

    /**
     * @method init - method to assign the properties which was instanced
     * the nature of this methos is to be override for most complex objects that extends from it
     */
    init(){
        this.assign();
        Object.keys(this.rawObject||{}).forEach((key:string)=>{
            let iterable: Array<any> = [];
            let name:string = this._alias[key]?this._alias[key]:key;
            if(~this._iterables.indexOf(name))
                iterable = this.rawObject[key];
            else
                iterable = [this.rawObject[key]];
            for(let i in iterable)
                if(~this._iterables.indexOf(name)){
                    this[name] = this[name] || [];
                    if(this._complex[name]){
                        if(this._complex[name]["type"])
                            this[name].push(new this._complex[name]["type"](iterable[i]))
                        else
                            this[name].push(iterable[i]);  
                    }else 
                        this[name].push(iterable[i]);
                }
                else{
                    if(this._complex[name]){
                        if(this._complex[name]["type"])
                            this[name] = new this._complex[name]["type"](iterable[i]);
                        else
                            this[name] = iterable[i]; 
                    }else
                        this[name] = iterable[i];                  
                }
        });

    }

    /**
     * @method toObject - return all properties of the model in a single object
     * @param keys - in the format ["name","mask:name","mask:name.property"] where name is property name
     * @return object with the asked properties
     */
    toObject(keys:Array<string> = this._checkable):Object{
        let object:Object = {};
        keys = this.deleteKeys(keys);
        keys.forEach(key=>{
            /**@var fk - formated key, using for deconstruct the masked key */
            let fk:Array<string> = key.split(":");
            fk = [fk[0].split(".")[0]].concat(fk[1]?fk[1].split("."):fk[0].split("."));
            object[fk[0]] = this;
            /**Detph assign */
            for(let i = 1;i < fk.length; i++){
                let value = object[fk[0]][fk[i]];
                /**util if the propertie is a complex object and have a get */
                object[fk[0]] = typeof value == "function"?object[fk[0]][fk[i]]():value; 
                /**not return null values */
                if(!object[fk[0]])
                    delete object[fk[0]];
            }     
        });
        return object;
    }

    /**
     * @method isFill - verify if the giveds properties are filleds
     * @param keys - keys to verify if null are the all properties of class initializeds(even if initialized with null)
     * @returns if the class is filled
     */
    isFill(keys:Array<string> = this._checkable ):Boolean{
        keys = this.deleteKeys(keys)
        for(let i in keys){
            if(!this[keys[i]])
                return false;
        }
        return true;
    }

    filter(criteria:string,keys:Array<string>=this._checkable):boolean{
        keys = this.deleteKeys(keys);
        for(let i in keys)
            if(this[keys[i]] && (<string>this[keys[i]]).toLowerCase().match(criteria.toLowerCase()))
                return true;

        return false;
    }


    /**
     * @abstract
     * @method keys - method to safe use properties of the class
     * @param keys - the properties alloweds to use, can use interface as a type
     * <code>keys(){}</code>
     * @example 
     * keys(keys:Array<"nameOfProperty" | "nameOfAnoherProperty">):Array<string>{
     *  return keys;
     * }
     */
    abstract keys(keys : Array<string>) : Array<string>;
    
    /**
     * Assign the complex object to other objects
     */
    assign(){
        Object.keys(this._complex || {}).forEach(complexObjectKey=>{
            let complexObject = this._complex[complexObjectKey];
            if(typeof(complexObject) == "function")
                this._complex[complexObjectKey] = {type:complexObject};
            if(complexObject["alias"]){
                this._alias[complexObject["alias"]] = complexObjectKey;
            }
            if(complexObject["iterable"]){
                if(!(~this._iterables.indexOf(complexObjectKey)))
                    this._iterables.push(complexObjectKey)
            }
            if(complexObject["checkeable"]){
                if(!(~this._checkable.indexOf(complexObjectKey)))
                    this._checkable.push(complexObjectKey)                
            }
        });
    }
    
}

interface _ComplexDefinition{
    type?:Function;
    alias?:string;
    iterable?:Boolean;
    checkable?:Boolean;
}

export interface ComplexDefinition{

}