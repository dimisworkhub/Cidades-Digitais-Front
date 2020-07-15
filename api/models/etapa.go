package models

import (
	"errors"

	"github.com/jinzhu/gorm"
)

/*	=========================
	STRUCT ETAPA
=========================	*/

type Etapa struct {
	CodEtapa  uint32 `gorm:"primary_key;auto_increment;not null" json:"cod_etapa"`
	Descricao string `gorm:"default:null" json:"descricao"`
	Duracao   uint32 `gorm:"default:null" json:"duracao"`
	Depende   uint32 `gorm:"default:null" json:"depende"`
	Delay     uint32 `gorm:"default:null" json:"delay"`
	SetorResp string `gorm:"default:null" json:"setor_resp"`
}

/*  =========================
	FUNCAO SALVAR ETAPA
=========================  */

func (etapa *Etapa) SaveEtapa(db *gorm.DB) (*Etapa, error) {

	//	Adiciona um novo elemento ao banco de dados
	err := db.Debug().Create(&etapa).Error
	if err != nil {
		return &Etapa{}, err
	}

	return etapa, err
}

/*  =========================
	FUNCAO LISTAR ETAPA POR ID
=========================  */

func (etapa *Etapa) FindEtapaByID(db *gorm.DB, codEtapa uint32) (*Etapa, error) {

	//	Busca um elemento no banco de dados a partir de sua chave primaria
	err := db.Debug().Model(Etapa{}).Where("cod_etapa = ?", codEtapa).Take(&etapa).Error
	if err != nil {
		return &Etapa{}, err
	}

	return etapa, err
}

/*  =========================
	FUNCAO LISTAR TODAS ETAPA
=========================  */

func (etapa *Etapa) FindAllEtapa(db *gorm.DB) (*[]Etapa, error) {

	allEtapa := []Etapa{}

	// Busca todos elementos contidos no banco de dados
	err := db.Debug().Model(&Etapa{}).Find(&allEtapa).Error
	if err != nil {
		return &[]Etapa{}, err
	}

	return &allEtapa, err
}

/*  =========================
	FUNCAO EDITAR ETAPA
=========================  */

func (etapa *Etapa) UpdateEtapa(db *gorm.DB, codEtapa uint32) (*Etapa, error) {

	//	Permite a atualizacao dos campos indicados
	db = db.Debug().Exec("UPDATE etapa SET descricao = ?, duracao =?, depende = ?, delay = ?, setor_resp = ? WHERE cod_etapa = ?", etapa.Descricao, etapa.Duracao, etapa.Depende, etapa.Delay, etapa.SetorResp, codEtapa)
	if db.Error != nil {
		return &Etapa{}, db.Error
	}

	//	Busca um elemento no banco de dados a partir de sua chave primaria
	err := db.Debug().Model(&Etapa{}).Where("cod_etapa = ?", codEtapa).Take(&etapa).Error
	if err != nil {
		return &Etapa{}, err
	}

	return etapa, err
}

/*  =========================
	FUNCAO DELETAR ETAPA
=========================  */

func (etapa *Etapa) DeleteEtapa(db *gorm.DB, codEtapa uint32) error {

	//	Deleta um elemento contido no banco de dados a partir de sua chave primaria
	db = db.Debug().Model(&Etapa{}).Where("cod_etapa = ?", codEtapa).Take(&Etapa{}).Delete(&Etapa{})
	if db.Error != nil {
		if gorm.IsRecordNotFoundError(db.Error) {
			return errors.New("Etapa not found")
		}
		return db.Error
	}

	return db.Error
}
