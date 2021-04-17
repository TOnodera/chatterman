FROM node:12

RUN apt-get update && apt-get install -y tzdata

ARG TZ
ENV TZ=${TZ}
RUN ln -fs /usr/share/zoneinfo/${TZ} /etc/localtime
