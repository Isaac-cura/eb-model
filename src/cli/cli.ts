#!/usr/bin/env node
import * as fs from 'fs-extra';
import * as path from 'path';

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

export function directoryExist(filePath){
    try {
      return fs.statSync(filePath).isDirectory();
    } catch (err) {
      return false;
    }
  }

export function getCurrentDirectoryBase(){
    return path.basename(process.cwd());
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

function generateModel(name,flag){
    let sep = path.sep;
    let response = sanitize(name);
    fs.exists(`${response["path"]}`, function (exists) {
        if(!response)
            console.log("invalid Model name");
        else
           if(!exists || (flag == "-h")){
                fs.outputFile(`${response["path"]}`, getTemplate(response["name"]), 'utf8',function(){
                    console.log("Model created successfully!");
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
        maskedArg[j]=maskedArg[j]?(maskedArg[j]+args[i]+" "):args[i]+" ";
    }else{
        if(maskedArg[j])
           maskedArg[j] = <string>maskedArg[j].trim();
        j++;
        if(args[i]!="-")
            maskedArg.push(args[i]);
    }
args = args.slice(0,args.length-1);
args = args.length?[args[0]].concat(maskedArg):[];
if(args.length>=3)
    router(args[0],args[1],args[2]);
else if(args.length>=2)
    router(args[0],args[1]);
else
    console.log("Error creating a model");