package models

import "github.com/jinzhu/gorm"

/*	=========================
		TABELA TIPOLOGIA
=========================	*/

type Tipologia struct {
	CodTipologia uint32 `gorm:"primary_key;auto_increment;not null" json:"cod_tipologia"`
	Descricao    string `gorm:"default:null" json:"descricao"`
}

/*  =========================
	FUNCAO SALVAR TIPOLOGIA
=========================  */

func (tipologia *Tipologia) SaveTipologia(db *gorm.DB) (*Tipologia, error) {

	//	Adiciona um novo elemento ao banco de dados
	err := db.Debug().Create(&tipologia).Error
	if err != nil {
		return &Tipologia{}, err
	}

	return tipologia, err
}

/*  =========================
	FUNCAO LISTAR TIPOLOGIA POR ID
=========================  */

func (tipologia *Tipologia) FindTipologiaByID(db *gorm.DB, codTipologia uint32) (*Tipologia, error) {

	//	Busca um elemento no banco de dados a partir de sua chave primaria
	err := db.Debug().Model(Tipologia{}).Where("cod_tipologia = ?", codTipologia).Take(&tipologia).Error

	if err != nil {
		return &Tipologia{}, err
	}

	return tipologia, err
}

/*  =========================
	FUNCAO LISTAR TODAS TIPOLOGIA
=========================  */

func (tipologia *Tipologia) FindAllTipologia(db *gorm.DB) (*[]Tipologia, error) {

	allTipologia := []Tipologia{}

	// Busca todos elementos contidos no banco de dados
	err := db.Debug().Model(&Tipologia{}).Find(&allTipologia).Error
	if err != nil {
		return &[]Tipologia{}, err
	}

	return &allTipologia, err
}

/*  =========================
	FUNCAO EDITAR TIPOLOGIA
=========================  */

func (tipologia *Tipologia) UpdateTipologia(db *gorm.DB, codTipologia uint32) (*Tipologia, error) {

	//	Permite a atualizacao dos campos indicados
	db = db.Debug().Exec("UPDATE tipologia SET descricao = ? WHERE cod_tipologia = ?", tipologia.Descricao, codTipologia)
	if db.Error != nil {
		return &Tipologia{}, db.Error
	}

	//	Busca um elemento no banco de dados a partir de sua chave primaria
	err := db.Debug().Model(&Tipologia{}).Where("cod_tipologia = ?", codTipologia).Take(&tipologia).Error
	if err != nil {
		return &Tipologia{}, err
	}

	return tipologia, err
}

/*  =========================
	FUNCAO DELETAR TIPOLOGIA POR ID
=========================  */

func (tipologia *Tipologia) DeleteTipologia(db *gorm.DB, codTipologia uint32) error {

	//	Deleta um elemento contido no banco de dados a partir de sua chave primaria
	db = db.Debug().Model(&Tipologia{}).Where("cod_tipologia = ?", codTipologia).Take(&Tipologia{}).Delete(&Tipologia{})

	return db.Error
}
