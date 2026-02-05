package function

import (
	"database/sql"
	"fmt"
)

func GenerateEmCode(db *sql.DB) (string, error) {
	var lastCode string

	err := db.QueryRow(`
		SELECT EmCode
		FROM tbl_mas_employee
		ORDER BY Id DESC
		LIMIT 1
	`).Scan(&lastCode)

	if err == sql.ErrNoRows {
		return "EMP000001", nil
	}

	if err != nil {
		return "", err
	}

	var num int
	fmt.Sscanf(lastCode, "EMP%d", &num)
	num++

	return fmt.Sprintf("EMP%06d", num), nil
}
