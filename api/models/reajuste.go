package models

import "github.com/jinzhu/gorm"

/*  =========================
	STRUCT REAJUSTE
=========================  */

type Reajuste struct {
	AnoRef     uint32  `gorm:"primary_key;not null;size:11" json:"ano_ref"`
	CodLote    uint32  `gorm:"primary key;foreign_key:CodLote;not null;size:11" json:"cod_lote"`
	Percentual float32 `gorm:"default:null" json:"percentual"`
}

/*  =========================
	FUNCAO SALVAR REAJUSTE
=========================  */

func (reajuste *Reajuste) SaveReajuste(db *gorm.DB) (*Reajuste, error) {

	//	Adiciona um novo elemento ao banco de dados
	err := db.Debug().Create(&reajuste).Error
	if err != nil {
		return &Reajuste{}, err
	}

	return reajuste, err
}

/*  =========================
	FUNCAO LISTAR REAJUSTE POR ID
=========================  */

func (reajuste *Reajuste) FindReajusteByID(db *gorm.DB, anoRef, codLote uint32) (*Reajuste, error) {

	//	Busca um elemento no banco de dados a partir de sua chave primaria
	err := db.Debug().Model(Reajuste{}).Where("ano_ref = ? AND cod_lote = ?", anoRef, codLote).Take(&reajuste).Error
	if err != nil {
		return &Reajuste{}, err
	}

	return reajuste, err
}

/*  =========================
	FUNCAO LISTAR TODOS REAJUSTE
=========================  */

func (reajuste *Reajuste) FindAllReajuste(db *gorm.DB) (*[]Reajuste, error) {

	allReajuste := []Reajuste{}

	//	Busca todos os elementos no banco de dados
	err := db.Debug().Model(&Reajuste{}).Find(&allReajuste).Error
	if err != nil {
		return &[]Reajuste{}, err
	}

	return &allReajuste, err
}

/*  =========================
	FUNCAO EDITAR REAJUSTE
=========================  */

func (reajuste *Reajuste) UpdateReajuste(db *gorm.DB, anoRef, codLote uint32) (*Reajuste, error) {

	//	Permite a atualizacao dos campos indicados
	db = db.Debug().Exec("UPDATE reajuste SET percentual = ? WHERE ano_ref = ? AND cod_lote = ?", reajuste.Percentual, anoRef, codLote)
	if db.Error != nil {
		return &Reajuste{}, db.Error
	}

	//	Busca um elemento no banco de dados a partir de sua chave primaria
	err := db.Debug().Model(&Reajuste{}).Where("ano_ref = ? AND cod_lote = ?", anoRef, codLote).Take(&reajuste).Error
	if err != nil {
		return &Reajuste{}, err
	}

	return reajuste, err
}

/*  =========================
	FUNCAO DELETAR REAJUSTE
=========================  */

func (reajuste *Reajuste) DeleteReajuste(db *gorm.DB, anoRef, codLote uint32) error {

	//	Deleta um elemento contido no banco de dados a partir de sua chave primaria
	db = db.Debug().Model(&Reajuste{}).Where("ano_ref = ? AND cod_lote = ?", anoRef, codLote).Take(&Reajuste{}).Delete(&Reajuste{})

	return db.Error
}
