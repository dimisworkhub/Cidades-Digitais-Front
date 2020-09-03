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

/*  =========================
	FUNCAO LISTAR UACOM ASSUNTO
=========================  */

func (uacomAssunto *UacomAssunto) FindAllUacomAssunto(db *gorm.DB, codIbge uint32, data string) (*[]UacomAssunto, error) {

	allUacomAssunto := []UacomAssunto{}

	//	Busca um elemento no banco de dados a partir de sua chave primaria
	err := db.Debug().Select("uacom_assunto.*").
		Where("cod_ibge = ? AND data = ?", codIbge, data).
		Order("uacom_assunto.cod_assunto").
		Scan(&allUacomAssunto).Error

	if err != nil {
		return &[]UacomAssunto{}, err
	}

	return &allUacomAssunto, err
}

/*  =========================
	FUNCAO DELETAR UACOM ASSUNTO
=========================  */

func (uacomAssunto *UacomAssunto) DeleteUacomAssunto(db *gorm.DB, codIbge uint32, data string, codAssunto uint32) error {

	//	Deleta um elemento contido no banco de dados a partir de sua chave primaria
	db = db.Debug().Model(&UacomAssunto{}).Where("cod_ibge = ? AND data = ? AND cod_assunto = ?", codIbge, data, codAssunto).Take(&Uacom{}).Delete(&UacomAssunto{})

	return db.Error
}
