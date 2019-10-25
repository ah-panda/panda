package models

type ApiVersionAppendixAudit struct {
	AuditComment string `xorm:"not null default '' VARCHAR(4096)"`
	Auditor      string `xorm:"not null default '' VARCHAR(512)"`
	CreateTime   int    `xorm:"not null default 0 INT(10)"`
	Id           int    `xorm:"not null pk unique INT(10)"`
	IsDeleted    int    `xorm:"not null default 0 TINYINT(8)"`
	UpdateTime   int    `xorm:"not null default 0 INT(10)"`
}
