package models

import (
	"strconv"

	"github.com/jinzhu/gorm"
)

/*  =========================
	STRUTC ITENS PREVISAO EMPENHO
=========================  */

type ItensPrevisaoEmpenho struct {
	CodPrevisaoEmpenho   uint32  `gorm:"primary_key;foreign_key:CodPrevisaoEmpenho;not null" json:"cod_previsao_empenho"`
	CodItem              uint32  `gorm:"primary_key;foreign_key:CodItem;not null" json:"cod_item"`
	CodTipoItem          uint32  `gorm:"primary_key;foreign_key:CodTipo_item;not null" json:"cod_tipo_item"`
	CodLote              uint32  `gorm:"foreign_key:CodLote;not null" json:"cod_lote"`
	Valor                float32 `gorm:"default:null" json:"valor"`
	Quantidade           float32 `gorm:"default:null" json:"quantidade"`
	Descricao            string  `gorm:"default:null" json:"descricao"`
	QuantidadeDisponivel float32 `gorm:"default:null" json:"quantidade_disponivel"`
}

/*  =========================
	FUNCAO LISTAR ITENS PREVISAO EMPENHO POR ID
=========================  */

func (itensPrevisaoEmpenho *ItensPrevisaoEmpenho) FindItensPrevisaoEmpenhoByID(db *gorm.DB, codPrevisaoEmpenho, codItem, codTipoItem uint32) (*ItensPrevisaoEmpenho, error) {

	//	Busca um elemento no banco de dados a partir de sua chave primaria
	err := db.Debug().Model(&ItensPrevisaoEmpenho{}).Where("cod_previsao_empenho = ? AND cod_item = ? AND cod_tipo_item = ?", codPrevisaoEmpenho, codItem, codTipoItem).Take(&itensPrevisaoEmpenho).Error

	if err != nil {
		return &ItensPrevisaoEmpenho{}, err
	}

	return itensPrevisaoEmpenho, err
}

/*  =========================
	FUNCAO LISTAR TODOS ITENS PREVISAO EMPENHO
=========================  */

