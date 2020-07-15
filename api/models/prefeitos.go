package models

import "github.com/jinzhu/gorm"

/*  =========================
	STRUCT PREFEITOS
=========================  */

type Prefeitos struct {
	CodPrefeito uint32 `gorm:"primary_key;auto_increment;not null" json:"cod_prefeito"`
	CodIbge     uint32 `gorm:"foreign_key:CodIbge;not null;size:7" json:"cod_ibge"`
	Nome        string `gorm:"default:null" json:"nome"`
	Cpf         string `gorm:"default:null" json:"cpf"`
	RG          string `gorm:"default:null" json:"rg"`
	Partido     string `gorm:"default:null" json:"partido"`
	Exercicio   string `gorm:"default:null" json:"exercicio"`
}

/*  =========================
	FUNCAO SALVAR PREFEITOS
=========================  */

func (prefeitos *Prefeitos) SavePrefeitos(db *gorm.DB) (*Prefeitos, error) {

	//	Adiciona um elemento ao banco de dados
	err := db.Debug().Create(&prefeitos).Error
	if err != nil {
		return &Prefeitos{}, err
	}
	return prefeitos, err
}

/*  =========================
	FUNCAO LISTAR PREFEITOS POR ID
=========================  */

func (prefeitos *Prefeitos) FindPrefeitosByID(db *gorm.DB, codPrefeito uint32) (*Prefeitos, error) {

	//	Busca um elemento no banco de dados a partir de sua chave primaria
	err := db.Debug().Model(Prefeitos{}).Where("cod_prefeito = ?", codPrefeito).Take(&prefeitos).Error
	if err != nil {
		return &Prefeitos{}, err
	}

	return prefeitos, err
}

/*  =========================
	FUNCAO LISTAR TODOS PREFEITOS
=========================  */

func (prefeitos *Prefeitos) FindAllPrefeitos(db *gorm.DB) (*[]Prefeitos, error) {

	allPrefeitos := []Prefeitos{}

	//	Busca todos os elementos contidos no banco de dados
	err := db.Debug().Model(&Prefeitos{}).Find(&allPrefeitos).Error
	if err != nil {
		return &[]Prefeitos{}, err
	}

	return &allPrefeitos, err
}

/*  =========================
	FUNCAO EDITAR PREFEITOS
=========================  */

func (prefeitos *Prefeitos) UpdatePrefeitos(db *gorm.DB, codPrefeito uint32) (*Prefeitos, error) {

	//	Permite a atualizacao dos campos indicados
	db = db.Debug().Exec("UPDATE prefeitos SET cod_ibge = ?, nome = ?, cpf = ?, rg = ?, partido = ?, exercicio = ? WHERE cod_prefeito = ?", prefeitos.CodIbge, prefeitos.Nome, prefeitos.Cpf, prefeitos.RG, prefeitos.Partido, prefeitos.Exercicio, codPrefeito)
	if db.Error != nil {
		return &Prefeitos{}, db.Error
	}

	//	Busca um elemento no banco de dados a partir de sua chave primaria
	err := db.Debug().Model(&Prefeitos{}).Where("cod_prefeito = ?", codPrefeito).Take(&prefeitos).Error
	if err != nil {
		return &Prefeitos{}, err
	}

	return prefeitos, err
}

/*  =========================
	FUNCAO DELETAR PREFEITOS
=========================  */

func (prefeitos *Prefeitos) DeletePrefeitos(db *gorm.DB, codPrefeito uint32) error {

	//	Deleta um elemento contido no banco de dados a partir de sua chave primaria
	db = db.Debug().Model(&Prefeitos{}).Where("cod_prefeito = ?", codPrefeito).Take(&Prefeitos{}).Delete(&Prefeitos{})

	return db.Error
}
