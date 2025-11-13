BSWeb SaaS – Hướng dẫn cấu hình & chạy dự án
===========================================

1. Chuẩn bị môi trường
----------------------
- Cài đặt Docker Desktop (bật WSL2 backend nếu dùng Windows).
- Cài đặt Node.js >= 20 và pnpm >= 9 (dự phòng cho việc chạy dev trực tiếp).
- Clone repo vào máy và mở thư mục `BSWebSaaS`.

2. Thiết lập biến môi trường
----------------------------
- Sao chép `env/example.env` thành các file sau tùy nhu cầu:
  - `.env` ở thư mục gốc: dùng khi chạy Docker Compose (mặc định).
  - `apps/saas/.env.local`: dùng khi chạy `pnpm dev` trực tiếp (không Docker).
  - `env/.env.staging`, `env/.env.production`: dùng cho CI/CD hoặc môi trường triển khai (không commit).
- Chỉnh sửa các giá trị:
  - `POSTGRES_*`: tài khoản, mật khẩu, host, port của Postgres.
  - `PAYLOAD_SECRET`: chuỗi bí mật dùng ký JWT/session (đã sinh sẵn một giá trị mẫu, nên đổi khi deploy).
  - `NEXT_PUBLIC_APP_URL`: URL public của ứng dụng (ví dụ `http://localhost:3000`).
  - (Tuỳ chọn) `DATABASE_URI`: dùng DSN riêng nếu không muốn app tự ghép từ `POSTGRES_*`.
  - `REDIS_URL`: nếu bạn dùng Redis ngoài Docker.
  - Các nhóm biến Storage (S3/R2), AI Assistant, Analytics… có thể bật khi cần.

3. Chạy bằng Docker (khuyến nghị)
--------------------------------
```bash
pnpm install            # cài đặt dependency (lần đầu)
docker compose up -d    # khởi động app, Postgres, Redis
```
- Truy cập ứng dụng tại `http://localhost:3000`.
- Payload Admin (CMS) ở `http://localhost:3000/admin`.
- Dừng dịch vụ: `docker compose down` (thêm `-v` nếu muốn xoá luôn volume dữ liệu).

4. Chạy dev không Docker
------------------------
```bash
pnpm install
pnpm payload:migrate    # chạy migration qua CLI của Payload
pnpm dev                # chạy Next.js + Payload ở chế độ dev
```
- Đảm bảo Postgres/Redis đã chạy sẵn (local hoặc dịch vụ ngoài) và cấu hình đúng trong `apps/saas/.env.local`.
- Hiện chưa có script seed mẫu; hãy tạo Tenant/Site/User demo trực tiếp trong Payload Admin sau khi chạy dev.

5. Lệnh hữu ích
---------------
- `pnpm build`: build production cho app.
- `pnpm payload:migrate`: chạy migration cho Payload.
- `pnpm payload:upgrade`: cập nhật schema Payload nếu có thay đổi.
- `pnpm test`, `pnpm test:e2e`, `pnpm lint`: chạy test và lint khi cần.
- `docker compose logs -f app`: xem log runtime.

6. Ghi chú bảo mật
------------------
- Không commit các file `.env*` chứa secret thật.
- Khi deploy, nên đưa secret vào secret manager (AWS Secrets Manager, GCP Secret Manager, Doppler, 1Password, …).
- Đổi toàn bộ giá trị mặc định trong `env/example.env` trước khi đưa vào môi trường sản xuất.