func (itensPrevisaoEmpenho *ItensPrevisaoEmpenho) FindAllItensPrevisaoEmpenho(db *gorm.DB, codPrevisaoEmpenho, codLote uint32) (*[]ItensPrevisaoEmpenho, error) {

	allItensPrevisaoEmpenho := []ItensPrevisaoEmpenho{}
	previsaoEmpenho := PrevisaoEmpenho{}
	itensFatura := ItensFatura{}
	var quantidadeDisponivel float32 = 0.00

	//	Busca todos elementos contidos no banco de dados
	err := db.Debug().Table("itens_previsao_empenho").
		Select("itens.descricao, itens_previsao_empenho.*").
		Joins("JOIN itens ON itens_previsao_empenho.cod_item = itens.cod_item AND itens_previsao_empenho.cod_tipo_item = itens.cod_tipo_item WHERE itens_previsao_empenho.cod_previsao_empenho = ? AND itens_previsao_empenho.cod_lote = ? ORDER BY cod_tipo_item, cod_item ASC", codPrevisaoEmpenho, codLote).
		Scan(&allItensPrevisaoEmpenho).Error
	if err != nil {
		return &[]ItensPrevisaoEmpenho{}, err
	}

	db.Debug().Select("previsao_empenho.*").Where("previsao_empenho.cod_previsao_empenho = ?", codPrevisaoEmpenho).Take(&previsaoEmpenho)

	//	dataFatura será usado para o calculo de Quantidade disponivel, em itens faturados
	dataFatura := (strconv.Itoa(int(previsaoEmpenho.AnoReferencia)) + "-08-01")

	/*	SELECT de SOMA da funcao FindAllItensPrevisaoEmpenho para o tipo Original

		-- Traz quantidade disponivel de um item para ser usado em uma previsão de empenho que seja to tipo original (ou seja primeira vez que usa o item).
		-- Esse calculo pega a soma dos itens das cidades (no projeto executivo) de um lote e subtrai pelos itens (tipo original) das previsões de empenho de um lote.
		SELECT ROUND(
			-- Descobre qual é a quantidade total de um item que um lote possui,
			-- Seleciona um item especifico (ex - 1.1) e soma a quantidade de acordo com  a especificada no "projeto executivo" (conferir se é mesmo). Essa soma de itens é por lote então deve-se pegar os itens de todas as cidades do lote
			-- Ex: Previsão empenho = 5, cod_item = 1, cod_tipo_item = 1, o lote descoberto 16, e descobre todas as cidades deste lote
			(
			SELECT SUM(cd_itens.quantidade_projeto_executivo) AS quantidade_total_cd_itens
			FROM itens_previsao_empenho
			INNER JOIN cd ON itens_previsao_empenho.cod_lote = cd.cod_lote
			INNER JOIN cd_itens ON cd.cod_ibge = cd_itens.cod_ibge AND itens_previsao_empenho.cod_item = cd_itens.cod_item AND itens_previsao_empenho.cod_tipo_item = cd_itens.cod_tipo_item
			WHERE itens_previsao_empenho.cod_previsao_empenho = 5 AND itens_previsao_empenho.cod_item = 1 AND itens_previsao_empenho.cod_tipo_item = 1
			)
			-
			-- Descobre qual é a quantidade total de um item que já foi previsto para empenho, levando em consideração apenas as previsões do tipo original
			-- Seleciona um item especifico (ex - 1.1) e soma a quantidade. Essa soma de itens é por lote então deve-se pegar todas as previsões de empenho do lote
			-- Ex: Lote = 16, cod_item = 1, cod_tipo_item = 1, descobre todas as previsões de empenho deste lote
			(
			SELECT SUM(itens_previsao_empenho.quantidade) AS total_quantidade_previsao_empenho
			FROM itens_previsao_empenho
			INNER JOIN previsao_empenho ON itens_previsao_empenho.cod_previsao_empenho = previsao_empenho.cod_previsao_empenho AND itens_previsao_empenho.cod_lote = previsao_empenho.cod_lote
			WHERE itens_previsao_empenho.cod_item = 1 AND itens_previsao_empenho.cod_tipo_item = 1 AND itens_previsao_empenho.cod_lote = 16 AND previsao_empenho.tipo = 'o'
			)
		, 2) AS quantidade_disponivel
	*/

	if previsaoEmpenho.Tipo == "o" {
		for i, data := range allItensPrevisaoEmpenho {

			//	Casos especias de itens originais, itens 8.x, 9.x e 10.x, com x [1,5]
			if allItensPrevisaoEmpenho[i].CodTipoItem == 8 || allItensPrevisaoEmpenho[i].CodTipoItem == 9 || allItensPrevisaoEmpenho[i].CodTipoItem == 10 {

				/* ---------------	Quantidade Total Disponivel em ItensPrevisaoEmpenho -----------------*/

				/* ITEM 8.x */
				//	 cd_itens.quantidade_projeto_executivo * lote_itens.preco - itens_previsao_empenho.quantidade * lote_itens.preco item 8.x
				db.Debug().
					Raw("SELECT ROUND((SELECT SUM(cd_itens.quantidade_projeto_executivo * lote_itens.preco) AS quantidade_total_cd_itens FROM itens_previsao_empenho INNER JOIN cd ON itens_previsao_empenho.cod_lote = cd.cod_lote INNER JOIN cd_itens ON cd.cod_ibge = cd_itens.cod_ibge AND itens_previsao_empenho.cod_item = cd_itens.cod_item AND itens_previsao_empenho.cod_tipo_item = cd_itens.cod_tipo_item INNER JOIN lote_itens ON itens_previsao_empenho.cod_lote = lote_itens.cod_lote AND itens_previsao_empenho.cod_item = lote_itens.cod_item AND itens_previsao_empenho.cod_tipo_item = lote_itens.cod_tipo_item WHERE itens_previsao_empenho.cod_previsao_empenho = ? AND itens_previsao_empenho.cod_tipo_item = 8 AND itens_previsao_empenho.cod_item = ?) - (SELECT SUM(itens_previsao_empenho.quantidade * lote_itens.preco) AS total_quantidade_previsao_empenho FROM itens_previsao_empenho INNER JOIN previsao_empenho ON itens_previsao_empenho.cod_previsao_empenho = previsao_empenho.cod_previsao_empenho AND itens_previsao_empenho.cod_lote = previsao_empenho.cod_lote INNER JOIN lote_itens ON itens_previsao_empenho.cod_lote = lote_itens.cod_lote AND itens_previsao_empenho.cod_item = lote_itens.cod_item AND itens_previsao_empenho.cod_tipo_item = lote_itens.cod_tipo_item WHERE itens_previsao_empenho.cod_tipo_item = 8 AND itens_previsao_empenho.cod_item = ? AND itens_previsao_empenho.cod_lote = ? AND previsao_empenho.tipo = 'o'), 2) AS quantidade_disponivel", data.CodPrevisaoEmpenho, data.CodItem, data.CodItem, data.CodLote).
					Scan(&itensPrevisaoEmpenho)

				//	QuantidadeDisponivel recebe item 8.x
				quantidadeDisponivel = itensPrevisaoEmpenho.QuantidadeDisponivel

				/* ITEM 9.x */
				//	 cd_itens.quantidade_projeto_executivo * lote_itens.preco - itens_previsao_empenho.quantidade * lote_itens.preco item 9.x
				db.Debug().
					Raw("SELECT ROUND((SELECT SUM(cd_itens.quantidade_projeto_executivo * lote_itens.preco) AS quantidade_total_cd_itens FROM itens_previsao_empenho INNER JOIN cd ON itens_previsao_empenho.cod_lote = cd.cod_lote INNER JOIN cd_itens ON cd.cod_ibge = cd_itens.cod_ibge AND itens_previsao_empenho.cod_item = cd_itens.cod_item AND itens_previsao_empenho.cod_tipo_item = cd_itens.cod_tipo_item INNER JOIN lote_itens ON itens_previsao_empenho.cod_lote = lote_itens.cod_lote AND itens_previsao_empenho.cod_item = lote_itens.cod_item AND itens_previsao_empenho.cod_tipo_item = lote_itens.cod_tipo_item WHERE itens_previsao_empenho.cod_previsao_empenho = ? AND itens_previsao_empenho.cod_tipo_item = 9 AND itens_previsao_empenho.cod_item = ?) - (SELECT SUM(itens_previsao_empenho.quantidade * lote_itens.preco) AS total_quantidade_previsao_empenho FROM itens_previsao_empenho INNER JOIN previsao_empenho ON itens_previsao_empenho.cod_previsao_empenho = previsao_empenho.cod_previsao_empenho AND itens_previsao_empenho.cod_lote = previsao_empenho.cod_lote INNER JOIN lote_itens ON itens_previsao_empenho.cod_lote = lote_itens.cod_lote AND itens_previsao_empenho.cod_item = lote_itens.cod_item AND itens_previsao_empenho.cod_tipo_item = lote_itens.cod_tipo_item WHERE itens_previsao_empenho.cod_tipo_item = 9 AND itens_previsao_empenho.cod_item = ? AND itens_previsao_empenho.cod_lote = ? AND previsao_empenho.tipo = 'o'), 2) AS quantidade_disponivel", data.CodPrevisaoEmpenho, data.CodItem, data.CodItem, data.CodLote).
					Scan(&itensPrevisaoEmpenho)

				//	QuantidadeDisponivel recebe quantidade*preco do item 9.x
				quantidadeDisponivel += itensPrevisaoEmpenho.QuantidadeDisponivel

				/* ITEM 10.x */
				//	 cd_itens.quantidade_projeto_executivo * lote_itens.preco - itens_previsao_empenho.quantidade * lote_itens.preco item 10.x
				db.Debug().
					Raw("SELECT ROUND((SELECT SUM(cd_itens.quantidade_projeto_executivo * lote_itens.preco) AS quantidade_total_cd_itens FROM itens_previsao_empenho INNER JOIN cd ON itens_previsao_empenho.cod_lote = cd.cod_lote INNER JOIN cd_itens ON cd.cod_ibge = cd_itens.cod_ibge AND itens_previsao_empenho.cod_item = cd_itens.cod_item AND itens_previsao_empenho.cod_tipo_item = cd_itens.cod_tipo_item INNER JOIN lote_itens ON itens_previsao_empenho.cod_lote = lote_itens.cod_lote AND itens_previsao_empenho.cod_item = lote_itens.cod_item AND itens_previsao_empenho.cod_tipo_item = lote_itens.cod_tipo_item WHERE itens_previsao_empenho.cod_previsao_empenho = ? AND itens_previsao_empenho.cod_tipo_item = 10 AND itens_previsao_empenho.cod_item = ?) - (SELECT SUM(itens_previsao_empenho.quantidade * lote_itens.preco) AS total_quantidade_previsao_empenho FROM itens_previsao_empenho INNER JOIN previsao_empenho ON itens_previsao_empenho.cod_previsao_empenho = previsao_empenho.cod_previsao_empenho AND itens_previsao_empenho.cod_lote = previsao_empenho.cod_lote INNER JOIN lote_itens ON itens_previsao_empenho.cod_lote = lote_itens.cod_lote AND itens_previsao_empenho.cod_item = lote_itens.cod_item AND itens_previsao_empenho.cod_tipo_item = lote_itens.cod_tipo_item WHERE itens_previsao_empenho.cod_tipo_item = 10 AND itens_previsao_empenho.cod_item = ? AND itens_previsao_empenho.cod_lote = ? AND previsao_empenho.tipo = 'o'), 2) AS quantidade_disponivel", data.CodPrevisaoEmpenho, data.CodItem, data.CodItem, data.CodLote).
					Scan(&itensPrevisaoEmpenho)

				//	QuantidadeDisponivel recebe quantidade*preco do item 10.x
				quantidadeDisponivel += itensPrevisaoEmpenho.QuantidadeDisponivel

				/* --------- Quantidade Disponivel para Reajuste ----------------*/
				//	Busca o Lote_Itens.Preco do item em questao e retorna a quantidade disponivel que sera consumida
				db.Debug().
					Raw("SELECT ROUND((? / lote_itens.preco ), 2) AS quantidade_disponivel FROM itens_previsao_empenho INNER JOIN lote_itens ON itens_previsao_empenho.cod_lote = lote_itens.cod_lote AND itens_previsao_empenho.cod_tipo_item = lote_itens.cod_tipo_item AND itens_previsao_empenho.cod_item = lote_itens.cod_item WHERE itens_previsao_empenho.cod_previsao_empenho = ? AND itens_previsao_empenho.cod_lote = ? AND itens_previsao_empenho.cod_tipo_item = ? AND itens_previsao_empenho.cod_item = ?", quantidadeDisponivel, data.CodPrevisaoEmpenho, data.CodLote, data.CodTipoItem, data.CodItem).
					Scan(&itensPrevisaoEmpenho)

				//	Quantidade Disponivel apos os calculos eh retonada ao campo
				allItensPrevisaoEmpenho[i].QuantidadeDisponivel = itensPrevisaoEmpenho.QuantidadeDisponivel

			} else {
				//	Busca um elemento no banco de dados a partir de sua chave primaria
				err := db.Debug().
					Raw("SELECT ROUND((SELECT SUM(cd_itens.quantidade_previsto) AS quantidade_total_cd_itens FROM itens_previsao_empenho INNER JOIN cd ON itens_previsao_empenho.cod_lote = cd.cod_lote INNER JOIN cd_itens ON cd.cod_ibge = cd_itens.cod_ibge AND itens_previsao_empenho.cod_item = cd_itens.cod_item AND itens_previsao_empenho.cod_tipo_item = cd_itens.cod_tipo_item WHERE itens_previsao_empenho.cod_previsao_empenho = ? AND itens_previsao_empenho.cod_item = ? AND itens_previsao_empenho.cod_tipo_item = ?) - (SELECT IFNULL(SUM(itens_previsao_empenho.quantidade), 0) AS total_quantidade_previsao_empenho FROM itens_previsao_empenho INNER JOIN previsao_empenho ON itens_previsao_empenho.cod_previsao_empenho = previsao_empenho.cod_previsao_empenho AND itens_previsao_empenho.cod_lote = previsao_empenho.cod_lote WHERE itens_previsao_empenho.cod_item = ? AND itens_previsao_empenho.cod_tipo_item = ? AND itens_previsao_empenho.cod_lote = ? AND previsao_empenho.tipo = 'o'), 2) AS quantidade_disponivel", codPrevisaoEmpenho, data.CodItem, data.CodTipoItem, data.CodItem, data.CodTipoItem, codLote).
					Scan(&allItensPrevisaoEmpenho[i]).Error
				if err != nil {
					return &[]ItensPrevisaoEmpenho{}, err
				}
			}
		}
	} else {
		for i, data := range allItensPrevisaoEmpenho {

			//	Quantidade Total Disponivel em itens_previsao_empenho  nos anos anteriores
			db.Debug().
				Raw("SELECT ROUND(SUM(itens_previsao_empenho.quantidade), 2) AS quantidade_disponivel FROM previsao_empenho INNER JOIN itens_previsao_empenho ON previsao_empenho.cod_previsao_empenho = itens_previsao_empenho.cod_previsao_empenho WHERE previsao_empenho.cod_lote = ? AND previsao_empenho.ano_referencia < ? AND previsao_empenho.tipo = 'o' AND itens_previsao_empenho.cod_tipo_item = ? AND itens_previsao_empenho.cod_item = ?", data.CodLote, previsaoEmpenho.AnoReferencia, data.CodTipoItem, data.CodItem).
				Scan(&itensPrevisaoEmpenho)

			// QuantidadeDisponivel eh alimentada pelo retorno de soma do SELECT
			quantidadeDisponivel = itensPrevisaoEmpenho.QuantidadeDisponivel

			//	Quantidade Faturado em itens_fatura nos anos anteriores
			db.Debug().
				Raw("SELECT IFNULL(ROUND(SUM(itens_fatura.quantidade), 2), 0) AS quantidade_disponivel FROM previsao_empenho INNER JOIN itens_empenho ON previsao_empenho.cod_previsao_empenho = itens_empenho.cod_previsao_empenho INNER JOIN itens_fatura ON itens_empenho.id_empenho = itens_fatura.id_empenho AND itens_empenho.cod_tipo_item = itens_fatura.cod_tipo_item AND itens_empenho.cod_item = itens_fatura.cod_item INNER JOIN fatura ON itens_fatura.num_nf = fatura.num_nf AND itens_fatura.cod_ibge = fatura.cod_ibge WHERE previsao_empenho.cod_lote = ? AND previsao_empenho.ano_referencia < ? AND previsao_empenho.tipo = 'o' AND itens_fatura.cod_tipo_item = ? AND itens_fatura.cod_item = ? AND fatura.dt_nf < ?", data.CodLote, previsaoEmpenho.AnoReferencia, data.CodTipoItem, data.CodItem, dataFatura).
				Scan(&itensFatura)

			// QuantidadeDisponivel = Quantidade Total Disponivel - Quantidade Faturado
			quantidadeDisponivel -= itensFatura.QuantidadeDisponivel

			//	Quantidade Reajustado em itens_previsao_empenho no ano atual
			db.Debug().
				Raw("SELECT IFNULL(ROUND(SUM(itens_previsao_empenho.quantidade), 2), 0) AS quantidade_disponivel FROM previsao_empenho INNER JOIN itens_previsao_empenho ON previsao_empenho.cod_previsao_empenho = itens_previsao_empenho.cod_previsao_empenho WHERE previsao_empenho.cod_lote = ? AND previsao_empenho.ano_referencia = ? AND previsao_empenho.tipo = 'r' AND itens_previsao_empenho.cod_tipo_item = ? AND itens_previsao_empenho.cod_item = ?", data.CodLote, previsaoEmpenho.AnoReferencia, data.CodTipoItem, data.CodItem).
				Scan(&itensPrevisaoEmpenho)

			// QuantidadeDisponivel = Quantidade Total Disponivel - Quantidade Faturado - Quantidade Reajustado
			quantidadeDisponivel -= itensPrevisaoEmpenho.QuantidadeDisponivel

			//	Quantidade Disponivel apos os calculos eh retonada ao campo
			allItensPrevisaoEmpenho[i].QuantidadeDisponivel = quantidadeDisponivel

		}
	}

	return &allItensPrevisaoEmpenho, err
}

