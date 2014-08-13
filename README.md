# lib.navigation

## 最新版本

**0.1.0**

## 依赖库

无

完整引用举例：

    
    <script src="http://g.tbcdn.cn/mtb/lib-navigation/{{version}}/navigation.js"></script>

## 用Grunt打包

运行 `npm install`，来安装所需的依赖模块。关于NPM的知识，请参见[nodejs](http://nodejs.org/);

运行 `grunt`，来对项目进行打包。关于Grunt的知识，请参见[gruntjs](http://gruntjs.com/);

## 如何使用

### 初始化

    var Navigation = lib.navigation;
    var instance = new Navigation();
    instance.start({
        defaultPath: 'path1', // 启动时的默认路径
        defaultArgs: {        // 启动时的默认参数
            'q1': 'v1'
        },
        useHistoryState: true // 是否用history state来代替hash（会自动进行兼容性判断，不兼容的不会启用）
    });
    

## 接口

### start([Object options])

启动路由

- [Object options]
    - [String defaultPath] 提供启动时的默认路径，如路径不存在则使用该默认路径
    - [String defaultArgs] 提供启动时的默认参数，如参数不存在则使用该默认参数
    - [Boolean useHistoryState] 是否用history state来代替hash（会自动进行兼容性判断，不兼容的不会启用）

### push([String path], [Object args])

推入一个路径到导航栈中，并随之触发一个`navigation:push`事件

- [String path] 路径名称
- [Object args] 传递的参数

### pop();

弹出一个路径，并随之触发一个`navigation:pop`事件

### replace([String path], [Object args])

替换当前导航栈顶的路径，并随之触发一个`navigation:replace`事件

## 属性

### [GET Boolean] useHistoryState

返回当前是否启用了history state。

### [GET Object] state

返回当前导航的状态

- [String name] 路径名
- [Enum args] 参数集合
- [Number id] 在导航栈中的位置

### [GET String] action

本次导航操作的名称（`initial`/`push`/`pop`/`replace`）。

## 事件

所有事件都需在window上监听

### navigation:push

发生一次推入时触发

### navigation:pop

发生一次弹出时触发

### navigation:replace

发生一次替换时触发
