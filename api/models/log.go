package models

import (
	"github.com/jinzhu/gorm"
)

/*  =========================
	STRUCT LOG
=========================  */

type Log struct {
	CodLog      uint32 `gorm:"primary_key;auto_increment;not null" json:"cod_log"`
	CodUsuario  uint32 `gorm:"primary_key;foreign_key:CodUsuario;not null" json:"cod_usuario"`
	Data        string `gorm:"not null" json:"data"`
	NomeTabela  string `gorm:"not null" json:"nome_tabela"`
	Operacao    string `gorm:"not null" json:"operacao"`
	Espelho     string `gorm:"default:null" json:"espelho"`
	CodInt1     uint32 `gorm:"default:null" json:"cod_int_1"`
	CodInt2     uint32 `gorm:"default:null" json:"cod_int_2"`
	CodInt3     uint32 `gorm:"default:null" json:"cod_int_3"`
	CodInt4     uint32 `gorm:"default:null" json:"cod_int_4"`
	CodInt5     uint32 `gorm:"default:null" json:"cod_int_5"`
	CodInt6     uint32 `gorm:"default:null" json:"cod_int_6"`
	CodData     string `gorm:"default:null" json:"cod_data"`
	CodProcesso string `gorm:"default:null;size:17" json:"cod_processo"`
	CodCnpj     string `gorm:"default:null;size:14" json:"cod_cnpj"`
	CodEmpenho  string `gorm:"default:null;size:13" json:"cod_empenho"`
}

/*  =========================
	LOG ASSUNTO
=========================  */

func (log *Log) LogAssunto(db *gorm.DB, codAssunto uint32, nomeTabela, operacao string, codUsuario uint32) error {

	if operacao == "i" {
		err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1) VALUES (?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, codAssunto).Error

		return err
	}

	db.Table("assunto").Select("CONCAT(IFNULL(cod_assunto, ''), ';', IFNULL(descricao, ''))").Where("cod_assunto = ?", codAssunto).Row().Scan(&log.Espelho)

	err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1) VALUES (?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, codAssunto).Error

	return err
}

/*  =========================
	LOG CATEGORIA
=========================  */

func (log *Log) LogCategoria(db *gorm.DB, codCategoria uint32, nomeTabela string, operacao string, codUsuario uint32) error {

	if operacao == "i" {
		err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1) VALUES (?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, codCategoria).Error

		return err
	}

	db.Table("categoria").Select("CONCAT(IFNULL(cod_categoria, ''), ';', IFNULL(descricao, ''))").Where("cod_categoria = ?", codCategoria).Row().Scan(&log.Espelho)

	err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1) VALUES (?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, codCategoria).Error

	return err
}

/*  =========================
	LOG CD
=========================  */

func (log *Log) LogCD(db *gorm.DB, codIbge uint32, nomeTabela string, operacao string, codUsuario uint32) error {

	if operacao == "i" {
		err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1) VALUES (?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, codIbge).Error

		return err
	}

	db.Table("cd").Select("CONCAT(IFNULL(cod_ibge, ''), ';', IFNULL(cod_lote, ''), ';', IFNULL(os_pe, ''), ';', IFNULL(data_pe, ''), ';', IFNULL(os_imp, ''), ';', IFNULL(data_imp, ''))").Where("cod_ibge = ?", codIbge).Row().Scan(&log.Espelho)

	err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1) VALUES (?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, codIbge).Error

	return err
}

/*  =========================
	LOG CD ITENS
=========================  */

func (log *Log) LogCDItens(db *gorm.DB, codIbge uint32, codItem uint32, codTipoItem uint32, nomeTabela string, operacao string, codUsuario uint32) error {

	db.Table("cd_itens").Select("CONCAT(IFNULL(cod_ibge, ''), ';', IFNULL(cod_item, ''), ';', IFNULL(cod_tipo_item, ''), ';', IFNULL(quantidade_previsto, ''), ';', IFNULL(quantidade_projeto_executivo, ''), ';', IFNULL(quantidade_termo_instalacao, ''))").Where("cod_ibge = ? AND cod_item = ? AND cod_tipo_item = ?", codIbge, codItem, codTipoItem).Row().Scan(&log.Espelho)

	err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1, cod_int_2, cod_int_3) VALUES (?, ?, ?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, codIbge, codItem, codTipoItem).Error

	return err
}