/*  =========================
	FUNCAO EDITAR ITENS PREVISAO EMPENHO
=========================  */

func (itensPrevisaoEmpenho *ItensPrevisaoEmpenho) UpdateItensPrevisaoEmpenho(db *gorm.DB, codPrevisaoEmpenho, codItem, codTipoItem uint64) (*ItensPrevisaoEmpenho, error) {

	//	Permite a atualizacao dos campos indicados
	db = db.Debug().Exec("UPDATE itens_previsao_empenho SET valor = ?, quantidade = ? WHERE cod_previsao_empenho = ? AND cod_item = ? AND cod_tipo_item = ?", itensPrevisaoEmpenho.Valor, itensPrevisaoEmpenho.Quantidade, codPrevisaoEmpenho, codItem, codTipoItem)
	if db.Error != nil {
		return &ItensPrevisaoEmpenho{}, db.Error
	}

	//	Busca um elemento no banco de dados a partir de sua chave primaria
	err := db.Debug().Model(&ItensPrevisaoEmpenho{}).Where("cod_previsao_empenho = ? AND cod_item = ? AND cod_tipo_item = ?", codPrevisaoEmpenho, codItem, codTipoItem).Take(&itensPrevisaoEmpenho).Error
	if err != nil {
		return &ItensPrevisaoEmpenho{}, err
	}

	return itensPrevisaoEmpenho, err
}
