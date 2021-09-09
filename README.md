## 前言
随着web应用复杂度的增加，组件化，工程化，自动化成了前端发展的趋势。每个前端团队都在打造自己的前端开发体系，这通常是一个东拼西凑，逐渐磨合的过程，那究竟一套完整的前端工程化方案是怎样实现，笔者手把手带大家实现一个。

完整的开发流程大概是这样
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d275b22558b548599a74d04a0cf4a5bd~tplv-k3u1fbpfcp-watermark.image)


> 本项目用Webstorm来完成，Webstorm高度集成很多本项目开发需要用到的功能，包括终端、跑脚本、git、github登录、Prettier保存格式化、eslint代码检查等等。这些功能都不需要另外装插件就有现成。但用啥IDE和编辑器是因应个人喜好，如果不想用Webstorm，可以直接忽略本文所介绍到Webstorm开发技巧。


## 项目地址
github : https://github.com/shinewen189/nigo-cli

静态网址 : https://shinewen189.github.io/nigo-cli/#/


## 涉及技术栈
一套完整的前端工程架构涉及很多技术栈，在技术选型方面我们要按照自己的项目需求来选择技术栈，起码要看看这个技术栈热度、维护情况怎样。也不用盲目追新，适合自己项目就好了。

以下列出本项目所用到的技术栈:

-   构建工具：Webpack5.x

-   前端框架：Vue 3.x

-   路由工具：Vue Router 4.x

-   CSS 预编译：Less

-   Git Hook 工具：husky

-   代码规范：  Prettier + Eslint + Airbnb

-   自动部署：  Github Actions


## 架构搭建

### 每一个伟大的项目从npm init 开始

```linux
npm init
```
`npm init` 一路顺风，当然你也可以输入你项目的信息。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3010904b70db47dca180a7a49a075350~tplv-k3u1fbpfcp-watermark.image)

安装 webpack三件套

```js
cnpm i webpack webpack-cli webpack-dev-server -D
```
>1.  -D 等价于 --save-dev; 开发环境时所需依赖
>2.  -S 等价于 --save; 生产环境时所需依赖


### 区分开发环境和生产环境
随着我们业务逻辑的增多，图片、字体、CSS、ES6以及CSS预处理器加入到我们的项目中来，进而导致配置文件的增多，使得配置文件书写起来比较繁琐，更严重者（书写特定文件的位置会出现错误）。由于项目中不同的生产环境和开发环境的配置，使得配置文件变得更加糟糕。
使用单个的配置文件会影响到任务的可重用性，随着项目需求的增长，我们必须要找到更有效地管理配置文件的方法。


在根目录增加`build`文件夹，然后添加以下几个文件。
```js
├─build
│  ├─webpack.common.config.js   //公共配置，
│  ├─webpack.dev.config.js     //mode为development的配置
│  ├─webpack.prod.config.js    //mode为production配置
│  ├─webpack.loader.config.js  //配置loader
```
如果配置文件被分成了许多不同的部分，那么必须以某种方式来组合他们，通常就是合并数组和对象，`webpack-merge`很好的做到了这一点。

以`webpack.dev.config.js`文件为例，使用webpack的`webpack-merge`把当前文件配置合并到公共配置，那么后续如果想增加测试环境、预发布环境 、生产环境只要添加对应的配置文件就可以区分出来。

```js
const { merge } = require('webpack-merge')

const webpackConfigBase = require('./webpack.common.config')

module.exports = merge(webpackConfigBase(false), {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  module: {},
  plugins: [],
  devServer: {
    hot: true
  }
})
```

#### 安装`dotenv`、`cross-env` 配置环境变量


```js
cnpm i dotenv cross-env -D
```
在根目录添加两个文件，里面可以添加自己定义的全局变量，然后按照不同环境写入不同的变量。
```js
├─.env.dev //配置开发环境的变量
├─.env.prod //配置生产环境的变量
```
修改`.env.dev`

