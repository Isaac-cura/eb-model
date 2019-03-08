import { Complex } from './complex';

describe("Test for complex models",()=>{

    it("Check if date is Date type",()=>{
        let rawObject = {
            dat:"2019-03-08T18:07:57.678Z"
        };
        expect((new Complex(rawObject).dat) instanceof Date).toBeTruthy();
    });

    it("check if dates iterable is an array",()=>{
        let rawObject = {
            dates:["2019-03-08T18:07:57.678Z","2019-03-08T18:07:57.678Z"]
        };
        expect((new Complex(rawObject).dates.length)).toEqual(2);
    });

    it("check if dates iterable is an array of dates",()=>{
        let rawObject = {
            dates:["2019-03-08T18:07:57.678Z","2019-03-08T18:07:57.678Z","2019-03-08T18:07:57.678Z"]
        };
        let complexObject = new Complex(rawObject);
        let bool = true;
        for(let i in complexObject.dates)
            if(!(complexObject.dates[i] instanceof Date)){
                bool = false;
                break;
            }
        expect(bool).toBeTruthy();
    });

    it("check if aliases work",()=>{
        let rawObject = {
            nombre: "Jose"
        }
        expect(new Complex(rawObject).name).toEqual("Jose");
    });

    it("check alias for iterable properties",()=>{
        let rawObject = {
            fechas:["2019-03-08T18:07:57.678Z","2019-03-08T18:07:57.678Z"]
        };
        expect((new Complex(rawObject).dates.length)).toEqual(2);
    });

    it("check if alias for iterable object properties are be instantied",()=>{
        let rawObject = {
            fechas:["2019-03-08T18:07:57.678Z","2019-03-08T18:07:57.678Z","2019-03-08T18:07:57.678Z"]
        };
        let complexObject = new Complex(rawObject);
        let bool = true;
        for(let i in complexObject.dates)
            if(!(complexObject.dates[i] instanceof Date)){
                bool = false;
                break;
            }
        expect(bool).toBeTruthy();
    });

});