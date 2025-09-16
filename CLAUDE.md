user-prompt-submit-hook: afplay /System/Library/Sounds/Glass.aiff

# 蓮城院公式サイト Claude Code設定

## 実装済み設定

### 作業完了通知音
Glass.aiffを使用した清らかな完了音を設定しました。
Claude Codeが作業を完了するたびに、上品な響きの音が鳴ります。

### 利用可能なmacOSシステム音
- `Basso.aiff` - 低音の完了音
- `Blow.aiff` - 風のような音
- `Bottle.aiff` - ボトル音
- `Frog.aiff` - カエル音
- `Funk.aiff` - ファンク音
- `Glass.aiff` - ガラス音（推奨）
- `Hero.aiff` - ヒーロー音
- `Morse.aiff` - モールス信号音
- `Ping.aiff` - ピン音
- `Pop.aiff` - ポップ音（軽快）
- `Purr.aiff` - 猫の喉音
- `Sosumi.aiff` - クラシック音
- `Submarine.aiff` - 潜水艦音
- `Tink.aiff` - チンク音

## Claude Code設定ファイルへの追加方法

1. Claude Codeの設定ファイルを開く
2. 以下の行を追加：

```
user-prompt-submit-hook: afplay /System/Library/Sounds/Glass.aiff
```

または、より上品な完了音として：

```
user-prompt-submit-hook: afplay /System/Library/Sounds/Pop.aiff
```

## 設定の確認方法

設定が正しく動作するかテストするには：

1. 簡単なタスクを依頼する
2. Claude Codeが応答完了時に音が鳴ることを確認

## トラブルシューティング

### 音が鳴らない場合
- macOSの音量設定を確認
- サウンドファイルのパスが正しいか確認
- 権限の問題がないか確認

### 音が大きすぎる場合
- macOSのシステム音量を調整
- より静かな音ファイル（Pop.aiff など）に変更

## 寺院らしい音の提案

寺院のプロジェクトにふさわしい、落ち着いた音として以下を推奨：
- `Glass.aiff` - 清らかな響き
- `Tink.aiff` - 鈴のような音
- `Ping.aiff` - 静かで上品

作業の完了を穏やかに知らせる音として適しています。