```js
NODE_ENV = 'development'
VUE_SHOWCONSOLE = true  //是否显示console
VUE_DEV_URL ='www.xxx.com' //开发环境接口地址
```

修改 `webpack.common.config.js ` 将写好的变量配置到该文件

```js
const { resolve } = require('path')
const webpack = require('webpack')


require('dotenv').config({ path: `.env.${process.env.envMode}` })
let env = {}
// 只有 NODE_ENV，BASE_URL 和以 VUE_APP_ 开头的变量将通过 webpack.DefinePlugin 静态地嵌入到客户端侧的代码中
for (const key in process.env) {
  if (key === 'NODE_ENV' || key === 'BASE_URL' || /^VUE_APP_/.test(key)) {
    env[key] = JSON.stringify(process.env[key])
  }
}

module.exports = (mode) => {
  return {
    .../
    plugins: [
      new webpack.DefinePlugin({
        // 定义环境和变量
        'process.env': {
          ...env
        }
      })
    ]
  }
}
```


`packgae.json` 文件增加两条命令分别对应开发环境和生产坏境

```js
"scripts": {
  "dev": "cross-env envMode=dev webpack serve --config build/webpack.dev.config.js  --color",
  "build": "cross-env envMode=prod webpack --config build/webpack.prod.config.js  --color"
},
```

> 如果还有其他环境可以按照自己的需求去添加，比如测试环境、预发布环境等等


到现在我们就可以试试在不同环境来测试，先跑一下开发环境。



```js
npm run dev
```

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e1eeaf5ebe5e46adb51fed79b0ab6049~tplv-k3u1fbpfcp-watermark.image)


> 跑通的话到这个基础架构就基本搭建好了。至于webpack5更深入的配置下文会一一用到。
>

### 添加各种技术栈
有一个基于webpack的架构，我们就可以继续添加自己要用到的技术栈，添加什么技术栈这个看自己项目需求，本文以`vue3+VueRouter4+less`为例：

#### 安装vue3和vue-loader

```js
cnpm i vue@next -D
cnpm i vue-loader@next @vue/compiler-sfc -D
```

webpack.loader.config.js 添加 `vue-loader`

```js
rules: [
    {
        test: /.vue$/,
        use: [
            'vue-loader'
        ]
    }
]
```
webpack.common.config.js 添加 `VueLoaderPlugin`
```js
const { VueLoaderPlugin } = require('vue-loader/dist/index');
plugins: [
    new VueLoaderPlugin()
]
```

#### 将 ES6+ 转 ES5

由于有些浏览器无法解析 ES6+ 等高级语法，故需要将其转化为浏览器能够解析的低版本语法

```js
cnpm i @babel/core @babel/preset-env babel-loader -D
```

**babel-loader配置**

```js
// webpack.loader.config.js
rules: [
    {
        test: /.js$/,
        exclude: /node_modules/,
        use: {
            loader: 'babel-loader',
        }
    }, 
]

```

**Babel 配置文件**

在根目录增加`babel.config.js`
```js
// babel.config.js

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: ['last 2 versions'] // 最近 2 个版本的浏览器
        }
      }
    ]
  ]
  }
```

#### 安装html-webpack-plugin

安装 `html-webpack-plugin` 插件处理 index.html 文件，此插件的功能是根据提供的模板文件，自动生成正确的项目入口文件，并把 webpack 打包的 js 文件自动插入其中

```js
cnpm i html-webpack-plugin -D
```

**plugins配置**

```js
// webpack.common.config.js
new HtmlWebpackPlugin({
	template: resolve(__dirname, '../index.html'),
	filename: 'index.html',
	title: 'nigo-cli',
	minify: {
		html5: true, // 根据HTML5规范解析输入
		collapseWhitespace: true, // 折叠空白区域
		preserveLineBreaks: false,
		minifyCSS: true, // 压缩文内css
		minifyJS: true, // 压缩文内js
		removeComments: false // 移除注释
	},
})
```




