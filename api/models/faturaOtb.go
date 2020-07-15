package models

import "github.com/jinzhu/gorm"

/*	=========================
	STRUCT FATURA OTB
=========================	*/

type FaturaOTB struct {
	CodOtb  uint32 `gorm:"primary_key;foreign_key:CodOtb;not null" json:"cod_otb"`
	NumNF   uint32 `gorm:"primary_key;foreign_key:NumNF;not null" json:"num_nf"`
	CodIbge uint32 `gorm:"primary_key;foreign_key:CodIbge;not null" json:"cod_ibge"`
}

/*  =========================
	FUNCAO SALVAR FATURA OTB
=========================  */

func (faturaOTB *FaturaOTB) SaveFaturaOTB(db *gorm.DB) (*FaturaOTB, error) {

	//	Adiciona um novo elemento no banco de dados
	err := db.Debug().Create(&faturaOTB).Error
	if err != nil {
		return &FaturaOTB{}, err
	}

	return faturaOTB, err
}

/*  =========================
	FUNCAO LISTAR FATURA OTB POR ID
=========================  */

func (faturaOTB *FaturaOTB) FindFaturaOTB(db *gorm.DB, codOtb, numNF, codIbge uint32) (*FaturaOTB, error) {

	//	Busca todos elementos contidos no banco de dados a partir de sua chave primaria
	err := db.Debug().Model(FaturaOTB{}).Where("cod_otb = ? AND num_nf = ? AND cod_ibge = ?", codOtb, numNF, codIbge).Take(&faturaOTB).Error
	if err != nil {
		return &FaturaOTB{}, err
	}

	return faturaOTB, err
}
