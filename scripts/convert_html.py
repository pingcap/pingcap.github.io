# convert html links of a tags and src of img tags

from bs4 import BeautifulSoup

import os
import re
import sys

reload(sys)
sys.setdefaultencoding('utf-8')

abs_hyper_link_pattern = re.compile(r'https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}')
image_rel_src_pattern = re.compile(r'^[\.\/]*media\/')

with open(sys.argv[1], 'r') as f:
    soup = BeautifulSoup(f.read(), 'lxml')

for link in soup.find_all('a'):
    href = link['href']
    if href:
        if (not abs_hyper_link_pattern.match(href)) and href.rfind('.md') > 0:
            href = href.replace('.md', '')
            href = re.sub(r'^[\.\/]*', '/', href, count=0, flags=0)
            href = os.path.normpath('/' +  sys.argv[2] + href)
        # print ('href',href)
        link['href'] = href

for img in soup.find_all('img'):
    src = img['src']
    if src:
        if (not abs_hyper_link_pattern.match(src)) and image_rel_src_pattern.match(src):
            # print ('before re.sub', src)
            _src = re.sub(r'[\.\/]*media\/', '/', src, count=0, flags=0)
            # print ('after re.sub', src)
            _src = os.path.normpath('/images/' + sys.argv[2] + _src)
            img['data-original']= _src
            img['src'] = '/images/svgs/loader-spinner.svg'
            img['class'] = 'lazy'
        elif abs_hyper_link_pattern.match(src):
            img['data-original']= src
            img['src'] = '/images/svgs/loader-spinner.svg'
            img['class'] = 'lazy'

# print (unicode(soup))
# write html
with open(sys.argv[1], 'w') as f:
    f.write(unicode(soup))
