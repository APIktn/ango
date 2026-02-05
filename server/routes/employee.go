package routes

import (
	"database/sql"
	"net/http"
	"strconv"

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

	e.GET("/employee", func(c echo.Context) error {

		emCode := c.QueryParam("emcode")
		if emCode == "" {
			return c.JSON(http.StatusBadRequest, echo.Map{
				"message": "emcode required",
			})
		}

		var emp Employee

		err := db.QueryRow(`
		SELECT Id, EmCode, EmFirstName, EmLastName, EmDept, EmPos, EmSalary
		FROM tbl_mas_employee
		WHERE EmCode = ?
	`, emCode).Scan(
			&emp.Id,
			&emp.EmCode,
			&emp.EmFirstName,
			&emp.EmLastName,
			&emp.EmDept,
			&emp.EmPos,
			&emp.EmSalary,
		)

		if err == sql.ErrNoRows {
			return c.JSON(http.StatusNotFound, echo.Map{
				"message": "employee not found",
			})
		}
		if err != nil {
			return err
		}

		return c.JSON(http.StatusOK, emp)
	})

	e.GET("/allemployee", func(c echo.Context) error {

		search := c.QueryParam("search")
		page, _ := strconv.Atoi(c.QueryParam("page"))
		limit, _ := strconv.Atoi(c.QueryParam("limit"))

		if page < 1 {
			page = 1
		}
		if limit < 1 {
			limit = 5
		}

		offset := (page - 1) * limit

		where := ""
		args := []any{}

		if search != "" {
			where = `
		WHERE EmCode LIKE ?
		OR EmFirstName LIKE ?
		OR EmLastName LIKE ?
		OR EmDept LIKE ?
		`
			like := "%" + search + "%"
			args = append(args, like, like, like, like)
		}

		// ===== count total =====
		var total int
		countSql := `SELECT COUNT(*) FROM tbl_mas_employee ` + where
		db.QueryRow(countSql, args...).Scan(&total)

		// ===== get data =====
		sql := `
	SELECT Id, EmCode, EmFirstName, EmLastName, EmDept, EmPos, EmSalary
	FROM tbl_mas_employee
	` + where + `
	LIMIT ? OFFSET ?
	`
		args = append(args, limit, offset)

		rows, err := db.Query(sql, args...)
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

		return c.JSON(http.StatusOK, echo.Map{
			"data":  list,
			"page":  page,
			"limit": limit,
			"total": total,
		})
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

	// update
	e.PUT("/employee", func(c echo.Context) error {
		emCode := c.QueryParam("emcode")
		if emCode == "" {
			return c.JSON(http.StatusBadRequest, echo.Map{
				"message": "emcode required",
			})
		}

		emp := new(Employee)
		if err := c.Bind(emp); err != nil {
			return err
		}

		_, err := db.Exec(`
			UPDATE tbl_mas_employee
			SET EmFirstName = ?, EmLastName = ?, EmDept = ?, EmPos = ?, EmSalary = ?
			WHERE EmCode = ?
		`,
			emp.EmFirstName,
			emp.EmLastName,
			emp.EmDept,
			emp.EmPos,
			emp.EmSalary,
			emCode,
		)

		if err != nil {
			return err
		}

		return c.JSON(http.StatusOK, echo.Map{
			"message": "updated",
			"em_code": emCode,
		})
	})

	// delete
	e.DELETE("/employee", func(c echo.Context) error {
		emCode := c.QueryParam("emcode")
		if emCode == "" {
			return c.JSON(http.StatusBadRequest, echo.Map{
				"message": "emcode required",
			})
		}

		_, err := db.Exec(`
			DELETE FROM tbl_mas_employee
			WHERE EmCode = ?
		`, emCode)

		if err != nil {
			return err
		}

		return c.JSON(http.StatusOK, echo.Map{
			"message": "deleted",
			"em_code": emCode,
		})
	})
}
