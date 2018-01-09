#!/bin/bash
set -e

printf "{"

subs=`git config --file .gitmodules --get-regexp path | awk '{ print $2 }'`
for module in $(echo $subs);
do
  cd $module
  git ls-tree -r --name-only HEAD | while read filename; do
  if [[ ${filename: -3} == ".md" ]]; then
  msg=$(git log -1 --format="%h %cn %s %ad" -- $filename) # pick up useful info
  msg=`echo $msg | sed 's/"//g'` # remove extra double quotes
  echo `printf '"%s___%s": "%b",' "$module" "$filename" "$msg"` # design json structure used in template
  fi
  done
  cd $OLDPWD
done

printf '"_": ""}'
