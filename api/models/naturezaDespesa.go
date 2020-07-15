package models

import (
	"github.com/jinzhu/gorm"
)

/*	=========================
	STRUCT NATUREZA DE DESPESA
=========================	*/

type NaturezaDespesa struct {
	CodNaturezaDespesa uint32 `gorm:"primary_key;not null" json:"cod_natureza_despesa"`
	Descricao          string `gorm:"default:null" json:"descricao"`
}

/*  =========================
	FUNCAO SALVAR NATUREZA DESPESA
=========================  */

func (naturezaDespesa *NaturezaDespesa) SaveNaturezaDespesa(db *gorm.DB) (*NaturezaDespesa, error) {

	//	Adiciona um novo elemento ao banco de dados
	err := db.Debug().Create(&naturezaDespesa).Error
	if err != nil {
		return &NaturezaDespesa{}, err
	}

	return naturezaDespesa, err
}

/*  =========================
	FUNCAO LISTAR NATUREZA DESPESA POR ID
=========================  */

func (naturezaDespesa *NaturezaDespesa) FindNaturezaDespesaByID(db *gorm.DB, codNaturezaDespesa uint32) (*NaturezaDespesa, error) {

	//	Busca um elemento no banco de dados a partir de sua chave primaria
	err := db.Debug().Model(NaturezaDespesa{}).Where("cod_natureza_despesa = ?", codNaturezaDespesa).Take(&naturezaDespesa).Error
	if err != nil {
		return &NaturezaDespesa{}, err
	}

	return naturezaDespesa, err
}

/*  =========================
	FUNCAO LISTAR TODAS NATUREZA DESPESA
=========================  */

func (naturezaDespesa *NaturezaDespesa) FindAllNaturezaDespesa(db *gorm.DB) (*[]NaturezaDespesa, error) {

	allNaturezaDespesa := []NaturezaDespesa{}

	// Busca todos elementos contidos no banco de dados
	err := db.Debug().Model(&NaturezaDespesa{}).Find(&allNaturezaDespesa).Error
	if err != nil {
		return &[]NaturezaDespesa{}, err
	}

	return &allNaturezaDespesa, err
}

/*  =========================
	FUNCAO EDITAR NATUREZA DESPESA
=========================  */

func (naturezaDespesa *NaturezaDespesa) UpdateNaturezaDespesa(db *gorm.DB, codNaturezaDespesa uint32) (*NaturezaDespesa, error) {

	//	Permite a atualizacao dos campos indicados
	db = db.Debug().Exec("UPDATE natureza_despesa SET descricao = ? WHERE cod_natureza_despesa = ?", naturezaDespesa.Descricao, codNaturezaDespesa)
	if db.Error != nil {
		return &NaturezaDespesa{}, db.Error
	}

	//	Busca um elemento no banco de dados a partir de sua chave primaria
	err := db.Debug().Model(&NaturezaDespesa{}).Where("cod_natureza_despesa = ?", codNaturezaDespesa).Take(&naturezaDespesa).Error
	if err != nil {
		return &NaturezaDespesa{}, err
	}

	return naturezaDespesa, err
}

/*  =========================
	FUNCAO DELETAR NATUREZA DESPESA
=========================  */

func (naturezaDespesa *NaturezaDespesa) DeleteNaturezaDespesa(db *gorm.DB, codNaturezaDespesa uint32) error {

	//	Deleta um elemento contido no banco de dados a partir de sua chave primaria
	db = db.Debug().Model(&NaturezaDespesa{}).Where("cod_natureza_despesa = ?", codNaturezaDespesa).Take(&NaturezaDespesa{}).Delete(&NaturezaDespesa{})

	return db.Error
}
