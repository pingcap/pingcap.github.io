### generate doc htmls

1. Step1: generate doc navs using `python generate_docs_nav.py`
2. Step2: generate doc html using `./generate_doc.sh`
> docs nav support multi-level category directory, you should define docs direcroty structure in `TOC.md` , in which **+** stands for *category name* and **-** stands for *post name*

a simple directory structure of three level as follows:

```markdown
 + category1
    - file1_name
    - file2_name
    + category1_1
      - file2_1_name
      - file2_2_name
      - file2_3_name
      + category1_1_1
        - file1_1_1_name
      - file2_4_name
      - file3_name
+ category2
    - file5_name
- file6_name
```
which would be render in html as follows:
```markdown
 + category1
      + category1_1
         + category1_1_1
           - file1_1_1_name
    　　- file2_1_name
    　　- file2_2_name
    　　- file2_3_name
    　　- file2_4_name
    - file1_name
    - file2_name
    - file3_name
+ category2
    - file5_name
- file6_name
```

### Generate blog htmls

1. Step1: generate blog list and blog nav using `python generate_blog_list_and_nav.py`
2. Step2: generate blog html using `./generate_blog.sh`

> blog nav is generated using all yaml meta info in md, and by default, the latest year and month show in the forward of nav and for each month,
the latest new post show in the forward.

### Generate recruit htmls

1. Step1: generate recruit nav using `python generate_recruit_list_and_nav.py`
2. Step2: generate recruit html using `./generate_recruit.sh`

### Move all htmls in tmp to src directory

1. `./finall.sh`

### Genrete static files(css, font, js and so on) and move all content in src to dist
1. `cd the root directory of project`
2. run `gulp`

### now, every thing is ok, just config the **dist** directory to our root directory in nginx and your can visit your website!
