package middlewares

import (
	"fmt"
	"net/http"

	"Cidades-Digitais-Front/api/auth"
	"Cidades-Digitais-Front/api/responses"
)

/*	=========================
		COMENTAR
=========================	*/

func SetMiddleJSON(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		next(w, r)
	}
}

func SetMiddleAuth(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		err := auth.TokenValid(r)
		if err != nil {
			responses.ERROR(w, http.StatusUnauthorized, fmt.Errorf("[FATAL] Unauthorized"))
			return
		}
		next(w, r)
	}
}
