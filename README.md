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

## 📦 Prisma モデル

```prisma
model WorkRecord {
  id          String    @id @default(cuid())
  userId      String
  startTime   DateTime
  endTime     DateTime?
  description String    @default("")
  hourlyRate  Int
  wage        Int?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  user        User      @relation(fields: [userId], references: [id])

  @@index([userId])
  @@index([endTime])
}

model User {
  id         String       @id
  hourlyRate Int
  records    WorkRecord[]
}
```

---

## 🧑‍💻 セットアップ手順

### 1. リポジトリのクローン

```bash
git clone https://github.com/PocoPota/stampy.git
cd stampy
```

### 2. 環境変数の設定
`.env.local` に以下のような Supabase & Prisma 設定を記述：

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
DATABASE_URL=your-database-url
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