package config

/*  =========================
	SERVER HTTP
=========================  */

const (
	//	defines ip and port address for server instance
	SERVER_ADDR = "localhost:8080"
)

/*  =========================
	USER PATHS HTTP
=========================  */

const (
	USER_PATH            = "/read/usuario"
	USER_ID_PATH         = "/read/usuario/{cod_usuario}"
	USER_PATH_LOGIN      = "/read/usuario/login"
	USER_PATH_CREATEUSER = "/read/usuario/createuser"
	USER_PATH_DELETEUSER = "/read/usuario/deleteuser"
)

/*  =========================
	MODULOS PATHS HTTP
=========================  */

const (
	MODULO_PATH          = "/read/modulo"
	MODULO_USERLIST_PATH = "/read/usuario/{cod_usuario}/modulo"
)

/*  =========================
	ENTIDADE PATHS HTTP
=========================  */

const (
	ENTIDADE_PATH    = "/read/entidade"
	ENTIDADE_ID_PATH = "/read/entidade/{cnpj}"
)

/*  =========================
	CONTATO PATHS HTTP
=========================  */

const (
	CONTATO_PATH    = "/read/contato"
	CONTATO_ID_PATH = "/read/contato/{cod_contato}"
)

/*  =========================
	TELEFONE PATHS HTTP
=========================  */

const (
	TELEFONE_PATH    = "/read/telefone"
	TELEFONE_ID_PATH = "/read/telefone/{cod_telefone}"
)

/*  =========================
	LOTE PATHS HTTP
=========================  */

const (
	LOTE_PATH    = "/read/lote"
	LOTE_ID_PATH = "/read/lote/{cod_lote}"
)

/*  =========================
	REAJUSTE PATHS HTTP
=========================  */
const (
	REAJUSTE_PATH    = "/read/reajuste"
	REAJUSTE_ID_PATH = "/read/reajuste/{ano_ref}/{cod_lote}"
)

/*  =========================
	LOTE ITENS PATHS HTTP
=========================  */

const (
	LOTE_ITENS_PATH    = "/read/loteitens"
	LOTE_ITENS_ID_PATH = "/read/loteitens/{cod_lote}/{cod_item}/{cod_tipo_item}"
)

/*  =========================
	CD PATHS HTTP
=========================  */

const (
	CD_PATH    = "/read/cd"
	CD_ID_PATH = "/read/cd/{cod_ibge}"
)

/*  =========================
	CD ITENS PATHS HTTP
=========================  */

const (
	CD_ITENS_PATH    = "/read/cditens"
	CD_ITENS_ID_PATH = "/read/cditens/{cod_ibge}/{cod_item}/{cod_tipo_item}"
)

/*  =========================
	PROCESSO PATHS HTTP
=========================  */

const (
	PROCESSO_PATH    = "/read/processo"
	PROCESSO_ID_PATH = "/read/processo/{cod_processo}/{cod_ibge}"
)

/*  =========================
	UACOM PATHS HTTP
=========================  */

const (
	UACOM_PATH    = "/read/uacom"
	UACOM_ID_PATH = "/read/uacom/{cod_ibge}/{data}"
)

/*  =========================
	UACOM ASSUNTO PATHS HTTP
=========================  */

const (
	UACOM_ASSUNTO_PATH    = "/read/uacomassunto"
	UACOM_ASSUNTO_ID_PATH = "/read/uacomassunto/{cod_ibge}/{data}/{cod_assunto}"
)

/*  =========================
	ASSUNTO PATHS HTTP
=========================  */

const (
	ASSUNTO_PATH    = "/read/assunto"
	ASSUNTO_ID_PATH = "/read/assunto/{cod_assunto}"
)

/*  =========================
	ETAPAS CD PATHS HTTP
=========================  */

const (
	ETAPAS_CD_PATH    = "/read/etapascd"
	ETAPAS_CD_ID_PATH = "/read/etapascd/{cod_ibge}/{cod_etapa}"
)

/*  =========================
	ETAPA PATHS HTTP
=========================  */

const (
	ETAPA_PATH    = "/read/etapa"
	ETAPA_ID_PATH = "/read/etapa/{cod_etapa}"
)

/*  =========================
	PONTO PATHS HTTP
=========================  */

const (
	PONTO_PATH        = "/read/ponto"
	PONTO_ID_PATH     = "/read/ponto/{cod_ponto}/{cod_categoria}/{cod_ibge}"
	PONTO_PID_ID_PATH = "/read/ponto/{cod_ponto}/{cod_categoria}/{cod_ibge}/{cod_pid}"
)

/*  =========================
	PID PATHS HTTP
=========================  */

const (
	PID_PATH    = "/read/pid"
	PID_ID_PATH = "/read/pid/{cod_pid}"
)

/*	=========================
	CATEGORIA PATHS HTTP
=========================	*/
const (
	CATEGORIA_PATH    = "/read/categoria"
	CATEGORIA_ID_PATH = "/read/categoria/{cod_categoria}"
)

/*  =========================
	PID TIPOLOGIA PATHS HTTP
=========================  */

