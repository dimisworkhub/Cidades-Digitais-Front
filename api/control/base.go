package control

import (
	"CidadesDigitaisV2/api/config"
	"CidadesDigitaisV2/api/validation"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql" //mysql database driver
	"github.com/rs/cors"
)

/*	=========================
		COMENTAR
=========================	*/

type Server struct {
	DB     *gorm.DB
	Router *mux.Router
}

func (server *Server) Initialize(Dbdriver, DbUser, DbPassword, DbPort, DbHost, DbName string) {

	var err error

	if Dbdriver == "mysql" {
		DBURL := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8&parseTime=True&loc=Local", DbUser, DbPassword, DbHost, DbPort, DbName)
		server.DB, err = gorm.Open(Dbdriver, DBURL)
		server.DB.SingularTable(true)
		if err != nil {
			fmt.Printf("Cannot connect to database ", Dbdriver)
			log.Fatal("This is the error:", err)
		} else {
			fmt.Printf("We are connected to the %s database\n", Dbdriver)
		}
	}

}

func (server *Server) Run() {
	httpServer := &http.Server{
		Addr:         config.SERVER_ADDR,
		IdleTimeout:  200 * time.Millisecond,
		ReadTimeout:  20 * time.Second,
		WriteTimeout: 10 * time.Second,
	}

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedHeaders:   []string{"Authorization"},
		AllowedMethods:   []string{http.MethodOptions, http.MethodPost, http.MethodPut, http.MethodGet, http.MethodDelete},
		AllowCredentials: true,
		// Enable Debugging for testing, consider disabling in production
		Debug: true,
	})

	h := server.CreateHandler()

	httpServer.Handler = c.Handler(h)

	validation.CreateValidator()
	log.Println("Listening to port 8080")
	log.Fatal("[FATAL] Server Problem ", httpServer.ListenAndServe())

}
