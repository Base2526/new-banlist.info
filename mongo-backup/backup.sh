#!/bin/bash

echo "Job started: $(date)"
DATE=$(TZ=Asia/Bangkok date +%Y%m%d_%H%M%S)

FILE="/backup/backup-$DATE.tar.gz"

mkdir -p "/backup"
mongodump --uri "$MONGO_URI" --gzip --archive="$FILE"

echo "Mongo dump saved to $FILE"

find /backup -mindepth 1  -name "*.tar.gz" -mtime +10 -delete

echo "Job finished: $(date)"
