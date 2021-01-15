package models

import "github.com/jinzhu/gorm"

/*  =========================
	STRUCT USUARIO MODULO
=========================  */

type UsuarioModulo struct {
	CodUsuario  uint32 `gorm:"foreingkey:CodUsuario" json:"cod_usuario" validate:"required"`
	CodModulo   uint32 `gorm:"foreingkey:CodModulo" json:"cod_modulo" validate:"required"`
	Categoria_1 string `gorm:"default:null" json:"categoria_1"`
	Categoria_2 string `gorm:"default:null" json:"categoria_2"`
	Categoria_3 string `gorm:"default:null" json:"categoria_3"`
	Descricao   string `gorm:"default:null" json:"descricao"`
}

/*  =========================
	FUNCAO SALVAR USUARIO MODULO
=========================  */

func (usuarioModulo *UsuarioModulo) SaveUsuarioModulo(db *gorm.DB) (*UsuarioModulo, error) {

	//	Adiciona um novo elemento no banco de dados
	err := db.Create(&usuarioModulo).Error
	if err != nil {
		return &UsuarioModulo{}, err
	}

	return usuarioModulo, err
}

/*  =========================
	FUNCAO LISTAR TODOS USUARIO MODULO
=========================  */

func (usuarioModulo *UsuarioModulo) FindAllUsuarioModulo(db *gorm.DB, codUsuario uint32) (*[]UsuarioModulo, error) {

	allUsuarioModulo := []UsuarioModulo{}
	// Busca todos elementos contidos no banco de dados
	err := db.Debug().Table("usuario_modulo").
		Select("usuario_modulo.*, modulo.categoria_1, modulo.categoria_2, modulo.categoria_3, modulo.descricao").
		Joins("INNER JOIN modulo ON usuario_modulo.cod_modulo = modulo.cod_modulo").
		Where("usuario_modulo.cod_usuario = ?", codUsuario).
		Scan(&allUsuarioModulo).Error
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
	db = db.Debug().Where("cod_usuario = ? AND cod_modulo = ?", codUsuario, codModulo).Delete(&UsuarioModulo{})

	return db.Error
}
