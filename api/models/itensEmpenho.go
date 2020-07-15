package models

import (
	"github.com/jinzhu/gorm"
)

/*  =========================
	STRUCT ITENS EMPENHO
=========================  */

type ItensEmpenho struct {
	IDEmpenho            uint32  `gorm:"primary_key;foreign_key:IDEmpenho;not null" json:"id_empenho"`
	CodItem              uint32  `gorm:"primary_key;foreign_key:CodItem;not null" json:"cod_item"`
	CodTipoItem          uint32  `gorm:"primary_key;foreign_key:CodTipoItem;not null" json:"cod_tipo_item"`
	CodPrevisaoEmpenho   uint32  `gorm:"foreign_key:CodPrevisaoEmpenho;not null" json:"cod_previsao_empenho"`
	CodEmpenho           string  `gorm:"not null;size:13" json:"cod_empenho"`
	Valor                float32 `gorm:"default:null" json:"valor"`
	Quantidade           float32 `gorm:"default:null" json:"quantidade"`
	Tipo                 string  `gorm:"default:null" json:"tipo"`
	Descricao            string  `gorm:"default:null" json:"descricao"`
	QuantidadeDisponivel float32 `gorm:"default:null" json:"quantidade_disponivel"`
}

/*  =========================
	FUNCAO LISTAR ITENS EMPENHO POR ID
=========================  */

func (itensEmpenho *ItensEmpenho) FindItensEmpenhoByID(db *gorm.DB, idEmpenho, codItem, codTipoItem uint32) (*ItensEmpenho, error) {

	//	Busca um elemento no banco de dados a partir de sua chave primaria
	err := db.Debug().Model(&ItensEmpenho{}).Where("id_empenho = ? AND cod_item = ? AND cod_tipo_item = ?", idEmpenho, codItem, codTipoItem).Take(&itensEmpenho).Error
	if err != nil {
		return &ItensEmpenho{}, err
	}

	return itensEmpenho, err
}

/*  =========================
	FUNCAO LISTAR TODAS ITENS EMPENHO
=========================  */

func (itensEmpenho *ItensEmpenho) FindAllItensEmpenho(db *gorm.DB, idEmpenho, codPrevisaoEmpenho uint32) (*[]ItensEmpenho, error) {

	allItensEmpenho := []ItensEmpenho{}

	// Busca todos elementos contidos no banco de dados
	err := db.Debug().Table("itens_empenho").
		Select("itens.descricao, itens_empenho.*").
		Joins("JOIN itens ON itens_empenho.cod_item = itens.cod_item AND itens_empenho.cod_tipo_item = itens.cod_tipo_item WHERE itens_empenho.id_empenho = ? AND itens_empenho.cod_previsao_empenho = ? ORDER BY cod_tipo_item, cod_item ASC", idEmpenho, codPrevisaoEmpenho).
		Scan(&allItensEmpenho).Error
	if err != nil {
		return &[]ItensEmpenho{}, err
	}

	for i, data := range allItensEmpenho {
		//	Busca um elemento no banco de dados a partir de sua chave primaria
		err := db.Debug().
			Raw("SELECT ROUND((SELECT SUM(itens_previsao_empenho.quantidade) AS quantidade_previsao_empenho FROM itens_previsao_empenho WHERE itens_previsao_empenho.cod_item = ? AND itens_previsao_empenho.cod_tipo_item = ? AND itens_previsao_empenho.cod_previsao_empenho = ?) - (SELECT SUM(itens_empenho.quantidade) AS quantidade_empenho FROM itens_empenho WHERE itens_empenho.cod_item = ? AND itens_empenho.cod_tipo_item = ? AND itens_empenho.cod_previsao_empenho = ?), 2) AS quantidade_disponivel", data.CodItem, data.CodTipoItem, codPrevisaoEmpenho, data.CodItem, data.CodTipoItem, codPrevisaoEmpenho).
			Scan(&allItensEmpenho[i]).Error
		if err != nil {
			return &[]ItensEmpenho{}, err
		}
	}

	return &allItensEmpenho, err
}

/*  =========================
	FUNCAO EDITAR ITENS EMPENHO
=========================  */

func (itensEmpenho *ItensEmpenho) UpdateItensEmpenho(db *gorm.DB, idEmpenho, codItem, codTipoItem uint32) (*ItensEmpenho, error) {

	//	Permite a atualizacao dos campos indicados
	db = db.Debug().Exec("UPDATE itens_empenho SET valor = ?, quantidade = ? WHERE id_empenho = ? AND cod_item = ? AND cod_tipo_item = ?", itensEmpenho.Valor, itensEmpenho.Quantidade, idEmpenho, codItem, codTipoItem)
	if db.Error != nil {
		return &ItensEmpenho{}, db.Error
	}

	//	Busca um elemento no banco de dados a partir de sua chave primaria
	err := db.Debug().Model(&ItensEmpenho{}).Where("id_empenho = ? AND cod_item = ? AND cod_tipo_item = ?", idEmpenho, codItem, codTipoItem).Take(&itensEmpenho).Error
	if err != nil {
		return &ItensEmpenho{}, err
	}

	//	Retorna o elemento que foi alterado
	return itensEmpenho, err
}
