gulp build 2>&1 | tee gulp-build.log;

if cat gulp-build.log|grep -i '^error'; then
  echo 'Found Error in build.log. Exit';
  exit -1;
else
   bash ./scripts/process-docs.sh;
fi;
