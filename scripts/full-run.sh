#!/bin/bash

npm run fetch

# set up Cron job to run fetch script every 24 hours
crontab -l > fetchcron
directory=`pwd`
node=`which node`
touch $HOME/oi-tracker.log
echo "0 0 * * * $node $directory/fetch dvax > $HOME/oi-tracker.log 2>&1" >> fetchcron
crontab fetchcron
rm fetchcron

npm start
