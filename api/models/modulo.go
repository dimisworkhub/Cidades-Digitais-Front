package models

import (
	"github.com/jinzhu/gorm"
)

/*  =========================
	STRUCT MODULO
=========================  */

type Modulo struct {
	CodModulo   uint32 `gorm:"primary_key;not null" json:"cod_modulo"`
	Categoria_1 string `gorm:"default:null" json:"categoria_1"`
	Categoria_2 string `gorm:"default:null" json:"categoria_2"`
	Categoria_3 string `gorm:"default:null" json:"categoria_3"`
	Descricao   string `gorm:"default:null" json:"descricao"`
}

/*  =========================
	FUNCAO SALVAR MODULO
=========================  */

func (modulo *Modulo) SaveModulo(db *gorm.DB) (*Modulo, error) {

	//	Adiciona um novo elemento no banco de dados
	err := db.Debug().Create(&modulo).Error
	if err != nil {
		return &Modulo{}, err
	}

	return modulo, err
}

/*  =========================
	FUNCAO LISTAR MODULO POR ID
=========================  */

func (modulo *Modulo) FindModuloByID(db *gorm.DB, codModulo uint32) (*Modulo, error) {

	//	Busca um elemento no banco de dados a partir de sua chave primaria
	err := db.Debug().Model(Modulo{}).Where("cod_modulo = ?", codModulo).Take(&modulo).Error
	if err != nil {
		return &Modulo{}, err
	}

	return modulo, err
}

/*  =========================
	FUNCAO LISTAR TODOS MODULOS
=========================  */

func (modulo *Modulo) FindAllModulo(db *gorm.DB) (*[]Modulo, error) {

	allModulo := []Modulo{}

	err := db.Debug().Model(&Modulo{}).Find(&allModulo).Error
	if err != nil {
		return &[]Modulo{}, err
	}

	return &allModulo, err
}

/*  =========================
	FUNCAO EDITAR MODULO
=========================  */

func (modulo *Modulo) UpdateModulo(db *gorm.DB, codModulo uint32) (*Modulo, error) {

	//	Permite a atualizacao dos campos indicados
	db = db.Debug().Exec("UPDATE modulo SET categoria_1 = ?, ccategoria_2 = ?, categoria_3 = ?, descricao = ? WHERE cod_modulo = ?", modulo.Categoria_1, modulo.Categoria_2, modulo.Categoria_3, modulo.Descricao, codModulo)
	if db.Error != nil {
		return &Modulo{}, db.Error
	}

	//	Busca um elemento no banco de dados a partir de sua chave primaria
	err := db.Debug().Model(&Modulo{}).Where("cod_modulo = ?", codModulo).Take(&modulo).Error
	if err != nil {
		return &Modulo{}, err
	}

	// retorna o elemento que foi alterado
	return modulo, err
}

/*  =========================
	FUNCAO DELETAR MODULO
=========================  */

func (modulo *Modulo) DeleteModulo(db *gorm.DB, codModulo uint32) error {

	//	Deleta um elemento contido no banco de dados a partir de sua chave primaria
	db.Debug().Model(&Itens{}).Where("cod_modulo = ?", codModulo).Take(&Modulo{}).Delete(&Modulo{})

	return db.Error
}
