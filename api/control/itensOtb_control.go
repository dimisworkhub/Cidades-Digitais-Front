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
	FUNCAO LISTAR TODAS ITENS OTB
=========================  */

func (server *Server) GetItensOTB(w http.ResponseWriter, r *http.Request) {

	//	Autorizacao de Modulo
	err := config.AuthMod(w, r, 16022)
	if err != nil {
		responses.ERROR(w, http.StatusUnauthorized, fmt.Errorf("[FATAL] Unauthorized"))
		return
	}

	itensOTB := models.ItensOTB{}

	//	allItensOTB armazena os dados buscados no banco de dados
	allItensOTB, err := itensOTB.FindAllItensOTB(server.DB)
	if err != nil {
		formattedError := config.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't find in database, %v\n", formattedError))
		return
	}

	//	Retorna o Status 200 e o JSON da struct buscada
	responses.JSON(w, http.StatusOK, allItensOTB)
}

/*  =========================
	FUNCAO EDITAR ITENS OTB
=========================  */

func (server *Server) UpdateItensOTB(w http.ResponseWriter, r *http.Request) {

	//	Autorizacao de Modulo
	if err := config.AuthMod(w, r, 16023); err != nil {
		responses.ERROR(w, http.StatusUnauthorized, fmt.Errorf("[FATAL] Unauthorized"))
		return
	}

	//	Vars retorna as variaveis de rota
	vars := mux.Vars(r)

	//	codOtb armazena a chave primaria da tabela entidade
	codOtb, err := strconv.ParseUint(vars["cod_otb"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, fmt.Errorf("[FATAL] It couldn't parse the variable, %v\n", err))
		return
	}

	//	numNf armazena a chave primaria da tabela entidade
	numNf, err := strconv.ParseUint(vars["num_nf"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, fmt.Errorf("[FATAL] It couldn't parse the variable, %v\n", err))
		return
	}

	//	codIbge armazena a chave primaria da tabela entidade
	codIbge, err := strconv.ParseUint(vars["cod_ibge"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, fmt.Errorf("[FATAL] It couldn't parse the variable, %v\n", err))
		return
	}

	//	idEmpenho armazena a chave primaria da tabela entidade
	idEmpenho, err := strconv.ParseUint(vars["id_empenho"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, fmt.Errorf("[FATAL] It couldn't parse the variable, %v\n", err))
		return
	}

	//	codItem armazena a chave primaria da tabela entidade
	codItem, err := strconv.ParseUint(vars["cod_item"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, fmt.Errorf("[FATAL] It couldn't parse the variable, %v\n", err))
		return
	}

	//	codTipoItem armazena a chave primaria da tabela entidade
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

	itensOTB := models.ItensOTB{}
	logItensOTB := models.Log{}

	err = json.Unmarshal(body, &itensOTB)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, fmt.Errorf("[FATAL] ERROR: 422, %v\n", err))
		return
	}

	//	Validacao de estrutura
	err = validation.Validator.Struct(itensOTB)
	if err != nil {
		log.Printf("[WARN] invalid information, because, %v\n", fmt.Errorf("[FATAL] validation error!, %v\n", err))
		w.WriteHeader(http.StatusPreconditionFailed)
		return
	}

	//	Parametros de entrada(nome_server, chave_primaria, chave_primaria, chave_primaria, chave_primaria, chave_primaria, chave_primaria, nome_tabela, operacao, id_usuario)
	err = logItensOTB.LogItensOTB(server.DB, uint32(codOtb), uint32(numNf), uint32(codIbge), uint32(idEmpenho), uint32(codItem), uint32(codTipoItem), "itens_otb", "u", tokenID)
	if err != nil {
		formattedError := config.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't save log in database, %v\n", formattedError))
		return
	}

	//	updateItensOTB recebe a nova itensOTB, a que foi alterada
	updateItensOTB, err := itensOTB.UpdateItensOTB(server.DB, uint32(codOtb), uint32(numNf), uint32(codIbge), uint32(idEmpenho), uint32(codItem), uint32(codTipoItem))
	if err != nil {
		formattedError := config.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't update in database , %v\n", formattedError))
		return
	}

	//	Retorna o Status 200 e o JSON da struct alterada
	responses.JSON(w, http.StatusOK, updateItensOTB)
}
