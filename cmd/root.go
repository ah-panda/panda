package cmd

import (
	"encoding/json"
	"fmt"
	"os"

	"github.com/ah-panda/panda/pkg/config"
	"github.com/ah-panda/panda/pkg/logging"
	"github.com/spf13/cobra"
)

var (
	dbCfg         = config.DefatulDbConf()
	httpServerCfg = config.DefaultHttpConf()
)

var rootCmd = &cobra.Command{
	Use:   "panda",
	Short: "Panda is a API management system.",
	Long:  ``,
	Run: func(cmd *cobra.Command, args []string) {
		// Do Stuff Here
	},
}

func init() {
	rootCmd.AddCommand(versionCmd)
	rootCmd.AddCommand(serverCmd)
}

func Execute() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}

func registerFlagsDb(cmd *cobra.Command) {
	cmd.Flags().StringVar(&dbCfg.User, "db.user", dbCfg.User, "db user")
	cmd.Flags().StringVar(&dbCfg.Password, "db.password", dbCfg.Password, "db password")
	cmd.Flags().StringVar(&dbCfg.Host, "db.host", dbCfg.Host, "db host")
	cmd.Flags().IntVar(&dbCfg.Port, "db.port", dbCfg.Port, "db port")
	cmd.Flags().StringVar(&dbCfg.Database, "db.database", dbCfg.Database, "db database")
}

func registerFlagsHttpSever(cmd *cobra.Command) {
	cmd.Flags().IntVar(&httpServerCfg.Port, "http.port", httpServerCfg.Port, "http server listen addr")
}

func printConfg() {
	if d, err := json.Marshal(dbCfg); err == nil {
		logging.Infof("dbcfg:%s", string(d))
	}

	if d, err := json.Marshal(httpServerCfg); err == nil {
		logging.Infof("httpServerCfg:%s", string(d))
	}
}
