package main

import "github.com/ah-panda/panda/cmd"

//go:generate go-bindata -o pkg/static/static.go -pkg=static static/ static/css static/fonts static/image static/js

func main() {
	cmd.Execute()
}
