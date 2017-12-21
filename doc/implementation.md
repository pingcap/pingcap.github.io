这里汇总实施记录和简单 Todo 列表的管理。

### Task

Done:

* process-docs 处理（图片路径等）done
* 生成 nav(recurit/doc.nav 等 ) - TOC(recurit)
* babel/eslint，prettier 修复等
* 修复修改 layouts 不会更新 html
* 把脚本整合入 gulp 中（gen-nav 等 sh
* webpack & gulpfile 整合入 css/js min, hash, reference 等
* tree-nav 优化，url prefix 加入，判断 link 是相对的而不是绝对的
  如<http://开头的>
* 模板优化
* svgs 替换
* i18n
* url 兼容（对于之前套路的 url）alias
* 现在 recruit and blog zh/en markdown 语法中 tag 和 author 不是 list，而是普通
  的 separator 空格
* 引入英文 blog 和 weekly
* 多 submodule 构建的影响
* 新测试环境支持 subModule
* submodules 引入和预处理等 （先引入自己 origin 和分支的，稳定了在 push 回去）
* 增加 Edit this Page 功能
* 修复 docs-cn/docs 的 i18n 连接映射问题
* 隐藏 docs 文章上面的 meta 信息
* blog + weekly 引入官网（weekly 入口放在英文 header 替换 meetup 位置）
* 增加 Edit this Page 功能
* 左边栏等问题处理 ,sidebar 解决方案
* docs 和 docs-cn 中加入文章内部的子目录 （规则是：提取文章内部的所有二级标
  题 ##)
* ags-nav link 问题 以及过滤 count 小于 2 个
* blog-cn 页面 tags link 跳转 404
* search 样式优化和索引配置
* tags filter 应用到其他页面 如 meetup recruit blog 等
* blog、blog-cn 、 meetup、weekly 的 single 页面样式调整
* simpletree 优化
* header 样式调整
* 优化文章内目录 toc 插件
* docs 左右 sidebar 展示方式确定
* 各个 single 页面 archive 模板 抽象 （待精简
* weekly docs docs-cn list 页面 sidebar 默认展开第一项
* docs/docs-cn/blog/blog-cn/weekly/meetup 页面图片丢失
* 修改 docs 左右 sidebar 样式
* rss feed.xml 生成 blog/blog-cn 两套
* fork smart-toc 重新改一版优化（现在这般冗余代码多，待精简
* Search 脚本自己 host
* 第三方脚本加载方式优化，如 docsearch/userty 等
* smarttoc 样式修复：默认位置靠右固定 底部空白需要去掉
* meetup 页面样式调整
* about / meetup 现场 页面加入视频
* 解决 docs 等所有页面 锚链接定位问题 （与 header fixed 有关）使用 js 滚动实现
* sidebar hash url 匹配
* weekly / blog 图片丢失
* 设置 package.json 中 hugo-bin 版本号位指定版本
* 测试环境 hugo-bin lock
* 搜索结果限定语言 English only, Chinese all
* 在 blog 和 weekly 的 default 页面的 template 中加入 js 脚本重定向到官网新地址
  * 路径匹配问题 : 原 blog 和 weekly 中文章 url 使用 /:year/:month/:day/:title
    的方式 而官网目前采用 :repo/year-month-day-title
  * 解决方式 : 使用 {{ page.url | slugify }} 转化 '/' to '-'
* 上线第一天 先注释调 search box (header.html header-cn.html baseof.tpl.html)
* [生产环境] 先决定部署方案，在决定 ci 流程确定（submodule 等，触发等 是否
  submodule 的 非 master 分支也会触发）
* 隐藏 Meetup 入口
* 自动化部署：配置 blog-cn docs-cn meetup 等 repo webhook 触发更新（在各个
  submodule 的 repo 中配置 webhook）
* blog weekly ghpages redirect
* 等网站稳定后（预计一周后）将每个 submodule 的 hugo-refactor 分支合并到 master
  并保留 hugo-refactor 分支作为预览使用，同时修改当前 repo 的 master 分支中
  .gitmodules 文件中各个 submodule 的指定 branch 为 master
* rsync 同步调研：如何更新删除的文件 （增加 --delete 参数在 源和目标目录之前

Pending:

* 类似 hugo docs 的 " 改文档更新于 <2017 年 10 月 25 日 >，commit id<> ，
  author<>" 来 reference
* 分页，load more ajax 加载更多。不用变 url
  https://gohugo.io/templates/pagination/#readout
* gen-nav.js 生成 TOC 容错处理

Todo:

* doc-search config polish: Search 配置项优化 提供 sitemap 并强制使用 sitemap 中
  的内容
* 页面 render 优化：docs 页面 sidebar render 优化（现在首次 render 比较慢

Assign:

* meetup media 处理（把多余的小图删除等，sort by size ）
* meetup markdown 格式整理和图片等
* meetup meetup_type meta 信息默认是现场（review ） 可特殊配置实录（memoir ）

Pending:

* meetup single 页面 分类
* 小图片小图标处理等 ( 放在 assets 目录，引用在 less 或者 html 中？)
* 替换第三方 js
* 替换所有图片引用位置（作为 asset 和 html 放在同一个 CDN？）
* markdown 容错处理 （tag and author ）

Tip:

* 新建文件无法被 watch 和执行 hugo 等

全文搜索配置
<https://github.com/algolia/docsearch-configs/blob/master/configs/pingcap.json>

## 记录

### 引入 weekly/blog

hugo import jekyll blog blog-x

git checkout --orphan newbranch git rm -rf .

从生成的 hugo 中 copy asssets/img 和 content/post 更换路径名称等。 ](media <=
]({{ site.baseurl }}/assets/img

### submodule 先切换分支，非 master

git submodule update --remote

改改现有的 submodule 配置 : [submodule "content/blog-cn"] path = content/blog-cn
url = git@github.com:pingcap/blog-cn.git branch = hugo-refactor

### 引入 submodule

添加新的 git submodule add -b hugo-refactor git@github.com:pingcap/blog.git
content/blog

* 新建文件无法被 watch 和执行 hugo 等

全文搜索配置
<https://github.com/algolia/docsearch-configs/blob/master/configs/pingcap.json>

# 记录

## babel & linter

prettier, prettier-eslint, eslint-config-airbnb-base
<https://www.npmjs.com/package/eslint-config-airbnb-base>
<https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb#eslint-config-airbnb-1>

<https://github.com/standard/standard> ( 待确认和调研 - 不需要配置 )

airbnb-base:10.0.1 and atom linter-eslint don't seem to work together
<https://github.com/airbnb/javascript/issues/1184>

## 构建相关

基于： git submodule