#### 添加vue-router



```js
cnpm i vueRouter@last -D
```
```js
├─src
   ├─router
   │   ├─index.js   //定义路由规则
```
修改路由`index.js`路由规则

```js
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/view/home.vue')
  }
]


const router = createRouter({
  history: createWebHashHistory(),
  routes 
})

export default router
```

在 `main.js` 文件中挂载路由配置
```js
import { createApp } from 'vue'
import App from '@/App.vue' // 引入 APP 页面组建
import router from '@/router'

createApp(App).use(router).mount('#app')
```

#### 添加 less 预处理器



```js
cnpm i style-loader css-loader less-loader -D
```

webpack.loader.config.js 添加 `less-loader`

```js
rules: [
{
  test: /.less$/,
  use: ['style-loader', 'css-loader', 'less-loader']
},
]
```


> 这样集成Vue3+VueRouter4+less的架构基本搭好，后续我们还可以添加Vuex状态管理工具、Axios、其他css预处理器。

## 配置webpack

#### 配置 alias 别名
配置 `@` 为项目根目录下放资源和源码的 `/src` 目录的别名；后续按照自己的需求增加，比如增加静态资源别名

`webpack.common.config.js`增加以下代码
```js
//...
resolve: {
//...
alias: {
 '@': resolve('src')
 }
}
```
#### 处理图片等静态资源

Webpack5 之前我们处理静态资源比如PNG 图片、SVG 图标等等，需要用到url-loader，file-loader，raw-loader。Webpack5 提供了内置的静态资源构建能力，我们不需要安装额外的 loader，仅需要简单的配置就能实现静态资源的打包和分目录存放。这三个loader在github上也停止了更新。

webpack5使用四种新增的资源模块（[Asset Modules](https://link.juejin.cn?target=https%3A%2F%2Fwebpack.js.org%2Fguides%2Fasset-modules%2F "https://webpack.js.org/guides/asset-modules/")）替代了这些loader的功能。

asset/resource 将资源分割为单独的文件，并导出url，就是之前的 file-loader的功能. asset/inline 将资源导出为dataURL（url(data:)）的形式，之前的 url-loader的功能. asset/source 将资源导出为源码（source code）. 之前的 raw-loader 功能. asset 自动选择导出为单独文件或者 dataURL形式（默认为8KB）. 之前有url-loader设置asset size limit 限制实现。


配置 `webpack.loader.config.js`
```js
{
    test: /.(png|jpg|svg|gif)$/,
    type: 'asset/resource',
    generator: {
        // [ext]前面自带"."
        filename: 'assets/[hash:8].[name][ext]',
    },
}
```


#### 清除dist目录

webpack5.20以下版本清除dist文件内容一般使用插件 clean-webpack-plugin， 5.20版本以后output新增特性`clean`，用于清除dist目录

配置`webpack.prod.config.js`
```js
module.exports = {
  //...
  output: {
    clean: true, // Clean the output directory before emit.
  },
};
```

###  FileSystem Cache 加速二次构建

Webpack5 之前，我们会使用 [cache-loader](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fwebpack-contrib%2Fcache-loader "https://github.com/webpack-contrib/cache-loader") 缓存一些性能开销较大的 loader ，或者是使用 [hard-source-webpack-plugin](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmzgoddard%2Fhard-source-webpack-plugin "https://github.com/mzgoddard/hard-source-webpack-plugin") 为模块提供一些中间缓存。在 Webpack5 之后，默认就为我们集成了一种自带的缓存能力（[对 module 和 chunks 进行缓存](https://link.juejin.cn?target=https%3A%2F%2Fwebpack.js.org%2Fconfiguration%2Fother-options%2F%23cache "https://webpack.js.org/configuration/other-options/#cache")）。通过如下配置，即可在二次构建时提速。

配置`webpack.prod.config.js`

```js
module.exports = {
    //...
    cache: {
        type: 'filesystem',
        // 可选配置
        buildDependencies: {
            config: [__filename],  // 当构建依赖的config文件（通过 require 依赖）内容发生变化时，缓存失效
        },
        name: '',  // 配置以name为隔离，创建不同的缓存文件，如生成PC或mobile不同的配置缓存
        //...
    },
}
```
> 以上介绍只是webpack5的新特性和比较基础的配置，后续还是要因应需求去配置。包括css分离、css压缩、js压缩等，在这里就不一一展开讨论。

## 代码规范
以上架构的搭建一般可以满足个人开发需求，因为不需要考虑团队合作、代码规范、提交规范等等。

但如果需要团队合作完成我们就要考虑代码规范的问题，由于 JavaScript 的灵活性，往往一段代码能有多种写法，这时候也会导致协同时差异。并且，有一些写法可能会导致不易发现的 bug，或者这些写法的性能不好，开发时也应该避免。

为了解决这类静态代码问题，每个团队都需要一个统一的 JavaScript 代码规范，团队成员都遵守这份代码规范来编写代码。当然，靠人来保障代码规范是不可靠的，需要有对应的工具来保障。

#### 安装 Prettier

Prettier 是一款强大的代码格式化工具，支持 JavaScript、TypeScript、CSS、SCSS、Less、JSX、Angular、Vue、GraphQL、JSON、Markdown 等语言，基本上前端能用到的文件格式它都可以搞定，是当下最流行的代码格式化工具。



```js
cnpm i prettier -D
```
在项目根目录下创建 `.prettierrc` 文件，在这个文件可以配置团队统一的格式化风格。
```js
{
  "useTabs": false,
  "tabWidth": 2,
  "printWidth": 100,
  "singleQuote": true,
  "trailingComma": "none",
  "bracketSpacing": true,
  "semi": false
}
```
如果想保存文件之后格式化可以在Webstorm设置找到`file wathcer `，添加 `prettierrc`

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c8db35f4554945509b6ef3cbcc8ad4ff~tplv-k3u1fbpfcp-watermark.image)

按下图设置，那么保存修改后的文件就会自动按照`.prettierrc`配置去格式化，爽得不要不要。
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c32f20866e7940bf8d4b2328865be615~tplv-k3u1fbpfcp-watermark.image)



