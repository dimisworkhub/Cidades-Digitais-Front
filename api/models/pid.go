package models

import "github.com/jinzhu/gorm"

/*  =========================
	STRUCT PID
=========================  */

type Pid struct {
	CodPid  uint32 `gorm:"primary_key;auto_increment;not null" json:"cod_pid"`
	CodIbge uint32 `gorm:"foreign_key:CodIbge;not null" json:"cod_ibge"`
	Nome    string `gorm:"not null" json:"nome"`
	Inep    string `gorm:"default:null" json:"inep"`
}

/*  =========================
	FUNCAO SALVAR PID
=========================  */

func (pid *Pid) SavePid(db *gorm.DB) (*Pid, error) {

	err := db.Debug().Create(&pid).Error
	if err != nil {
		return &Pid{}, err
	}

	return pid, err
}

/*  =========================
	FUNCAO LISTAR PID POR ID
=========================  */

func (pid *Pid) FindPidByID(db *gorm.DB, codPid uint32) (*Pid, error) {

	//	Busca um elemento no banco de dados a partir de sua chave primaria
	err := db.Debug().Model(Pid{}).Where("cod_pid = ?", codPid).Take(&pid).Error
	if err != nil {
		return &Pid{}, err
	}

	return pid, err
}

/*  =========================
	FUNCAO LISTAR TODOS PID
=========================  */

func (pid *Pid) FindAllPid(db *gorm.DB) (*[]Pid, error) {

	allPid := []Pid{}

	// Busca todos elementos contidos no banco de dados
	err := db.Debug().Model(&Pid{}).Find(&allPid).Error
	if err != nil {
		return &[]Pid{}, err
	}

	return &allPid, err
}

/*  =========================
	FUNCAO EDITAR PID
=========================  */

func (pid *Pid) UpdatePid(db *gorm.DB, codPid uint32) (*Pid, error) {

	//	Permite a atualizacao dos campos indicados
	db = db.Debug().Exec("UPDATE pid SET cod_ibge = ?, nome = ?, inep = ? WHERE cod_pid = ?", pid.CodIbge, pid.Nome, pid.Inep, codPid)
	if db.Error != nil {
		return &Pid{}, db.Error
	}

	//	Busca um elemento no banco de dados a partir de sua chave primaria
	err := db.Debug().Model(&Pid{}).Where("cod_pid = ?", codPid).Take(&pid).Error
	if err != nil {
		return &Pid{}, err
	}

	return pid, err
}

/*  =========================
	FUNCAO DELETAR PID
=========================  */

func (pid *Pid) DeletePid(db *gorm.DB, codPid uint32) error {

	db = db.Debug().Model(&Pid{}).Where("cod_pid = ?", codPid).Take(&Pid{}).Delete(&Pid{})

	return db.Error
}
