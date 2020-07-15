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
	FUNCAO ADICIONAR CLASSE EMPENHO
=========================  */

func (server *Server) CreateClasseEmpenho(w http.ResponseWriter, r *http.Request) {

	//	Autorizacao de Modulo
	if err := config.AuthMod(w, r, 21001); err != nil {
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

	//	Estrutura models.ClasseEmpenho{} "renomeada"
	classeEmpenho := models.ClasseEmpenho{}
	logClasseEmpenho := models.Log{}

	//	Unmarshal analisa o JSON recebido e armazena na struct classe empenho referenciada (&struct)
	if err = json.Unmarshal(body, &classeEmpenho); err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, fmt.Errorf("[FATAL] ERROR: 422, %v\n", err))
		return
	}

	//	Validacao de estrutura
	if err = validation.Validator.Struct(classeEmpenho); err != nil {
		log.Printf("[WARN] invalid information, because, %v\n", fmt.Errorf("[FATAL] validation error!, %v\n", err))
		w.WriteHeader(http.StatusPreconditionFailed)
		return
	}

	//	SaveClasseEmpenho eh o metodo que faz a conexao com banco de dados e salva os dados recebidos
	classeEmpenhoCreated, err := classeEmpenho.SaveClasseEmpenho(server.DB)
	if err != nil {
		formattedError := config.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't save in database, %v\n", formattedError))
		return
	}

	//	Parametros de entrada(nome_server, chave_primaria, nome_tabela, operacao, id_usuario)
	err = logClasseEmpenho.LogClasseEmpenho(server.DB, classeEmpenhoCreated.CodClasseEmpenho, "classe_empenho", "i", tokenID)
	if err != nil {
		formattedError := config.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't save log in database, %v\n", formattedError))
		return
	}

	w.Header().Set("Location", fmt.Sprintf("%s%s/%d", r.Host, r.RequestURI, classeEmpenhoCreated.CodClasseEmpenho))

	//	Ao final retorna o Status 201 e o JSON da struct que foi criada
	responses.JSON(w, http.StatusCreated, classeEmpenhoCreated)
}

/*  =========================
	FUNCAO LISTAR CLASSE EMPENHO POR ID
=========================  */

func (server *Server) GetClasseEmpenhoByID(w http.ResponseWriter, r *http.Request) {

	//	Autorizacao de Modulo
	if err := config.AuthMod(w, r, 21002); err != nil {
		responses.ERROR(w, http.StatusUnauthorized, fmt.Errorf("[FATAL] Unauthorized"))
		return
	}

	//	Vars retorna as variaveis de rota
	vars := mux.Vars(r)

	//	codClasseEmpenho armazena a chave primaria da tabela classe empenho
	codClasseEmpenho, err := strconv.ParseUint(vars["cod_classe_empenho"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, fmt.Errorf("[FATAL] It couldn't parse the variable, %v\n", err))
		return
	}

	classeEmpenho := models.ClasseEmpenho{}

	//	classeEmpenhoGotten recebe o dado buscado no banco de dados
	classeEmpenhoGotten, err := classeEmpenho.FindClasseEmpenhoByID(server.DB, uint32(codClasseEmpenho))
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, fmt.Errorf("[FATAL] It couldn't find by ID, %v\n", err))
		return
	}

	//	Retorna o Status 200 e o JSON da struct buscada
	responses.JSON(w, http.StatusOK, classeEmpenhoGotten)
}

/*  =========================
	FUNCAO LISTAR TODAS CLASSE EMPENHO
=========================  */

func (server *Server) GetAllClasseEmpenho(w http.ResponseWriter, r *http.Request) {

	//	Autorizacao de Modulo
	if err := config.AuthMod(w, r, 21002); err != nil {
		responses.ERROR(w, http.StatusUnauthorized, fmt.Errorf("[FATAL] Unauthorized"))
		return
	}

	classeEmpenho := models.ClasseEmpenho{}

	//	allClasseEmpenho armazena os dados buscados no banco de dados
	allClasseEmpenho, err := classeEmpenho.FindAllClasseEmpenho(server.DB)
	if err != nil {
		formattedError := config.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't find in database, %v\n", formattedError))
		return
	}

	//	Retorna o Status 200 e o JSON da struct buscada
	responses.JSON(w, http.StatusOK, allClasseEmpenho)
}

