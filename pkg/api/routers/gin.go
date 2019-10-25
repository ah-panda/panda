package routers

import (
	"net/http"

	"github.com/ah-panda/panda/pkg/api/status"
	"github.com/gin-gonic/gin"
)

func NewGin() *gin.Engine {
	r := gin.Default()

	gin.SetMode(gin.ReleaseMode)

	r.GET("/version", func(c *gin.Context) {
		res, err := status.Version()
		if err != nil {
			_ = c.AbortWithError(http.StatusInternalServerError, err)
			return
		}
		c.JSON(res.Code, res.Data)
	})

	return r
}
