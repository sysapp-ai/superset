#!/bin/bash

if [[ $# -eq 0 ]] ; then
    echo 'Please specify plugin name'
    exit 1
fi

echo '================================================================'
echo 'Plugin given by user is ' $1
echo '================================================================'

CUSTOM_PLUGIN_DIR=~/codebase/gitWorkFolder/superset/superset-frontend/plugins/$1

cd $CUSTOM_PLUGIN_DIR

echo '==============================================================='
echo 'Start installing custom plugin dependencies of' $1
echo '==============================================================='

sudo npm i --force

echo '=============================================================='
echo $1 '- custom plugin installation is successful.'
echo '============================================================='

echo '=============================================================='
echo $1 '- custom plugin is getting build.'
echo '============================================================='

sudo npm run build

echo '=============================================================='
echo $1 '- custom plugin build successfully.'
echo '============================================================='

cd ../..

sudo npm install -S ~/codebase/gitWorkFolder/superset/superset-frontend/plugins/$1 --legacy-peer-deps

echo '=============================================================='
echo $1 '- custom plugin symbolic link is created successfully.'
echo '============================================================='

