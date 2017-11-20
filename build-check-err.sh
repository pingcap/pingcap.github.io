gulp build > gulp-build.log; 2>&1;
if cat gulp-build.log|grep 'Error'; then
  echo 'Encouter Error';
  exit -1;
else
   bash ./process-docs.sh;
fi;
