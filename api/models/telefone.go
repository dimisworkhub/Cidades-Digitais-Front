package models

import "github.com/jinzhu/gorm"

/*  =========================
	STRUCT TELEFONE
=========================  */

type Telefone struct {
	CodTelefone uint32 `gorm:"primary_key;auto_increment;not null;size:11" json:"cod_telefone"`
	CodContato  uint32 `gorm:"foreign_key:CodContato;not null;size:11" json:"cod_contato"`
	Telefone    string `gorm:"default:null;size:11" json:"telefone"`
	Tipo        string `gorm:"default:null;size:10" json:"tipo"`
}

/*  =========================
	FUNCAO SALVAR TELEFONE
=========================  */

func (telefone *Telefone) SaveTelefone(db *gorm.DB) (*Telefone, error) {

	//	Adiciona um novo elemento ao banco de dados
	err := db.Debug().Create(&telefone).Error
	if err != nil {
		return &Telefone{}, err
	}

	return telefone, err
}

/*  =========================
	FUNCAO LISTAR TODAS TELEFONE
=========================  */

func (telefone *Telefone) FindAllTelefone(db *gorm.DB) (*[]Telefone, error) {

	allTelefone := []Telefone{}

	// Busca todos elementos contidos no banco de dados
	err := db.Debug().Model(&Telefone{}).Find(&allTelefone).Error
	if err != nil {
		return &[]Telefone{}, err
	}

	return &allTelefone, err
}

/*  =========================
	FUNCAO DELETAR TELEFONE
=========================  */

func (telefone *Telefone) DeleteTelefone(db *gorm.DB, codTelefone uint32) error {

	//	Deleta um elemento contido no banco de dados a partir de sua chave primaria
	db = db.Debug().Model(&Telefone{}).Where("cod_telefone = ?", codTelefone).Take(&Telefone{}).Delete(&Telefone{})

	return db.Error
}
