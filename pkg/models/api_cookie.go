package models

type ApiCookie struct {
	CookieName  string `xorm:"not null default '' unique VARCHAR(32)"`
	CreateTime  int    `xorm:"not null default 0 INT(10)"`
	Description string `xorm:"not null default '' VARCHAR(512)"`
	DeveloperId string `xorm:"not null CHAR(20)"`
	Id          int    `xorm:"not null pk autoincr unique INT(10)"`
	IsDeleted   int    `xorm:"not null default 0 TINYINT(8)"`
	UpdateTime  int    `xorm:"not null default 0 INT(10)"`
}
