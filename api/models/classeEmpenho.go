package models

import (
	"github.com/jinzhu/gorm"
)

/*	=========================
		STRUCT CLASSE EMPENHO
=========================	*/

type ClasseEmpenho struct {
	CodClasseEmpenho uint32 `gorm:"primary_key;not null" json:"cod_classe_empenho"`
	Descricao        string `gorm:"default:null" json:"descricao"`
}

/*  =========================
	FUNCAO SALVAR CLASSE EMPENHO
=========================  */

func (classeEmpenho *ClasseEmpenho) SaveClasseEmpenho(db *gorm.DB) (*ClasseEmpenho, error) {

	//	Adiciona um novo elemento ao banco de dados
	err := db.Debug().Create(&classeEmpenho).Error
	if err != nil {
		return &ClasseEmpenho{}, err
	}

	return classeEmpenho, err
}

/*  =========================
	FUNCAO LISTAR CLASSE EMPENHO POR ID
=========================  */

func (classeEmpenho *ClasseEmpenho) FindClasseEmpenhoByID(db *gorm.DB, codClasseEmpenho uint32) (*ClasseEmpenho, error) {

	//	Busca um elemento no banco de dados a partir de sua chave primaria
	err := db.Debug().Model(&ClasseEmpenho{}).Where("cod_classe_empenho = ?", codClasseEmpenho).Take(&classeEmpenho).Error
	if err != nil {
		return &ClasseEmpenho{}, err
	}

	return classeEmpenho, err
}

/*  =========================
	FUNCAO LISTAR TODAS CLASSE EMPENHO
=========================  */

func (classeEmpenho *ClasseEmpenho) FindAllClasseEmpenho(db *gorm.DB) (*[]ClasseEmpenho, error) {

	allClasseEmpenho := []ClasseEmpenho{}

	// Busca todos elementos contidos no banco de dados
	err := db.Debug().Model(&ClasseEmpenho{}).Find(&allClasseEmpenho).Error
	if err != nil {
		return &[]ClasseEmpenho{}, err
	}

	return &allClasseEmpenho, err
}

/*  =========================
	FUNCAO EDITAR CLASSE EMPENHO
=========================  */

func (classeEmpenho *ClasseEmpenho) UpdateClasseEmpenho(db *gorm.DB, codClasseEmpenho uint32) (*ClasseEmpenho, error) {

	//	Permite a atualizacao dos campos indicados
	db = db.Debug().Exec("UPDATE classe_empenho SET descricao = ? WHERE cod_classe_empenho = ?", classeEmpenho.Descricao, codClasseEmpenho)
	if db.Error != nil {
		return &ClasseEmpenho{}, db.Error
	}

	//	Busca um elemento no banco de dados a partir de sua chave primaria
	err := db.Debug().Model(&ClasseEmpenho{}).Where("cod_classe_empenho = ?", codClasseEmpenho).Take(&classeEmpenho).Error
	if err != nil {
		return &ClasseEmpenho{}, err
	}

	return classeEmpenho, err
}

/*  =========================
	FUNCAO DELETAR CLASSE EMPENHO
=========================  */

func (classeEmpenho *ClasseEmpenho) DeleteClasseEmpenho(db *gorm.DB, codClasseEmpenho uint32) error {

	//	Deleta um elemento contido no banco de dados a partir de sua chave primaria
	db = db.Debug().Model(&ClasseEmpenho{}).Where("cod_classe_empenho = ?", codClasseEmpenho).Take(&ClasseEmpenho{}).Delete(&ClasseEmpenho{})

	return db.Error
}
