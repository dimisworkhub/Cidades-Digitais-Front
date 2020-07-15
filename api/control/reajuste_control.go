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
	FUNCAO ADICIONAR REAJUSTE
=========================  */

func (server *Server) CreateReajuste(w http.ResponseWriter, r *http.Request) {

	//	Autorizacao de Modulo
	if err := config.AuthMod(w, r, 14001); err != nil {
		responses.ERROR(w, http.StatusUnauthorized, fmt.Errorf("[FATAL] Unauthorized"))
		return
	}

	//	O metodo ReadAll le toda a request ate encontrar algum erro, se nao encontrar erro o leitura para em EOF
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, fmt.Errorf("[FATAL] it couldn't read the body, %v\n", err))
	}

	//	Extrai o cod_usuario do body
	tokenID, err := auth.ExtractTokenID(r)
	if err != nil {
		responses.ERROR(w, http.StatusUnauthorized, errors.New("Unauthorized"))
		return
	}

	reajuste := models.Reajuste{}
	logReajuste := models.Log{}

	//	Unmarshal analisa o JSON recebido e armazena na struct reajuste referenciada (&struct)
	if err = json.Unmarshal(body, &reajuste); err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, fmt.Errorf("[FATAL] ERROR: 422, %v\n", err))
		return
	}

	//	Validacao de estrutura
	if err = validation.Validator.Struct(reajuste); err != nil {
		log.Printf("[WARN] invalid information, because, %v\n", fmt.Errorf("[FATAL] validation error!, %v\n", err))
		w.WriteHeader(http.StatusPreconditionFailed)
		return
	}

	//	Parametros de entrada(nome_server, chave_primaria, chave_primaria, nome_tabela, operacao, id_usuario)
	err = logReajuste.LogReajuste(server.DB, reajuste.AnoRef, reajuste.CodLote, "reajuste", "i", tokenID)
	if err != nil {
		formattedError := config.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't save log in database, %v\n", formattedError))
		return
	}

	//	SaveReajuste eh o metodo que faz a conexao com banco de dados e salva os dados recebidos
	reajusteCreated, err := reajuste.SaveReajuste(server.DB)
	if err != nil {
		formattedError := config.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't save in database, %v\n", formattedError))
		return
	}

	w.Header().Set("Location", fmt.Sprintf("%s%s/%d", r.Host, r.RequestURI, reajusteCreated.AnoRef))

	//	Ao final retorna o Status 201 e o JSON da struct que foi criada
	responses.JSON(w, http.StatusCreated, reajusteCreated)
}

/*  =========================
	FUNCAO LISTAR REAJUSTE POR ID
=========================  */

func (server *Server) GetReajusteByID(w http.ResponseWriter, r *http.Request) {

	if err := config.AuthMod(w, r, 14002); err != nil {
		responses.ERROR(w, http.StatusUnauthorized, fmt.Errorf("[FATAL]Unauthorized"))
		return
	}

	vars := mux.Vars(r)

	anoRef, err := strconv.ParseUint(vars["ano_ref"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, fmt.Errorf("[FATAL] It couldn't parse the variable, %v\n", err))
		return
	}

	codLote, err := strconv.ParseUint(vars["cod_lote"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, fmt.Errorf("[FATAL] It couldn't parse the variable, %v\n", err))
		return
	}

	reajuste := models.Reajuste{}

	reajusteGotten, err := reajuste.FindReajusteByID(server.DB, uint32(anoRef), uint32(codLote))
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, fmt.Errorf("[FATAL] It couldn't find by ID, %v\n", err))
		return
	}

	responses.JSON(w, http.StatusOK, reajusteGotten)
}

/*  =========================
	FUNCAO LISTAR TODOS REAJUSTE
=========================  */

func (server *Server) GetAllReajuste(w http.ResponseWriter, r *http.Request) {

	//	Autorizacao de Modulo
	if err := config.AuthMod(w, r, 14002); err != nil {
		responses.ERROR(w, http.StatusUnauthorized, fmt.Errorf("[FATAL]Unauthorized"))
		return
	}
	reajuste := models.Reajuste{}

	//	allReajuste armazena os dados buscados no banco de dados
	allReajuste, err := reajuste.FindAllReajuste(server.DB)
	if err != nil {
		formattedError := config.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't find in database, %v\n", formattedError))
		return
	}

	//	Retorna o Status 200 e o JSON da struct buscada
	responses.JSON(w, http.StatusOK, allReajuste)
}

