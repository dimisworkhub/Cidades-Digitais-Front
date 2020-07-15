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
	FUNCAO ADICIONAR OTB FATURA
=========================  */

func (server *Server) CreateFaturaOTB(w http.ResponseWriter, r *http.Request) {

	//	Autorizacao de Modulo
	err := config.AuthMod(w, r, 16011)
	if err != nil {
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

	faturaOTB := models.FaturaOTB{}
	logFaturaOTB := models.Log{}

	//	Unmarshal analisa o JSON recebido e armazena na struct faturaOTB referenciada (&struct)
	err = json.Unmarshal(body, &faturaOTB)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, fmt.Errorf("[FATAL] ERROR: 422, %v\n", err))
		return
	}

	//	Validacao de struct
	err = validation.Validator.Struct(faturaOTB)
	if err != nil {
		log.Printf("[WARN] invalid information, because, %v\n", fmt.Errorf("[FATAL] validation error!, %v\n", err))
		w.WriteHeader(http.StatusPreconditionFailed)
		return
	}

	//	SaveFaturaOTB eh o metodo que faz a conexao com banco de dados e salva os dados recebidos
	faturaOTBCreated, err := faturaOTB.SaveFaturaOTB(server.DB)
	if err != nil {
		formattedError := config.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't save in database, %v\n", formattedError))
		return
	}

	//	Parametros de entrada(nome_server, chave_primaria, chave_primaria, chave_primaria, nome_tabela, operacao, id_usuario)
	err = logFaturaOTB.LogFaturaOTB(server.DB, faturaOTBCreated.CodOtb, faturaOTBCreated.NumNF, faturaOTBCreated.CodIbge, "fatura_otb", "i", tokenID)
	if err != nil {
		formattedError := config.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't save log in database, %v\n", formattedError))
		return
	}

	w.Header().Set("Location", fmt.Sprintf("%s%s/%d", r.Host, r.RequestURI, faturaOTBCreated.CodOtb))

	//	Ao final retorna o Status 201 e o JSON da struct que foi criada
	responses.JSON(w, http.StatusCreated, faturaOTBCreated)
}

/*  =========================
	FUNCAO LISTAR FATURA OTB POR ID
=========================  */

func (server *Server) GetFaturaOTBByID(w http.ResponseWriter, r *http.Request) {

	//	Autorizacao de Modulo pagamento_fatura
	verifyOtbFatura := config.AuthMod(w, r, 16012)

	//	Autorizacao de Modulo fatura_pagamento
	verifyFaturaOtb := config.AuthMod(w, r, 17012)

	if verifyFaturaOtb != nil || verifyOtbFatura != nil {
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

	//	numNF armazena a chave primaria da tabela entidade
	numNF, err := strconv.ParseUint(vars["num_nf"], 10, 64)
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

	faturaOTB := models.FaturaOTB{}

	//	allFaturaOTB armazena os dados buscados no banco de dados
	allFaturaOTB, err := faturaOTB.FindFaturaOTB(server.DB, uint32(codOtb), uint32(numNF), uint32(codIbge))
	if err != nil {
		formattedError := config.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't find in database, %v\n", formattedError))
		return
	}

	//	Retorna o Status 200 e o JSON da struct buscada
	responses.JSON(w, http.StatusOK, allFaturaOTB)
}
