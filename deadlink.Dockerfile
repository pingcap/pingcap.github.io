# docker build -f ./deadlink.Dockerfile -t pingcap-website/deadlink .
FROM node:8.11.3

WORKDIR /pingcap-website

COPY . /pingcap-website

RUN apt-get update && apt-get install -y Python-bs4

RUN npm i

RUN npm run build

RUN curl https://htmltest.wjdp.uk | bash

CMD ./bin/htmltest \
  && grep "Non-OK status: 404" ~/.htmltest/htmltest.log | sort -u > deadlink-$(date +%Y-%m-%d).profile \
  && mv deadlink-$(date +%Y-%m-%d).profile ~/.htmltest
