tech stack

///////////////////////////////////
client
npm start

ng generate component pages/employee --standalone
ng generate component pages/employeelist --standalone

///////////////////////////////////
server
go get github.com/joho/godotenv
go run .

///////////////////////////////////
PORT=8080

DB_HOST=127.0.0.1
DB_USER=root
DB_PASS=
DB_NAME=ktnapiango
DB_PORT=3306