/*  =========================
	LOG CLASSE EMPENHO
=========================  */

func (log *Log) LogClasseEmpenho(db *gorm.DB, codClasseEmpenho uint32, nomeTabela string, operacao string, codUsuario uint32) error {

	if operacao == "i" {
		err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1) VALUES (?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, codClasseEmpenho).Error

		return err
	}

	db.Table("classe_empenho").Select("CONCAT(IFNULL(cod_classe_empenho, ''), ';', IFNULL(descricao, ''))").Where("cod_classe_empenho = ?", codClasseEmpenho).Row().Scan(&log.Espelho)

	err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1) VALUES (?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, codClasseEmpenho).Error

	return err
}

/*  =========================
	LOG CONTATO
=========================  */

func (log *Log) LogContato(db *gorm.DB, codContato uint32, nomeTabela string, operacao string, codUsuario uint32) error {

	if operacao == "i" {
		err := db.Debug().Exec("INSERT INTO log (cod_usuario, nome_tabela, operacao, espelho, cod_int_1) VALUES (?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, codContato).Error

		return err
	}

	db.Table("contato").Select("CONCAT(IFNULL(cod_contato, ''), ';', IFNULL(cnpj, ''), ';', IFNULL(cod_ibge, ''), ';', IFNULL(nome, ''), ';', IFNULL(email, ''), ';', IFNULL(funcao, ''))").Where("cod_contato = ?", codContato).Row().Scan(&log.Espelho)

	err := db.Debug().Exec("INSERT INTO log (cod_usuario, nome_tabela, operacao, espelho, cod_int_1) VALUES (?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, codContato).Error

	return err
}

/*  =========================
	LOG EMPENHO
=========================  */

func (log *Log) LogEmpenho(db *gorm.DB, idEmpenho uint32, nomeTabela string, operacao string, codUsuario uint32) error {

	if operacao == "i" {
		err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1) VALUES (?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, idEmpenho).Error

		return err
	}

	db.Table("empenho").Select("CONCAT(IFNULL(id_empenho, ''), ';', IFNULL(cod_previsao_empenho, ''), ';', IFNULL(cod_empenho, ''), ';', IFNULL(data, ''), ';', IFNULL(contador, ''))").Where("id_empenho = ?", idEmpenho).Row().Scan(&log.Espelho)

	err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1) VALUES (?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, idEmpenho).Error

	return err
}

/*  =========================
	LOG ENTIDADE
=========================  */

func (log *Log) LogEntidade(db *gorm.DB, cnpj string, nomeTabela string, operacao string, codUsuario uint32) error {

	if operacao == "i" {
		err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_cnpj) VALUES (?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, cnpj).Error

		return err
	}

	db.Table("entidade").Select("CONCAT(IFNULL(cnpj, ''), ';', IFNULL(nome, ''), ';', IFNULL(endereco, ''), ';', IFNULL(numero, ''), ';', IFNULL(bairro, ''), ';', IFNULL(cep, ''), ';', IFNULL(nome_municipio, ''), ';', IFNULL(uf, ''), ';', IFNULL(observacao, ''))").Where("cnpj = ?", cnpj).Row().Scan(&log.Espelho)

	err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_cnpj) VALUES (?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, cnpj).Error

	return err
}

/*  =========================
	LOG ETAPA
=========================  */

func (log *Log) LogEtapa(db *gorm.DB, codEtapa uint32, nomeTabela string, operacao string, codUsuario uint32) error {

	if operacao == "i" {
		err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1) VALUES (?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, codEtapa).Error

		return err
	}

	db.Table("etapa").Select("CONCAT(IFNULL(cod_etapa, ''), ';', IFNULL(descricao, ''), ';', IFNULL(duracao, ''), ';', IFNULL(depende, ''), ';', IFNULL(delay, ''), ';', IFNULL(setor_resp, ''))").Where("cod_etapa = ?", codEtapa).Row().Scan(&log.Espelho)

	err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1) VALUES (?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, codEtapa).Error

	return err
}

