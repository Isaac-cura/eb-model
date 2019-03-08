# EBLOUI MODEL

Superclase para lo modelos de datos en typescrip que provee una arquitectura limpia y métodos comunes necesarios en los modelos de datos, especialmente en el front end.

## Requisitos

npm & un proyecto typescrip

## Installing

agregar el paquete a tu proyecto

```javascript
npm i -g eb-model
```
es importante instalar el paquete de manera global para así poder hacer uso del cli más fácilmente

## Running the tests

```javascript
npm run test
```

## USAGE

Lo primero que debemos hacer es definir un modelo de datos, para ello haremos uso del cli incluido en esta biblioteca:

*Lo primero es abrir una cónsola y situarnos en la raíz de nuestro proyecto.
*Si nuestro proyecto tiene esta estructura src/app podemos quedarnos en la raíz, de no ser así situarnos en la carpeta donde queremos crear el modelo.
*Luego hacemos uso del cli, en este ejemplo crearemos el model perro

```
eb model models/perro
```
*Si nuestro proyecto era un proyecto con una estructura src/app, podremos observar que se han creado el modelo perro, de la siguiente manera:

src/app/models/perro/perro.ts

como se puede observar, se ha creado la carpeta models, y la carpeta perro, si el fichero hubiera existido con anterioridad no se habría sobreescrito, ya que por defecto el cli se encuentra en modo seguro(-s), si quiere que los archivos se puedan sobreescribir puede usar el flag -u, de la siguiente manera:

```
eb model models/perro -u
```
esto nos permite crear el modelo aunque ya exista alguno con el mismo nombre en la misma ruta.

Si no quisiéramos que nuestro fichero sea creado dentro de src/app, tenemos que usar el flag -h(hard mode) con lo cual se crearía nuestro modelo en la ruta en la que estemos situados:

```
eb model models/perro -u -h
```

##Una vision general del modelo creado

*Al abrir nuestro modelo recién creado lo primero que nos encontraremos será con una interface que contendrá las propiedades de nuestro modelo, por defecto tiene un id ya que la mayoría de los modelos contendrá uno.

```typescript
interface PerroInterface{
    /**Place your properties here*/
    id:string;
}
```
cada propiedad que contenga nuestro modelo deberá ser colocada allí

*Nuestra clase implementa esa inferface así que debemos implementar las mismas propiedades en la clase del modelo que nos creó el cli, como ejemplo el cli implementa la propiedad id.

```typescript
export class ${name} extends Model implements ${name}Interface{

    id:string;
```
esto puede parecer redundante, pero es necesario para el correcto funcionamiento de la función keys, útil para una inferencia dinámica de tipos que nos ahorrará bastante tiempo en un futuro.

*Otra cosa importante es la propiedad _checkable que básicamente contiene las propiedades que serán usadas por las funciones cuando no se les pase ningún argumento. Por ejemplo si no se le pasa ningún argumento a la función isFill, comprobará que las propiedades en el arreglo _checkable no estén vacías.

```typescript
protected readonly _checkable:Array<keyof ${name}Interface> = [
    "id"
];
```
como pueden ver, por defecto agregamos la propiedad id

*El objeto complex es una de la piezas fundamentales de la clase, como su nombre lo dice, sirve para definir el comportamiento de los objetos complejos, pues por lo general cuando consumimos api rest recibimos argumentos que queremos que se instancien.
por ejemplo si recibimos una fecha como isostring y queremos que en nuestro sistema sea de tipo Date podemos usar el complex de la siguiente manera:
```typescript
/**
 * @property _complex - contains the definition of complex objects
 */
protected readonly _complex = {
  date:Date
};
```

de esa manera al instanciar el modelo obtendríamos un objeto de tipo date(O de cualquier tipo)

```typescript
let myModel = new Model({date:"2019-03-08T22:33:08.160Z"});
```
ahora myModel.date es un objeto de tipo date

*pero a veces no queremos simplemente instanciar un objeto, ¿qué pasaría si nuestro modelo en lugar de una sola fecha tuviera varias?, pues fácil, añadimos ese constraint en nuestro objeto complex

```typescript
/**
 * @property _complex - contains the definition of complex objects
 */
protected readonly _complex = {
  dates:{
    type:Date,
    iterable:true
  }
};
```
con lo cual al instanciar

