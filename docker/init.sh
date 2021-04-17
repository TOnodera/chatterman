#!/bin/bash

#初期化用SQL生成ファイル
#docker-compose を使う前にこのスクリプトを実行して下さい。
#実行するとinitdb.d内にsqlが出力されてコンポーネント起動時に自動的に初期化さ.envにホストマシンのユーザー情報が書き込まれます。

#設定ファイル読み込み
. ./.env

DDL_SQL=$(cat ./mysql/init/ddl.sql)

ENCRYPTED=$(echo "$SYSTEM_PASSWORD" | md5sum )

DML_SQL=$(cat << SQLTXT

BEGIN;
INSERT INTO users (id, name, email, password, created_at) VALUES ('$SYSTEM_USER', '管理システム', '${SYSTEM_EMAIL}', '$ENCRYPTED', NOW());
INSERT INTO rooms (id, name, room_type, creater_id, created_at) VALUES ('everybody', 'ミーティングルーム','talkroom' ,'$SYSTEM_USER', NOW());
COMMIT;

SQLTXT
)

SQL=$DDL_SQL$DML_SQL

echo -n > ./mysql/initdb.d/init.sql;
echo $SQL >> ./mysql/initdb.d/init.sql

echo "HOST_USER_ID=$(id -u $USER)" >> .env
echo "HOST_GROUP_ID=$(id -g $USER)" >> .env

