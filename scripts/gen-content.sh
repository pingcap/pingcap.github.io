tidb_stable_version="v4.0"
operator_stable_version="v1.1"
dm_stable_version="v1.0"
tidb_in_kubernetes=(stable v1.0 dev)
tidb_data_migration=(stable dev)
ecoSys_docs_type=(tidb-in-kubernetes tidb-data-migration)

cn_tmp_docs_path="content/docs-cn"
stable_version_tag="stable"
index_file="_index.md"

mv $cn_tmp_docs_path/$tidb_stable_version $cn_tmp_docs_path/$stable_version_tag

cp $cn_tmp_docs_path/$stable_version_tag/$index_file $cn_tmp_docs_path/

mv $cn_tmp_docs_path/tidb-in-kubernetes/v1.1 $cn_tmp_docs_path/tidb-in-kubernetes/stable
mv $cn_tmp_docs_path/tidb-data-migration/v1.0 $cn_tmp_docs_path/tidb-data-migration/stable

for docs_type in "${ecoSys_docs_type[@]}"
do
    type_vers="${docs_type//-/_}"
    versions=${type_vers}[@]
    for v in "${!versions}"
    do
        # make directory for docs_cn and move files from docs_en to docs_cn
        rm -rf $cn_tmp_docs_path/$docs_type/$v/en/
        mv $cn_tmp_docs_path/$docs_type/$v/zh/* $cn_tmp_docs_path/$docs_type/$v/

        # move files from subdirecotry to parent directory
        find $cn_tmp_docs_path/$docs_type/$v -name '*.md' -mindepth 2 -type f -exec mv {} $cn_tmp_docs_path/$docs_type/$v \;
        des_toc_file_cn=$(echo data/docs-cn-$docs_type-"${v//./}"-toc.json)
        prefix_cn=$(echo /docs-cn/$docs_type/$v/)
        node scripts/gen-nav.js $(echo $cn_tmp_docs_path/$docs_type/$v/TOC.md) $(echo ${des_toc_file_cn//-/_}) $(echo $prefix_cn) 'basename'
    done
done


cp $cn_tmp_docs_path/tidb-in-kubernetes/$stable_version_tag/$index_file $cn_tmp_docs_path/tidb-in-kubernetes/

cp $cn_tmp_docs_path/tidb-data-migration/$stable_version_tag/$index_file $cn_tmp_docs_path/tidb-data-migration/

node scripts/gen-nav.js 'content/docs-cn/stable/TOC.md' 'data/docs_cn_tidb_stable_toc.json' '/docs-cn/stable' 'fullpath'
node scripts/gen-nav.js 'content/docs-cn/dev/TOC.md' 'data/docs_cn_tidb_dev_toc.json' '/docs-cn/dev' 'fullpath'
node scripts/gen-nav.js 'content/docs-cn/v2.1/TOC.md' 'data/docs_cn_tidb_v21_toc.json' '/docs-cn/v2.1' 'fullpath'
node scripts/gen-nav.js 'content/docs-cn/v3.1/TOC.md' 'data/docs_cn_tidb_v31_toc.json' '/docs-cn/v3.1' 'fullpath'
node scripts/gen-nav.js 'content/docs-cn/v3.0/TOC.md' 'data/docs_cn_tidb_v30_toc.json' '/docs-cn/v3.0' 'fullpath'
node scripts/gen-nav.js 'content/about-cn/recruit/TOC.md' 'data/recruit_cn_toc.json' '/about-cn/recruit/' 'fullpath'
node scripts/gen-nav.js 'content/blog-cn/TOC-User-Case.md' 'data/cases_cn_toc.json' '/cases-cn/' 'fullpath'
node scripts/gen-nav.js 'content/tidb-academy/README.md' 'data/tidb_academy_toc.json' '/tidb-academy/' 'fullpath'
