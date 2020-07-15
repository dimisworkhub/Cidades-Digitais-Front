package control

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"

	"CidadesDigitaisV2/api/auth"
	"CidadesDigitaisV2/api/config"
	"CidadesDigitaisV2/api/models"
	"CidadesDigitaisV2/api/responses"
	"CidadesDigitaisV2/api/validation"

	"github.com/gorilla/mux"
)

/*  =========================
	FUNCAO ADICIONAR ASSUNTO
=========================  */

func (server *Server) CreateAssunto(w http.ResponseWriter, r *http.Request) {

	//	Autorizacao de Modulo
	if err := config.AuthMod(w, r, 19001); err != nil {
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

	assunto := models.Assunto{}
	logAssunto := models.Log{}

	//	Unmarshal analisa o JSON recebido e armazena na struct assunto referenciada (&struct)
	if err = json.Unmarshal(body, &assunto); err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, fmt.Errorf("[FATAL] ERROR: 422, %v\n", err))
		return
	}

	//	Validacao de estrutura
	if err = validation.Validator.Struct(assunto); err != nil {
		log.Printf("[WARN] invalid information, because, %v\n", fmt.Errorf("[FATAL] validation error!, %v\n", err))
		w.WriteHeader(http.StatusPreconditionFailed)
		return
	}

	//	SaveAssunto eh o metodo que faz a conexao com banco de dados e salva os dados recebidos
	assuntoCreated, err := assunto.SaveAssunto(server.DB)
	if err != nil {
		formattedError := config.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't save in database, %v\n", formattedError))
		return
	}

	//	Parametros de entrada(nome_server, chave_primaria, nome_tabela, operacao, id_usuario)
	err = logAssunto.LogAssunto(server.DB, assuntoCreated.CodAssunto, "assunto", "i", tokenID)
	if err != nil {
		formattedError := config.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't save log in database, %v\n", formattedError))
		return
	}

	w.Header().Set("Location", fmt.Sprintf("%s%s/%d", r.Host, r.RequestURI, assuntoCreated.CodAssunto))

	//	Ao final retorna o Status 201 e o JSON da struct que foi criada
	responses.JSON(w, http.StatusCreated, assuntoCreated)
}

/*  =========================
	FUNCAO LISTAR ASSUNTO POR ID
=========================  */

func (server *Server) GetAssuntoByID(w http.ResponseWriter, r *http.Request) {

	//	Autorizacao de Modulo
	if err := config.AuthMod(w, r, 19002); err != nil {
		responses.ERROR(w, http.StatusUnauthorized, fmt.Errorf("[FATAL] Unauthorized"))
		return
	}

	//	Vars retorna as variaveis de rota
	vars := mux.Vars(r)

	//	codAssunto armazena a chave primaria da tabela assunto
	codAssunto, err := strconv.ParseUint(vars["cod_assunto"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, fmt.Errorf("[FATAL] It couldn't parse the variable, %v\n", err))
		return
	}

	assunto := models.Assunto{}

	//	assuntoGotten recebe o dado buscado no banco de dados
	assuntoGotten, err := assunto.FindAssuntoByID(server.DB, uint32(codAssunto))
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, fmt.Errorf("[FATAL] It couldn't find by ID, %v\n", err))
		return
	}

	//	Retorna o Status 200 e o JSON da struct buscada
	responses.JSON(w, http.StatusOK, assuntoGotten)
}

/*  =========================
	FUNCAO LISTAR TODOS ASSUNTO
=========================  */

func (server *Server) GetAllAssunto(w http.ResponseWriter, r *http.Request) {

	//	Autorizacao de Modulo
	if err := config.AuthMod(w, r, 19002); err != nil {
		responses.ERROR(w, http.StatusUnauthorized, fmt.Errorf("[FATAL] Unauthorized"))
		return
	}

	assunto := models.Assunto{}

	//	allAssunto armazena os dados buscados no banco de dados
	allAssunto, err := assunto.FindAllAssunto(server.DB)
	if err != nil {
		formattedError := config.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't find in database, %v\n", formattedError))
		return
	}

	//	Retorna o Status 200 e o JSON da struct buscada
	responses.JSON(w, http.StatusOK, allAssunto)
}

/*  =========================
	FUNCAO EDITAR ASSUNTO
=========================  */

func (server *Server) UpdateAssunto(w http.ResponseWriter, r *http.Request) {

	//	Autorizacao de Modulo
	if err := config.AuthMod(w, r, 19003); err != nil {
		responses.ERROR(w, http.StatusUnauthorized, fmt.Errorf("[FATAL] Unauthorized"))
		return
	}

	//	Vars retorna as variaveis de rota
	vars := mux.Vars(r)

	//	codAssunto armazena a chave primaria da tabela assunto
	codAssunto, err := strconv.ParseUint(vars["cod_assunto"], 10, 64)
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

	assunto := models.Assunto{}
	logAssunto := models.Log{}

	if err = json.Unmarshal(body, &assunto); err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, fmt.Errorf("[FATAL] ERROR: 422, %v\n", err))
		return
	}

	if err = validation.Validator.Struct(assunto); err != nil {
		log.Printf("[WARN] invalid information, because, %v\n", fmt.Errorf("[FATAL] validation error!, %v\n", err))
		w.WriteHeader(http.StatusPreconditionFailed)
		return
	}

	//	Parametros de entrada(nome_server, chave_primaria, nome_tabela, operacao, id_usuario)
	err = logAssunto.LogAssunto(server.DB, uint32(codAssunto), "assunto", "u", tokenID)
	if err != nil {
		formattedError := config.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't save log in database, %v\n", formattedError))
		return
	}

	//	updateAssunto recebe o novo assunto, a que foi alterada
	updateAssunto, err := assunto.UpdateAssunto(server.DB, uint32(codAssunto))
	if err != nil {
		formattedError := config.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't update in database , %v\n", formattedError))
		return
	}

	//	Retorna o Status 200 e o JSON da struct alterada
	responses.JSON(w, http.StatusOK, updateAssunto)
}

/*  =========================
	FUNCAO DELETAR ASSUNTO
=========================  */

func (server *Server) DeleteAssunto(w http.ResponseWriter, r *http.Request) {

	//	Autorizacao de Modulo, apenas quem tem permicao de edit pode deletar
	if err := config.AuthMod(w, r, 19003); err != nil {
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

	assunto := models.Assunto{}
	logAssunto := models.Log{}

	//	codAssunto armazena a chave primaria da tabela assunto
	codAssunto, err := strconv.ParseUint(vars["cod_assunto"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, fmt.Errorf("[FATAL] It couldn't parse the variable, %v\n", err))
		return
	}

	//	Parametros de entrada(nome_server, chave_primaria, nome_tabela, operacao, id_usuario)
	err = logAssunto.LogAssunto(server.DB, uint32(codAssunto), "assunto", "d", tokenID)
	if err != nil {
		formattedError := config.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't save log in database, %v\n", formattedError))
		return
	}

	// 	Para o caso da funcao 'delete' apenas o erro nos eh necessario
	if err = assunto.DeleteAssunto(server.DB, uint32(codAssunto)); err != nil {
		formattedError := config.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't delete in database , %v\n", formattedError))
		return
	}

	w.Header().Set("Entity", fmt.Sprintf("%d", codAssunto))

	//	Retorna o Status 204, indicando que a informacao foi deletada
	responses.JSON(w, http.StatusNoContent, "")
}
