# 06 - API設計

> [[05-ステータス管理機能]] | [[BondPoint設計書]] | Next: [[07-UI-UX設計]]

## 🔌 RESTful API エンドポイント設計

### API 設計原則
- **RESTful**: リソースベースの URL 設計
- **統一的**: 一貫したレスポンス形式
- **バージョニング**: `/api/v1/` プレフィックス
- **セキュリティ**: JWT ベース認証
- **パフォーマンス**: ページネーション・フィルタリング対応

---

## 🔐 認証系エンドポイント

### ユーザー登録・認証

| Method | Endpoint | 説明 | 認証 |
|--------|----------|------|------|
| `POST` | `/api/v1/auth/register` | ユーザー登録（電話番号） | 不要 |
| `POST` | `/api/v1/auth/verify` | SMS認証コード検証 | 不要 |
| `POST` | `/api/v1/auth/login` | ログイン | 不要 |
| `POST` | `/api/v1/auth/refresh` | JWT トークン更新 | Refresh Token |
| `GET` | `/api/v1/auth/me` | 自分の情報取得 | 必要 |

#### 登録フロー例

**1. ユーザー登録**
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "phone_number": "+81-90-1234-5678",
  "name": "山田太郎"
}
```

**レスポンス**:
```http
201 Created
{
  "message": "SMS verification code sent",
  "verification_id": "uuid-string",
  "expires_at": "2025-09-29T15:05:00Z"
}
```

**2. SMS認証**
```http
POST /api/v1/auth/verify
Content-Type: application/json

{
  "verification_id": "uuid-string",
  "code": "123456"
}
```

**レスポンス**:
```http
200 OK
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "phone_number": "+81-90-1234-5678",
    "name": "山田太郎",
    "profile_image": null,
    "created_at": "2025-09-29T15:00:00Z"
  }
}
```

---

## 👥 ユーザー系エンドポイント

| Method | Endpoint | 説明 | 認証 |
|--------|----------|------|------|
| `GET` | `/api/v1/users/{user_id}` | ユーザー情報取得 | 必要 |
| `PUT` | `/api/v1/users/profile` | プロフィール更新 | 必要 |
| `POST` | `/api/v1/users/profile/image` | 画像アップロード | 必要 |
| `DELETE` | `/api/v1/users/account` | アカウント削除 | 必要 |

#### プロフィール更新例

```http
PUT /api/v1/users/profile
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9...
Content-Type: application/json

{
  "name": "山田次郎",
  "profile_image": "https://storage.googleapis.com/bondpoint-images/uuid.jpg"
}
```

---

## 👨‍👩‍👧‍👦 グループ系エンドポイント

| Method | Endpoint | 説明 | 認証 |
|--------|----------|------|------|
| `POST` | `/api/v1/groups` | グループ作成 | 必要 |
| `GET` | `/api/v1/groups` | グループ一覧取得 | 必要 |
| `GET` | `/api/v1/groups/{group_id}` | グループ詳細取得 | 必要 |
| `PUT` | `/api/v1/groups/{group_id}` | グループ情報更新 | 必要 |
| `POST` | `/api/v1/groups/{group_id}/join` | グループ参加 | 必要 |
| `GET` | `/api/v1/groups/{group_id}/members` | メンバー一覧取得 | 必要 |
| `DELETE` | `/api/v1/groups/{group_id}/members/{user_id}` | メンバー削除 | 必要 |

#### グループ作成例

```http
POST /api/v1/groups
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9...
Content-Type: application/json

