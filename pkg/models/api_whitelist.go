package models

type ApiWhitelist struct {
	ApiId       int    `xorm:"not null pk unique(api_id) unique(idx_api_whitelist_api_id_developer_id) INT(10)"`
	DeveloperId string `xorm:"not null pk unique(api_id) unique(idx_api_whitelist_api_id_developer_id) CHAR(20)"`
}
