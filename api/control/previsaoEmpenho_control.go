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
	FUNCAO ADICIONAR PREVISAO EMPENHO
=========================  */

func (server *Server) CreatePrevisaoEmpenho(w http.ResponseWriter, r *http.Request) {

	//	Autorizacao de Modulo
	if err := config.AuthMod(w, r, 18001); err != nil {
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

	previsaoEmpenho := models.PrevisaoEmpenho{}
	logPrevisaoEmpenho := models.Log{}

	//	Unmarshal analisa o JSON recebido e armazena na struct previsaoEmpenho referenciada (&struct)
	if err = json.Unmarshal(body, &previsaoEmpenho); err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, fmt.Errorf("[FATAL] ERROR: 422, %v\n", err))
		return
	}

	//	Validacao de estrutura
	if err = validation.Validator.Struct(previsaoEmpenho); err != nil {
		log.Printf("[WARN] invalid information, because, %v\n", fmt.Errorf("[FATAL] validation error!, %v\n", err))
		w.WriteHeader(http.StatusPreconditionFailed)
		return
	}

	//	Parametros de entrada(nome_server, chave_primaria, nome_tabela, operacao, id_usuario)
	err = logPrevisaoEmpenho.LogPrevisaoEmpenho(server.DB, previsaoEmpenho.CodPrevisaoEmpenho, "previsao_empenho", "i", tokenID)
	if err != nil {
		formattedError := config.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't save log in database, %v\n", formattedError))
		return
	}

	//	SavePrevisaoEmpenho eh o metodo que faz a conexao com banco de dados e salva os dados recebidos
	previsaoEmpenhoCreated, err := previsaoEmpenho.SavePrevisaoEmpenho(server.DB)
	if err != nil {
		formattedError := config.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't save in database, %v\n", formattedError))
		return
	}

	//	O INSERT em PrevisaoEmpenho dispara uma trigger em ItensPrevisaoEmpenho, a funcao abaixo atualiza o campo 'valor' dos Itens criados
	ch := make(chan int)
	go func() {
		previsaoEmpenhoCreated.CalculoValorItensPrevisaoEmpenho(server.DB)
		<-ch
	}()

	w.Header().Set("Location", fmt.Sprintf("%s%s/%d", r.Host, r.RequestURI, previsaoEmpenhoCreated.CodPrevisaoEmpenho))

	//	Ao final retorna o Status 201 e o JSON da struct que foi criada
	responses.JSON(w, http.StatusCreated, previsaoEmpenhoCreated)
}

/*  =========================
	FUNCAO LISTAR PREVISAO EMPENHO POR ID
=========================  */

func (server *Server) GetPrevisaoEmpenhoByID(w http.ResponseWriter, r *http.Request) {

	//	Autorizacao de Modulo
	if err := config.AuthMod(w, r, 18002); err != nil {
		responses.ERROR(w, http.StatusUnauthorized, fmt.Errorf("[FATAL] Unauthorized"))
		return
	}

	//	Vars retorna as variaveis de rota
	vars := mux.Vars(r)

	//	codPrevisaoEmpenho armazeza a chave primaria da tabela previsao_empenho
	codPrevisaoEmpenho, err := strconv.ParseUint(vars["cod_previsao_empenho"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, fmt.Errorf("[FATAL] It couldn't parse the variable, %v\n", err))
		return
	}

	previsaoEmpenho := models.PrevisaoEmpenho{}

	//	previsaoEmpenhoGotten recebe o dado buscado no banco de dados
	previsaoEmpenhoGotten, err := previsaoEmpenho.FindPrevisaoEmpenhoByID(server.DB, uint32(codPrevisaoEmpenho))
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, fmt.Errorf("[FATAL] It couldn't find by ID, %v\n", err))
		return
	}

	//	Retorna o Status 200 e o JSON da struct buscada
	responses.JSON(w, http.StatusOK, previsaoEmpenhoGotten)
}

/*  =========================
	FUNCAO LISTAR TODAS PREVISAO EMPENHO
=========================  */

