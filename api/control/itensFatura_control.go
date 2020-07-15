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
	FUNCAO ADICIONAR ITENS FATURA
=========================  */

func (server *Server) CreateItensFatura(w http.ResponseWriter, r *http.Request) {

	// //	Autorizacao de Modulo
	// if err := config.AuthMod(w, r, 17021); err != nil {
	// 	responses.ERROR(w, http.StatusUnauthorized, fmt.Errorf("[FATAL] Unauthorized"))
	// 	return
	// }

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

	//	Estrutura models.ItensFatura{} "renomeada"
	itensFatura := models.ItensFatura{}
	logItensFatura := models.Log{}

	//	Unmarshal analisa o JSON recebido e armazena na struct itensFatura referenciada (&struct)
	if err = json.Unmarshal(body, &itensFatura); err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, fmt.Errorf("[FATAL] ERROR: 422, %v\n", err))
		return
	}

	//	Validacao de estrutura
	if err = validation.Validator.Struct(itensFatura); err != nil {
		log.Printf("[WARN] invalid information, because, %v\n", fmt.Errorf("[FATAL] validation error!, %v\n", err))
		w.WriteHeader(http.StatusPreconditionFailed)
		return
	}

	//	SaveItensFatura eh o metodo que faz a conexao com banco de dados e salva os dados recebidos
	itensFaturaCreated, err := itensFatura.SaveItensFatura(server.DB)
	if err != nil {
		formattedError := config.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't save in database, %v\n", formattedError))
		return
	}

	//	Parametros de entrada(nome_server, chave_primaria, chave_primaria, chave_primaria, chave_primaria, chave_primaria, nome_tabela, operacao, id_usuario)
	err = logItensFatura.LogItensFatura(server.DB, itensFaturaCreated.NumNF, itensFaturaCreated.CodIbge, itensFaturaCreated.IDEmpenho, itensFaturaCreated.CodItem, itensFaturaCreated.CodTipoItem, "itens_fatura", "i", tokenID)
	if err != nil {
		formattedError := config.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't save log in database, %v\n", formattedError))
		return
	}

	w.Header().Set("Location", fmt.Sprintf("%s%s/%d", r.Host, r.RequestURI, itensFaturaCreated.NumNF))

	//	Ao final retorna o Status 201 e o JSON da struct que foi criada
	responses.JSON(w, http.StatusCreated, itensFaturaCreated)
}

/*  =========================
	FUNCAO LISTAR ITENS FATURA POR ID
=========================  */

func (server *Server) GetItensFaturaByID(w http.ResponseWriter, r *http.Request) {

	//	Autorizacao de Modulo
	if err := config.AuthMod(w, r, 17022); err != nil {
		responses.ERROR(w, http.StatusUnauthorized, fmt.Errorf("[FATAL] Unauthorized"))
		return
	}

	// Vars retorna as variaveis de rota
	vars := mux.Vars(r)

	//	numNF armazena a chave primaria da tabela itensFatura
	numNF, err := strconv.ParseUint(vars["num_nf"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, fmt.Errorf("[FATAL] It couldn't parse the variable, %v\n", err))
		return
	}

	//	codIbge armazena a chave primaria da tabela itensFatura
	codIbge, err := strconv.ParseUint(vars["cod_ibge"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, fmt.Errorf("[FATAL] It couldn't parse the variable, %v\n", err))
		return
	}

	//	idEmpenho armazena a chave primaria da tabela itensFatura
	idEmpenho, err := strconv.ParseUint(vars["id_empenho"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, fmt.Errorf("[FATAL] It couldn't parse the variable, %v\n", err))
		return
	}

	//	codItem armazena a chave primaria da tabela itensFatura
	codItem, err := strconv.ParseUint(vars["cod_item"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, fmt.Errorf("[FATAL] It couldn't parse the variable, %v\n", err))
		return
	}

	//	codTipoItem armazena a chave primaria da tabela itensFatura
	codTipoItem, err := strconv.ParseUint(vars["cod_tipo_item"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, fmt.Errorf("[FATAL] It couldn't parse the variable, %v\n", err))
		return
	}

	itensFatura := models.ItensFatura{}

	//	itensFaturaGotten recebe a nova itensFatura, a que foi alterada
	itensFaturaGotten, err := itensFatura.FindItensFaturaByID(server.DB, uint32(numNF), uint32(codIbge), uint32(idEmpenho), uint32(codItem), uint32(codTipoItem))
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, fmt.Errorf("[FATAL] it couldn't find by ID, %v\n", err))
		return
	}

	//	Retorna o Status 200 e o JSON da struct alterada
	responses.JSON(w, http.StatusOK, itensFaturaGotten)
}

/*  =========================
	FUNCAO LISTAR TODAS ITENS FATURA
=========================  */

