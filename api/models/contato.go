package models

import (
	"errors"

	"github.com/jinzhu/gorm"
)

/*  =========================
	STRUCT CONTATO
=========================  */

type Contato struct {
	CodContato uint32 `gorm:"primary_key;auto_increment;not null" json:"cod_contato"`
	Cnpj       string `gorm:"foreign_key:Cnpj;default:null;size:14" json:"cnpj"`
	CodIbge    uint32 `gorm:"foreign_key:CodIbge;default:null" json:"cod_ibge"`
	Nome       string `gorm:"default:null;size:50" json:"nome"`
	Email      string `gorm:"default:null;size:100" json:"email"`
	Funcao     string `gorm:"default:null" json:"funcao"`
}

/*  =========================
	FUNCAO SALVAR CONTATO
=========================  */

func (contato *Contato) SaveContato(db *gorm.DB) (*Contato, error) {

	//	Adiciona um novo elemento ao banco de dados
	err := db.Debug().Create(&contato).Error
	if err != nil {
		return &Contato{}, err
	}

	return contato, err
}

/*  =========================
	FUNCAO LISTAR TODOS CONTATO
=========================  */

func (contato *Contato) FindAllContato(db *gorm.DB) (*[]Contato, error) {

	allContato := []Contato{}

	// Busca todos elementos contidos no banco de dados
	err := db.Debug().Model(&Contato{}).Find(&allContato).Error
	if err != nil {
		return &[]Contato{}, err
	}

	return &allContato, err
}

/*  =========================
	FUNCAO EDITAR CONTATO
=========================  */

func (contato *Contato) UpdateContato(db *gorm.DB, codContato uint32) (*Contato, error) {

	//	Permite a atualizacao dos campos indicados
	db = db.Debug().Exec("UPDATE contato SET nome = ?, email = ?, funcao = ? WHERE cod_contato = ?", contato.Nome, contato.Email, contato.Funcao, codContato)
	if db.Error != nil {
		return &Contato{}, db.Error
	}

	//	Busca um elemento no banco de dados a partir de sua chave primaria
	err := db.Debug().Model(&Contato{}).Where("cod_contato = ?", codContato).Take(&contato).Error
	if err != nil {
		return &Contato{}, err
	}

	return contato, err
}

/*  =========================
	FUNCAO DELETAR CONTATO
=========================  */

func (contato *Contato) DeleteContato(db *gorm.DB, codContato uint32) error {

	//	Deleta um elemento contido no banco de dados a partir de sua chave primaria
	db = db.Debug().Model(&Contato{}).Where("cod_contato = ?", codContato).Take(&Contato{}).Delete(&Contato{})
	if db.Error != nil {
		if gorm.IsRecordNotFoundError(db.Error) {
			return errors.New("Contato not found")
		}
		return db.Error
	}

	return db.Error
}
