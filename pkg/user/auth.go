package user

import (
	"fmt"
	"strings"

	"github.com/ah-panda/panda/pkg/utils"
)

const salt = "lfdkj_=+lfdjalfkjc$8"

func isRtxUser(username string) bool {
	if strings.HasSuffix(username, "local.com") {
		return false
	} else {
		return true
	}
}

func getSignPasswd(username, password, developerId string, createTime int) string {
	d := fmt.Sprintf("%s__%s__%s__%s__%d", username, salt, password, developerId, createTime)
	return utils.MD5([]byte(d))
}
