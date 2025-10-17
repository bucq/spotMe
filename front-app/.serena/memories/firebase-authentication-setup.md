# Firebase認証機能実装完了

## 実装内容

### 作成したファイル

1. **Firebase設定とユーティリティ**
   - `lib/firebase.ts` - Firebase初期化、認証関数
   - `contexts/AuthContext.tsx` - 認証状態管理コンテキスト

2. **認証画面**
   - `app/(auth)/sign-in.tsx` - ログイン画面
   - `app/(auth)/sign-up.tsx` - 新規登録画面
   - `app/(auth)/forgot-password.tsx` - パスワードリセット画面
   - `app/(auth)/_layout.tsx` - 認証画面レイアウト

3. **プロフィール画面**
   - `app/(tabs)/profile.tsx` - ユーザープロフィールとログアウト機能

4. **アプリレイアウト更新**
   - `app/_layout.tsx` - 認証状態による画面切り替え実装

### 主な機能

- ✅ メールアドレス/パスワードによる新規登録
- ✅ ログイン機能
- ✅ パスワードリセット機能
- ✅ 認証状態の永続化 (AsyncStorage)
- ✅ 認証状態による自動画面遷移
- ✅ ログアウト機能
- ✅ ユーザー情報表示

### 技術スタック

- Firebase Authentication
- React Native AsyncStorage (認証状態の永続化)
- Expo Router (ファイルベースルーティング)
- React Context API (グローバル状態管理)

### 起動方法

```bash
npm start
```

iOS/Android/Webのいずれかを選択してアプリを起動。
最初にログイン画面が表示され、新規登録後にメインアプリにアクセス可能。
