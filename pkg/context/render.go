package context

type Render interface {
	Query(key string) string
	Param(key string) string
	Bind(obj interface{}) error

	JSON(int, interface{})
	SetCookie(name, value string, maxAge int, path, domain string, secure, httpOnly bool)
}
