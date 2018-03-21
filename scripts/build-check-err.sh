gulp build > gulp-build.log; 2>&1;
if cat gulp-build.log|grep -i 'error'; then
  echo 'Encouter Error';
  exit -1;
else
   bash ./scripts/process-docs.sh;
fi;
