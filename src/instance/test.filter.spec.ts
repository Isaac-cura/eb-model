import { Test } from './test';

describe("filter method of Model class", ()=>{

    it("filter fail in all",()=>{
        let rawObject = {
            name:"Jose"
        }
        let test = new Test(rawObject);
        expect(test.filter("Pe")).toBeFalsy();
    });

    it("filter fail in one",()=>{
        let rawObject = {
            name:"Jose"
        }
        let test = new Test(rawObject);
        expect(test.filter("Pe",test.keys(["name"]))).toBeFalsy();
        expect(test.filter("J",test.keys(["lastname"]))).toBeFalsy();
    });

    it("filter coincide in one",()=>{
        let rawObject = {
            name:"Jose"
        }
        let test = new Test(rawObject);
        expect(test.filter("J",test.keys(["name"]))).toBeTruthy();
    });

    it("filter coincide in one of all",()=>{
        let rawObject = {
            name:"Jose"
        }
        let test = new Test(rawObject);
        expect(test.filter("J")).toBeTruthy();
    });

    it("filter coincide in one of all",()=>{
        let rawObject = {
            name:"Jose",
            lastname:"Isaac-cura"
        }
        let test = new Test(rawObject);
        expect(test.filter("JoSe")).toBeTruthy();
        expect(test.filter("Is")).toBeTruthy();
        expect(test.filter("Ca")).toBeFalsy();
    });

});