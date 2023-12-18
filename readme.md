# Setup Metabase

## Chạy Metabase bằng docker. Chạy lệnh

```
docker pull metabase/metabase:latest
docker run -d -p {host-port}:3000 --name metabase metabase/metabase
```

## Truy cập vào Metabase

localhost ở port {host-port}

## Đăng ký tài khoản

Làm theo các bước trên màn hình.

Lưu ý: skip qua bước kết nối database, sẽ kết nối sau khi deploy app BKRM

## Lấy secret key

## Gắn secret key vào iframe

iframe trong ./bkrm-fe/src/views/ManagerView/Statistics/Metabase/Metabase.js

# Deploy app BKRM

## Chuyển đến thư mục FE

```
cd {path/to/your/fe/folder}
```

## (Nếu chưa install npm) Install npm

```
npm i
```

Nếu không được thì thử force install

```
npm i --force
```

## Sửa value của biến REACT_APP_API_URL trong file “.env” (chỉ chọn a hoặc b)

### a) Dành cho local

```
REACT_APP_API_URL=http://localhost/api
```

### b) Dành cho remote server

```
REACT_APP_API_URL=http://{your-server-ip-address}/api
```

## Chạy lệnh

```
npm run build
```

## Copy tất cả files trong thư mục “build” của thư mục FE và paste vào trong thư mục “public" của thư mục BE (chọn Replace all files)

## Chuyển đến thư mục BE

```
cd {path/to/your/be/folder}
```

## (Bước này chỉ dành cho deploy lên remote server) Chạy lệnh

```
sudo chmod -R 777 ./storage
sudo chmod -R 777 ./bootstrap/cache
```

## (Bước này chỉ dành cho máy chạy chip có kiến trúc ARM) Sửa lại base image của mysql service trong file “docker-compose.yml”

Sử dụng base image này “biarms/mysql:5.7”

## Chạy lệnh (chỉ chọn a hoặc b)

### a) Dành cho lần đầu tiên deploy (để make sure thì vô xem lệnh trong file readme vì có thể đã có cập nhật mới mà quên update ở đây)

```
docker compose up -d && docker compose exec api bash -c "cp .env.example .env && composer install && php artisan storage:link"
```

### b) Dành cho những lần deploy sau

```
docker compose up -d
```

## (Nếu muốn dừng app) Chạy lệnh

```
docker compose down
```