func (server *Server) GetAllPrevisaoEmpenho(w http.ResponseWriter, r *http.Request) {

	//	Autorizacao de Modulo
	if err := config.AuthMod(w, r, 18002); err != nil {
		responses.ERROR(w, http.StatusUnauthorized, fmt.Errorf("[FATAL] Unauthorized"))
		return
	}

	previsaoEmpenho := models.PrevisaoEmpenho{}

	//	previsaoEmpenho recebe os dados buscados no banco de dados
	allPrevisaoEmpenho, err := previsaoEmpenho.FindAllPrevisaoEmpenho(server.DB)
	if err != nil {
		formattedError := config.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't find in database, %v\n", formattedError))
		return
	}

	//	Retorna o Status 200 e o JSON da struct buscada
	responses.JSON(w, http.StatusOK, allPrevisaoEmpenho)
}

/*  =========================
	FUNCAO EDITAR PREVISAO EMPENHO
=========================  */

func (server *Server) UpdatePrevisaoEmpenho(w http.ResponseWriter, r *http.Request) {

	//	Autorizacao de Modulo
	if err := config.AuthMod(w, r, 18003); err != nil {
		responses.ERROR(w, http.StatusUnauthorized, fmt.Errorf("[FATAL] Unauthorized"))
		return
	}

	//	Vars retorna as variaveis de rota
	vars := mux.Vars(r)

	//	codPrevisaoEmpenho armazena a chave primaria da tabela previsao empenho
	codPrevisaoEmpenho, err := strconv.ParseUint(vars["cod_previsao_empenho"], 10, 64)
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

	previsaoEmpenho := models.PrevisaoEmpenho{}
	logPrevisaoEmpenho := models.Log{}

	if err = json.Unmarshal(body, &previsaoEmpenho); err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, fmt.Errorf("[FATAL] ERROR: 422, %v\n", err))
		return
	}

	if err = validation.Validator.Struct(previsaoEmpenho); err != nil {
		log.Printf("[WARN] invalid information, because, %v\n", fmt.Errorf("[FATAL] validation error!, %v\n", err))
		w.WriteHeader(http.StatusPreconditionFailed)
		return
	}

	//	Parametros de entrada(nome_server, chave_primaria, nome_tabela, operacao, id_usuario)
	err = logPrevisaoEmpenho.LogPrevisaoEmpenho(server.DB, uint32(codPrevisaoEmpenho), "previsao_empenho", "u", tokenID)
	if err != nil {
		formattedError := config.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't save log in database, %v", formattedError))
		return
	}

	// updatePrevisaEmpenho recebe a nova previsao_empenho, a que foi alterada
	updatePrevisaoEmpenho, err := previsaoEmpenho.UpdatePrevisaoEmpenho(server.DB, uint32(codPrevisaoEmpenho))
	if err != nil {
		formattedError := config.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't update in database , %v\n", formattedError))
		return
	}

	//	Retorna o Status 200 e o JSON da struct alterada
	responses.JSON(w, http.StatusOK, updatePrevisaoEmpenho)
}

/*  =========================
	FUNCAO DELETAR PREVISAO EMPENHO
=========================

func (server *Server) DeletePrevisaoEmpenho(w http.ResponseWriter, r *http.Request) {

	//	Autorizacao de Modulo, apenas quem tem permicao de edit pode deletar
	err := config.AuthMod(w, r, 18003)
	if err != nil {
		responses.ERROR(w, http.StatusUnauthorized, fmt.Errorf("[FATAL] Unauthorized"))
		return
	}

	//	Vars retorna as variaveis de rota
	vars := mux.Vars(r)

	previsaoEmpenho := models.PrevisaoEmpenho{}

	//	codPrevisaoEmpenho armazena a chame primaria da tabela previsao empenho
	codPrevisaEmpenho, err := strconv.ParseUint(vars["cod_previsao_empenho"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, fmt.Errorf("[FATAL] It couldn't parse the variable, %v\n", err))
		return
	}

	_, err = previsaoEmpenho.DeletePrevisaoEmpenho(server.DB, codPrevisaEmpenho)
	if err != nil {
		formattedError := config.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't delete in database, %v\n", formattedError))
		return
	}

	w.Header().Set("Entity", fmt.Sprintf("%d", codPrevisaEmpenho))

	//	Retorna o Status 204, indicando que a informacao foi deletada
	responses.JSON(w, http.StatusNoContent, "")
}

*/