const (
	PID_TOPOLOGIA_PATH    = "/read/pidtipologia"
	PID_TOPOLOGIA_ID_PATH = "/read/pidtipologia/{cod_pid}/{cod_tipologia}"
)

/*	=========================
	TIPOLOGIA PATHS HTTP
=========================	*/

const (
	TIPOLOGIA_PATH    = "/read/tipologia"
	TIPOLOGIA_ID_PATH = "/read/tipologia/{cod_tipologia}"
)

/*  =========================
	EMPENHO PATHS HTTP
=========================  */

const (
	EMPENHO_PATH                         = "/read/empenho"
	EMPENHO_ID_PATH                      = "/read/empenho/{id_empenho}"
	EMPENHO_COD_PREVISAO_EMPENHO_ID_PATH = "/read/empenhocodprevisaoempenho/{cod_previsao_empenho}"
)

/*  =========================
	ITENS EMPENHO PATHS HTTP
=========================  */

const (
	ITENS_EMPENHO_PATH    = "/read/itensempenho/{id_empenho}/{cod_previsao_empenho}"
	ITENS_EMPENHO_ID_PATH = "/read/itensempenho/{id_empenho}/{cod_item}/{cod_tipo_item}"
)

/*	=========================
	OTB PATH HTTP
=========================	*/

const (
	OTB_PATH    = "/read/otb"
	OTB_ID_PATH = "/read/otb/{cod_otb}"
)

/*	=========================
	ITENS OTB PATH HTTP
=========================	*/

const (
	ITENS_OTB_PATH    = "/read/itensotb"
	ITENS_OTB_ID_PATH = "/read/itensotb/{cod_otb}/{num_nf}/{cod_ibge}/{id_empenho}/{cod_item}/{cod_tipo_item}"
)

/*	=========================
	FATURA PATH HTTP
=========================	*/

const (
	FATURA_PATH            = "/read/fatura"
	FATURA_ID_EMPENHO_PATH = "/read/fatura/{id_empenho}"
	FATURA_ID_PATH         = "/read/fatura/{num_nf}/{cod_ibge}"
)

/*	=========================
	FATURA OTB PATH HTTP
=========================	*/
const (
	FATURA_OTB_PATH    = "/read/faturaotb"
	FATURA_OTB_ID_PATH = "/read/faturaotb/{cod_otb}/{num_nf}/{cod_ibge}"
)

/*	=========================
	ITENS FATURA PATH HTTP
=========================	*/

const (
	ITENS_FATURA_PATH     = "/read/itensfatura"
	ITENS_FATURA_GET_PATH = "/read/itensfatura/{num_nf}/{cod_ibge}"
	ITENS_FATURA_ID_PATH  = "/read/itensfatura/{num_nf}/{cod_ibge}/{id_empenho}/{cod_item}/{cod_tipo_item}"
)

/*  =========================
	PREVISAO EMPENHO PATHS HTTP
=========================  */

const (
	PREVISAO_EMPENHO_PATH    = "/read/previsaoempenho"
	PREVISAO_EMPENHO_ID_PATH = "/read/previsaoempenho/{cod_previsao_empenho}"
)

/*  =========================
	ITENS PREVISAO EMPENHO PATHS HTTP
=========================  */

const (
	ITENS_PREVISAO_EMPENHO_PATH    = "/read/itensprevisaoempenho/{cod_previsao_empenho}/{cod_lote}"
	ITENS_PREVISAO_EMPENHO_ID_PATH = "/read/itensprevisaoempenho/{cod_previsao_empenho}/{cod_item}/{cod_tipo_item}"
)

/*	=========================
	ITENS PATHS HTTP
=========================	*/

const (
	ITENS_PATH    = "/read/itens"
	ITENS_ID_PATH = "/read/itens/{cod_item}/{cod_tipo_item}"
)

/*	=========================
	CLASSE EMPENHO PATHS HTTP
=========================	*/

const (
	CLASSE_EMPENHO_PATH    = "/read/classeempenho"
	CLASSE_EMPENHO_ID_PATH = "/read/classeempenho/{cod_classe_empenho}"
)

/*	=========================
	TIPO ITEM PATHS HTTP
=========================	*/

const (
	TIPO_ITEM_PATH    = "/read/tipoitem"
	TIPO_ITEM_ID_PATH = "/read/tipoitem/{cod_tipo_item}"
)

/*	=========================
	NATUREZA DE DESPESA PATHS HTTP
=========================	*/

const (
	NATUREZA_DESPESA_PATH    = "/read/naturezadespesa"
	NATUREZA_DESPESA_ID_PATH = "/read/naturezadespesa/{cod_natureza_despesa}"
)

/*  =========================
	MUNICIPIO PATHS HTTP
=========================  */

const (
	MUNICIPIO_PATH    = "/read/municipio"
	MUNICIPIO_ID_PATH = "/read/municipio/{cod_ibge}"
)

/*  =========================
	PREFEITOS PATHS HTTP
=========================  */

const (
	PREFEITOS_PATH    = "/read/prefeitos"
	PREFEITOS_ID_PATH = "/read/prefeitos/{cod_prefeito}"
)
