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
	FUNCAO ADICIONAR CONTATO
=========================  */

func (server *Server) CreateContato(w http.ResponseWriter, r *http.Request) {

	//	Autorizacao de Modulo
	if config.AuthMod(w, r, 12001) != nil && config.AuthMod(w, r, 13081) != nil {
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

	contato := models.Contato{}
	logContato := models.Log{}

	//	Unmarshal analisa o JSON recebido e armazena na struct contato referenciada (&struct)
	err = json.Unmarshal(body, &contato)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, fmt.Errorf("[FATAL] ERROR: 422, %v\n", err))
		return
	}

	//	Validacao de estrutura
	err = validation.Validator.Struct(contato)
	if err != nil {
		log.Printf("[WARN] invalid information, because, %v\n", fmt.Errorf("[FATAL] validation error!, %v\n", err))
		w.WriteHeader(http.StatusPreconditionFailed)
		return
	}

	//	SaveContato eh o metodo que faz a conexao com banco de dados e salva os dados recebidos
	contatoCreated, err := contato.SaveContato(server.DB)
	if err != nil {
		formattedError := config.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't save in database, %v\n", formattedError))
		return
	}

	//	Parametros de entrada(nome_server, chave_primaria, nome_tabela, operacao, id_usuario)
	err = logContato.LogContato(server.DB, contatoCreated.CodContato, "contato", "i", tokenID)
	if err != nil {
		formattedError := config.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't save log in database, %v\n", formattedError))
		return
	}

	w.Header().Set("Location", fmt.Sprintf("%s%s/%d", r.Host, r.RequestURI, contatoCreated.CodContato))

	//	Ao final retorna o Status 201 e o JSON da struct que foi criada
	responses.JSON(w, http.StatusCreated, contatoCreated)
}

/*  =========================
	FUNCAO LISTAR TODOS CONTATOS
=========================  */

func (server *Server) GetAllContato(w http.ResponseWriter, r *http.Request) {

	//	Autorizacao de Modulo
	if config.AuthMod(w, r, 12002) != nil && config.AuthMod(w, r, 13082) != nil {
		responses.ERROR(w, http.StatusUnauthorized, fmt.Errorf("[FATAL] Unauthorized"))
		return
	}

	contato := models.Contato{}

	//	allContato armazena os dados buscados no banco de dados
	allContato, err := contato.FindAllContato(server.DB)
	if err != nil {
		formattedError := config.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't find in database, %v\n", formattedError))
		return
	}

	//	Retorna o Status 200 e o JSON da struct buscada
	responses.JSON(w, http.StatusOK, allContato)
}

/*  =========================
	FUNCAO EDITAR CONTATO
=========================  */

func (server *Server) UpdateContato(w http.ResponseWriter, r *http.Request) {

	//	Autorizacao de Modulo
	if config.AuthMod(w, r, 12003) != nil && config.AuthMod(w, r, 13083) != nil {
		responses.ERROR(w, http.StatusUnauthorized, fmt.Errorf("[FATAL] Unauthorized"))
		return
	}

	//	Vars retorna as variaveis de rota
	vars := mux.Vars(r)

	//	codContato armazena a chave primaria da tabela contato
	codContato, err := strconv.ParseUint(vars["cod_contato"], 10, 64)
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

	contato := models.Contato{}
	logContato := models.Log{}

	err = json.Unmarshal(body, &contato)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, fmt.Errorf("[FATAL] ERROR: 422, %v\n", err))
		return
	}

	if err = validation.Validator.Struct(contato); err != nil {
		log.Printf("[WARN] invalid information, because, %v\n", fmt.Errorf("[FATAL] validation error!, %v\n", err))
		w.WriteHeader(http.StatusPreconditionFailed)
		return
	}

	//	Parametros de entrada(nome_server, chave_primaria, nome_tabela, operacao, id_usuario)
	err = logContato.LogContato(server.DB, uint32(codContato), "contato", "u", tokenID)
	if err != nil {
		formattedError := config.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't save log in database, %v\n", formattedError))
		return
	}

	//	updateContato recebe a nova contato, a que foi alterada
	updateContato, err := contato.UpdateContato(server.DB, uint32(codContato))
	if err != nil {
		formattedError := config.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't update in database , %v\n", formattedError))
		return
	}

	//	Retorna o Status 200 e o JSON da struct alterada
	responses.JSON(w, http.StatusOK, updateContato)
}

/*  =========================
	FUNCAO DELETAR CONTATO
=========================  */

func (server *Server) DeleteContato(w http.ResponseWriter, r *http.Request) {

	//	Autorizacao de Modulo
	if config.AuthMod(w, r, 12003) != nil && config.AuthMod(w, r, 13083) != nil {
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

	contato := models.Contato{}
	logContato := models.Log{}

	//	codContato armazena a chave primaria da tabela contato
	codContato, err := strconv.ParseUint(vars["cod_contato"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, fmt.Errorf("[FATAL] It couldn't parse the variable, %v\n", err))
		return
	}

	//	Parametros de entrada(nome_server, chave_primaria, nome_tabela, operacao, id_usuario)
	err = logContato.LogContato(server.DB, uint32(codContato), "contato", "d", tokenID)
	if err != nil {
		formattedError := config.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't save log in database, %v\n", formattedError))
		return
	}

	//	Para o caso da funcao 'delete' apenas o erro nos eh necessario
	err = contato.DeleteContato(server.DB, uint32(codContato))
	if err != nil {
		formattedError := config.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't delete in database , %v\n", formattedError))
		return
	}

	w.Header().Set("Entity", fmt.Sprintf("%d", codContato))

	//	Retorna o Status 204, indicando que a informacao foi deletada
	responses.JSON(w, http.StatusNoContent, "")
}
