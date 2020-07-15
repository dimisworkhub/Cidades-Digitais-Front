package models

import "github.com/jinzhu/gorm"

/*  =========================
	STRUCT USUARIO MODULO
=========================  */

type UsuarioModulo struct {
	CodUsuario uint32 `gorm:"foreingkey:CodUsuario" json:"cod_usuario" validate:"required"`
	CodModulo  uint32 `gorm:"foreingkey:CodModulo" json:"cod_modulo" validate:"required"`
}

/*  =========================
	FUNCAO SALVAR USUARIO MODULO
=========================  */

func (usuarioModulo *UsuarioModulo) SaveUsuarioModulo(db *gorm.DB) (*UsuarioModulo, error) {

	//	Adiciona um novo elemento no banco de dados
	err := db.Debug().Create(&usuarioModulo).Error
	if err != nil {
		return &UsuarioModulo{}, err
	}

	return usuarioModulo, err
}

/*  =========================
	FUNCAO LISTAR TODOS USUARIO MODULO
=========================  */

func (usuarioModulo *UsuarioModulo) FindAllUsuarioModulo(db *gorm.DB) (*[]UsuarioModulo, error) {

	allUsuarioModulo := []UsuarioModulo{}

	// Busca todos elementos contidos no banco de dados
	err := db.Debug().Model(&UsuarioModulo{}).Find(&allUsuarioModulo).Error
	if err != nil {
		return &[]UsuarioModulo{}, err
	}

	return &allUsuarioModulo, err
}

/*  =========================
	FUNCAO DELETAR USUARIO MODULO
=========================  */

func (usuarioModulo *UsuarioModulo) DeleteUsuarioModulo(db *gorm.DB, codUsuario, codModulo uint32) error {

	//	Deleta um elemento contido no banco de dados a partir de sua chave primaria
	db = db.Debug().Model(&UsuarioModulo{}).Where("cod_usuario = ? AND cod_modulo = ?", codUsuario, codModulo).Take(&UsuarioModulo{}).Delete(&UsuarioModulo{})

	return db.Error
}