/*  =========================
	LOG ETAPAS CD
=========================  */

func (log *Log) LogEtapasCD(db *gorm.DB, codIbge uint32, codEtapa uint32, nomeTabela string, operacao string, codUsuario uint32) error {

	if operacao == "i" {
		err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1, cod_int_2) VALUES (?, ?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, codIbge, codEtapa).Error

		return err
	}

	db.Table("etapas_cd").Select("CONCAT(IFNULL(cod_ibge, ''), ';', IFNULL(cod_etapa, ''), ';', IFNULL(dt_inicio, ''), ';', IFNULL(dt_fim, ''), ';', IFNULL(responsavel, ''))").Where("cod_ibge = ? AND cod_etapa = ?", codIbge, codEtapa).Row().Scan(&log.Espelho)

	err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1, cod_int_2) VALUES (?, ?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, codIbge, codEtapa).Error

	return err
}

/*  =========================
	LOG FATURA
=========================  */

func (log *Log) LogFatura(db *gorm.DB, numNF uint32, codIbge uint32, nomeTabela string, operacao string, codUsuario uint32) error {

	if operacao == "i" {
		err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1, cod_int_2) VALUES (?, ?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, numNF, codIbge).Error

		return err
	}

	db.Table("fatura").Select("CONCAT(IFNULL(num_nf, ''), ';', IFNULL(cod_ibge, ''), ';', IFNULL(dt_nf, ''))").Where("num_nf = ? AND cod_ibge = ?", numNF, codIbge).Row().Scan(&log.Espelho)

	err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1, cod_int_2) VALUES (?, ?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, numNF, codIbge).Error

	return err
}

/*  =========================
	LOG FATURA OTB
=========================  */

func (log *Log) LogFaturaOTB(db *gorm.DB, codOtb uint32, numNF uint32, codIbge uint32, nomeTabela string, operacao string, codUsuario uint32) error {

	if operacao == "i" {
		err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1, cod_int_2, cod_int_3) VALUES (?, ?, ?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, codOtb, numNF, codIbge).Error

		return err
	}

	db.Table("fatura_otb").Select("CONCAT(IFNULL(cod_otb, ''), ';', IFNULL(num_nf, ''), ';', IFNULL(cod_ibge, ''))").Where("cod_otb = ? AND num_nf = ? AND cod_ibge =?", codOtb, numNF, codIbge).Row().Scan(&log.Espelho)

	err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1, cod_int_2, cod_int_3) VALUES (?, ?, ?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, codOtb, numNF, codIbge).Error

	return err
}

/*  =========================
	LOG ITENS
=========================  */

func (log *Log) LogItens(db *gorm.DB, codItem uint32, codTipoItem uint32, nomeTabela string, operacao string, codUsuario uint32) error {

	if operacao == "i" {
		err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1, cod_int_2) VALUES (?, ?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, codItem, codTipoItem).Error

		return err
	}

	db.Table("itens").Select("CONCAT(IFNULL(cod_item, ''), ';', IFNULL(cod_tipo_item, ''), ';', IFNULL(cod_natureza_despesa, ''), ';', IFNULL(cod_classe_empenho, ''), ';', IFNULL(descricao, ''), ';', IFNULL(unidade, ''))").Where("cod_item = ? AND cod_tipo_item = ?", codItem, codTipoItem).Row().Scan(&log.Espelho)

	err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1, cod_int_2) VALUES (?, ?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, codItem, codTipoItem).Error

	return err
}

/*  =========================
	LOG ITENS EMPENHO
=========================  */

