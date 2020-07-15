package models

import "github.com/jinzhu/gorm"

/*	=========================
	STRUCT TIPO ITEM
=========================	*/

type TipoItem struct {
	CodTipoItem uint32 `gorm:"primary_key;not null" json:"cod_tipo_item"`
	Descricao   string `gorm:"default:null" json:"descricao"`
}

/*  =========================
	FUNCAO SALVAR TIPO ITEM
=========================  */

func (tipoItem *TipoItem) SaveTipoItem(db *gorm.DB) (*TipoItem, error) {

	//	Adiciona um novo elemento ao banco de dados
	err := db.Debug().Create(&tipoItem).Error
	if err != nil {
		return &TipoItem{}, err
	}

	return tipoItem, err
}

/*  =========================
	FUNCAO LISTAR TIPO ITEM POR ID
=========================  */

func (tipoItem *TipoItem) FindTipoItemByID(db *gorm.DB, codTipoItem uint32) (*TipoItem, error) {

	//	Busca um elemento no banco de dados a partir de sua chave primaria
	err := db.Debug().Model(TipoItem{}).Where("cod_tipo_item = ?", codTipoItem).Take(&tipoItem).Error
	if err != nil {
		return &TipoItem{}, err
	}

	return tipoItem, err
}

/*  =========================
	FUNCAO LISTAR TODAS TIPO ITEM
=========================  */

func (tipoItem *TipoItem) FindAllTipoItem(db *gorm.DB) (*[]TipoItem, error) {

	allTipoItem := []TipoItem{}

	// Busca todos elementos contidos no banco de dados
	err := db.Debug().Model(&TipoItem{}).Find(&allTipoItem).Error
	if err != nil {
		return &[]TipoItem{}, err
	}

	return &allTipoItem, err
}

/*  =========================
	FUNCAO EDITAR TIPO ITEM
=========================  */

func (tipoItem *TipoItem) UpdateTipoItem(db *gorm.DB, codTipoItem uint32) (*TipoItem, error) {

	//	Permite a atualizacao dos campos indicados
	db = db.Debug().Exec("UPDATE tipo_item SET descricao = ? WHERE cod_tipo_item = ?", tipoItem.Descricao, codTipoItem)
	if db.Error != nil {
		return &TipoItem{}, db.Error
	}

	//	Busca um elemento no banco de dados a partir de sua chave primaria
	err := db.Debug().Model(&TipoItem{}).Where("cod_tipo_item = ?", codTipoItem).Take(&tipoItem).Error
	if err != nil {
		return &TipoItem{}, err
	}

	// retorna o elemento que foi alterado
	return tipoItem, err
}

/*  =========================
	FUNCAO DELETAR TIPO ITEM
=========================  */

func (tipoItem *TipoItem) DeleteTipoItem(db *gorm.DB, codTipoItem uint32) error {

	//	Deleta um elemento contido no banco de dados a partir de sua chave primaria
	db = db.Debug().Model(&TipoItem{}).Where("cod_tipo_item = ?", codTipoItem).Take(&TipoItem{}).Delete(&TipoItem{})

	return db.Error
}
