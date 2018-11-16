###  babel plugins与babel macros

#### Is Babel a compiler or transpiler?


babel是我们熟知的JavaScript语法“编译器”、是源码的转译源码的编译器(source-to-source)。官方说是[compiler](https://zh.wikipedia.org/wiki/%E7%B7%A8%E8%AD%AF%E5%99%A8)、也有人称之为transpiler(tranform compile)，[Is Babel a compiler or transpiler?]https://stackoverflow.com/questions/43968748/is-babel-a-compiler-or-transpiler)。对我们来说Babel是JavaScript语法转换工具或是翻译工具。bebel编译大致分为三个过程。

- 1、Parse 词法分析得到 Tokens，JS代码生成 [抽象语法树（AST)](https://zh.wikipedia.org/wiki/%E6%8A%BD%E8%B1%A1%E8%AA%9E%E6%B3%95%E6%A8%B9)
- 2、Transform 操作 AST，完成语法树的转换。
- 3、Code Generate 将新的语法树生成代码。

关于babel详细原理以及语法树的知识，可以移步[剖析Babel——Babel总览](http://www.alloyteam.com/2017/04/analysis-of-babel-babel-overview/)

通过基础的文档我们了解到：
1、 什么是AST？它是源代码语法结构的一种抽象表示(类似浏览器页面用抽象为DOM树来表示)、方便对编程语言进行语法分析、语法检查、代码风格检查、语法转换、代码优化等，另外像目前的mpvue、taro 也都用到AST转换的思想。可以在[astexplorer](https://astexplorer.net)中查看
2、语法转换的本质是 将源代码解析为AST、对AST进行遍历（先序深度优先遍历），并对节点进行操作（增、删、改，最后将AST生成代码的过程，这个操作过程采用的是Visitors 模式
3、babel的作用是提供了一套方便进行语法转换的工具。并对语法树的操作进行了封装。
4、babel官方提供了[丰富的plugin](https://babeljs.io/docs/en/plugins/)来完成语法的转译(比如最新的ES标准、草案、JSX、typescript、flow),一个插件只完成一个特定的功能，启用该功能需要在babel的配置文件里面添加即可，为了方便分享，也方便配置，把插件的列表封装为preset，preset即是一堆插件的集合。官方提供的plugin 一般是用来对目前成型的标准或者草案进行通用的转换，如果我们要根据自己的需求，定制自己的转换规则，受益于babel提供的插件扩展机制，我们很容易的完成对语法树进行操作，完成对代码的转译，只需要关注语法的transform这个关键的步骤，自定义Visitor，利用babel提供的API来方便的操作语法树的节点，其他的工作比如语法树解析，遍历算法、代码生成等 babel帮我们自动完成这些步骤。如果对编写babel插件有兴趣，可以去参考[babel插件手册](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md)。（这篇文章写很详细，熟悉之后写插件没啥问题了， 如果第一次看，不用害怕，细心的看下去，多看一遍，可能一些陌生的词汇有些唬人，利用Babel API操作AST ，相当于使用jQuery来操作DOM树）。学会利用显示AST的神器[astexplorer](https://astexplorer.net) 

社区中有一些为了满足特定需求的plugin，对实际项目开发中很有用处，这里介绍几个
babel 通过配置文件来选择应用哪些插件，支持[多种配置方式](https://babeljs.io/docs/en/configuration)。
先介绍几个插件特定的语法转换例子 idx、lodash、preval
这种增加插件改配置的模式也有一些问题, 使用 .babelrc 或者webpack 为全局的配置，如果有新的插件要增加，需要自己手动改动配置，比如 create-react-app 创建的项目、默认情况下是不推荐改配置的。

语法树遍历每个节点，都会走一遍所有插件的visitor。判断是否命中相关的需要转换的相关的条件，进行语法转换

babel macro的出现让我们可以在应用代码里面 引入语法转换的macro，动态的对指定的代码设置编译的规则。举个栗子。
babel里面有个babel-plugin-idx的插件，目的是解决多层属性访问，可能对空值取属性报错的问题。比如 *props.user.friends[0].friends* 代码中，若 user为null则代码就会报错，使用babel-plugin-idx之后 会自动转化为这种代码。先判断值是否为空。具体使用如下。



这个时候就有一种需求：在应用的代码里面动态为特定的代码应用指定的语法转换，babel 7.0的新特性中 有一项 只不过“babel-macros” 在一定程度上解决了这个问题，macros翻译为“宏”，之前在C语言里面有 宏的概念，关键字define关键字进行定义，在预编译阶段对于应用宏的地方进行简单的字符串替换。babel macros目的让我们不修改babel的配置文件的前提下，编写代码里面导入特定的macro，按照一定规则编码，在babel 编译的时候，使用执行该宏对代码进行预处理（根据宏的规则对代码进行替换），babel macros 的想法的来源于[create-react-app的一个issue](https://github.com/facebook/create-react-app/issues/2730)，目前macros 已经在这个项目中使用了。宏的功能与babel plugin功能上差不多，babel plugin的引入需要在babel的配置文件中添加配置，只是宏是让我们可以对手动指定的代码进行语法转换的。babel 有许多plugin，也有许多的macro可用，不同的宏功能不同。plugin与macro的使用方式不同。


如果是使用macros 需要先安装babel-plugin-macros，启用macros的能力 `npm install --save-dev babel-plugin-macros` 。babel-plugin-macros 不是一个具体的macro，只是给macro提供了一个运行的平台，不具有转换特定代码的功能，这里可以查看具体可用[macros列表](https://github.com/kentcdodds/babel-plugin-macros/blob/master/other/docs/macros.md) 根据需求安装对应的macros 在代码里面使用即可。说了这么多还是不直观，下面介绍下具体如何使用宏。







### 参考
- https://xiaoiver.github.io/coding/2018/05/12/Babel-%E6%8F%92%E4%BB%B6%E5%BC%80%E5%8F%91.html
- https://github.com/kentcdodds/babel-plugin-macros
- https://babeljs.io/blog/2017/09/11/zero-config-with-babel-macros
- https://blog.kentcdodds.com/how-writing-custom-babel-and-eslint-plugins-can-increase-your-productivity-and-improve-user-fd6dd8076e26
- https://github.com/kentcdodds/babel-plugin-macros/tree/master/other/docs
- https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/user-handbook.md
- https://juejin.im/entry/5ad41747518825558002b2a7