func (server *Server) GetAllItensFatura(w http.ResponseWriter, r *http.Request) {

	//	Autorizacao de Modulo
	if err := config.AuthMod(w, r, 17022); err != nil {
		responses.ERROR(w, http.StatusUnauthorized, fmt.Errorf("[FATAL] Unauthorized"))
		return
	}

	itensFatura := models.ItensFatura{}

	// Vars retorna as variaveis de rota
	vars := mux.Vars(r)

	//	numNF armazena a chave primaria da tabela itensFatura
	numNF, err := strconv.ParseUint(vars["num_nf"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, fmt.Errorf("[FATAL] It couldn't parse the variable, %v\n", err))
		return
	}

	//	codIbge armazena a chave primaria da tabela itensFatura
	codIbge, err := strconv.ParseUint(vars["cod_ibge"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, fmt.Errorf("[FATAL] It couldn't parse the variable, %v\n", err))
		return
	}

	//	allItensFatura armazena os dados buscados no banco de dados
	allItensFatura, err := itensFatura.FindAllItensFatura(server.DB, uint32(numNF), uint32(codIbge))
	if err != nil {
		formattedError := config.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't find in database, %v\n", formattedError))
		return
	}

	//	Retorna o Status 200 e o JSON da struct buscada
	responses.JSON(w, http.StatusOK, allItensFatura)
}

/*  =========================
	FUNCAO EDITAR ITENS FATURA
=========================  */

func (server *Server) UpdateItensFatura(w http.ResponseWriter, r *http.Request) {

	//	Autorizacao de Modulo
	if err := config.AuthMod(w, r, 17023); err != nil {
		responses.ERROR(w, http.StatusUnauthorized, fmt.Errorf("[FATAL] Unauthorized"))
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

	itensFatura := models.ItensFatura{}
	logItensFatura := models.Log{}

	if err = json.Unmarshal(body, &itensFatura); err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, fmt.Errorf("[FATAL] ERROR: 422, %v\n", err))
		return
	}

	// Vars retorna as variaveis de rota
	vars := mux.Vars(r)

	//	numNF armazena a chave primaria da tabela itensFatura
	numNF, err := strconv.ParseUint(vars["num_nf"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, fmt.Errorf("[FATAL] It couldn't parse the variable, %v\n", err))
		return
	}

	//	codIbge armazena a chave primaria da tabela itensFatura
	codIbge, err := strconv.ParseUint(vars["cod_ibge"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, fmt.Errorf("[FATAL] It couldn't parse the variable, %v\n", err))
		return
	}

	//	idEmpenho armazena a chave primaria da tabela itensFatura
	idEmpenho, err := strconv.ParseUint(vars["id_empenho"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, fmt.Errorf("[FATAL] It couldn't parse the variable, %v\n", err))
		return
	}

	//	codItem armazena a chave primaria da tabela itensFatura
	codItem, err := strconv.ParseUint(vars["cod_item"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, fmt.Errorf("[FATAL] It couldn't parse the variable, %v\n", err))
		return
	}

	//	codTipoItem armazena a chave primaria da tabela itensFatura
	codTipoItem, err := strconv.ParseUint(vars["cod_tipo_item"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, fmt.Errorf("[FATAL] It couldn't parse the variable, %v\n", err))
		return
	}

	if err = validation.Validator.Struct(itensFatura); err != nil {
		log.Printf("[WARN] invalid information, because, %v\n", fmt.Errorf("[FATAL] validation error!, %v\n", err))
		w.WriteHeader(http.StatusPreconditionFailed)
		return
	}

	//	Parametros de entrada(nome_server, chave_primaria, chave_primaria, chave_primaria, chave_primaria, chave_primaria, nome_tabela, operacao, id_usuario)
	err = logItensFatura.LogItensFatura(server.DB, uint32(numNF), uint32(codIbge), uint32(idEmpenho), uint32(codItem), uint32(codTipoItem), "itens_fatura", "u", tokenID)
	if err != nil {
		formattedError := config.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't save log in database, %v\n", formattedError))
		return
	}

	//	updateItensFatura recebe a nova itensFatura, a que foi alterada
	updateItensFatura, err := itensFatura.UpdateItensFatura(server.DB, uint32(numNF), uint32(codIbge), uint32(idEmpenho), uint32(codItem), uint32(codTipoItem))
	if err != nil {
		formattedError := config.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't update in database , %v\n", formattedError))
		return
	}

	//	Retorna o Status 200 e o JSON da struct alterada
	responses.JSON(w, http.StatusOK, updateItensFatura)
}

/*  =========================
	FUNCAO DELETAR ITENS FATURA
=========================  */

