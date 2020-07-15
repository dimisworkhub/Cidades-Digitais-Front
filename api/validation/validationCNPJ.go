package validation

import (
	"fmt"
	"strconv"
)

func ValidationCNPJ(cnpj string) bool {

	var numberCNPJ [14]uint64
	var soma, resto uint64

	//	parse da string recebida
	for i, data := range cnpj {
		numberCNPJ[i], _ = strconv.ParseUint(string(data), 10, 64)
	}

	//	validacao do primeiro digito
	for i := 0; i < 4; i++ {
		soma = soma + numberCNPJ[i]*uint64(5-i)
	}

	for i := 0; i < 8; i++ {
		soma = soma + numberCNPJ[4+i]*uint64(9-i)
	}

	resto = soma % 11

	if resto < 2 {
		resto = 0
	} else {
		resto = 11 - resto
	}

	if resto != numberCNPJ[12] {
		fmt.Println("Erro na validado do primeiro digito")
		return false
	}

	soma = 0

	//	validacao do segundo digito
	for i := 0; i < 5; i++ {
		soma = soma + numberCNPJ[i]*uint64(6-i)
	}

	for i := 0; i < 8; i++ {
		soma = soma + numberCNPJ[5+i]*uint64(9-i)
	}

	resto = soma % 11

	if resto < 2 {
		resto = 0
	} else {
		resto = 11 - resto
	}

	if resto != numberCNPJ[13] {
		fmt.Println("Erro na validado do segundo digito")
		return false
	}

	return true
}
