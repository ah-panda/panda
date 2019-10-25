package logging

import (
	"io"
	"os"

	"github.com/sirupsen/logrus"
)

type Level uint32

// These are the different logging levels. You can set the logging level to log
// on your instance of logger, obtained with `logrus.New()`.
const (
	// PanicLevel level, highest level of severity. Logs and then calls panic with the
	// message passed to Debug, Info, ...
	PanicLevel Level = iota
	// FatalLevel level. Logs and then calls `os.Exit(1)`. It will exit even if the
	// logging level is set to Panic.
	FatalLevel
	// ErrorLevel level. Logs. Used for errors that should definitely be noted.
	// Commonly used for hooks to send errors to an error tracking service.
	ErrorLevel
	// WarnLevel level. Non-critical entries that deserve eyes.
	WarnLevel
	// InfoLevel level. General operational entries about what's going on inside the
	// application.
	InfoLevel
	// DebugLevel level. Usually only enabled when debugging. Very verbose logging.
	DebugLevel
)

type Logger interface {
	Debug(v ...interface{})
	Debugf(format string, v ...interface{})

	Info(v ...interface{})
	Infof(format string, v ...interface{})

	Warn(v ...interface{})
	Warnf(format string, v ...interface{})

	Error(v ...interface{})
	Errorf(format string, v ...interface{})

	Fatal(v ...interface{})
	Fatalf(format string, v ...interface{})

	Panic(v ...interface{})

	Panicf(format string, v ...interface{})
}

type logger struct {
	log *logrus.Logger
}

func DefaultLogger() Logger {
	return NewLogger(os.Stdout, DebugLevel)
}

func NewLogger(out io.Writer, lvl Level) Logger {
	ll := logrus.New()
	ll.SetOutput(out)
	ll.SetLevel(logrus.Level(lvl))

	log := &logger{log: ll}

	return log
}

func (l *logger) Debug(v ...interface{}) {
	l.log.Debug(v...)

}

func (l *logger) Debugf(format string, v ...interface{}) {
	l.log.Debugf(format, v...)
}

func (l *logger) Info(v ...interface{}) {
	l.log.Info(v...)
}

func (l *logger) Infof(format string, v ...interface{}) {
	l.log.Infof(format, v...)
}

func (l *logger) Warn(v ...interface{}) {
	l.log.Warn(v...)
}

func (l *logger) Warnf(format string, v ...interface{}) {
	l.log.Warnf(format, v...)
}

func (l *logger) Error(v ...interface{}) {
	l.log.Error(v...)
}

func (l *logger) Errorf(format string, v ...interface{}) {
	l.log.Errorf(format, v...)
}

func (l *logger) Fatal(v ...interface{}) {
	l.log.Fatal(v...)
}

func (l *logger) Fatalf(format string, v ...interface{}) {
	l.log.Fatalf(format, v...)
}

func (l *logger) Panic(v ...interface{}) {
	l.log.Panic(v...)
}

func (l *logger) Panicf(format string, v ...interface{}) {
	l.log.Panicf(format, v...)
}