#### 安装 ESLint
```js
cnpm i eslint -D
```
ESLint 安装成功后，执行 `npx eslint --init`，然后按照终端操作提示完成一系列设置来创建配置文件。


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7bade71d814444a7b012357044fbc4d3~tplv-k3u1fbpfcp-watermark.image)

> 如果自动安装失败，那么就需要手动安装



```js
cnpm i eslint-config-airbnb-base -D 
cnpm i eslint-plugin-vue -D
cnpm i eslint-config-prettier -D
cnpm i eslint-import-resolver-webpack -D
cnpm i eslint-plugin-import -D
cnpm i eslint-plugin-prettier -D
cnpm i eslint-webpack-plugin -D
```

在根目录添加忽略检查文件`.eslintignore`
```js
node_modules
dist/
build/
/*.js
```
在根目录添加`.eslintrc.js`

```js
module.exports = {
  root: true, // 此项是用来告诉eslint找当前配置文件不能往父级查找
  env: {
    browser: true,
    es2021: true
  },
  extends: ['plugin:vue/essential', 'airbnb-base', 'plugin:prettier/recommended'],
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: ['vue', 'prettier'],
  settings: {
    'import/resolver': {
      webpack: {
        config: 'build/webpack.dev.config.js'
      }
    }
  },
  rules: {
    'prettier/prettier': 'error'
  }
}
```
webpack5.20以后不需要`eslint-loader`直接在`webpack.common.config.js`添加如下代码


```js
plugins:[
new ESLintPlugin({
  // fix: true,
  extensions: ['js', 'json', 'vue'],
  exclude: '/node_modules/'
})
]
```
如果想在webstorm波浪线标红代码，可以在设置找到`eslint`，按照下图设置

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ba8722f6afcb4731aff115c4a1406fba~tplv-k3u1fbpfcp-watermark.image)

