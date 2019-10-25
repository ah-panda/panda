package models

type Developer struct {
	AccessKey     string `xorm:"not null default '' VARCHAR(32)"`
	DeveloperId   string `xorm:"CHAR(20)"`
	DeveloperName string `xorm:"VARCHAR(64)"`
	DeveloperType string `xorm:"CHAR(8)"`
	Id            int    `xorm:"not null pk autoincr INT(12)"`
}
