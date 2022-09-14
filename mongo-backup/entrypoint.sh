#!/bin/bash

export MONGO_URI=${MONGO_URI:-mongodb://mongo:27017}

LOGFIFO='/var/log/cron.fifo'
if [[ ! -e "$LOGFIFO" ]]; then
    mkfifo "$LOGFIFO"
fi

CRON_ENV="MONGO_URI='$MONGO_URI'"

# pass variable to backup.sh
# CRON_ENV="$CRON_ENV\nTARGET_FOLDER='$TARGET_FOLDER'" << กรณีมากกว่า 1 parameter
echo -e "$CRON_ENV\n$CRON_SCHEDULE /backup.sh > $LOGFIFO 2>&1" | crontab -
crontab -l
cron
tail -f "$LOGFIFO"