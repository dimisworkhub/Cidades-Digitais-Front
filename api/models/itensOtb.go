package models

import (
	"github.com/jinzhu/gorm"
)

/*	=========================
	STRUCT ITENS_OTB
=========================	*/

type ItensOTB struct {
	CodOtb      uint32  `gorm:"primary_key;foreign_key:CodOtb;not null" json:"cod_otb"`
	NumNF       uint32  `gorm:"primary_key;foreign_key:NumNF;not null" json:"num_nf"`
	CodIbge     uint32  `gorm:"primary_key;foreign_key:CodIbge;not null" json:"cod_ibge"`
	IDEmpenho   uint32  `gorm:"primary_key;foreign_key:IDEmpenho;not null" json:"id_empenho"`
	CodItem     uint32  `gorm:"primary_key;foreign_key:CodItem;not null" json:"cod_item"`
	CodTipoItem uint32  `gorm:"primary_key;foreign_key:CodTipoItem;not null" json:"cod_tipo_item"`
	Valor       float32 `gorm:"default:null" json:"valor"`
	Quantidade  float32  `gorm:"default:null" json:"quantidade"`
}

/*  =========================
	FUNCAO SALVAR ITENS OTB NO BANCO DE DADOS
=========================  */

func (itensOTB *ItensOTB) SaveItensOTB(db *gorm.DB) (*ItensOTB, error) {

	//adiciona um novo elemento no banco de dados
	err := db.Debug().Create(&itensOTB).Error
	if err != nil {
		return &ItensOTB{}, err
	}

	return itensOTB, err
}

/*  =========================
	FUNCAO LISTAR TODAS ITENS_OTB
=========================  */

func (itensOTB *ItensOTB) FindAllItensOTB(db *gorm.DB) (*[]ItensOTB, error) {

	allItensOTB := []ItensOTB{}

	//	Busca todos elementos contidos no banco de dados a partir de sua chave primaria
	err := db.Debug().Model(&ItensOTB{}).Find(&allItensOTB).Error
	if err != nil {
		return &[]ItensOTB{}, err
	}

	return &allItensOTB, err
}

/*  =========================
	FUNCAO EDITAR ITENS OTB
=========================  */

func (itensOTB *ItensOTB) UpdateItensOTB(db *gorm.DB, codOtb, numNf, codIbge, idEmpenho, codItem, codTipoItem uint32) (*ItensOTB, error) {

	//	Permite a atualizacao dos campos indicados
	db = db.Debug().Exec("UPDATE itens_otb SET valor = ?, quantidade = ? WHERE cod_otb = ? AND num_nf = ? AND  cod_ibge = ? AND id_empenho = ? AND cod_item = ?  AND cod_tipo_item = ?", itensOTB.Valor, itensOTB.Quantidade, codOtb, numNf, codIbge, idEmpenho, codItem, codTipoItem)
	if db.Error != nil {
		return &ItensOTB{}, db.Error
	}

	//	Busca um elemento no banco de dados a partir de sua chave primaria
	err := db.Debug().Model(&ItensOTB{}).Where("cod_otb = ? AND num_nf = ? AND cod_ibge = ? AND id_empenho = ? AND cod_item = ? AND cod_tipo_item = ?", codOtb, numNf, codIbge, idEmpenho, codItem, codTipoItem).Take(&itensOTB).Error
	if err != nil {
		return &ItensOTB{}, err
	}

	return itensOTB, err
}

/*  =========================
	FUNCAO DELETAR ITENS OTB
=========================  */

func (itensOTB *ItensOTB) DeleteItensOTB(db *gorm.DB, codOtb, numNf, codIbge, idEmpenho, codItem, codTipoItem uint32) error {

	//	Deleta um elemento contido no banco de dados a partir de sua chave primaria
	db = db.Debug().Model(&ItensOTB{}).Where("cod_otb = ? AND num_nf = ? AND  cod_ibge = ? AND id_empenho = ? AND cod_item = ?  AND cod_tipo_item = ?", codOtb, numNf, codIbge, idEmpenho, codItem, codTipoItem).Take(&ItensOTB{}).Delete(&ItensOTB{})

	return db.Error
}
