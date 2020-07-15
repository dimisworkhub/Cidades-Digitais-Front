package models

import (
	"errors"

	"github.com/jinzhu/gorm"
)

/*  =========================
	STRUCT ENTIDADE
=========================  */

type Entidade struct {
	Cnpj          string `gorm:"primary_key;not null;size:14" json:"cnpj"`
	Nome          string `gorm:"size:50;default:null" json:"nome"`
	Endereco      string `gorm:"size:100;default:null" json:"endereco"`
	Numero        string `gorm:"size:10;default:null" json:"numero"`
	Bairro        string `gorm:"size:100;default:null" json:"bairro"`
	Cep           string `gorm:"size:8;default:null" json:"cep"`
	NomeMunicipio string `gorm:"size:50;default:null" json:"nome_municipio"`
	UF            string `gorm:"size:2;default:null" json:"uf"`
	Observacao    string `gorm:"size:1000;default:null" json:"observacao"`
}

/*  =========================
	FUNCAO SALVAR ENTIDADE NO BANCO DE DADOS
=========================  */

func (entidade *Entidade) SaveEntidade(db *gorm.DB) (*Entidade, error) {

	//	Adiciona um novo elemento ao banco de dados
	err := db.Debug().Create(&entidade).Error
	if err != nil {
		return &Entidade{}, err
	}

	return entidade, err
}

/*  =========================
	FUNCAO LISTAR ENTIDADE POR ID
=========================  */

func (entidade *Entidade) FindEntidadeByID(db *gorm.DB, cnpj string) (*Entidade, error) {

	//	Busca um elemento no banco de dados a partir de sua chave primaria
	err := db.Debug().Model(Entidade{}).Where("cnpj = ?", cnpj).Take(&entidade).Error
	if err != nil {
		return &Entidade{}, err
	}

	return entidade, err
}

/*  =========================
	FUNCAO LISTAR TODAS ENTIDADE
=========================  */

func (entidade *Entidade) FindAllEntidade(db *gorm.DB) (*[]Entidade, error) {

	allEntidade := []Entidade{}

	// Busca todos elementos contidos no banco de dados
	err := db.Debug().Model(&Entidade{}).Find(&allEntidade).Error
	if err != nil {
		return &[]Entidade{}, err
	}

	return &allEntidade, err
}

/*  =========================
	FUNCAO EDITAR ENTIDADE
=========================  */

func (entidade *Entidade) UpdateEntidade(db *gorm.DB, cnpj string) (*Entidade, error) {

	//	Permite a atualizacao dos campos indicados
	db = db.Debug().Exec("UPDATE entidade SET nome = ?, endereco = ?, numero = ?, bairro = ?, cep = ?, nome_municipio = ?, uf = ?, observacao = ? WHERE cnpj = ?", entidade.Nome, entidade.Endereco, entidade.Numero, entidade.Bairro, entidade.Cep, entidade.NomeMunicipio, entidade.UF, entidade.Observacao, cnpj)
	if db.Error != nil {
		return &Entidade{}, db.Error
	}

	//	Busca um elemento no banco de dados a partir de sua chave primaria
	err := db.Debug().Model(&Entidade{}).Where("cnpj = ?", cnpj).Take(&entidade).Error
	if err != nil {
		return &Entidade{}, err
	}

	return entidade, err
}

/*  =========================
	FUNCAO DELETAR ENTIDADE POR ID
=========================  */

func (entidade *Entidade) DeleteEntidade(db *gorm.DB, cnpj string) error {

	//	Deleta um elemento contido no banco de dados a partir de sua chave primaria
	db = db.Debug().Model(&Entidade{}).Where("cnpj = ?", cnpj).Take(&Entidade{}).Delete(&Entidade{})
	if db.Error != nil {
		if gorm.IsRecordNotFoundError(db.Error) {
			return errors.New("Entidade not found")
		}
		return db.Error
	}

	return db.Error
}

/*  =========================
	FUNCAO LISTAR ENTIDADE.CNPJ E ENTIDADE.NOME
=========================  */

func (entidade *Entidade) FindEntidadeIDAndName(db *gorm.DB) (*[]Entidade, error) {

	allEntidade := []Entidade{}

	err := db.Debug().Select("cnpj, nome").Find(&allEntidade).Error
	if err != nil {
		return &[]Entidade{}, err
	}

	return &allEntidade, err
}
