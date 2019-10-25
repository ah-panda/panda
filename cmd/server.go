package cmd

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/ah-panda/panda/pkg/api/routers"
	"github.com/ah-panda/panda/pkg/logging"
	"github.com/ah-panda/panda/pkg/models"
	"github.com/spf13/cobra"
)

var serverCmd = &cobra.Command{
	Use:   "server",
	Short: "启动http server",
	RunE:  server,
}

func init() {
	registerFlagsHttpSever(serverCmd)
	registerFlagsDb(serverCmd)
}

func server(cmd *cobra.Command, args []string) error {
	var err error

	printConfg()

	err = models.InitDb("mysql", dbCfg.DataSource())
	if err != nil {
		logging.Fatal("init db err:", err)
	}

	srv := &http.Server{
		Addr:    fmt.Sprintf(":%d", httpServerCfg.Port),
		Handler: routers.NewGin(),
	}

	go func() {
		// service connections
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logging.Fatal("start server err:", err)
		}
	}()

	// Wait for interrupt signal to gracefully shutdown the server with
	// a timeout of 5 seconds.
	quit := make(chan os.Signal)
	// kill (no param) default send syscall.SIGTERM
	// kill -2 is syscall.SIGINT
	// kill -9 is syscall.SIGKILL but can't be catch, so don't need add it
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	logging.Infof("Shutdown Server ...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		logging.Fatal("Server Shutdown:", err)
	}
	// catching ctx.Done(). timeout of 5 seconds.
	select {
	case <-ctx.Done():
		logging.Infof("timeout of 5 seconds.")
	}
	logging.Infof("Server exiting")

	return nil
}
