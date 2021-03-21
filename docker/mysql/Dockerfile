FROM mysql:5.7
RUN usermod -o -u 1000 mysql && \ 
    groupmod -o -g 1000 mysql && \
    chown -R mysql:root /var/run/mysqld/ /var/log/mysql/ /var/lib/mysql