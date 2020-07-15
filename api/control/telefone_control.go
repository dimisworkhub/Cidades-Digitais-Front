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
	FUNCAO ADICIONAR TELEFONE
=========================  */

func (server *Server) CreateTelefone(w http.ResponseWriter, r *http.Request) {

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

	telefone := models.Telefone{}
	logTelefone := models.Log{}

	//	Unmarshal analisa o JSON recebido e armazena na struct telefone referenciada (&struct)
	if err = json.Unmarshal(body, &telefone); err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, fmt.Errorf("[FATAL] ERROR: 422, %v\n", err))
		return
	}

	if err = validation.Validator.Struct(telefone); err != nil {
		log.Printf("[WARN] invalid information, because, %v\n", fmt.Errorf("[FATAL] validation error!, %v\n", err))
		w.WriteHeader(http.StatusPreconditionFailed)
		return
	}

	//	Parametros de entrada(nome_server, chave_primaria, nome_tabela, operacao, id_usuario)
	err = logTelefone.LogTelefone(server.DB, telefone.CodTelefone, "telefone", "i", tokenID)
	if err != nil {
		formattedError := config.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't save log in database, %v\n", formattedError))
		return
	}

	//	SaveTelefone eh o metodo que faz a conexao com banco de dados e salva os dados recebidos
	telefoneCreated, err := telefone.SaveTelefone(server.DB)
	if err != nil {
		formattedError := config.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't save in database, %v\n", formattedError))
		return
	}

	w.Header().Set("Location", fmt.Sprintf("%s%s/%d", r.Host, r.RequestURI, telefoneCreated.CodTelefone))

	//	Ao final retorna o Status 201 e o JSON da struct que foi criada
	responses.JSON(w, http.StatusCreated, telefoneCreated)
}

/*  =========================
	FUNCAO LISTAR TODOS TELEFONE
=========================  */

func (server *Server) GetAllTelefone(w http.ResponseWriter, r *http.Request) {

	//	Autorizacao de Modulo
	if config.AuthMod(w, r, 12002) != nil && config.AuthMod(w, r, 13082) != nil {
		responses.ERROR(w, http.StatusUnauthorized, fmt.Errorf("[FATAL] Unauthorized"))
		return
	}

	telefone := models.Telefone{}

	//	telefones armazena os dados buscados no banco de dados
	allTelefone, err := telefone.FindAllTelefone(server.DB)
	if err != nil {
		formattedError := config.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't find in database, %v\n", formattedError))
		return
	}

	//	Retorna o Status 200 e o JSON da struct buscada
	responses.JSON(w, http.StatusOK, allTelefone)
}

/*  =========================
	FUNCAO DELETAR TELEFONE
=========================  */

func (server *Server) DeleteTelefone(w http.ResponseWriter, r *http.Request) {

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

	telefone := models.Telefone{}
	logTelefone := models.Log{}

	//	codTelefone armazena a chave primaria da tabela telefone
	codTelefone, err := strconv.ParseUint(vars["cod_telefone"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, fmt.Errorf("[FATAL] It couldn't parse the variable, %v\n", err))
		return
	}

	//	Parametros de entrada(nome_server, chave_primaria, nome_tabela, operacao, id_usuario)
	err = logTelefone.LogTelefone(server.DB, uint32(codTelefone), "telefone", "d", tokenID)
	if err != nil {
		formattedError := config.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't save log in database, %v\n", formattedError))
		return
	}

	// 	Para o caso da funcao 'delete' apenas o erro nos eh necessario
	err = telefone.DeleteTelefone(server.DB, uint32(codTelefone))
	if err != nil {
		formattedError := config.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't delete in database , %v\n", formattedError))
		return
	}

	w.Header().Set("Entity", fmt.Sprintf("%d", codTelefone))

	//	Retorna o Status 204, indicando que a informacao foi deletada
	responses.JSON(w, http.StatusNoContent, "")
}
