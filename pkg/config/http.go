// Copyright 2018 The XT Authors

package config

type HttpConf struct {
	Port    int  `yaml:"port"`
	DevMode bool `yaml:"devMode"`
}

func DefaultHttpConf() *HttpConf {
	return &HttpConf{
		Port:    9527,
		DevMode: false,
	}
}

func TestHttpConf() *HttpConf {
	return &HttpConf{
		Port:    19527,
		DevMode: false,
	}
}
