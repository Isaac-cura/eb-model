
/**
 * Class model to extends another model classes with common useful methods and properties
 * @class
 */
export abstract class Model{

    protected checkable:Array<string> = ["name","lastname"];
    /**
     * @property keys to be deleteds in exporteds objects 
     */
    private toDelete = ["toDelete","rawObject"];

    constructor(protected rawObject = null){
        this.init();
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
        Object.keys(this.rawObject||{}).forEach((key:string)=>{
            this[key] = this.rawObject[key];
        });
    }

    /**
     * @method toObject - return all properties of the model in a single object
     * @param keys - in the format ["name","mask:name","mask:name.property"] where name is property name
     * @return object with the asked properties
     */
    toObject(keys:Array<string> = this.checkable):Object{
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
     * @method itsFull - verify if the giveds properties are filleds
     * @param keys - keys to verify if null are the all properties of class initializeds(even if initialized with null)
     * @returns if the class is filled
     */
    itsFull(keys:Array<string> = this.checkable ):Boolean{
        keys = this.deleteKeys(keys)
        for(let i in keys){
            if(!this[keys[i]])
                return false;
        }
        return true;
    }

    filter(criteria:string,keys:Array<string>=this.checkable):boolean{
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
}