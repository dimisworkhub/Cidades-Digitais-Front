package control

import (
	"net/http"

	"Cidades-Digitais-Front/api/responses"
)

func (server *Server) Home(w http.ResponseWriter, r *http.Request) {

	responses.JSON(w, http.StatusOK, "Welcome To This Awesome API")
	return
}
