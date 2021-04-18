# チャットアプリ

このチャットアプリ自分の技術学習用として作成しています。

■使用している主な技術。  
フロントエンド・・・vue.js,typescript  
バックエンド・・・node.js,express,socket.io,typescript,mysql,docker,docker-compose

■学習の趣旨  
一番やりたいこととしてはci/cdを実現する為にユースケース的なレイヤと技術的なレイヤを分けて実装し、ユースケースのテストを書いてリファクタリングを繰り返し機能を追加していく。（デグレ防止）  
規模が大きくなってきても破綻させずに管理する技術を身につけたい。  
node.js,typescript、vue.js,express,socket.ioも興味あったので覚えられる！

■現状  
登録機能、ログイン機能、ミーティングルーム（複数人でのチャット）は実装。ダイレクトメッセージは相手の承認が得られた場合に送れるように実装。  
入力中の場合は同じルームのメンバーに入力中であることが表示される機能実装。入室した時に過去の大量のメッセージが表示されると嫌なので直近２０件を表示してスクロールアップした時に追加で２０件ずつ表示される機能実装。
もうちょっとでVer0出来そうなのでコード整理してテスト書く。  
ci/cdサーバー構築してみたいので終わったらやる。

■ミーティングルームイメージ  
![image meetingroom](https://github.com/TOnodera/chatterman/blob/main/documents/image/meetingroom.png)

■DM申請承認メッセージ  
![image dmapplication](https://github.com/TOnodera/chatterman/blob/main/documents/image/dm.png)

■ユーザーパッケージのUML(リファクタリング中)  
![image dmapplication](https://github.com/TOnodera/chatterman/blob/main/documents/image/user.png)