{
  "name": "大学の友達",
  "max_members": 10
}
```

**レスポンス**:
```http
201 Created
{
  "id": "789e0123-e45b-67c8-d901-234567890abc",
  "name": "大学の友達",
  "created_by": "123e4567-e89b-12d3-a456-426614174000",
  "invite_code": "ABC123XYZ",
  "max_members": 10,
  "member_count": 1,
  "created_at": "2025-09-29T15:00:00Z"
}
```

---

## 📅 イベント系エンドポイント

| Method | Endpoint | 説明 | 認証 |
|--------|----------|------|------|
| `POST` | `/api/v1/events` | イベント作成 | 必要 |
| `GET` | `/api/v1/events` | イベント一覧取得 | 必要 |
| `GET` | `/api/v1/events/{event_id}` | イベント詳細取得 | 必要 |
| `PUT` | `/api/v1/events/{event_id}` | イベント更新 | 必要 |
| `DELETE` | `/api/v1/events/{event_id}` | イベント削除 | 必要 |
| `POST` | `/api/v1/events/{event_id}/attend` | 出欠登録 | 必要 |
| `GET` | `/api/v1/events/{event_id}/participants` | 参加者一覧 | 必要 |

#### イベント作成例

```http
POST /api/v1/events
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9...
Content-Type: application/json

{
  "group_id": "789e0123-e45b-67c8-d901-234567890abc",
  "title": "渋谷で飲み会",
  "event_datetime": "2025-09-29T20:00:00Z",
  "location_name": "居酒屋◯◯ 渋谷店",
  "location_address": "東京都渋谷区渋谷1-1-1",
  "latitude": 35.658034,
  "longitude": 139.701636
}
```

---

## ⭐ ステータス系エンドポイント（コア機能）

| Method | Endpoint | 説明 | 認証 |
|--------|----------|------|------|
| `POST` | `/api/v1/events/{event_id}/status` | ステータス更新 | 必要 |
| `GET` | `/api/v1/events/{event_id}/statuses` | 全員のステータス取得 | 必要 |
| `GET` | `/api/v1/events/{event_id}/status/me` | 自分のステータス取得 | 必要 |
| `GET` | `/api/v1/status/presets` | プリセット一覧取得 | 必要 |

### ステータス更新API（詳細）

```http
POST /api/v1/events/{event_id}/status
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9...
Content-Type: application/json

{
  "status_type": "ON_TRAIN",
  "custom_message": "山手線で向かってます",
  "latitude": 35.681236,
  "longitude": 139.767125,
  "location_precision": "MEDIUM",
  "estimated_arrival_time": "2025-09-29T19:45:00Z"
}
```

**レスポンス**:
```http
200 OK
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "event_id": "789e0123-e45b-67c8-d901-234567890abc",
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "user_name": "山田太郎",
  "status_type": "ON_TRAIN",
  "status_display": "🚃 電車乗車中",
  "custom_message": "山手線で向かってます",
  "estimated_arrival_time": "2025-09-29T19:45:00Z",
  "is_on_schedule": true,
  "location": {
    "latitude": 35.68,
    "longitude": 139.77,
    "precision": "MEDIUM"
  },
  "updated_at": "2025-09-29T19:30:00Z",
  "created_at": "2025-09-29T19:30:00Z"
}
```

### 全員のステータス取得

```http
GET /api/v1/events/{event_id}/statuses
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9...
```

**レスポンス**:
```http
200 OK
{
  "event_id": "789e0123-e45b-67c8-d901-234567890abc",
  "statuses": [
    {
      "user_id": "123e4567-e89b-12d3-a456-426614174000",
      "user_name": "山田太郎",
      "profile_image": "https://storage.googleapis.com/bondpoint-images/user1.jpg",
      "status_type": "ON_TRAIN",
      "status_display": "🚃 電車乗車中",
      "custom_message": "山手線で向かってます",
      "estimated_arrival_time": "2025-09-29T19:45:00Z",
      "is_on_schedule": true,
      "updated_at": "2025-09-29T19:30:00Z"
    },
    {
      "user_id": "456e7890-e12b-34d5-a678-901234567def",
      "user_name": "佐藤花子",
      "profile_image": null,
      "status_type": "DELAYED",
      "status_display": "⚠️ 遅延中",
      "custom_message": "電車が遅れてます😭",
      "estimated_arrival_time": "2025-09-29T20:10:00Z",
      "is_on_schedule": false,
      "updated_at": "2025-09-29T19:25:00Z"
    }
  ],
  "updated_at": "2025-09-29T19:30:00Z"
}
```

---

## 🗺️ 経路・位置情報系エンドポイント

| Method | Endpoint | 説明 | 認証 |
|--------|----------|------|------|
| `GET` | `/api/v1/routes/calculate` | 経路計算 | 必要 |
| `POST` | `/api/v1/events/{event_id}/location/share` | 位置情報共有設定 | 必要 |
| `GET` | `/api/v1/events/{event_id}/locations` | 全員の位置情報取得 | 必要 |

### 経路計算例

```http
GET /api/v1/routes/calculate?origin=35.681236,139.767125&destination=35.658034,139.701636&mode=transit
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9...
```

**レスポンス**:
```http
200 OK
{
  "origin": {
    "latitude": 35.681236,
    "longitude": 139.767125,
    "name": "東京駅"
  },
  "destination": {
    "latitude": 35.658034,
    "longitude": 139.701636,
    "name": "渋谷駅"
  },
  "routes": [
    {
      "duration": 1620,
      "distance": 11420,
      "duration_text": "27分",
      "distance_text": "11.4km",
      "steps": [
        {
          "instruction": "JR山手線 外回り に乗車",
          "duration": 1380,
          "mode": "TRANSIT",
          "departure_time": "2025-09-29T19:35:00Z",
          "arrival_time": "2025-09-29T19:58:00Z"
        }
      ]
    }
  ]
}
```

---

## 💬 チャット系エンドポイント

| Method | Endpoint | 説明 | 認証 |
|--------|----------|------|------|
| `POST` | `/api/v1/events/{event_id}/messages` | メッセージ送信 | 必要 |
| `GET` | `/api/v1/events/{event_id}/messages` | メッセージ一覧取得 | 必要 |
| `DELETE` | `/api/v1/messages/{message_id}` | メッセージ削除 | 必要 |

### メッセージ送信例

```http
POST /api/v1/events/{event_id}/messages
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9...
Content-Type: application/json

