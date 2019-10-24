package cmd

import (
	"fmt"

	"github.com/spf13/cobra"
)

const version = "v0.0.1"

// VersionCmd  版本信息
var versionCmd = &cobra.Command{
	Use:   "version",
	Short: "Show version info",
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println(version)
	},
}
