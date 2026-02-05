tech stack

///////////////////////////////////
client
npm start
http://localhost:4200/
ng generate component pages/employee --standalone
npm install -D jasmine-core @types/jasmine karma karma-jasmine karma-chrome-launcher karma-coverage


///////////////////////////////////
server
go get github.com/joho/godotenv
go get github.com/labstack/echo/v4
go run .
go clean -cache

///////////////////////////////////
PORT=8080

DB_HOST=127.0.0.1
DB_USER=root
DB_PASS=
DB_NAME=ktnapiango
DB_PORT=3306
