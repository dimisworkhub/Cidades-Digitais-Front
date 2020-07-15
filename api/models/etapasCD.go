package models

import "github.com/jinzhu/gorm"

/*  =========================
	STRUCT ETAPAS CD
=========================  */

type EtapasCD struct {
	CodIbge     uint32 `gorm:"primary_key;foreign_key:CodIbge;not null" json:"cod_ibge" `
	CodEtapa    uint32 `gorm:"primary_key;foreign_key:CodEtapa;not null" json:"cod_etapa" `
	DtInicio    string `gorm:"default: null" json:"dt_inicio" `
	DtFim       string `gorm:"default: null" json:"dt_fim" `
	Responsavel string `gorm:"default: null" json:"responsavel" `
}

/*  =========================
	FUNCAO SALVAR ETAPAS CD
=========================  */

func (etapasCD *EtapasCD) SaveEtapasCD(db *gorm.DB) (*EtapasCD, error) {

	err := db.Debug().Create(&etapasCD).Error
	if err != nil {
		return &EtapasCD{}, err
	}

	return etapasCD, err
}

/*  =========================
	FUNCAO LISTAR ETAPAS CD POR ID
=========================  */

func (etapasCD *EtapasCD) FindEtapasCDByID(db *gorm.DB, codIbge, codEtapa uint32) (*EtapasCD, error) {

	err := db.Debug().Model(&EtapasCD{}).Where("cod_ibge = ? AND cod_etapa = ?", codIbge, codEtapa).Take(&etapasCD).Error
	if err != nil {
		return &EtapasCD{}, err
	}

	return etapasCD, err
}

/*  =========================
	FUNCAO LISTAR TODAS ETAPAS CD
=========================  */

func (etapasCD *EtapasCD) FindAllEtapasCD(db *gorm.DB) (*[]EtapasCD, error) {

	allEtapasCD := []EtapasCD{}

	err := db.Debug().Model(&EtapasCD{}).Find(&allEtapasCD).Error
	if err != nil {
		return &[]EtapasCD{}, err
	}

	return &allEtapasCD, err
}

/*  =========================
	FUNCAO EDITAR ETAPAS CD
=========================  */

func (etapasCD *EtapasCD) UpdateEtapasCD(db *gorm.DB, codIbge, codEtapa uint32) (*EtapasCD, error) {

	db = db.Debug().Model(&EtapasCD{}).Exec("UPDATE etapas_cd SET dt_inicio = ?, dt_fim = ?, responsavel = ? WHERE cod_ibge = ? AND cod_etapa = ?", etapasCD.DtInicio, etapasCD.DtFim, etapasCD.Responsavel, codIbge, codEtapa)

	if db.Error != nil {
		return &EtapasCD{}, db.Error
	}

	err := db.Debug().Model(&EtapasCD{}).Where("cod_ibge = ? AND cod_etapa = ?", codIbge, codEtapa).Take(&etapasCD).Error
	if err != nil {
		return &EtapasCD{}, err
	}

	return etapasCD, err
}

/*  =========================
	FUNCAO DELETAR ETAPAS CD
=========================  */

func (etapasCD *EtapasCD) DeleteEtapasCD(db *gorm.DB, codIbge, codEtapa uint32) error {

	db = db.Debug().Model(&EtapasCD{}).Where("cod_ibge = ? AND cod_etapa = ?", codIbge, codEtapa).Take(&EtapasCD{}).Delete(&EtapasCD{})

	return db.Error
}

/*  =========================
	FUNCAO LISTAR PRIMARY KEY DA TABELA ETAPAS CD
=========================  */

func (etapasCD *EtapasCD) FindEtapasCDPK(db *gorm.DB) (*[]EtapasCD, error) {

	allEtapasCD := []EtapasCD{}

	err := db.Debug().Model(&EtapasCD{}).Select("cod_ibge, cod_etapa").Find(&allEtapasCD).Error
	if err != nil {
		return &[]EtapasCD{}, err
	}

	return &allEtapasCD, err
}