func (log *Log) LogItensEmpenho(db *gorm.DB, idEmpenho uint32, codItem uint32, codTipoItem uint32, nomeTabela string, operacao string, codUsuario uint32) error {

	if operacao == "i" {
		err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1, cod_int_2, cod_int_3) VALUES (?, ?, ?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, idEmpenho, codItem, codTipoItem).Error

		return err
	}

	db.Table("itens_empenho").Select("CONCAT(IFNULL(id_empenho, ''), ';', IFNULL(cod_item, ''), ';', IFNULL(cod_tipo_item, ''), ';', IFNULL(cod_previsao_empenho, ''), ';', IFNULL(valor, ''), ';', IFNULL(quantidade, ''))").Where("id_empenho = ? AND cod_item = ? AND cod_tipo_item = ?", idEmpenho, codItem, codTipoItem).Row().Scan(&log.Espelho)

	err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1, cod_int_2, cod_int_3) VALUES (?, ?, ?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, idEmpenho, codItem, codTipoItem).Error

	return err
}

/*  =========================
	LOG ITENS FATURA
=========================  */

func (log *Log) LogItensFatura(db *gorm.DB, numNF uint32, codIbge uint32, idEmpenho uint32, codItem uint32, codTipoItem uint32, nomeTabela string, operacao string, codUsuario uint32) error {

	if operacao == "i" {
		err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1, cod_int_2, cod_int_3, cod_int_4, cod_int_5) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, numNF, codIbge, idEmpenho, codItem, codTipoItem).Error

		return err
	}

	db.Table("itens_fatura").Select("CONCAT(IFNULL(num_nf, ''), ';', IFNULL(cod_ibge, ''), ';', IFNULL(id_empenho, ''), ';', IFNULL(cod_item, ''), ';', IFNULL(cod_tipo_item, ''), ';', IFNULL(valor, ''), ';', IFNULL(quantidade, ''))").Where("num_nf = ? AND cod_ibge = ? AND id_empenho = ? AND cod_item = ? AND cod_tipo_item = ?", numNF, codIbge, idEmpenho, codItem, codTipoItem).Row().Scan(&log.Espelho)

	err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1, cod_int_2, cod_int_3, cod_int_4, cod_int_5) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, numNF, codIbge, idEmpenho, codItem, codTipoItem).Error

	return err
}

/*  =========================
	LOG ITENS OTB
=========================  */

func (log *Log) LogItensOTB(db *gorm.DB, codOtb uint32, numNF uint32, codIbge uint32, idEmpenho uint32, codItem uint32, codTipoItem uint32, nomeTabela string, operacao string, codUsuario uint32) error {

	if operacao == "i" {
		err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1, cod_int_2, cod_int_3, cod_int_4, cod_int_5, cod_int_6) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, codOtb, numNF, codIbge, idEmpenho, codItem, codTipoItem).Error

		return err
	}

	db.Table("itens_otb").Select("CONCAT(IFNULL(cod_otb, ''), ';', IFNULL(num_nf, ''), ';', IFNULL(cod_ibge, ''), ';', IFNULL(id_empenho, ''), ';', IFNULL(cod_item, ''), ';', IFNULL(cod_tipo_item, ''), ';', IFNULL(valor, ''), ';', IFNULL(quantidade, ''))").Where("cod_otb = ? AND num_nf = ? AND cod_ibge = ? AND id_empenho = ? AND cod_item = ? AND cod_tipo_item = ?", codOtb, numNF, codIbge, idEmpenho, codItem, codTipoItem).Row().Scan(&log.Espelho)

	err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1, cod_int_2, cod_int_3, cod_int_4, cod_int_5, cod_int_6) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, codOtb, numNF, codIbge, idEmpenho, codItem, codTipoItem).Error

	return err
}

/*  =========================
	LOG ITENS PREVISAO EMPENHO
=========================  */

func (log *Log) LogItensPrevisaoEmpenho(db *gorm.DB, codPrevisaoEmpenho uint32, codItem uint32, codTipoItem uint32, nomeTabela string, operacao string, codUsuario uint32) error {

	if operacao == "i" {
		err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1, cod_int_2, cod_int_3) VALUES (?, ?, ?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, codPrevisaoEmpenho, codItem, codTipoItem).Error

		return err
	}

	db.Table("itens_previsao_empenho").Select("CONCAT(IFNULL(cod_previsao_empenho, ''), ';', IFNULL(cod_item, ''), ';', IFNULL(cod_tipo_item, ''), ';', IFNULL(cod_lote, ''), ';', IFNULL(valor, ''), ';', IFNULL(quantidade, ''))").Where("cod_previsao_empenho = ? AND cod_item = ? AND cod_tipo_item = ?", codPrevisaoEmpenho, codItem, codTipoItem).Row().Scan(&log.Espelho)

	err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1, cod_int_2, cod_int_3) VALUES (?, ?, ?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, codPrevisaoEmpenho, codItem, codTipoItem).Error

	return err
}

