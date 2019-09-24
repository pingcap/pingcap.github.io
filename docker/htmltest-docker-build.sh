cp -R ../content/tidb-academy .

docker volume create pingcap-website-htmltest

docker build -f ./htmltest.Dockerfile -t pingcap-website/htmltest .

rm -rf tidb-academy
