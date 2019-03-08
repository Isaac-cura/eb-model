import { Test } from './test';
describe("itsFull method of Model",()=>{

    it("check if all test properties are not full",()=>{
        let rawObject = {
            name:"Jose"
        }
        expect(new Test(rawObject).isFill()).toBeFalsy();
    });

    it("check if all properties are full",()=>{
        let rawObject = {
            name:"Jose",
            lastname:"Isaac-cura"
        };
        expect(new Test(rawObject).isFill()).toBeTruthy();
    });

    it("check if all gives properties are full",()=>{
        let rawObject = {
            name:"Jose",
        };
        let test = new Test(rawObject);
        expect(test.isFill(test.keys(["name"]))).toBeTruthy();
    });

    it("check if all gives properties are not full",()=>{
        let rawObject = {
            name:"Jose",
        };
        let test = new Test(rawObject);
        expect(test.isFill(test.keys(["name","lastname"]))).toBeFalsy();
    });
})