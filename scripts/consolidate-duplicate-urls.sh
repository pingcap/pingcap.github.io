# mark all duplicate pages with a rel="canonical" link element

old_versions=("v2.1" "dev")

consolidate_duplicate_urls() {
    local doc_temp_path=$1
    local doc_version=$2
    # local doc_temp_detail_path=$1$2

    echo "doc_temp_path" $doc_temp_path
    if [ -d "$doc_temp_path" ];then
        for html in "$doc_temp_path"/*
        do
            if [ -d "$html" ];then
                echo "process sub dir: " $html
                consolidate_duplicate_urls "$html" $doc_version
            elif [[ ! -d "$html" ]] && grep -v 'rel="canonical"' "$html" > /dev/null;then
                set +e
                re="v[1-9]*.[0-9]*|dev"
                echo $html
                file_path_in_stable=$(echo $html | sed -re "s/$re/stable/g")
                echo $file_path_in_stable
                echo "=========="
                if [ -f $file_path_in_stable ]; then
                    prefix="dist"
                    tmp=${file_path_in_stable//$prefix/}
                    sed -i 's!<head>!<head>!n<link rel="canonical" href="https:\/\/pingcap.com$tmp">!g' $file_path_in_stable
                fi
            fi
        done
    fi
    # echo "$2"
}

for v in "${old_versions[@]}"
do
    consolidate_duplicate_urls dist/docs-cn/$v $v
    consolidate_duplicate_urls dist/docs/$v $v
done

