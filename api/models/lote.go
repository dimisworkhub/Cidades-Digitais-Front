package models

import (
	"github.com/jinzhu/gorm"
)

/*  =========================
	STRUTC LOTE
=========================  */

type Lote struct {
	CodLote     uint32 `gorm:"primary_key;not null" json:"cod_lote"`
	Cnpj        string `gorm:"foreign_key:Cnpj;not null" json:"cnpj"`
	Contrato    string `gorm:"default:null" json:"contrato"`
	DtInicioVig string `gorm:"default:null" json:"dt_inicio_vig" `
	DtFinalVig  string `gorm:"default:null" json:"dt_final_vig" `
	DtReajuste  string `gorm:"default:null" json:"dt_reajuste" `
	Nome        string `gorm:"default:null" json:"nome"`
}

/*  =========================
	FUNCAO SALVAR LOTE
=========================  */

func (lote *Lote) SaveLote(db *gorm.DB) (*Lote, error) {

	//	Adiciona um novo elemento ao banco de dados
	err := db.Debug().Create(&lote).Error
	if err != nil {
		return &Lote{}, err
	}

	return lote, err
}

/*  =========================
	FUNCAO LISTAR LOTE POR ID
=========================  */

func (lote *Lote) FindLoteByID(db *gorm.DB, codLote uint32) (*Lote, error) {

	//	Busca um elemento no banco de dados a partir de sua chave primaria
	err := db.Debug().Model(Lote{}).Where("cod_lote = ?", codLote).Take(&lote).Error
	if err != nil {
		return &Lote{}, err
	}

	return lote, err
}

/*  =========================
	FUNCAO LISTAR TODOS LOTE
=========================  */

func (lote *Lote) FindAllLote(db *gorm.DB) (*[]Lote, error) {

	allLote := []Lote{}

	// Busca todos elementos contidos no banco de dados
	err := db.Debug().Table("lote").Select("entidade.nome, lote.*").
		Joins("JOIN entidade ON lote.cnpj = entidade.cnpj ORDER BY lote.cod_lote ASC").Scan(&allLote).Error
	if err != nil {
		return &[]Lote{}, err
	}

	return &allLote, err
}

/*  =========================
	FUNCAO EDITAR LOTE
=========================  */

func (lote *Lote) UpdateLote(db *gorm.DB, codLote uint32) (*Lote, error) {

	//	Permite a atualizacao dos campos indicados
	db = db.Debug().Exec("UPDATE lote SET cnpj = ?, contrato = ?, dt_inicio_vig = ?, dt_final_vig = ?, dt_reajuste = ? WHERE cod_lote = ?", lote.Cnpj, lote.Contrato, lote.DtInicioVig, lote.DtFinalVig, lote.DtReajuste, codLote)
	if db.Error != nil {
		return &Lote{}, db.Error
	}

	//	Busca um elemento no banco de dados a partir de sua chave primaria
	err := db.Debug().Model(&Lote{}).Where("cod_lote = ?", codLote).Take(&lote).Error
	if err != nil {
		return &Lote{}, err
	}

	return lote, err
}

/*  =========================
	FUNCAO DELETAR LOTE
=========================

func (lote *Lote) DeleteLote(db *gorm.DB, codLote uint32) error {

	//	Deleta um elemento contido no banco de dados a partir de sua chave primaria
	db = db.Debug().Model(&Lote{}).Where("cod_lote = ?", codLote).Take(&Lote{}).Delete(&Lote{})

	return db.Error
}
*/
