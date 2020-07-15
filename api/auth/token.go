package auth

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	jwt "github.com/dgrijalva/jwt-go"
)

/*  =========================
	FUNCAO CRIAR TOKEN AO REALIZAR LOGIN
=========================  */

func CreateToken(userID uint32, userMod []uint32) (string, error) {

	//	Cria um mapa de informações sobre o user
	claims := jwt.MapClaims{}

	//	Autoriza o usuario
	claims["authorized"] = true

	//	id do usuario
	claims["userID"] = userID

	//	Modulos do usuario
	claims["userMod"] = userMod

	//	Token expira depois de 8 hrs
	claims["exp"] = time.Now().Add(time.Hour * 8).Unix()

	//	Criptografa o token no metodo HS256
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	//	API_SECRET esta nas variaveis de ambiente
	return token.SignedString([]byte(os.Getenv("API_SECRET")))
}

/*  =========================
	FUNCAO PARA VALIDAR O TOKEN A QUALQUER MOMENTO
=========================  */

func TokenValid(r *http.Request) error {

	tokenString := ExtractToken(r)
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		//	Checa se o token está com a criptografia correta e header intecto
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("[ERROR] Unexpected signing method: %v", token.Header["alg"])
		}

		return []byte(os.Getenv("API_SECRET")), nil
	})

	if err != nil {
		return fmt.Errorf("[ERROR] Invalid Token information, because, %v\n", err)
	}

	//	Printa no terminal o mapa e valida o token informado
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		Pretty(claims)
	}

	return nil
}

/*  =========================
	FUNCAO RETIRAR O TOKEN O TOKEN DA URI
=========================  */

func ExtractToken(r *http.Request) string {

	//	Extrai o token da url
	keys := r.URL.Query()
	token := keys.Get("token")
	if token != "" {
		return token
	}
	//	Caso token venha no header
	reqToken := r.Header.Get("Authorization")
	log.Printf("[INFO] Autorization Token %v", reqToken)
	if reqToken != "" {
		splitToken := strings.Split(reqToken, "Bearer ")
		reqToken = splitToken[1]
		return reqToken
	}

	return ""
}

/*  =========================
	FUNCAO EXTRAIR O ID DO TOKEN DA URI
=========================  */

func ExtractTokenID(r *http.Request) (uint32, error) {

	tokenString := ExtractToken(r)
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}

		return []byte(os.Getenv("API_SECRET")), nil
	})
	if err != nil {
		return 0, err
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if ok && token.Valid {
		uId, err := strconv.ParseUint(fmt.Sprintf("%.0f", claims["userID"]), 10, 32)
		if err != nil {
			return 0, err
		}
		return uint32(uId), nil
	}

	return 0, nil
}

/*  =========================
	FUNCAO EXTRAIR O MODULO DO TOKEN NA URI
=========================  */

func ExtractTokenMod(r *http.Request) (interface{}, error) {

	tokenString := ExtractToken(r)
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(os.Getenv("API_SECRET")), nil
	})
	if err != nil {
		return 0, err
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if ok && token.Valid {
		uMod, _ := claims["userMod"]

		return uMod, nil
	}

	return 0, nil
}

/*  =========================
  ESPELHA NO TERMINAL A STRUCT
=========================  */

func Pretty(data interface{}) {
	b, err := json.MarshalIndent(data, "", " ")
	if err != nil {
		log.Println(err)
		return
	}

	fmt.Println(string(b))
}