打开任意js文件，或者vue文件，看到变量没有使用到会标红

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8b5bc6ac886446359ee50bc449588f20~tplv-k3u1fbpfcp-watermark.image)

终端也会报变量没有使用。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cb1b48079c284192a5f6776ba6588ff1~tplv-k3u1fbpfcp-watermark.image)

> 在本项目用到是airbnb公司的代码规范，当然你可以用其他团队规范或者自定义一些团队规则，关于eslint定义规则在这里就不一一展开讨论了

## 提交git仓库


在根目录新建一个提交忽略的文件`.gitignore`

```js
logs/
npm-debug.log
yarn-error.log
node_modules/
dist/
package-lock.json
yarn.lock
.idea/
```

#### 在webstorm登录你的GitHub

打开webstorm的设置，搜索github，你可以选择账号密码登录或token（token需要你在GitHub创建）


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/17557852177b4f1783b5e425b6843017~tplv-k3u1fbpfcp-watermark.image)

登录完成之后，点击右上角的 test，会弹出连接成功。

#### 本地生成 SSH Key并添加到GitHub上面

因为我们本地 Git 仓库和 GitHub 仓库之间的传输是通过 SSH 加密的，所以我们需要配置验证信息

git 命令行生成秘钥


```js
ssh-keygen -t rsa -C "youremail@example.com"
```

**这里的邮箱账号是你GitHub的邮箱账号** ，（点击回车之后 可能会要求你输入账号和密码），反正一路回车就行。成功之后会生成秘钥。打开 **硬盘 id_rsa.pub 文件**（自己搜索），复制里面的key

GitHub上面配置秘钥
打开 GitHub网站 依次点击 Setting => SSH and GPG keys ,然后添加 ssh


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e758c66702a44f48ba4e96731ab8308d~tplv-k3u1fbpfcp-watermark.image)


添加之后 可以输入下面git命令 验证是否成功


```js
ssh -T git@github.com
```

第一次运行该命令可能会出现提示信息，输入 yes 即可，下面信息表示验证成功


```js
Hi yourname! You've successfully authenticated, but GitHub does not provide shell access.
```

#### 把项目上传到GitHub

在webstorm 点击头部 VCS

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b4d8ac5cb5e64eab8f839bacaac516fd~tplv-k3u1fbpfcp-watermark.image)

点击share Project on GitHub 之后再填写仓库名称 等等就可以了。

打开github仓库
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4a157fbef3e3423c87412f3d9ac290e8~tplv-k3u1fbpfcp-watermark.image)
> 提交github仓库有好几种方式，如命令行、在网站创建仓库等等。这个可以按照个人喜好来完成。
#### 提交规范

我们在项目中已集成 ESLint 和 Prettier，在编码时，这些工具可以对我们写的代码进行实时校验，在一定程度上能有效规范我们写的代码，但团队可能会有些人觉得这些条条框框的限制很麻烦，选择视“提示”而不见，依旧按自己的一套风格来写代码，或者干脆禁用掉这些工具，开发完成就直接把代码提交到了仓库，日积月累，ESLint 也就形同虚设。

所以，我们还需要做一些限制，让没通过 ESLint 检测和修复的代码禁止提交，从而保证仓库代码都是符合规范的。

为了解决这个问题，我们需要用到 Git Hook，在本地执行 `git commit` 的时候，就对所提交的代码进行 ESLint 检测和修复（即执行 `eslint --fix`），如果这些代码没通过 ESLint 规则校验，则禁止提交。

实现这一功能，我们借助 [husky](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ftypicode%2Fhusky "https://github.com/typicode/husky")

> [husky](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ftypicode%2Fhusky "https://github.com/typicode/husky") —— Git Hook 工具，可以设置在 git 各个阶段（`pre-commit`、`commit-msg`、`pre-push` 等）触发我们的命令。



