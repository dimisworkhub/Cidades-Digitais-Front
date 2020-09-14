package models

import "github.com/jinzhu/gorm"

/*  =========================
	STRUCT TELEFONE
=========================  */

type Telefone struct {
	CodTelefone    uint32 `gorm:"primary_key;auto_increment;not null;size:11" json:"cod_telefone"`
	CodContato     uint32 `gorm:"foreign_key:CodContato;not null;size:11" json:"cod_contato"`
	Telefone       string `gorm:"default:null;size:11" json:"telefone"`
	Tipo           string `gorm:"default:null;size:10" json:"tipo"`
	TelefoneConcat string `gorm: "default:null" json:"telefone_concat"`
}

/*  =========================
	FUNCAO SALVAR TELEFONE
=========================  */

func (telefone *Telefone) SaveTelefone(db *gorm.DB) (*Telefone, error) {

	//	Adiciona um novo elemento ao banco de dados
	err := db.Debug().Create(&telefone).Error
	if err != nil {
		return &Telefone{}, err
	}

	return telefone, err
}

/*  =========================
	FUNCAO LISTAR TODOS TELEFONE
=========================  */

func (telefone *Telefone) FindAllTelefone(db *gorm.DB, codContato uint32) (*[]Telefone, error) {

	allTelefone := []Telefone{}

	// Busca todos elementos contidos no banco de dados
	err := db.Debug().Table("telefone").
		Select("telefone.*").
		Where("telefone.cod_contato = ?", codContato).
		Order("telefone.cod_telefone").
		Scan(&allTelefone).Error
	if err != nil {
		return &[]Telefone{}, err
	}

	return &allTelefone, err
}

/*  =========================
	FUNCAO LISTAR TODOS TELEFONE CONCATENADOS
=========================  */

func (telefone *Telefone) FindAllTelefoneConcat(db *gorm.DB, codContato uint32) (*Telefone, error) {

	// Busca e concatena todos telefones que compartilham a mesma chave primaria
	err := db.Debug().Table("telefone").
		Select("group_concat(telefone.telefone order by telefone.telefone asc separator '; \n') AS telefone_concat").
		Where("telefone.cod_contato = ?", codContato).
		Scan(&telefone).Error
	if err != nil {
		return &Telefone{}, err
	}

	return telefone, err
}

/*  =========================
	FUNCAO DELETAR TELEFONE
=========================  */

func (telefone *Telefone) DeleteTelefone(db *gorm.DB, codTelefone uint32) error {

	//	Deleta um elemento contido no banco de dados a partir de sua chave primaria
	db = db.Debug().Model(&Telefone{}).Where("cod_telefone = ?", codTelefone).Take(&Telefone{}).Delete(&Telefone{})

	return db.Error
}
