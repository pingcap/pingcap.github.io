# Start

- npm install
- npm start
- git submodule foreach --recursive git pull origin master # 拉取所有以submodule形式存存在

## Usage

./gen-nav.sh 从 recruit/docs zh/en repo 的 readme 生成 data json 目录，用于页面渲染 ./process-docs.sh 用于 copy_images_from_media_to_src 和 replace_dist_html_link，在构建prod时候使用（图片路径和html中url绝对路径 src：前端代码如css/js，可通过构建工具来编译，如使用babel和css预处理器等，实施现代化开发流程 site：存储 hugo 使用的站点内容，主要包括：

- contents文档和内容目录
- layout中有布局的html通过模板集成和partial等功能
- data 用于非markdown形式的数据，用在渲染模板

相关脚本入口，看 package.json 中的 scripts 部分

### head>title

在 base 模板有如下定义

```
<title>{{- block "title" . }}
  {{- or .Title "Home" -}}
{{ end -}} | PingCAP</title>
```

- 默认情况 Home | PingCAP
- 如果对应内容markdown有设置.title front meta，会使用 {{ .Title }} PingCAP
- 特殊的页面，可以在layout模板页（如不方便在markdown或无 _index.md 设置）如 /blog-cn 等，覆盖define title block

```
{{ define "title" }}博客{{ end }}
```

### Task

Done:

- process-docs处理（图片路径等）done
- 生成 nav(recurit/doc.nav等) - TOC(recurit)
- babel/eslint，prettier 修复等
- 修复修改layouts不会更新html
- 把脚本整合入gulp中（gen-nav等sh
- webpack & gulpfile 整合入 css/js min, hash, reference 等
- tree-nav 优化，url prefix加入，判断link是相对的而不是绝对的如<http://开头的>
- 模板优化
- svgs 替换
- i18n
- url 兼容（对于之前套路的url）alias
- 现在 recruit and blog zh/en markdown 语法中 tag 和 author不是 list，而是普通的 separator 空格
- 引入英文 blog 和 weekly
- 多 submodule 构建的影响
- 新测试环境支持 subModule
- submodules 引入和预处理等 （先引入自己origin和分支的，稳定了在push回去）
- 增加 Edit this Page 功能
- 修复 docs-cn/docs 的i18n 连接映射问题
- 隐藏 docs 文章上面的 meta 信息
- blog + weekly 引入官网（weekly 入口放在英文 header 替换 meetup 位置）
- 增加 Edit this Page 功能
- 左边栏等问题处理,sidebar 解决方案
- docs 和 docs-cn 中加入文章内部的子目录 （规则是：提取文章内部的所有二级标题 ##)
- ags-nav link 问题 以及过滤 count 小于2个
- blog-cn 页面 tags link 跳转 404
- search 样式优化和索引配置
- tags filter 应用到其他页面 如 meetup recruit blog 等
- blog、blog-cn、meetup、weekly 的 single 页面样式调整
- simpletree 优化
- header 样式调整
- 优化文章内目录 toc 插件
- docs 左右 sidebar 展示方式确定
- 各个 single 页面 archive 模板 抽象 （待精简
- weekly docs docs-cn list 页面 sidebar 默认展开第一项
- docs/docs-cn/blog/blog-cn/weekly/meetup 页面图片丢失
- 修改 docs 左右 sidebar 样式
- rss feed.xml 生成blog/blog-cn 两套
- fork smart-toc 重新改一版优化（现在这般冗余代码多，待精简
- Search 脚本自己 host
- 第三方脚本加载方式优化，如 docsearch/userty 等
- smarttoc 样式修复：默认位置靠右固定 底部空白需要去掉
- meetup 页面样式调整
- about / meetup现场 页面加入视频
- 解决 docs 等所有页面 锚链接定位问题 （与 header fixed 有关）使用 js 滚动实现
- sidebar hash url 匹配
- weekly / blog 图片丢失
- 设置 package.json 中 hugo-bin 版本号位指定版本
- 测试环境 hugo-bin lock
- 搜索结果限定语言 English only, Chinese all
- 在 blog 和 weekly 的 default 页面的 template 中加入 js 脚本重定向到官网新地址
  - 路径匹配问题: 原 blog 和 weekly 中文章 url 使用 /:year/:month/:day/:title 的方式 而官网目前采用 :repo/year-month-day-title
  - 解决方式: 使用 {{ page.url | slugify }} 转化 '/' to '-'
