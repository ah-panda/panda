
var API_MANAGER_URL_MAP = [
    {id: 0, name: '开发联调环境', url: 'http://dev-resthub.mumway.com'},
    {id: 1, name: '集成测试环境', url: 'http://sit-resthub.mumway.com'},
    {id: 2, name: '预发布环境', url: 'http://pre-resthub.mumway.com'},
    {id: 3, name: '生产环境', url: 'http://resthub.mumway.com'},
];
var API_MANAGER_URL_ARRAY = [
    "http://dev-resthub.mumway.com",
    "http://sit-resthub.mumway.com",
    "http://pre-resthub.mumway.com",
    "http://resthub.mumway.com",
];

var API_MANAGER_ENV_URL_MAP = [
    {id: 0, config: {name_e: 'dev', name: '开发联调环境', url: 'http://dev-resthub.mumway.com/#/api_group_list', switch_flag: 'switch_dev'}},
    {id: 1, config: {name_e: 'sit', name: '集成测试环境', url: 'http://sit-resthub.mumway.com/#/api_group_list', switch_flag: 'switch_sit'}},
    {id: 2, config: {name_e: 'pre', name: '预发布环境', url: 'http://pre-resthub.mumway.com/#/api_group_list', switch_flag: 'switch_pre'}},
    {id: 3, config: {name_e: 'product', name: '生产环境', url: 'http://resthub.mumway.com/#/api_group_list', switch_flag: 'switch_product'}},
];

var DEFAULT_ENV_ID = 0;
var ENABLE_REGISTER = !!DEFAULT_ENV_ID;
var IGNORE_AUTH = (DEFAULT_ENV_ID < 2);

var Environment = {RESTHUB_DOMAIN_NAME: "dev-apis.mumway.com"};

var RESTHUB_CORE_URL_MAP = [
    {id: 0, name: '开发联调环境', url: 'https://dev-apis.mumway.com'},
    {id: 1, name: '集成测试环境', url: 'https://sit-apis.mumway.com'},
    {id: 2, name: '预发布环境', url: 'https://pre-apis.mumway.com'},
    {id: 3, name: '生产环境', url: 'https://apis.mumway.com'}
];

