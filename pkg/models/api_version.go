package models

type ApiVersion struct {
	Access                int    `xorm:"not null default 0 TINYINT(1)"`
	ApiId                 int    `xorm:"not null default 0 INT(10)"`
	CacheExpires          int    `xorm:"not null default 0 INT(10)"`
	ConnectTimeout        int    `xorm:"not null default 500 INT(10)"`
	Cookies               string `xorm:"not null default '' VARCHAR(264)"`
	CreateTime            int    `xorm:"not null default 0 INT(10)"`
	Creator               string `xorm:"not null default '' VARCHAR(64)"`
	DeleteCacheExpires    int    `xorm:"not null default 0 INT(11)"`
	DeleteInputDoc        string `xorm:"not null default '' VARCHAR(1024)"`
	DeleteIsCheckApp      int    `xorm:"not null default 0 TINYINT(1)"`
	DeleteIsCheckSession  int    `xorm:"not null default 0 TINYINT(1)"`
	DeleteIsPrivate       int    `xorm:"not null default 0 TINYINT(1)"`
	DeleteIsPublic        int    `xorm:"not null default 0 TINYINT(1)"`
	DeleteIsToken         int    `xorm:"not null default 0 TINYINT(1)"`
	DeleteOutputDoc       string `xorm:"not null default '' VARCHAR(1024)"`
	DeleteSessionParamMap string `xorm:"not null default '' VARCHAR(128)"`
	DeleteSessionUrlMap   string `xorm:"not null default '' VARCHAR(128)"`
	DeleteTestInputDoc    string `xorm:"not null default '' VARCHAR(64)"`
	DeleteTestOutputDoc   string `xorm:"not null default '' VARCHAR(64)"`
	Depend                string `xorm:"not null default '' VARCHAR(256)"`
	Description           string `xorm:"not null default '' VARCHAR(1024)"`
	DetailLog             int    `xorm:"not null default 0 TINYINT(1)"`
	GetCacheExpires       int    `xorm:"not null default 0 INT(10)"`
	GetInputDoc           string `xorm:"not null default '' VARCHAR(1024)"`
	GetIsCheckApp         int    `xorm:"not null default 0 TINYINT(1)"`
	GetIsCheckSession     int    `xorm:"not null default 0 TINYINT(1)"`
	GetIsPrivate          int    `xorm:"not null default 0 TINYINT(1)"`
	GetIsPublic           int    `xorm:"not null default 0 TINYINT(1)"`
	GetIsToken            int    `xorm:"not null default 0 TINYINT(1)"`
	GetOutputDoc          string `xorm:"TEXT"`
	GetSessionParamMap    string `xorm:"not null default '' VARCHAR(128)"`
	GetSessionUrlMap      string `xorm:"not null default '' VARCHAR(128)"`
	GetTestInputDoc       string `xorm:"not null default '' VARCHAR(1024)"`
	GetTestOutputDoc      string `xorm:"TEXT"`
	Id                    int    `xorm:"not null pk autoincr INT(10)"`
	IsAudit               int    `xorm:"not null default 0 TINYINT(1)"`
	IsDelete              int    `xorm:"not null default 0 TINYINT(1)"`
	IsDeleted             int    `xorm:"not null default 0 TINYINT(1)"`
	IsGet                 int    `xorm:"not null default 0 TINYINT(1)"`
	IsPatch               int    `xorm:"not null default 0 TINYINT(1)"`
	IsPost                int    `xorm:"not null default 0 TINYINT(1)"`
	IsPut                 int    `xorm:"not null default 0 TINYINT(1)"`
	MaxPerMinute          int    `xorm:"not null default 0 INT(10)"`
	Modifier              string `xorm:"not null default '' VARCHAR(512)"`
	OuterUrl              string `xorm:"VARCHAR(128)"`
	PatchCacheExpires     int    `xorm:"not null default 0 INT(11)"`
	PatchInputDoc         string `xorm:"TEXT"`
	PatchIsCheckApp       int    `xorm:"not null default 0 TINYINT(1)"`
	PatchIsCheckSession   int    `xorm:"not null default 0 TINYINT(1)"`
	PatchIsPrivate        int    `xorm:"not null default 0 TINYINT(1)"`
	PatchIsPublic         int    `xorm:"not null default 0 TINYINT(1)"`
	PatchIsToken          int    `xorm:"not null default 0 TINYINT(1)"`
	PatchOutputDoc        string `xorm:"TEXT"`
	PatchSessionParamMap  string `xorm:"not null default '' VARCHAR(128)"`
	PatchSessionUrlMap    string `xorm:"not null default '' VARCHAR(128)"`
	PatchTestInputDoc     string `xorm:"not null default '' VARCHAR(64)"`
	PatchTestOutputDoc    string `xorm:"not null default '' VARCHAR(64)"`
	PostCacheExpires      int    `xorm:"not null default 0 INT(11)"`
	PostInputDoc          string `xorm:"TEXT"`
	PostIsCheckApp        int    `xorm:"not null default 0 TINYINT(1)"`
	PostIsCheckSession    int    `xorm:"not null default 0 TINYINT(1)"`
	PostIsPrivate         int    `xorm:"not null default 0 TINYINT(1)"`
	PostIsPublic          int    `xorm:"not null default 0 TINYINT(1)"`
	PostIsToken           int    `xorm:"not null default 0 TINYINT(1)"`
	PostOutputDoc         string `xorm:"TEXT"`
	PostSessionParamMap   string `xorm:"not null default '' VARCHAR(128)"`
	PostSessionUrlMap     string `xorm:"not null default '' VARCHAR(128)"`
	PostTestInputDoc      string `xorm:"TEXT"`
	PostTestOutputDoc     string `xorm:"TEXT"`
	PreLambda             string `xorm:"not null TEXT"`
	PreUrl                string `xorm:"not null default '' VARCHAR(128)"`
	ProductLambda         string `xorm:"not null TEXT"`
	ProductUrl            string `xorm:"not null default '' VARCHAR(128)"`
	ProviderType          int    `xorm:"not null default 0 TINYINT(1)"`
	PutCacheExpires       int    `xorm:"not null default 0 INT(11)"`
	PutInputDoc           string `xorm:"TEXT"`
	PutIsCheckApp         int    `xorm:"not null default 0 TINYINT(1)"`
	PutIsCheckSession     int    `xorm:"not null default 0 TINYINT(1)"`
	PutIsPrivate          int    `xorm:"not null default 0 TINYINT(1)"`
	PutIsPublic           int    `xorm:"not null default 0 TINYINT(1)"`
	PutIsToken            int    `xorm:"not null default 0 TINYINT(1)"`
	PutOutputDoc          string `xorm:"TEXT"`
	PutSessionParamMap    string `xorm:"not null default '' VARCHAR(128)"`
	PutSessionUrlMap      string `xorm:"not null default '' VARCHAR(128)"`
	PutTestInputDoc       string `xorm:"not null default '' VARCHAR(64)"`
	PutTestOutputDoc      string `xorm:"not null default '' VARCHAR(64)"`
	RequestTimeout        int    `xorm:"not null default 0 INT(10)"`
	SandboxLambda         string `xorm:"not null TEXT"`
	SandboxUrl            string `xorm:"not null default '' VARCHAR(128)"`
	Status                int    `xorm:"not null default 0 TINYINT(1)"`
	TestInput             string `xorm:"not null default '' VARCHAR(1024)"`
	TestLambda            string `xorm:"not null TEXT"`
	TestOutput            string `xorm:"not null default '' VARCHAR(1024)"`
	TestUrl               string `xorm:"not null default '' VARCHAR(128)"`
	Timeout               int    `xorm:"not null default 0 INT(10)"`
	Token                 string `xorm:"not null default '' VARCHAR(32)"`
	UpdateTime            int    `xorm:"not null default 0 INT(10)"`
	Version               string `xorm:"not null default '' VARCHAR(16)"`
}