func (server *Server) DeleteItensFatura(w http.ResponseWriter, r *http.Request) {

	//	Autorizacao de Modulo, apenas quem tem permicao de edit pode deletar
	if err := config.AuthMod(w, r, 17023); err != nil {
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

	itensFatura := models.ItensFatura{}
	logItensFatura := models.Log{}

	//	numNF armazena a chave primaria da tabela itensFatura
	numNF, err := strconv.ParseUint(vars["num_nf"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, fmt.Errorf("[FATAL] It couldn't parse the variable, %v\n", err))
		return
	}

	//	codIbge armazena a chave primaria da tabela itensFatura
	codIbge, err := strconv.ParseUint(vars["cod_ibge"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, fmt.Errorf("[FATAL] It couldn't parse the variable, %v\n", err))
		return
	}

	//	idEmpenho armazena a chave primaria da tabela itensFatura
	idEmpenho, err := strconv.ParseUint(vars["id_empenho"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, fmt.Errorf("[FATAL] It couldn't parse the variable, %v\n", err))
		return
	}

	//	codItem armazena a chave primaria da tabela itensFatura
	codItem, err := strconv.ParseUint(vars["cod_item"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, fmt.Errorf("[FATAL] It couldn't parse the variable, %v\n", err))
		return
	}

	//	codTipoItem armazena a chave primaria da tabela itensFatura
	codTipoItem, err := strconv.ParseUint(vars["cod_tipo_item"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, fmt.Errorf("[FATAL] It couldn't parse the variable, %v\n", err))
		return
	}

	//	Parametros de entrada(nome_server, chave_primaria, chave_primaria, chave_primaria, chave_primaria, chave_primaria, nome_tabela, operacao, id_usuario)
	err = logItensFatura.LogItensFatura(server.DB, uint32(numNF), uint32(codIbge), uint32(idEmpenho), uint32(codItem), uint32(codTipoItem), "itens_fatura", "d", tokenID)
	if err != nil {
		formattedError := config.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't save log in database, %v\n", formattedError))
		return
	}

	// 	Para o caso da funcao 'delete' apenas o erro nos eh necessario
	err = itensFatura.DeleteItensFatura(server.DB, uint32(numNF), uint32(codIbge), uint32(idEmpenho), uint32(codItem), uint32(codTipoItem))
	if err != nil {
		formattedError := config.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't delete in database , %v\n", formattedError))
		return
	}

	w.Header().Set("Entity", fmt.Sprintf("%d/%d/%d/%d", numNF, idEmpenho, codItem, codTipoItem))

	//	Retorna o Status 204, indicando que a informacao foi deletada
	responses.JSON(w, http.StatusNoContent, "")
}

/*  =========================
	FUNCAO LISTAR TODAS ITENS FATURA ORIGINAL DISPONIVEIS
=========================  */

func (server *Server) GetItensFaturaOriginalDisponiveis(w http.ResponseWriter, r *http.Request) {

	itensEmpenho := models.ItensEmpenho{}

	// Vars retorna as variaveis de rota
	vars := mux.Vars(r)

	//	codIbge armazena a chave primaria da tabela itensFatura
	codIbge, err := strconv.ParseUint(vars["cod_ibge"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, fmt.Errorf("[FATAL] It couldn't parse the variable, %v\n", err))
		return
	}

	//	itensEmpenhoGotten recebe o dado buscado no banco de dados
	itensEmpenhoGotten, err := itensEmpenho.FindItensFaturaDisponiveisOriginal(server.DB, uint32(codIbge))
	if err != nil {
		formattedError := config.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't find in database, %v\n", formattedError))
		return
	}

	bytes, _ := json.Marshal(itensEmpenhoGotten)

	w.Write(bytes)
}

/*  =========================
	FUNCAO LISTAR TODAS ID EMPENHO REAJUSTE
=========================  */

func (server *Server) GetIDEmpenho(w http.ResponseWriter, r *http.Request) {

	itensEmpenho := models.ItensEmpenho{}

	//	itensEmpenhoGotten recebe o dado buscado no banco de dados
	itensEmpenhoGotten, err := itensEmpenho.FindIDEmpenhoReajuste(server.DB)
	if err != nil {
		formattedError := config.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't find in database, %v\n", formattedError))
		return
	}

	bytes, _ := json.Marshal(itensEmpenhoGotten)

	w.Write(bytes)
}

/*  =========================
	FUNCAO LISTAR TODAS ITENS FATURA REAJUSTE DISPONIVEIS
=========================  */

func (server *Server) GetItensFaturaReajusteDisponiveis(w http.ResponseWriter, r *http.Request) {

	itensEmpenho := models.ItensEmpenho{}

	// Vars retorna as variaveis de rota
	vars := mux.Vars(r)

	//	idEmpenho armazena a chave primaria da tabela itensFatura
	idEmpenho, err := strconv.ParseUint(vars["id_empenho"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, fmt.Errorf("[FATAL] It couldn't parse the variable, %v\n", err))
		return
	}

	//	itensEmpenhoGotten recebe o dado buscado no banco de dados
	itensEmpenhoGotten, err := itensEmpenho.FindItensFaturaDisponiveisReajuste(server.DB, uint32(idEmpenho))
	if err != nil {
		formattedError := config.FormatError(err.Error())
		responses.ERROR(w, http.StatusInternalServerError, fmt.Errorf("[FATAL] it couldn't find in database, %v\n", formattedError))
		return
	}

	bytes, _ := json.Marshal(itensEmpenhoGotten)

	w.Write(bytes)
}
