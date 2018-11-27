# Dart 语言总结


Dart 是谷歌推出的面向对象的强类型语言，在2011年发布，一直不温不火。最近Flutter的出现，让Dart又起死回生。Dart支持JIT 和AOT 两种编译方式。JIT在开发环境中使用，让APP方便实现Reload，AOT在生产环境中使用，来保证较高的性能。[关于AOT和JIT](https://blog.csdn.net/h1130189083/article/details/78302502) dart支持Flutter、Web、以及Server端开发

体验Dart功能可以在[dartpad](https://dartpad.dartlang.org/)进行

### 开始

每个程序的执行都以main函数开始，main是Dart程序的入口。


``` dart
    void main(){

    }
```

### 打印日志 dart 表达式要求必须结尾加分号

``` dart
        void main(){
            print("Hello Word");
        }
```
### 一些重要概念
- 一切都是对象， Dart里面一切变量都是object、每一个object都是class的实例、。数字、布尔、函数、null 都是以对象的形式存在，所有的对象都继承于 `Object` 类
- dart虽然是强类型的语言，但是支持类型推断，在定义变量的时候可不写变量的类型。
-  支持泛型
- 函数是“一等公民”,可以作为变量在代码间到处传递，也可以进行函数嵌套。每一个函数都有返回值，默认返回null(这点与JavaScript类似)
-  在class 中以 下划线开头的属性，为私有属性。
- 变量名 只能以字母和下划线开头,后面可以跟这数字、英文字母、下划线。

### 变量声明

变量声明之前一般要加上变量的类型,变量声明后未赋值之之前默认值为`null`。 像 `int a` `String s`。也可以通过 `var` 让程序动态的推测类型，类型一旦确认后，不可再赋值其他类型的数据。

通过 `dynamic` 声明的变量，可以在运行时变更类型 比如
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
```
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
Unicode 为世界上的每一个字符用一个唯一的数字来表示，由于Dart字符串采用的是UTF-16规则编码，需要用一些特殊的语法来表示UTF-32的值。通常情况使用 `\uXXXX` 来表示一个码点，这里的XXXX是一个4位的16进制值，例如 ♥字符的码点是 `\u2665`,对于大于或者小于 4位16进制的情况下，使用大括号来包裹数字 ，如😆表情符号是 `\u{1f600}`
字符串类型有几个属性可以来提取rune的信息，`codeUnitAt`  用来获取 UTF-16 字符集的字符。使用runes 来获取 UTF-32 字符集中的字符。使用`runes`可以获取字符串的rune  [rune更多API参考](https://api.dartlang.org/stable/2.1.0/dart-core/Runes-class.html)

```
                var a ='😆好好学习,';
     			print(a.codeUnitAt(0)); // 55357
                print(a.codeUnits);//[55357, 56838, 22909, 22909, 23398, 20064, 44]
     			print(a.runes.toList());//[128518, 22909, 22909, 23398, 20064, 44]
```

#### symbols 与ES6中的Symbol的类似。Symbol的字面量 以 `#`开头,用来表示唯一的值，在编译时候确定值 [更多API参考](https://api.dartlang.org/stable/2.1.0/dart-core/Symbol-class.html) 很少用到
