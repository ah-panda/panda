package models

import "fmt"

type Admin struct {
	Charactar   int    `xorm:"not null INT(8)"`
	Deleted     int    `xorm:"not null default 0 TINYINT(8)"`
	DeveloperId string `xorm:"not null unique(idx_admin_user_id_developer_id_group_id) CHAR(20)"`
	GroupId     int    `xorm:"unique(idx_admin_user_id_developer_id_group_id) INT(10)"`
	UserId      int    `xorm:"not null unique(idx_admin_user_id_developer_id_group_id) INT(20)"`

	Developer *Developer `xorm:"-"`
	User      *User
}

func (a Admin) Cmp(a2 Admin) int {
	if a.UserId != a2.UserId {
		return 0
	}
	if a.DeveloperId != a2.DeveloperId {
		return 0
	}
	if a.GroupId != -1 && a2.GroupId != -1 {
		if a.GroupId != a2.GroupId {
			return 0
		}
	} else if a.GroupId == -1 && a2.GroupId != -1 {
		return 1

	} else if a.GroupId != -1 && a2.GroupId == -1 {
		return -1
	}

	if a.Charactar > a2.Charactar {
		return -1
	} else if a.Charactar < a2.Charactar {
		return 1
	}

	return 0
}

func (a *Admin) LoadDeveloper() error {
	return a.loadDeveloper(x)
}

func (a *Admin) loadDeveloper(e Engine) (err error) {
	if a.Developer == nil {
		a.Developer, err = getDeveloperByDeveloperId(e, a.DeveloperId)
		if err != nil {
			return fmt.Errorf("getDeveloperByDeveloperId [%s]: %v", a.DeveloperId, err)
		}
	}
	return nil
}
func (a *Admin) LoadUser() error {
	return a.loadDeveloper(x)
}

func (a *Admin) loadUser(e Engine) (err error) {
	if a.Developer == nil {
		a.Developer, err = getDeveloperByDeveloperId(e, a.DeveloperId)
		if err != nil {
			return fmt.Errorf("getDeveloperByDeveloperId [%s]: %v", a.DeveloperId, err)
		}
	}
	return nil
}
func CreateAdmin(d *Admin) error {
	return createAdmin(x, d)
}

func createAdmin(e Engine, d *Admin) error {
	_, err := e.Insert(d)

	return err
}

type ListAdminsOption struct {
	developerId *int
	userId      *int
}

func (opt ListAdminsOption) WithDeveloperId(developerId int) ListAdminsOption {
	opt.developerId = &developerId
	return opt
}

func (opt ListAdminsOption) WithUserId(userId int) ListAdminsOption {
	opt.userId = &userId
	return opt
}

func ListAdmins(opt ListAdminsOption) (Admins, error) {
	return listAdmins(x, opt)
}

func listAdmins(e Engine, opt ListAdminsOption) (Admins, error) {
	var as []*Admin

	if opt.developerId != nil {
		e.Where("developer_id = ?", *opt.developerId)
	}

	if opt.userId != nil {
		e.Where("user_id = ?", *opt.userId)
	}

	err := e.Asc("developer_id").Find(&as)
	if err != nil {
		return nil, err
	}

	return as, nil
}

type Admins []*Admin

func (ams Admins) unique() (*Admin, Admins) {
	var res Admins
	obj := ams[0]
	for _, v := range ams[1:] {
		ret := v.Cmp(*obj)

		if ret == 0 {
			res = append(res, v)
			continue
		}

		if ret == 1 {
			obj = v
		}
	}
	return obj, res
}
func (ams Admins) Merge() Admins {
	var res Admins

	var obj *Admin
	objs := ams
	for {
		l := len(objs)
		if l <= 0 {
			break
		}
		obj, objs = objs.unique()
		res = append(res, obj)
	}

	return res
}