{
  "content": "少し遅れそうです🙏",
  "type": "text"
}
```

---

## 📋 共通仕様

### 統一レスポンス形式

#### 成功レスポンス
```json
{
  "data": { ... },
  "message": "Success",
  "timestamp": "2025-09-29T19:30:00Z"
}
```

#### エラーレスポンス
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": {
      "field": "phone_number",
      "reason": "Invalid format"
    }
  },
  "timestamp": "2025-09-29T19:30:00Z"
}
```

### ページネーション

```http
GET /api/v1/events?page=1&limit=20&sort=event_datetime&order=desc
```

**レスポンス**:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 156,
    "pages": 8,
    "has_next": true,
    "has_prev": false
  }
}
```

### HTTP ステータスコード

| コード | 意味 | 使用場面 |
|--------|------|----------|
| `200` | OK | 正常処理 |
| `201` | Created | リソース作成成功 |
| `400` | Bad Request | リクエスト不正 |
| `401` | Unauthorized | 認証エラー |
| `403` | Forbidden | 権限エラー |
| `404` | Not Found | リソース未発見 |
| `409` | Conflict | 競合エラー |
| `429` | Too Many Requests | レート制限 |
| `500` | Internal Server Error | サーバーエラー |

---

## 🔒 セキュリティ仕様

### JWT 認証

```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.EkN-DOsnsuRjRO6BxXemmJDm3HbxrbRzXglbN2S4sOkopdU4IsDxTI8jO19W_A4K8ZPJijNLis4EZsHeY559a4DFOd50_OqgHs_u2WW0JMsOG3C4Xr7eSC2gYmgWxw
```

### CORS 設定

```python
origins = [
    "http://localhost:3000",  # 開発環境
    "https://app.bondpoint.com",  # 本番環境
]
```

### レート制限

| エンドポイント | 制限 |
|-------------|------|
| 認証系 | 10回/分 |
| ステータス更新 | 60回/分 |
| その他 | 300回/分 |

---

**Next**: [[07-UI-UX設計]] - モバイルアプリのUI/UX設計とユーザーインタラクション