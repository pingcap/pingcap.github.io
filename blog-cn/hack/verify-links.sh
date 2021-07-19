#!/bin/bash
#
# This script is used to verify links in markdown docs.
#

ROOT=$(unset CDPATH && cd $(dirname "${BASH_SOURCE[0]}")/.. && pwd)
cd $ROOT

if ! which markdown-link-check &>/dev/null; then
    sudo npm install -g markdown-link-check@3.7.3
fi

#
# Currently, we only check pingcap.com/github.com/tikv.org links and media
# static files. This is because external websites are beyond our control.
#
# TODO check more links
#
CONFIG_TMP=hack/markdown-link-check.json
ERROR_REPORT=$(mktemp)

trap 'rm -f $ERROR_REPORT' EXIT

while read -r tasks; do
    for task in $tasks; do
        (
            echo markdown-link-check --config "$CONFIG_TMP" "$task" -q
            output=$(markdown-link-check --color --config "$CONFIG_TMP" "$task" -q)
            if [ $? -ne 0 ]; then
                printf "$output" >> $ERROR_REPORT
            fi
            echo "$output"
        ) &
    done
    wait
done <<<"$(find . -mindepth 1 -maxdepth 1 -type f -name '*.md' -print0 | xargs -0 -n 30)"

error_files=$(cat $ERROR_REPORT | grep 'FILE: ' | wc -l)
error_output=$(cat $ERROR_REPORT)

echo ""
if [ "$error_files" -gt 0 ]; then
    echo "error: $error_files files have invalid links, please fix them!"
    echo ""
    echo "=== ERROR REPORT == ":
    echo "$error_output"
    exit 1
else
    echo "info: all files are ok!"
fi
