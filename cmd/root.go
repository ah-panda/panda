package cmd

import (
	"encoding/json"
	"fmt"
	"os"

	"github.com/ah-panda/panda/pkg/config/setting"
	"github.com/ah-panda/panda/pkg/logging"
	"github.com/spf13/cobra"
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
	cmd.Flags().StringVar(&setting.DbCfg.User, "db.user", setting.DbCfg.User, "db user")
	cmd.Flags().StringVar(&setting.DbCfg.Password, "db.password", setting.DbCfg.Password, "db password")
	cmd.Flags().StringVar(&setting.DbCfg.Host, "db.host", setting.DbCfg.Host, "db host")
	cmd.Flags().IntVar(&setting.DbCfg.Port, "db.port", setting.DbCfg.Port, "db port")
	cmd.Flags().StringVar(&setting.DbCfg.Database, "db.database", setting.DbCfg.Database, "db database")
}

func registerFlagsHttpSever(cmd *cobra.Command) {
	cmd.Flags().IntVar(&setting.HttpServerCfg.Port, "http.port", setting.HttpServerCfg.Port, "HTTP server listen addr")
	cmd.Flags().BoolVar(&setting.HttpServerCfg.DevMode, "http.devMode", setting.HttpServerCfg.DevMode, "Developer mode running service")
}

func printConfg() {
	if d, err := json.Marshal(setting.DbCfg); err == nil {
		logging.Infof("dbcfg:%s", string(d))
	}

	if d, err := json.Marshal(setting.HttpServerCfg); err == nil {
		logging.Infof("config.HttpServerCfg:%s", string(d))
	}
}
