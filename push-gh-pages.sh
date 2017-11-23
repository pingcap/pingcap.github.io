set -e

ls dist/
cd dist

git config --global user.email "ghlndsl@126.com"
git config --global user.name "gaohailang ci"
remote=$(git config remote.origin.url)
git init
git remote add origin "$remote"
git checkout -b gh-pages
git add .
git commit -m "Update Release gh-pages"
git push -f origin gh-pages
