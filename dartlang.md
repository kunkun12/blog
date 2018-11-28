# Dart 语言基础总结


Dart 是谷歌推出的面向对象的强类型语言，在2011年发布，一直不温不火。最近Flutter的出现，让Dart又起死回生。Dart支持JIT 和AOT 两种编译方式。JIT在开发环境中使用，让APP方便实现Reload，AOT在生产环境中使用，来保证较高的性能。[关于AOT和JIT](https://blog.csdn.net/h1130189083/article/details/78302502) dart支持Flutter、Web、以及Server端开发

体验Dart功能可以在[dartpad](https://dartpad.dartlang.org/)进行, 以及[入门文档](https://www.dartlang.org/guides/language/language-tour)

### 开始

每个程序的执行都以main函数开始，main是Dart程序的入口。


``` dart
void main(){

}
```

### 打印日志 dart 
表达式要求必须结尾加分号

``` dart
void main(){
    print("Hello Word");
}
```
### 一些重要概念
- 一切都是对象， Dart里面一切变量都是object、每一个object都是class的实例、。数字、布尔、函数、null 都是以对象的形式存在，所有的对象都继承于 `Object` 类
- dart虽然是强类型的语言，但是支持类型推断，在定义变量的时候可不写变量的类型。
-  支持泛型
- 函数是“一等公民”,可以作为变量在代码间到处传递，也可以进行函数嵌套。每一个函数都有返回值，默认返回null(这点与JavaScript类似)
-  在class 中以 下划线开头的属性，为私有属性。
- 变量名 只能以字母和下划线开头,后面可以跟这数字、英文字母、下划线。

### 变量声明

变量声明之前一般要加上变量的类型,变量声明后未赋值之之前默认值为`null`。 像 `int a` `String s`。也可以通过 `var` 让程序动态的推测类型，类型一旦确认后，不可再赋值其他类型的数据。

通过 `dynamic` 声明的变量，可以在运行时变更类型 比如
``` dart
void main(){
    var name = 'kk'; // 效果与String name ='kk' 等同
    name = 1; //编译报错
}
```
``` dart
void main(){
    dynamic name = 'kk';
    name=1;
    print(name); //1
}
```
如果我们不打算改变一个变量的值可以 使用 `final` 或者 `const`。`const`比`final`更加严格，const必须在编译时知道这个常量的值。final必须在变量声明是进行初始化，final只能被赋值一次，可以是常量以及动态计算的结果值
``` dart
int Func() {
// 代码
}

final int m1 = 60;
final int m2 = Func(); // 正确
const int n1 = 42;
const int n2 = Func(); // 错误,在编译的时候无法确定值。
```

#### 内置类型
Dart支持以下下内置类型

- numbers 数字
- strings 字符串
- booleans 布尔
- lists（arrays） 列表/数组
- maps 字典
- runes
- symbols

Dart里面 所有的数据类型都属于对象类型，每个类型都有对应的构造函数，比如可以使用 `Map` 来构造一个，map

### 数字类型 
包含两种 `int` 和 `double`
- [int](https://api.dartlang.org/stable/2.1.0/dart-core/int-class.html)  根据不同的平台最大64位，取值范围为 values can be from -2的63次方 到 2的63次方 - 1. 如果便以为JavaScript 则遵循javascript数值类型的规则，取值范围 -2的53次方 到 2的53次方 - 1.
- [double](https://api.dartlang.org/stable/2.1.0/dart-core/double-class.html) 遵循 IEEE 754 标准的浮点数。 与JavaScript的数字类型一样

数字与字符串类型转换 `int.parse` `1.toString()`
``` dart
// String -> int
var one = int.parse('1');
assert(one == 1);

// String -> double
var onePointOne = double.parse('1.1');
assert(onePointOne == 1.1);

// int -> String
String oneAsString = 1.toString();
assert(oneAsString == '1');

// double -> String
String piAsString = 3.14159.toStringAsFixed(2);
assert(piAsString == '3.14');
```
#### [字符串](https://api.dartlang.org/stable/2.1.0/dart-core/String-class.html)
- 基于UTF-16编码规则。定义字符串可以使用双引号或者单引号。与`JavaScript`一致。
- 可以使用 `${变量}`的形式实现字符串插值。实现拼接字符串。字符串可以通过`+` 拼接，字符串与数字不能相加。Dart里面不需要使用反引号，这点与JS不同。
- 可以使用三个单引号或者三个双引号实现多行的字符串。如

``` dart
var s1 = '''
You can create
multi-line strings like this one.
''';

var s2 = """This is also a
multi-line string.""";
```
- 加 `r`前缀来表示原始的字符串 比如

```dart
var s = r'In a raw string, not even \n gets special treatment.';
```

#### 布尔值
包含两个object `true` 和 `false` .受限于Dart类型安全限制，在if判断条件判断以及assert接受的值必须是布尔类型的

#### [List](https://api.dartlang.org/stable/2.1.0/dart-core/List-class.html)
Dart里面数组被称为列表对象，可以像JavaScript中的方式来定义列表,通过设置`length`可以改变数组的大小（与JavaScript一致）。比如

```  dart
var l = ['张三','李四','王五'];
```

#### [Map](https://api.dartlang.org/stable/2.1.0/dart-core/Map-class.html) 。键值对的对象被称为 Map，Key可以为任何类型的对象，但不能重复。可以通过字面量 也可以通过 `Map`关键字来定义

``` dart
var gifts= {
    'first':'partridge',
    'second':'turtledoves',
    'fifth': 'golden rings'
}

var gifts2 = Map();
gifts['first'] = 'partridge';
gifts['second'] = 'turtledoves';
gifts['fifth'] = 'golden rings';
```
####  runes
Dart 中 runes 是 UTF-32 字符集的 string 对象。
Unicode是一套字符集，涵盖了目前人类使用的所有字符， 为世界上的每一个字符提供一个唯一的数字编号(Code Point)来表示，目前字符集还对应不同的编码方案(比如UTF-8，UTF-16.UTF-32等)，来方便计算机还存储，同一个字符用不同的编码方案对应的字节表示不同，由于Dart字符串采用的是UTF-16编码规则，如果要表示UTF-32编码的字符 需要用一些特殊的语法。通常情况使用 `\uXXXX` 来表示一个码点，这里的XXXX是一个4位的16进制值，例如 ♥字符的码点是 `\u2665`,对于大于或者小于 4位16进制的情况下，使用大括号来包裹数字 ，如😆表情符号是 `\u{1f600}`
字符串类型有几个属性可以来提取rune的信息，`codeUnitAt`  用来获取 UTF-16 字符集的字符。使用runes 来获取 UTF-32 字符集中的字符。使用`runes`可以获取字符串的rune  [rune更多API参考](https://api.dartlang.org/stable/2.1.0/dart-core/Runes-class.html)

``` dart
var a ='😆好好学习,';
print(a.codeUnitAt(0)); // 55357
print(a.codeUnits);//[55357, 56838, 22909, 22909, 23398, 20064, 44]
print(a.runes.toList());//[128518, 22909, 22909, 23398, 20064, 44]
```

#### Symbol 不常用 ，在Dart中是不透明的，保存对人的可读的字符串以及被计算机优化过的字符串的的联系，用来表示反射后的元数据信息 。可以给类名以及函数名 声明为 symbol类型,一般用于反射操作 [可以参考>>](https://www.tutorialspoint.com/dart_programming/dart_programming_symbol.htm)

#### 函数 每个函数都属于`Function`类的实例，函数可以作为值赋值为一个变量，可以作为参数传递、也可以作为函数的返回值
``` dart 
int Add(int a,int b) {
    return a+b;
}
//可以忽略返回值类型
int Add(int a,int b) {
    return a+b;
}
//也可以使用类似ES6中的 箭头函数 
int Add(int a,int b)=>a+b;
//函数作为参数
list.forEach((item) => print(item));

// 作为返回值
Function makeAdder(int addBy) {
    return (int i) => addBy + i;
}
// 调用的时候可以指定参数的名称
int Add({int a,int b})=>a+b;
// Add(a:1,b:2) 

const Scrollbar({Key key, @required Widget child}){} // @required指定必填的参数

// []指定可选参数
String say(String from, String msg, [String device]) {
    var result = '$from says $msg';
    if (device != null) {
        result = '$result with a $device';
    }
    return result;
}

//支持给参数默认值 
int Add({int a=1,int b=1})=>a+b;
Add(a:3)   //4

// 匿名函数
var list = ['apples', 'bananas', 'oranges'];
list.forEach((item) {
    print('${list.indexOf(item)}: $item');
});
```

#### main 程序的入口、每个程序顶部必有一个main函数 返回值为 void，有默认的 ` List<String>`类型的参数。

#### 词法作用域(静态作用域），JavaScript类似，在编写代码的时候就决定了变量的作用域
#### 闭包 函数内部访问外包的变量，外包的变量无法得到释放。与JavaScript闭包类似。
``` dart 
Function addCount(){
    int count =0;
    return  ()=>count++;
}
void main(){
    var countFn = addCount();
    int a=countFn();
    int b = countFn();
        print(a); //0
        print(b); //1
}
```
### 操作符 `&` `|` `~` `++` `--` `+` `-` `*` `==` `>=` 等等之类的，这个跟其他语言没啥区别不提了 (dart中没有 `===`)

#### 层叠访问符号 （JS中没有这个），可以连续访问同一个对象的属性
``` dart 
querySelector('#confirm') // Get an object.
  ..text = 'Confirm' // Use its members.
  ..classes.add('important')
  ..onClick.listen((e) => window.alert('Confirmed!'));

  //等同于
var button = querySelector('#confirm');
button.text = 'Confirm';
button.classes.add('important');
button.onClick.listen((e) => window.alert('Confirmed!'));
```

#### 控制语句 
- if/else if/else
- while、 do-while、 
- switch/case
- for 
- break/continue
- Assert 

#### 异常  Throw/Catch/Finally

#### 类 Class

- 实例变量 构造
```  dart
class Point {
  num x; // 实例变量 默认为 null
  num y=0; //初始值为0
}

var point = Point();
point.x = 4; // 赋值
```
- 构造函数 可以在类内部声明一个与类名一样的成员函数作为函数
``` dart
class Point {
    num x, y;
    Point(num x, num y=0) {
        this.x = x;
        this.y = y;
    }
}
// 上面的代码可以简单为
class Point {
    num x, y;
    Point(this.x, this.y=0);
}
```
- 命名的构造函数,命名的构造函数不能被继承，需要自己手动调用

``` dart
class Point {
    num x, y;

    Point(this.x, this.y);
    
    Point.origin() {
        x = 0;
        y = 0;
    }
}
```
- 重定向构造函数，
``` dart 
class Point {
    num x, y;
    Point(this.x, this.y);
    Point.alongXAxis(num x) : this(x, 0);
}
```
- 如果在对象不会在运行时被修改，可以定义为常量
``` dart 
class ImmutablePoint {
    static final ImmutablePoint origin = const ImmutablePoint(0, 0);
    final num x, y;
    const ImmutablePoint(this.x, this.y);
}
```
- 工厂构造函数 使用 `factory` 声明工厂构造函数，可以使用缓存机制避免不断创建新的实例，工厂构造函数不能访问this
- 成员方法、以及静态方法，静态属性
- 属性 Getters and setters （与JS中的类似 ）赋值或者取值的时候 自动会调用方法
- 抽象类 抽象方法 。`abstract`关键字前缀，抽象方法只能存在于抽象类中，用来定义接口。不实现具体的工作。
- 显式定义接口，类可以作为接口，通过 关键字 `implements`来实现接口，对应的类，必须实现接口中的所有方法以及属性
```dart
// A person. The implicit interface contains greet().
class Person {
    final _name;
    Person(this._name);
    String greet(String who) => 'Hello, $who. I am $_name.';
}

// 必须实现接口中的所有方法属性
class Impostor implements Person {
    get _name => '';
    String greet(String who) => 'Hi $who. Do you know who I am?';
}
```
- 使用 extends 来扩展类。
- 支持重载成员方法`override`，以及对操作符的重载
- noSuchMethod。如果用户调用类中不存在的成员方法，可以给出提示 重载 `noSuchMethod`
``` dart
class A {
    @override
    void noSuchMethod(Invocation invocation) {
        print('You tried to use a non-existent member: ' +
            '${invocation.memberName}');
    }
}
```

##### 枚举类型  Enumerated types ，每个值 都有一个index属性，从 0开始计数。 `Color.values`拿到所有的值，可以把在switch/case语句里面把枚举当做判断条件
``` dart
enum Color { red, green, blue }
Color.red.index == 0 
```
#### 在扩展对象的同时 还可以使用 mixins功能给对象增加功能

#### 泛型 用法与其他高级语言中的泛型一样 允许程序员在强类型程序设计语言中编写代码时定义一些可变的类型，那些部分在使用前必须作出指明。`Map` `List`xxi都基于泛型，具有相似功能的类，可以通过泛型实现，来避免代码的重复，提高抽象程度。可以定义泛型类 以及泛型的方法
``` dart
var names = List<String>();
names.addAll(['Seth', 'Kathy', 'Lars']);
names.add(42); // Err


var names = <String>['张三', '李四', '王五'];
var pages = <String, int>{
    '张三': 11,
    '李四': 12,
    '王五': 13
};
```
### 模块化

- 使用 `import` 导入模块
``` dart
import 'package:lib1/lib1.dart';
import 'package:lib2/lib2.dart' as lib2;

// Uses Element from lib1.
Element element1 = Element();

// Uses Element from lib2.
lib2.Element element2 = lib2.Element();
````
- 部分导入
```dart 只导入foo 模块
import 'package:lib1/lib1.dart' show foo;
// 导入 foo 之外的模块
import 'package:lib2/lib2.dart' hide foo;
```

- 懒加载。在运行时按需加载用到的模块，适用于如下场景:

1. 减小App的启动时间
2. 进行A/B测试，可选择的不同的算法实现
3. 一些不常用的功能，没必要每次都启动

``` dart
import 'package:greetings/hello.dart' deferred as hello;

Future greet() async {
    await hello.loadLibrary();
    hello.printGreeting();
}
```
这种方式 跟ES6中 的 动态加载类似  如下

``` JavaScript
//这是JavaScript的代码
function greet(){
    import('./hello').then(hello) => {
        hello.printGreeting()
    })
}

//或者
async function greet(){
const hello=await import('./hello')
    hello.printGreeting()
}
```

ES 6 中 import('./hello') 返回的是一个Promise，Dart中的Future 跟ES6中的Promise类似，同时Dart中也有 async/await 与ES7中的async/await 功能类似

#### 异步支持 ，
对于异步的处理与 ES中的类似

-  async/await
-  [Future (promise)](https://api.dartlang.org/stable/2.1.0/dart-async/Future-class.html) 
-  建议async/await配合try/catch使用

另外提一下  `Future.delayed` 可以异步延时执行代码，不支持取消, 我们`Timer` 来实现  JavaScript `setTimeout`操作，支持取消

``` dart
Future.delayed(const Duration(milliseconds: 10), ()=>print('hello world'));
```

``` dart
import 'dart:async';

void main(){
        Timer(const Duration(milliseconds: 10), ()=>print('hello world'));
        Timer timer= Timer(const Duration(milliseconds: 10), ()=>print('0'));
        print('1');
        timer.cancel(); //输出结果  1   hello world
}
```
#### http请求 使用 `dart:io` 中的 [HttpClient](https://docs.flutter.io/flutter/dart-io/HttpClient-class.html)

``` dart
import 'dart:io'
HttpClient client = new HttpClient();
client.getUrl(Uri.parse("http://www.example.com/"))
    .then((HttpClientRequest request) {
    //do something
    return request.close();
    })
    .then((HttpClientResponse response) {
});
```
#### Generators:  包含异步/同步两种generator 、与ES6中的类似

#### typedef: 自定义新的类型,与C中的typedef类似

#### Dart支持注解编程
注解用与Java中的注解 或者ES6中的 Decorator类似，内置了两个注解 `@deprecated` `@override`. 

#### isolate: 隔离的代码执行环境，不同的isolate无法共享内存
### 小结

学习了Dart的基础语法，感觉如果有其他的编程语言的话学起来 还是比较容易的，。Dart是一种强类型的语言，里面一切都是对象。Object是任何对象的基类。支持类型推断、支持泛型，让代码能减轻不少，支持接口编程、注解编程、Mixin。支持模块的按需加载。isolate提供了基于event-loop单线程模型，异步操作支持Future、async/await来写出同步化的代码。Dart支持AOT和JIT两种编译方式，保证了较好的开发体验，以及较高性能的线上模式。基本上掌握了这些可以上手撸Flutter了，Dart深入文档查看[官方文档](https://www.dartlang.org/guides/libraries/library-tour),有些API可能记不住的话可以去[API文档](https://api.dartlang.org/stable/2.1.0/index.html)查看。Dart 包基于Pub管理的，类似NodeJS中的NPM需要什么功能可以去Pub上去搜 https://pub.dartlang.org/

构造对象可以不写new，语句结尾记得加分号;;;;