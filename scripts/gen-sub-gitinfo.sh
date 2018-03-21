#!/bin/bash
set -e

curdir=$(cd "$(dirname $0)"; pwd -P)
target_file="${curdir}/data/sub_git_info.json"

printf "[\n" > $target_file

subs=`git config --file .gitmodules --get-regexp path | awk '{ print $2 }'`
for module in $(echo $subs);
do
  cd $module
  git ls-tree -r --name-only HEAD | while read filename; do
  if [[ ${filename: -3} == ".md" ]]; then
  msg=$(git log -1 --format="%h___%cn___%s___%ad___%H" -- $filename) # pick up useful info
  msg=`echo $msg | sed 's/"//g'` # remove extra double quotes
  # echo `printf '"%s___%s": "%b",' "$module" "$filename" "$msg"` >> $target_file # design json structure used in template
  printf "{\n" >> $target_file
  echo `printf '"name": "%s___%s",' "$module" "$filename"` >> $target_file # design json structure used in templat
  echo `printf '"info": "%b"' "$msg"` >> $target_file # design json structure used in template
  printf "},\n" >> $target_file
  fi
  done
  cd $OLDPWD
done

printf '{}\n]' >> $target_file
