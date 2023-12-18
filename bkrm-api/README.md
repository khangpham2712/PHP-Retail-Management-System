# Install project - (first time)

### clone project / download zip file
```bash
git clone git@github.com:{username}/bkrm-api.git
```

###  run this command for the first time to set up and live web
inside project (root path)
```bash
docker compose up -d && docker compose exec api bash -c "cp .env.example .env && composer install && php artisan storage:link"
```

# For every time you want to run project
### start web
```bash
docker compose up
```
### stop web
```bash
docker compose down
```

# Note for deploy source build bkrm-fe

1. in fe source before run npm run build change value for `REACT_APP_API_URL` 

    .env (use a or b)
    
    a. for local and docker run local
    ```
    REACT_APP_API_URL=http://localhost/api
    ```
    `npm run build` and copy to `public` folder in bkrm-api
    
    b. for docker deploy on remote
     (replace your ip remote server)
    ```
    REACT_APP_API_URL=http://{your-server-ip-address}/api
    ```
    `npm run build` and copy to `public` folder in bkrm-api

2. Please don't forget this on remote server 
```
sudo chmod -R 777 ./storage
sudo chmod -R 777 ./bootstrap/cache/
```
