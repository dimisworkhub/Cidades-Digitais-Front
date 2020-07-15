package config

import (
	"CidadesDigitaisV2/api/auth"
	"CidadesDigitaisV2/api/responses"
	"errors"
	"fmt"
	"log"
	"net/http"
	"reflect"
)

/*	=========================
		COMENTAR
=========================	*/

func AuthMod(w http.ResponseWriter, r *http.Request, PagMod float64) (err error) {
	mod, err := auth.ExtractTokenMod(r)
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf(`{"Error": "We couldn't extract Token"}`))
		return
	}
	umod := InterfaceSlice(mod)

	umodInt := make([]float64, len(umod))

	for i := range umod {
		umodInt[i] = umod[i].(float64)
	}

	for _, v := range umodInt {

		if v == PagMod {
			log.Printf("[INFO] User is using module: %v", PagMod)
			return
		}

	}
	err = errors.New("error")
	return
}

// conversão de interface
func InterfaceSlice(slice interface{}) []interface{} {
	s := reflect.ValueOf(slice)
	if s.Kind() != reflect.Slice {
		fmt.Sprint("InterfaceSlice() given a non-slice type")
	}

	ret := make([]interface{}, s.Len())

	for i := 0; i < s.Len(); i++ {
		ret[i] = s.Index(i).Interface()
	}

	return ret
}
