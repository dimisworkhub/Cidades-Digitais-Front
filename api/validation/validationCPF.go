package validation

import (
	"fmt"
	"strconv"
)

func ValidationCPF(cpf string) bool {

	var numberCPF [11]uint64
	var soma, resto uint64

	if cpf == "00000000000" {
		return false
	}

	for i, data := range cpf {
		numberCPF[i], _ = strconv.ParseUint(string(data), 10, 64)
	}

	// 	validacao do primeiro digito
	for i := 0; i < 9; i++ {
		soma = soma + numberCPF[i]*uint64(10-i)
	}

	resto = soma * 10 % 11

	if (resto == 10) || (resto == 11) {
		resto = 0
	}
	if resto != numberCPF[9] {
		fmt.Println("[ERRO] Erro na validacao do primeiro digito!")
		return false
	}

	soma = 0

	//	Validacao do segundo digito
	for i := 0; i < 10; i++ {
		soma = soma + numberCPF[i]*uint64(11-i)
	}

	resto = soma * 10 % 11

	if (resto == 10) || (resto == 11) {
		resto = 0
	}
	if resto != numberCPF[10] {
		fmt.Println("[ERRO] Erro na validacao do segundo digito!")
		return false
	}

	return true
}
