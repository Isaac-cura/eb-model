import * as cli from './cli';
describe('Cli tests', () => {
    
    it("sanitize model name with only model name in one workd",()=>{
        expect(cli.sanitize("gato")).toEqual({path:"gato/gato.ts",name:"Gato"});
    });

    it("sanitize model with only model name in camelcase",()=>{
        expect(cli.sanitize("camelCase")).toEqual({path:"camel-case/camel-case.ts",name:"CamelCase"});
    });

    it("sanitize model name with directory",()=>{
        expect(cli.sanitize("model/gato")).toEqual({path:"model/gato/gato.ts",name:"Gato"});
    });

    it("sanitize model name with directory and spaces",()=>{
        expect(cli.sanitize("models/little cat")).toEqual({path:"models/little-cat/little-cat.ts",name:"LittleCat"});
    });

    it("check that sanitize method not allowed numbers",()=>{
        expect(cli.sanitize("models/2342a")).toBeFalsy();
    });

    it("check model with underscore",()=>{
        expect(cli.sanitize("model_ligth/cat")).toEqual({path:"model-ligth/cat/cat.ts",name:"Cat"});
    });

});