# FROM alpine:3.6
FROM mongo:4.4.1

RUN touch /var/log/cron.log

RUN apt-get update && \
    apt-get install -y cron python3 python3-pip && \
    rm -rf /var/lib/apt/lists/*

ADD backup.sh /backup.sh
# ADD entrypoint.sh /entrypoint.sh
# RUN chmod +x /entrypoint.sh && chmod +x /backup.sh

RUN chmod +x /backup.sh

# copy crontabs for root user
# COPY config/cronjobs /etc/crontabs/root
COPY crontab /etc/crontab

VOLUME /backup

# start crond with log level 8 in foreground, output to stderr
# CMD ["crond", "-f", "-d", "8"]
CMD cron && tail -f /var/log/cron.log