/*  =========================
	FUNCAO EDITAR CLASSE EMPENHO
=========================  */

func (server *Server) UpdateClasseEmpenho(w http.ResponseWriter, r *http.Request) {

	//	Autorizacao de Modulo
	if err := config.AuthMod(w, r, 21003); err != nil {
		responses.ERROR(w, http.StatusUnauthorized, fmt.Errorf("[FATAL] Unauthorized"))
		return
	}

	//	Vars retorna as variaveis de rota
	vars := mux.Vars(r)

	//	codClasseEmpenho armazena a chave primaria da tabela classe empenho
	codClasseEmpenho, err := strconv.ParseUint(vars["cod_classe_empenho"], 10, 64)
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

	classeEmpenho := models.ClasseEmpenho{}
	logClasseEmpenho := models.Log{}

	if err = json.Unmarshal(body, &classeEmpenho); err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, fmt.Errorf("[FATAL] ERROR: 422, %v\n", err))
		return
	}

	if err = validation.Validator.Struct(classeEmpenho); err != nil {
		log.Printf("[WARN] invalid information, because, %v\n", fmt.Errorf("[FATAL] validation error!, %v\n", err))
		w.WriteHeader(http.StatusPreconditionFailed)
		return
	}

	//	Parametros de entrada(nome_server, chave_primaria, nome_tabela, operacao, id_usuario)
	err = logClasseEmpenho.LogClasseEmpenho(server.DB, uint32(codClasseEmpenho), "classe_empenho", "u", tokenID)
	if err != nil {
		formattedError := config.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't save log in database, %v\n", formattedError))
		return
	}

	//	updateClasseEmpenho recebe a nova classe empenho, a que foi alterada
	updateClasseEmpenho, err := classeEmpenho.UpdateClasseEmpenho(server.DB, uint32(codClasseEmpenho))
	if err != nil {
		formattedError := config.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't update in database , %v\n", formattedError))
		return
	}

	//	Retorna o Status 200 e o JSON da struct alterada
	responses.JSON(w, http.StatusOK, updateClasseEmpenho)
}

/*  =========================
	FUNCAO DELETAR CLASSE EMPENHO
=========================  */

func (server *Server) DeleteClasseEmpenho(w http.ResponseWriter, r *http.Request) {

	//	Autorizacao de Modulo, apenas quem tem permicao de edit pode deletar
	if err := config.AuthMod(w, r, 21003); err != nil {
		responses.ERROR(w, http.StatusUnauthorized, fmt.Errorf("[FATAL] Unauthorized"))
		return
	}

	// Vars retorna as variaveis de rota
	vars := mux.Vars(r)

	classeEmpenho := models.ClasseEmpenho{}
	logClasseEmpenho := models.Log{}

	//	Extrai o cod_usuario do body
	tokenID, err := auth.ExtractTokenID(r)
	if err != nil {
		responses.ERROR(w, http.StatusUnauthorized, errors.New("Unauthorized"))
		return
	}

	//	codClasseEmpenho armazena a chave primaria da tabela classe empenho
	codClasseEmpenho, err := strconv.ParseUint(vars["cod_classe_empenho"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, fmt.Errorf("[FATAL] It couldn't parse the variable, %v\n", err))
		return
	}

	//	Parametros de entrada(nome_server, chave_primaria, nome_tabela, operacao, id_usuario)
	err = logClasseEmpenho.LogClasseEmpenho(server.DB, uint32(codClasseEmpenho), "classe_empenho", "d", tokenID)
	if err != nil {
		formattedError := config.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't save log in database, %v\n", formattedError))
		return
	}

	// 	Para o caso da funcao 'delete' apenas o erro nos eh necessario
	err = classeEmpenho.DeleteClasseEmpenho(server.DB, uint32(codClasseEmpenho))
	if err != nil {
		formattedError := config.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't delete in database , %v\n", formattedError))
		return
	}

	w.Header().Set("Entity", fmt.Sprintf("%d", codClasseEmpenho))

	//	Retorna o Status 204, indicando que a informacao foi deletada
	responses.JSON(w, http.StatusNoContent, "")
}
