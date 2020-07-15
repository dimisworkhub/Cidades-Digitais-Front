package models

import "github.com/jinzhu/gorm"

/*  =========================
	PID TIPOLOGIA
=========================  */

type PidTipologia struct {
	CodPid       uint32 `gorm:"primary_key;foreign_key:CodPid;not null" json:"cod_pid"`
	CodTipologia uint32 `gorm:"primary_key;foreign_key:CodTipologia;not null" json:"cod_tipologia"`
}

/*  =========================
	FUNCAO SALVAR PID TIPOLOGIA
=========================  */

func (pidTipologia *PidTipologia) SavePidTipologia(db *gorm.DB) (*PidTipologia, error) {

	//	Adiciona um novo elemento ao banco de dados
	err := db.Debug().Create(&pidTipologia).Error
	if err != nil {
		return &PidTipologia{}, err
	}

	return pidTipologia, err
}

/*  =========================
	FUNCAO LISTAR TODAS PID TIPOLOGIA
=========================  */

func (pidTipologia *PidTipologia) FindAllPidTipologia(db *gorm.DB) (*[]PidTipologia, error) {

	allPIDTipologia := []PidTipologia{}

	// Busca todos elementos contidos no banco de dados
	err := db.Debug().Model(&PidTipologia{}).Find(&allPIDTipologia).Error
	if err != nil {
		return &[]PidTipologia{}, err
	}

	return &allPIDTipologia, err
}

/*  =========================
	FUNCAO DELETAR PID TIPOLOGIA
=========================  */

func (pidTipologia *PidTipologia) DeletePidTipologia(db *gorm.DB, codPID, codTipologia uint32) error {

	//	Deleta um elemento contido no banco de dados a partir de sua chave primaria
	db = db.Debug().Model(&PidTipologia{}).Where("cod_pid = ? AND cod_tipologia = ?", codPID, codTipologia).Take(&PidTipologia{}).Delete(&PidTipologia{})

	return db.Error
}
