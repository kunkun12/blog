# TypeScript 学习总结
 // https://ts.xcatliu.com/advanced/class.html
 [TypeScript](https://zh.wikipedia.org/wiki/TypeScript)简称为 TS，是一种由微软开发的自由和开源的编程语言。它是JavaScript的一个严格超集，并添加了可选的静态类型和基于类的面向对象编程。C#的首席架构师以及Delphi和Turbo Pascal的创始人安德斯·海尔斯伯格参与了TypeScript的开发。它是为大型软件开发而设计的，它最终编译产生 JavaScript，所以可以运行在浏览器、Node.js 。等等的运行时环境。同时也有专门的Typescript运行时，比如 [deno](https://github.com/denoland/deno)

 ### TypeScript 优势

 - 静态类型系统在编译时，对代码进行分析，更早的检测到错误，将问题消灭在编译阶段,而不是上线之后才发现
 - 类型即文档，代码具有较高的可读性，从而保证可维护性。可以使用[typedoc](https://typedoc.org/),将TS代码生成文档
 - 支持接口，类、enum等 更好的支持面向对象，提高开发者的在设计阶段的体验
 - 静态类型的代码，方便编译器进行优化，生成性能较高的JS代码，提高运行时性能
 - 可以编译为webAsymbly

总结就是： TS作为JS的超集，JS的语法在TS里面都可以使用，对于JavaScript开发来说成本也不高，TS可以助力我们开发大型以及高可维护性的项目。

### 编译环境搭建 Typescript 编译为 JavaScript

- 可以全局安装基于NodeJS的 `typescript` npm包，  `npm install -g typescript`，通过命令行的形式执行。
- Babel 7 直接支持typescript转码，需要安装 `@babel/preset-typescript`，和 `typescript`,具体配置可以参考这里有个脚手架 [TypeScript-Babel-Starter](https://github.com/Microsoft/TypeScript-Babel-Starter) 
- [webpack 配置 ts-loader](https://webpack.js.org/guides/typescript/) `npm install --save-dev typescript ts-loader`

### 配置 tsconfig.json

如果一个目录下存在一个tsconfig.json文件，那么它意味着这个目录是TypeScript项目的根目录。 tsconfig.json文件中指定了编译选项 具体参考文档 [使用tsconfig.json](https://zhongsp.gitbooks.io/typescript-handbook/content/doc/handbook/tsconfig.json.html)


### 基本语法



#### 内置基本数据类型

- 布尔 `let isDone: boolean = false;`
- 数值  `let decLiteral: number = 6;`
- 字符串  let myName: string = 'Tom'; 
- 空值 `let unusable: void = undefined;`
- Null 和 Undefined `let u: undefined = undefined;` `let n: null = null;`

#### 任意类型 (慎用)


``` typescript
let myFavoriteNumber: string = 'seven';
myFavoriteNumber = 7; // 编译错误

let a: any = 'seven';
a = 7;
````

#### 数组

```
let a: number[] = [1, 1, 2, 3, 5];
let b: Array<number> = [1, 1, 2, 3, 5];

// 接口表示数组
interface NumberArray {
    [index: number]: number;
}
let fibonacci: NumberArray = [1, 1, 2, 3, 5];

// any
let list: any[] = ['Xcat Liu', 25, { website: 'http://xcatliu.com' }]; 

//  类数组
let args: IArguments = arguments;
```
#### 类型推断 根据第一次赋值的时候推断类型

```
let myFavoriteNumber = 'seven';
let myFavoriteNumber: string = 'seven';
// 等价于

```
#### 内置对象类型
- 类似JavaScript中的内置对象 有 Boolean、String、Number、Error、Date、RegExp 等
- DOM 、BOM内置对象 Document、HTMLElement、Event、NodeList 等

#### 函数

``` ts
function sum(x: number, y: number): number {
    return x + y;
}

// 函数表达式

let mySum = function (x: number, y: number): number {
    return x + y;
}; 

//可选参数

function buildName(firstName: string, lastName?: string) {
    if (lastName) {
        return firstName + ' ' + lastName;
    } else {
        return firstName;
    }
}
let tomcat = buildName('Tom', 'Cat');
let tom = buildName('Tom');

//默认参数

function buildName(firstName: string, lastName: string = 'Cat') {
    return firstName + ' ' + lastName;
}
let tomcat = buildName('Tom', 'Cat');
let tom = buildName('Tom');

```
#### 支持函数重载
重载允许一个函数接受不同数量或类型的参数时，作出不同的处理。

####  联合类型 

联合类型（Union Types）表示取值可以为多种类型中的一种。


``` ts
let myFavoriteNumber: string | number;
myFavoriteNumber = 'seven';
myFavoriteNumber = 7;
```

### 支持定义接口 interface

TypeScript的核心原则之一是对值所具有的结构进行类型检查,接口的作用就是为这些类型命名和为你的代码或第三方代码定义契约。
实现的接口的时候，必须严格按照接口的规则来，正常情况下不能增加或者减少属性，支持可选属性，对于可选属性可不实现，也可以使用任意属性，来增加未知的字段 `readonly` 关键字来表示只读属性

``` ts
interface Person {
    name: string;
    age: number;
}

let tom: Person = {
    name: 'Tom',
    age: 25
};
```


##### 接口任意属性

```
interface Person {
    name: string;
    age?: number;
    [propName: string]: any;
}

let tom: Person = {
    name: 'Tom',
    gender: 'male'
};
```
##### 接口定义函数签名

```
interface SearchFunc {
    (source: string, subString: string): boolean;
}

let mySearch: SearchFunc;
mySearch = function(source: string, subString: string) {
    return source.search(subString) !== -1;
}
```
#### 声明文件
当使用第三方库时，我们需要引用它的声明类型、通常把类型声明放到一个单独的文件中，这就是声明文件 约定声明文件以 .d.ts 为后缀 然后在使用到的文件的开头，用「三斜线指令」表示引用了声明文件：

```

// jQuery.d.ts

declare var jQuery: (string) => any;


//test.js


/// <reference path="./jQuery.d.ts" />

jQuery('#foo');

```

对于一些第三方库 社区已经有多种方式引入声明文件,作为npm包存在，可以在[这个网站](http://microsoft.github.io/TypeSearch/) 进行搜索。用 TypeScript 写 Node.js 需要安装@types/node `npm install @types/node --save-dev`


#### 类型别名 
type Name = string; 之后Name相当于string
类型别名也可以用来定义函数类型

```
type fnType = () => string;
```
#### 字符串字面量类型

字符串字面量类型用来约束取值只能是某几个字符串中的一个，类似联合类型

```
type EventNames = 'click' | 'scroll' | 'mousemove';
function handleEvent(ele: Element, event: EventNames) {
  
}

handleEvent(document.getElementById('hello'), 'scroll');  // 没问题
handleEvent(document.getElementById('world'), 'dbclick'); // 报错，event 不能为 'dbclick'
```

#### 元组 Tuple

可以是不同类型对象的集合

```
 let user:[string,number] = ['张三'，11]
```

#### 枚举类型 enums

#### 类
