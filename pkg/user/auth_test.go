package user

import "testing"

func Test_getSignPasswd(t *testing.T) {
	type args struct {
		username    string
		password    string
		developerId string
		createTime  int
	}
	tests := []struct {
		name string
		args args
		want string
	}{
		{name: "1",
			args: args{
				username:    "admin",
				password:    "123456",
				developerId: "C00000000001",
				createTime:  1569859200,
			},
			want: "fe4678c3a26ea3b93d335b71be1a19bf",
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := getSignPasswd(tt.args.username, tt.args.password, tt.args.developerId, tt.args.createTime); got != tt.want {
				t.Errorf("getSignPasswd() = %v, want %v", got, tt.want)
			}
		})
	}
}