```typescript
let myModel = new Model({dates:["2019-03-08T22:33:08.160Z",["2019-03-08T22:33:08.160Z"]});
```
ahora la propiedad myModel.dates contendrá un arreglo de fecchas

*No siempre las propiedades que nos provee el servidor tienen el mismo nombre que las de nuestro modelo, por ello podemos usar alias:

```typescript
/**
 * @property _complex - contains the definition of complex objects
 */
protected readonly _complex = {
  date:{
    type:Date,
    alias:"fecha"
  }
};
```
con lo cual al instanciar

```typescript
let myModel = new Model({fecha:"2019-03-08T22:33:08.160Z"});
```
 obtenemos que myModel.date contiene la fecha obtenida del servidor

cabe destacar que los alias solo funcionan en tiempo de ejecución, pues al escribir nuestro código no funcionarán ya que el constructor solo admite objetos del tipo nulo o del tipo declarado en la interfaz creada por el cli(que debe implementar las propiedades que hayamos definido en la misma).

todos los constraints del objeto complex son independientes y combinables.


#instanciando los modelos

Lo primero es obtener la data, en este caso será desde una constante, pero también puede ser desde el servidor

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

Luego instanciamos él, o los modelos

```typescript
  let patients:Array<Patient> =  PATIENTS.map(patient=> new Patient(patient));
```
también podemos instanciar un modelo vacío, bastante útil para cuando queremos registrar formularios que luego enviaremos al servidor

```typescript
  let patient:Patient = new Patient();
```

### isFill method

Si necesitamos saber qué propiedades están llenas(cuando registramos desde un formulario por ejemplo), podemos hacer lo siguiente, lo cual verificará si las propiedades provistas en el arreglo _checkable se encuentran llenas

```typescript
  if(patient.itsFull()) //false
    someFunction();
```

también podemos específicar las propiedades que nosotros querramos

```typescript
  patient.name = "José"
  if(patient.itsFull(["name"])) //true
    someFunction();
  if(patient.itsFull(["name","lastname"])) //false
    someFunction();
```

cuando tenemos muchas propiedades es difícil recordarlas todas, para ello podemos usar el método keys, el cual debido a la inferencia de tipos le permite al IDE hacernos sugerencias de las posibles propiedades que podemos usar(por esto la interface)

```typescript
  patient.name = "José"
  if(patient.itsFull(patient.keys(["name"]))) //true
    someFunction();
```

### filter method

Cuando necesitemos saber si un modelo cumple con un criterio de búsqueda podemos usar el método filter

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

Con un poco de imaginación podemos hacer cosas realmente interesantes. Por ejemplo, podemos obtener la lista que coincide con un criterio:

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

Cuando interactuamos con el servidor no siempre tenemos control de los nombres de las propiedades que ellos reciben

```typescript
let patient:Patient = new Patient({
  name:"José",
  lastname:"Isaac-cura",
  phones:{
    one:"0412-444-44-44",
    two:"0212-222-22-22"
  }
});

let object = patient.toObject(); //{name:"Jose",lastname:"Isaac-cura",phones:{one:"0412-444-44-44",two:"0212-222-22-22"}} 
```
Si el servidor necesita los nombres de las propiedades con la primera letra en mayúsculas podemos enmascarar el objeto con la siguiente sintaxis "MaskedName:name"

```typescript
  let object = patient.toObject(["NAME:name","LaStNaMe:lastname","phones"]); //{NAME:"Jose",LaStNaMe:"Isaac-cura",phones:{one:"0412-444-44-44",two:"0212-222-22-22"}} 
```

si necesitamos una propiedad anidada podemos usar la siguiente sintaxis "MaskedName:name.property" o "name.property"

```typescript
  let object = patient.toObject(["mobile:phones.one","phones.two"]); //{mobile:"0412-444-44-44",phones:"0212-222-22-22"} 
```

Puedes incluso usar funciones, en caso de tratarse de objetos complejos, con la siguiente sintaxis  "MaskedName:property.function" or "property.function"

```typescript
  let object = patient.toObject(["name.toUpperCase","phone:phones.two.toLowerCase"]); //{name:"JOSE",phone:"0212-222-22-22"} 
```

## Authors
* José Isaac-cura
