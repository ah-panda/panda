package context

import "github.com/ah-panda/panda/pkg/models"

type APIContext struct {
	Render      `json:"-"`
	UserID      int    `json:"userId"`
	Username    string `json:"username"`
	DeveloperId string `json:"developerId"`
	Sign        string `json:"sign"`
	ClientIP    string `json:"clientIP"`
	Timestamp   int64  `json:"timestamp"`
}

func (c *APIContext) WithRender(r Render) {
	c.Render = r
}

func (c *APIContext) IsAllowed(developerId string, groupId int, charactar int) bool {
	userId := c.UserID
	ams, err := models.ListAdmins(models.ListAdminsOption{}.WithUserId(userId))
	if err != nil {
		return false
	}

	if ams == nil || len(ams) == 0 {
		return false
	}

	needed := models.Admin{
		UserId:      userId,
		DeveloperId: developerId,
		GroupId:     groupId,
		Charactar:   charactar,
	}
	ams = ams.Merge()
	for _, am := range ams {
		ret := needed.Cmp(*am)
		if ret != 0 && ret <= 0 {
			return true
		}
	}
	return false
}

/*
is_allowed(self, user_id, developer_id, group_id, charactar):
        needed = AdminModel(user_id, developer_id, group_id, charactar)
        ams = AdminModel.get_list_by_user_id(user_id)
        if ams is False or len(ams) <= 0:
            return False
        ams = AdminModel.merge(ams)
        for am in ams:
            ret = AdminModel.cmp(needed, am)
            CORELOG.Info([('needed', needed.to_object()), ('am', am.to_object()), ('cmp ret', ret)])
            if ret is not False and ret <= 0:
                return True
        return False
*/
