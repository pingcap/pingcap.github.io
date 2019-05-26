#!/usr/bin/env python3
# -*- coding: utf-8 -*-


import requests
from bs4 import BeautifulSoup, Tag
import os

# pip3 install --upgrade beautifulsoup4
# pip3 install --upgrade html5lib
# pip3 install --upgrade pypandoc

import pypandoc
import hashlib

url = "https://mp.weixin.qq.com/s/Qumuq_sgXyxyHjX0nRSh0Q"

sess = requests.Session()

sess.headers['User-Agent'] = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36'
sess.headers['Accept'] = "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8"

import random
def gen_tags():
    tags = ['tidb', 'tikv', 'sql', 'spark', '分布式', '大数据', '平台建设']
    return random.choice(tags)

def fetch_page(url):
    resp = requests.get(url)
    html = resp.text

    # print(html)

    soup = BeautifulSoup(html, "html5lib")

    title = soup.title.string

    date = soup.find('em', id='post-date').string

    author = soup.find('em', id='post-date').next_sibling.next_sibling.string

    content = soup.find('div', id='js_content', class_="rich_media_content").prettify()

    for img in soup.find_all('img'):
        if img.attrs.get('data-src', None):
            img_url = img.attrs['data-src']
            tp = img.attrs.get('data-type', 'jpg')

            img_path = "../media/meetup-{}.{}".format(hashlib.md5(img_url.encode()).hexdigest(), tp)

            # change img
            img.name = "p"      # yes img
            img.attrs = {}
            img.string = '![]({})'.format(img_path.replace('../', './'))

            if os.path.exists(img_path):
                continue
            with open(img_path, 'wb') as fp:
                resp = sess.get(img_url)
                print(img_path, img_url)
                fp.write(resp.content)

    for tag in soup(['script', 'style', 'link']):
        tag.extract()

    for tag in soup(['span']):
        tag.name = 'p'

    for tag in soup():
        for attribute in ["class", "id", "name", "style", "dir"]:
            del tag[attribute]

    print(title, date, author, url, sep='\t')

    fpath = "../html/meetup-{}-{}.html".format(date, title.replace('/', '-'))

    with open(fpath, 'w') as fp:
        fp.write(soup.prettify())

    filters = ['pandoc-citeproc']
    pdoc_args = ['--atx-headers','--to=markdown_github']

    output = pypandoc.convert_file(fpath, 'md', format='html', extra_args=pdoc_args)

    import re
    # hack and cleanup output
    # !\[\](./me -> ![](./me
    output = output.replace('!\[\](./me', '![](./me')
    output = re.sub(r'作为一个前沿领域的技术公司.*', '', output, flags=re.DOTALL)
    output = re.sub(r'分布.*据库.*www.pingcap.com.*/media.*', '', output, flags=re.DOTALL)
    output = re.sub(r'作为一个基础架构领域的前沿技.*', '', output, flags=re.DOTALL)
    output = re.sub(r'自 2016 年 3 月 5 日开始.*', '', output, flags=re.DOTALL)

    md_path = "../meetup-{}.md".format(date)
    while os.path.exists(md_path):
        date += '_'
        md_path = "../meetup-{}.md".format(date)

    import json

    with open(md_path, 'w') as fp:
        fp.write('---\n')
        fp.write('title: {}\n'.format(title))
        fp.write('date: {}\n'.format(date))
        fp.write('tags: ["{}"]\n'.format(gen_tags()))
        fp.write('author: {}\n'.format(author.split('&')))
        fp.write('type: meetup\n')

        fp.write('---\n\n')

        fp.write(output)

    return soup

