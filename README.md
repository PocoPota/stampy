# 🕒 Stampy - 自分用勤怠管理アプリ

**Stampy** は、個人開発者やフリーランス向けのシンプルな勤怠管理アプリです。Googleアカウントでログインして、労働時間を記録し、仕事内容や時給に基づいた報酬も自動で計算できます。複数端末からの打刻にも対応しています。

---

## 🚀 機能一覧

- ✅ Google アカウントでログイン
- ⏱️ 「労働スタート」「ストップ」ボタンによる時間記録
- 📝 仕事内容の入力と保存
- 💰 時給に基づいた報酬の自動計算
- 🔄 時給の変更履歴に対応（当時の時給で記録）
- 📊 ダッシュボードで記録の確認
- 🌐 複数端末からの打刻対応
- ⚙️ ユーザーごとの時給設定

---

## 🛠 使用技術

- [Next.js](https://nextjs.org/) (App Router)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) (UI コンポーネント)
- [Supabase](https://supabase.com/) (認証 & DB)
- [Prisma](https://www.prisma.io/) (ORM)

---

## 📁 ディレクトリ構成

<pre>
/app
  ├─ layout.tsx                # 全体レイアウト
  ├─ page.tsx                  # ホームページ（ログインボタン）
  ├─ dashboard/page.tsx        # 記録一覧ダッシュボード
  ├─ record/page.tsx           # 打刻ページ
  └─ settings/page.tsx         # 時給設定ページ

/components
  ├─ Timer.tsx
  ├─ WorkLogForm.tsx
  └─ Button.tsx など UI コンポーネント群

/lib
  ├─ supabase.ts
  ├─ prisma.ts
  └─ auth.ts

/hooks
  └─ useTimer.ts

/context
  └─ UserContext.tsx
</pre>

---

## 📦 Prisma モデル

```prisma
model WorkLog {
  id          String   @id @default(cuid())
  userId      String
  startTime   DateTime
  endTime     DateTime?
  description String?
  wageAtTime  Int
  createdAt   DateTime @default(now())

  user        User     @relation(fields: [userId], references: [id])
}

model User {
  id        String   @id
  email     String   @unique
  wage      Int      @default(1000)
  workLogs  WorkLog[]
}
```

---

## 🧑‍💻 セットアップ手順

### 1. リポジトリのクローン

```bash
git clone https://github.com/your-username/stampy.git
cd stampy
```

### 2. 環境変数の設定
`.env.local` に以下のような Supabase & Prisma 設定を記述：

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

DATABASE_URL="postgresql://user:password@localhost:5432/stampy"
```

### 3. 依存関係のインストール

```bash
npm install
```

### 4. Prisma マイグレーションと生成

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. 開発サーバー起動

```bash
npm run dev
``` 

```bash
npx prisma studio
```

---

## 🧪 今後の開発予定

- モバイル対応（PWA 対応）
- 月ごとのレポート出力（CSV等）
- リマインダー機能（通知API）
