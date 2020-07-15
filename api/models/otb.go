package models

import (
	"github.com/jinzhu/gorm"
)

/*	=========================
		STRUCT OTB
=========================	*/

type OTB struct {
	CodOtb uint32 `gorm:"primary_key;not null" json:"cod_otb"`
	DtPgto string `gorm:"default:null" json:"dt_pgto" `
}

/*  =========================
	FUNCAO SALVAR OTB NO BANCO DE DADOS
=========================  */

func (otb *OTB) SaveOTB(db *gorm.DB) (*OTB, error) {

	//	Adiciona um novo elemento ao banco de dados
	err := db.Debug().Create(&otb).Error
	if err != nil {
		return &OTB{}, err
	}

	return otb, err
}

/*  =========================
	FUNCAO LISTAR OTB POR ID
=========================  */

func (otb *OTB) FindOTBByID(db *gorm.DB, CodOTB uint32) (*OTB, error) {

	//	Busca um elemento no banco de dados a partir de sua chave primaria
	err := db.Debug().Model(OTB{}).Where("cod_otb = ?", CodOTB).Take(&otb).Error
	if err != nil {
		return &OTB{}, err
	}

	return otb, err
}

/*  =========================
	FUNCAO LISTAR TODAS OTB
=========================  */

func (otb *OTB) FindAllOTB(db *gorm.DB) (*[]OTB, error) {

	allOTB := []OTB{}

	// Busca todos elementos contidos no banco de dados
	err := db.Debug().Model(&OTB{}).Find(&allOTB).Error
	if err != nil {
		return &[]OTB{}, err
	}

	return &allOTB, err
}

/*  =========================
	FUNCAO EDITAR OTB
=========================  */

func (otb *OTB) UpdateOTB(db *gorm.DB, CodOTB uint32) (*OTB, error) {

	//	Permite a atualizacao dos campos indicados
	db = db.Debug().Exec("UPDATE otb SET dt_pgto = ? WHERE cod_otb = ?", otb.DtPgto, CodOTB)
	if db.Error != nil {
		return &OTB{}, db.Error
	}

	//	Busca um elemento no banco de dados a partir de sua chave primaria
	err := db.Debug().Model(&OTB{}).Where("cod_otb = ?", CodOTB).Take(&otb).Error
	if err != nil {
		return &OTB{}, err
	}

	return otb, err
}

/*  =========================
	FUNCAO DELETAR OTB
=========================  */

func (otb *OTB) DeleteOTB(db *gorm.DB, CodOTB uint32) error {

	//	Deleta um elemento contido no banco de dados a partir de sua chave primaria
	db = db.Debug().Model(&OTB{}).Where("cod_otb = ?", CodOTB).Take(&OTB{}).Delete(&OTB{})

	return db.Error
}
