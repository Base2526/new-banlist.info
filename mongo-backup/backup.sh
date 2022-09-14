#!/bin/bash

echo "Job started: $(date)"
DATE=$(TZ=Asia/Bangkok date +%Y%m%d_%H%M%S)

mkdir -p "/backup/$DATE"
mongodump --uri "$MONGO_URI" --out "/backup/$DATE/"

echo "Mongo dump saved to /backup/$DATE"

echo "Job finished: $(date)"
