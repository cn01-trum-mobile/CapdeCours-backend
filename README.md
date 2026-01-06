# 📘 PROJECT NAME

> Backend API cho **CapdeCours** xây dựng bằng **NestJS**,
> **MikroORM** và **PostgreSQL**.

------------------------------------------------------------------------

## 📋 Mục lục

-   Giới thiệu
-   Công nghệ sử dụng
-   Yêu cầu hệ thống
-   Cài đặt & Cấu hình
-   Chạy Database với Docker
-   Khởi chạy ứng dụng
-   Tài liệu API (Swagger)
-   Test API có xác thực (JWT)
-   Cấu trúc thư mục
-   Troubleshooting

------------------------------------------------------------------------

## 🚀 Giới thiệu

Dự án cung cấp các RESTful API phục vụ cho **việc đăng nhập và lưu lịch**.

Hệ thống sử dụng kiến trúc Module của NestJS, MikroORM để thao tác với
PostgreSQL và JWT cho xác thực người dùng.

------------------------------------------------------------------------

## 🧩 Công nghệ sử dụng

-   NestJS
-   TypeScript
-   PostgreSQL
-   MikroORM
-   JWT (Passport)
-   Swagger (OpenAPI)
-   Docker & Docker Compose

------------------------------------------------------------------------

## 🛠 Yêu cầu hệ thống

-   Node.js v18+
-   Docker Desktop
-   Postman (tuỳ chọn)

------------------------------------------------------------------------

## ⚙️ Cài đặt & Cấu hình

### Cài dependencies

``` bash
npm install
```

### Cấu hình .env
Xem thêm trong file `.env.example`

------------------------------------------------------------------------

## 🐳 Chạy Database với Docker

``` bash
docker-compose up -d
```

### Migration

``` bash
npx mikro-orm migration:create
npx mikro-orm migration:up
```

------------------------------------------------------------------------

## ▶️ Khởi chạy ứng dụng

### Development

``` bash
npm run start:dev
```

### Production

``` bash
npm run build
npm run start:prod
```

Server chạy tại http://localhost:3000

------------------------------------------------------------------------

## 📚 Swagger

Truy cập: http://localhost:3000/api

------------------------------------------------------------------------

## 🔐 Test API JWT

1.  POST /auth/login → lấy token
2.  Swagger → Authorize → Bearer `<token>`{=html}
3.  Gọi API bảo mật (VD: GET /user/profile)

------------------------------------------------------------------------

## 📂 Cấu trúc thư mục

    src/
    ├── modules/
    │   ├── auth/
    │   ├── user/
    │   └── orm.module.ts
    ├── entities/
    ├── main.ts
    └── app.module.ts

------------------------------------------------------------------------

## 🐛 Troubleshooting

-   ECONNREFUSED 5432 → DB chưa chạy
-   401 Unauthorized → Token sai/hết hạn
-   relation does not exist → Chưa chạy migration
