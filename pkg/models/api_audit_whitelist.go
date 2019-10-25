package models

type ApiAuditWhitelist struct {
	Deleted int    `xorm:"not null default 0 TINYINT(8)"`
	GroupId int    `xorm:"unique(idx_api_audit_whitelist_rtx_group_id) INT(10)"`
	Rtx     string `xorm:"unique(idx_api_audit_whitelist_rtx_group_id) CHAR(32)"`
}
