package models

type ApiGroup struct {
	DeveloperId            string `xorm:"CHAR(20)"`
	GroupDescription       string `xorm:"not null unique VARCHAR(64)"`
	GroupDescriptionPinyin string `xorm:"not null default '' VARCHAR(384)"`
	GroupId                int    `xorm:"not null pk autoincr INT(10)"`
	GroupName              string `xorm:"unique VARCHAR(64)"`
}
