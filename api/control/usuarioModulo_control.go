package control

import (
	"CidadesDigitaisV2/api/auth"
	"CidadesDigitaisV2/api/config"
	"CidadesDigitaisV2/api/models"
	"CidadesDigitaisV2/api/responses"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
)

/*  =========================
	FUNCAO ADICIONAR USUARIO MODULO
=========================  */

func (server *Server) CreateUsuarioModulo(w http.ResponseWriter, r *http.Request) {

	//	Autorizacao de Modulo
	if err := config.AuthMod(w, r, 11001); err != nil {
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

	logUsuarioModulo := models.Log{}

	//	Declara usarioModulo como um Array da struct UsuarioModulo
	var usuarioModulo []models.UsuarioModulo

	//	Unmarshal analisa o JSON recebido e armazena na struct usuarioModulo referenciada
	if err = json.Unmarshal(body, &usuarioModulo); err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, fmt.Errorf("[FATAL] ERROR: 422, %v\n", err))
		return
	}

	ch := make(chan int)
	go func() {

		for _, data := range usuarioModulo {

			//	SaveModulo salva as informacoes contidas em 'data' no banco de dados
			usuarioModuloCreated, err := data.SaveUsuarioModulo(server.DB)
			if err != nil {
				formattedError := config.FormatError(err.Error())
				responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't save in database, %v\n", formattedError))
				return
			}

			//	Parametros de entrada(nome_server, chave_primaria, nome_tabela, operacao, id_usuario)
			err = logUsuarioModulo.LogUsuarioModulo(server.DB, usuarioModuloCreated.CodUsuario, usuarioModuloCreated.CodModulo, "usuario_modulo", "i", tokenID)
			if err != nil {
				formattedError := config.FormatError(err.Error())
				responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't save log in database, %v\n", formattedError))
				return
			}

		}
		<-ch
	}()

	w.Header().Set("Location", fmt.Sprintf("%s%s/%d", r.Host, r.RequestURI, usuarioModulo))

	//	Retorna o Status 201 e o JSON do Array adicionado
	responses.JSON(w, http.StatusCreated, usuarioModulo)
}

/*  =========================
	FUNCAO LISTAR TODOS USUARIO MODULO
=========================  */

func (server *Server) GetAllUsuarioModulo(w http.ResponseWriter, r *http.Request) {

	//	Autorizacao de Modulo
	if err := config.AuthMod(w, r, 11002); err != nil {
		responses.ERROR(w, http.StatusUnauthorized, fmt.Errorf("[FATAL] Unauthorized"))
		return
	}

	usuarioModulo := models.UsuarioModulo{}

	//	allUsuarioModulo armazena os dados buscados no banco de dados
	allUsuarioModulo, err := usuarioModulo.FindAllUsuarioModulo(server.DB)
	if err != nil {
		formattedError := config.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't find in database, %v\n", formattedError))
		return
	}

	//	Retorna o Status 200 e o JSON da struct buscada
	responses.JSON(w, http.StatusOK, allUsuarioModulo)
}

/*  =========================
	FUNCAO DELETAR USUARIO MODULO
=========================  */

func (server *Server) DeleteUsuarioModulo(w http.ResponseWriter, r *http.Request) {

	//	Autorizacao de Modulo
	if err := config.AuthMod(w, r, 11003); err != nil {
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

	logUsuarioModulo := models.Log{}

	//	Declara usarioModulo como um Array da struct UsuarioModulo
	var usuarioModulo []models.UsuarioModulo

	//	Unmarshal analisa o JSON recebido e armazena na struct usuarioModulo referenciada
	if err = json.Unmarshal(body, &usuarioModulo); err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, fmt.Errorf("[FATAL] ERROR: 422, %v\n", err))
		return
	}

	ch := make(chan int)
	go func() {

		for _, data := range usuarioModulo {

			//	Parametros de entrada(nome_server, chave_primaria, nome_tabela, operacao, id_usuario)
			err = logUsuarioModulo.LogUsuarioModulo(server.DB, data.CodUsuario, data.CodModulo, "usuario_modulo", "d", tokenID)
			if err != nil {
				formattedError := config.FormatError(err.Error())
				responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't save log in database, %v\n", formattedError))
				return
			}

			//	SaveModulo salva as informacoes contidas em 'data' no banco de dados
			err := data.DeleteUsuarioModulo(server.DB, data.CodUsuario, data.CodModulo)
			if err != nil {
				formattedError := config.FormatError(err.Error())
				responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't save in database, %v\n", formattedError))
				return
			}
		}
		<-ch
	}()

	w.Header().Set("Location", fmt.Sprintf("%s%s/%d", r.Host, r.RequestURI, usuarioModulo))

	//	Retorna o Status 201 e o JSON do Array adicionado
	responses.JSON(w, http.StatusCreated, usuarioModulo)
}
