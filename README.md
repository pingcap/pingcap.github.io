## Intro

> 摘抄于该 < 软件手册 >....

构建网站技术层出不穷，但是开发一套合适完善强大的整套框架和流程需要权衡不少考虑点
，通过一系列的开发迭代和改版重构的实践，该套软件的发布构建构建有如下显著特点：

* 全站静态化
* CI/CD 全流程
* 多模块支持

动态化网站可以实现灵活的实时的业务逻辑，如展示实时变化的数据，但对于常见的变化频
率不频繁的文档资讯等类型的网站，可以实现全部静态化，通过扩展和继承模板实现层级复
用，通过完善的模板语言来表现我们的页面。这样可以加上网站访问速度，无需动态生成页
面，免除数据库压力，尽早实施 CDN 加速等。

全流程的 CI/CD，传统网站编写，修改和发布更新等流程较为繁琐，尤其在我们这样的业务
场景下，文档源丰富多样（如 blog，docs ， weekly 等），同时需要区分中英文版本，若
干文章作者每天都可能发布数次，所以需要一套一体化的 pipeline 工作流程来自动触发，
完成各个环境的工作，避免手动操作，节省时间和减少操作可能出现的错误。

多模块支持，在上面提到的文档资讯源头多样，该软件实现了不同的内容源作为单独的 Git
代码仓库，然后作为 SubModule 的形式加入到网站项目，同时在构建部署 CI/CD 上实现支
持。

## Features

多模块持续交付的 Web 全站静态化发布构建工具，主要提供如下功能点：

* 文档无侵入性
* 全站静态化
* 全流程 CI/CD 持续集成和交付
* CI、CD 多模块 SubModule 支持
* 生产环境下双部署
* 支持 Staging 环境 CI/CD 支持多版本
* JSON/YML 配置驱动的页面渲染
* 智能元数据信息解析
* i18n 多语言支持
* 支持自定义排序的全文搜索
* 完善的响应式布局

### Strcture

![architecture](doc/media/website.png)

## Start

* npm install
* npm start
* git submodule foreach --recursive git pull origin master # 拉取所有以
  submodule 形式存存在

## Usage

./scripts/gen-nav.sh 从 recruit/docs zh/en repo 的 readme 生成 data json 目录，
用于页面渲染 ./scripts/process-docs.sh 用于 copy_images_from_media_to_src 和
replace_dist_html_link，在构建 prod 时候使用（图片路径和 html 中 url 绝对路径
src：前端代码如 css/js，可通过构建工具来编译，如使用 babel 和 css 预处理器等，实
施现代化开发流程 site：存储 hugo 使用的站点内容，主要包括：

* contents 文档和内容目录
* layout 中有布局的 html 通过模板集成和 partial 等功能
* data 用于非 markdown 形式的数据，用在渲染模板

相关脚本入口，看 package.json 中的 scripts 部分

### head>title

在 base 模板有如下定义

```
<title>{{- block "title" . }}
  {{- or .Title "Home" -}}
{{ end -}} | PingCAP</title>
```

* 默认情况 Home | PingCAP
* 如果对应内容 markdown 有设置 .title front meta，会使用 {{ .Title }} PingCAP
* 特殊的页面，可以在 layout 模板页（如不方便在 markdown 或无 _index.md 设置）如
  /blog-cn 等，覆盖 define title block

```
{{ define "title" }}博客{{ end }}
```
