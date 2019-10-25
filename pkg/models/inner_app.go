package models

type InnerApp struct {
	Id            int    `xorm:"not null pk autoincr INT(10)"`
	Name          string `xorm:"not null default '' VARCHAR(16)"`
	PreKey        string `xorm:"not null default '' VARCHAR(32)"`
	PreSecret     string `xorm:"not null default '' VARCHAR(32)"`
	ProductKey    string `xorm:"not null default '' VARCHAR(32)"`
	ProductSecret string `xorm:"not null default '' VARCHAR(32)"`
	SandboxKey    string `xorm:"not null default '' VARCHAR(32)"`
	SandboxSecret string `xorm:"not null default '' VARCHAR(32)"`
	TestKey       string `xorm:"not null default '' VARCHAR(32)"`
	TestSecret    string `xorm:"not null default '' VARCHAR(32)"`
}
