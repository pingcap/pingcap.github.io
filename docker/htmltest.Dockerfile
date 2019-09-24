# docker volume create pingcap-website-htmltest
# docker build -f ./htmltest.Dockerfile -t pingcap-website/htmltest .
# docker run -d --name pingcap-website-htmltest-1 \
#   --mount source=pingcap-website-htmltest,target=/htmltest \
#   pingcap-website/htmltest
FROM node:8.11.3

RUN git clone --single-branch --branch yy/deadlink https://github.com/pingcap/pingcap.github.io.git pingcap-website

WORKDIR /pingcap-website

RUN mkdir /root/.ssh && echo "StrictHostKeyChecking no" > /root/.ssh/config

RUN apt-get update && apt-get install -y Python-bs4

RUN npm i

RUN curl https://htmltest.wjdp.uk | bash

CMD npm run build \
  && mkdir -p /htmltest/.htmltest \
  && mv /htmltest/.htmltest .htmltest \
  && ./bin/htmltest \
  && grep "Non-OK status: 404" .htmltest/htmltest.log | sort -u > htmltest-$(date +%Y-%m-%d).profile \
  && mv htmltest-$(date +%Y-%m-%d).profile .htmltest \
  && mv .htmltest /htmltest
