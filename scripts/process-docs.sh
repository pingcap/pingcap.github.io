#!/bin/bash

# created by sivagao in 9/9/2017

set -e

replace_dist_html_link() {
  local doc_tmp_path=$1
  local repo_name=$2
  if [ -d "$doc_tmp_path" ];then
    for html in "$doc_tmp_path"/*
    do
      if [ -d "$html" ];then
        replace_dist_html_link "$html" $repo_name
      elif [[ ! -d "$html" ]] && echo "$html" | grep -E '\.html$' > /dev/null;then
        set +e
        if grep -E 'href=\"\S+\.md' $html > /dev/null;then
          python scripts/convert_html.py $html $repo_name
        elif grep -E 'img src=\"[\.\/]*media\/' $html > /dev/null;then
          python scripts/convert_html.py $html $repo_name
        fi
        set -e
      fi
    done
  fi
}

misc_repos=(blog-cn meetup weekly)

for repo in "${misc_repos[@]}"
do
{
  echo "dist/$repo"
  replace_dist_html_link "dist/$repo" "$repo"
} &
done

# waiting all tasks finish.
wait

end_time=$(date +%H%M%S)
echo "end time" $end_time
replace_dist_html_link "dist/cases-cn" blog-cn
echo "finish all replacement"

parent_dir="`echo $(pwd) | sed 's;/scripts;;g'`/dist"
rm_images_from_media_docs() {
  repo_name=$1
  rm -rf $parent_dir/$repo_name/media
}

# mv blog-cn/cases-cn in media to dist/images

rm_images_from_media_docs blog-cn
rm_images_from_media_docs weekly
rm_images_from_media_docs meetup
