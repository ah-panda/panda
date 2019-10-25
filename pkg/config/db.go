// Copyright 2018 The XT Authors

package config

import "fmt"

type DbConf struct {
	DriverName string `yaml:"driverName"`
	User       string `yaml:"user"`
	Password   string `yaml:"password"`
	Host       string `yaml:"host"`
	Port       int    `yaml:"port"`
	Database   string `yaml:"database"`
	Poolsize   int    `yaml:"poolsize"`
}

func (dc *DbConf) DataSource() string {
	switch dc.DriverName {
	case "mysql":
		return fmt.Sprintf("%s:%s@tcp(%s:%d)/%s", dc.User, dc.Password, dc.Host, dc.Port, dc.Database)
	case "postgres":
		return fmt.Sprintf("postgres://%s:%s@%s:%d/%s?sslmode=disable", dc.User, dc.Password, dc.Host, dc.Port, dc.Database)
	default:
		return ""
	}
}

func DefatulDbConf() *DbConf {
	return &DbConf{
		DriverName: "mysql",
		User:       "root",
		Password:   "",
		Host:       "localhost",
		Port:       3306,
		Database:   "api_manager",
		Poolsize:   50,
	}
}

func TestDbConf() *DbConf {
	return &DbConf{
		DriverName: "mysql",
		User:       "root",
		Password:   "",
		Host:       "localhost",
		Port:       3306,
		Database:   "api_manager_test",
		Poolsize:   50,
	}
}
