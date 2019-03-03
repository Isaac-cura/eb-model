/**
 * Class model to extends another model classes with common useful methods and properties
 * @class
 */
export class Model{
    /**
     * @property keys to be deleteds in exporteds objects 
     */
    private toDelete = ["toDelete","rawObject"];

    constructor(protected rawObject = {}){
        this.init();
    }

    /**
     * @method deleteKeys - delete the properties of the objects
     */
    private deleteKeys(object:Object):Object{
        for(let i in this.toDelete)
            delete object[this.toDelete[i]];
        return object;
    }

    /**
     * @method init - method to assign the properties which was instanced
     * the nature of this methos is to be override for most complex objects that extends from it
     */
    init(){
        Object.keys(this.rawObject).forEach((key:string)=>{
            this[key] = this.rawObject[key];
        });
        const tipe = Object.keys(this.rawObject);
    }

    /**
     * @method toObject - return all properties of the model in a single object
     * please in the child class document the posibles values for keys
     * @param keys - in the format ["name","mask:name","mask:name.property"] where name is property name
     * @return object with the asked properties
     */
    toObject(keys:Array<string> = Object.keys(this)):Object{
        let object:Object = {};
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
            }     
        });
        console.log(object);
        return this.deleteKeys(object);
    }
}