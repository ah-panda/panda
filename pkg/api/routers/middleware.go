package routers

import (
	"errors"
	"fmt"
	"net/http"
	"strconv"

	"github.com/ah-panda/panda/pkg/context"
	"github.com/ah-panda/panda/pkg/utils"
	"github.com/gin-gonic/gin"
)

const (
	SessionKey = "_session_key"
)

const (
	cookieExpires = 3600 * 24 * 7
	cookiePath    = "/"
	cookieDomain  = "."
)

func sessionMiddle(c *gin.Context) {
	ctx, err := getSession(c)
	if err != nil {
		c.Redirect(http.StatusSeeOther, "/static/login.html")
		//c.AbortWithStatusJSON(http.StatusUnauthorized, structs.NewErrResult(http.StatusUnauthorized, err.Error()))
		return
	}

	if getSign(ctx.UserID, ctx.Username, true, ctx.Timestamp, ctx.ClientIP) != ctx.Sign {
		c.Redirect(http.StatusSeeOther, "/static/login.html")
		//c.AbortWithStatusJSON(http.StatusUnauthorized, structs.NewErrResult(http.StatusUnauthorized, err.Error()))
		return
	}

	c.Set(SessionKey, ctx)
}

func getSession(c *gin.Context) (*context.APIContext, error) {
	userIDStr, err := c.Cookie("resthub_user_id")
	if err != nil {
		return nil, err
	}
	userID, err := strconv.Atoi(userIDStr)
	if err != nil {
		return nil, err
	}

	userName, err := c.Cookie("resthub_user_name")
	if err != nil {
		return nil, err
	}
	sign, err := c.Cookie("resthub_sign")
	if err != nil {
		return nil, err
	}
	isLoginStr, err := c.Cookie("resthub_is_login")
	if err != nil {
		return nil, err
	}

	isLogin, err := strconv.ParseBool(isLoginStr)
	if err != nil {
		return nil, err
	}

	if !isLogin {
		return nil, errors.New("not login")
	}

	timestampStr, err := c.Cookie("resthub_timestamp")
	if err != nil {
		return nil, err
	}
	timestamp, err := strconv.ParseInt(timestampStr, 10, 64)
	if err != nil {
		return nil, err
	}

	clientIp, err := c.Cookie("resthub_client_ip")
	if err != nil {
		return nil, err
	}

	ctx := &context.APIContext{
		UserID:      userID,
		Username:    userName,
		DeveloperId: "",
		Sign:        sign,
		ClientIP:    clientIp,
		Timestamp:   timestamp,
	}
	ctx.WithRender(c)

	return ctx, nil
}

func postSession(ctx *context.APIContext) {
	ctx.SetCookie("resthub_user_id", strconv.Itoa(ctx.UserID), cookieExpires, cookiePath, cookieDomain, false, true)
	ctx.SetCookie("resthub_user_name", ctx.Username, cookieExpires, cookiePath, cookieDomain, false, true)
	sign := getSign(ctx.UserID, ctx.Username, true, ctx.Timestamp, ctx.ClientIP)
	ctx.Sign = sign
	ctx.SetCookie("resthub_sign", sign, cookieExpires, cookiePath, cookieDomain, false, true)
	ctx.SetCookie("resthub_is_login", strconv.FormatBool(true), cookieExpires, cookiePath, cookieDomain, false, true)
	ctx.SetCookie("resthub_timestamp", fmt.Sprintf("%d", ctx.Timestamp), cookieExpires, cookiePath, cookieDomain, false, true)
	ctx.SetCookie("resthub_client_ip", ctx.ClientIP, cookieExpires, cookiePath, cookieDomain, false, true)
}

func deleteSession(ctx *context.APIContext) {
	ctx.SetCookie("resthub_is_login", strconv.FormatBool(false), cookieExpires, cookiePath, cookieDomain, false, true)
	ctx.SetCookie("resthub_sign", "", cookieExpires, cookiePath, cookieDomain, false, true)
}

func getSign(userid int, username string, islogin bool, timestamp int64, clientIp string) string {
	d := fmt.Sprintf("%d__%s__%s__%d__%s", userid, username, strconv.FormatBool(islogin), timestamp, clientIp)
	return utils.MD5([]byte(d))
}
