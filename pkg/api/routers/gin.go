package routers

import (
	"net/http"

	"github.com/ah-panda/panda/pkg/api/status"
	"github.com/ah-panda/panda/pkg/config/setting"
	"github.com/ah-panda/panda/pkg/static"
	"github.com/gin-gonic/gin"
)

func NewGin() *gin.Engine {
	r := gin.Default()

	gin.SetMode(gin.ReleaseMode)

	r.GET("/", func(c *gin.Context) {
		c.Redirect(http.StatusMovedPermanently, "/static/index.html")
	})

	if setting.HttpServerCfg.DevMode {
		r.StaticFS("/static", static.NewHTTPFileSystemDev())
	} else {
		r.StaticFS("/static", static.NewHTTPFileSystem())
	}
	r.GET("/favicon.ico", func(c *gin.Context) {
		c.Redirect(http.StatusMovedPermanently, "/static/favicon.ico")
		return
	})

	r.GET("/version", func(c *gin.Context) {
		res, err := status.Version()
		if err != nil {
			_ = c.AbortWithError(http.StatusInternalServerError, err)
			return
		}
		c.JSON(res.Code, res.Data)
	})

	r.POST("/login", login)

	authorized := r.Group("/", sessionMiddle)
	authorized.Use()
	{
		authorized.Any("/logout", logout)
		authorized.GET("/user", func(c *gin.Context) {

		})

		authorized.GET("/admin", func(c *gin.Context) {

		})
	}

	return r
}
