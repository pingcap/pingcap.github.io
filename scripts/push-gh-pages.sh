set -e

ls dist/
cd dist

git config --global user.email "ghlndsl@126.com"
git config --global user.name "gaohailang ci"
remote=$(git config remote.origin.url)
git init
git remote add origin "$remote"
git checkout -b master
git add .
git commit -m "Update Release gh-pages[ci skip]"
ssh-agent bash -c 'ssh-add ~/.ssh/id_rsa_6aa6ace89eee7def1892940bb02c3482;git push -f origin master'
