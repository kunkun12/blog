先放一下Flutter的练手Demo

<video src="https://raw.githubusercontent.com/kunkun12/blog/master/imgs/1546596239084815.mp4" controls="controls" style='width:300px' autoplay></video>
2014年谷歌开始搞了个实验项目 Sky ，在Dart Developer Summit 2015 第一次亮相[Sky: An Experiment Writing Dart for Mobile (Dart Developer Summit 2015)](https://www.youtube.com/watch?v=PnIWl33YMwA)，号称基于Dart来开发现代化移动优先的高性能 跨平台App、帧率可以达到120fps及以上，2015年10月 Sky 改名为Flutter，并发布了官方网站flutter.io，谷歌内部开始用Flutter开发实际项目，2018年发展迅速，开始火起来了,2018年12月初FLutter 1.0 released。可以看出Flutter跟RN差不多是同时期的产品，Flutter在应用层玩法也是受React很多的启发，二者UI绘制工作原理不同，RN用的系统SDK的UI，Flutter是自绘制的UI，操作UI不需要bridge来进行通信 因此确保了性能，FLutter团队的成员大都是来自Chrome团队，里面也融入了不少Web的思想，以及FLutter的技术负责人也是因此FLutter玩法对web开发者比较友好 。更多Flutter原理 [如何评价 Google 的 Fuchsia、Android、iOS 跨平台应用框架 Flutter](https://www.zhihu.com/question/50156415)

Flutter早起成员之一[Eric Seidel](https://twitter.com/_eseidel) 是WebKit 项目中非常有名的开发者，早年在 Apple 开发 WebKit，2008 年跳槽去了 Chrome 团队，十多年来一直从事Chrome 的开发， [在他的一次访谈中](https://www.youtube.com/watch?v=h7HOt3Jb1Ts)透漏了一些Flutter的一些信息 ，Flutter最初目的是提高web应用程序的体验 ，于是开始内部试验，是基于chrome代码移除了很多功能，比如移除一些兼容性的代码，以及web开发中一些不常用的功能，甚至改了渲染机制 不再兼容web程序,。，，跑了些benchmarks发现性能提升20倍。为了能够做更多的事情，又增加了很多功能，经过三次大的调整之后就成了现在的Flutter。FLutter也致力于提供高性能移动端跨平台App的开发体验，至于[为什么 Flutter 会选择 Dart ？](https://www.infoq.cn/article/why-flutter-uses-dart)，除了Dart一系列有点(语法简单，同时支持AOT和JIT、速度快等）官方还说一个原因是是两个团队离的近。FLutter主要优点如下（可以概括为 简单、高性能、全平台的UI开发体验以及谷歌的大力支持）

### 主要优点
- 跨平台 基于[Skia绘图引擎](https://skia.org/index_zh)实现全平台UI绘制，Chrome、Chrome OS、安卓、火狐浏览器、火狐操作系统以及其它许多产品都使用它作为图形引擎。 FLutter目标是跑在android ios web linux mac windows，同时 也是作为谷歌未来系统fuchsia的御用的UI Kit（当然FLutter目前的重点还是在移动设备）。感觉这是要重新定义新标准的节奏。并且全平台的支持都是谷歌官方自己出的方案（RN官方只是支持ios 和android。桌面和web都是社区给的方案）FLutter也是谷歌内部多个Team的合作的作品（Dart、 Flutter、 chrome等）
- HotReload 改了代码秒见效果。对开发调试效率有了巨大的提升
- 性能: 旨在提供 60fps的刷新率,对于刷新率 120Hz 以上的设备上能达到 120fps。
- Dart。 生来背着“灭掉JS，替换Java”的使命，前几年一直不是很火，最近谷歌开始重视起来。还专门为FLutter 进行Dart的优化，在Rlease模式下直接将Dart编译成本地机器码，避免解释代码执行带来的性能消耗。另外Dart语法简洁，比Java和OC写起来简单太多。异步单线程完全是前端的玩法，思路简单， 不像JAVA中那种新建一个线程请求数据，之后回到主线程来操作UI，
- React style。 Flutter官方也表明过其设计思想最初也是受React个启发，一切都是Widget，没有像android ios 那些些activity fragment 杂七杂八的概念，写应用的模式与React几乎是一模一样，写的多了感觉就是用Dart写React。Flex布局思想可以直接用、React的Component 和 PureComponent，对应Flutter里面有StateFullWidget 和 StateLessWidget，Context 对应Flutter中的 inheritWidget，状态管理redux 对应Flutter_Redux，React里面可以用RxJS，Flutter里面可以用RxDart，都是Reactive UI风格、都是基于虚拟DOM实现UI更新，甚至React新出的Hooks,在Flutter 里面也有了第三方的支持-[flutter_hooks](https://github.com/rrousselGit/flutter_hooks)。个人感觉相比React Native 。Flutter才是真正的在Native App中React思想的实现，实现了曾经我对RN的一些期待(比如高频率交互动画）
- 响应式UI，数据绑定到UI，数据改变后“刷新”UI，不需要获取UI某个元素，手动去更新UI。
- FLutter SDK 高度自由灵活，上层有丰富UI套件，除了Material Design的主题之外 还有一套ios的主题的配套组件，对于复杂UI 自己也可以从Canvas入手 自己来绘制。灵活度堪比系统的SDK。
- 开发工具 Android Studio, IntelliJ,VS Code都提供了Flutter的开发插件，且完善度很高，自动提示用起来也非常爽。支持断点调试，堆栈信息查看，直接跳入源码等 。
- 提供了一套与系统SDK通信的机制 （channel)
- 文档，官方文档 API文档 也是非常完善，也为其他开发者（android ios web reactnative Xamarin) 准备了详细的文档，可以对照学习，UI的思想都差不多。帮助其他的开发者快速入坑Flutter，文档完善度方面这点要比RN强不少了。还有中文翻译文档。以及源码里面的注释即文档。
- 社区 目前有很多学习资料可供参考，谷歌官方也有一些视频。后面会附上链接。（信息过剩的时代，不好的信息也越来越多，甄别高质量的信息也非常重要，否则容易被淹没在一个偏角落里面，不把事件浪费在重复以及没有营养的信息上）

#### 不足
开黑模式

- 截止目前（2019年 1月初） 。FLutter在 github上issue， 处于open状态的有些多 ，数量在4k以上 ，closed 为1.1W。相比RN的数据则为600+ 和1.4W。当然也从另一个方面反映了Flutter受关注度很大，毕竟也是从18年开始火起来的，官方还没来得及解决。这个数据半年后再看
- 在开发过程中遇到两个问题在模式下工作正常 在release模式下，无法work。 并在release模式下调试体验不好。debug 与release模式下运行渲染效果不一样。并且一旦发生了这种问题，调试起来也很棘手，一般跟底层机制有关 比如我最近遇到的这个问题 [issues-23339](https://github.com/flutter/flutter/issues/23339)
- 虽然号称高性能，但目前综合一些评测评测以及个人体验来看，debug模式下有的卡顿问题，在release模式下基本可以做到流畅， 但距离真正的Native 还是有些差距。
- UI写法，写不好容易发生多层次嵌套，形成嵌套地域，可读性也不高，很快看不懂自己写代码了，写UI感觉XML更舒服一些，github也开了两个issue 建议出一套类似JSX的UI规范[11609](https://github.com/flutter/flutter/issues/11609) [issues-15922](https://github.com/flutter/flutter/issues/15922) 被否了，有第三方搞出来一个[DSX](https://spark-heroku-dsx.herokuapp.com/index.html) 
- Webview  Flutter本身不提供webview组件，之后应该也不会专门提供Webview， 可以使用Flutter社区提供的[flutter_webview_plugin](https://github.com/fluttercommunity/flutter_webview_plugin)插件，本质通过使用系统SDK的webview来实现，这样可以使用Dart对webview进行基本的操作，但是并没有提供Dart 和 JavaScript通信机制以及对Webview发出请求的拦截，当然开发者完全可以自己去定义，webview 跟系统SDK通信，然后系统SDK使用channel机制与Dart通信，目前支持的Dart与webview的交互也是这种套路。
- 图片缓存，Flutter的Image组件本身不支持离线缓存（支持运行时最大1000张图片以及上线100M运行时缓存），比如浏览过的图片，断网重启APP查看，无法加载了，可以结合第三方插件cached_network_image。
- 有时候Hotreload不生效，需要重启运行方可。
- 实战了一个例子， Release打包之后 Android下有 6M。iOS打包之后有30M。这个包不算小了。

总结，小问题不少，但没有太大的硬伤，随着时间一些问题应该可以解决，或者被慢慢接受。


小结 ：FLutter 虽有不少问题，但谷歌支持力度很大，对于有React经验的同学 上手也是非常容易的。当然相比之下RN的最大优势是动态化：苹果开发者协议允许动态下发JavaScript代码。目前Flutter在iOS下没有很好的动态化方案，[相关issue讨论](https://github.com/flutter/flutter/issues/14330)。
很难说Flutter是否是未来的趋势，但是我相信，简单化一定是未来的趋势。
另外Hummingbird（FLutter web版代号）release之后，可发挥的空间更大，比如写个编辑器用Hummingbird在web端预览，然后拖拉拽一把梭生成native的主流程。Flutter可以收割一波Web开发者
另外就是Fuchsia 这个系统不知道谷歌会有什么态度，如果谷歌大力支持的话，应该也能为Flutter带来不少流量。




学习路线以及资料。
学习新东西可能会比较慢，这也是值得庆幸，把自己不懂的东西看懂 就是进步，人的能力的提高也是这个过程，先弄懂什么，然后在研究怎么用，然后再去看源码。资料非常多，质量也非常高，阅读资料的之后，最重要的是写代码练习，理解原理重要 敲代码也很重要。

- [Dart基础学习](https://www.dartlang.org/guides/language/language-tour) 看完这个应该差不多了。
-  读[官方文档](https://flutter.io/docs) 搭建Flutter开发环境，有的同学连文档都不仔细看 直接一把梭，遇到问题到群里问，部分文档也有[中文的翻译](https://flutterchina.club/docs/)。至于Web开发者 [Flutter for web developers](https://flutter.io/docs/get-started/flutter-for/web-devs)这篇文章一定要看，同理也有 [Flutter for Android developers](https://flutter.io/docs/get-started/flutter-for/android-devs) 、(Flutter for iOS developers)[https://flutter.io/docs/get-started/flutter-for/ios-devs] 等。
[Codelabs](https://flutter.io/docs/codelabs) 这里面的一些例子可以照着抄一篇，尝试自己去理解一下。看完文档直接撸UI应该是没有问题了，国内开发者也在编写[Flutter实战](https://book.flutterchina.club/) 
- 关于Widget的学习，Flutter有不少的Widget， 分类去理解的话会简单的很多 比如一些基础的像图片 文本 输入框。然后是布局类Row Column 实现FlexBox布局，Wrap实现Flexbox中的自动折行，Stack Positioned实现web中绝对定位的层叠效果。容器类重点Container弄懂，这个基本上相当于Web中的div了。另一类就是滚动组件。。。

- [FLutter原版架构图](https://docs.google.com/presentation/d/1cw7A4HbvM_Abv320rVgPVGiUP2msVs7tfGbkgdrTy0I/edit#slide=id.p)
- [Flutter by Google](https://www.youtube.com/playlist?list=PLOU2XLYxmsIJ7dsVN4iRuA7BT8XHzGtCr) 这是谷歌出的视频
- [Technical videos](https://flutter.io/docs/resources/videos) 谷歌官方的几个系列的视频
- [Flutter Widget of the Week ](https://www.youtube.com/watch?v=lkF0TQJO0bA&list=PLOU2XLYxmsIL0pH0zWe_ZOHgGhZ7UasUE) 这个频道每周都会出一个一分钟左右短视频介绍一个Widget使用。
- [Dart (Flutter Tutorials)](https://www.youtube.com/playlist?list=PLJbE2Yu2zumDqr_-hqpAN0nIr6m14TAsd) 系列视频教程，适合新手。
- [Tensor Programming](https://www.youtube.com/channel/UCYqCZOwHbnPwyjawKfE21wg)
- [Flutter Tutorial for Beginners - Build iOS and Android Apps with Google's Flutter & Dart](https://www.youtube.com/watch?v=GLSG_Wh_YWc) 三个小时的视频，适合入门
- [Flutter's Rendering Pipeline](https://www.youtube.com/watch?v=UUfXWzp0-DU&feature=youtu.be) 一个进阶视频Flutter渲染管线介绍
- [Architecting the Reactive Flutter App  Flutter](https://www.youtube.com/watch?v=UUfXWzp0-DU&feature=youtu.be) 一个视频 架构介绍
- [Build reactive mobile apps with Flutter (Google I/O '18)](https://www.youtube.com/watch?v=RS36gBEp8OI) 2018谷歌I/O关于Flutter演讲
- [Fluttery](https://www.youtube.com/channel/UCtWyVkPpb8An90SNDTNF0Pg/featured) 一些比较高级的视频教程，实战用FLutter实现一些牛逼的效果
- [https://medium.com/flutter-io](https://medium.com/flutter-io) 很多高质量的内容
- [https://medium.com/flutter-community](https://medium.com/flutter-community) 一些进阶博客
- [https://medium.com/coding-with-flutter](https://medium.com/coding-with-flutter) 不错的FLutter专栏
- [https://flutterdoc.com/](https://flutterdoc.com/) 系列博客
- [https://medium.com/flutterpub](https://medium.com/flutterpub) 系列博客
- [Flutter, what are Widgets, RenderObjects and Elements](https://medium.com/flutter-community/flutter-what-are-widgets-renderobjects-and-elements-630a57d05208) 渲染原理中比较核心的三个概念
- [Flutter: Tips and tricks](https://medium.com/cwi-software/flutter-tips-and-tricks-1f0c0189185b) Flutter开发的一些小技巧
- [https://hackernoon.com/whats-revolutionary-about-flutter-946915b09514](https://hackernoon.com/whats-revolutionary-about-flutter-946915b09514)

- [Flutter Live Recap: #AskFlutter Questions and Answers Part-1](https://medium.com/flutter-community/flutter-live-recap-askflutter-questions-and-answers-part-1-9b80753a16a1) [part2](https://medium.com/flutter-community/flutter-live-recap-askflutter-questions-and-answers-part-2-e4d962f3f270) 这两篇不错，官方问答，能了解Flutter一些能力以及发展方向
- [examples](https://github.com/flutter/flutter/tree/master/examples) 官方的exmple代码 [HistoryOfEverything](https://github.com/2d-inc/HistoryOfEverything)  FLutter Live演示例子，目前已经上线 google play 和 ios ap 动效很棒
- [awesome-flutter](https://github.com/Solido/awesome-flutter) awesome-XXX 很多资料
- [chrome 插件： Flutter developer](https://chrome.google.com/webstore/detail/flutter-developer/kimjiioacelfpeflakmeclmfndijcfpp) 阅读API文档的时候 可以方便的跳入到github 对应的源码页面。

- 相关推特号  [Flutter Daily](https://twitter.com/flutteriodaily) [Flutter_DEV](https://twitter.com/r_FlutterDev)  [Flutter Weekly](https://twitter.com/FlutterWk)每天都会有很多Flutter的推文，非常好的一手资源

其他Flutter中文学习资源  
- [使用 Flutter 快速构建美观又高性能的移动应用](https://www.bilibili.com/video/av27857568) Flutter介绍 一个中文的演讲视频
- http://flutter-dev.cn/ 中文论坛
- https://flutterchina.club/ 部分文档中文翻译
- https://juejin.im/tag/Flutter 内容有些多，自己筛选好的信息吧，不要浪费时间
- http://flutter.link/archives/ 
- https://juejin.im/post/5a9a21f8518825558b3d5d35 
- [Flutter干货学堂](https://zhuanlan.zhihu.com/xytech) 闲鱼团队关于Flutter系列文档，内容质量很高。
- [GSYGithubAppFlutter](https://github.com/CarGuo/GSYGithubAppFlutter) 一个不错的项目有源码还有一系列介绍文档

#### 状态管理 
- [State management](https://flutter.io/docs/development/data-and-backend/state-mgmt)
- [Flutter | 状态管理探索篇——Scoped Model（一)](https://juejin.im/post/5b97fa0d5188255c5546dcf8) 我感觉Scoped Model在一般的项目用起来就比较合适了，也很简单 
- [Flutter | 状态管理探索篇——Redux（二）](https://juejin.im/post/5ba26c086fb9a05ce57697da)
- [Flutter | 状态管理探索篇——BLoC(三)](https://juejin.im/post/5bb6f344f265da0aa664d68a)
- [Flutter | 状态管理拓展篇——RxDart(四)](https://juejin.im/post/5bcea438e51d4536c65d2232)
- [Technical Debt and Streams/BLoC](https://www.youtube.com/watch?v=fahC3ky_zW0&t=0s&index=26&list=PLOU2XLYxmsIJ7dsVN4iRuA7BT8XHzGtCr) BLOC是谷歌官方推荐的状态管理方式。
- [Flutter Architecture Samples](http://fluttersamples.com/)
- [Build reactive mobile apps with Flutter (Google I/O '18)](https://www.youtube.com/watch?v=RS36gBEp8OI) 2018谷歌I/O关于Flutter 状态管理的演讲
- [BLOC-a predictable state management library for Dart.](https://felangel.github.io/bloc/#/)
- [State Management Using BLoC Pattern In Flutter](https://hk.saowen.com/a/fbb6e484de022173fe85248875286060ce40d069c97420bc0be49d838e19e372)
