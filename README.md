

## Start

- npm install
- npm start
- git submodule foreach --recursive git pull origin master # 拉取所有以submodule形式存存在

### Usage

#### head>title

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



./gen-nav.sh 从 recruit/docs zh/en repo 的 readme 生成 data json 目录，用于页面渲染
./process-docs.sh 用于 copy_images_from_media_to_src 和 replace_dist_html_link，在构建prod时候使用（图片路径和html中url绝对路径


qshell qupload qiniu.config
https://portal.qiniu.com/bucket/website-test/index


src：前端代码如css/js，可通过构建工具来编译，如使用babel和css预处理器等，实施现代化开发流程
site：存储 hugo 使用的站点内容，主要包括：

- contents文档和内容目录
- layout中有布局的html通过模板集成和partial等功能
- data 用于非markdown形式的数据，用在渲染模板


url，content和layout对应关系：

Done:
- process-docs处理（图片路径等）done
- 生成 nav(recurit/doc.nav等) - TOC(recurit)
- babel/eslint，prettier 修复等
- 修复修改layouts不会更新html
- 把脚本整合入gulp中（gen-nav等sh
- webpack & gulpfile 整合入 css/js min, hash, reference 等
- tree-nav 优化，url prefix加入，判断link是相对的而不是绝对的如http://开头的

- svgs 替换
- i18n


Todo:
- ci 流程确定（submodule 等，触发等）
- submodules 引入和预处理等 （先引入自己origin和分支的，稳定了在push回去）
- 部署时错误处理方式
- 引入英文 blog
- 多 submodule 构建的影响
- 新测试环境
- docs/docs-cn i18n
- docs 和 docs-cn 中加入文章内部的子目录 （规则是：提取文章内部的所有二级标题 ##) - md 解析部分


- 模板优化
- url 兼容（对于之前套路的url）alias
- tags-nav link 问题 以及过滤 count 小于2个
- 现在 recruit and blog zh/en markdown 语法中 tag 和 author不是 list，而是普通的 separator 空格
- js/css 重构
- about 页面加入视频
- search 样式优化和索引配置
- 替换第三方 js
- blog + weekly 引入官网（weekly 入口放在英文 header 替换 meetup 位置）
- docs 和 docs-cn 中加入文章内部的子目录 （规则是：提取文章内部的所有二级标题 ##) 样式部分 滚动跳转
- 增加 Edit this Page 功能

Assign:
- meetup media 处理（把多余的小图删除等，sort by size）
- meetup markdown 格式整理和图片等
- meetup meetup_type meta 信息默认是现场（review） 可特殊配置实录（memoir）


Pending:
- 小图片小图标处理等 (放在assets目录，引用在less或者html中？)


Tip:
- 新建文件无法被watch和执行hugo等


全文搜索配置
https://github.com/algolia/docsearch-configs/blob/master/configs/pingcap.json

## 记录



### babel & linter
prettier, prettier-eslint, eslint-config-airbnb-base
https://www.npmjs.com/package/eslint-config-airbnb-base
https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb#eslint-config-airbnb-1

https://github.com/standard/standard (待确认和调研 - 不需要配置)


airbnb-base:10.0.1 and atom linter-eslint don't seem to work together
https://github.com/airbnb/javascript/issues/1184

### 构建相关

基于：
git submodule



Todo: README模板
![Logo of the project](./images/logo.sample.png)

# Name of the project
> Additional information or tag line

A brief description of your project, what it is used for.

## Installing / Getting started

A quick introduction of the minimal setup you need to get a hello world up &
running.

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

Here's a brief intro about what a developer must do in order to start developing
the project further:

```shell
git clone https://github.com/your/your-project.git
cd your-project/
packagemanager install
```

And state what happens step-by-step. If there is any virtual environment, local server or database feeder needed, explain here.

### Building

If your project needs some additional steps for the developer to build the
project after some code changes, state them here. for example:

```shell
./configure
make
make install
```

Here again you should state what actually happens when the code above gets
executed.

### Deploying / Publishing
give instructions on how to build and release a new version
In case there's some step you have to take that publishes this project to a
server, this is the right time to state it.

```shell
packagemanager deploy your-project -s server.com -u username -p password
```

And again you'd need to tell what the previous code actually does.

## Versioning

We can maybe use [SemVer](http://semver.org/) for versioning. For the versions available, see the [link to tags on this repository](/tags).


## Configuration

Here you should write what are all of the configurations a user can enter when
using the project.

## Tests

Describe and show how to run the tests with code examples.
Explain what these tests test and why.

```shell
Give an example
```

## Style guide

Explain your code style and show how to check it.

## Api Reference

If the api is external, link to api documentation. If not describe your api including authentication methods as well as explaining all the endpoints with their required parameters.


## Database

Explaining what database (and version) has been used. Provide download links.
Documents your database design and schemas, relations etc...

## Licensing

State what the license is and how to find the text version of the license.
