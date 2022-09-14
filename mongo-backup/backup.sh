#!/bin/bash

echo "Job started: $(date)"
DATE=$(TZ=Asia/Bangkok date +%Y%m%d_%H%M%S)

mkdir -p "/backup/$DATE"
mongodump --uri "mongodb://banlistinfo:6c09093474284f6bfc3749a5bd24cbb6@mongo:29101/bl" --out "/backup/$DATE/"

echo "Mongo dump saved to $FILE"

echo "Job finished: $(date)"
