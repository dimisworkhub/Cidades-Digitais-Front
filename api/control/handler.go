package control

import (
	"CidadesDigitaisV2/api/config"
	"CidadesDigitaisV2/api/middlewares"
	"net/http"

	"github.com/gorilla/mux"
)

func (s *Server) CreateHandler() (r *mux.Router) {

	//	CRIA UM ROTEADOR
	r = s.Router

	//	HOME
	r.HandleFunc("/", middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.Home))).Methods(http.MethodGet)

	/*	=========================
		ROTAS EM USUARIO
	=========================	*/

	//LISTA USUARIOS
	r.HandleFunc(config.USER_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetAllUsuario))).Methods(http.MethodGet)

	//EDITA O USUARIO {cod_usuario}
	r.HandleFunc(config.USER_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.UpdateUsuario))).Methods(http.MethodPut)

	//ROTA DE LOGIN
	r.HandleFunc(config.USER_PATH_LOGIN, middlewares.SetMiddleJSON(s.Login)).Methods(http.MethodPost)

	//SALVA USUARIO
	r.HandleFunc(config.USER_PATH_CREATEUSER, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.CreateUsuario))).Methods(http.MethodPost)

	//APAGA O USUARIO
	//	r.HandleFunc(config.USER_PATH_DELETEUSER, middlewares.SetMiddleAuth(s.DeleteUsuario)).Methods(http.MethodDelete)

	/*	=========================
		ROTAS EM MODULO
	=========================	*/

	//	ADICIONAR MODULO
	r.HandleFunc(config.MODULO_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.CreateModulo))).Methods(http.MethodPost)

	//	LISTA MODULO
	r.HandleFunc(config.MODULO_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetAllModulo))).Methods(http.MethodGet)

	/*	=========================
		ROTAS EM USUARIO MODULO
	=========================	*/

	//	ADICIONAR USUARIO MODULO
	r.HandleFunc(config.MODULO_USERLIST_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.CreateUsuarioModulo))).Methods(http.MethodPost)

	//	DELETAR USUARIO MODULO
	r.HandleFunc(config.MODULO_USERLIST_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.DeleteUsuarioModulo))).Methods(http.MethodPost)

	/*	=========================
		ROTAS EM ENTIDADE
	=========================	*/

	//	LISTA ENTIDADE
	r.HandleFunc(config.ENTIDADE_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetAllEntidade))).Methods(http.MethodGet)

	//	SALVA ENTIDADE
	r.HandleFunc(config.ENTIDADE_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.CreateEntidade))).Methods(http.MethodPost)

	//	EDITA ENTIDADE
	r.HandleFunc(config.ENTIDADE_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.UpdateEntidade))).Methods(http.MethodPut)

	//	LISTA ENTIDADE POR ID
	r.HandleFunc(config.ENTIDADE_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetEntidadeByID))).Methods(http.MethodGet)

	//	APAGA ENTIDADE POR ID
	r.HandleFunc(config.ENTIDADE_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.DeleteEntidade))).Methods(http.MethodDelete)

	//	GET ENTIDADE NOME CNPJ
	r.HandleFunc("/read/entidadeget", middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetEntidadeIDandName))).Methods(http.MethodGet)

	/*	=========================
		ROTAS DE CONTATO
	=========================	*/

	//	LISTA CONTATO
	r.HandleFunc(config.CONTATO_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetAllContato))).Methods(http.MethodGet)

	//	SALVA CONTATO
	r.HandleFunc(config.CONTATO_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.CreateContato))).Methods(http.MethodPost)

	//	EDITA CONTATO (cod_contato)
	r.HandleFunc(config.CONTATO_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.UpdateContato))).Methods(http.MethodPut)

	//	APAGA LOTE (cod_contato)
	r.HandleFunc(config.CONTATO_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.DeleteContato))).Methods(http.MethodDelete)

	/*	=========================
		ROTAS DE TELEFONE
	=========================	*/

	//	LISTA TELEFONE
	r.HandleFunc(config.TELEFONE_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetAllTelefone))).Methods(http.MethodGet)

	//	SALVA TELEFONE
	r.HandleFunc(config.TELEFONE_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.CreateTelefone))).Methods(http.MethodPost)

	//	APAGA TELEFONE (cod_telefone)
	r.HandleFunc(config.TELEFONE_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.DeleteTelefone))).Methods(http.MethodDelete)

	/*	=========================
		ROTAS EM CIDADE DIGITAL
	=========================	*/

	//	SALVA CD
	r.HandleFunc(config.CD_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.CreateCD))).Methods(http.MethodPost)

	//	LISTA CD
	r.HandleFunc(config.CD_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetAllCD))).Methods(http.MethodGet)

	//	EDITA CD (cod_ibge)
	r.HandleFunc(config.CD_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.UpdateCD))).Methods(http.MethodPut)

	//	LISTA CD (cod_ibge)
	r.HandleFunc(config.CD_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetCDByID))).Methods(http.MethodGet)

	//	APAGA CD (cod_ibge)
	//	r.HandleFunc(config.CD_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.DeleteCD))).Methods(http.MethodDelete)

	/*	=========================
		ROTAS EM CIDADE DIGITAL ITENS
	=========================	*/

	//	LISTA CD ITENS
	r.HandleFunc(config.CD_ITENS_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetAllCDItens))).Methods(http.MethodGet)

	//	EDITA CD ITENS (cod_ibge, cod_item, cod_tipo_item)
	r.HandleFunc(config.CD_ITENS_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.UpdateCDItens))).Methods(http.MethodPut)

	//	LISTA CD ITENS POR ID (cod_ibge, cod_item, cod_tipo_item)
	r.HandleFunc(config.CD_ITENS_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetCDItensByID))).Methods(http.MethodGet)

	/*	=========================
		ROTAS EM PROCESSO
	=========================	*/

	//	LISTA PROCESSO
	r.HandleFunc(config.PROCESSO_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetAllProcesso))).Methods(http.MethodGet)

	//	SALVA PROCESSO
	r.HandleFunc(config.PROCESSO_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.CreateProcesso))).Methods(http.MethodPost)

	//	EDITA PROCESSO (cod_processo)
	r.HandleFunc(config.PROCESSO_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.UpdateProcesso))).Methods(http.MethodPut)

	//	LISTA PROCESSO (cod_processo)
	r.HandleFunc(config.PROCESSO_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetProcessoByID))).Methods(http.MethodGet)

	//	APAGA PROCESSO (cod_processo)
	r.HandleFunc(config.PROCESSO_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.DeleteProcesso))).Methods(http.MethodDelete)

	/*	=========================
		ROTAS EM UACOM
	=========================	*/

	//	LISTA UACOM
	r.HandleFunc(config.UACOM_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetAllUacom))).Methods(http.MethodGet)

	//	SALVA UACOM
	r.HandleFunc(config.UACOM_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.CreateUacom))).Methods(http.MethodPost)

	//	LISTA UACOM (cod_ibge, data)
	r.HandleFunc(config.UACOM_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetUacomByID))).Methods(http.MethodGet)

	//	EDITA UACOM (cod_ibge, data)
	r.HandleFunc(config.UACOM_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.UpdateUacom))).Methods(http.MethodPut)

	//	APAGA UACOM (cod_ibge, data)
	r.HandleFunc(config.UACOM_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.DeleteUacom))).Methods(http.MethodDelete)

	/*	=========================
		ROTAS EM UACOM ASSUNTO
	=========================	*/

	//	SALVA UACOM ASSUNTO
	r.HandleFunc(config.UACOM_ASSUNTO_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.CreateUacomAssunto))).Methods(http.MethodPost)

	/*	=========================
		ROTAS EM PONTO
	=========================	*/

	//	LISTA PONTO
	r.HandleFunc(config.PONTO_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetAllPonto))).Methods(http.MethodGet)

	//	SALVA PONTO
	r.HandleFunc(config.PONTO_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.CreatePonto))).Methods(http.MethodPost)

	//	EDITA PONTO (cod_ponto, cod_categoria, cod_ibge, cod_pid)
	r.HandleFunc(config.PONTO_PID_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.UpdatePonto))).Methods(http.MethodPut)

	//	LISTA PONTO (cod_ponto, cod_categoria, cod_ibge)
	r.HandleFunc(config.PONTO_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetPontoByID))).Methods(http.MethodGet)

	//	APAGA PONTO (cod_ponto, cod_categoria, cod_ibge, cod_pid)
	r.HandleFunc(config.PONTO_PID_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.DeletePonto))).Methods(http.MethodDelete)

	/*	=========================
		ROTAS EM PID
	=========================	*/

	//	LISTA PID
	r.HandleFunc(config.PID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetAllPid))).Methods(http.MethodGet)

	//	LISTA PID (cod_pid)
	r.HandleFunc(config.PID_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetPidByID))).Methods(http.MethodGet)

	/*	=========================
		ROTAS EM PID TIPOLOGIA
	=========================	*/

	//	LISTA PID TIPOLOGIA
	r.HandleFunc(config.PID_TOPOLOGIA_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetAllPidTipologia))).Methods(http.MethodGet)

	//	SALVA PID TIPOLOGIA
	r.HandleFunc(config.PID_TOPOLOGIA_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.CreatePidTipologia))).Methods(http.MethodPost)

	//	APAGA PID TIPOLOGIA (cod_pid, cod_tipologia)
	r.HandleFunc(config.PID_TOPOLOGIA_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.DeletePidTipologia))).Methods(http.MethodDelete)

	/*	=========================
		ROTAS EM LOTE
	=========================	*/

	//	LISTA LOTE
	r.HandleFunc(config.LOTE_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetAllLote))).Methods(http.MethodGet)

	//	SALVA LOTE
	r.HandleFunc(config.LOTE_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.CreateLote))).Methods(http.MethodPost)

	//	EDITA LOTE
	r.HandleFunc(config.LOTE_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.UpdateLote))).Methods(http.MethodPut)

	//	LISTA LOTE (cod_lote)
	r.HandleFunc(config.LOTE_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetLoteByID))).Methods(http.MethodGet)

	//	APAGA LOTE (cod_lote)
	//	r.HandleFunc(config.LOTE_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.DeleteLote))).Methods(http.MethodDelete)

	/*	=========================
		ROTAS EM REAJUSTE
	=========================	*/

	//	SALVA REAJUSTE
	r.HandleFunc(config.REAJUSTE_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.CreateReajuste))).Methods(http.MethodPost)

	//	LISTA REAJUSTE
	r.HandleFunc(config.REAJUSTE_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetAllReajuste))).Methods(http.MethodGet)

	//	LISTA REAJUSTE POR ID (ano_ref, cod_lote)
	r.HandleFunc(config.REAJUSTE_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetReajusteByID))).Methods(http.MethodGet)

	//	EDITA REAJUSTE (ano_ref, cod_lote)
	r.HandleFunc(config.REAJUSTE_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.UpdateReajuste))).Methods(http.MethodPut)

	//	APAGA REAJUSTE (ano_ref, cod_lote)
	r.HandleFunc(config.REAJUSTE_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.DeleteReajuste))).Methods(http.MethodDelete)

	/*	=========================
		ROTAS EM LOTE ITENS
	=========================	*/

	//	SALVA LOTE ITENS
	r.HandleFunc(config.REAJUSTE_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.CreateLoteItens))).Methods(http.MethodPost)

	//	LISTA LOTE ITENS
	r.HandleFunc(config.LOTE_ITENS_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetAllLoteItens))).Methods(http.MethodGet)

	//	EDITA LOTE ITENS (cod_lote, cod_item, cod_tipo_item)
	r.HandleFunc(config.LOTE_ITENS_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.UpdateLoteItens))).Methods(http.MethodPut)

	//	LISTA LOTE ITENS POR ID (cod_lote, cod_item, cod_tipo_item)
	r.HandleFunc(config.LOTE_ITENS_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetLoteItensByID))).Methods(http.MethodGet)

	//	APAGA LOTE ITENS POR ID (cod_lote, cod_item, cod_tipo_item)
	r.HandleFunc(config.LOTE_ITENS_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.DeleteLoteItens))).Methods(http.MethodDelete)

	/*	=========================
		ROTAS EM EMPENHO
	=========================	*/

	//	LISTA EMPENHO
	r.HandleFunc(config.EMPENHO_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetAllEmpenho))).Methods(http.MethodGet)

	//	SALVA EMPENHO
	r.HandleFunc(config.EMPENHO_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.CreateEmpenho))).Methods(http.MethodPost)

	//	LISTA EMPENHO (cod_previsao_empenho)
	r.HandleFunc(config.EMPENHO_COD_PREVISAO_EMPENHO_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetEmpenhoByCodPrevisaoEmpenho))).Methods(http.MethodGet)

	//	EDITA EMPENHO (id_empenho)
	r.HandleFunc(config.EMPENHO_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.UpdateEmpenho))).Methods(http.MethodPut)

	//	LISTA EMPENHO (id_empenho)
	r.HandleFunc(config.EMPENHO_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetEmpenhoByID))).Methods(http.MethodGet)

	//	APAGA EMPENHO (id_empenho)
	//	r.HandleFunc(config.EMPENHO_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.DeleteEmpenho))).Methods(http.MethodDelete)

	/*	=========================
		ROTAS EM ITENS EMPENHO
	=========================	*/

	//	LISTA ITENS EMPENHO
	r.HandleFunc(config.ITENS_EMPENHO_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetAllItensEmpenho))).Methods(http.MethodGet)

	//	EDITA ITENS EMPENHO (id_empenho, cod_item, cod_tipo_item)
	r.HandleFunc(config.ITENS_EMPENHO_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.UpdateItensEmpenho))).Methods(http.MethodPut)

	//	LISTA ITENS EMPENHO (id_empenho, cod_item, cod_tipo_item)
	r.HandleFunc(config.ITENS_EMPENHO_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetItensEmpenhoByID))).Methods(http.MethodGet)

	/*	=========================
		ROTAS EM OTB
	=========================	*/

	//	LISTA OTB
	r.HandleFunc(config.OTB_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetAllOTB))).Methods(http.MethodGet)

	//	SALVA OTB
	r.HandleFunc(config.OTB_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.CreateOTB))).Methods(http.MethodPost)

	//	EDITA OTB (cod_otb)
	r.HandleFunc(config.OTB_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.UpdateOTB))).Methods(http.MethodPut)

	//	LISTA OTB (cod_otb)
	r.HandleFunc(config.OTB_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetOTBByID))).Methods(http.MethodGet)

	//	APAGA OTB (cod_otb)
	r.HandleFunc(config.OTB_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.DeleteOTB))).Methods(http.MethodDelete)

	/*	=========================
		ROTAS EM ITENS OTB
	=========================	*/

	//	LISTA ITENS OTB
	r.HandleFunc(config.ITENS_OTB_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetItensOTB))).Methods(http.MethodGet)

	//	EDITA ITENS OTB (cot_otb, num_nf, cod_ibge, id_empenho, cod_item, cod_tipo_item)
	r.HandleFunc(config.ITENS_OTB_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.UpdateItensOTB))).Methods(http.MethodPut)

	/*	=========================
		ROTAS EM FATURA
	=========================	*/

	//	LISTA FATURA
	r.HandleFunc(config.FATURA_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetAllFatura))).Methods(http.MethodGet)

	//	SALVA FATURA
	r.HandleFunc(config.FATURA_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.CreateFatura))).Methods(http.MethodPost)

	//	EDITA FATURA (num_nf, cod_ibge)
	r.HandleFunc(config.FATURA_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.UpdateFatura))).Methods(http.MethodPut)

	//	LISTA FATURA (id_empenho)
	r.HandleFunc(config.FATURA_ID_EMPENHO_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetFaturaByIDEmpenho))).Methods(http.MethodGet)

	//	LISTA FATURA (num_nf, cod_ibge)
	r.HandleFunc(config.FATURA_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetFaturaByID))).Methods(http.MethodGet)

	//	APAGA FATURA (num_nf, cod_ibge)
	r.HandleFunc(config.FATURA_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.DeleteFatura))).Methods(http.MethodDelete)

	/*	=========================
		ROTAS EM ITENS FATURA
	=========================	*/

	//	SALVA ITENS FATURA
	r.HandleFunc(config.ITENS_FATURA_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.CreateItensFatura))).Methods(http.MethodPost)

	//	LISTAR ITENS FATURA DISPONIVEL ORIGINAL (cod_ibge)
	r.HandleFunc("/read/itensfatura/{cod_ibge}", middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetItensFaturaOriginalDisponiveis))).Methods(http.MethodGet)

	//	LISTAR ID EMPENHO REAJUSTE
	r.HandleFunc("/read/itensfaturaidempenho", middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetIDEmpenho))).Methods(http.MethodGet)

	//	LISTAR ITENS FATURA DISPONIVEL REAJUSTE (id_empenho)
	r.HandleFunc("/read/itensfaturareajuste/{id_empenho}", middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetItensFaturaReajusteDisponiveis))).Methods(http.MethodGet)

	//	LISTA ITENS FATURA (num_nf, cod_ibge)
	r.HandleFunc(config.ITENS_FATURA_GET_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetAllItensFatura))).Methods(http.MethodGet)

	//	LISTA ITENS FATURA (num_nf, cod_ibge, id_empenho, cod_item, cod_tipo_item)
	r.HandleFunc(config.ITENS_FATURA_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetItensFaturaByID))).Methods(http.MethodGet)

	//	EDITA ITENS FATURA (num_nf, cod_ibge, id_empenho, cod_item, cod_tipo_item)
	r.HandleFunc(config.ITENS_FATURA_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.UpdateItensFatura))).Methods(http.MethodPut)

	//	APAGA ITENS FATURA (num_nf, cod_ibge, id_empenho, cod_item, cod_tipo_item)
	r.HandleFunc(config.ITENS_FATURA_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.DeleteItensFatura))).Methods(http.MethodDelete)

	/*	=========================
		ROTAS EM FATURA OTB
	=========================	*/

	//	SALVA FATURA OTB
	r.HandleFunc(config.FATURA_OTB_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.CreateFaturaOTB))).Methods(http.MethodPost)

	//	LISTA FATURA (cod_otb, num_nf, cod_ibge)
	r.HandleFunc(config.FATURA_OTB_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetFaturaOTBByID))).Methods(http.MethodGet)

	/*	=========================
		ROTAS EM PREVISAO EMPENHO
	=========================	*/

	//	LISTA PREVISAO EMPENHO
	r.HandleFunc(config.PREVISAO_EMPENHO_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetAllPrevisaoEmpenho))).Methods(http.MethodGet)

	//	SALVA PREVISAO EMPENHO
	r.HandleFunc(config.PREVISAO_EMPENHO_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.CreatePrevisaoEmpenho))).Methods(http.MethodPost)

	//	EDITA PREVISAO EMPENHO (cod_previsao_empenho)
	r.HandleFunc(config.PREVISAO_EMPENHO_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.UpdatePrevisaoEmpenho))).Methods(http.MethodPut)

	//	LISTA PREVISAO EMPENHO (cod_previsao_empenho)
	r.HandleFunc(config.PREVISAO_EMPENHO_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetPrevisaoEmpenhoByID))).Methods(http.MethodGet)

	//	APAGA PREVISAO EMPENHO (cod_previsao_empenho)
	//r.HandleFunc(config.PREVISAO_EMPENHO_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.DeletePrevisaoEmpenho))).Methods(http.MethodDelete)

	/*	=========================
		ROTAS EM ITENS PREVISAO EMPENHO
	=========================	*/

	//	LISTA ITENS PREVISAO EMPENHO
	r.HandleFunc(config.ITENS_PREVISAO_EMPENHO_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetAllItensPrevisaoEmpenho))).Methods(http.MethodGet)

	//	EDITA ITENS PREVISAO EMPENHO
	r.HandleFunc(config.ITENS_PREVISAO_EMPENHO_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.UpdateItensPrevisaoEmpenho))).Methods(http.MethodPut)

	//	LISTA ITENS PREVISAO EMPENHO (cod_previsao_empenho, cod_item, cod_tipo_item)
	r.HandleFunc(config.ITENS_PREVISAO_EMPENHO_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetItensPrevisaoEmpenhoByID))).Methods(http.MethodGet)

	/*	=========================
		ROTAS EM ASSUNTO
	=========================	*/

	//	LISTA ASSUNTO
	r.HandleFunc(config.ASSUNTO_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetAllAssunto))).Methods(http.MethodGet)

	//	SALVA ASSUNTO
	r.HandleFunc(config.ASSUNTO_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.CreateAssunto))).Methods(http.MethodPost)

	//	EDITA ASSUNTO (cod_assunto)
	r.HandleFunc(config.ASSUNTO_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.UpdateAssunto))).Methods(http.MethodPut)

	//	LISTA ASSUNTO (cod_assunto)
	r.HandleFunc(config.ASSUNTO_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetAssuntoByID))).Methods(http.MethodGet)

	//	APAGA ASSUNTO (cod_assunto)
	r.HandleFunc(config.ASSUNTO_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.DeleteAssunto))).Methods(http.MethodDelete)

	/*	=========================
		ROTAS EM CATEGORIA
	=========================	*/
	//	LISTA CATEGORIA
	r.HandleFunc(config.CATEGORIA_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetAllCategoria))).Methods(http.MethodGet)

	//	SALVA CATEGORIA
	r.HandleFunc(config.CATEGORIA_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.CreateCategoria))).Methods(http.MethodPost)

	//	EDITA CATEGORIA (cod_categoria)
	r.HandleFunc(config.CATEGORIA_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.UpdateCategoria))).Methods(http.MethodPut)

	//	LISTA CATEGORIA (cod_categoria)
	r.HandleFunc(config.CATEGORIA_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetCategoriaByID))).Methods(http.MethodGet)

	//	APAGA CATEGORIA (cod_categoria)
	r.HandleFunc(config.CATEGORIA_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.DeleteCategoria))).Methods(http.MethodDelete)

	/*	=========================
		ROTAS EM CLASSE EMPENHO
	=========================	*/

	//	LISTA CLASSE EMPENHO
	r.HandleFunc(config.CLASSE_EMPENHO_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetAllClasseEmpenho))).Methods(http.MethodGet)

	//	SALVA CLASSE EMPENHO
	r.HandleFunc(config.CLASSE_EMPENHO_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.CreateClasseEmpenho))).Methods(http.MethodPost)

	//	EDITA CLASSE EMPENHO (cod_classe_empenho)
	r.HandleFunc(config.CLASSE_EMPENHO_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.UpdateClasseEmpenho))).Methods(http.MethodPut)

	//	LISTA CLASSE EMPENHO (cod_classe_empenho)
	r.HandleFunc(config.CLASSE_EMPENHO_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetClasseEmpenhoByID))).Methods(http.MethodGet)

	//	APAGA CLASSE EMPENHO (cod_classe_empenho)
	r.HandleFunc(config.CLASSE_EMPENHO_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.DeleteClasseEmpenho))).Methods(http.MethodDelete)

	/*  =========================
		ROTAS EM ETAPAS CD
	=========================  */

	//	LISTA ETAPAS CD
	r.HandleFunc(config.ETAPAS_CD_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetAllEtapasCD))).Methods(http.MethodGet)

	//	SALVA ETAPAS CD
	r.HandleFunc(config.ETAPAS_CD_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.CreateEtapasCD))).Methods(http.MethodPost)

	//	EDITA ETAPAS CD (cod_ibge, cod_etapa)
	r.HandleFunc(config.ETAPAS_CD_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.UpdateEtapasCD))).Methods(http.MethodPut)

	//	LISTA ETAPAS CD (cod_ibge, cod_etapa)
	r.HandleFunc(config.ETAPAS_CD_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetEtapasCDByID))).Methods(http.MethodGet)

	//	APAGA ETAPAS CD (cod_ibge, cod_etapa)
	r.HandleFunc(config.ETAPAS_CD_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.DeleteEtapasCD))).Methods(http.MethodDelete)

	//	GET ETAPAS CD PK
	r.HandleFunc("/read/etapascdget", middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetEtapasCDPK))).Methods(http.MethodGet)

	/*	=========================
		ROTAS EM ETAPA
	=========================	*/

	//	LISTA ETAPA
	r.HandleFunc(config.ETAPA_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetAllEtapa))).Methods(http.MethodGet)

	//	SALVA ETAPA
	r.HandleFunc(config.ETAPA_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.CreateEtapa))).Methods(http.MethodPost)

	//	EDITA ETAPA (cod_etapa)
	r.HandleFunc(config.ETAPA_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.UpdateEtapa))).Methods(http.MethodPut)

	//	LISTA ETAPA (cod_etapa)
	r.HandleFunc(config.ETAPA_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetEtapaByID))).Methods(http.MethodGet)

	//	APAGA ETAPA (cod_etapa)
	r.HandleFunc(config.ETAPA_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.DeleteEtapa))).Methods(http.MethodDelete)

	/*	=========================
		ROTAS EM ITENS
	=========================	*/

	//	LISTA ITENS
	r.HandleFunc(config.ITENS_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetAllItens))).Methods(http.MethodGet)

	//	SALVA ITENS
	r.HandleFunc(config.ITENS_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.CreateItens))).Methods(http.MethodPost)

	//	EDITA ITENS (cod_itens)
	r.HandleFunc(config.ITENS_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.UpdateItens))).Methods(http.MethodPut)

	//	LISTA ITENS (cod_itens)
	r.HandleFunc(config.ITENS_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetItensByID))).Methods(http.MethodGet)

	//	APAGA ITENS (cod_itens)
	r.HandleFunc(config.ITENS_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.DeleteItens))).Methods(http.MethodDelete)

	/*	=========================
		ROTAS EM MUNICIPIO
	=========================	*/

	//	LISTA MUNICIPIO
	r.HandleFunc(config.MUNICIPIO_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetAllMunicipio))).Methods(http.MethodGet)

	//	SALVA MUNICIPIO
	r.HandleFunc(config.MUNICIPIO_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.CreateMunicipio))).Methods(http.MethodPost)

	//	EDITA MUNICIPIO (cod_ibge)
	r.HandleFunc(config.MUNICIPIO_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.UpdateMunicipio))).Methods(http.MethodPut)

	//	LISTA MUNICIPIO (cod_ibge)
	r.HandleFunc(config.MUNICIPIO_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetMunicipioByID))).Methods(http.MethodGet)

	//	APAGA MUNICIPIO (cod_ibge)
	r.HandleFunc(config.MUNICIPIO_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.DeleteMunicipio))).Methods(http.MethodDelete)

	//	LISTAR MUNICIPIO.CODIBGE E MUNICIPIO.NOMEMUNICIPIO
	r.HandleFunc("/read/municipioget", middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetMunicipioIDandNomeMunicipio))).Methods(http.MethodGet)

	/*	=========================
		ROTAS EM NATUREZA DESPESA
	=========================	*/

	//	LISTA NATUREZA_DESPESA
	r.HandleFunc(config.NATUREZA_DESPESA_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetAllNaturezaDespesa))).Methods(http.MethodGet)

	//	SALVA NATUREZA_DESPESA
	r.HandleFunc(config.NATUREZA_DESPESA_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.CreateNaturezaDespesa))).Methods(http.MethodPost)

	//	EDITA NATUREZA_DESPESA (cod_natureza_despesa)
	r.HandleFunc(config.NATUREZA_DESPESA_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.UpdateNaturezaDespesa))).Methods(http.MethodPut)

	//	LISTA NATUREZA_DESPESA (cod_natureza_despesa)
	r.HandleFunc(config.NATUREZA_DESPESA_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetNaturezaDespesaByID))).Methods(http.MethodGet)

	//	APAGA NATUREZA_DESPESA (cod_natureza_despesa)
	r.HandleFunc(config.NATUREZA_DESPESA_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.DeleteNaturezaDespesa))).Methods(http.MethodDelete)

	/*	=========================
		ROTAS EM PREFEITOS
	=========================	*/

	//	LISTA PREFEITOS
	r.HandleFunc(config.PREFEITOS_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetAllPrefeitos))).Methods(http.MethodGet)

	//	SALVA PREFEITOS
	r.HandleFunc(config.PREFEITOS_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.CreatePrefeitos))).Methods(http.MethodPost)

	//	EDITA PREFEITOS (cod_prefeito)
	r.HandleFunc(config.PREFEITOS_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.UpdatePrefeitos))).Methods(http.MethodPut)

	//	LISTA PREFEITOS (cod_prefeito)
	r.HandleFunc(config.PREFEITOS_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetPrefeitosByID))).Methods(http.MethodGet)

	//	APAGA PREFEITOS (cod_prefeito)
	r.HandleFunc(config.PREFEITOS_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.DeletePrefeitos))).Methods(http.MethodDelete)

	/*	=========================
		ROTAS EM TIPOLOGIAS
	=========================	*/

	//	LISTA TIPOLOGIA
	r.HandleFunc(config.TIPOLOGIA_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetAllTipologia))).Methods(http.MethodGet)

	//	SALVA TIPOLOGIA
	r.HandleFunc(config.TIPOLOGIA_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.CreateTipologia))).Methods(http.MethodPost)

	//	EDITA TIPOLOGIA (cod_tipologia)
	r.HandleFunc(config.TIPOLOGIA_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.UpdateTipologia))).Methods(http.MethodPut)

	//	LISTA TIPOLOGIA (cod_tipologia)
	r.HandleFunc(config.TIPOLOGIA_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetTipologiaByID))).Methods(http.MethodGet)

	//	APAGA TIPOLOGIA (cod_tipologia)
	r.HandleFunc(config.TIPOLOGIA_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.DeleteTipologia))).Methods(http.MethodDelete)

	/*	=========================
		ROTAS EM TIPO ITEM
	=========================	*/

	//	LISTA TIPO_ITEM
	r.HandleFunc(config.TIPO_ITEM_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetAllTipoItem))).Methods(http.MethodGet)

	//	SALVA TIPO_ITEM
	r.HandleFunc(config.TIPO_ITEM_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.CreateTipoItem))).Methods(http.MethodPost)

	//	EDITA TIPO_ITEM (cod_tipo_item)
	r.HandleFunc(config.TIPO_ITEM_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.UpdateTipoItem))).Methods(http.MethodPut)

	//	LISTA TIPO_ITEM (cod_tipo_item)
	r.HandleFunc(config.TIPO_ITEM_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.GetTipoItemByID))).Methods(http.MethodGet)

	//	APAGA TIPO_ITEM (cod_tipo_item)
	r.HandleFunc(config.TIPO_ITEM_ID_PATH, middlewares.SetMiddleJSON(middlewares.SetMiddleAuth(s.DeleteTipoItem))).Methods(http.MethodDelete)

	return
}