archives_old = """
http://mp.weixin.qq.com/s?__biz=MzI3NDIxNTQyOQ==&mid=2247483939&idx=1&sn=656cc72228b942a0887a3cbb495e7869#rd
http://mp.weixin.qq.com/s?__biz=MzI3NDIxNTQyOQ==&mid=2247483745&idx=1&sn=b3e921a2b77bf614f6275afd27a4e5d0#rd
http://mp.weixin.qq.com/s?__biz=MzI3NDIxNTQyOQ==&mid=2247483966&idx=1&sn=9873f1db165a2c761f326059b0d4e030#rd
https://mp.weixin.qq.com/s/Pqmgu_10BUbtcScBhFQQHg
http://mp.weixin.qq.com/s?__biz=MzI3NDIxNTQyOQ==&mid=2247484125&idx=2&sn=fe6181afc8a8f1330a24c942b7daefe8&chksm=eb1625b7dc61aca17343eeb5cfaa7907ef4176ea6e15bb1b1330a89c47f2b8adfcd6d9234d09#rd
https://mp.weixin.qq.com/s/m3g6MGdOZHn_b_EbA9vUWg
https://mp.weixin.qq.com/s/OXjEZ7Va1h0SCShfdR4c2Q
https://mp.weixin.qq.com/s/Qumuq_sgXyxyHjX0nRSh0Q
https://mp.weixin.qq.com/s/F0DN1aFWONAt18OgbNeiIw
https://mp.weixin.qq.com/s/2_1_8OqoypN2zrX72nOk9w
https://mp.weixin.qq.com/s/fvK49ujL17Xhgb0xaCPYeA
https://mp.weixin.qq.com/s/f0tPe5JQj5jeI9ENjZtY5w
https://mp.weixin.qq.com/s/QgJWiroZS2KBjCmLBmNH2w
https://mp.weixin.qq.com/s/oIyOIe4mxH1ZbbiqxOvFhg

https://mp.weixin.qq.com/s/7yxk0etvjLqhIYda-q3hZA

https://mp.weixin.qq.com/s/w27g16E3721VngDI245bRA

https://mp.weixin.qq.com/s/1qQ3gtg-_DJ9ctWkthcvHA
https://mp.weixin.qq.com/s/3jjl1jpIfD7Pbb-rfAHUcg

https://mp.weixin.qq.com/s/iou4K92O_orI5bHHL20_Tw

https://mp.weixin.qq.com/s/LddEhhxmxOKeJmD3YVQg-A

https://mp.weixin.qq.com/s/QgNGnKPu08XetKEQhRyEog

https://mp.weixin.qq.com/s/F2lEyIemmUy4q1uQ3VB7Xg

https://mp.weixin.qq.com/s/_QpWkSKGsYGbEcEUJsEBSw

https://mp.weixin.qq.com/s/kB6I-Kj_I_iwa3lCh432hw

https://mp.weixin.qq.com/s/NcCNKr10nQrTB8YI7z0aAQ

https://mp.weixin.qq.com/s/UNfO2Q9sJ0u3vz4tzpWXxA

https://mp.weixin.qq.com/s/eQmMovLVu5yUlrd0gmHtGw

https://mp.weixin.qq.com/s/kKlaFGcgIDMD6WWRlsPvaw

https://mp.weixin.qq.com/s/n6nPRhL2Xm2MwCJ8iWLxjQ

https://mp.weixin.qq.com/s/274rpMxSNceF70YfemADMA

https://mp.weixin.qq.com/s/RoUrUSVMwgRv5vVdspfX_g

https://mp.weixin.qq.com/s/WmN8XfGxu0lAnMakE4Md-Q

https://mp.weixin.qq.com/s/HYXJAUTHcDwWjyIkkaqyVw

https://mp.weixin.qq.com/s/3xEeLtokqft6SbNq2-y7_g

https://mp.weixin.qq.com/s/V-OeAb-GzcRgcGLWhHBKRQ

https://mp.weixin.qq.com/s/CU04GsVh2whaGCaECIBi2g

https://mp.weixin.qq.com/s/HEVEmKcJXd8-0Vma-PQnAQ

https://mp.weixin.qq.com/s/D5yjkRWUSYQlKlYb9HuLAA
https://mp.weixin.qq.com/s/6fRu_BHjA0S74zm7YkJeWQ
https://mp.weixin.qq.com/s/JE8a47oOOl7A2LGHlVR__A

https://mp.weixin.qq.com/s/Lv4gOLU_7SLyt067cRLAjw

https://mp.weixin.qq.com/s/Lw-ncLI7_jJ03KPk2Vgvlg
https://mp.weixin.qq.com/s/HTUcaRNylMyHbHYWGeOVJw

https://mp.weixin.qq.com/s/EjgXECcMUE3CqSCLHxtvCw
https://mp.weixin.qq.com/s/D8VoiU5CGZqVK7ghXywgtg

https://mp.weixin.qq.com/s/Jt4-PEzh6erNHZ0B7viCiw
https://mp.weixin.qq.com/s/tyjGUe8WnaChmJIcIRJJIQ
https://mp.weixin.qq.com/s/62W5RLkZ5Q3kwzdxDjkwWg
https://mp.weixin.qq.com/s/nXITpS77qNuchPR53JoRGw
https://mp.weixin.qq.com/s/1Q9YWNXaHoOyVCO6Q7ahnw
https://mp.weixin.qq.com/s/wCyBY57esLl6qPPC9YXP8A
https://mp.weixin.qq.com/s/cw-7rolgZ_hEdnHS6C9-nw
https://mp.weixin.qq.com/s/tIo8wXl0QgW9QV9IGVHbkg
"""

urls = """
https://mp.weixin.qq.com/s/i1s0O-yI_UB3rLDhyAyOAQ
https://mp.weixin.qq.com/s?__biz=MzI3NDIxNTQyOQ==&mid=2247485305&idx=1&sn=3e351cbbaf6e6e1e9e75526cdd9f18ca&chksm=eb162013dc61a9053bdc3af6b17203fa1f5c497fd381e226916902395039b89e0b21932d85e2#rd
"""

if __name__ == "__main__":

    for url in filter(None, urls.split()):
        fetch_page(url)
