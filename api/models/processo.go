package models

import "github.com/jinzhu/gorm"

/*  =========================
	STRUCT PROCESSO
=========================  */

type Processo struct {
	CodProcesso string `gorm:"primary_key;not null" json:"cod_processo"`
	CodIbge     uint32 `gorm:"primary_key;foreign_key:CodIbge;not null" json:"cod_ibge"`
	Descricao   string `gorm:"default:null" json:"descricao"`
}

/*  =========================
	FUNCAO SALVAR PROCESSO
=========================  */

func (processo *Processo) SaveProcesso(db *gorm.DB) (*Processo, error) {

	//	Adiciona um novo elemento ao banco de dados
	err := db.Debug().Create(&processo).Error
	if err != nil {
		return &Processo{}, err
	}

	return processo, err
}

/*  =========================
	FUNCAO LISTAR PROCESSO POR ID
=========================  */

func (processo *Processo) FindProcessoByID(db *gorm.DB, codProcesso string, codIbge uint32) (*Processo, error) {

	//	Busca um elemento no banco de dados a partir de sua chave primaria
	err := db.Debug().Model(Processo{}).Where("cod_processo = ? AND cod_ibge = ?", codProcesso, codIbge).Take(&processo).Error
	if err != nil {
		return &Processo{}, err
	}

	return processo, err
}

/*  =========================
	FUNCAO LISTAR TODAS PROCESSO
=========================  */

func (processo *Processo) FindAllProcesso(db *gorm.DB) (*[]Processo, error) {

	allProcesso := []Processo{}

	// Busca todos elementos contidos no banco de dados
	err := db.Debug().Model(&Processo{}).Find(&allProcesso).Error
	if err != nil {
		return &[]Processo{}, err
	}

	return &allProcesso, err
}

/*  =========================
	FUNCAO EDITAR PROCESSO
=========================  */

func (processo *Processo) UpdateProcesso(db *gorm.DB, codProcesso string, codIbge uint32) (*Processo, error) {

	//	Permite a atualizacao dos campos indicados
	db = db.Debug().Exec("UPDATE processo SET descricao = ? WHERE cod_processo = ? AND cod_ibge = ?", processo.Descricao, codProcesso, codIbge)
	if db.Error != nil {
		return &Processo{}, db.Error
	}

	//	Busca um elemento no banco de dados a partir de sua chave primaria
	err := db.Debug().Model(&Processo{}).Where("cod_processo = ? AND cod_ibge = ?", codProcesso, codIbge).Take(&processo).Error
	if err != nil {
		return &Processo{}, err
	}

	return processo, err
}

/*  =========================
	FUNCAO DELETAR PROCESSO
=========================  */

func (processo *Processo) DeleteProcesso(db *gorm.DB, codProcesso string, codIbge uint32) error {

	//	Deleta um elemento contido no banco de dados a partir de sua chave primaria
	db = db.Debug().Model(&Processo{}).Where("cod_processo = ? AND cod_ibge = ?", codProcesso, codIbge).Take(&Processo{}).Delete(&Processo{})

	return db.Error
}
