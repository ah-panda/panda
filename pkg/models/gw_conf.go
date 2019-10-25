package models

type GwConf struct {
	_default    string `xorm:"not null default 'int' VARCHAR(32)"`
	_type       string `xorm:"not null default 'int' VARCHAR(32)"`
	Description string `xorm:"not null default '' VARCHAR(128)"`
	Id          int    `xorm:"not null pk autoincr INT(10)"`
	Name        string `xorm:"not null default '' VARCHAR(16)"`
	Value       string `xorm:"not null default '' VARCHAR(32)"`
}
