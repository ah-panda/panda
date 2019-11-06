package context

type Render interface {
	JSON(int, interface{})

	SetCookie(name, value string, maxAge int, path, domain string, secure, httpOnly bool)
}
