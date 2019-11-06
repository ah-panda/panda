package models

type Developer struct {
	AccessKey     string `xorm:"not null default '' VARCHAR(32)"`
	DeveloperId   string `xorm:"CHAR(20)"`
	DeveloperName string `xorm:"VARCHAR(64)"`
	DeveloperType string `xorm:"CHAR(8)"`
	Id            int    `xorm:"not null pk autoincr INT(12)"`
}

func CreateDeveloper(d *Developer) error {
	return createDeveloper(x, d)
}

func createDeveloper(e Engine, d *Developer) error {
	_, err := e.Insert(d)

	return err
}

func GetDeveloperByDeveloperId(developerId string) (*Developer, error) {
	return getDeveloperByDeveloperId(x, developerId)
}

func getDeveloperByDeveloperId(e Engine, developerId string) (*Developer, error) {
	d := &Developer{
		DeveloperId: developerId,
	}

	has, err := e.Get(d)
	if err != nil {
		return nil, err
	}

	if !has {
		return nil, ErrNotExist{Key: developerId}
	}

	return d, nil
}

type ListDevelopersOption struct{}

func ListDevelopers(opt ListDevelopersOption) ([]*Developer, error) {
	return listDevelopers(x, opt)
}

func listDevelopers(e Engine, opt ListDevelopersOption) ([]*Developer, error) {
	var ds []*Developer

	err := e.Asc("developer_id").Find(&ds)
	if err != nil {
		return nil, err
	}

	return ds, nil
}
