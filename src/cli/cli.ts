#!/usr/bin/env node
import * as fs from 'fs-extra';
import * as path from 'path';
import { stringify } from 'querystring';
import { existsSync } from 'fs';
import { SrvRecord } from 'dns';


/**
 * check if a file exist
 * @param file - name of the file to search
 * @param oldPath - 
 * @param backPaths 
 */
function thereIsFile(file,actualPath,backPaths){
    let futurePath = path.resolve(actualPath+"/..");
    if(fs.existsSync(backPaths+file))
        return backPaths
    if(actualPath != futurePath)
        return thereIsFile(file,futurePath,backPaths+"../");
    return false;
}

/**
 * get a different basesname if there is an src/app folder or src (angular/ionic by default)
 */
function basename():string{
    let packageBase = thereIsFile("package.json",process.cwd(),"");
    console.log(packageBase);
    let basename:string = "";
    if(packageBase !== false)
        if(fs.existsSync(packageBase+"src/app"))
            basename = packageBase+"src/app/";
        else if(fs.existsSync(packageBase+"src"))
            basename = packageBase+"src/";
    return basename;
}

/**
 * template for eb-model Model child class
 * @param name name of the class and the interface
 */
function getTemplate(name:string):string{
    
    let template =`
import { Model } from "eb-model";

interface ${name}Interface{
    prop1:string;
    prop2:string;
}
    
export class ${name} extends Model{

    protected readonly checkable:Array<keyof ${name}Interface> = [
        "prop1",
        "prop2"
    ];
    
    constructor(rawObject = null){
        super(rawObject);
    }
    
    keys(keys:Array<keyof ${name}Interface>):Array<string>{
        return keys;
    }
}`; 
    return template;
}

/**
 * Enroute the commands of the cli
 * @param command - the current command
 * @param arg - name of the model
 * @param flag - modifier of the functions
 */
function router(command:string,arg:string=null,flag:string = "-s"){
    switch(command){
        case "model":
            if(arg)
                generateModel(arg,flag);
            break;
        default:
            console.log("This ebloui command doesnt exist try with 'model'");
    }
}





/**
 * @function sanitize
 * eb-model has a styleguide to name the files this method make it possible
 * @param name - the original name
 */
export function sanitize(name:string){
    let response = {};
    /**replace the _ for - */
    let path = name.replace(/[\_\s]/g,"-");
    /**check if name match with the format directory/directory/../filename */
    if(/^[a-zA-Z\-]([\/\\]{0,1}[a-zA-Z\-])+$/.test(path)){
        let splited = path.split(/[\/\\]/);
        for(let j in splited){
            let a = splited[j];
            for(let i= 0;i<a.length; i++){
                if(/[A-Z]/.test(a[i])){
                    if(i){
                        let conector = a[i-1]=="-"?"":"-";
                        a = a.substr(0,i)+conector+a[i].toLowerCase()+a.substr(i+1);
                    }
                    else
                        a = a.substr(0,1).toLowerCase()+a.substring(1);
                }
            }
            splited[j] = a;	            
        }
        if((splited.length == 1) || ((splited.length>1) && (splited[splited.length-1] != splited[splited.length-2])))
            splited = splited.concat(splited[splited.length-1]);
        response["path"] = splited.join("/")+".ts";
        let a = splited[splited.length-1];
        a = a.substr(0,1).toUpperCase()+a.substr(1);
        for(let i= 1;i<a.length; i++){
	        if(/[\-]/.test(a[i]))
			    a = a.substr(0,i)+a[i+1].toUpperCase()+a.substr(i+2);
        }
        response["name"] = a;
        return response;
    }
    return false;
}

/**
 * create the file
 * @param name - name of the file
 * @param flag - modifiers
 */
function generateModel(name,flag){
    let sep = path.sep;
    let response = sanitize(name);
    fs.exists(`${(/\-h/.test(flag)?"":basename())+response["path"]}`, function (exists) {
        if(!response)
            console.log("invalid Model name");
        else
           if(!exists || ( /\-u/.test(flag))){/**unsafe mode */
               /**check the hard mode*/
                fs.outputFile(`${(/\-h/.test(flag)?"":basename())+response["path"]}`, getTemplate(response["name"]), 'utf8',function(){
                    console.log("Model",response["name"], "created successfully!");
             });
            }
            else
                console.log("the file already exist!");
    });    
}

let args:Array<string> = process.argv.slice(2);
args.push("-");
let maskedArg = [];
let j = 0;
for(let i = 1;i<args.length;i++)
    if(!/^\-/.test(args[i])){
        maskedArg[0]=maskedArg[0]?(maskedArg[0]+args[i]+" "):args[i]+" ";
    }else{
        if(maskedArg[0])
           maskedArg[0] = <string>maskedArg[0].trim();
        j++;
        if(args[i]!="-")
           maskedArg[1] = maskedArg[1]?maskedArg[1]+args[i]:args[i];
    }
args = args.slice(0,args.length-1);
args = args.length?[args[0]].concat(maskedArg):[];
if(args.length>=3)
    router(args[0],args[1],args[2]);
else if(args.length>=2)
    router(args[0],args[1]);
else
    console.log("Error creating a model");