// Copyright 2018 The XT Authors

package config

type HttpConf struct {
	Port int `yaml:"port"`
}

func DefaultHttpConf() *HttpConf {
	return &HttpConf{
		Port: 9527,
	}
}

func TestHttpConf() *HttpConf {
	return &HttpConf{
		Port: 19527,
	}
}