/*  =========================
	LOG LOTE
=========================  */

func (log *Log) LogLote(db *gorm.DB, codLote uint32, nomeTabela string, operacao string, codUsuario uint32) error {

	if operacao == "i" {
		err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1) VALUES (?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, codLote).Error

		return err
	}

	db.Table("lote").Select("CONCAT(IFNULL(cod_lote, ''), ';', IFNULL(cnpj, ''), ';', IFNULL(contrato, ''), ';', IFNULL(dt_inicio_vig, ''), ';', IFNULL(dt_final_vig, ''), ';', IFNULL(dt_reajuste, ''))").Where("cod_lote = ?", codLote).Row().Scan(&log.Espelho)

	err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1) VALUES (?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, codLote).Error

	return err
}

/*  =========================
	LOG LOTE ITENS
=========================  */

func (log *Log) LogLoteItens(db *gorm.DB, codLote uint32, codItem uint32, codTipoItem uint32, nomeTabela string, operacao string, codUsuario uint32) error {

	if operacao == "i" {
		err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1, cod_int_2, cod_int_3) VALUES (?, ?, ?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, codLote, codItem, codTipoItem).Error

		return err
	}

	db.Table("lote_itens").Select("CONCAT(IFNULL(cod_lote, ''), ';', IFNULL(cod_item, ''), ';', IFNULL(cod_tipo_item, ''), ';', IFNULL(preco, ''))").Where("cod_lote = ? AND cod_item = ? AND cod_tipo_item = ?", codLote, codItem, codTipoItem).Row().Scan(&log.Espelho)

	err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1, cod_int_2, cod_int_3) VALUES (?, ?, ?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, codLote, codItem, codTipoItem).Error

	return err
}

/*  =========================
	LOG MODULO
=========================  */

func (log *Log) LogModulo(db *gorm.DB, codModulo uint32, nomeTabela string, operacao string, codUsuario uint32) error {

	if operacao == "i" {
		err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1) VALUES (?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, codModulo).Error

		return err
	}

	db.Table("modulo").Select("CONCAT(IFNULL(cod_modulo, ''), ';', IFNULL(categoria_1, ''), ';', IFNULL(categoria_2, ''), ';', IFNULL(categoria_3, ''), ';', IFNULL(descricao, ''))").Where("cod_modulo = ?", codModulo).Row().Scan(&log.Espelho)

	err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1) VALUES (?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, codModulo).Error

	return err
}

/*  =========================
	LOG MUNICIPIO
=========================  */

func (log *Log) LogMunicipio(db *gorm.DB, codIbge uint32, nomeTabela string, operacao string, codUsuario uint32) error {

	if operacao == "i" {
		err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1) VALUES (?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, codIbge).Error

		return err
	}

	db.Table("municipio").Select("CONCAT(IFNULL(cod_ibge, ''), ';', IFNULL(nome_municipio, ''), ';', IFNULL(populacao, ''), ';', IFNULL(uf, ''), ';', IFNULL(regiao, ''), ';', IFNULL(cnpj, ''), ';', IFNULL(dist_capital, ''), ';', IFNULL(endereco, ''), ';', IFNULL(numero, ''), ';', IFNULL(complemento, ''), ';', IFNULL(bairro, ''), ';', IFNULL(idhm, ''), ';', IFNULL(latitude, ''), ';', IFNULL(longitude, ''))").Where("cod_ibge = ?", codIbge).Row().Scan(&log.Espelho)

	err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1) VALUES (?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, codIbge).Error

	return err
}

/*  =========================
	LOG NATUREZA DESPESA
=========================  */

