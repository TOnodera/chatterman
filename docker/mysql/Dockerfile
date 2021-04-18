FROM mysql:5.7

ARG HOST_USER_ID
ARG HOST_GROUP_ID

#タイムゾーン設定
RUN ln -fs /usr/share/zoneinfo/Asia/Tokyo /etc/localtime

RUN usermod -o -u ${HOST_USER_ID} mysql && \ 
    groupmod -o -g ${HOST_GROUP_ID} mysql && \
    chown -R mysql:root /var/run/mysqld/ /var/log/mysql/ /var/lib/mysql

