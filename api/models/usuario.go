package models

import (
	"CidadesDigitaisV2/api/auth"
	"fmt"
	"html"
	"log"
	"strings"

	"github.com/jinzhu/gorm"
	"golang.org/x/crypto/bcrypt"
)

/*  =========================
	STRUCT USUARIO
=========================  */

type Usuario struct {
	CodUsuario uint32 `gorm:"primary_key;auto_increment;not null" json:"cod_usuario"`
	Nome       string `gorm:"default:null" json:"nome"`
	Email      string `gorm:"default:null" json:"email" validate:"omitempty,email"`
	Status     string `gorm:"default:null" json:"status" `
	Login      string `gorm:"default:null" json:"login" validate:"alphanum"`
	Senha      string `gorm:"default:null" json:"senha" validate:"min=8"`
}

/*	=========================
	FUNCAO HASH
=========================	*/

func Hash(senha string) ([]byte, error) {

	return bcrypt.GenerateFromPassword([]byte(senha), bcrypt.DefaultCost)
}

/*	=========================
	FUNCAO VERIFY PASSWORD
=========================	*/

func VerifyPassword(hashedSenha, senha string) error {

	return bcrypt.CompareHashAndPassword([]byte(hashedSenha), []byte(senha))
}

/*	=========================
	FUNCAO BEFORE SAVE
=========================	*/

func (usuario *Usuario) BeforeSave() error {

	//	Hash a senha do usuario antes de salva-la no banco de dados
	hashedSenha, err := Hash(usuario.Senha)
	if err != nil {
		return err
	}

	usuario.Senha = string(hashedSenha)
	return err
}

/*	=========================
	FUNCAO VERIFY LOGIN
=========================	*/

func (usuario *Usuario) VerifyLogin(db *gorm.DB, login string) error {

	//	Verifica se o login existe no banco de dados
	err := db.Debug().Model(usuario).Where("login = ?", login).Take(&usuario).Error

	return err
}

/*	=========================
	FUNCAO SIGN IN
=========================	*/

func (usuario *Usuario) SignIn(db *gorm.DB, login, password string) (string, error) {

	var CodigoModulo []uint32
	modulo := UsuarioModulo{}

	//	Verificar se o login informado existe no banco de dados
	if err := usuario.VerifyLogin(db, login); err != nil {
		return "", err
	}

	//	Verifica se a senha informada eh compativel com a senha guardada no banco de dados
	err := VerifyPassword(usuario.Senha, password)
	if err != nil && err == bcrypt.ErrMismatchedHashAndPassword {
		return "", err
	}

	//	Verifica se o usuario tem permissao de acesso
	if usuario.Status == "1" {

		//	Busca todos os cod_modulo relacionados ao usuario
		rows, err := db.Debug().Raw("SELECT cod_modulo FROM usuario_modulo WHERE cod_usuario = ?", usuario.CodUsuario).Rows()
		if err != nil {
			return "", err
		}

		//	Armazena os cod_modulo associados ao usuario e armazena no array CodigoModulo
		for rows.Next() {

			err = rows.Scan(&modulo.CodModulo)
			CodigoModulo = append(CodigoModulo, modulo.CodModulo)
		}

		//	Printa os modulos que o usuario tem acesso
		fmt.Printf("eu so codmod: %v", CodigoModulo)

		//	Cria e retorna o token criado
		return auth.CreateToken(usuario.CodUsuario, CodigoModulo)

	} else {
		//	Caso o usuario nao tenha permissao de acesso
		log.Printf("[FATAL] This usuario is disable,%v\n", usuario.Status)
		return "Error", err
	}
}

/*	=========================
		FUNCAO PREPARE
=========================	*/

func (usuario *Usuario) Prepare() {

	usuario.Nome = html.EscapeString(strings.TrimSpace(usuario.Nome))
	usuario.Email = html.EscapeString(strings.TrimSpace(usuario.Email))
	usuario.Status = "1"
	usuario.Login = html.EscapeString(strings.TrimSpace(usuario.Login))
}

/*  =========================
	FUNCAO SALVAR USUARIO
=========================  */

func (usuario *Usuario) SaveUsuario(db *gorm.DB) (*Usuario, error) {

	//	Adiciona um novo elemento ao banco de dados
	err := db.Debug().Create(&usuario).Error
	if err != nil {
		return &Usuario{}, err
	}

	return usuario, err
}

/*  =========================
	FUNCAO LISTAR USUARIO POR ID
=========================  */

func (usuario *Usuario) FindUsuarioByID(db *gorm.DB, codUsuario uint32) (*Usuario, error) {

	//	Busca um elemento no banco de dados a partir de sua chave primaria
	err := db.Debug().Model(Usuario{}).Where("cod_usuario = ?", codUsuario).Take(&usuario).Error
	if err != nil {
		return &Usuario{}, err
	}

	return usuario, err
}

/*  =========================
	FUNCAO LISTAR TODOS USUARIO
=========================  */

func (usuario *Usuario) FindAllUsuario(db *gorm.DB) (*[]Usuario, error) {

	allUsuario := []Usuario{}

	// Busca todos elementos contidos no banco de dados
	err := db.Debug().Model(&Usuario{}).Find(&allUsuario).Error
	if err != nil {
		return &[]Usuario{}, err
	}

	return &allUsuario, err
}

/*  =========================
	FUNCAO EDITAR USUARIO
=========================  */

func (usuario *Usuario) UpdateUsuario(db *gorm.DB, codUsuario uint32) (*Usuario, error) {

	// To hash the password
	if err := usuario.BeforeSave(); err != nil {
		log.Printf("[FATAL] cannot HASH password, %v\n", err)
	}

	//	Permite a atualizacao dos campos indicados
	db = db.Debug().Exec("UPDATE usuario SET nome = ?, email = ?, status = ?, login = ?, senha = ? WHERE cod_usuario = ?", usuario.Nome, usuario.Email, usuario.Status, usuario.Login, usuario.Senha, codUsuario)
	if db.Error != nil {
		return &Usuario{}, db.Error
	}

	//	Busca um elemento no banco de dados a partir de sua chave primaria
	err := db.Debug().Model(&Usuario{}).Where("cod_usuario = ?", codUsuario).Take(&usuario).Error
	if err != nil {
		return &Usuario{}, err
	}

	return usuario, err
}