func (log *Log) LogNaturezaDespesa(db *gorm.DB, codNaturezaDespesa uint32, nomeTabela string, operacao string, codUsuario uint32) error {

	if operacao == "i" {
		err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1) VALUES (?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, codNaturezaDespesa).Error

		return err
	}

	db.Table("natureza_despesa").Select("CONCAT(IFNULL(cod_natureza_despesa, ''), ';', IFNULL(descricao, ''))").Where("cod_natureza_despesa = ?", codNaturezaDespesa).Row().Scan(&log.Espelho)

	err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1) VALUES (?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, codNaturezaDespesa).Error

	return err
}

/*  =========================
	LOG OTB
=========================  */

func (log *Log) LogOTB(db *gorm.DB, codOTB uint32, nomeTabela string, operacao string, codUsuario uint32) error {

	if operacao == "i" {
		err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1) VALUES (?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, codOTB).Error

		return err
	}

	db.Table("otb").Select("CONCAT(IFNULL(cod_otb, ''), ';', IFNULL(dt_pgto, ''))").Where("cod_otb = ?", codOTB).Row().Scan(&log.Espelho)

	err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1) VALUES (?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, codOTB).Error

	return err
}

/*  =========================
	LOG PID
=========================  */

func (log *Log) LogPid(db *gorm.DB, codPid uint32, nomeTabela string, operacao string, codUsuario uint32) error {

	if operacao == "i" {
		err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1) VALUES (?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, codPid).Error

		return err
	}

	db.Table("pid").Select("CONCAT(IFNULL(cod_pid, ''), ';', IFNULL(cod_ibge, ''), ';', IFNULL(nome, ''), ';', IFNULL(inep, ''))").Where("cod_pid = ?", codPid).Row().Scan(&log.Espelho)

	err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1) VALUES (?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, codPid).Error

	return err
}

/*  =========================
	LOG PID TIPOLOGIA
=========================  */

func (log *Log) LogPidTipologia(db *gorm.DB, codPid uint32, codTipologia uint32, nomeTabela string, operacao string, codUsuario uint32) error {

	if operacao == "i" {
		err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1, cod_int_2) VALUES (?, ?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, codPid, codTipologia).Error

		return err
	}

	db.Table("pid_tipologia").Select("CONCAT(IFNULL(cod_pid, ''), ';', IFNULL(cod_tipologia, ''))").Where("cod_pid = ? AND cod_tipologia", codPid, codTipologia).Row().Scan(&log.Espelho)

	err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1, cod_int_2) VALUES (?, ?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, codPid, codTipologia).Error

	return err
}

/*  =========================
	LOG PONTO
=========================  */

func (log *Log) LogPonto(db *gorm.DB, codPonto uint32, codCategoria uint32, codIbge uint32, nomeTabela string, operacao string, codUsuario uint32) error {

	if operacao == "i" {
		err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1, cod_int_2, cod_int_3) VALUES (?, ?, ?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, codPonto, codCategoria, codIbge).Error

		return err
	}

	db.Table("ponto").Select("CONCAT(IFNULL(cod_ponto, ''), ';', IFNULL(cod_categoria, ''), ';', IFNULL(cod_ibge, ''), ';', IFNULL(cod_pid, ''), ';', IFNULL(endereco, ''), ';', IFNULL(numero, ''), ';', IFNULL(complemento, ''), ';', IFNULL(bairro, ''), ';', IFNULL(cep, ''), ';', IFNULL(latitude, ''), ';', IFNULL(longitude, ''))").Where("cod_ponto = ? AND cod_categoria = ? AND cod_ibge = ?", codPonto, codCategoria, codIbge).Row().Scan(&log.Espelho)

	err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1, cod_int_2, cod_int_3) VALUES (?, ?, ?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, codPonto, codCategoria, codIbge).Error

	return err
}

/*  =========================
	LOG PREFEITOS
=========================  */

