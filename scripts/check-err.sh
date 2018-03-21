if cat gulp-build.log|grep 'Error'; then
  echo 'Encouter Error';
  exit -1;
else
   bash ./scripts/process-docs.sh;
fi;
