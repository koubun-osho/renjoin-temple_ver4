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

# 作業記録ルール（2025-09-20追加）
全ての技術作業において以下を厳守する：

## 作業前の必須確認
1. TodoWriteツールで作業計画を作成
2. 現在の本番環境状況を確認・記録
3. 影響範囲を事前評価

## 作業中の記録義務
1. 段階的実装と各段階でのテスト
2. TodoWriteツールでの進捗更新
3. 問題発生時の詳細記録

## 作業完了時の確認
1. 本番環境での動作確認実施
2. 全機能テストの実行
3. 作業内容をメモリに保存
4. 影響のないことを明確に報告

これらを怠った場合、予期しない本番環境への影響を引き起こす可能性があります。

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.