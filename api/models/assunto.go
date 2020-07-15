package models

import (
	"github.com/jinzhu/gorm"
)

/*	=========================
	STRUCT ASSUNTO
=========================	*/

type Assunto struct {
	CodAssunto uint32 `gorm:"primary_key;auto_increment;not null;" json:"cod_assunto"`
	Descricao  string `gorm:"default:null" json:"descricao"`
}

/*  =========================
	FUNCAO SALVAR ASSUNTO NO BANCO DE DADOS
=========================  */

func (assunto *Assunto) SaveAssunto(db *gorm.DB) (*Assunto, error) {

	//	Adiciona um novo elemento ao banco de dados
	err := db.Debug().Create(&assunto).Error
	if err != nil {
		return &Assunto{}, err
	}

	return assunto, err
}

/*  =========================
	FUNCAO LISTAR ASSUNTO POR ID
=========================  */

func (assunto *Assunto) FindAssuntoByID(db *gorm.DB, codAssunto uint32) (*Assunto, error) {

	//	Busca um elemento no banco de dados a partir de sua chave primaria
	err := db.Debug().Model(&Assunto{}).Where("cod_assunto = ?", codAssunto).Take(&assunto).Error
	if err != nil {
		return &Assunto{}, err
	}

	return assunto, err
}

/*  =========================
	FUNCAO LISTAR TODOS ASSUNTOS
=========================  */

func (assunto *Assunto) FindAllAssunto(db *gorm.DB) (*[]Assunto, error) {

	allAssunto := []Assunto{}

	// Busca todos elementos contidos no banco de dados
	err := db.Debug().Model(&Assunto{}).Find(&allAssunto).Error
	if err != nil {
		return &[]Assunto{}, err
	}

	return &allAssunto, err
}

/*  =========================
	FUNCAO EDITAR ASSUNTO
=========================  */

func (assunto *Assunto) UpdateAssunto(db *gorm.DB, codAssunto uint32) (*Assunto, error) {

	//	Permite a atualizacao dos campos indicados
	db = db.Debug().Exec("UPDATE assunto SET descricao = ? WHERE cod_assunto = ?", assunto.Descricao, codAssunto)
	if db.Error != nil {
		return &Assunto{}, db.Error
	}

	//	Busca um elemento no banco de dados a partir de sua chave primaria
	err := db.Debug().Model(&Assunto{}).Where("cod_assunto = ?", codAssunto).Take(&assunto).Error
	if err != nil {
		return &Assunto{}, err
	}

	return assunto, err
}

/*  =========================
	FUNCAO DELETAR ASSUNTO POR ID
=========================  */

func (assunto *Assunto) DeleteAssunto(db *gorm.DB, codAssunto uint32) error {

	//	Deleta um elemento contido no banco de dados a partir de sua chave primaria
	db = db.Debug().Model(&Assunto{}).Where("cod_assunto = ?", codAssunto).Take(&Assunto{}).Delete(&Assunto{})

	return db.Error
}