/*  =========================
	FUNCAO UPDATE REAJUSTE
=========================  */

func (server *Server) UpdateReajuste(w http.ResponseWriter, r *http.Request) {

	//	Autorizacao de Modulo
	if err := config.AuthMod(w, r, 14003); err != nil {
		responses.ERROR(w, http.StatusUnauthorized, fmt.Errorf("[FATAL] Unauthorized"))
		return
	}

	//	Vars retorna as variaveis de rota
	vars := mux.Vars(r)

	//	anoRef armazena a chave primaria da tabela reajuste
	anoRef, err := strconv.ParseUint(vars["ano_ref"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, fmt.Errorf("[FATAL] It couldn't parse the variable, %v\n", err))
		return
	}

	//	codLote armazena a chave primaria da tabela reajuste
	codLote, err := strconv.ParseUint(vars["cod_lote"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, fmt.Errorf("[FATAL] It couldn't parse the variable, %v\n", err))
		return
	}

	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, fmt.Errorf("[FATAL] it couldn't read the 'body', %v\n", err))
	}

	//	Extrai o cod_usuario do body
	tokenID, err := auth.ExtractTokenID(r)
	if err != nil {
		responses.ERROR(w, http.StatusUnauthorized, errors.New("Unauthorized"))
		return
	}

	reajuste := models.Reajuste{}
	logReajuste := models.Log{}

	if err = json.Unmarshal(body, &reajuste); err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, fmt.Errorf("[FATAL] ERROR : 422, %v\n", err))
		return
	}

	if err = validation.Validator.Struct(reajuste); err != nil {
		log.Printf("[WARN] invalid information, because, %v\n", fmt.Errorf("[FATAL] validation error!, %v\n", err))
		w.WriteHeader(http.StatusPreconditionFailed)
		return
	}

	//	Parametros de entrada(nome_server, chave_primaria, chave_primaria, nome_tabela, operacao, id_usuario)
	err = logReajuste.LogReajuste(server.DB, uint32(anoRef), uint32(codLote), "reajuste", "u", tokenID)
	if err != nil {
		formattedError := config.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't save log in database, %v\n", formattedError))
		return
	}

	//	updateReajuste recebe o novo reajuste, a que foi alterada
	updateReajuste, err := reajuste.UpdateReajuste(server.DB, uint32(anoRef), uint32(codLote))
	if err != nil {
		formattedError := config.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't update in database, %v\n", formattedError))
		return
	}

	//	Retorna o Status 200 e o JSON da struct alterada
	responses.JSON(w, http.StatusOK, updateReajuste)
}

/*  =========================
	FUNCAO DELETAR REAJUSTE
=========================  */

func (server *Server) DeleteReajuste(w http.ResponseWriter, r *http.Request) {

	//	Autorizacao de Modulo
	if err := config.AuthMod(w, r, 14003); err != nil {
		responses.ERROR(w, http.StatusUnauthorized, fmt.Errorf("[FATAL] Unauthorized"))
		return
	}

	//	Vars retorna as variaveis de rota
	vars := mux.Vars(r)

	//	Extrai o cod_usuario do body
	tokenID, err := auth.ExtractTokenID(r)
	if err != nil {
		responses.ERROR(w, http.StatusUnauthorized, errors.New("Unauthorized"))
		return
	}

	reajuste := models.Reajuste{}
	logReajuste := models.Log{}

	//	anoRef armazena a chave primaria da tabela reajuste
	anoRef, err := strconv.ParseUint(vars["ano_ref"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, fmt.Errorf("[FATAL] It couldn't parse the variable, %v\n", err))
		return
	}

	//	codLote armazena a chave primaria da tabela reajuste
	codLote, err := strconv.ParseUint(vars["cod_lote"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, fmt.Errorf("[FATAL] It couldn't parse the variable, %v\n", err))
		return
	}

	//	Parametros de entrada(nome_server, chave_primaria, chave_primaria, nome_tabela, operacao, id_usuario)
	err = logReajuste.LogReajuste(server.DB, uint32(anoRef), uint32(codLote), "reajuste", "d", tokenID)
	if err != nil {
		formattedError := config.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't save log in database, %v\n", formattedError))
		return
	}

	err = reajuste.DeleteReajuste(server.DB, uint32(anoRef), uint32(codLote))
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}
	w.Header().Set("Entity", fmt.Sprintf("%d, %d", anoRef, codLote))

	//	Retorna o Status 204, indicando que a informacao foi deletada
	responses.JSON(w, http.StatusNoContent, "")
}
