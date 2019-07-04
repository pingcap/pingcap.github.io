gulp build > gulp-build.log; 2>&1;
if cat gulp-build.log|grep -i '^error'; then
  echo 'Found Error in build.log. Exit';
  exit -1;
else
  echo "no error"
   bash ./scripts/process-docs.sh;
fi;
