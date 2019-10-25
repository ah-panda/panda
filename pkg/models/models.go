package models

import (
	"database/sql"
	"errors"
	"fmt"
	"log"
	"os"
	"time"

	_ "github.com/go-sql-driver/mysql"
	//_ "github.com/lib/pq"
	"xorm.io/core"
	"xorm.io/xorm"
)

// Engine represents a XORM engine or session.
type Engine interface {
	Table(tableNameOrBean interface{}) *xorm.Session
	Count(...interface{}) (int64, error)
	Decr(column string, arg ...interface{}) *xorm.Session
	Delete(interface{}) (int64, error)
	Exec(...interface{}) (sql.Result, error)
	Find(interface{}, ...interface{}) error
	Get(interface{}) (bool, error)
	ID(interface{}) *xorm.Session
	In(string, ...interface{}) *xorm.Session
	Incr(column string, arg ...interface{}) *xorm.Session
	Insert(...interface{}) (int64, error)
	InsertOne(interface{}) (int64, error)
	Iterate(interface{}, xorm.IterFunc) error
	Join(joinOperator string, tablename interface{}, condition string, args ...interface{}) *xorm.Session
	SQL(interface{}, ...interface{}) *xorm.Session
	Where(interface{}, ...interface{}) *xorm.Session
	Asc(colNames ...string) *xorm.Session
}

var (
	x *xorm.Engine

	_driverName, _dataSourceName string

	tables []interface{}
)

func init() {
	tables = append(tables,
		new(Admin), new(Api), new(ApiAuditWhitelist), new(ApiCookie),
		new(ApiGroup), new(ApiGroupWhitelist), new(ApiVersion), new(ApiVersionAppendixAudit),
		new(AppCategory),

		new(Developer),

		new(GwConf),

		new(InnerApp), new(InnerUser),

		new(User), new(UserBasicInfo),
	)

	fmt.Printf("--------------------------------\n")
	fmt.Printf("total tables: %d\n", len(tables))
	fmt.Printf("--------------------------------\n")

	gonicNames := []string{"SSL"}
	for _, name := range gonicNames {
		core.LintGonicMapper[name] = true
	}
}

func checkDriverSupport(d string) bool {
	if d == "postgres" || d == "mysql" {
		return true
	}

	return false
}

func InitDb(driverName, dataSourceName string) (err error) {
	if !checkDriverSupport(driverName) {
		return errors.New("unsupported db driver")
	}

	_driverName = driverName
	_dataSourceName = dataSourceName

	x, err = getEngine(driverName, dataSourceName)
	if err != nil {
		return err
	}

	err = x.Ping()
	if err != nil {
		return errors.New("pingerr:" + err.Error())
	}

	x.SetMapper(core.GonicMapper{})
	x.SetLogger(xorm.NewSimpleLogger(os.Stdout))
	x.SetLogLevel(core.LOG_DEBUG)
	x.ShowSQL(true)
	x.SetTZLocation(time.Local)

	if err = x.Sync2(tables...); err != nil {
		log.Printf("xorm Sync2 err:%s", err.Error())
		return err
	}

	return nil
}

func getEngine(driverName, dataSourceName string) (*xorm.Engine, error) {
	return xorm.NewEngine(driverName, dataSourceName)
}
