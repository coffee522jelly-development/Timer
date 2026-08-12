# プレミアムレトロオーディオタイマー

Tauri v2 + Svelte 5 を使用して構築された、高級レトロオーディオ機材風のタイマーアプリケーションです。

## 特徴

*   **アナログオーディオデザイン**: ロータリーノブや物理ボタンの質感を再現した、高級感のあるUI。
*   **ポモドーロタイマー対応**: 25分（ポモドーロ）、15分（ショートブレイク）、30分（ロングブレイク）のプリセットを搭載。
*   **スムーズな操作性**: マウスやタッチでの直感的なノブ操作。
*   **デスクトップ統合**: システムトレイへの格納やネイティブ通知をサポート。

## 技術スタック

*   **Frontend**: Svelte 5, Tailwind CSS
*   **Backend**: Tauri v2 (Rust)
*   **Build Tool**: Vite

## 開発とビルド

### 必要要件

*   Node.js
*   Rust
*   Tauriのシステム依存関係（[Tauri Prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites) 参照）

### セットアップ

```bash
npm install
```

### 開発サーバーの起動

```bash
npm run tauri dev
```

### ビルド

```bash
npm run tauri build
```
