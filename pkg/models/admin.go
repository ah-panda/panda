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
	DeveloperId *int
}

func (opt ListAdminsOption) WithDeveloperId(developerId int) ListAdminsOption {
	opt.DeveloperId = &developerId
	return opt
}

func ListAdmins(opt ListAdminsOption) ([]*Admin, error) {
	return listAdmins(x, opt)
}

func listAdmins(e Engine, opt ListAdminsOption) ([]*Admin, error) {
	var as []*Admin

	if opt.DeveloperId != nil {
		e.Where("developer_id = ?", *opt.DeveloperId)
	}

	err := e.Asc("developer_id").Find(&as)
	if err != nil {
		return nil, err
	}

	return as, nil
}
