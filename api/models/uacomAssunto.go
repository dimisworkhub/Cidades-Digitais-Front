package models

import "github.com/jinzhu/gorm"

/*  =========================
	STRUCT UACOM ASSUNTO
=========================  */

type UacomAssunto struct {
	CodIbge    uint32 `gorm:"primary_key;foreign_key:CodIbge;not null" json:"cod_ibge"`
	Data       string `gorm:"primary_key;foreign_key:Data;not null" json:"data"`
	CodAssunto uint32 `gorm:"primary_key;foreign_key:CodAssunto;not null" json:"cod_assunto"`
}

/*  =========================
	FUNCAO SALVAR UACOM ASSUNTO
=========================  */

func (uacomAssunto *UacomAssunto) SaveUacomAssunto(db *gorm.DB) (*UacomAssunto, error) {

	//	Adiciona um novo elemento ao banco de dados
	err := db.Debug().Create(&uacomAssunto).Error
	if err != nil {
		return &UacomAssunto{}, err
	}

	return uacomAssunto, err
}
