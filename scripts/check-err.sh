echo "check-err"
if cat gulp-build.log|grep 'Error'; then
  echo 'Encouter Error';
  exit -1;
else
  echo "in check-error else"
   bash ./scripts/process-docs.sh;
fi;
