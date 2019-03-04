import { Model } from '../model/model'
import { Test } from './test';

describe('toObject method on class Model', () => {
    
    it("check if the Model class is properly instance",()=>{
        expect(new Test() instanceof Test).toBeTruthy();
    });

    it("check to object method with all the properties",()=>{
        let rawObject = {
            name:"value",
            lastname:new Date()
        };
        expect(new Test(rawObject).toObject()).toEqual(rawObject);
    });

    it("check toObject method with some properties",()=>{
        let rawObject = {
            name : "Jose",
            lastName: "Isaac-cura"
        };
        expect(new Test(rawObject).toObject(["name"])).toEqual({name:"Jose"});
        expect(new Test(rawObject).toObject(["lastName"])).toEqual({lastName:"Isaac-cura"});

    });

    it("check toObject method with mask",()=>{
        let rawObject = {
            name : "Jose",
            lastName : "Isaac-cura"
        };
        expect(new Test(rawObject).toObject([
            "nombre:name",
            "apellido:lastName"
        ])).toEqual({
            nombre:"Jose",
            apellido: "Isaac-cura"
        });
    });

    it("check toObject method with nested values with and without mask",()=>{
        let rawObject = {   
            names:{
                firstName:"Jose",
                secondName:"Miguel"
            },
            lastName:"Isaac-cura"
        };
        expect(new Test(rawObject).toObject(["name:names.firstName"])).toEqual({name:"Jose"});
        expect(new Test(rawObject).toObject(["names.secondName"])).toEqual({names:"Miguel"});
    });

    it("check toObject method with nested values and functions",()=>{
        let rawObject = {   
            names:{
                firstName:"Jose",
                secondName:"Miguel"
            },
            lastName:"Isaac-cura"
        };
        expect(new Test(rawObject).toObject(["name:names.firstName.toUpperCase"])).toEqual({name:"JOSE"});     
    });

    it("recursive toObject nested calls",()=>{
        let rawObject = {
            name: "Jose",
            lastname: new Test({lastname:"Isaac-cura"})
        }
        expect(new Test(rawObject).toObject(["name","lastName:lastname.toObject.lastname"])).toEqual({name:"Jose",lastName:"Isaac-cura"});
    })
});