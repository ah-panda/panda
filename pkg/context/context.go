package context

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
