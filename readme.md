###  babel macros介绍
最近很少关注babel的新特性，最近看了react conf的一些识视频 有个topic是关于国际化的- [Let React speak your language - Tomáš Ehrlich - React Conf 2018](https://www.youtube.com/watch?v=soAEB7ltQPk) 里面有提到babel-plugin-macro、于是搜索了一下上macros对macro的这个东西，原来babel macro 是 在babel 7.0中带来的新功能参加[更新文档](https://babeljs.io/blog/2018/08/27/7.0.0#babel-macros)中关于对Babel Macros 的描述。


- 需要使用 .babelrc 或者 Webpack 全局配置
- 所有的插件在同一次对于 AST 遍历的过程中进行，可能存在互相影响
- 由于代码会经过插件转译，阅读原始代码时反而会被某些特殊语法困扰
除开语法层面的插件，有些很简单的可定制的转译需求也需要发布插件才能使用，无法使用本地插件




### 参考
 - https://xiaoiver.github.io/coding/2018/05/12/Babel-%E6%8F%92%E4%BB%B6%E5%BC%80%E5%8F%91.html

 - https://babeljs.io/blog/2017/09/11/zero-config-with-babel-macros
 - https://blog.kentcdodds.com/how-writing-custom-babel-and-eslint-plugins-can-increase-your-productivity-and-improve-user-fd6dd8076e26
- https://github.com/kentcdodds/babel-plugin-macros/tree/master/other/docs
- https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/user-handbook.md