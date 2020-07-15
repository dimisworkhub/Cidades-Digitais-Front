package models

import (
	"github.com/jinzhu/gorm"
)

/*  =========================
	STRUCT PREVISAO EMPENHO
=========================  */

type PrevisaoEmpenho struct {
	CodPrevisaoEmpenho uint32 `gorm:"primary_key;foreign_key:CodPrevisaoEmpenho;auto_increment;not null" json:"cod_previsao_empenho"`
	CodLote            uint32 `gorm:"foreign_key:CodLote;not null" json:"cod_lote"`
	CodNaturezaDespesa uint32 `gorm:"foreign_key:CodNaturezaDespesa;not null" json:"cod_natureza_despesa"`
	NaturezaDespesa    string `gorm:"default:null" json:"natureza_despesa"`
	Data               string `gorm:"default:null" json:"data"`
	Tipo               string `gorm:"default:null" json:"tipo"`
	AnoReferencia      uint32 `gorm:"default:null" json:"ano_referencia"`
}

/*  =========================
	FUNCAO SALVAR PREVISAO EMPENHO
=========================  */

func (previsaoEmpenho *PrevisaoEmpenho) SavePrevisaoEmpenho(db *gorm.DB) (*PrevisaoEmpenho, error) {

	//	Adiciona um novo elemento ao banco de dados
	err := db.Debug().Create(&previsaoEmpenho).Error
	if err != nil {
		return &PrevisaoEmpenho{}, err
	}

	return previsaoEmpenho, err
}

/*  =========================
	FUNCAO LISTAR PREVISAO EMPENHO POR ID
=========================  */

func (previsaoEmpenho *PrevisaoEmpenho) FindPrevisaoEmpenhoByID(db *gorm.DB, codPrevisaoEmpenho uint32) (*PrevisaoEmpenho, error) {

	//	Busca um elemento no banco de dados a partir de sua chave primaria
	err := db.Debug().Model(PrevisaoEmpenho{}).Where("cod_previsao_empenho = ?", codPrevisaoEmpenho).Take(&previsaoEmpenho).Error
	if err != nil {
		return &PrevisaoEmpenho{}, err
	}

	return previsaoEmpenho, err
}

/*  =========================
	FUNCAO LISTAR TODAS PREVISAO EMPENHO
=========================  */

func (previsaoEmpenho *PrevisaoEmpenho) FindAllPrevisaoEmpenho(db *gorm.DB) (*[]PrevisaoEmpenho, error) {

	allPrevisaoEmpenho := []PrevisaoEmpenho{}

	// Busca todos elementos contidos no banco de dados
	err := db.Debug().Table("previsao_empenho").Select("CONCAT(natureza_despesa.cod_natureza_despesa, ' - ',natureza_despesa.descricao) AS natureza_despesa, previsao_empenho.*").
		Joins("JOIN natureza_despesa ON previsao_empenho.cod_natureza_despesa = natureza_despesa.cod_natureza_despesa ORDER BY previsao_empenho.cod_previsao_empenho ASC").Scan(&allPrevisaoEmpenho).Error
	if err != nil {
		return &[]PrevisaoEmpenho{}, err
	}

	return &allPrevisaoEmpenho, err
}

/*  =========================
	FUNCAO EDITAR PREVISAO EMPENHO
=========================  */

func (previsaoEmpenho *PrevisaoEmpenho) UpdatePrevisaoEmpenho(db *gorm.DB, codPrevisaoEmpenho uint32) (*PrevisaoEmpenho, error) {

	//	Permite a atualizacao dos campos indicados
	db = db.Debug().Exec("UPDATE previsao_empenho SET data = ?, tipo = ?, ano_referencia = ? WHERE cod_previsao_empenho = ?", previsaoEmpenho.Data, previsaoEmpenho.Tipo, previsaoEmpenho.AnoReferencia, codPrevisaoEmpenho)
	if db.Error != nil {
		return &PrevisaoEmpenho{}, db.Error
	}

	//	Busca um elemento no banco de dados a partir de sua chave primaria
	err := db.Debug().Model(&PrevisaoEmpenho{}).Where("cod_previsao_empenho = ?", codPrevisaoEmpenho).Take(&previsaoEmpenho).Error
	if err != nil {
		return &PrevisaoEmpenho{}, err
	}

	return previsaoEmpenho, err
}

