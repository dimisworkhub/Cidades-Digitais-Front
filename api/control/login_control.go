package control

import (
	"encoding/json"

	"io/ioutil"
	"log"
	"net/http"
	"strings"

	"Cidades-Digitais-Front/api/config"
	"Cidades-Digitais-Front/api/models"
	"Cidades-Digitais-Front/api/responses"
	"Cidades-Digitais-Front/api/validation"
)

/*  =========================
	FUNCAO DE LOGIN
=========================  */

func (server *Server) Login(w http.ResponseWriter, r *http.Request) {

	//	Le a request e salva em 'body
	body, err := ioutil.ReadAll(r.Body)

	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	usuario := models.Usuario{}

	//	Unmarshal analisa o JSON recebido e armazena na struct usuario referenciada (&struct)
	err = json.Unmarshal(body, &usuario)

	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	if err = validation.Validator.Struct(usuario); err != nil {
		log.Printf("[WARN] invalid usuario information, because, %v\n", err)
		w.WriteHeader(http.StatusPreconditionFailed)
		return
	}

	//	Verifica os dados de login e senha e cria o token de autenticacao para usuarios cadastrados
	token, err := usuario.SignIn(server.DB, usuario.Login, usuario.Senha)

	if err != nil {
		formattedError := config.FormatError(err.Error())
		responses.ERROR(w, http.StatusUnprocessableEntity, formattedError)
		return
	}

	if strings.Contains(token, "Error") {
		w.WriteHeader(http.StatusPreconditionFailed)
		return
	}

	//	Retorna Status 200 e o token criado
	responses.JSON(w, http.StatusOK, token)
}
