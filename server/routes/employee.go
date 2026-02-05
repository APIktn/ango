package routes

import (
	"database/sql"
	"net/http"

	"server/function"

	"github.com/labstack/echo/v4"
)

type Employee struct {
	Id          int    `json:"id"`
	EmCode      string `json:"em_code"`
	EmFirstName string `json:"em_first_name"`
	EmLastName  string `json:"em_last_name"`
	EmDept      string `json:"em_dept"`
	EmPos       string `json:"em_pos"`
	EmSalary    int    `json:"em_salary"`
}

func EmployeeRoutes(e *echo.Echo, db *sql.DB) {

	// get all
	e.GET("/employee", func(c echo.Context) error {
		rows, err := db.Query(`
			SELECT Id, EmCode, EmFirstName, EmLastName, EmDept, EmPos, EmSalary
			FROM tbl_mas_employee
		`)
		if err != nil {
			return err
		}
		defer rows.Close()

		list := []Employee{}
		for rows.Next() {
			var emp Employee
			rows.Scan(
				&emp.Id,
				&emp.EmCode,
				&emp.EmFirstName,
				&emp.EmLastName,
				&emp.EmDept,
				&emp.EmPos,
				&emp.EmSalary,
			)
			list = append(list, emp)
		}

		return c.JSON(http.StatusOK, list)
	})

	// create
	e.POST("/employee", func(c echo.Context) error {
		emp := new(Employee)
		if err := c.Bind(emp); err != nil {
			return err
		}

		emCode, err := function.GenerateEmCode(db)
		if err != nil {
			return err
		}

		_, err = db.Exec(`
			INSERT INTO tbl_mas_employee
			(EmCode, EmFirstName, EmLastName, EmDept, EmPos, EmSalary)
			VALUES (?, ?, ?, ?, ?, ?)
		`,
			emCode,
			emp.EmFirstName,
			emp.EmLastName,
			emp.EmDept,
			emp.EmPos,
			emp.EmSalary,
		)

		if err != nil {
			return err
		}

		return c.JSON(http.StatusCreated, echo.Map{
			"message": "created",
			"em_code": emCode,
		})
	})
}