func (log *Log) LogPrefeitos(db *gorm.DB, codPrefeito uint32, nomeTabela string, operacao string, codUsuario uint32) error {

	if operacao == "i" {
		err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1) VALUES (?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, codPrefeito).Error

		return err
	}

	db.Table("prefeitos").Select("CONCAT(IFNULL(cod_prefeito, ''), ';', IFNULL(cod_ibge, ''), ';', IFNULL(nome, ''), ';', IFNULL(cpf, ''), ';', IFNULL(rg, ''), ';', IFNULL(partido, ''), ';', IFNULL(exercicio, ''))").Where("cod_prefeito = ?", codPrefeito).Row().Scan(&log.Espelho)

	err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1) VALUES (?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, codPrefeito).Error

	return err
}

/*  =========================
	LOG PREVISAO EMPENHO
=========================  */

func (log *Log) LogPrevisaoEmpenho(db *gorm.DB, codPrevisaoEmpenho uint32, nomeTabela string, operacao string, codUsuario uint32) error {

	if operacao == "i" {
		err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1) VALUES (?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, codPrevisaoEmpenho).Error

		return err
	}

	db.Table("previsao_empenho").Select("CONCAT(IFNULL(cod_previsao_empenho, ''), ';', IFNULL(cod_lote, ''), ';', IFNULL(cod_natureza_despesa, ''), ';', IFNULL(data, ''), ';', IFNULL(tipo, ''), ';', IFNULL(ano_referencia, ''))").Where("cod_previsao_empenho = ?", codPrevisaoEmpenho).Row().Scan(&log.Espelho)

	err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1) VALUES (?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, codPrevisaoEmpenho).Error

	return err
}

/*  =========================
	LOG PROCESSO
=========================  */

func (log *Log) LogProcesso(db *gorm.DB, codProcesso string, codIbge uint32, nomeTabela string, operacao string, codUsuario uint32) error {

	if operacao == "i" {
		err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1, cod_processo) VALUES (?, ?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, codIbge, codProcesso).Error

		return err
	}

	db.Table("processo").Select("CONCAT(IFNULL(cod_processo, ''), ';', IFNULL(cod_ibge, ''), ';', IFNULL(descricao, ''))").Where("cod_processo = ? AND cod_ibge = ?", codProcesso, codIbge).Row().Scan(&log.Espelho)

	err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1, cod_processo) VALUES (?, ?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, codIbge, codProcesso).Error

	return err
}

/*  =========================
	LOG REAJUSTE
=========================  */

func (log *Log) LogReajuste(db *gorm.DB, anoRef uint32, codLote uint32, nomeTabela string, operacao string, codUsuario uint32) error {

	if operacao == "i" {
		err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1, cod_int_2) VALUES (?, ?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, anoRef, codLote).Error

		return err
	}

	db.Table("reajuste").Select("CONCAT(IFNULL(ano_ref, ''), ';', IFNULL(cod_lote, ''), ';', IFNULL(percentual, ''))").Where("ano_ref = ? AND cod_lote = ?", anoRef, codLote).Row().Scan(&log.Espelho)

	err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1, cod_int_2) VALUES (?, ?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, anoRef, codLote).Error

	return err
}

/*  =========================
	LOG TELEFONE
=========================  */

func (log *Log) LogTelefone(db *gorm.DB, codTelefone uint32, nomeTabela string, operacao string, codUsuario uint32) error {

	if operacao == "i" {
		err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1) VALUES (?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, codTelefone).Error

		return err
	}

	db.Table("telefone").Select("CONCAT(IFNULL(cod_telefone, ''), ';', IFNULL(cod_contato, ''), ';', IFNULL(telefone, ''), ';', IFNULL(tipo, ''))").Where("cod_telefone = ?", codTelefone).Row().Scan(&log.Espelho)

	err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1) VALUES (?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, codTelefone).Error

	return err
}

/*  =========================
	LOG TIPO ITEM
=========================  */

func (log *Log) LogTipoItem(db *gorm.DB, codTipoItem uint32, nomeTabela string, operacao string, codUsuario uint32) error {

	if operacao == "i" {
		err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1) VALUES (?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, codTipoItem).Error

		return err
	}

	db.Table("tipo_item").Select("CONCAT(IFNULL(cod_tipo_item, ''), ';', IFNULL(descricao, ''))").Where("cod_tipo_item = ?", codTipoItem).Row().Scan(&log.Espelho)

	err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1) VALUES (?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, codTipoItem).Error

	return err
}

