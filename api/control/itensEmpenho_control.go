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
	FUNCAO LISTAR ITENS EMPENHO POR ID
=========================  */

func (server *Server) GetItensEmpenhoByID(w http.ResponseWriter, r *http.Request) {

	//	Autorizacao de Modulo
	if err := config.AuthMod(w, r, 15002); err != nil {
		responses.ERROR(w, http.StatusUnauthorized, fmt.Errorf("[FATAL] Unauthorized"))
		return
	}

	//	Vars retorna as variaveis de rota
	vars := mux.Vars(r)

	//	idEmpenho armazena a chave primaria da tabela itens_empenho
	idEmpenho, err := strconv.ParseUint(vars["id_empenho"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, fmt.Errorf("[FATAL] It couldn't parse the variable, %v\n", err))
		return
	}

	//	codItem armazena a chave primaria da tabela itens_empenho
	codItem, err := strconv.ParseUint(vars["cod_item"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, fmt.Errorf("[FATAL] It couldn't parse the variable, %v\n", err))
		return
	}

	//	codTipoItem armazena a chave primaria da tabela itens_empenho
	codTipoItem, err := strconv.ParseUint(vars["cod_tipo_item"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, fmt.Errorf("[FATAL] It couldn't parse the variable, %v\n", err))
		return
	}

	itensEmpenho := models.ItensEmpenho{}

	//	itensEmpenhoGotten recebe o dado buscado no banco de dados
	itensEmpenhoGotten, err := itensEmpenho.FindItensEmpenhoByID(server.DB, uint32(idEmpenho), uint32(codItem), uint32(codTipoItem))
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, fmt.Errorf("[FATAL] It couldn't find by ID, %v\n", err))
		return
	}

	//	Retorna o Status 200 e o JSON da struct buscada
	responses.JSON(w, http.StatusOK, itensEmpenhoGotten)
}

/*  =========================
	FUNCAO LISTAR TODOS ITENS EMPENHO
=========================  */

func (server *Server) GetAllItensEmpenho(w http.ResponseWriter, r *http.Request) {

	//	Autorizacao de Modulo
	if err := config.AuthMod(w, r, 15002); err != nil {
		responses.ERROR(w, http.StatusUnauthorized, fmt.Errorf("[FATAL] Unauthorized"))
		return
	}

	//	Vars retorna as variaveis de rota
	vars := mux.Vars(r)

	//	idEmpenho armazena a chave primaria da tabela itens_empenho
	idEmpenho, err := strconv.ParseUint(vars["id_empenho"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, fmt.Errorf("[FATAL] It couldn't parse the variable, %v\n", err))
		return
	}

	//	codPrevisaoEmpenho armazena a chave primaria da tabela itens_empenho
	codPrevisaoEmpenho, err := strconv.ParseUint(vars["cod_previsao_empenho"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, fmt.Errorf("[FATAL] It couldn't parse the variable, %v\n", err))
		return
	}

	itensEmpenho := models.ItensEmpenho{}

	//	allItensEmpenho armazena os dados buscados no banco de dados
	allItensEmpenho, err := itensEmpenho.FindAllItensEmpenho(server.DB, uint32(idEmpenho), uint32(codPrevisaoEmpenho))
	if err != nil {
		formattedError := config.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't find in database, %v\n", formattedError))
		return
	}

	//	Retorna o Status 200 e o JSON da struct buscada
	responses.JSON(w, http.StatusOK, allItensEmpenho)
}

/*  =========================
	FUNCAO EDITAR ITENS EMPENHO
=========================  */

func (server *Server) UpdateItensEmpenho(w http.ResponseWriter, r *http.Request) {

	//	Autorizacao de Modulo
	if err := config.AuthMod(w, r, 15003); err != nil {
		responses.ERROR(w, http.StatusUnauthorized, fmt.Errorf("[FATAL] Unauthorized"))
		return
	}

	//	Vars retorna as variaveis de rota
	vars := mux.Vars(r)

	//	idEmpenho armazena a chave primaria da tabela itens_empenho
	idEmpenho, err := strconv.ParseUint(vars["id_empenho"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, fmt.Errorf("[FATAL] It couldn't parse the variable, %v\n", err))
		return
	}

	//	codItem armazena a chave primaria da tabela itens_empenho
	codItem, err := strconv.ParseUint(vars["cod_item"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, fmt.Errorf("[FATAL] It couldn't parse the variable, %v\n", err))
		return
	}

	//	codTipoItem armazena a chave primaria da tabela itens_empenho
	codTipoItem, err := strconv.ParseUint(vars["cod_tipo_item"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, fmt.Errorf("[FATAL] It couldn't parse the variable, %v\n", err))
		return
	}

	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, fmt.Errorf("[FATAL] it couldn't read the 'body', %v\n", err))
		return
	}

	//	Extrai o cod_usuario do body
	tokenID, err := auth.ExtractTokenID(r)
	if err != nil {
		responses.ERROR(w, http.StatusUnauthorized, errors.New("Unauthorized"))
		return
	}

	itensEmpenho := models.ItensEmpenho{}
	logItensEmpenho := models.Log{}

	if err = json.Unmarshal(body, &itensEmpenho); err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, fmt.Errorf("[FATAL] ERROR: 422, %v\n", err))
		return
	}

	if err = validation.Validator.Struct(itensEmpenho); err != nil {
		log.Printf("[WARN] invalid information, because, %v\n", fmt.Errorf("[FATAL] validation error!, %v\n", err))
		w.WriteHeader(http.StatusPreconditionFailed)
		return
	}

	//	Parametros de entrada(nome_server, chave_primaria, chave_primaria, chave_primaria, nome_tabela, operacao, id_usuario)
	err = logItensEmpenho.LogItensEmpenho(server.DB, uint32(idEmpenho), uint32(codItem), uint32(codTipoItem), "itens_empenho", "u", tokenID)
	if err != nil {
		formattedError := config.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't save log in database, %v\n", formattedError))
		return
	}

	//	updateItensEmpenho recebe o novo item_empenho, a que foi alterada
	updateItensEmpenho, err := itensEmpenho.UpdateItensEmpenho(server.DB, uint32(idEmpenho), uint32(codItem), uint32(codTipoItem))
	if err != nil {
		formattedError := config.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't update in database , %v\n", formattedError))
		return
	}

	//	Retorna o Status 200 e o JSON da struct alterada
	responses.JSON(w, http.StatusOK, updateItensEmpenho)
}
