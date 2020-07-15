package models

import (
	"errors"

	"github.com/jinzhu/gorm"
)

/*	=========================
		STRUCT ITENS
=========================	*/

type Itens struct {
	CodItem            uint32 `gorm:"primary_key;not null" json:"cod_item"`
	CodTipoItem        uint32 `gorm:"primary_key;foreign_key:CodTipoItem;not null" json:"cod_tipo_item"`
	CodNaturezaDespesa uint32 `gorm:"foreign_key:CodNaturezaDespesa;not null" json:"cod_natureza_despesa"`
	CodClasseEmpenho   uint32 `gorm:"foreign_key:CodClasseEmpenho;not null" json:"cod_classe_empenho"`
	Descricao          string `gorm:"default:null" json:"descricao"`
	Unidade            string `gorm:"default:null" json:"unidade"`
}

/*  =========================
	FUNCAO SALVAR ITENS
=========================  */

func (itens *Itens) SaveItens(db *gorm.DB) (*Itens, error) {

	//	Adiciona um novo elemento ao banco de dados
	err := db.Debug().Create(&itens).Error
	if err != nil {
		return &Itens{}, err
	}

	return itens, err
}

/*  =========================
	FUNCAO LISTAR ITENS POR ID
=========================  */

func (itens *Itens) FindItensByID(db *gorm.DB, codItem, codTipoItem uint32) (*Itens, error) {

	//	Busca um elemento no banco de dados a partir de sua chave primaria
	err := db.Debug().Model(Itens{}).Where("cod_item = ? AND cod_tipo_item = ?", codItem, codTipoItem).Take(&itens).Error
	if err != nil {
		return &Itens{}, err
	}

	return itens, err
}

/*  =========================
	FUNCAO LISTAR TODAS ITENS
=========================  */

func (itens *Itens) FindAllItens(db *gorm.DB) (*[]Itens, error) {

	allItens := []Itens{}

	// Busca todos elementos contidos no banco de dados
	err := db.Debug().Model(&Itens{}).Find(&allItens).Error
	if err != nil {
		return &[]Itens{}, err
	}

	return &allItens, err
}

/*  =========================
	FUNCAO EDITAR ITENS
=========================  */

func (itens *Itens) UpdateItens(db *gorm.DB, codItem, codTipoItem uint32) (*Itens, error) {

	//	Permite a atualizacao dos campos indicados
	db = db.Debug().Exec("UPDATE itens SET cod_natureza_despesa = ?, cod_classe_empenho = ?, descricao = ?, unidade = ? WHERE cod_item = ? AND cod_tipo_item = ?", itens.CodNaturezaDespesa, itens.CodClasseEmpenho, itens.Descricao, itens.Unidade, codItem, codTipoItem)
	if db.Error != nil {
		return &Itens{}, db.Error
	}

	//	Busca um elemento no banco de dados a partir de sua chave primaria
	err := db.Debug().Model(&Itens{}).Where("cod_item = ? AND cod_tipo_item = ?", codItem, codTipoItem).Take(&itens).Error
	if err != nil {
		return &Itens{}, err
	}

	// retorna o elemento que foi alterado
	return itens, err
}

/*  =========================
	FUNCAO DELETAR ITENS POR ID
=========================  */

func (itens *Itens) DeleteItens(db *gorm.DB, codItem, codTipoItem uint32) error {

	//	Deleta um elemento contido no banco de dados a partir de sua chave primaria
	db = db.Debug().Model(&Itens{}).Where("cod_item = ? AND cod_tipo_item = ?", codItem, codTipoItem).Take(&Itens{}).Delete(&Itens{})
	if db.Error != nil {
		if gorm.IsRecordNotFoundError(db.Error) {
			return errors.New("Itens not found")
		}
		return db.Error
	}

	return db.Error
}
