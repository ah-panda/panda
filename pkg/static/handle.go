package static

import (
	"net/http"

	assetfs "github.com/elazarl/go-bindata-assetfs"
)

func NewHandle() http.Handler {
	return http.FileServer(NewHTTPFileSystem())
}

func NewHTTPFileSystem() http.FileSystem {
	return &assetfs.AssetFS{
		Asset:     Asset,
		AssetDir:  AssetDir,
		AssetInfo: AssetInfo,
		Prefix:    "static",
	}
}

func NewHTTPFileSystemDev() http.FileSystem {
	return http.Dir("static")
}
