# EBLOUI MODEL

Superclass for typescript models that provides an architecture and common methods neededs in the models of data specially in front end.
Can be used in any of most popullars frameworks/libraries typescript/javascript develpment. Also can be used in backend.

## Prerequisites

npm & typescrip project it could work without typescript but it would not make much sense

## Installing

add package to your project

```javascript
npm i eb-model
```

then you can use in your custom models for your project

patient.ts
```typescript
import { Model } from 'eb-model';

interface PatientInterface{
    name:string;
    lastname:string;
};

export class Patient extends Model implements PatientInterface{

    name:string = this.name || null;
    lastname:string = this.lastname || null;
    
    constructor(private patient:PatientInterface = null){
        super(patient);
    }

    keys(keys:Array<keyof PatientInterface>):Array<string>{
        return keys;
    }
}
```
the key method is abstract so should be implemented. 

## Running the tests

```javascript
npm run test
```
## KEYS METHOD

The function of keys method is prevent to use not allowed keys in the methods thats require keys, for example this works 


```typescript
 let patient = new Patient();
 patient.itsFull(["name"]);
```

but can generate runtime erros or inconsistencies is the key does not exist

```typescript
 let patient = new Patient();
 patient.itsFull(["NaMe"]);
```
to prevent that you can use key method

```typescript
 let patient = new Patient();
 patient.itsFull(patient.keys(["name"]));
```

and the IDE will show the possible options and mark error if placing an incorrect one

## USAGE

define a model

patient.ts
```typescript
import { Model } from 'eb-model';

interface PatientInterface{
    name:string;
    lastname:string;
};

export class Patient extends Model implements PatientInterface{

    name:string = this.name || null;
    lastname:string = this.lastname || null;
    
    constructor(private patient:PatientInterface = null){
        super(patient);
    }

    keys(keys:Array<keyof PatientInterface>):Array<string>{
        return keys;
    }
}
```

get the data, in this case from a const, but can be from the server

```typescript
const PATIENTS = [
  {
    name:"José",
    lastname:"Isaac-cura"
  },{
    name:"Walter",
    lastname:"Whites"
  }];
```

instance the model

```typescript
  let patients:Array<Patient> =  PATIENTS.map(patient=> new Patient(patient));
```
also can instance void

```typescript
  let patient:Patient = new Patient();
```

### itsFull method

and if you want know if the all properties are fill(for forms validations for example) you can do this

```typescript
  if(patient.itsFull()) //false
    someFunction();
```

or if you want only one or more functions can do this

```typescript
  patient.name = "José"
  if(patient.itsFull(["name"])) //true
    someFunction();
  if(patient.itsFull(["lastname"])) //false
    someFunction();
```

when you have many properties its difficult to remember them then you can use keys method then the ide will make suggestions and mark errors

```typescript
  patient.name = "José"
  if(patient.itsFull(patient.keys(["name"]))) //true
    someFunction();
```

### filter method

when you need know if the person match with a criteria you can use this method

```typescript
  patient.name = "José";
  patient.lastname = "Isaac-cura";
  
  if(patient.filter("jOs",patient.keys(["name"]))) //true
    someFunction();
    
  if(patient.filter("jOs",patient.keys(["lastname"]))) //false
    someFunction();
    
  if(patient.filter("jOs") //true
    someFunction();
  
  if(patient.filter("Isa") //true
    someFunction();
```

With a little imagination you can do really interesting things, you can, for example, get people from a list that match with the search criteria

```typescript
const PATIENTS = [
  {
    name:"José",
    lastname:"Isaac-cura"
  },{
    name:"Walter",
    lastname:"Whites"
  },{
    name:"Walt",
    lastname:"Disney"
  }
  ];
  
  let patients:Array<Patient> =  PATIENTS.map(patient=> new Patient(patient));
  
  patients = patients.filter(patient => patient.filter("Walt")); // patients now is walter whites, and walt disney persons
```

### toObject method

when you interact with the server you not always control the data model that he receives then you can use toObject method

```typescript
let patient:Patient = new Patient({
  name:"José",
  lastname:"Isaac-cura",
  // imagine that this property exists in our model person
  phones:{
    one:"0412-444-44-44",
    two:"0212-222-22-22"
  }
});

let object = patient.toObject(); //{name:"Jose",lastname:"Isaac-cura",phones:{one:"0412-444-44-44",two:"0212-222-22-22"}} 
```
if the server need the keys in cappital you can masked the object with this syntax "MaskedName:name"

```typescript
  let object = patient.toObject(["NAME:name","LaStNaMe:lastname","phones"]); //{NAME:"Jose",LaStNaMe:"Isaac-cura",phones:{one:"0412-444-44-44",two:"0212-222-22-22"}} 
```

if u need a nested property u can use this syntax "MaskedName:name.property" or "name.property"

```typescript
  let object = patient.toObject(["mobile:phones.one","phones.two"]); //{mobile:"0412-444-44-44",phones:"0212-222-22-22"} 
```

You can even use functions in case of complex object with this sintax "MaskedName:property.function" or "property.function"

```typescript
  let object = patient.toObject(["name.toUpperCase","phone:phones.two.toLowerCase"]); //{name:"JOSE",phone:"0212-222-22-22"} 
```

## tips

* when extends a Model and create your own model initialice the properties like this

 ```typescript
 name:string = this.name || null
 ```
 
 this because when itsFill method not receive params it search in all properties of the class to compare with all, but it is in runtime then, is the propertie are not initialized not exist in runtime then if have no value the function omit it. 
 Only is relevant is the propertie never has value and itsFull is called without any arg, otherwise this tip is not relevant
 



## Authors
* José Isaac-cura
