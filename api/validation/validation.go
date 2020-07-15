package validation

import (
	val "gopkg.in/go-playground/validator.v9"
)

// create a global validator
var Validator *val.Validate

// function to instanceate a validator
func CreateValidator() {

	// call create validator
	Validator = val.New()

}
