package auth

import (
	"net/http"
	"strconv"
)

func GetUserIdFromReq(req *http.Request) (int, error) {
	cookie, err := req.Cookie("resthub_user_id")
	if err != nil {
		return 0, err
	}

	return strconv.Atoi(cookie.Name)
}
