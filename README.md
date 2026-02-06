tech stack

///////////////////////////////////
client
npm start
http://localhost:4200/
ng generate component pages/employee --standalone

ng generate module ../module/status
ng generate component ../module/status --standalone=false

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

-- ktnapiango.tbl_mas_employee definition

CREATE TABLE `tbl_mas_employee` (
  `Id` int(150) NOT NULL AUTO_INCREMENT,
  `EmCode` varchar(255) NOT NULL,
  `EmFirstName` varchar(255) NOT NULL,
  `EmLastName` varchar(255) NOT NULL,
  `EmDept` varchar(255) NOT NULL,
  `EmPos` varchar(255) NOT NULL,
  `EmSalary` int(150) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8;