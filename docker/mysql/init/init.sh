#!/bin/bash

#初期化用SQL生成ファイル
#docker-compose を使う前にこのスクリプトを実行して下さい。
#実行するとinitdb.d内にsqlが出力されてコンポーネント起動時に自動的に初期化されます。

#設定ファイル読み込み
. ../../.env

DDL_SQL=$(cat ddl.sql)


DML_SQL=$(cat << SQLTXT

BEGIN;
INSERT INTO users (id, name, email, password, created_at) VALUES ('$SYSTEM_USER', '管理システム', '${SYSTEM_EMAIL}', '$SYSTEM_PASSWORD', NOW());
INSERT INTO rooms (id, name, room_type, creater_id, created_at) VALUES ('everybody', 'ミーティングルーム','talkroom' ,'$SYSTEM_USER', NOW());
COMMIT;

SQLTXT
)

SQL=$DDL_SQL$DML_SQL

echo $SQL >> ../initdb.d/init.sql


