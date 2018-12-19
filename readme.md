#  前端编译技术：Babel

[技术分享PPT](http://kunkun12.com/blog/ppt/#/)

### compiler or transpiler?

(本文叙述的内容所涉及到的相关特性以Babel V7为准)

Babel :原名6to5 2014.9发布第一个版本, 2015.2更名为babel，由团队来为维护，Babel取名灵感来自于[BabelFish](https://en.wikipedia.org/wiki/List_of_races_and_species_in_The_Hitchhiker%27s_Guide_to_the_Galaxy#Babel_fish) 是一种虚拟出来的鱼,可以翻译任何物种的语言，Babel也不负盛名，成了目前最知名的JavaScript语法“编译器”、一种源码转译源码到编译器(source-to-source)。官方说是[compiler](https://zh.wikipedia.org/wiki/%E7%B7%A8%E8%AD%AF%E5%99%A8)、也有人称之为transpiler(转译器)，stackoverflow也有人提问[Is Babel a compiler or transpiler?](https://stackoverflow.com/questions/43968748/is-babel-a-compiler-or-transpiler)。总结一下大致意思，编译器是将一种语言转为另一种相对低级一些的语言（比如 Java到字节码。C到二进制)。 转移器是将一种语言转为另一种同等级别的代码(比如JavaScript to python),那么ES6 到 ES5 算同一个level的转换吗？？自行理解吧。 
对我们来说Babel是JavaScript语法转换工具或是翻译工具,因此不必太纠结compiler还是transpiler 。除了能够转换标准ES以及草案之外，它还支持JSX、typescript、flow。 另外babel方便灵活的插件扩展机制，众多的开发者也相继开发出许多babel插件，让babel不再只是作为一个工具 更是一个平台。

### Babel的组成
 Babel是一个组合套装，拆分为几十个包，均在`@babel`命名空间下
#### 核心部件
 
- @babel/parser (原名Babylon) 基于 [acorn](https://github.com/acornjs/acorn) and [acorn-jsx](https://github.com/RReverser/acorn-jsx)。用于语法解析
- @babel/traverse 遍历AST、调用Plugin转换代码
- @babel/generator  将转换后的AST生成代码
- @babel/core  转换流程控制器，整合 parser、traverse plugin generator 完成语法转换。
- 一堆plugin+5个preset

babel的编译流程如下：

1. Parse 词法分析得到 Tokens，把JS代码解析为 [抽象语法树（AST)](https://zh.wikipedia.org/wiki/%E6%8A%BD%E8%B1%A1%E8%AA%9E%E6%B3%95%E6%A8%B9)
2. Transform 遍历语法树，通过Babel-plugin操作 AST，改变语法树。
3. Generate Code 新的语法树生成代码。

总结 ：输入字符串 -> @babel/parser parser -> AST -> traverse ->@babe/plugin--xxxx-> AST -> @babel/generator -> 输出字符串
#### 辅助包
-  `@babel/types` 、`@babel/template` 、`@babel/helpers`、`@`babel/code-frames`  方便操作语法树、提供的工具类，写插件的时候会用到
-  `@babel/polyfill`。ES标准中包括两部分: 新增的语法+新增的API。 Babel编译流程只提供了语法的转换(比如const、let、async、await、箭头函数等）， babel/polyfill是ES标准新增的原生对象以及API的模拟实现（比如`Promise`、`Map`、`Set`、`Object.assign`、`Array.from`、`Object.assig`等），其实`@babel/polyfill`上仅仅是`core-j`s和`regenerator-runtime`两个包的[简单封装](https://github.com/babel/babel/blob/master/packages/babel-polyfill/src/index.js)，之前版本中我们都是在文件的收口处手动的引入`babel polyfill`。整个PolyFill文件较大、没必要全部导入、也没必要手动导入、在babel V7之后推荐新的使用方法。通过配置 env选项的时候添加 ` "useBuiltIns":"usage"`,会自动分析代码根据需求来按需针对性的导入polyfill。另外polyfill是全局导入的，像`Array.prototype.includes`还会修改原生函数的原型。polyfill只包含了超过`stage4`以上的规范。如果要使用更低级草案标准的API 需要自己手动去引入[core-js](https://github.com/zloirock/core-js)里面的函数。举个例子 .babelrc配置文件如下
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
babel 编译输出结果 
``` javascript
        require("core-js/modules/es7.string.pad-start");
        var str = '   foo  ';
        str.trimLeft();
        str.padStart(10);
```
`String.prototype.padStart` 是 ES(7) 正式版的规范，因此会自动引入pad-start的polyfill、而 [`trimLeft`](https://github.com/tc39/proposal-string-left-right-trim)截止目前还在 `Stage 3`。需要自己手动引入`core-js(-pure)/features/string/trim-left`。

这里提一下，对于每一项新特性，要最终纳入ECMAScript规范中，TC39(指定ES标准的组织)拟定了一个处理过程，称为[TC39 process](https://tc39.github.io/process-document/)、其中共包含5个阶段:

        stage-0: (稻草人)只是一个想法
        stage-1: (提案)初步尝试
        stage-2: (草稿)初步规范
        stage-3: (候选)完成规范和浏览器初步实现
        stage-4: (定稿)代发版

既然说到polyfill了 还得说一个函数 :`regeneratorruntime`, 这个函数也被算在了babel-polyfill里面了，它不是ES规范新增的API，只是babel在做async/await 语法转换的时候，转换后的结果代码调用到了这个函数，转换结果并没有提供这个函数的定义，所以要让代码能够正常运行，必须要引入`regeneratorruntime`这个函数，如果配置babel的时候 env里面设置 `"useBuiltIns": "usage"`属性，业务里面如果用到async/await 会自动引入regeneratorruntime这个polyfill

- @babel/runtime：功能类似babel-polyfill，提供了一些帮助函数(regeneratorruntime、_classCallCheck 等一些转换后的代码 里面用到的一些函数)以及非实例方法（Array.from,Object.assign、Promise、Map等)的shim，一般用于library或plugin中，最大好处减少工具代码重复引用、且不会污染全局作用域，配合[babel/plugin-transform-runtime](https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-runtime)插件使用 更多信息可以参考[babel-polyfill 和 runtime的区别](https://segmentfault.com/q/1010000005596587)

#### 其他工具
- @babel/cli babel命令行工具
- @babel/node nodeJS环境下使用babel的功能，由于性能问题不得在生产环境下使用
- @babel/register 通过绑定node.js的require来自动转译require引用的js代码文件
- [REPL](https://babeljs.io/repl) 在线体验工具

###  Babel Plugin

上面已经介绍过babel语法转换流程主要包含三个步骤：词法分析语法分析生成AST->Plugin操作AST->生成代码

那么什么是AST？AST 即抽象语法树 它是源代码语法结构的一种抽象表示(类似浏览器页面用抽象为DOM树来表示)、方便对编程语言进行语法分析、语法检查、代码风格检查、语法转换、代 码优化等，UglifyJS、ESLint、JSDoc、Babel等常用的工具，这背后的就是对AST的应用，另外像目前的mpvue、taro 也都用到AST转换的思想。babel通过语法分析，把代码解析为[AST](https://github.com/babel/babel/blob/master/packages/babel-parser/ast/spec.md),这是基于[ESTree](https://github.com/estree/estree)稍微改造的结构（EStree可以认为是一些权威大佬联合制定的标准）。JavaScript代码的语法树可以通过[astexplorer](https://astexplorer.net)中查看。可以把AST类比DOM Tree，那么Babel相当于操作AST的jQuery

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
babel7之后推荐使用[@babel/preset-env](https://babeljs.io/docs/en/babel-preset-env)来转换正式版ES语法，目前preset-env===ES3+ES5+ES2015+ES2016+ES2017，还有三个比较常用的preset（ typescript flow react）,之前的stage0~stage3四个preset 在Babel 7中已经被干掉了。对于目前处于草案的语法需要手动添加相关plugin。具体到特定的语法是否为草案还是正式标准可以去[babel的插件列表](https://babeljs.io/docs/en/plugins)看一下，不要被这么多插件吓到，其实也没多少，不必熟知，尽量都要清楚每个插件的作用。另外babel-preset-env 还支持根据指定代码的环境对语法的支持程度，来过滤语法转换，用来表示来支持到什么程度，比如[浏览器版本](https://github.com/browserslist/browserslist)，Node版本，通过这样等减少一些不必要的转换，降低冗余代码

关于plugin和preset执行顺序，Babel遍历到每个AST节点的时候，按规则来执行plugin和preset。执行规则就是 :先执顺序行完所有Plugin，再逆序执行Preset。这个配置的时候可能注意。有时候出错的话，可能跟这个执行顺序有关。仔细想一下，那么多节点，都要被每个插件轮流执行一遍。这个对性能影响也是很大的。所以尽量用具体的babel plugin来配置，干掉stage的preset从一方面避免了这个问题。如果不配置插件任何插件及preset、babel对代码不会做做任何转换 将会输出最初的代码。关于具体的配置，简单介绍下对async/await以及decorators配置方式。

#### 关于 async/await
- async/await 在ES8的正式版发布了，目前属于ES的正式标准，理论上来说配置下env即可以使用了，但是上面也有提到 babel的plugin只做语法转换，env可以将async/await语法转换为旧式的语法。但是转换后的的代码里面使用了Promise 和 regeneratorRuntime 这两个API。

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
很明显这个代码是执行的话 报错 regeneratorRuntime，对于不支持Promise的浏览器也会 报错。在配置中添加 `"useBuiltIns": "usage"`
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
刚才说过了，还可以使用 `@babel/plugin-transform-runtime`结合`@babel/runtime` 来实现polyfill的功能。
需要安装两个依赖包

        npm install --save @babel/runtime
        npm install --svae-dev @babel/plugin-transform-runtime

修改babel的配置
``` javascript
{
    "presets": [["@babel/env"]],
    "plugins": [
    ["@babel/plugin-transform-runtime", {
        "corejs": false,
        "helpers": true,
        "regenerator": true,
        "useESModules": false
    }]]
}
```
运行babel之后编译的代码为
![](https://raw.githubusercontent.com/kunkun12/blog/master/imgs/2.jpg)
，可以看到 _regenerator(即regeneratorRuntime)以局部变量的形式被引入了，非上面的全局作用域。另外 `asyncToGenerator`也作为一个工具函数被提取至`@babel/runtime`,通过导入包，以局部变量的形式在代码里面呈现。另外由于编译后的代码在执行的时候用到了 `@babel/runtime` 包里面的代码，因此安装依赖的包的时候，根据原则将安装到dependencies里面（--save) 。那么还有个问题，asyncToGenerator用了Promise，对于不支持Promise的浏览器依然会报错。解决方案就是 将corejs属性设置为2，意思是从 `@babel/runtime-corejs2`中去加载polyfill，这个里面asyncToGenerator里面包含了必要的依赖 比如`Promise` .需要先需要安装 runtime-corejs2: `npm install @babel/runtime-corejs2 --save`。设置完毕之后，重新编译代码结果(自行与上图对比前三行代码)
![](https://raw.githubusercontent.com/kunkun12/blog/master/imgs/4.jpg)

查阅了一下 `@babel/runtime-corejs2/helpers/asyncToGenerator`模块 第一行也确实引入了promise，部分内容如下
``` javascript
var _Promise = require("../core-js/promise");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    _Promise.resolve(value).then(_next, _throw);
  }
```

#### 关于 decrotors 语法支持
“Decorators”从好三年前就开始炒的特性，这个特性在`Typescript` 、 `angular`、 `mobx`中广为使用，然而经过多年的努力，`Decorators`的是目前仍然处于`Stage2`，babel官方从babel 5 就有支持 `Decorators`的plugin，因为草案不稳定的原因，在babel6中从内置插件中移除了对“装饰器”语法转换的支持，之前我们都是使用 “民间”的第三方插件(babel-plugin-transform-decorators-legacy)来转换装饰器语法，babel7中把这个插件纳入了babel的内置插件列表中,名字也改为 [`@babel/plugin-proposal-decorators` ](https://babeljs.io/docs/en/babel-plugin-proposal-decorators)。配置起来比较简单

```javascript
{
    "presets": [["@babel/env"]],
    "plugins": [["@babel/plugin-proposal-decorators", {
        "legacy": true
    }]]
}
```
### 一些第三方Babel Plugin
官方提供的plugin 一般是用来对目前成型的标准或者草案进行通用的转换，那么我们是否可以根据自己的需求，来定制自己的转换规则？受益于babel提供的插件扩展机制，我们可以完成对语法树进行操作，从而对代码的转换，只需要关注语法的transform这个关键的步骤，自定义Visitor，利用babel提供的API可以方便的操作语法树的节点，其他的工作比如语法树解析，遍历算法、代码生成等由 Babel帮我们自动完成这些步骤。如果对编写babel插件有兴趣，可以去参考[babel插件手册](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md)。（这篇文章写很详细，熟悉之后写插件没啥问题了， 如果第一次看，不用害怕，细心的看下去，多看一遍，可能一些陌生的词汇有些唬人， 利用Babel API操作AST ，相当于使用jQuery来操作DOM树）。一定要善于利用AST的神器[astexplorer](https://astexplorer.net) 或者 http://esprima.org/demo/parse.html 或者 使用[JAVASCRIPT AST VISUALIZER](https://resources.jointjs.com/demos/rappid/apps/Ast/index.html)可视化查看语法树结构

社区中有一些为了满足特定需求的plugin，对实际项目开发中很有用处，这里举例介绍两个，我们通过读这些插件的源码也能有助于我们掌握babel的插件开发

- [babel-plugin-import](https://www.npmjs.com/package/babel-plugin-import) 在import阶段进行转换，只导入需要的文件，将导入整个库的代码转为只导入单个的组件文件、避免导入整个库。适用于 antd, antd-mobile, lodash, material-ui
- [babel-plugin-preval](https://www.npmjs.com/package/babel-plugin-preval) 在nodeJS环境下执行代码返回函数执行的结果。
- [babel-plugin-codegen](https://www.npmjs.com/package/babel-plugin-codegen) 在nodeJS环境下执行代码，返回的结果字符串，作为JavaScript语句表达式插入到代码中 比如楼上功能更强
- babel-plugin-transform-remove-console 功能如其名


### Babel macros

关于Babel插件的使用也有一些小问题:

- 在看一个项目的代码的时候，无法确定代码是否要经由一个插件转换，对于新人阅读代码 容易造成迷惑
- 启用一个插件 必须修改babel的配置文件或者webpack的配置
- 遍历节点的时候，执行多个插件 可能会造成冲突，带来困扰

这个时候就有一种需求：不改变Babel配置的情况下，在应用的代码里面动态为特定的代码应用指定的语法转换，babel macros就是满足为了这个需求，babel macros 的想法的来源于[create-react-app的一个issue](https://github.com/facebook/create-react-app/issues/2730)，目前macros已经在create-react-app中使用了，(create-react-app不推荐用户自行修改配置文件)。宏的功能与babel plugin功能上差不多，babel plugin的引入需要在babel的配置文件中添加配置，只是宏是让我们可以对手动指定的代码进行语法转换的。babel 有许多plugin，也有许多的macro可用，不同的宏功能不同。macro的出现让我们在代码中手动的使用babel的转换功能。


如果是使用macros 需要先安装babel-plugin-macros，启用macros的能力 `npm install --save-dev babel-plugin-macros` 。babel-plugin-macros 不是一个具体的macro，只是给macro提供了一个运行的平台，不具有转换特定代码的功能，第一次使用宏的时候，需要在babel配置文件`plugins`里面添加`macros`、之后使用具体的宏不需要再改babel的配置。这里可以查看具体可用的[macros](https://github.com/kentcdodds/babel-plugin-macros/blob/master/other/docs/macros.md) 根据需求安装对应的macros 在代码里面使用即可。说了这些还是不直观，下面以`penv.macro`介绍下具体如何使用宏。

penv.macro 用来在一个代码文件中统一管理你的环境变量, 并且只保留与当前环境变量匹配的值。与当前环境无关的代码被移除，确保不会将与指定环境不相干的代码发布到对应的环境上.

1. `npm install --save-dev babel-plugin-macros` 修改babel配置文件在plugins中 添加 macros （使用宏功能必须有这一步，提供一个运行宏的环境）
2. `npm install penv.macro --save-dev`
``` JavaScript
import env from 'penv.macro'

const BASE_URL = env({
  development: 'https://development.example.com',
  staging: 'https://staging.example.com',
  production: (() => 'https://production.example.com')(),
})
```
假设编译的时候 process.env.NODE_ENV 为 production，编译后的结果如下，这个功能与webpack中的DefinePlugin功能类似，然而这种方式使用起来要感觉舒服很多。统一管理，不依赖webpack的配置，也方便就近维护，同时也避免上线后混杂了其他环境下的代码

``` javascript
    const BASE_URL = (() => 'https://production.example.com')()
```

宏为我们提供了解决问题的另一种思路,所有的宏都以/macro为后缀，在代码中显式导入宏，在需要的地方调用具体的宏，也能方便对功能的理解，心里也清楚这行代码要被Babel macro来转换（若使用插件，语法被转换了，可能不清楚是什么原因造成的)，增加新的宏也不需要修改babel的配置，同时也能避免插件顺序配置问题导致的冲突。这里有一些可用的[宏列表](https://github.com/jgierer12/awesome-babel-macros) 另外把插件转换为宏也很容易，比如 上面介绍的 preval、和codegen插件就有对应的 preval.macro 和 codegen.macro。也有人[基于codegen.macro来实现国际化方案](https://medium.freecodecamp.org/using-babel-macros-with-react-native-8615aaf5b7df)。另外更好的国际化方案可以使用 [@lingui/macro](https://lingui.js.org/ref/macro.html)


### 总结
写了这些 希望能对babel有一些了解，Babel不止可以用来做标准的语法转换，还可以帮助我们通过使用编译手段来解决工程化的一些问题，Babel API给我们提供了方便操作语法树的工具，让定制需求变的简单。本文更多的是介绍一些思路以及学习方向，很多东西要写，受限于笔墨，没有写太多，里面涉及到的知识点，都可以深入来研究，另外文章中涉及链接文章都有很好的指导意义。


### One More things 关于babel作者的八卦

6to5 的作者 Sebastian McKenzie是个澳大利亚人，8岁的时候发布的自己第一个网站，2014年17岁的在高中的时候开始玩github 然后第一次commit 就是 6to5，在项目上很上心，bug反馈几分钟之后就能被修复，因为一直盯着电脑，没有别的事情做。。。不喜欢上学，成绩不好，没有上大学，高中结束后，想找个nodeJS 初级工程师的工作，简历上也附上自己项目的代码，然而也多次碰壁，投简历的公司对他做的事情也不感兴趣。。辛苦之下好不容易在11月在悉尼份找到一份工作，没谈薪资就把offer接了。干了三个月去伦敦CloudFlare。2015年去了美国加入了CloudFlare 可以开心的写node了。。。2015.2月 年6to5 改名为Babel。[2015-6月 facebook 宣布 React and React Native的构建系统基于Babel替换自家的JSTransform](https://reactjs.org/blog/2015/06/12/deprecating-jstransform-and-react-tools.html) ，同年七月18岁的 Sebastian 加入facebook，截止目前还在。

#### 学习资料 这些好好看完就成babel高手了
- [babel官网](https://babeljs.io/docs/en/)、 [以及相关博客](https://babeljs.io/blog/)
- [Babel 插件开发](https://xiaoiver.github.io/coding/2018/05/12/Babel-%E6%8F%92%E4%BB%B6%E5%BC%80%E5%8F%91.html)
- [http://www.alloyteam.com/2017/04/analysis-of-babel-babel-overview/](http://www.alloyteam.com/2017/04/analysis-of-babel-babel-overview/)
- [babel-plugin-macros](https://github.com/kentcdodds/babel-plugin-macros)
- [zero-config-with-babel-macros](https://babeljs.io/blog/2017/09/11/zero-config-with-babel-macros)
- [How writing custom Babel & ESLint plugins can increase productivity & improve user experience](https://blog.kentcdodds.com/how-writing-custom-babel-and-eslint-plugins-can-increase-your-productivity-and-improve-user-fd6dd8076e26)
- https://github.com/kentcdodds/babel-plugin-macros/tree/master/other/docs
- [JavaScript Transpilers: What They Are & Why We Need Them](https://scotch.io/tutorials/javascript-transpilers-what-they-are-why-we-need-them#toc-using-transpilers)
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
- ["How Writing a Babel Plugin is like jQuery"](https://www.henryzoo.com/babel-plugin-slides/assets/player/KeynoteDHTMLPlayer.html)
- [Babel Types Documentation](https://babeljs.io/docs/en/babel-types)
- [All about macros](http://slides.com/kentcdodds/macros#/)
- [How to write simple babel macro](https://dev.to/stereobooster/how-to-write-simple-babel-macro-1al1)
- Babel作者自述[2015 in review](https://medium.com/@sebmck/2015-in-review-51ac7035e272)