- 上线第一天 先注释调 search box (header.html header-cn.html baseof.tpl.html)
- [生产环境] 先决定部署方案，在决定 ci 流程确定（submodule 等，触发等 是否 submodule 的 非 master 分支也会触发）
- 隐藏 Meetup 入口


Pending:

- 类似 hugo docs 的"改文档更新于<2017年10月25日>，commit id<>，author<>" 来 reference
- 分页，load more ajax 加载更多。不用变 url https://gohugo.io/templates/pagination/#readout
- gen-nav.js 生成 TOC 容错处理



Todo:

- 自动化部署：配置 blog-cn docs-cn meetup 等 repo webhook 触发更新（在各个 submodule 的 repo 中配置 webhook）
- blog weekly ghpages redirect




Assign:

- meetup media 处理（把多余的小图删除等，sort by size）
- meetup markdown 格式整理和图片等
- meetup meetup_type meta 信息默认是现场（review） 可特殊配置实录（memoir）



Pending:

- meetup single 页面 分类
- 小图片小图标处理等 (放在assets目录，引用在less或者html中？)
- 替换第三方 js
- 替换所有图片引用位置（作为 asset 和 html 房子同一个 CDN？）
- markdown 容错处理 （tag and author）

Tip:

- 新建文件无法被watch和执行hugo等

全文搜索配置 <https://github.com/algolia/docsearch-configs/blob/master/configs/pingcap.json>

## 记录

### 引入 weekly/blog

hugo import jekyll blog blog-x

git checkout --orphan newbranch git rm -rf .

从生成的hugo中copy asssets/img 和 content/post 更换路径名称等。 ](media <= ]({{ site.baseurl }}/assets/img

### submodule 先切换分支，非master

git submodule update --remote

改改现有的 submodule 配置: [submodule "content/blog-cn"] path = content/blog-cn url = git@github.com:pingcap/blog-cn.git branch = hugo-refactor

### 引入 submodule

添加新的 git submodule add -b hugo-refactor git@github.com:pingcap/blog.git content/blog

- 新建文件无法被watch和执行hugo等

全文搜索配置 <https://github.com/algolia/docsearch-configs/blob/master/configs/pingcap.json>

# 记录

## babel & linter

prettier, prettier-eslint, eslint-config-airbnb-base <https://www.npmjs.com/package/eslint-config-airbnb-base> <https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb#eslint-config-airbnb-1>

<https://github.com/standard/standard> (待确认和调研 - 不需要配置)

airbnb-base:10.0.1 and atom linter-eslint don't seem to work together <https://github.com/airbnb/javascript/issues/1184>

## 构建相关

基于： git submodule

Todo: README模板 ![Logo of the project](./images/logo.sample.png)

# Template - Name of the project

> Additional information or tag line

A brief description of your project, what it is used for.

## Installing / Getting started

A quick introduction of the minimal setup you need to get a hello world up & running.

```shell
commands here
```

Here you should say what actually happens when you execute the code above.

## Developing

### Built With

List main libraries, frameworks used including versions (React, Angular etc...)

### Prerequisites

What is needed to set up the dev environment. For instance, global dependencies or any other tools. include download links.

### Setting up Dev

Here's a brief intro about what a developer must do in order to start developing the project further:

```shell
git clone https://github.com/your/your-project.git
cd your-project/
packagemanager install
```

And state what happens step-by-step. If there is any virtual environment, local server or database feeder needed, explain here.

### Building

If your project needs some additional steps for the developer to build the project after some code changes, state them here. for example:

```shell
./configure
make
make install
```

Here again you should state what actually happens when the code above gets executed.

### Deploying / Publishing

give instructions on how to build and release a new version In case there's some step you have to take that publishes this project to a server, this is the right time to state it.

```shell
packagemanager deploy your-project -s server.com -u username -p password
```

And again you'd need to tell what the previous code actually does.

## Versioning

We can maybe use [SemVer](http://semver.org/) for versioning. For the versions available, see the [link to tags on this repository](/tags).

## Configuration

Here you should write what are all of the configurations a user can enter when using the project.

## Tests

Describe and show how to run the tests with code examples. Explain what these tests test and why.

```shell
Give an example
```

## Style guide

Explain your code style and show how to check it.

## Api Reference

If the api is external, link to api documentation. If not describe your api including authentication methods as well as explaining all the endpoints with their required parameters.

## Database

Explaining what database (and version) has been used. Provide download links. Documents your database design and schemas, relations etc...

## Licensing

State what the license is and how to find the text version of the license.
