
var STATUS_MAP = [
    {'id': 0, 'name': '未发布'},
    {'id': 1, 'name': '已发布'},
    {'id': 2, 'name': '已废弃'}
  ];
var STATUS_ARRAY = ['未发布', '已发布', '已废弃'];
var STATUS_INDEX = {'未发布': 0, '已发布': 1, '已废弃': 2};

var ACCESS_MAP = [
    {'id': 0, 'name': '任何人可访问'},
    {'id': 1, 'name': '企业内部可访问'},
    {'id': 2, 'name': '需要授权访问'}
  ];
var ACCESS_ARRAY = ['任何人可访问', '企业内部可访问', '需要授权访问'];

var ROLE_MAP = [
    {'id': 0, 'name': '超级管理员'},
    {'id': 1, 'name': '管理员'},
    {'id': 2, 'name': '操作员'}
  ];
var ROLE_ARRAY = ['超级管理员', '管理员', '操作员'];

var IS_AUDIT_MAP = [
    {'id': 0, 'name': '未审核'},
    {'id': 1, 'name': '审核未通过'},
    {'id': 2, 'name': '审核通过'}
  ];
var IS_AUDIT_ARRAY = ['未审核', '审核未通过', '审核通过'];
var IS_AUDIT_INDEX = {'未审核': 0, '审核未通过': 1, '审核通过': 2};

var DETAIL_LOG_MAP = [
    {'id': 0, 'name': 'Off'},
    {'id': 1, 'name': 'Error'},
    {'id': 2, 'name': 'Info'},
    {'id': 3, 'name': 'Debug'}
  ];
var DETAIL_LOG_ARRAY = ['Off', 'Error', 'Info', 'Debug'];

var FORBIDDEN_DOMAINS = [
    "https://apis.mumway.com",
    "https://pre-apis.mumway.com",
    "https://sit-apis.mumway.com",
    "https://dev-apis.mumway.com",
  ];
