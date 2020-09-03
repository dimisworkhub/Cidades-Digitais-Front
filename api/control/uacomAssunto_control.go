package control

import (
	"CidadesDigitaisV2/api/auth"
	"CidadesDigitaisV2/api/config"
	"CidadesDigitaisV2/api/models"
	"CidadesDigitaisV2/api/responses"
	"CidadesDigitaisV2/api/validation"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

/*  =========================
	FUNCAO ADICIONAR UACOM ASSUNTO
=========================  */

func (server *Server) CreateUacomAssunto(w http.ResponseWriter, r *http.Request) {

	//	Autorizacao de Modulo
	if err := config.AuthMod(w, r, 13101); err != nil {
		responses.ERROR(w, http.StatusUnauthorized, fmt.Errorf("[FATAL] Unauthorized"))
		return
	}

	//	O metodo ReadAll le toda a request ate encontrar algum erro, se nao encontrar erro o leitura para em EOF
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, fmt.Errorf("[FATAL] it couldn't read the body, %v\n", err))
		return
	}

	//	Extrai o cod_usuario do body
	tokenID, err := auth.ExtractTokenID(r)
	if err != nil {
		responses.ERROR(w, http.StatusUnauthorized, errors.New("Unauthorized"))
		return
	}

	uacomAssunto := models.UacomAssunto{}
	logUacomAssunto := models.Log{}

	//	Unmarshal analisa o JSON recebido e armazena na struct uacomAssunto referenciada (&struct)
	if err = json.Unmarshal(body, &uacomAssunto); err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, fmt.Errorf("[FATAL] ERROR: 422, %v\n", err))
		return
	}

	//	Validacao de estrutura
	if err = validation.Validator.Struct(uacomAssunto); err != nil {
		log.Printf("[WARN] invalid information, because, %v\n", fmt.Errorf("[FATAL] validation error!, %v\n", err))
		w.WriteHeader(http.StatusPreconditionFailed)
		return
	}

	//	SaveUacomAssunto eh o metodo que faz a conexao com banco de dados e salva os dados recebidos
	uacomAssuntoCreated, err := uacomAssunto.SaveUacomAssunto(server.DB)
	if err != nil {
		formattedError := config.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't save in database, %v\n", formattedError))
		return
	}

	//	Parametros de entrada(nome_server, chave_primaria, nome_tabela, operacao, id_usuario)
	err = logUacomAssunto.LogUacomAssunto(server.DB, uacomAssuntoCreated.CodIbge, uacomAssuntoCreated.Data, uacomAssuntoCreated.CodAssunto, "uacom_assunto", "i", tokenID)
	if err != nil {
		formattedError := config.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't save log in database, %v\n", formattedError))
		return
	}

	w.Header().Set("Location", fmt.Sprintf("%s%s/%d/%d/%d", r.Host, r.RequestURI, uacomAssuntoCreated.CodIbge, uacomAssuntoCreated.Data, uacomAssuntoCreated.CodAssunto))

	//	Ao final retorna o Status 201 e o JSON da struct que foi criada
	responses.JSON(w, http.StatusCreated, uacomAssuntoCreated)
}

/*  =========================
	FUNCAO LISTAR TODAS UACOM
=========================  */

func (server *Server) GetAllUacomAssunto(w http.ResponseWriter, r *http.Request) {

	//	Autorizacao de Modulo
	if err := config.AuthMod(w, r, 13102); err != nil {
		responses.ERROR(w, http.StatusUnauthorized, fmt.Errorf("[FATAL] Unauthorized"))
		return
	}

	//	Vars retorna as variaveis de rota
	vars := mux.Vars(r)

	//	codIbge armazena a chave primaria da tabela uacom
	codIbge, err := strconv.ParseUint(vars["cod_ibge"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, fmt.Errorf("[FATAL] It couldn't parse the variable, %v\n", err))
		return
	}

	//	data armazena a chave primaria da tabela uacom
	data := vars["data"]

	uacomAssunto := models.UacomAssunto{}

	//	allUacomAssunto armazena os dados buscados no banco de dados
	allUacomAssunto, err := uacomAssunto.FindAllUacomAssunto(server.DB, uint32(codIbge), data)
	if err != nil {
		formattedError := config.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't find in database, %v\n", formattedError))
		return
	}

	//	Retorna o Status 200 e o JSON da struct buscada
	responses.JSON(w, http.StatusOK, allUacomAssunto)
}

/*  =========================
	FUNCAO DELETAR UACOM ASSUNTO
=========================  */

func (server *Server) DeleteUacomAssunto(w http.ResponseWriter, r *http.Request) {

	if err := config.AuthMod(w, r, 13103); err != nil {
		responses.ERROR(w, http.StatusUnauthorized, fmt.Errorf("[FATAL] Unauthorized"))
		return
	}

	// Vars retorna as variaveis de rota
	vars := mux.Vars(r)

	//	Extrai o cod_usuario do body
	tokenID, err := auth.ExtractTokenID(r)
	if err != nil {
		responses.ERROR(w, http.StatusUnauthorized, errors.New("Unauthorized"))
		return
	}

	uacomAssunto := models.UacomAssunto{}
	logUacomAssunto := models.Log{}

	//	codIbge armazena a chave primaria da tabela uacom assunto
	codIbge, err := strconv.ParseUint(vars["cod_ibge"], 10, 32)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, fmt.Errorf("[FATAL] It couldn't parse the variable, %v\n", err))
		return
	}

	//	data armazena a chave primaria da tabela uacom
	data := vars["data"]

	//	codAssunto armazena a chave primaria da tabela uacom
	codAssunto, err := strconv.ParseUint(vars["cod_assunto"], 10, 32)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, fmt.Errorf("[FATAL] It couldn't parse the variable, %v\n", err))
		return
	}

	//	Parametros de entrada(nome_server, chave_primaria, chave_primaria, nome_tabela, operacao, id_usuario)
	err = logUacomAssunto.LogUacomAssunto(server.DB, uint32(codIbge), data, uint32(codAssunto), "uacom", "d", tokenID)
	if err != nil {
		formattedError := config.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't save log in database, %v\n", formattedError))
		return
	}

	err = uacomAssunto.DeleteUacomAssunto(server.DB, uint32(codIbge), data, uint32(codAssunto))
	if err != nil {
		formattedError := config.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't delete in database , %v\n", formattedError))
		return
	}

	w.Header().Set("Entity", fmt.Sprintf("%d/%d", codIbge, data))

	//	Retorna o Status 204, indicando que a informacao foi deletada
	responses.JSON(w, http.StatusNoContent, "")
}