/*  =========================
	LOG TIPOLOGIA
=========================  */

func (log *Log) LogTipologia(db *gorm.DB, codTipologia uint32, nomeTabela string, operacao string, codUsuario uint32) error {

	if operacao == "i" {
		err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1) VALUES (?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, codTipologia).Error

		return err
	}

	db.Table("tipologia").Select("CONCAT(IFNULL(cod_tipologia, ''), ';', IFNULL(descricao, ''))").Where("cod_tipologia = ?", codTipologia).Row().Scan(&log.Espelho)

	err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1) VALUES (?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, codTipologia).Error

	return err
}

/*  =========================
	LOG UACOM
=========================  */

func (log *Log) LogUacom(db *gorm.DB, codIbge uint32, data string, nomeTabela string, operacao string, codUsuario uint32) error {

	if operacao == "i" {
		err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1, cod_data) VALUES (?, ?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, codIbge, data).Error

		return err
	}

	db.Table("uacom").Select("CONCAT(IFNULL(cod_ibge, ''), ';', IFNULL(data, ''), ';', IFNULL(titulo, ''), ';', IFNULL(relato, ''))").Where("cod_ibge = ? AND data = ?", codIbge, data).Row().Scan(&log.Espelho)

	err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1, cod_data) VALUES (?, ?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, codIbge, data).Error

	return err
}

/*  =========================
	LOG UACOM ASSUNTO
=========================  */

func (log *Log) LogUacomAssunto(db *gorm.DB, codIbge uint32, data string, codAssunto uint32, nomeTabela string, operacao string, codUsuario uint32) error {

	if operacao == "i" {
		err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1, cod_int_2, cod_data) VALUES (?, ?, ?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, codIbge, codAssunto, data).Error

		return err
	}

	db.Table("uacom_assunto").Select("CONCAT(IFNULL(cod_ibge, ''), ';', IFNULL(data, ''), ';', IFNULL(cod_assunto, '')").Where("cod_ibge = ? AND data = ? AND cod_assunto", codIbge, data, codAssunto).Row().Scan(&log.Espelho)

	err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1, cod_int_2, cod_data) VALUES (?, ?, ?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, codIbge, codAssunto, data).Error

	return err
}

/*  =========================
	LOG USUARIO
=========================  */

func (log *Log) LogUsuario(db *gorm.DB, codNewUsuario uint32, nomeTabela string, operacao string, codUsuario uint32) error {

	if operacao == "i" {
		err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1) VALUES (?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, codNewUsuario).Error

		return err
	}

	db.Table("usuario").Select("CONCAT(IFNULL(cod_usuario, ''), ';', IFNULL(nome, ''), ';', IFNULL(email, ''), ';', IFNULL(status, ''), ';', IFNULL(login, ''), ';', IFNULL(senha, '')").Where("cod_usuario = ?", codNewUsuario).Row().Scan(&log.Espelho)

	err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1) VALUES (?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, codNewUsuario).Error

	return err
}

/*  =========================
	LOG USUARIO MODULO
=========================  */

func (log *Log) LogUsuarioModulo(db *gorm.DB, codUser uint32, codModulo uint32, nomeTabela string, operacao string, codUsuario uint32) error {

	if operacao == "i" {
		err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1, cod_int_2) VALUES (?, ?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, codUser, codModulo).Error

		return err
	}

	db.Table("usuario_modulo").Select("CONCAT(IFNULL(cod_usuario, ''), ';', IFNULL(cod_modulo, ''))").Where("cod_usuario = ? AND cod_modulo = ?", codUser, codModulo).Row().Scan(&log.Espelho)

	err := db.Debug().Exec("INSERT INTO log(cod_usuario, nome_tabela, operacao, espelho, cod_int_1, cod_int_2) VALUES (?, ?, ?, ?, ?, ?)", codUsuario, nomeTabela, operacao, log.Espelho, codUser, codModulo).Error

	return err
}