/*  =========================
	FUNCAO DELETAR PREVISAO EMPENHO
=========================

func (previsaoEmpenho *PrevisaoEmpenho) DeletePrevisaoEmpenho(db *gorm.DB, codPrevisaoEmpenho uint32) error {

	//	Deleta um elemento contido no banco de dados a partir de sua chave primaria
	db = db.Debug().Model(&PrevisaoEmpenho{}).Where("cod_previsao_empenho = ?", codPrevisaoEmpenho).Take(&PrevisaoEmpenho{}).Delete(&PrevisaoEmpenho{})

	return db.Error
}

*/

/*  =========================
	FUNCAO CALCULAR VALOR EM ITENS PREVISAO EMPENHO
=========================  */

func (previsaoEmpenho *PrevisaoEmpenho) CalculoValorItensPrevisaoEmpenho(db *gorm.DB) {

	itensPrevisaoEmpenho := []ItensPrevisaoEmpenho{}
	loteItens := LoteItens{}
	reajuste := []Reajuste{}
	var perCentoOrig float32 = 1.00
	var perCentoReaj float32 = 1.00

	//	Armazena todos os ItensPrevisaoEmpenho criados pela trigger em itensPrevisaoEmpenho
	db.Debug().Table("itens_previsao_empenho").Select("cod_previsao_empenho, cod_item, cod_tipo_item, cod_lote, valor").Where("cod_previsao_empenho = ?", previsaoEmpenho.CodPrevisaoEmpenho).Scan(&itensPrevisaoEmpenho)

	//	Armazena todos os Reajustes que possuem o CodLote igual ao PrevisaoEmpenho criado
	db.Debug().Table("reajuste").Select("ano_ref, percentual").Where("cod_lote = ?", previsaoEmpenho.CodLote).Scan(&reajuste)

	//	Calcula os percentuais do tipo Original e do tipo Reajuste
	for i, data := range reajuste {
		if data.AnoRef < previsaoEmpenho.AnoReferencia {
			perCentoOrig = perCentoOrig * (1.00 + (data.Percentual / 100.00))
			if i > 0 {
				perCentoReaj = perCentoReaj * (1.00 + (reajuste[i-1].Percentual / 100.00))
			}
		}
	}

	//	Atualiza o campo Valor em ItensPrevisaoEmpenho de acordo com o tipo da operacao: Original ou Reajuste ('o' ou 'r')
	if previsaoEmpenho.Tipo == "o" {
		for i := 0; i < len(itensPrevisaoEmpenho); i++ {

			db.Debug().Table("lote_itens").Select("preco").Where("cod_lote = ? AND cod_item = ? AND cod_tipo_item = ?", itensPrevisaoEmpenho[i].CodLote, itensPrevisaoEmpenho[i].CodItem, itensPrevisaoEmpenho[i].CodTipoItem).Scan(&loteItens)

			itensPrevisaoEmpenho[i].Valor = perCentoOrig * loteItens.Preco
			db.Debug().Exec("UPDATE itens_previsao_empenho SET valor = ? WHERE cod_previsao_empenho = ? AND cod_item = ? AND cod_tipo_item = ? AND cod_lote = ?", itensPrevisaoEmpenho[i].Valor, itensPrevisaoEmpenho[i].CodPrevisaoEmpenho, itensPrevisaoEmpenho[i].CodItem, itensPrevisaoEmpenho[i].CodTipoItem, itensPrevisaoEmpenho[i].CodLote)
		}
	} else if previsaoEmpenho.Tipo == "r" {
		for i := 0; i < len(itensPrevisaoEmpenho); i++ {

			db.Debug().Table("lote_itens").Select("preco").Where("cod_lote = ? AND cod_item = ? AND cod_tipo_item = ?", itensPrevisaoEmpenho[i].CodLote, itensPrevisaoEmpenho[i].CodItem, itensPrevisaoEmpenho[i].CodTipoItem).Scan(&loteItens)

			itensPrevisaoEmpenho[i].Valor = perCentoOrig*loteItens.Preco - perCentoReaj*loteItens.Preco
			db.Debug().Exec("UPDATE itens_previsao_empenho SET valor = ? WHERE cod_previsao_empenho = ? AND cod_item = ? AND cod_tipo_item = ? AND cod_lote = ?", itensPrevisaoEmpenho[i].Valor, itensPrevisaoEmpenho[i].CodPrevisaoEmpenho, itensPrevisaoEmpenho[i].CodItem, itensPrevisaoEmpenho[i].CodTipoItem, itensPrevisaoEmpenho[i].CodLote)
		}
	}

	return
}
