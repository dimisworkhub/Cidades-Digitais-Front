package models

import "github.com/jinzhu/gorm"

/*  =========================
	STRUCT PONTO
=========================  */

type Ponto struct {
	CodPonto     uint32 `gorm:"primary_key;not null" json:"cod_ponto"`
	CodCategoria uint32 `gorm:"primary_key;foreign_key:CodCategoria;not null" json:"cod_categoria"`
	CodIbge      uint32 `gorm:"primary_key;foreign_key:CodIbge;not null" json:"cod_ibge"`
	CodPid       uint32 `gorm:"foreign_key:CodPid;not null" json:"cod_pid"`
	Nome         string `gorm:"default:null" json:"nome"`
	Inep         string `gorm:"default:null" json:"inep"`
	Endereco     string `gorm:"default:null" json:"endereco"`
	Numero       string `gorm:"default:null" json:"numero"`
	Complemento  string `gorm:"default:null" json:"complemento"`
	Bairro       string `gorm:"default:null" json:"bairro"`
	Cep          string `gorm:"default:null" json:"cep"`
	Latitude     uint32 `gorm:"default:null" json:"latitude"`
	Longitude    uint32 `gorm:"default:null" json:"longitude"`
}

/*  =========================
	FUNCAO SALVAR PONTO
=========================  */

func (ponto *Ponto) SavePonto(db *gorm.DB) (*Ponto, error) {

	//	Adiciona um novo elemento ao banco de dados
	err := db.Debug().Create(&ponto).Error
	if err != nil {
		return &Ponto{}, err
	}

	return ponto, err
}

/*  =========================
	FUNCAO LISTAR PONTO POR ID
=========================  */

func (ponto *Ponto) FindPontoByID(db *gorm.DB, codPonto, codCategoria, codIbge uint32) (*Ponto, error) {

	//	Busca um elemento no banco de dados a partir de sua chave primaria
	err := db.Debug().Model(Ponto{}).Where("cod_ponto = ? AND cod_categoria =? AND cod_ibge = ?", codPonto, codCategoria, codIbge).Take(&ponto).Error
	if err != nil {
		return &Ponto{}, err
	}

	return ponto, err
}

/*  =========================
	FUNCAO LISTAR TODAS PONTO
=========================  */

func (ponto *Ponto) FindAllPonto(db *gorm.DB) (*[]Ponto, error) {

	allPonto := []Ponto{}

	// Busca todos elementos contidos no banco de dados
	err := db.Debug().Model(&Ponto{}).Find(&allPonto).Error
	if err != nil {
		return &[]Ponto{}, err
	}

	return &allPonto, err
}

/*  =========================
	FUNCAO EDITAR PONTO
=========================  */

func (ponto *Ponto) UpdatePonto(db *gorm.DB, codPonto, codCategoria, codIbge uint32) (*Ponto, error) {

	//	Permite a atualizacao dos campos indicados
	db = db.Debug().Exec("UPDATE ponto SET cod_pid = ?, endereco = ?, numero = ?, complemento = ?, bairro = ?, cep = ?, latitude = ?, longitude = ? WHERE cod_ponto = ? AND cod_categoria = ? AND cod_ibge = ?", ponto.CodPid, ponto.Endereco, ponto.Numero, ponto.Complemento, ponto.Bairro, ponto.Cep, ponto.Latitude, ponto.Longitude, codPonto, codCategoria, codIbge)
	if db.Error != nil {
		return &Ponto{}, db.Error
	}

	//	Busca um elemento no banco de dados a partir de sua chave primaria
	err := db.Debug().Model(&Ponto{}).Where("cod_ponto = ? AND cod_categoria =? AND cod_ibge = ?", codPonto, codCategoria, codIbge).Take(&ponto).Error
	if err != nil {
		return &Ponto{}, err
	}

	return ponto, err
}

/*  =========================
	FUNCAO DELETAR PONTO
=========================  */

func (ponto *Ponto) DeletePonto(db *gorm.DB, codPonto, codCategoria, codIbge uint32) error {

	//	Deleta um elemento contido no banco de dados a partir de sua chave primaria
	db = db.Debug().Model(&Ponto{}).Where("cod_ponto = ? AND cod_categoria =? AND cod_ibge = ?", codPonto, codCategoria, codIbge).Take(&Ponto{}).Delete(&Ponto{})

	return db.Error
}
