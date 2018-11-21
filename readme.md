#  Babel、Babel plugins、babel macros 

### compiler or transpiler?

(本文叙述的内容以babel V7为准)
babel :原名6to5, 2015年更名为babel，取名灵感来自于[BabelFish](https://en.wikipedia.org/wiki/List_of_races_and_species_in_The_Hitchhiker%27s_Guide_to_the_Galaxy#Babel_fish)) 是一种虚拟出来的鱼可以翻译任何物种的语言，不负盛名，Babel是目前最知名的JavaScript语法“编译器”、一种源码转译源码到编译器(source-to-source)。官方说是[compiler](https://zh.wikipedia.org/wiki/%E7%B7%A8%E8%AD%AF%E5%99%A8)、也有人称之为transpiler(tranform compile)，stackoverflow也有人提问[Is Babel a compiler or transpiler?](https://stackoverflow.com/questions/43968748/is-babel-a-compiler-or-transpiler)。编译器:一种语言编译为另一种低级一些的语言 比如 Java到字节码。C到二进制) 转移器：一种语言转为另一种同等级别的代码(比如JavaScript to python),那么ES6 到 ES5 算同一个level的转换吗？？自行理解吧。 对我们来说Babel是JavaScript语法转换工具或是翻译工具,因此不必太纠结compiler还是transpiler 。除了能够转换ES之外还支持JSX、typescript、flow。 babel方便的插件扩展机制，众多的开发者也相继开发出许多babel插件，让babel不只是作为一个工具 更是一个平台

### babel的组成

#### 核心组件
  babel包括了一套npm包，均在@babel命名空间下
- @babel/parser (原名Babylon) 基于 [acorn](https://github.com/acornjs/acorn) and [acorn-jsx](https://github.com/RReverser/acorn-jsx)。
- @babel/traverse 遍历AST 调用Plugin
- @babel/generator  AST 生成代码
- @babel/core  转换流程控制器，整合 parser、traverse plugin generator 完成语法转换。转换流程如下
- 一堆plugin+几个preset
- 1、Parse 词法分析得到 Tokens，JS代码生成 [抽象语法树（AST)](https://zh.wikipedia.org/wiki/%E6%8A%BD%E8%B1%A1%E8%AA%9E%E6%B3%95%E6%A8%B9)
- 2、Transform 遍历语法树，通过Babel-plugin操作 AST，完成语法树的改变。
- 3、Code Generate 将新的语法树生成代码。

总结 ：输入字符串 -> @babel/parser parser -> AST -> traverse ->@babe/plugin--xxxx-> AST -> @babel/generator -> 输出字符串
#### 辅助包
-  @babel/types 、@babel/template 、@babel/helpers、@babel/code-frames  方便操作语法树、提供的工具类
-  @babel/polyfill。ES标准中包括两部分: 新增的语法+新增的API。 Babel编译流程只提供了语法的转换(比如const、let、async、await、箭头函数等）， babel/polyfill来提供 ES标准新增的原生对象以及API模拟实现（比如Promise、Map、Set、Object.assign、Array.from、Object.assig等），其实@babel/polyfill上仅仅是core-js和regenerator-runtime两个包的[简单封装](https://github.com/babel/babel/blob/master/packages/babel-polyfill/src/index.js)，之前版本中我们都是在文件的收口处手动的引入babel polyfill。整个PolyFill文件较大、没必要全部导入、也没必要手动导入、在babel V7之后推荐新的使用方法。通过配置 env选项的时候添加 ` "useBuiltIns":"usage"`,会自动分析代码根据需求来按需针对性的导入polyfill。另外polyfill是全局导入的，像`Array.prototype.includes`还会修改原生函数的原型。polyfill只包含了超过stage4以上的规范。如果要使用更高级草案标准的API 需要自己手动去引入[core-js](https://github.com/zloirock/core-js)里面的函数。举个例子 .babel配置文件如下
``` javascript
        {
            "presets": [["@babel/env", {
                "useBuiltIns": "usage"
            }]]
        }
```
源码 
``` javascript
            var str = '   foo  ';
            str.trimLeft();
            str.padStart(10);
```
babel 输出结果 
``` javascript
        require("core-js/modules/es7.string.pad-start");
        var str = '   foo  ';
        str.trimLeft();
        str.padStart(10);
```
padStart 是 ES(7) 正式版的规范，因此会自动引入pad-start的polyfill、而 [`trimLeft`](https://github.com/tc39/proposal-string-left-right-trim)截止目前还在 `Stage 3`。需要自己手动引入`core-js(-pure)/features/string/trim-left`。（每一项新特性，要最终纳入ECMAScript规范中，TC39拟定了一个处理过程，称为TC39 process、其中共包含5个阶段，Stage 0 ~ Stage 4 stage0开始有初级的想法，不断升级到stage4基本才算是稳了的规范）

既然说到polyfill了 还得说一个函数 `regeneratorruntime` 这个函数也被算在了babel-polyfill里面了，它不是ES规范里面的，只是babel在做async/await 语法转换的时候，转换后的结果代码调用到了这个函数，并没有这个函数的定义，所以要让代码能够正常运行，必须引入这个函数，当然如果按 `"useBuiltIns": "usage"`使用的话，业务里面如果用到async/await 会自动引入这个东西的。

- @babel/runtime：功能类似babel-polyfill，为一些帮助函数(regeneratorruntime)以及非实例方法（Array.from,Object.assign、Promise、Map等)提供polyfill，一般用于library或plugin中，最大好处减少工具代码重复引用、且不会污染全局作用域，配合[babel/plugin-transform-runtime](https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-runtime)插件使用 更多信息可以参考[babel-polyfill 和 runtime的区别](https://segmentfault.com/q/1010000005596587)

#### 其他工具
- @babel/cli babel命令行工具
- @babel/node nodeJS环境下使用babel的功能，由于性能问题不得在生产环境下使用
- @babel/register 通过绑定node.js的require来自动转译require引用的js代码文件

###  Babel Plugin

上面已经介绍过babel语法转换流程主要包含三个步骤：词法分析语法分析生成AST->Plugin操作AST->生成代码

关于babel详细原理以及语法树的知识，可以移步[剖析Babel——Babel总览](http://www.alloyteam.com/2017/04/analysis-of-babel-babel-overview/)、通过基础的文档我们应该有一些基本的了解

什么是AST？它是源代码语法结构的一种抽象表示(类似浏览器页面用抽象为DOM树来表示)、方便对编程语言进行语法分析、语法检查、代码风格检查、语法转换、代 码优化等，UglifyJS、ESLint、JSDoc、Babel等常用的工具，这背后的就是对AST的应用，另外像目前的mpvue、taro 也都用到AST转换的思想。babel通过语法分析，把代码解析为[AST](https://github.com/babel/babel/blob/master/packages/babel-parser/ast/spec.md),这是基于[ESTree](https://github.com/estree/estree)稍微改造的结构（EStree可以认为是一些权威大佬联合制定的标准）。JavaScript代码的语法树可以通过[astexplorer](https://astexplorer.net)中查看。

Babel语法转换的本质是:将源代码解析为AST后、对AST进行遍历（先序深度优先遍历），并对节点进行操作（增、删、改，最后将AST生成代码的过程，这个操作过程采用的是Visitors 模式对节点进行访问，每一个visitor在babel里面有babel-plugin承担。babel-core负责解析语法，每一个语法的转换需要一个单独的plugin来变更AST，转换后的AST生成代码也由babel自动完成。babel官方包内置了一些[丰富的plugin](https://babeljs.io/docs/en/plugins/)来完成语法的转译(比如最新的ES标准/草案、JSX、typescript、flow),一个插件只完成一个特定的功能，启用该功能需要在babel的配置文件里面添加即可，为了方便分享，也方便集中配置，把插件的列表封装为preset，preset即是一堆插件的组合合。babel的插件启用需要单独配置，支持多种配置方式 使用 `babel.config.js` `.babelrc` `.babelrc.js` 或者package.json中添加 babel的属性.[官方也有详细的介绍](https://babeljs.io/docs/en/config-files)。

### Plugin配置
（[官网写的很清楚](https://babeljs.io/docs/en/config-files)，感觉没必要多写）简单提一下，Preset是plugin组合，翻译过来叫"预设"，官网的提供的一些预设（env、flow、react、typescript）我们也能很容易的创造自己的预设，比如create-react-app ，react-native都是自定义了preset，preset可以有预设和plugin组成。自定义预设也跟配置 babel.config.js类似。另外babel在执行的时候
``` javascript
        module.exports = () => ({
            presets: [
                require("@babel/preset-env"),
            ],
            plugins: [
                [require("@babel/plugin-proposal-class-properties"), { loose: true }],
                require("@babel/plugin-proposal-object-rest-spread"),
            ],
        });
```
babel7之后推荐使用[@babel/preset-env](https://babeljs.io/docs/en/babel-preset-env)来转换正式版ES语法，目前preset-env=ES3+ES5+ES2015+ES2016+ES2017，对于目前处于草案的语法需要手动添加相关plugin。具体到特定的语法是否为草案还是正式标准可以去[babel的插件列表](https://babeljs.io/docs/en/plugins)看一下，不要被这么多插件吓到，其实除了env大部分用不到的。另外关于他们的执行顺序，遍历到每个节点的时候，都会按规则来执行plugin和preset。执行规则就是 :先执顺序行完所有Plugin，再逆序执行Preset。这个配置的时候可能注意、留个心。有时候出错的话，可能跟这个执行顺序有关。仔细想一下，那么多节点，都要被每个插件轮流执行一遍。这个对性能影响也是很大的。所以尽量用具体的babel plugin来配置，干掉stage的preset也避免了这个问题。如果不配置插件任何插件以及preset、babel会不做任何转换 输出最初的代码 。简单介绍下对async/await以及decorators配置方式。

- async/await 属于ES7的正式版发布了，理论上来说配置下env即可以使用了，但是上面也有提到 babel的plugin只做语法转换，通过env的配置可以将async，await语法转换为旧式的语法。但是新的代码里面使用了Promise 和 regeneratorRuntime 这两个API。

如果配置为 

``` javascript
    {
        "presets": [["@babel/env"]]
    }
```
源码 
``` javascript
    async function name(params) {
        await 1
    }
```
转化后的代码为
![](https://raw.githubusercontent.com/kunkun12/blog/master/imgs/1.jpg)
很明显这个代码是执行的话 报错 regeneratorRuntime，对于不支持Promise的浏览器也会 没有定义。将配置中添加
``` javascript
    {
        "presets": [["@babel/env", {
            "useBuiltIns": "usage"
        }]]
    }
```
编译之后的代码为
![](https://raw.githubusercontent.com/kunkun12/blog/master/imgs/2.jpg)
发现顶部多了如下两行代码 引入了 如上两个方法的polyfill

``` javascript
    require("regenerator-runtime/runtime");
    require("core-js/modules/es6.promise");
```
官方提供的plugin 一般是用来对目前成型的标准或者草案进行通用的转换，如果我们要根据自己的需求，定制自己的转换规则，受益于babel提供的插件扩展机制，我们很容易的完成对语法树进行操作，完成对代码的转译，只需要关注语法的transform这个关键的步骤，自定义Visitor，利用babel提供的API来方便的操作语法树的节点，其他的工作比如语法树解析，遍历算法、代码生成等 babel帮我们自动完成这些步骤。如果对编写babel插件有兴趣，可以去参考[babel插件手册](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md)。（这篇文章写很详细，熟悉之后写插件没啥问题了， 如果第一次看，不用害怕，细心的看下去，多看一遍，可能一些陌生的词汇有些唬人，利用Babel API操作AST ，相当于使用jQuery来操作DOM树）。学会利用显示AST的神器[astexplorer](https://astexplorer.net) 或者 http://esprima.org/demo/parse.html 或者 使用[JAVASCRIPT AST VISUALIZER](https://resources.jointjs.com/demos/rappid/apps/Ast/index.html)可视化查看语法树结构

社区中有一些为了满足特定需求的plugin，对实际项目开发中很有用处，这里介绍几个
babel 通过配置文件来选择应用哪些插件，支持[多种配置方式](https://babeljs.io/docs/en/configuration)。
先介绍几个插件特定的语法转换例子 idx、lodash、preval
这种增加插件改配置的模式也有一些问题, 使用 .babelrc 或者webpack 为全局的配置，如果有新的插件要增加，需要自己手动改动配置，比如 create-react-app 创建的项目、默认情况下是不推荐改配置的。

语法树遍历每个节点，都会执行一遍所有插件的visitor。visitor执行前会判断是否命中特定的语法规则，进行语法转换。

babel macro的出现让我们可以在应用代码里面 引入语法转换的macro，动态的对指定的代码设置编译的规则。栗子。
babel里面有个babel-plugin-idx的插件，目的是解决多层属性访问，可能对空值取属性报错的问题。比如 *props.user.friends[0].friends* 代码中，若 user为null则代码就会报错，使用babel-plugin-idx之后 会自动转化为这种代码。先判断值是否为空。具体使用如下。

preval 执行代码，返回代码执行的结果，关注点是 返回代码的执行结果
codegen 执行代码，返回的是可以执行的代码，关注点是生成代码，嵌入到当前的程序中,功能更强大。

这个时候就有一种需求：在应用的代码里面动态为特定的代码应用指定的语法转换，babel 7.0的新特性中 有一项 只不过“babel-macros” 在一定程度上解决了这个问题，macros翻译为“宏”，之前在C语言里面有 宏的概念，关键字define关键字进行定义，在预编译阶段对于应用宏的地方进行简单的字符串替换。babel macros目的让我们不修改babel的配置文件的前提下，编写代码里面导入特定的macro，按照一定规则编码，在babel 编译的时候，使用执行该宏对代码进行预处理（根据宏的规则对代码进行替换），babel macros 的想法的来源于[create-react-app的一个issue](https://github.com/facebook/create-react-app/issues/2730)，目前macros 已经在这个项目中使用了。宏的功能与babel plugin功能上差不多，babel plugin的引入需要在babel的配置文件中添加配置，只是宏是让我们可以对手动指定的代码进行语法转换的。babel 有许多plugin，也有许多的macro可用，不同的宏功能不同。plugin与macro的使用方式不同。


如果是使用macros 需要先安装babel-plugin-macros，启用macros的能力 `npm install --save-dev babel-plugin-macros` 。babel-plugin-macros 不是一个具体的macro，只是给macro提供了一个运行的平台，不具有转换特定代码的功能，这里可以查看具体可用[macros列表](https://github.com/kentcdodds/babel-plugin-macros/blob/master/other/docs/macros.md) 根据需求安装对应的macros 在代码里面使用即可。说了这么多还是不直观，下面介绍下具体如何使用宏。







### 参考以及学习资料
- [Babel 插件开发](https://xiaoiver.github.io/coding/2018/05/12/Babel-%E6%8F%92%E4%BB%B6%E5%BC%80%E5%8F%91.html)
- [babel-plugin-macros](https://github.com/kentcdodds/babel-plugin-macros)
- [zero-config-with-babel-macros](https://babeljs.io/blog/2017/09/11/zero-config-with-babel-macros)
- [How writing custom Babel & ESLint plugins can increase productivity & improve user experience](https://blog.kentcdodds.com/how-writing-custom-babel-and-eslint-plugins-can-increase-your-productivity-and-improve-user-fd6dd8076e26)
- https://github.com/kentcdodds/babel-plugin-macros/tree/master/other/docs
- [Babel 用户手册](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/user-handbook.md)
- [penv.macro - 使环境变量的设置更加简单](https://juejin.im/entry/5ad41747518825558002b2a7)
- [How to use Babel macros with React Native](https://medium.freecodecamp.org/using-babel-macros-with-react-native-8615aaf5b7df)
- [astexplorer.net](astexplorer.net)
- [Writing custom Babel and ESLint plugins](http://slides.com/kentcdodds/a-beginners-guide-to-asts)
- [Christoph Pojer: Evolving Complex Systems Incrementally | JSConf EU 2015](https://www.youtube.com/watch?v=d0pOgY8__JM&feature=youtu.be)
- [Ramana Venkata: How to write a codemod](https://vramana.github.io/blog/2015/12/21/codemod-tutorial/)
- [Jamund Ferguson: Harnessing The Power of Abstract Syntax Trees](https://www.youtube.com/watch?v=8uOXIM4giH8)
- [James Kyle: How to Build a Compiler](https://www.youtube.com/watch?v=Tar4WgAfMr4)
- [ESLint: Working with Plugins](https://eslint.org/docs/developer-guide/working-with-plugins)
- [ESTree "spec"](https://github.com/estree/estree)
- ["How Writing a Babel Plugin is like jQuery"](https://www.henryzoo.com/babel-plugin-slides/assets/player/KeynoteDHTMLPlayer.html#16)
- [Babel Types Documentation](https://babeljs.io/docs/en/babel-types)
- [All about macros](http://slides.com/kentcdodds/macros#/)
