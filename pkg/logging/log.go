package logging

var l = DefaultLogger()

func Debug(v ...interface{}) {
	l.Debug(v...)

}

func Debugf(format string, v ...interface{}) {
	l.Debugf(format, v...)
}

func Info(v ...interface{}) {
	l.Info(v...)
}

func Infof(format string, v ...interface{}) {
	l.Infof(format, v...)
}

func Warn(v ...interface{}) {
	l.Warn(v...)
}

func Warnf(format string, v ...interface{}) {
	l.Warnf(format, v...)
}

func Error(v ...interface{}) {
	l.Error(v...)
}

func Errorf(format string, v ...interface{}) {
	l.Errorf(format, v...)
}

func Fatal(v ...interface{}) {
	l.Fatal(v...)
}

func Fatalf(format string, v ...interface{}) {
	l.Fatalf(format, v...)
}

func Panic(v ...interface{}) {
	l.Panic(v...)
}

func Panicf(format string, v ...interface{}) {
	l.Panicf(format, v...)
}