使用 `husky-init` 命令快速在项目初始化一个 husky 配置。

```js
npx husky-init && cnpm install
```

执行命令生成了一个`.husky`文件夹和一些文件

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5dc262dcdf344876914326da581c4a66~tplv-k3u1fbpfcp-watermark.image)

修改 `pre-commit`


```js
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run lint
```
package.jon 添加命令


```js
"scripts": {
  "lint": "eslint --ext .js,.vue src"
},
```

测试一下提交代码，看到有报错的代码是提交不了的。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6941dd484ae747e0ab8294f30597ce41~tplv-k3u1fbpfcp-watermark.image)

> 刚开始使用 ESint 的时候可能会有很多问题，改起来也很费时费力，只要坚持下去，代码质量和开发效率都会得到提升，前期的付出都是值得的。


## 自动部署项目

#### 创建 GitHub Token

创建一个有 **repo** 和 **workflow** 权限的 [GitHub Token](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fsettings%2Ftokens%2Fnew "https://github.com/settings/tokens/new")


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/df4080b1452d42b6ab9cc2ceba631bfd~tplv-k3u1fbpfcp-watermark.image)

> 注意：新生成的 Token 只会显示一次，保存起来，后面要用到。如有遗失，重新生成即可。

#### 在仓库中添加 secret

将上面新创建的 Token 添加到 GitHub 仓库的 `Secrets` 里，并将这个新增的 `secret` 命名为 `NIGO_DEV` （名字无所谓，看你喜欢）。

步骤：仓库 -> `settings` -> `Secrets` -> `New repository secret`。


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bde7ad070bae40d6a8f172b088f48e14~tplv-k3u1fbpfcp-watermark.image)


#### 创建 Actions 配置文件

1.  在项目根目录下创建 `.github` 目录。
1.  在 `.github` 目录下创建 `workflows` 目录。
1.  在 `workflows` 目录下创建 `deploy.yml` 文件。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1fb28ac859104dc2a4eef08610b21e9e~tplv-k3u1fbpfcp-watermark.image)

修改 `deploy.yml` 文件，添加如下代码


```js

name: deploy

on:
  push:
    branches: [master] # master 分支有 push 时触发

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js v14.x
        uses: actions/setup-node@v1
        with:
          node-version: '14.x'

      - name: Install
        run: yarn install # 安装依赖

      - name: Build
        run: npm run build # 打包

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3 # 使用部署到 GitHub pages 的 action
        with:
          publish_dir: ./dist # 部署打包后的 dist 目录
          github_token: ${{ secrets.NIGO_DEV }} # secret 名
          user_name: ${{ secrets.MY_USER_NAME }}
          user_email: ${{ secrets.MY_USER_EMAIL }}
          commit_message: Update # 部署时的 git 提交信息，自由填写

```


接着只要提交修改代码，Github Actions就会运行自动部署


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/57de0dcea07e4692ab050b1416e3bb64~tplv-k3u1fbpfcp-watermark.image)

这里部署后的代码会放到`gh-pages`分支，`gh-pages`分支是自动创建的

github仓库 -> `settings` -> `pages` 读取`gh-pages`分支，然后访问https://shinewen189.github.io/nigo-cli/



![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5ddc4e309e9b4a3495314797d04706dd~tplv-k3u1fbpfcp-watermark.image)

>自动部署只是 GitHub Actions 功能一小部分，GitHub Actions 能做的事还很多很多，感兴趣的同学自行查阅。

## 最后
一套完整的前端工程架构方案，需要考虑技术选型、区分环境、代码规范、提交规范、测试、自动部署等等。本项目对于每项技术栈只是提供较为基础的配置，同学们可以按照自己的需求对本项目每个技术栈展开研究或针对性配置，找出自己最适合的工程化方案。

最后再贴上项目地址
> github : https://github.com/shinewen189/nigo-cli

> 静态网址 : https://shinewen189.github.io/nigo-cli/#/
