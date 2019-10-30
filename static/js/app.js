
function SidebarCtrl($scope, $location, $http, $cookieStore) {
    $scope.active = function (id) {
        var path = $location.path();
        var sidebar;
        if (/^\/api_group_list$/.test(path)) sidebar = 'api_group_list';
        else if(/^\/api_version_list$/.test(path)) sidebar = 'api_version_list';
        else if(/^\/api_version_detail\/\d+$/.test(path)) sidebar = 'api_version_list';
        else if(/^\/add_api_version$/.test(path)) sidebar = 'api_version_list';
        else if(/^\/update_api_version\/\d+$/.test(path)) sidebar = 'api_version_list';
        else if(/^\/sync_api_version\/\d+$/.test(path)) sidebar = 'api_version_list';
        else if(/^\/audit_api_version\/\d+$/.test(path)) sidebar = 'api_version_list';
        else if(/^\/update_api\/\d+$/.test(path)) sidebar = 'api_version_list';
        else if(/^\/add_api$/.test(path)) sidebar = 'add_api';
        else if(/^\/release_log$/.test(path)) sidebar = 'release_log';
        else if(/^\/stress_log$/.test(path)) sidebar = 'stress_log';
        else if(/^\/api_hot_stats$/.test(path)) sidebar = 'api_hot_stats';
        else if(/^\/apihotmap$/.test(path)) sidebar = 'apihotmap';
        else if(/^\/api_cookie_list$/.test(path)) sidebar = 'api_cookie_list';
        else if(/^\/api_owner_conf$/.test(path)) sidebar = 'api_owner_conf';
        else if(/^\/request_log_stats$/.test(path)) sidebar = 'request_log_stats';
        else if(/^\/error_log_stats$/.test(path)) sidebar = 'error_log_stats';
        else if(/^\/gw_conf$/.test(path)) sidebar = 'gw_conf';
        else if(/^\/upstream$/.test(path)) sidebar = 'upstream';
        else if(/^\/open_user_list$/.test(path)) sidebar = 'open_user_list';
        else if(/^\/faq$/.test(path)) sidebar = 'faq';
        else if(/^\/turl$/.test(path)) sidebar = 'turl';
        else if(/^\/dashboard.*$/.test(path)) sidebar = 'dashboard';
        else if(/^\/query_log$/.test(path)) sidebar = 'query_log';
        else if(/^\/publish$/.test(path)) sidebar = 'publish';
        else if(/^\/subscribe$/.test(path)) sidebar = 'subscribe';
        else if(/^\/resp_contravention$/.test(path)) sidebar = 'resp_contravention';
        else sidebar = '';
        if(sidebar == id)
            return 'active';
        else
            return '';
    };
}

function RootCtrl($rootScope, $scope, storage, $http, $cookieStore, $cookies, $location, $window, UserInfo) {
    $scope.envUrls = API_MANAGER_ENV_URL_MAP;

    $scope.debugEnv = false;
    $scope.isCorporationAdmin = false;

    $rootScope.userName = $scope.userName = $cookieStore.get('resthub_user_name');

    $scope.env_id = DEFAULT_ENV_ID;
    $scope.enable_register = ENABLE_REGISTER;
    $scope.isIgnoreAuth = IGNORE_AUTH;
    $scope.is_product = ($scope.env_id === (API_MANAGER_URL_MAP.length-1));
    $scope.urlSelectChange = function() {
        $window.location.href = $scope.envUrls[$scope.env_id].config.url;
    };

    $scope.selectEnv = function(managerUrlMap) {
        var newManagerUrlMap = new Array();
        var len = managerUrlMap.length;

        for(var i=0;i<len;i++) {
            var val = API_MANAGER_URL_MAP[i];
            if ((val.id - $scope.env_id) === 1) {
                newManagerUrlMap[0] = val;
            }
        }

        return newManagerUrlMap;
    };

    var promise = UserInfo;
    promise.then(function(data) {
        $rootScope.userInfo = $scope.userInfo = data.data;
        var data = {"user_id": $scope.userInfo.user_id};
        $http({method:"get", url:'/admin', params:data}).success(function(response) {
                if (response.status == 200) {
                    var admins = response.data;
                    angular.forEach(admins, function(group, i){
                           if ((group.charactar < 1) && (group.group_id == -1)) {
                                $scope.isCorporationAdmin = true;
                        }
                    });
                }else{
                    swal("获取权限失败:" + response.message?response.message:"");
                    return;
                }
         }).error(function(data, status) {
                swal("获取用户权限失败");
                $location.path("/login");
         });
    }, function(data) {
        swal("获取用户信息失败");
        $location.path("/login");
    });
}

function WorkSpaceCtrl($scope, storage) {
    $scope.Environment = Environment;
    $scope.subtitle = '';
    $scope.$on('subtitle', function(d, subtitle) {
        $scope.subtitle = subtitle;
    });

    if(!storage.isCookieFallbackActive()) {
        storage.bind($scope, 'apiGroupId', {defaultValue: null});
    }else{
        $scope.apiGroupId = null;
    }
    $scope.$on('apiGroupId', function(d, apiGroupId) {
        $scope.apiGroupId = apiGroupId;
    });
}

function DashboardCtrl($scope, $http, $location) {
}

function DashboardRTCtrl($scope, $http, $filter,$location) {
}

function DashboardHistoryCtrl($scope, $routeParams, $http, $filter,$location,NgTableParams) {
}



function ApiCookieCtrl($scope, $http, $location, $routeParams, $cookieStore) {
    $scope.$emit('subtitle', 'API Cookies');
    $scope.cookie_buttonName = ['更多', '收起'];

    $scope.global_api_cookies = [];
    $scope.api_relevant_cookie_names = [];
    $scope.api_relevant_cookies = [];

    var data = {"developer_id": $scope.userInfo.developer_id};
    $http({method:"get", url:'/api_cookies', params:data}).success(function(response) {
         $scope.global_api_cookies = response;
    }).error(function(data, status) {
         swal("获取API cookies失败");
    });

    var data = {"developer_id": $scope.userInfo.developer_id,"has_cookie":1};
    $http({method:"get", url:'/api_versions/joint_infos', params:data}).success(function(response) {
         //$scope.api_relevant_cookies = constructCookieList(response);
        constructCookieList(response);
    }).error(function(data, status) {
         swal("获取API Versions失败");
    });

    $scope.switchShow = function(cookie_name){
        var index = $scope.api_relevant_cookie_names.indexOf(cookie_name);
        if (index != -1){
            var cookie = $scope.api_relevant_cookies[index];
            cookie.is_all_show = !cookie.is_all_show;
        }
    };

    function constructCookieList(apiVersionList){
        var cookies = [];
        var cookieArray = [];
        angular.forEach(apiVersionList, function(ver, i) {
            if( ver.cookies == "") {return;};
            var cookie_list = [];
            //数组去重
            var tmp_cookie_list = ver.cookies.split(",");
            for (var i=0;i<tmp_cookie_list.length;i++){
                if(cookie_list.indexOf(tmp_cookie_list[i]) ==-1){
                    cookie_list.push(tmp_cookie_list[i]);
                }
            }

            //按cookie分组
            var len = cookie_list.length;
            for(var i=0;i<len;i++){
                var cookie_name = cookie_list[i];
                var index = cookies.indexOf(cookie_name);
                if(index == -1){
                    cookies.push(cookie_name)
                    var cookie = {"cookie_name":cookie_name,
                                  "is_all_show":false,
                                  "representative_ver_id":ver.id,
                                  "versions":[ver]};
                    cookieArray.push(cookie);
                }else{
                    var cookie = cookieArray[index];
                    cookie.versions.push(ver);
                    cookie.versions.sort(function(a,b){return a.name>b.name});
                    cookie.representative_ver_id = cookie.versions[0].id;
                }
            }
       });

       //sort by cookie_name
       $scope.api_relevant_cookie_names = cookies.sort(function(a,b){return a > b});
       $scope.api_relevant_cookies = cookieArray.sort(function(a,b){return a.cookie_name>b.cookie_name});


       //return cookieArray;
    };
};

function ApiGroupListCtrl($scope, $http, $location, $routeParams, $cookieStore, $filter, NgTableParams, ngDialog, ngNotify, AdminInfo) {
    $scope.$emit('subtitle', 'APIs');
    $scope.statusMap = [{'id': -1, 'name': ""}].concat(STATUS_MAP);
    $scope.auditMap = [{'id': -1, 'name': ""}].concat(IS_AUDIT_MAP);
    $scope.apiListAll = [];
    $scope.apiGroupList = [];
    $scope.apiGroupListForSearch = [];
    $scope.apiGroupListToBeShow = [];
    $scope.groups_of_metatype = [];
    $scope.myApiList = null;
    $scope.apiList = [];
    $scope.apiSearchedResult = [];
    $scope.apiDone = false;
    $scope.viewType = "byGroup";
    $scope.showByGroup = true;
    $scope.showByOwn = false;
    $scope.showByAll = false;
    $scope.showBySearch = false;
    $scope.showSearchCriteria = false;
    $scope.showSearchResult = false;
    $scope.s_creator = "";
    $scope.s_group_id = -1;
    $scope.s_outerUrl = "";
    $scope.s_api_name = "";
    $scope.s_cookies = "";
    $scope.s_is_audit = -1;
    $scope.s_auditor = "";
    $scope.s_status = -1;
    $scope.selectedApiGroupObj = null;
            // 准备app apiGroup
            $scope.apiGroupList = [];
            var data = {"developer_id": $scope.userInfo.developer_id};
            $http({method:"get", url:'/api_group_jointinfo', params:data}).success(function(response) {
                if (response.status == 200){
                    var groups = response.data;
                    angular.forEach(groups, function(group, i) {
                        $scope.apiGroupList.push({
                            "group_id": group.group_id,
                            "group_description": group.group_description,
                            "group_description_pinyin": group.group_description_pinyin,
                            "spec": group.spec,
                            "group_name": group.group_name,
                            "developer_id": group.developer_id,
                            "api_count":group.api_count,
                            "version_count":group.version_count,
                            "group_administrator": []
                        });
                    });
                    $scope.meta_groups = utils.classify_group_by_pinyin($scope.apiGroupList);
                    $scope.apiGroupListToBeShow = $scope.apiGroupList;
                    $scope.apiGroupListForSearch = [{"group_id":-1,"group_description":"","group_name":"","developer_id":"","group_description_pinyin": ""}].concat(groups)

                    $http({method:"get", url:'/admin', params:data}).success(function(response) {
                        if (response.status == 200) {
                            $scope.admins = response.data;
                            angular.forEach($scope.admins, function(admin, i) {
                                angular.forEach($scope.apiGroupList, function(apiGroup, i) {
                                    if((apiGroup.group_id == admin.group_id)&&(admin.charactar<=1))
                                        apiGroup.group_administrator.push(admin.rtx);
                                });
                            });
                        }else{
                            swal("获取权限失败:" + response.message?response.message:"");
                            return;
                        }
                    }).error(function(data, status) {
                        swal("获取用户权限失败");
                        });
                }else{
                    swal("获取分组失败:" + response.message?response.message:"");
                    return;
                }
            }).error(function(data, status) {
                swal("获取分组失败");
            });
            $http({method:"get", url:'/api_versions/joint_infos', params:data}).success(function(response) {
                $scope.apiListAll = constructApiList(response);
                $scope.apiDone = true;
                $scope.tableParamsAll.reload();
            }).error(function(data, status) {
                swal("获取ApiVersion失败");
            });

    $scope.tableParamsAll = new NgTableParams(
        {
             count: 50         // count per page
        }, {
             counts: [], // hide page counts control
             paginationMaxBlocks: 20,
             paginationMinBlocks: 2,
             getData: function($defer, params) {
                 params.total($scope.apiListAll.length);
                 var orderedData =  $scope.apiListAll;
                 $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
    });

    $scope.tableParamsSearch = new NgTableParams(
        {
             count: 50         // count per page
        }, {
             counts: [], // hide page counts control
             paginationMaxBlocks: 20,
             paginationMinBlocks: 2,
             getData: function($defer, params) {
                 params.total($scope.apiSearchedResult.length);
                 var orderedData =  $scope.apiSearchedResult;
                 $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
    });


    $scope.select_metatype = function(groups_of_metatype){
        if($scope.groups_of_metatype == groups_of_metatype){
            $scope.groups_of_metatype = [];
        }else{
            $scope.groups_of_metatype = groups_of_metatype;
            $scope.apiGroupListToBeShow = $scope.groups_of_metatype;
        }
    };

    $scope.select_group = function(group){
        $scope.apiGroupId = group.group_id;
        $scope.groups_of_metatype = [];
    };

    $scope.hideGroupDetail = function(){
        $scope.groups_of_metatype = [];
    };

    $scope.showView = function(typestr) {
        $scope.viewType = typestr;
        updateShowType($scope.viewType);
    }

    function constructApiList(apiVersionList){
        var apiIds = [];
        var apiList = [];
        angular.forEach(apiVersionList, function(ver, i) {
            //按api_id分组
            var api = null;
            var index = apiIds.indexOf(ver.api_id);
            if(index == -1){
                apiIds.push(ver.api_id)
                api = {"api_id":ver.api_id,"versions":[ver]};
                apiList.push(api);
            }else{
                api = apiList[index];
                api.versions.push(ver);
            }
       });
       return apiList;
    }

    function filterApiVersionByCreator(apiList,creator){
        var filtedApiList = [];
        angular.forEach(apiList, function(api, i) {
            var versions=[];
            angular.forEach(api.versions, function(ver, i) {
                var index = ver.creator.indexOf(creator);
                if(index != -1){
                    versions.push(ver)
                }
            });
            if (versions.length >0){
                filtedApiList.push({"api_id":api.api_id,"versions":versions})
            }
       });
       return filtedApiList;
    };

    function searchApiVersion(apiList, options){
        var searchedApiList = [];
        var version_ids=[];
        angular.forEach(apiList, function(api, i) {
            var versions=[];
            angular.forEach(api.versions, function(ver, i) {
                var flag_creator = matchStrCriteria(options.creator,ver.creator);
                var flag_group = matchNumberCriteria(options.group_id,ver.group_id);
                var flag_outer_url = matchStrCriteria(options.outer_url,ver.outer_url);
                var flag_api_name = matchStrCriteria(options.api_name,ver.name);
                var flag_cookies = matchStrCriteria(options.cookies,ver.cookies);
                var flag_audit = matchNumberCriteria(options.is_audit,ver.is_audit);
                var flag_auditor = matchStrCriteria(options.auditor,ver.auditor);
                var flag_status = matchNumberCriteria(options.status,ver.status);

                if (flag_creator && flag_group && flag_outer_url && flag_api_name && flag_cookies && flag_audit && flag_auditor && flag_status){
                        versions.push(ver);
                        version_ids.push(ver.id);
                }
            });
            if (versions.length >0){
                searchedApiList.push({"api_id":api.api_id,"versions":versions})
            }
       });
       return searchedApiList;
    };

    function matchStrCriteria(toBeCompared, base){
        var flag = true;
        if(toBeCompared != null && toBeCompared != ""){
            if (base == "" || base == null){
                flag = false;
            }else if (base.indexOf(toBeCompared) ==-1){
                flag = false;
            }
        }
        return flag;
    }

    function matchNumberCriteria(toBeCompared, base){
        var flag = true;
        if ((toBeCompared != -1)&&(base != toBeCompared)){
            flag = false;
        }
        return flag;
    }

    function updateShowType(typestr) {
        if($scope.viewType === "byOwn") {
            if($scope.showByOwn) return;
            $scope.showByGroup = false;
            $scope.showByOwn = true;
            $scope.showBySearch = false;
            $scope.showByAll = false;
            if ( $scope.myApiList == null ){
                $scope.myApiList = filterApiVersionByCreator($scope.apiListAll, $scope.userName);
            }
            $scope.apiList = $scope.myApiList;
        }else if($scope.viewType === "bySearch") {
            if($scope.showBySearch) return;
            $scope.showByGroup = false;
            $scope.showByOwn = false;
            $scope.showBySearch = true;
            $scope.showByAll = false;
            restSearchOptions();
            //$scope.apiList = [];
            $scope.apiSearchedResult = [];
        }else if($scope.viewType === "all") {
            if($scope.showByAll) return;
            $scope.showByGroup = false;
            $scope.showByOwn = false;
            $scope.showBySearch = false;
            $scope.showByAll = true;
            //$scope.apiList = $scope.apiListAll;
        }else {
            if($scope.showByGroup) return;
            $scope.showByGroup = true;
            $scope.showByOwn = false;
            $scope.showBySearch = false;
            $scope.showByAll = false;
        }
    };

    function restSearchOptions(){
        $scope.s_creator = "";
        $scope.s_group_id = -1;
        $scope.selectedApiGroupObj = null;
        $scope.s_outerUrl = "";
        $scope.s_api_name = "";
        $scope.s_cookies = "";
        $scope.s_is_audit = -1;
        $scope.s_auditor = "";
        $scope.s_status = -1;
        $("input#group_types_value")[0].value="";

        $scope.showSearchResult = false;
        $scope.showSearchCriteria = true;
    };

    $scope.getSpecialLabelText = function(apiVersion) {
        return utils.getSpecialLabelText(apiVersion);
    };

    $scope.getSpecialLabelClass = function(apiVersion) {
        return utils.getSpecialLabelClass(apiVersion);
    };

    $scope.isSpecialLabelShow = function(apiVersion) {
        return utils.isSpecialLabelShow(apiVersion);
    };
    function get_group_id_by_name(group_name){
        var group_id = -1;
        var len = $scope.apiGroupList.length;
        for( var i=0;i<len;i++){
            if($scope.apiGroupList[i].group_description == group_name){
                group_id = $scope.apiGroupList[i].group_id;
                break;
            }
        }
        return group_id;
    };

    $scope.searchSubmit = function() {
        var group_type_value = $("input#group_types_value")[0].value;
        if (group_type_value != "") {
            if ($scope.selectedApiGroupObj
                    && $scope.selectedApiGroupObj.originalObject) {
                if ($scope.selectedApiGroupObj.title != group_type_value) {
                    $scope.selectedApiGroupObj = null;
                    swal('指定分类不存在,请确认');
                    return;
                }
                $scope.s_group_id = $scope.selectedApiGroupObj.originalObject.group_id;
            }else{
                $scope.s_group_id = get_group_id_by_name(group_type_value);
                if($scope.s_group_id == -1){
                    swal('指定分类不存在,请确认');
                    return;
                }
            }
        }else{
            /*if ($scope.selectedApiGroupObj
                    && $scope.selectedApiGroupObj.originalObject) {
                $scope.s_group_id = -1;
                $scope.selectedApiGroupObj = null;
            }*/
            $scope.selectedApiGroupObj = null;
            $scope.s_group_id = -1;
        }

         if ($scope.s_creator =="" &&
            $scope.s_group_id == -1 &&
            $scope.s_outerUrl == "" &&
            $scope.s_api_name == "" &&
            $scope.s_cookies == "" &&
            $scope.s_is_audit == -1 &&
            $scope.s_auditor == "" &&
            $scope.s_status == -1 ){
                swal('请指定查询条件');
                return;
        }
        var options ={
            creator: $scope.s_creator,
            group_id: $scope.s_group_id,
            outer_url: $scope.s_outerUrl,
            api_name: $scope.s_api_name,
            cookies: $scope.s_cookies,
            is_audit : $scope.s_is_audit,
            auditor : $scope.s_auditor,
            status : $scope.s_status
        }
        $scope.apiSearchedResult = searchApiVersion($scope.apiListAll, options);
        $scope.tableParamsSearch.reload();
        $scope.tableParamsSearch.page(1);
        $scope.showSearchCriteria = false;
        $scope.showSearchResult = true;
    }
    $scope.showCriteria = function(b_flag){
        $scope.showSearchCriteria = b_flag;
    }

    $scope.resetCriteria = function(){
        restSearchOptions();
    }

    $scope.deleteApi = function(api_id, version_cnt) {
        if(0 !== version_cnt) {
            swal('请先删除API的所有版本');
            return;
        }
        swal({
                title: "确定要删除吗?",
                //text: "如果需要撤销删除请联系管理员!",
                type: "warning",
                showCancelButton: true,
                cancelButtonText: "取消",
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                closeOnConfirm: false
            },
            function(){
                 $http.delete('apis/' + api_id).success(function() {
                    swal('删除成功', "3分钟后，API配置自动同步到RestHub-Core", "success");
                    /*for(var j = 0; j < $scope.apiGroupList.length; j++) {
                        appGroup = $scope.apiGroupList[j];
                        for(var i = 0; i < appGroup.apiList.length; i++) {
                            if(appGroup.apiList[i].id == id) {
                                appGroup.apiList.splice(i, 1);
                            }
                        }
                       }*/

                }).error(function(data, status) {
                    if(status == 403) {
                        swal('请先删除API的所有版本');
                    }
                });
            }
        );
    };

    $scope.openSyncApiGroup = function (groupId) {
        $scope.groupId = groupId;

        ngDialog.open({
            template: 'html/popup_sync_api_group.html',
            controller: 'SyncApiGroupCtrl',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };

    $scope.isAccessApiGroup = function (groupId) {
        if (AdminInfo.status === 200) {
            var data = AdminInfo.data;
            for (var i=0;i<data.length;i++) {
                if (data[i].group_id == -1) {
                    return true;
                }
                if (data[i].group_id == groupId) {
                    return true;
                }
            }
        }
        return false;
    };
};

function SyncApiGroupCtrl($scope, $http, $location, $routeParams, $cookieStore) {
    $scope.apimanagerURLMap = $scope.selectEnv(API_MANAGER_URL_MAP);
    $scope.apimanagerURLArray = API_MANAGER_URL_ARRAY;
    $scope.apimanagerCommonURL = $scope.env_id + 1;
    $scope.apimanagerDestURL = $scope.apimanagerURLArray[$scope.apimanagerCommonURL];
    $scope.message = "";
    $scope.release_outer_urls = [];
    $scope.syncCount = 0;

    $scope.urlSelectChange = function(x){
        $scope.apimanagerDestURL = $scope.apimanagerURLArray[x];
    }

    $scope.syncApiversions = function(api_versions) {
        var syncApiversion = function(index, api_versions) {
            if (index >= api_versions.length) {
                $scope.message = "操作完成，共计:" + $scope.syncCount;
                return;
            }
            var api_version = api_versions[index];
            if (api_version.release_time > api_version.update_time) {
                syncApiversion(index+1, api_versions, length);
                return;
            }
            $scope.syncCount = $scope.syncCount + 1;
            var data = {
                "url": $scope.apimanagerDestURL,
                "apiVersion": api_version
            };
            $scope.message = "正在同步: " + $scope.syncCount;
            $http.post('/api_versions/transshipment', data).success(function(data,status,headers,config) {
                if (status === 200){
                    $http.put("/api_versions/release_time/" + config.data.apiVersion.id);
                    console.log("同步API版本列表成功:", config.data.apiVersion.outer_url);
                    $scope.release_outer_urls.push(config.data.apiVersion.outer_url);
                }else{
                    console.log("同步API版本列表失败:", config.data.apiVersion.outer_url);
                }
                syncApiversion(index+1, api_versions, length);
            });
        }
        syncApiversion(0, api_versions);
    }

    $scope.sync = function(groupId){
        $http({method:"get", url:"/apis"}).success(function(data,status,headers,config) {
            if (status === 200){
                $scope.apis = data;
                angular.forEach($scope.apis, function(api, i) { 
                    if (api.group_id === groupId) {
                        $http({method:"get", url:"/apis/" + api.id + "/api_versions"}).success(function(data,status,headers,config) {
                            if (status === 200){
                                $scope.api_versions = data;
                                $scope.syncApiversions($scope.api_versions);
                            }else{
                                swal("获取API版本列表失败");
                            }
                        });
                    }
                });
            }else{
                swal("获取API列表失败");
            }
        });
    }
}

function OpenUserListCtrl($scope, $http, $location, $routeParams, $cookieStore) {
    $scope.$emit('subtitle', '开放用户');
    $scope.apiListAll = [];
    $scope.apiGroupList = [];
    $scope.apiGroupListForSearch = [];
    $scope.myApiList = null;
    $scope.apiList = [];
    $scope.developer_list = [];

    $scope.viewType = "byAll";
    $scope.submitButtonText = "添加";

    $scope.showByAddDeveloper = false;
    $scope.showByDeveloperID = false;
    $scope.showByAll = true;
    $scope.showBySearch = false;
    $scope.showSearchCriteria = false;
    $scope.showSearchResult = false;
    $scope.showByDetail = false;
    $scope.showByModify = false;

    resetUserAttrs();
    resetDevelopersAttrs();
    fetchDevelopers();
    fetchUsers();

    function resetUserAttrs() {
        $scope.username = "";
        $scope.password = "";
        $scope.developer_id = "C00000000002";
        $scope.fullname = "";
        $scope.email = "";
        $scope.mobilephone = "";
        $scope.description = "";
    }
    function resetDevelopersAttrs(){
        $scope.add_developer_name = "";
        $scope.add_developer_id = "此字段由系统自动分配";
        $scope.add_developer_type = "C";
        $scope.add_developer_key = "此字段由系统自动分配";
        $scope.add_bizId = "";
    };

    function fetchDevelopers(){
            $http({method:"get", url:'/developers'}).success(function(response,status) {
                if (response.status == 200){
                        $scope.developer_list = response.data;
                }else{
                        swal("获取开发者信息失败", response.message?response.message:"","error");
               }
           }).error(function(response, status) {
                    swal("获取开发者信息失败", response.message?response.message:"","error");
            });
    }
    function fetchUsers(){
            $http({method:"get", url:'/basic_user_infos', params:{rtx: $scope.userName}}).success(function(response) {
                if (response.status == 200){
                        $scope.basic_user_infos = response.data;
                }else{
                        swal("获取用户信息失败:" + response.message?response.message:"");
               }
                }).error(function(data, status) {
                    swal("获取用户信息失败");
            });
    }
    $scope.showView = function(typestr) {
        $scope.viewType = typestr;
        updateShowType($scope.viewType);
    }

    $scope.addSubmit = function() {
            var data = {
            username: $scope.username,
            password: $scope.password,
            developer_id: $scope.developer_id,
            fullname: $scope.fullname,
            email: $scope.email,
            mobilephone: $scope.mobilephone,
            description: $scope.description
        };
        $http.post('basic_user_infos', data).success(function(data) {
            swal("添加成功","OK","success");
            resetUserAttrs();
            fetchUsers();
            $scope.showView('all');
        }).error(function(data, status) {
            swal("添加失败","请联系管理员","error");
        });
    }

    $scope.deleteUser = function (username){
                swal({
                title: "确定要删除吗?",
                text: "如果需要撤销删除请联系管理员!",
                type: "warning",
                showCancelButton: true,
                cancelButtonText: "取消",
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                closeOnConfirm: false
            },
            function(){
                $http.delete('basic_user_info/' + username).success(function() {
                       swal("删除成功","OK","success");
                       fetchUsers();
                }).error(function(data, status) {
                       swal("删除失败","请联系管理员","error");
                       fetchUsers();
                   });
            }
        );
    };

    $scope.deleteDeveloper = function deleteDeveloper(developer_id){
            swal({
                title: "确定要删除吗?",
                text: "如果需要撤销删除请联系管理员!",
                type: "warning",
                showCancelButton: true,
                cancelButtonText: "取消",
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                closeOnConfirm: false
            },
            function(){
                $http.delete('developers/' + developer_id).success(function() {
                       swal("删除成功","OK","success");
                       fetchDevelopers();
                }).error(function(data, status) {
                       swal('删除失败，请联系管理员');
                       fetchDevelopers();
                   });
            }
        );
    };

    $scope.userDetail= function(userName) {
        $http({method:"get", url:'/basic_user_info/'+userName}).success(function(response) {
            if (response.status == 200){
                $scope.selectedUser = response.data;
            }else{
                swal("获取用户信息失败:" + response.message?response.message:"");
               }
            }).error(function(data, status) {
            swal("获取用户信息失败");
         });
         $scope.showView('byDetail');
    };

    $scope.updateUser= function(userName) {
        $http({method:"get", url:'/basic_user_info/'+userName}).success(function(response) {
            if (response.status == 200){
                $scope.username = response.data.username;
                  $scope.password = response.data.password;
                $scope.developer_id = response.data.developer_id;
                $scope.fullname = response.data.fullname;
                $scope.email = response.data.email;
                $scope.mobilephone = response.data.mobilephone;
                $scope.description = response.data.description;
            }else{
                swal("获取用户信息失败:" + response.message?response.message:"");
               }
            }).error(function(data, status) {
            swal("获取用户信息失败");
         });
         $scope.showView('byModify');
    };

    $scope.updateDeveloper= function(developer_id) {
        $http({method:"get", url:'/developers/'+developer_id}).success(function(response) {
            if (response){
                $scope.add_developer_name = response.developer_name;
            $scope.add_developer_id = response.developer_id;
            $scope.add_developer_type = response.developer_type;
            $scope.add_developer_key = response.developer_key;
            $scope.add_bizId = response.bizId+"";
            }else{
                swal("获取开发者信息失败:" + response.message?response.message:"");
               }
            }).error(function(data, status) {
            swal("获取开发者信息失败");
         });
         $scope.showView('showByModifyDeveloper');
    };

    $scope.updateDeveloperSubmit= function updateDeveloper() {
            var data = {
            "developer_name": $scope.add_developer_name,
            "developer_id": $scope.add_developer_id,
            "developer_type": $scope.add_developer_type,
            "developer_key": $scope.add_developer_key,
            "bizId":$scope.add_bizId
        };
        $http.put('/developers/'+$scope.add_developer_id,data).success(function(response) {
            swal("修改成功","OK","success");
                resetDevelopersAttrs();
            fetchDevelopers();
            $scope.showView('byDeveloperID');
        }).error(function(response, status) {
             swal("修改失败","请联系管理员","error");
        });
    };

    $scope.updateSummit = function(){
        var data = {
            username: $scope.username,
            password: $scope.password,
            developer_id: $scope.developer_id,
            fullname: $scope.fullname,
            email: $scope.email,
            mobilephone: $scope.mobilephone,
            description: $scope.description
        };
        $http.put('/basic_user_info/'+$scope.username,data).success(function(response) {
            swal("修改成功","OK","success");
            resetUserAttrs();
            fetchUsers();
            $scope.showView('all');
        }).error(function(data, status) {
            swal("修改失败","请联系管理员","error");
        });
    };

    $scope.back = function() {
            $scope.showView('all');
    }

    $scope.addDeveloperback = function addDeveloperback(){
                $scope.showView('byDeveloperID');
    }

    $scope.addDeveloperSubmit = function addDeveloperSubmit(){
        var data = {
            "developer_name": $scope.add_developer_name,
            "developer_id": $scope.add_developer_id,
            "developer_type": $scope.add_developer_type,
            "developer_key": $scope.add_developer_key,
            "bizId":$scope.add_bizId
        };
        $http.post('developers', data).success(function(response,status) {
                if (response.status == 200){
                        swal("添加成功","OK","success");
                        resetDevelopersAttrs();
                        fetchDevelopers();
                        $scope.showView('byDeveloperID');
                        return;
                }else{
                    swal("添加失败", response.message?response.message:"","error");
                        return;
                }
        }).error(function(response, status) {
           swal("添加失败", response.message?response.message:"","error");
           return;
        });
    };

    function updateShowType(typestr) {
        if($scope.viewType === "byAdd") {
            if($scope.showByAdd) return;
            resetUserAttrs();
            $scope.showByAddDeveloper = false;
            $scope.showByDeveloperID = false;
            $scope.showByModifyDeveloper = false;
            $scope.showByAdd = true;
            $scope.showByDetail = false;
            $scope.showByModify = false;
            $scope.showBySearch = false;
            $scope.showByAll = false;
        }else if($scope.viewType === "bySearch") {
            if($scope.showBySearch) return;
            $scope.showByAddDeveloper = false;
            $scope.showByDeveloperID = false;
            $scope.showByModifyDeveloper = false;
            $scope.showByAdd = false;
            $scope.showByDetail = false;
            $scope.showByModify = false;
            $scope.showBySearch = true;
            $scope.showByAll = false;
        }else if($scope.viewType === "byDetail") {
            if($scope.showByDetail) return;
            $scope.showByAddDeveloper = false;
            $scope.showByDeveloperID = false;
            $scope.showByModifyDeveloper = false;
            $scope.showByAdd = false;
            $scope.showByDetail = true;
            $scope.showByModify = false;
            $scope.showBySearch = false;
            $scope.showByAll = false;
        }else if($scope.viewType === "byModify") {
            if($scope.showByModify) return;
            $scope.showByAddDeveloper = false;
            $scope.showByDeveloperID = false;
            $scope.showByModifyDeveloper = false;
            $scope.showByAdd = false;
            $scope.showByDetail = false;
            $scope.showByModify = true;
            $scope.showBySearch = false;
            $scope.showByAll = false;
        }else if($scope.viewType === "all") {
            if($scope.showByAll) return;
            $scope.showByAddDeveloper = false;
            $scope.showByDeveloperID = false;
            $scope.showByModifyDeveloper = false;
            $scope.showByAdd = false;
            $scope.showByDetail = false;
            $scope.showByModify = false;
            $scope.showBySearch = false;
            $scope.showByAll = true;
        }else if($scope.viewType === "byAddDeveloper") {
            if($scope.showByAddDeveloper) return;
            resetDevelopersAttrs();
            $scope.showByAddDeveloper = true;
            $scope.showByDeveloperID = false;
            $scope.showByModifyDeveloper = false;
            $scope.showByAdd = false;
            $scope.showByDetail = false;
            $scope.showByModify = false;
            $scope.showBySearch = false;
            $scope.showByAll = false;
        }else if($scope.viewType === "byDeveloperID"){
            if($scope.showByDeveloperID) return;
            $scope.showByAddDeveloper = false;
            $scope.showByDeveloperID = true;
            $scope.showByModifyDeveloper = false;
            $scope.showByAdd = false;
            $scope.showByDetail = false;
            $scope.showByModify = false;
            $scope.showBySearch = false;
            $scope.showByAll = false;
        }else if($scope.viewType === "showByModifyDeveloper"){
            if($scope.showByModifyDeveloper) return;
            $scope.showByAddDeveloper = false;
            $scope.showByDeveloperID = false;
            $scope.showByModifyDeveloper = true;
            $scope.showByAdd = false;
            $scope.showByDetail = false;
            $scope.showByModify = false;
            $scope.showBySearch = false;
            $scope.showByAll = false;
        }
  };

};

function ApiVersionListCtrl($scope, $http, $location, $routeParams, $cookieStore) {
    $scope.$emit('subtitle', '查看API');
    $scope.apiGroupList = [];
    $scope.meta_groups = [];
    $scope.groups_of_metatype = [];
    $scope.apiGroupId = parseInt($routeParams.apiGroupId) || $scope.apiGroupId;
    $scope.selectedApiGroupObj = null;
    $scope.isOperatorOfThisAPIGroup = false;

    $scope.getSpecialLabelText = function(apiVersion) {
        return utils.getSpecialLabelText(apiVersion);
    };

    $scope.getSpecialLabelClass = function(apiVersion) {
        return utils.getSpecialLabelClass(apiVersion);
    };

    $scope.isSpecialLabelShow = function(apiVersion) {
        return utils.isSpecialLabelShow(apiVersion);
    };

    $scope.select_metatype = function(groups_of_metatype){
        if($scope.groups_of_metatype == groups_of_metatype){
            $scope.groups_of_metatype = [];
        }else{
            $scope.groups_of_metatype = groups_of_metatype;
        }
    };

    $scope.select_group = function(group){
        $scope.apiGroupId = group.group_id;
        $scope.apiGroupName = group.group_name;
        $("input#group_types_value")[0].value = group.group_description;
        $scope.apiGroupDescription = $("input#group_types_value")[0].value;
        $scope.groups_of_metatype = [];
    };

    $scope.hideGroupDetail = function(){
        $scope.groups_of_metatype = [];
    }


    function get_group_description_by_id(id,groups){
        var len = groups.length;
        for (var i=0;i<len;i++){
            if(groups[i].group_id==id) return groups[i].group_description;
        }
        return "";
    }
    function get_group_name_by_id(id, groups){
        var len = groups.length;
        for (var i=0;i<len;i++){
            if(groups[i].group_id==id) return groups[i].group_name;
        }
        return "";
    }
    //authorization check
    var data = {"developer_id": $scope.userInfo.developer_id,'group_id':$scope.apiGroupId};
    $http({method:'GET', url:'api_access', params:data}).success(function(response) {
        if (response.status == 200){
                $scope.isOperatorOfThisAPIGroup = true;
        }
    })

    // 准备apiGroupList
    $scope.apiGroupList = [];
    // 获取列表，为三级关系：api_roup -> api -> api_version
            // 准备app apiGroup
            $scope.apiGroupList = [];
            var data = {"developer_id": $scope.userInfo.developer_id};
            $http({method:"get", url:'/api_group', params:data}).success(function(response) {
                if (response.status == 200){
                    $scope.groups = response.data;
                    $scope.meta_groups = utils.classify_group_by_pinyin($scope.groups);
                    if (parseInt($scope.apiGroupId)) {
                        $("input#group_types_value")[0].value = get_group_description_by_id($scope.apiGroupId,$scope.groups);
                        $scope.apiGroupDescription = $("input#group_types_value")[0].value;
                        $scope.apiGroupName = get_group_name_by_id($scope.apiGroupId, $scope.groups);
                    }
                    angular.forEach($scope.groups, function(group, i) {
                        $scope.apiGroupList.push({
                            "id": group.group_id,
                            "description": group.group_description,
                            "apiList": []
                        });
                    });
                    var data = {"developer_id": $scope.userInfo.developer_id};
                    $http({method:"get", url:'apis', params:data}).success(function(apis) {
                        angular.forEach(apis, function(api, i) {
                            api.versionList = [];
                            angular.forEach($scope.apiGroupList, function(apiGroup, i) {
                                // Todo: api.group_id和数据库表结构相关，暂时不做修改
                                if(apiGroup.id == api.group_id)
                                    apiGroup.apiList.push(api);
                            });
                        });
                        if (!parseInt($scope.apiGroupId)) {
                            (function shardGetApiVersion(offset, limit) {
                                $http.get('api_versions?offset='+offset+"&limit="+limit).success(function(apiVersions) {
                                    angular.forEach(apiVersions, function(apiVersion, i) {
                                        angular.forEach($scope.apiGroupList, function(apiGroup, i) {
                                            angular.forEach(apiGroup.apiList, function(api, i) {
                                                if(apiVersion.api_id == api.id)
                                                    api.versionList.push(apiVersion);
                                            });
                                        });
                                    });
                                    if (apiVersions.length > 0) {
                                        offset += apiVersions.length;
                                        shardGetApiVersion(offset, limit);
                                    }
                                });
                            })(0, 500);
                        } else {
                            var data = {"developer_id": $scope.userInfo.developer_id};
                            $http({method:"get", url:'/groups/' + $scope.apiGroupId + '/api_versions', params:data}).success(function(apiVersions) {
                                angular.forEach(apiVersions, function(apiVersion, i) {
                                    angular.forEach($scope.apiGroupList, function(apiGroup, i) {
                                        angular.forEach(apiGroup.apiList, function(api, i) {
                                            if(apiVersion.api_id == api.id)
                                                api.versionList.push(apiVersion);
                                        });
                                    });
                                });
                            });
                        }
                    });
                }else{
                    swal("获取分组失败:" + response.message?response.message:"");
                    return;
                }
            }).error(function(data, status) {
                swal("获取分组失败");
            });


    $scope.isApiGroupShow = function(id) {
        return ($scope.apiGroupId === null || $scope.apiGroupId == id);
    };

    $scope.deleteApi = function(id, version_cnt) {
        if(0 !== version_cnt) {
            swal('请先删除API的所有版本');
            return;
        }
        swal({
                title: "确定要删除吗?",
                //text: "如果需要撤销删除请联系管理员!",
                type: "warning",
                showCancelButton: true,
                cancelButtonText: "取消",
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                closeOnConfirm: false
            },
            function(){
                 $http.delete('apis/' + id).success(function() {
                    swal('删除成功', "3分钟后，API配置自动同步到RestHub-Core", "success");
                    for(var j = 0; j < $scope.apiGroupList.length; j++) {
                        var appGroup = $scope.apiGroupList[j];
                        for(var i = 0; i < appGroup.apiList.length; i++) {
                            if(appGroup.apiList[i].id == id) {
                                appGroup.apiList.splice(i, 1);
                            }
                        }
                       }

                }).error(function(data, status) {
                    if(status == 403) {
                        swal('请先删除API的所有版本');
                    }
                });
            }
        );
    };

    $scope.$watch('apiGroupId', function() {
        $scope.$emit('apiGroupId', $scope.apiGroupId);
        if($scope.apiGroupId) {
            $location.path("/api_version_list" + "/" + $scope.apiGroupId);
        } else {
            $location.path("/api_version_list");
        }
    });
    $scope.$watch('selectedApiGroupObj', function() {
        if (!$scope.selectedApiGroupObj ||
            !$scope.selectedApiGroupObj.originalObject) return;
        var group_id = $scope.selectedApiGroupObj.originalObject.group_id;
        if(group_id) {
            if (group_id == $scope.apiGroupId) return;
            $scope.$emit('apiGroupId', group_id);
            $location.path("/api_version_list" + "/" + group_id);
        } else {
            $location.path("/api_version_list");
        }
    });

    $scope.getReleaseTimeLabelClass = function(api_version) {
        if (api_version.release_time > api_version.update_time) {
            return "label-success";
        } else {
            return "label-warning";
        }
    };

    $scope.getReleaseTimeLabelText = function(api_version) {
        if (api_version.release_time > api_version.update_time) {
            return "是";
        } else {
            return "否";
        }
    };
}

function ApiVersionDetailCtrl($scope, $routeParams, $http, $location, ngDialog, ngNotify) {
    $scope.apiName = '';
    $scope.isAuditArray = IS_AUDIT_ARRAY;
    $scope.statusArray = STATUS_ARRAY;
    $scope.accessArray = ACCESS_ARRAY;
    $scope.$emit('subtitle', 'API版本详情');
    $scope.detectPingProduct = "正在探测可用性";
    $scope.detectPingPre = "正在探测可用性";
    $scope.detectPingTest = "正在探测可用性";
    $scope.detectPingSandbox = "正在探测可用性";
    $scope.id = $routeParams.id;
    $scope.testInputParam = "u_id=xxx&name=xxx";
    $scope.isHideGet = true;
    $scope.isHidePost = true;
    $scope.isHidePut = true;
    $scope.isHideDelete = true;
    $scope.isHidePatch = true;

    $scope.newApiWl = {};
    $scope.isAccessApi = false;
    $scope.isAuditApi = false;

    $scope.detail_log_Array = DETAIL_LOG_ARRAY;
    $scope.productAPIManagerURL = API_MANAGER_URL_ARRAY[1];

    $scope.toggleGet = function () {
        $scope.isHideGet = !$scope.isHideGet;
    };
    $scope.togglePost = function () {
        $scope.isHidePost = !$scope.isHidePost;
    };
    $scope.togglePut = function () {
        $scope.isHidePut = !$scope.isHidePut;
    };
    $scope.toggleDelete = function () {
        $scope.isHideDelete = !$scope.isHideDelete;
    };
    $scope.togglePatch = function () {
        $scope.isHidePatch = !$scope.isHidePatch;
    };

    $http.get('api_versions/' + $scope.id).success(function(apiVersion) {
        var data = {'api_id': apiVersion.api_id};
        $http({method:'GET', url:'api_access', params:data}).success(function(response) {
            if (response.status == 200){
                $scope.isAccessApi = true;
            }
        });

        $http({method:'GET', url:'api_audit', params:data}).success(function(response) {
            if (response.status == 200){
                $scope.isAuditApi = true;
            }
        });

        $http({method:'GET', url:'api_versions/appendixes/audit/' + $scope.id}).success(function(appendix) {
             $scope.api_version_appendix_audit = appendix;
        });

        $scope.http_detect(apiVersion);

        $http({method:'GET', url:'/apis/'+apiVersion.api_id}).success(function(response) {
            $scope.apiName = response.name;
            $scope.apiVersion = apiVersion;
            // 测试工具变量初始化
            $scope.destUrl = "https://" + Environment.RESTHUB_DOMAIN_NAME + "/" + $scope.apiVersion.outer_url;

            // 探测发布进度
            $scope.http_release_detect($scope.apiVersion);
        }).error(function(data, status) {
            $scope.apiName = "同步数据发生错误";
           });

    }).error(function(data, status) {
        $scope.back();
        swal('取得API信息失败，请联系管理员');
    });

    $http({method:"get", url:'/upstreams'}).success(function(data, status) {
        if (status == 200) {
            $scope.upstreamList = data;
        }else{
            swal("获取upstreams失败:" + status);
            return;
        }
    }).error(function(data, status) {
        swal("获取upstreams失败:" + status);
    });

    $http({method:"get", url:'/selectors'}).success(function(data, status) {
        if (status == 200) {
            $scope.selectorList = data;
        }else{
            swal("获取selectors失败:" + status);
            return;
        }
    }).error(function(data, status) {
        swal("获取selectors失败:" + status);
    });

    $http({method:"get", url:'/schedulers'}).success(function(data, status) {
        if (status == 200) {
            $scope.schedulerList = data;
        }else{
            swal("获取schedulers失败:" + status);
            return;
        }
    }).error(function(data, status) {
        swal("获取schedulers失败:" + status);
    });

    $scope.update = function() {
        $location.path('/update_api_version/' + $scope.id);
    };

    $scope.delete = function() {
        swal({
                title: "确定要删除吗?",
                text: "如果需要撤销删除请联系管理员!",
                type: "warning",
                showCancelButton: true,
                cancelButtonText: "取消",
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                closeOnConfirm: false
            },
            function(){
                $http.delete('api_versions/' + $scope.id).success(function() {
                    if(true){
                        swal('删除成功', "3分钟后，API配置自动同步到RestHub-Core", "success");
                        $location.path("/api_version_list" + "/" + $scope.apiGroupId);
                        return;
                    }
                    swal({
                            title: "删除成功!\n 同步删除生产环境上的API吗?",
                            text: "如果需要撤销删除请联系管理员!",
                            type: "warning",
                            showCancelButton: true,
                            cancelButtonText: "取消",
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "确定",
                            closeOnCancel: false,
                            closeOnConfirm: false
                        },
                        function(isConfirm){
                            if (isConfirm){
                                var params = {'url':$scope.productAPIManagerURL,'id':$scope.id};
                                $http.delete('api_versions/transshipment',{data:params}).success(function(data, status) {
                                    if(data.status == 200){
                                        swal('删除成功', "3分钟后，API配置自动同步到RestHub-Core\n如果需要撤销删除请联系管理员!","success");
                                    }else{
                                        var msg = data.msg;
                                        var code = data.status;
                                        swal('删除失败',msg + "\n" + "请及时手动删除生产环境上的API!","error");
                                    }
                                }).error(function(data, status) {
                                    swal('删除失败',"请及时手动删除生产环境上的API!","error");
                                   });
                            }else{
                                swal("3分钟后，API配置自动同步到RestHub-Core", "请及时手动删除生产环境上的API!","success");

                            }
                        }
                    );
                    $location.path("/api_version_list" + "/" + $scope.apiGroupId);
                });
            }
        );
    };

    $scope.back = function() {
        $location.path("/api_version_list" + "/" + $scope.apiGroupId);
    };

    $scope.testMethod = "GET";
    $scope.http_test = function() {
        var url = $scope.destUrl;
        var method = $scope.testMethod;
        var params = $scope.testInputParam;
        var data = {'url':url, 'method':method, 'params':params};
        $http({method:'POST', url:'http_test', data:data}).success(function(data, status) {
            $scope.returnStatus = data.status;
            $scope.returnData = data.data;
            var headers = new Array()
            for(var key in data.headers) {
                headers.push(key + ": " + data.headers[key]);
            }
            $scope.returnHeaders = headers.join("\n");
        }).error(function(data, status) {
            swal("运行测试请求失败!");
        });
    };

    $scope.createStressTask = function() {
    };

    $scope.viewStressResult = function() {
    };

    $scope.http_detect = function(apiVersion) {
        /*
        setTimeout(function () {
            var data = {'url':apiVersion.inner_url, 'method': 'GET'};
            $http({method:'POST', url:'http_detect', data:data}).success(function(data) {
                $scope.detectPing = "可以正常访问";
            }).error(function(data, status) {
                $scope.detectPingSandbox = "发生错误";
                $scope.detectPingHelp = data;
            });
        }, 200);
        */
    };


    $scope.isDevRelease = false;
    $scope.isSitRelease = false;
    $scope.isPreRelease = false;
    $scope.isProductRelease = false;
    $scope.http_release_detect = function(apiVersion) {
        //Dev
        setTimeout(function () {
            var url = RESTHUB_CORE_URL_MAP[0]["url"] + "/" + apiVersion.outer_url;
            var data = {'url':url, 'method': 'GET'};
            $http.post('http_test', data).success(function(response) {
                try {
                  var data = JSON.parse(response.data);
                } catch(e) {
                  console.log(e);
                  $scope.isDevRelease = true;
                  return;
                }
                if (data.status != 404) {
                    $scope.isDevRelease = true;
                }
            }).error(function(data, status) {
                console.log("探测Dev发布进度失败")
            });
        }, 100);

        //Sit
        setTimeout(function () {
            var url = RESTHUB_CORE_URL_MAP[1]["url"] + "/" + apiVersion.outer_url;
            var data = {'url':url, 'method': 'GET'};
            $http.post('http_test', data).success(function(response) {
                try {
                  var data = JSON.parse(response.data);
                } catch(e) {
                  console.log(e);
                  $scope.isSitRelease = true;
                  return;
                }
                if (data.status != 404) {
                    $scope.isSitRelease = true;
                }
            }).error(function(data, status) {
                console.log("探测Sit发布进度失败")
            });
        }, 200);

        //Pre
        setTimeout(function () {
            var url = RESTHUB_CORE_URL_MAP[2]["url"] + "/" + apiVersion.outer_url;
            var data = {'url':url, 'method': 'GET'};
            $http.post('http_test', data).success(function(response) {
                try {
                  var data = JSON.parse(response.data);
                } catch(e) {
                  console.log(e);
                  $scope.isPreRelease = true;
                  return;
                }
                if (data.status != 404) {
                    $scope.isPreRelease = true;
                }
            }).error(function(data, status) {
                console.log("探测Pre发布进度失败")
            });
        }, 200);


        //Product
        setTimeout(function () {
            var url = RESTHUB_CORE_URL_MAP[3]["url"] + "/" + apiVersion.outer_url;
            var data = {'url':url, 'method': 'GET'};
            $http.post('http_test', data).success(function(response) {
                try {
                  var data = JSON.parse(response.data);
                } catch(e) {
                  console.log(e);
                  $scope.isProductRelease = true;
                  return;
                }
                if (data.status != 404) {
                    $scope.isProductRelease = true;
                }
            }).error(function(data, status) {
                console.log("探测Product发布进度失败")
            });
        }, 400);


    };

    $scope.openApiWl = function() {
        $scope.apiWLAddDialog = ngDialog.open({
            template: 'html/popup_add_apiwl.html',
            //controller: 'ApiVersionDetailCtrl',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };


    $scope.addApiWlSubmit = function() {
        var data = {
            "developer_id": $scope.newApiWl.developer_id,
            "api_id": $scope.apiVersion.api_id
        };
        $http({method:"post", url:'/api_whitelist', params:data}).success(function(response) {
            if (response.status == 200){
                swal("添加API白名单成功");
            }else{
                swal("添加API白名单失败:" + response.message?response.message:"");
                return;
            }
            $scope.apiWLAddDialog.close();
        }).error(function(data, status) {
            swal("添加API白名单失败");
        });
    };

    function getApiBl(api_id){
        var data = {'api_id': api_id};
        $http({method:'GET', url:'api_blacklist', params:data}).success(function(resp) {
             $scope.apiBls = resp.data;
        });
    };

    $scope.viewApiBl = function() {
        getApiBl($scope.apiVersion.api_id);
        ngDialog.open({
            template: 'html/popup_view_apibl.html',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };

    $scope.viewApiBlKeyGroup = function(apibl) {
        $scope.apibl = apibl;
        ngDialog.open({
            template: 'html/popup_view_apiblkeygroup.html',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };

    function getAPIWl(api_id){
        var data = {'api_id': api_id};
        $http({method:'GET', url:'api_whitelist', params:data}).success(function(resp) {
             $scope.apiWls = resp.data;
        });
    };

    $scope.viewApiWl = function() {
        getAPIWl($scope.apiVersion.api_id);
        ngDialog.open({
            template: 'html/popup_view_apiwl.html',
            //controller: 'ApiVersionDetailCtrl',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };

    $scope.deleteApiWl = function (api_id, developer_id) {
        var data = {
            "api_id": api_id,
            "developer_id": developer_id
        };
        swal({
                title: "确定要删除吗?",
                type: "warning",
                showCancelButton: true,
                cancelButtonText: "取消",
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                closeOnConfirm: false
            },
            function(){
                $http({method:"delete", url:'/api_whitelist', params:data}).success(function(response) {
                    if (response.status == 200){
                          swal("删除API白名单成功");
                    }else{
                        swal("删除API白名单失败:" + response.message?response.message:"");
                           return;
                       }
                       // 更新白名单列表
                       getAPIWl($scope.apiVersion.api_id);
                    }).error(function(data, status) {
                      swal("删除分组白名单失败");
                });
            }
        );
    };

    $scope.openSyncApi = function() {
        $location.path('/sync_api_version/' + $scope.id);
    };

    $scope.audit = function() {
        $location.path('/audit_api_version/' + $scope.id);
    };

    // 复制API URL
    $scope.copy = function() {
        ngNotify.set('复制成功!');
    };

    $scope.getOuterUrl = function() {
        return "https://" + $scope.Environment.RESTHUB_DOMAIN_NAME + "/" + $scope.apiVersion.outer_url;
    };
}

function SyncApiVersionCtrl($scope, $routeParams, $cookieStore, $http, $location, $filter,ngDialog) {
    $scope.apimanagerURLMap = $scope.selectEnv(API_MANAGER_URL_MAP);
    $scope.apimanagerURLArray = API_MANAGER_URL_ARRAY;
    $scope.apimanagerCommonURL = $scope.env_id + 1;
    $scope.apimanagerDestURL = $scope.apimanagerURLArray[$scope.apimanagerCommonURL];
    $scope.apiName = ''
    $scope.isAuditArray = IS_AUDIT_ARRAY;
    $scope.statusArray = STATUS_ARRAY;
    $scope.accessArray = ACCESS_ARRAY;
    $scope.$emit('subtitle', '发布API版本');
    $scope.id = $routeParams.id;
    $scope.apiVersionTrans = {};
    $scope.processState = '';
    $scope.syncFinished = false;
    $scope.detail_log_Array = DETAIL_LOG_ARRAY;

    $http.get('api_versions/' + $scope.id).success(function(apiVersion) {
        $http({method:'GET', url:'/apis/'+apiVersion.api_id}).success(function(response) {
            $scope.apiName = response.name;
            $scope.apiVersionTrans = apiVersion;
            $scope.apiVersionTrans.inner_url = apiVersion.inner_url;
            if($scope.apiName ==''){
                swal("取得API数据发生错误! 请联系管理员");
                $location.path('/api_version_detail/' + $scope.id);
               }
        }).error(function(data, status) {
            swal("取得API数据发生错误! 请联系管理员");
            $location.path('/api_version_detail/' + $scope.id);
           });

        var data = {'api_id': apiVersion.api_id};
        $http({method:'GET', url:'api_access', params:data}).success(function(response) {
            if (response.status != 200){
                swal("没有权限访问该页面! 请联系管理员");
                $location.path('/api_version_detail/' + $scope.id);
            }
        }).error(function(data, status) {
            swal("没有权限访问该页面! 请联系管理员");
            $location.path('/api_version_detail/' + $scope.id);
        });
    });

    $http({method:"get", url:'/upstreams'}).success(function(data, status) {
        if (status == 200) {
            $scope.upstreamList = data;
        }else{
            swal("获取upstreams失败:" + status);
            return;
        }
    }).error(function(data, status) {
        swal("获取upstreams失败:" + status);
    });

    $scope.isDebugEnv= function() {
        return $scope.debugEnv;
    };

    // 返回
    $scope.back = function() {
        $location.path('/api_version_detail/' + $scope.id);
    };

    $scope.isNotSelf = function (item) {
        var absurl = $location.absUrl();
        var index = absurl.indexOf(item.url);
        return index == -1;
    }

    $scope.urlSelectChange = function(x){
           $scope.apimanagerDestURL = $scope.apimanagerURLArray[x];
    }

     $scope.openSyncAPIDialog = function () {
        ngDialog.open({
           template: 'html/popup_view_syncapi.html',
            controller: 'SyncApiVersionCtrl',
            className: 'ngdialog-theme-default'
        });
    }

    function check_API_url(url){
         for (di in FORBIDDEN_DOMAINS) {
            if (-1 != url.indexOf(FORBIDDEN_DOMAINS[di])){
                return false;
            }
        }
        return true;
    }

    // 提交
    $scope.submit = function() {
        for (di in FORBIDDEN_DOMAINS) {
            if (-1 != $scope.apiVersionTrans.inner_url.indexOf(FORBIDDEN_DOMAINS[di])){
                swal("API URL不正确!", "API的实际URL不能指向GateWay，请返回修改.", "error")
                return;
            }
        }

        doSync();

        function doSync(){
            var submitButtons = $("button[type='submit']");
            submitButtons.attr("disabled","disabled");
            $scope.syncFinished  = false;
            $scope.processState = '进行中...';
            var dialog = ngDialog.open({
                    template:'html/popup_view_syncapi.html',
                    className: 'ngdialog-theme-default',
                    closeByDocument: false,
                    closeByEscape: false,
                        closeByNavigation: true,
                        scope: $scope,
                        showClose:false
                    });

            var postData = {'url':$scope.apimanagerDestURL,'apiVersion':$scope.apiVersionTrans};
            $http.post('api_versions/transshipment', postData).success(function(data, status, headers, config) {
                    $scope.processState = data.msg || "同步成功";
                    $http.put("/api_versions/release_time/" + config.data.apiVersion.id);
                    $scope.syncFinished  = true;
                    submitButtons.removeAttr("disabled")
                }).error(function(data, status) {
                    $scope.processState = data.msg || "请求失败,status = " + status;
                    $scope.syncFinished  = true;
                    submitButtons.removeAttr("disabled")
                });
        }
    };

}

function AuditApiVersionCtrl($scope, $routeParams, $cookieStore, $http, $location, $filter,ngDialog) {
     $scope.apiName = ''
    $scope.isAuditArray = IS_AUDIT_ARRAY;
    $scope.isAuditMap = IS_AUDIT_MAP;
    $scope.statusArray = STATUS_ARRAY;
    $scope.accessArray = ACCESS_ARRAY;
    $scope.$emit('subtitle', '审核API版本');
    $scope.id = $routeParams.id;
    $scope.apiVersion = {};
    $scope.appendix_audit_id = 0;
    $scope.appendix_audit_auditor = "";
    $scope.appendix_audit_comment = "";

    $scope.detail_log_Array = DETAIL_LOG_ARRAY;
    $scope.auditing = false;

    $http.get('api_versions/' + $scope.id).success(function(apiVersion) {
        var data = {'api_id': apiVersion.api_id};
        $http({method:'GET', url:'api_audit', params:data}).success(function(response) {
            if (response.status != 200){
                swal("没有权限访问该页面! 请联系管理员");
                $location.path('/api_version_detail/' + $scope.id);
            }
        }).error(function(data, status) {
            swal("没有权限访问该页面! 请联系管理员");
            $location.path('/api_version_detail/' + $scope.id);
        });
        $http({method:'GET', url:'/apis/'+apiVersion.api_id}).success(function(response) {
            $scope.apiName = response.name;
            $scope.apiVersion = apiVersion;
            $scope.appendix_audit_id = apiVersion.id;
                if($scope.apiName ==''){
                    swal("取得API数据发生错误! 请联系管理员");
                    $location.path('/api_version_detail/' + $scope.id);
               }
          }).error(function(data, status) {
                swal("取得API数据发生错误! 请联系管理员");
                $location.path('/api_version_detail/' + $scope.id);
           });

        $http({method:'GET', url:'api_versions/appendixes/audit/' + $scope.id}).success(function(appendix) {
            $scope.appendix_audit_id = appendix.id;
                    $scope.appendix_audit_auditor = appendix.auditor;
                    $scope.appendix_audit_comment = appendix.audit_comment;
        });
    });

    // 返回
    $scope.back = function() {
        $location.path('/api_version_detail/' + $scope.id);
    };

    // 拒绝
    $scope.refuse = function() {
        //audit NG
        sendAuditRequest(1);
    };

    function sendAuditRequest(is_audit) {
        if ($scope.auditing){
            return;
        }
        $scope.auditing = true;

        //audit result
        $scope.apiVersion.is_audit = is_audit;

       //add modifier
        var curModifier = $scope.userName;
        var re = new RegExp(curModifier + ";", "g");
        $scope.apiVersion.modifier = $scope.apiVersion.modifier.replace(re, "") + curModifier + ";";

        $scope.appendix_audit_auditor = $scope.appendix_audit_auditor.replace(re, "") + curModifier + ";";
        var appendix_audit={id:$scope.appendix_audit_id,auditor:$scope.appendix_audit_auditor,audit_comment:$scope.appendix_audit_comment}

        var putData = {'apiVersion':$scope.apiVersion,'apiVersion_appendix_audit':appendix_audit}
        $http.put('api_audit', putData).success(function(data,status) {
            swal('变更审核状态成功');
            $scope.auditing = false;
            $location.path('/api_version_detail/' + $scope.id);
        }).error(function(data, status) {
             $scope.auditing = false;
            if (status == 304){
                swal('没有修改任何字段');
                $location.path('/api_version_detail/' + $scope.id);
            } else {
                swal('修改失败，请联系管理员');
            }
        });
    }

    // 提交
    $scope.accept = function() {
        sendAuditRequest(2);
    };
}

function AddApiVersionCtrl($scope, $routeParams, $cookieStore, $http, $location, $filter) {
    $scope.statusMap = STATUS_MAP;
    $scope.accessMap = ACCESS_MAP;
    $scope.detail_log_Map = DETAIL_LOG_MAP;
    $scope.$emit('subtitle', '添加API版本');

    $scope.apiId = parseInt($routeParams.api_id);
    $scope.isAudit = 0;
    $scope.status = 0;
    $scope.access = 0;
    //$scope.productUrl = 'http://domain/path/resources';
    //$scope.preUrl = 'http://domain/path/resources';
    //$scope.testUrl = 'http://domain/path/resources';
    //$scope.sandboxUrl = 'http://domain/path/resources';
    $scope.upstreamId = 0;
    $scope.innerUrl = 'path/resources';
    $scope.token = "";
    $scope.depend = "";
    $scope.isInternetHttp = 0;
    $scope.isGet = $scope.isPost = $scope.isPut = $scope.isDelete = $scope.isPatch = false;
    $scope.maxPerMinute = 0;
    $scope.connectTimeout = 500;
    $scope.requestTimeout = 3000;
    $scope.cacheExpires = 0;
    $scope.getIsNeedCheck = $scope.getIsCheckApp = $scope.getIsCheckSession = false;
    $scope.postIsNeedCheck = $scope.postIsCheckApp = $scope.postIsCheckSession = false;
    $scope.putIsNeedCheck = $scope.putIsCheckApp = $scope.putIsCheckSession = false;
    $scope.deleteIsNeedCheck = $scope.deleteIsCheckApp = $scope.deleteIsCheckSession = false;
    $scope.patchIsNeedCheck = $scope.patchIsCheckApp = $scope.patchIsCheckSession = false;
    $scope.creator = $scope.userName + ";";
    $scope.modifier = $scope.userName + ";";
    $scope.detail_log = 0;
    $scope.is_gray = 0;
    $scope.selectorId = 1;
    $scope.schedulerId = 1;
    $scope.cookies = '';
    $scope.getCacheExpires = 0;
    $scope.getIsPrivate = 0;
    $scope.getIsToken = 0;
    $scope.get_session_param_map = '{"uid":"s_uid"}';
    $scope.getInputDoc = '';
    $scope.getOutputDoc = '';
    $scope.getTestInputDoc = '';
    $scope.postIsPrivate = 0;
    $scope.postIsToken = 0;
    $scope.post_session_param_map = '{"uid":"s_uid"}';
    $scope.postInputDoc = '';
    $scope.postOutputDoc = '';
    $scope.postTestInputDoc = '';
    $scope.putIsPrivate = 0;
    $scope.putIsToken = 0;
    $scope.put_session_param_map = '{"uid":"s_uid"}';
    $scope.putInputDoc = '';
    $scope.putOutputDoc = '';
    $scope.putTestInputDoc = '';
    $scope.deleteIsPrivate = 0;
    $scope.deleteIsToken = 0;
    $scope.delete_session_param_map = '{"uid":"s_uid"}';
    $scope.deleteInputDoc = '';
    $scope.deleteOutputDoc = '';
    $scope.deleteTestInputDoc = '';
    $scope.patchIsPrivate = 0;
    $scope.patchIsToken = 0;
    $scope.patch_session_param_map = '{"uid":"s_uid"}';
    $scope.patchInputDoc = '';
    $scope.patchOutputDoc = '';
    $scope.patchTestInputDoc = '';

    var data = {'api_id': $scope.apiId};
    $http({method:'GET', url:'api_access', params:data}).success(function(response) {
        if (response.status != 200){
            swal("没有权限访问该页面! 请联系管理员");
            $location.path('/api_version_list/' + $scope.apiGroupId);
        }
    }).error(function(data, status) {
        swal("没有权限访问该页面! 请联系管理员");
        $location.path('/api_version_list/' +$scope.apiGroupId);
    });

    $http.get('/apis/'+$scope.apiId+'/api_versions').success(function(apiVersions) {
        var maxVersionId = 0;
        angular.forEach(apiVersions, function(apiVersion, i) {
            var ver = parseInt(apiVersion.version.replace(/[^0-9\.]/,""));
            if(ver > maxVersionId){  maxVersionId = ver;}
        });
        $scope.versionMin = (maxVersionId + 1)>1000?1000:(maxVersionId + 1);
        $scope.version = $scope.versionMin;
        var fieldVersion = $("input#version");
        fieldVersion.attr("min", $scope.versionMin);
        /*
        if($scope.version > 1000){
            swal("版本号已经超过最大值! 请联系管理员");
            $location.path("/api_version_list" + "/" + $scope.apiGroupId);
        }*/
    }).error(function(data, status) {
        swal("取得API数据发生错误! 请联系管理员");
        $location.path("/api_version_list" + "/" + $scope.apiGroupId);
    });

   $http({method:"get", url:'/upstreams'}).success(function(data, status) {
        if (status == 200) {
            $scope.upstreamList = data;
        }else{
            swal("获取upstreams失败:" + status);
            return;
        }
    }).error(function(data, status) {
        swal("获取upstreams失败:" + status);
    });

    $http({method:"get", url:'/selectors'}).success(function(data, status) {
        if (status == 200) {
            $scope.selectorList = data;
        }else{
            swal("获取selectors失败:" + status);
            return;
        }
    }).error(function(data, status) {
        swal("获取selectors失败:" + status);
    });

    $http({method:"get", url:'/schedulers'}).success(function(data, status) {
        if (status == 200) {
            $scope.schedulerList = data;
        }else{
            swal("获取schedulers失败:" + status);
            return;
        }
    }).error(function(data, status) {
        swal("获取schedulers失败:" + status);
    });

    $scope.submit = function() {
        if(!utils.check_api_cookies($scope.cookies)){
            swal({
                title: "cookies输入有误",
                text: "cookie名长度大于限定值(32字符),或者cookie名重复。",
                type: "error",
                showCancelButton: false,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "返回修改",
                closeOnConfirm: true
                },function(){});
            return;
        };

        var data = {
            api_id: $scope.apiId,
            version: $scope.version,
            is_audit : $scope.isAudit,
            status : $scope.status,
            creator: $scope.creator,
            modifier : $scope.modifier,
            upstream_id : $scope.upstreamId,
            outer_url: $filter('stripPrefixSlash')($scope.outerUrl),
            inner_url: $filter('stripPrefixSlash')($scope.innerUrl),
            access: $scope.access,
            token: $scope.token,
            depend: $scope.depend,
            is_internet_http:Number($scope.isInternetHttp),
            max_per_minute: $scope.maxPerMinute,
            connect_timeout: $scope.connectTimeout,
            request_timeout: $scope.requestTimeout,
            cache_expires: $scope.cacheExpires,
            detail_log: $scope.detail_log,
            is_gray: $scope.is_gray,
            selector_id: $scope.selectorId,
            scheduler_id: $scope.schedulerId,
            cookies: $scope.cookies,
            description: $scope.description,
            is_get: $scope.isGet,
            is_post: $scope.isPost,
            is_put: $scope.isPut,
            is_delete: $scope.isDelete,
            is_patch: $scope.isPatch,

            get_cache_expires: $scope.getCacheExpires,
            get_is_private: Number($scope.getIsPrivate),
            get_is_token: Number($scope.getIsToken),
            get_is_public: !$scope.getIsNeedCheck,
            get_is_check_app: $scope.getIsNeedCheck && $scope.getIsCheckApp,
            get_is_check_session: $scope.getIsNeedCheck && $scope.getIsCheckSession,
            get_session_param_map: $scope.get_session_param_map || '{"uid":"s_uid"}',
            get_input_doc: $scope.getInputDoc,
            get_output_doc: $scope.getOutputDoc,
            get_test_input_doc: $scope.getTestInputDoc,

            post_is_private: Number($scope.postIsPrivate),
            post_is_token: Number($scope.postIsToken),
            post_is_public: !$scope.postIsNeedCheck,
            post_is_check_app: $scope.postIsNeedCheck && $scope.postIsCheckApp,
            post_is_check_session: $scope.postIsNeedCheck && $scope.postIsCheckSession,
            post_session_param_map: $scope.post_session_param_map || '{"uid":"s_uid"}',
            post_input_doc: $scope.postInputDoc,
            post_output_doc: $scope.postOutputDoc,

            put_is_private: Number($scope.putIsPrivate),
            put_is_token: Number($scope.putIsToken),
            put_is_public: !$scope.putIsNeedCheck,
            put_is_check_app: $scope.putIsNeedCheck && $scope.putIsCheckApp,
            put_is_check_session: $scope.putIsNeedCheck && $scope.putIsCheckSession,
            put_session_param_map: $scope.put_session_param_map || '{"uid":"s_uid"}',
            put_input_doc: $scope.putInputDoc,
            put_output_doc: $scope.putOutputDoc,

            delete_is_private: Number($scope.deleteIsPrivate),
            delete_is_token: Number($scope.deleteIsToken),
            delete_is_public: !$scope.deleteIsNeedCheck,
            delete_is_check_app: $scope.deleteIsNeedCheck && $scope.deleteIsCheckApp,
            delete_is_check_session: $scope.deleteIsNeedCheck && $scope.deleteIsCheckSession,
            delete_session_param_map: $scope.delete_session_param_map || '{"uid":"s_uid"}',
            delete_input_doc: $scope.deleteInputDoc,
            delete_output_doc: $scope.deleteOutputDoc,

            patch_is_private: Number($scope.patchIsPrivate),
            patch_is_token: Number($scope.patchIsToken),
            patch_is_public: !$scope.patchIsNeedCheck,
            patch_is_check_app: $scope.patchIsNeedCheck && $scope.patchIsCheckApp,
            patch_is_check_session: $scope.patchIsNeedCheck && $scope.patchIsCheckSession,
            patch_session_param_map: $scope.patch_session_param_map || '{"uid":"s_uid"}',
            patch_input_doc: $scope.patchInputDoc,
            patch_output_doc: $scope.patchOutputDoc,
            create_time: 0,
            update_time: 0,
            release_time: 0
        };
        $http.post('api_versions', data).success(function(data, status) {
            if (data.id === 0){
                swal(data.msg, "[提示] 3分钟后，API配置自动同步到RestHub-Core.", "success")
                $location.path("/api_version_list" + "/" + $scope.apiGroupId);
            }else{
                swal(data.msg, "[提示] 相同RestHub-Core URI的API已经存在.", "error");
                //$location.path('/api_version_detail/' + data.id);
            }
        }).error(function(data, status) {
            if (status == 406){
                swal('内部URL的域名不允许指向RestHub-Core');
            }else{
                swal('添加失败，请联系管理员\n'+data);
            }
        });
    };

    $scope.back = function() {
        $location.path("/api_version_list" + "/" + $scope.apiGroupId);
    };

    /*$http.get('/api_tokens').success(function(apiTokens) {
        $scope.apiTokens = apiTokens;
    });*/
}

function UpdateApiVersionCtrl($scope, $routeParams, $cookieStore, $http, $location, $filter) {
    $scope.isAuditArray = IS_AUDIT_ARRAY;
    $scope.statusMap = STATUS_MAP;
    $scope.accessMap = ACCESS_MAP;
    $scope.$emit('subtitle', '修改API版本');
    $scope.id = $routeParams.id;
    $scope.detail_log_Map = DETAIL_LOG_MAP;

    $http.get('api_versions/' + $scope.id).success(function(apiVersion) {
        $scope.apiVersion = apiVersion;
        var data = {'api_id': $scope.apiVersion.api_id};
        $http({method:'GET', url:'api_access', params:data}).success(function(response) {
            if (response.status != 200){
                swal("没有权限访问该页面! 请联系管理员");
                $location.path('/api_version_detail/' + $scope.id);
            }
        }).error(function(data, status) {
            swal("没有权限访问该页面! 请联系管理员");
            $location.path('/api_version_detail/' + $scope.id);
        });

        $scope.getIsNeedCheck = !$scope.apiVersion.get_is_public;
        $scope.postIsNeedCheck = !$scope.apiVersion.post_is_public;
        $scope.putIsNeedCheck = !$scope.apiVersion.put_is_public;
        $scope.deleteIsNeedCheck = !$scope.apiVersion.delete_is_public;
        $scope.patchIsNeedCheck = !$scope.apiVersion.patch_is_public;
    });

    $http({method:"get", url:'/upstreams'}).success(function(data, status) {
        if (status == 200) {
            $scope.upstreamList = data;
        }else{
            swal("获取upstreams失败:" + status);
            return;
        }
    }).error(function(data, status) {
        swal("获取upstreams失败:" + status);
    });

    $http({method:"get", url:'/selectors'}).success(function(data, status) {
        if (status == 200) {
            $scope.selectorList = data;
        }else{
            swal("获取selectors失败:" + status);
            return;
        }
    }).error(function(data, status) {
        swal("获取selectors失败:" + status);
    });

    $http({method:"get", url:'/schedulers'}).success(function(data, status) {
        if (status == 200) {
            $scope.schedulerList = data;
        }else{
            swal("获取schedulers失败:" + status);
            return;
        }
    }).error(function(data, status) {
        swal("获取schedulers失败:" + status);
    });

    // 提交
    $scope.submit = function() {
        if(!utils.check_api_cookies($scope.apiVersion.cookies)){
            swal({
                title: "cookies入力不正",
                text: "cookie名长度大于限定值(32字符),或者cookie名重复。",
                type: "error",
                showCancelButton: false,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "返回修改",
                closeOnConfirm: true
                },function(){});
            return;
        };

        //如果用户没有选中任何认证方式时，重置XXX_is_public
        $scope.apiVersion.get_is_check_app = $scope.getIsNeedCheck && $scope.apiVersion.get_is_check_app;
        $scope.apiVersion.get_is_check_session = $scope.getIsNeedCheck && $scope.apiVersion.get_is_check_session;
        $scope.apiVersion.get_is_public = !$scope.apiVersion.get_is_check_app && !$scope.apiVersion.get_is_check_session;
        $scope.apiVersion.post_is_check_app = $scope.postIsNeedCheck && $scope.apiVersion.post_is_check_app;
        $scope.apiVersion.post_is_check_session = $scope.postIsNeedCheck && $scope.apiVersion.post_is_check_session;
        $scope.apiVersion.post_is_public = !$scope.apiVersion.post_is_check_app && !$scope.apiVersion.post_is_check_session;
        $scope.apiVersion.put_is_check_app = $scope.putIsNeedCheck && $scope.apiVersion.put_is_check_app;
        $scope.apiVersion.put_is_check_session = $scope.putIsNeedCheck && $scope.apiVersion.put_is_check_session;
        $scope.apiVersion.put_is_public = !$scope.apiVersion.put_is_check_app && !$scope.apiVersion.put_is_check_session;
        $scope.apiVersion.delete_is_check_app = $scope.deleteIsNeedCheck && $scope.apiVersion.delete_is_check_app;
        $scope.apiVersion.delete_is_check_session = $scope.deleteIsNeedCheck && $scope.apiVersion.delete_is_check_session;
        $scope.apiVersion.delete_is_public = !$scope.apiVersion.delete_is_check_app && !$scope.apiVersion.delete_is_check_session;
        $scope.apiVersion.patch_is_check_app = $scope.patchIsNeedCheck && $scope.apiVersion.patch_is_check_app;
        $scope.apiVersion.patch_is_check_session = $scope.patchIsNeedCheck && $scope.apiVersion.patch_is_check_session;
        $scope.apiVersion.patch_is_public = !$scope.apiVersion.patch_is_check_app && !$scope.apiVersion.patch_is_check_session;

        $scope.apiVersion.outer_url = $filter('stripPrefixSlash')($scope.apiVersion.outer_url);
        $scope.apiVersion.get_is_private = Number($scope.apiVersion.get_is_private);
        $scope.apiVersion.post_is_private = Number($scope.apiVersion.post_is_private);
        $scope.apiVersion.put_is_private = Number($scope.apiVersion.put_is_private);
        $scope.apiVersion.delete_is_private = Number($scope.apiVersion.delete_is_private);
        $scope.apiVersion.patch_is_private = Number($scope.apiVersion.patch_is_private);

        $scope.apiVersion.get_session_param_map = $scope.apiVersion.get_session_param_map || '{"uid":"s_uid"}';
        $scope.apiVersion.post_session_param_map = $scope.apiVersion.post_session_param_map || '{"uid":"s_uid"}';
        $scope.apiVersion.put_session_param_map = $scope.apiVersion.put_session_param_map || '{"uid":"s_uid"}';
        $scope.apiVersion.delete_session_param_map = $scope.apiVersion.delete_session_param_map || '{"uid":"s_uid"}';
        $scope.apiVersion.patch_session_param_map = $scope.apiVersion.patch_session_param_map || '{"uid":"s_uid"}';

        //添加modifier
        var curModifier = $scope.userName;
        var re = new RegExp(curModifier + ";", "g");
        $scope.apiVersion.modifier = $scope.apiVersion.modifier.replace(re, "") + curModifier + ";";

        $http.put('api_versions/' + $scope.id, $scope.apiVersion).success(function(data,status) {
            if(true){
                swal("修改成功!", "[提示] 3分钟后，API配置自动同步到RestHub-Core.", "success")
            }else{
                swal("修改成功!", "[提示] 3分钟后，API配置自动同步到RestHub-Core\n点击“发布”按钮可以同步更新到生产环境.", "success")
            }
            $location.path('/api_version_detail/' + $scope.id);
        }).error(function(data, status) {
            if (status === 409) {
                swal('URI已经存在');
            } else if (status == 304){
                swal('没有修改任何字段');
                $location.path('/api_version_detail/' + $scope.id);
            } else if (status == 406){
                swal('内部URL的域名不允许指向RestHub-Core');
            } else {
                swal('修改失败，请联系管理员');
            }
        });
    };
    // 返回
    $scope.back = function() {
        $location.path('/api_version_detail/' + $scope.id);
    };
    // 更新API负责人为登录者
    $scope.updateWithLoginName = function() {
        $scope.apiVersion.creator = $scope.userName + ";";
    };
    // 更新发布状态为已废弃
    $scope.updateStatus2Deprecated = function() {
        $scope.apiVersion.status = 2;
    };

    /*$http.get('/api_tokens').success(function(apiTokens) {
        $scope.apiTokens = apiTokens;
    });*/
}

function AddApiCtrl($scope, $http, $location, $routeParams, $cookieStore, uuid) {
    $scope.$emit('subtitle', '添加API');

    $scope.uuid = uuid.v4();
    //$scope.appGroupId = null;
    $scope.appGroupId = parseInt($routeParams.apiGroupId);
    if(typeof $scope.appGroupId === "number"){
        $scope.$emit('apiGroupId', $scope.appGroupId);
    }
            // 准备app apiGroup
            $scope.apiGroupList = [];
            var data = {"developer_id": $scope.userInfo.developer_id};
            $http({method:"get", url:'/api_group', params:data}).success(function(response) {
                if (response.status == 200){
                    $scope.groups = response.data;
                    angular.forEach($scope.groups, function(group, i) {
                        $scope.apiGroupList.push({"id": group.group_id, "description": group.group_description});
                    });
                }else{
                    swal("获取分组失败:" + response.message?response.message:"");
                    return;
                }
            }).error(function(data, status) {
                swal("获取分组失败");
            });

    // 提交
    $scope.submit = function() {
        var data = {
            name: $scope.name,
            // Todo: group_id和数据库表结构相关，暂时不做修改
            group_id: $scope.appGroupId,
            description: $scope.description,
            uuid: $scope.uuid
        };
        $http.post('apis', data).success(function(data) {
            swal("添加成功!", "[建议] 为api添加一个版本", "success")
            //$location.path("/api_version_list" + "/" + $scope.appGroupId);
        }).error(function(data, status) {
            swal('添加失败，接口已经存在');
        });
    };

    $scope.submitAndAddApiVersion = function() {
        var data = {
            name: $scope.name,
            // Todo: group_id和数据库表结构相关，暂时不做修改
            group_id: $scope.appGroupId,
            description: $scope.description,
            uuid: $scope.uuid
        };
        $http.post('apis', data).success(function(data) {
             $http.get('apis').success(function(apis) {
                 var isExist = false;
                 var api;
                 for(var i=0;i<apis.length;i++){
                     api = apis[i];
                     if (api.uuid === $scope.uuid){
                         isExist = true;
                         break;
                     }
                 }
                 if(isExist) {
                     $location.path("/add_api_version").search("api_id", api.id);
                 }
             });
        }).error(function(data, status) {
            swal('添加失败，接口已经存在');
        });
    };

    $scope.back = function back(){
        if ($scope.appGroupId){
            $location.path("/api_version_list" + "/" + $scope.appGroupId);
        }else{
            $location.path("/api_group_list");
        }
    };
}

function UpdateApiCtrl($scope, $routeParams, $http, $location, $cookieStore) {
    $scope.$emit('subtitle', '修改API');
    $scope.id = $routeParams.id;

    var data = {'api_id': $scope.id};
    $http({method:'GET', url:'api_access', params:data}).success(function(response) {
        if (response.status != 200){
            swal("没有权限访问该页面! 请联系管理员");
            $location.path('/api_version_list');
        }
    }).error(function(data, status) {
        swal("没有权限访问该页面! 请联系管理员");
        $location.path('/api_version_list');
    });

    // 准备apiGroupList
            // 准备app apiGroup
            $scope.apiGroupList = [];
            var data = {"developer_id": $scope.userInfo.developer_id};
            $http({method:"get", url:'/api_group', params:data}).success(function(response) {
                if (response.status == 200){
                    $scope.groups = response.data;
                    angular.forEach($scope.groups, function(group, i) {
                        $scope.apiGroupList.push({"id": group.group_id, "description": group.group_description});
                    });
                }else{
                    swal("获取分组失败:" + response.message?response.message:"");
                    return;
                }
            }).error(function(data, status) {
                swal("获取分组失败");
            });
    // 获取API详情
    $http.get('apis/'+$scope.id).success(function(api) {
        $scope.name = api.name;
        // Todo: api.group_id和数据库表结构相关，暂不做修改
        $scope.apiGoupId = api.group_id;
        $scope.description = api.description;
        $scope.uuid = api.uuid;
    });

    // 提交
    $scope.submit = function() {
        var url = 'apis/' + $scope.id;
        var data = {
            id: parseInt($scope.id),
            name: $scope.name,
            // Todo: api.group_id和数据库表结构相关，暂不做修改
            group_id: parseInt($scope.apiGoupId),
            description: $scope.description,
            uuid: $scope.uuid
        };
        $http.put(url, data).success(function(data) {
            swal("修改成功!", "[建议] 是否需要修改API版本信息", "success")
            $location.path("/api_version_list" + "/" + $scope.apiGoupId);
        });
    };
    // 返回
    $scope.back = function() {
        $location.path("/api_version_list" + "/" + $scope.apiGoupId);
    };
}

function ReleaseLogCtrl($scope) {
    $scope.$emit('subtitle', '更新日志');
}

function FaqCtrl($scope) {
    $scope.$emit('subtitle', '常见问题');
}

function TurlCtrl($scope, $http) {
    $scope.$emit('subtitle', '短链');
}

function StressLogCtrl($scope, $routeParams, $http, $location) {
    $scope.$emit('subtitle', '压力测试(平均延时)');
}

function RequestLogStatsCtrl($scope, $routeParams, $http) {
    $scope.$emit('subtitle', '最佳蜗牛(平均延时)');
}

function AddServerCtrl($scope, $http, $location, $routeParams, $cookieStore) {
    $scope.$emit('subtitle', '添加Server');

    $scope.upstream_id = 0;
    $scope.ipaddr = "0.0.0.0";
    $scope.port = 8080;
    $scope.tag = "1";
    $scope.ipaddrIsValid = true;
    $scope.portIsValid = true;
    $scope.tagIsValid = true;

    var upstreamId = Number($location.search().upstream_id);
    if(typeof upstreamId !== "number"){
        $scope.upstreamId = 0;
    } else {
        $scope.upstreamId = upstreamId;
    }

    $scope.checkIpaddr = function() {
        var str = $scope.ipaddr;
        if (str.split(".").length > 4) {
            $scope.ipaddrErrorMessage = "IP地址无效";
            $scope.ipaddrIsValid = false;
            return false;
        }
        str = str.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/g);
        if (str == null){
            $scope.ipaddrErrorMessage = "IP地址无效";
            $scope.ipaddrIsValid = false;
            return false;
        }else if (RegExp.$1>255 || RegExp.$2>255 || RegExp.$3>255 || RegExp.$4>255){
            $scope.ipaddrErrorMessage = "IP地址无效";
            $scope.ipaddrIsValid = false;
            return false;
        }else{
            $scope.ipaddrErrorMessage = "";
            $scope.ipaddrIsValid = true;
            return true;
        }
    }

    $scope.checkPort = function() {
        if (isNaN($scope.port)) {
            $scope.portErrorMessage = "port范围是80~65535";
            $scope.portIsValid = false;
        } else {
            $scope.portErrorMessage = "";
            $scope.portIsValid = true;
        }
    }

    $scope.checkTag = function() {
        var r = /^[0-9]{1,2}$/;
        if ($scope.tag !== "" && !r.test($scope.tag)) {
            $scope.tagErrorMessage = "目前只允许是数字，范围是1-99；其中，9特指ABTest";
            $scope.tagIsValid = false;
        } else {
            $scope.tagErrorMessage = "";
            $scope.tagIsValid = true;
        }
    }

    // 准备upstreams
    var data = {"developer_id": $scope.userInfo.developer_id};
    $http({method:"get", url:'/upstreams', params:data}).success(function(body, status) {
        if (status == 200) {
            $scope.upstreams = body;
        } else {
            swal("获取Upstreams失败[1]");
            return;
        }
    }).error(function(data, status) {
        swal("获取Upstreams失败[2]");
    });

    // 提交
    $scope.submit = function() {
        var data = {
            id: 0,
            upstream_id: $scope.upstreamId,
            ip: $scope.ipaddr,
            port: $scope.port,
            tag: $scope.tag,
            update_time: 0,
            is_enabled: 0
        };
        $http.post('servers', data).success(function(data) {
            swal("添加成功!", "[建议] 请手动启用server", "success")
        }).error(function(data, status) {
            swal('添加失败，请联系管理员');
        });
    };

    $scope.back = function back(){
        $location.path("/upstream").search("upstream_id", undefined);
    };
}


function GwConfCtrl($scope, $http, $route, ngNotify, $timeout) {
    $scope.$emit('subtitle', '网关配置');

    $scope.isUpstreamSyncEnable = true;
    $http.get('gw_conf').success(function(gw_conf) {
        $scope.gw_conf = gw_conf;
    });

    $scope.getUptime = function() {
        $http.get('nginx_uptime?tag=loading').success(function(data) {
            $scope.nodes = data.result;
        });
    }
    $scope.getUptime();

    $scope.dalayUpstreamSyncEnable = function() {
        $scope.isUpstreamSyncEnable = false;
        $timeout(function() {
             $scope.isUpstreamSyncEnable = true;
        }, 10000);
    }

    $scope.pollingUptime = function() {
        setTimeout(function() {
            $http.get('nginx_uptime?tag=polling').success(function(data) {
                $scope.nodes = data.result;
                var reboot_timestamp = Date.parse(new Date($scope.nodes[0].uptime));
                var now = Date.parse(new Date());
                if((now - reboot_timestamp) < 60*1000) {
                    ngNotify.set("upstream修改已经生效");
                } else {
                    $scope.pollingUptime();
                }
            });
        }, 1000);
    }

    $scope.update = function(id, value) {
        swal({
                title: "请输入密码",
                text: "需要授权访问",
                type: "input",
                showCancelButton: true,
                closeOnConfirm: false,
                animation: "slide-from-top",
                inputPlaceholder: "password",
                inputType: "password"
            },
            function(password){
                if(!password){
                    return;
                }
                var data = {'password':password};
                $http({method:"post", url:'/http_auth', params:data}).success(function(status) {
                    var data = {'id':id, 'value':value};
                    $http({method:"put", url:'/gw_conf', params:data}).success(function(status) {
                        swal("修改成功!", "[提示] 请手动点击页面上方的立即同步配置按钮[line: config]", "success")
                    }).error(function(data, status) {
                        swal('修改失败，请联系管理员');
                    });
                }).error(function(data, status) {
                    swal("密码错误!");
                    $route.reload();
                });
            }
        );
    };

    $scope.notify = function(value) {
        swal({
                title: "请输入密码",
                text: "需要授权访问",
                type: "input",
                showCancelButton: true,
                closeOnConfirm: false,
                animation: "slide-from-top",
                inputPlaceholder: "password",
                inputType: "password"
            },
            function(password){
                if(!password){
                    return;
                }
                var data = {'password':password};
                $http({method:"post", url:'/http_auth', params:data}).success(function(status) {
                    var data = {'data':value};
                    $http({method:"post", url:'/gw_notify', params:data}).success(function(status) {
                        if (value === "upstream_server") {
                            $scope.dalayUpstreamSyncEnable();
                            $scope.pollingUptime();
                        }
                        swal('RestHub-Core通知成功', '@'+status, "success");
                    }).error(function(data, status) {
                        swal('RestHub-Cores通知失败，请联系管理员');
                    });
                }).error(function(data, status) {
                    swal("密码错误!");
                    $route.reload();
                });
            }
        );
    };
}

function UpstreamCtrl($scope, $http, $route, ngNotify, $location) {
    $scope.$emit('subtitle', '虚拟服务配置');

    $scope.update = function() {
	    $http({method:"get", url:'/upstreams'}).success(function(data, status) {
		if (status == 200) {
            $scope.upstreamList = data;
            $scope.upstreamName = $location.search().upstream_name;
            $scope.upstreamId = $location.search().upstream_id;
		    $http({method:"get", url:'/servers'}).success(function(data, status) {
			if (status == 200) {
			    $scope.serverList = data;
                //如果URL参数中有upstream_id, 覆盖upstream_name
                if (($scope.upstreamId !== "") && (typeof($scope.upstreamId) !== "undefined")) {
                    angular.forEach($scope.upstreamList, function(upstream, index, array) {
                        if (upstream.id === parseInt($scope.upstreamId)) {
                            $scope.upstreamName = upstream.name;
                        }
                    });
                }
			    //重新组织upstreamList和serverList
			    $scope.newUpstreamList = [];
			    angular.forEach($scope.upstreamList, function(upstream, index, array) {
                    if ((typeof($scope.upstreamName) === "undefined") ||
                        ($scope.upstreamName === "") ||
                        (upstream.name === $scope.upstreamName)) {
                        var serverList = [];
                        angular.forEach($scope.serverList, function(server, index, array) {
                            if (upstream.id == server.upstream_id){
                                serverList.push(server);
                            }
                        });
                        upstream.serverList = serverList;
                        if (upstream.id !== 1) {  //upstream.id=1只用于页面显示
                            $scope.newUpstreamList.push(upstream);
                        }
                    }
			    });
			    console.log($scope.newUpstreamList);
			}else{
			    swal("获取Servers失败:" + status);
			    return;
			}
		    }).error(function(data, status) {
			    swal("获取Servers失败:" + status);
		    });
		}else{
		    swal("获取Upstreams失败:" + status);
		    return;
		}
	    }).error(function(data, status) {
		swal("获取Upstreams失败:" + status);
	    });
    }
    $scope.update();

    $scope.update_server = function (server) {
        $http({method:"put", url:'/servers/' + server.id, data:server}).success(function(response) {
                ngNotify.set('修改server list成功!');
            }).error(function(data, status) {
                ngNotify.set('修改server list失败!');
            });
    }

    $scope.delete_server = function (server) {
        swal({
                title: "确定要删除吗?",
                text: "如果需要撤销删除请联系管理员!",
                type: "warning",
                showCancelButton: true,
                cancelButtonText: "取消",
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                closeOnConfirm: true
              },
              function () {
                  $http({method:"delete", url:'/servers/' + server.id}).success(function(response) {
                      ngNotify.set('删除server成功!');
                      $scope.update();
                  }).error(function(data, status) {
                      ngNotify.set('删除server失败!');
                  });
              });
    }

    $scope.add_server = function (upstreamId) {
        $location.path("/server").search("upstream_id", upstreamId);
    }

    $scope.enable_server = function (server) {
        server.is_enabled = 1;
        $scope.update_server(server);
    }

    $scope.disable_server = function (server) {
        server.is_enabled = 0;
        $scope.update_server(server);
    }
}

function RequestLogCtrl($scope, $routeParams, $http, $filter, $location, NgTableParams) {
}

function RequestLogRTCtrl($scope, $routeParams, $http, $filter, NgTableParams) {
}

function ErrorLogCtrl($scope, $routeParams, $http, $location) {
}


function ErrorLogStatsCtrl($scope, $routeParams, $http) {
}

function ApiHotMapCtrl($scope, $routeParams, $filter, $http) {
}

function APIHotStatsCtrl($scope, $routeParams, $filter, $http) {
}

function APIOwnerCtrl($scope, $routeParams, $http, $filter, NgTableParams) {
    $scope.$emit('subtitle', '变更API负责人');
    $scope.apiList = [];
    $scope.searched_count = 0;
    $scope.searchOpeDone = {value:true};
    $scope.checkedCount = 0;
    $scope.isAllChecked = {value:false};
    $scope.viewType = "byStep1";
    $scope.s_creator = "";
    $scope.s_api_name = "";
    $scope.s_outerUrl = "";
    $scope.s_group_id = -1;
    $scope.selectedApiGroupObj = null;
    $scope.apiGroupList = [];
    $scope.new_creator = "";
    $scope.modifiedAPIList = [];
    $scope.api_version_ids = "";
    $scope.modified_count = 0;
    var viewSwitchArray = [true,false,false,false,false];
    switchTo(1);

    // 准备app apiGroup
    var data = {"developer_id": $scope.userInfo.developer_id};
    $http({method:"get", url:'/api_group_jointinfo', params:data}).success(function(response) {
        if (response.status == 200){
            var groups = response.data;
            angular.forEach(groups, function(group, i) {
                $scope.apiGroupList.push({
                    "group_id": group.group_id,
                    "group_description": group.group_description,
                    "group_description_pinyin": group.group_description_pinyin,
                    "spec": group.spec,
                    "group_name": group.group_name,
                    "developer_id": group.developer_id
                });
            });
        }else{
            swal("获取分组失败:" + response.message?response.message:"");
            return;
        }
    }).error(function(data, status) {
        swal("获取分组失败");
    });

    $scope.tableAPIListParams = new NgTableParams(
        {
             count: 50         // count per page
        }, {
             counts: [], // hide page counts control
             paginationMaxBlocks: 20,
             paginationMinBlocks: 2,
             getData: function($defer, params) {
                 params.total($scope.apiList.length);
                 var orderedData =  $scope.apiList;
                 $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
    });
    $scope.tableModifiedAPIListParams = new NgTableParams(
        {
             count: 50         // count per page
        }, {
             counts: [], // hide page counts control
             paginationMaxBlocks: 20,
             paginationMinBlocks: 2,
             getData: function($defer, params) {
                 params.total($scope.modifiedAPIList.length);
                 var orderedData =  $scope.modifiedAPIList;
                 $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
    });

    $scope.resetCriteria = function resetCriteria(){
        $scope.s_creator = "";
        $scope.s_group_id = -1;
        $scope.selectedApiGroupObj = null;
        $scope.s_outerUrl = "";
        $scope.s_api_name = "";
        $("input#group_types_value")[0].value="";
    };

    $scope.verCheckedChange = function verCheckedChange(ver){
        if(ver.__checked__) {
            if ($scope.showByStep4){
                ver.__new_creator__ = $scope.new_creator;
            }
            $scope.checkedCount++;
            if ($scope.checkedCount == $scope.searched_count) $scope.isAllChecked.value = true;
        }else{
            if ($scope.showByStep4){
                ver.__new_creator__ = ver.creator;
            }
            $scope.isAllChecked.value = false;
            $scope.checkedCount--;
        }
    };

    $scope.allCheckedChange = function allCheckedChange(){
        var apiCount = 0;
        angular.forEach($scope.apiList, function(api, i) {
            var vers = api.versions;
            angular.forEach(vers, function(ver, i) {
                ver.__checked__ = $scope.isAllChecked.value;
                if($scope.isAllChecked.value){
                    apiCount++;
                    if ($scope.showByStep4){
                        ver.__new_creator__ = $scope.new_creator;
                    }
                }else{
                    if ($scope.showByStep4){
                        ver.__new_creator__ = ver.creator;
                    }
                }
            });
        });
        $scope.checkedCount = apiCount;
    };
    $scope.getSpecialLabelText = function(apiVersion) {
        return utils.getSpecialLabelText(apiVersion);
    };

    $scope.getSpecialLabelClass = function(apiVersion) {
        return utils.getSpecialLabelClass(apiVersion);
    };

    $scope.isSpecialLabelShow = function(apiVersion) {
        return utils.isSpecialLabelShow(apiVersion);
    };
    $scope.showView = function(typestr) {
        $scope.viewType = typestr;
        updateShowType($scope.viewType);
    }

    function resetIntermidiateStore(){
        $scope.apiList = [];
        $scope.searched_count = 0;
        $scope.isAllChecked.value = false;
        $scope.checkedCount = 0;
        $scope.modifiedAPIList = [];
        $scope.api_version_ids = "";
        $scope.modified_count = 0;
        $scope.tableAPIListParams.reload();
        $scope.tableModifiedAPIListParams.reload();
    }
    function updateShowType(typestr) {
        if($scope.viewType === "byStep1") {
            if($scope.showByStep1) return;
            switchTo(1);
            resetIntermidiateStore();
        }else if($scope.viewType === "byStep2") {
            if($scope.showByStep2) return;
            if($scope.showByStep1){
                if (!checkSearchConditions()) return;
                doSearch();
            }
            switchTo(2);
        }else if($scope.viewType === "byStep3") {
            if($scope.showByStep3) return;
            if($scope.searched_count == 0){swal('符合条件的API共找到0个');return;}
            switchTo(3);
        }else if($scope.viewType === "byStep4") {
            if($scope.showByStep4) return;
            if ($scope.new_creator == "") {
                swal('请指定"新负责人"');
            }else{
                constructModifiedAPIList();
                switchTo(4);
            }
        }else if($scope.viewType === "byStep5") {
            if($scope.showByStep5) return;
            doModifyCreator();
        }else {
            if($scope.showByStep1) return;
            switchTo(1);
        }
    };

    function switchTo(intStep){
        var len = viewSwitchArray.length;
        if ((intStep >len)||(intStep < 1)) {
            intStep = 0;
        }else{
            intStep = intStep -1;
        }
        for(var i=0;i<len;i++){
               viewSwitchArray[i] = false;
               if (i == intStep) viewSwitchArray[i] = true;
               $scope['showByStep'+(1+i)] = viewSwitchArray[i];
        }
    };

    function constructModifiedAPIList(){
        angular.forEach($scope.apiList, function(api, i) {
            var vers = api.versions;
            angular.forEach(vers, function(ver, i) {
                if(ver.__checked__) {
                    ver.__new_creator__ = $scope.new_creator;
                }else{
                    ver.__new_creator__ = ver.creator;
                }
            });
        });
    };

    function constructApiList(apiVersionList){
        var apiIds = [];
        var apiList = [];
        angular.forEach(apiVersionList, function(ver, i) {
            //按api_id分组
            var api = null;
            var index = apiIds.indexOf(ver.api_id);
            ver.__checked__ = true;
            ver.__new_creator__ = ver.creator;
            if(index == -1){
                apiIds.push(ver.api_id)
                api = {"api_id":ver.api_id,"versions":[ver]};
                apiList.push(api);
            }else{
                api = apiList[index];
                api.versions.push(ver);
            }
       });
       return apiList;
    };

    function checkSearchConditions(){
        var result = true;
        var group_type_value = $("input#group_types_value")[0].value;
        if (group_type_value != "") {
            if ($scope.selectedApiGroupObj
                    && $scope.selectedApiGroupObj.originalObject) {
                if ($scope.selectedApiGroupObj.title != group_type_value) {
                    $scope.selectedApiGroupObj = null;
                    result = false;
                    swal('指定分类不存在,请确认');
                    return result;
                }
                $scope.s_group_id = $scope.selectedApiGroupObj.originalObject.group_id;
            }else{
                $scope.s_group_id = get_group_id_by_name(group_type_value);
                if($scope.s_group_id == -1){
                    result = false;
                    swal('指定分类不存在,请确认');
                    return result;
                }
            }
        }else{
            $scope.selectedApiGroupObj = null;
            $scope.s_group_id = -1;
        }

         if ($scope.s_creator =="" &&
            $scope.s_group_id == -1 &&
            $scope.s_outerUrl == "" &&
            $scope.s_api_name == ""){
                result = false;
                swal('请指定查询条件');
                return result;
        }
        return result;
    };

    function doSearch() {
        $scope.searchOpeDone.value = false;
        var options ={
            creator: $scope.s_creator,
            group_id: $scope.s_group_id,
            outer_url: $scope.s_outerUrl,
            api_name: $scope.s_api_name
        }
        var data = {"developer_id": $scope.userInfo.developer_id, "option_criteria": options};
        $http({method:"get", url:'/api_versions/joint_infos', params:data}).success(function(response) {
            $scope.apiList = constructApiList(response);
            $scope.searched_count = response.length;
            if($scope.searched_count > 0){
                $scope.isAllChecked.value = true;
                $scope.checkedCount = $scope.searched_count;
            }
            $scope.tableAPIListParams.reload();
            $scope.tableAPIListParams.page(1);
            $scope.searchOpeDone.value = true;
    }).error(function(data, status) {
            $scope.searchOpeDone.value = true;
            swal("获取ApiVersion失败. "+ status);
    });
    };

    function convertList2Str(ids_array){
        return ids_array.join();
    };

    function get_group_id_by_name(group_name){
        var group_id = -1;
        var len = $scope.apiGroupList.length;
        for( var i=0;i<len;i++){
            if($scope.apiGroupList[i].group_description == group_name){
                group_id = $scope.apiGroupList[i].group_id;
                break;
            }
        }
        return group_id;
    };

    function doModifyCreator(){
        var api_version_ids = [];
        angular.forEach($scope.apiList, function(api, i) {
            var vers = api.versions;
            angular.forEach(vers, function(ver, i) {
                if(ver.__checked__) api_version_ids.push(ver.id);
            });
        });
        $scope.api_version_ids = convertList2Str(api_version_ids);
        if($scope.api_version_ids.length<=0){
            swal("请勾选需要变更负责人的API");
            return;
        }
        swal({
                title: "确定要变更负责人吗?",
                text: "已勾选"+$scope.checkedCount+"个API,其负责人将被变更为: "+$scope.new_creator,
                type: "warning",
                showCancelButton: true,
                cancelButtonText: "取消",
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                closeOnConfirm: false
            },
            function(){
                var field ={"field_name":'creator',"field_value":$scope.new_creator, "field_type":'varchar'};
                var data = {"developer_id": $scope.userInfo.developer_id, "fields": field, "version_ids_str":$scope.api_version_ids};
                $http({method:"put", url:'/api_versions/fields', params:data}).success(function(response) {
                    var data = {"developer_id": $scope.userInfo.developer_id, "option_criteria": {"api_version_ids":$scope.api_version_ids}};
                    $http({method:"get", url:'/api_versions/joint_infos', params:data}).success(function(response) {
                        $scope.modifiedAPIList = constructApiList(response);
                        $scope.modified_count = response.length;
                        $scope.tableModifiedAPIListParams.reload();
                        $scope.tableModifiedAPIListParams.page(1);
                    }).error(function(data, status) {
                        swal("获取ApiVersion负责人变更结果失败");
                    });
                    swal("修改负责人成功");
                    switchTo(5);
                }).error(function(data, status) {
                    swal("修改负责人失败. "+ status);
                    swal('修改负责人失败', status+' ' +data, "error");
                });
            }
        );

    };
}

function publishCtrl($scope) {
    $scope.$emit('subtitle', '发布消息');
}

function subscribeCtrl($scope) {
    $scope.$emit('subtitle', '订阅消息');
}

function monitorCtrl($scope, $location) {
    $scope.apiGroupId = $location.search().apiGroupId;
    $scope.groupName = $location.search().groupName;
    $scope.groupDescription = $location.search().groupDescription;
    $scope.$emit('subtitle', '监控' + '-' + $scope.groupDescription);

    var tmpUrl = "";
    tmpUrl = "http://proxy-monitor.mumway.com/dashboard/db/resthub_diao-yong-fen-xi?orgId=11&var-api_group=";
    tmpUrl = tmpUrl + $scope.groupName;
    tmpUrl = tmpUrl + "&theme=light&token=eyJrIjoiWmxJbTBMWmhxMnRodlYyUmZ3WGRMUTlLZFBHa3p6OXoiLCJuIjoicmVzdGh1YiIsImlkIjoxMX0=";
    $scope.frameUrl = tmpUrl;
}

function monitorDetailCtrl($scope, $location) {
    $scope.apiGroupId = $location.search().apiGroupId;
    $scope.groupName = $location.search().groupName;
    $scope.groupDescription = $location.search().groupDescription;
    $scope.$emit('subtitle', '监控' + '-' + $scope.groupDescription);

    var tmpUrl = "";
    tmpUrl = "http://proxy-monitor.mumway.com/dashboard/db/resthub_diao-yong-fen-xi?orgId=11&var-api_group=";
    tmpUrl = tmpUrl + $scope.groupName;
    tmpUrl = tmpUrl + "&theme=light&token=eyJrIjoiWmxJbTBMWmhxMnRodlYyUmZ3WGRMUTlLZFBHa3p6OXoiLCJuIjoicmVzdGh1YiIsImlkIjoxMX0=";
    $scope.frameUrl = tmpUrl;
}

function monitorApiVersionCtrl($scope, $location) {
    $scope.outer_url = $location.search().outerUrl;
    $scope.description = $location.search().description;
    $scope.$emit('subtitle', '监控' + '-' + $scope.description);

    var tmpUrl = "";
    tmpUrl = "http://proxy-monitor.mumway.com/dashboard/db/resthub_diao-yong-fen-xi?orgId=11";
    tmpUrl = tmpUrl + "&theme=light&token=eyJrIjoiWmxJbTBMWmhxMnRodlYyUmZ3WGRMUTlLZFBHa3p6OXoiLCJuIjoicmVzdGh1YiIsImlkIjoxMX0=";
    $scope.frameUrl = tmpUrl;
}

function queryLogCtrl($scope, $http, $timeout) {
}

function accountCtrl($scope, $http, $cookieStore, ngDialog, ngNotify) {
    $scope.$emit('subtitle', '我的账户');
    $scope.roleMap = ROLE_MAP;
    $scope.roleArray = ROLE_ARRAY;
    $scope.isAuditArray = IS_AUDIT_ARRAY;

    $scope.newGroup = {};

    $scope.newMember = {};
    $scope.newMember.role_id = 2;
    $scope.newMember.searchCtx = {};
    $scope.newMember.searchCtx.originalObject = {};

    $scope.viewMember = {};

    $scope.newGroupWl = {};

    $scope.isGroupAdmin = false;

    $scope.deprecatedApiVersionList = [];
    $scope.tobeauditedApiVersionList = [];

    $scope.isAuditor = false;

    $scope.isAdmin = function (item) {
        return item.charactar == 1;
    }

    $scope.isSupper = function (item) {
        return item.charactar == 0;
    }

    $scope.isSupperOrAdmin = function (item) {
        return item.charactar <= 1;
    }

    $scope.isNotAdmin = function (item) {
        return item.charactar > 1;
    }

    $scope.isSupperAuthorization = function (item) {
        return item.id >= 1;
    }

    $scope.isAdminAuthorization = function (item) {
        return item.id > 1;
    }

    $scope.isSupperOrAdminAndGroupnameNotNull = function (item) {
        return item.charactar <= 1 && item.group_description !== null;
    }

    $scope.update = function () {
            var data = {"developer_id": $scope.userInfo.developer_id};
            $http({method:"get", url:'/api_group', params:data}).success(function(response) {
                if (response.status == 200){
                    $scope.groups = response.data;
                }else{
                    swal("获取分组失败:" + response.message?response.message:"");
                    return;
                }
            }).error(function(data, status) {
                swal("获取分组失败");
            });

            data = {"user_id": $scope.userInfo.user_id};
            $http({method:"get", url:'/admin', params:data}).success(function(response) {
                if (response.status == 200) {
                    $scope.myGroups = response.data;
                    //检查是否有企业管理员权限
                    var myGroupIds = [];
                    angular.forEach($scope.myGroups, function(group, i){
                        myGroupIds.push(group.group_id);
                        if (group.charactar <= 1) {
                            $scope.isGroupAdmin = true;
                        }
                    });

                    //取得分组下的所有deprecated apiversion信息
                    data = {"developer_id": $scope.userInfo.developer_id};
                    $http({method:"get", url:'/api_versions/deprecations', params:data}).success(function(apiVersionDeprecations) {
                         //deprecatedVers = [];
                         angular.forEach(apiVersionDeprecations, function(apiVersion, i) {
                             if (myGroupIds.indexOf(apiVersion.group_id) != -1){
                                 $scope.deprecatedApiVersionList.push(apiVersion);
                             }
                         });
                    });
                }else{
                    swal("获取权限失败:" + response.message?response.message:"");
                    return;
                }
            }).error(function(data, status) {
                swal("获取用户权限失败");
            });

            //获取用户审核权限
            data = {"rtx": $scope.userName};
            $http({method:"get", url:'/audit', params:data}).success(function(response) {
                if (response.status == 200) {

                    $scope.myAuditGroups = response.data;
                    if($scope.myAuditGroups.length == 0){
                        return;
                    }

                    $scope.isAuditor = true;
                    var myAuditGroupIds = [];
                    angular.forEach($scope.myAuditGroups, function(group, i){
                        myAuditGroupIds.push(group.group_id);
                    });

                    //取得待审核apiversion一览
                    data = {"developer_id": $scope.userInfo.developer_id};
                    $http({method:"get", url:'/api_versions/unaudited', params:data}).success(function(apiVersionsTobeaudited) {
                        if (myAuditGroupIds.indexOf(-1) != -1){
                            angular.forEach(apiVersionsTobeaudited, function(apiVersion, i) {
                                if(apiVersion.status == 0){
                                    $scope.tobeauditedApiVersionList.push(apiVersion);
                                }
                            });
                        }else{
                            angular.forEach(apiVersionsTobeaudited, function(apiVersion, i) {
                                  if (myAuditGroupIds.indexOf(apiVersion.group_id) != -1){
                                      if(apiVersion.status == 0){
                                            $scope.tobeauditedApiVersionList.push(apiVersion);
                                      }
                                }
                            });
                        }
                    });

                }else{
                    swal("获取权限失败:" + response.message?response.message:"");
                    return;
                }
            }).error(function(data, status) {
                swal("获取用户权限失败");
            });
    }
    $scope.update();

    $scope.openAddGroup = function () {
        ngDialog.open({
            template: 'html/popup_add_group.html',
            controller: 'accountCtrl',
            className: 'ngdialog-theme-default'
            //scope: $scope
        });
    };

    $scope.openAddMember = function () {
        ngDialog.open({
            template: 'html/popup_add_member.html',
            controller: 'accountCtrl',
            className: 'ngdialog-theme-default'
            //scope: $scope
        });
    };

    $scope.openAddAdmin = function () {
        ngDialog.open({
            template: 'html/popup_add_admin.html',
            controller: 'accountCtrl',
            className: 'ngdialog-theme-default'
            //scope: $scope
        });
    };

    $scope.openViewGroup = function () {
        ngDialog.open({
           template: 'html/popup_view_group.html',
            controller: 'accountCtrl',
            className: 'ngdialog-theme-default'
            //scope: $scope
        });
    }

    $scope.openViewAdmin = function () {
        ngDialog.open({
           template: 'html/popup_view_admin.html',
            controller: 'accountCtrl',
            className: 'ngdialog-theme-default'
            //scope: $scope
        });
    }

    $scope.openViewMember = function () {
        ngDialog.open({
           template: 'html/popup_view_member.html',
            controller: 'accountCtrl',
            className: 'ngdialog-theme-default'
            //scope: $scope
        });
    }

    $scope.openAddGroupWl = function () {
        ngDialog.open({
           template: 'html/popup_add_groupwl.html',
            controller: 'accountCtrl',
            className: 'ngdialog-theme-default'
            //scope: $scope
        });
    }

    $scope.openViewGroupWl = function () {
        ngDialog.open({
           template: 'html/popup_view_groupwl.html',
            controller: 'accountCtrl',
            className: 'ngdialog-theme-default'
            //scope: $scope
        });
    }

    $scope.addGroupSubmit = function () {
        var data = {
            "developer_id": $scope.userInfo.developer_id,
            "group_name": $scope.newGroup.groupName,
            "group_description": $scope.newGroup.groupDescription,
            "group_description_pinyin": $scope.newGroup.groupDescription_pinyin,
            "spec": $scope.newGroup.spec
        };
        $http({method:"post", url:'/api_group', params:data}).success(function(response) {
            if (response.status == 200){
                swal("添加分组成功");
            }else{
                swal("添加分组失败:" + response.message?response.message:"");
                return;
            }
            $scope.closeThisDialog($scope.newGroup.groupName);
        }).error(function(data, status) {
            swal("添加分组失败");
        });
    }

    $scope.deleteGroup = function (group_id) {
        var data = {"group_id": group_id};
        swal({
                title: "确定要删除吗?",
                type: "warning",
                showCancelButton: true,
                cancelButtonText: "取消",
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                closeOnConfirm: false
            },
            function(){
                $http({method:"delete", url:'/api_group', params:data}).success(function(response) {
                    if (response.status == 200){
                        swal("删除分组成功");
                    }else{
                        swal("删除分组失败:" + response.message?response.message:"");
                        return;
                    }
                    // $scope.closeThisDialog($scope.newGroup.groupName);
                    $scope.update();
                }).error(function(data, status) {
                    swal("删除分组失败");
                });
            }
        );
    }

    $scope.addAdminSubmit = $scope.addMemberSubmit = function () {
        var data = {
            //"developer_id": $scope.userInfo.developer_id,
            //"user_id": $scope.newMember.searchCtx.originalObject.user_id,
            "rtx": $scope.newMember.username,
            "group_id": $scope.newMember.group_id,
            "charactar": $scope.newMember.role_id
        };
        $http({method:"post", url:'/admin', params:data}).success(function(response) {
            if (response.status == 200){
                swal("添加分组成员成功");
            }else{
                swal("添加分组成员失败:" + response.message?response.message:"");
                return;
            }
            $scope.closeThisDialog($scope.apiWLDialog);
        }).error(function(data, status) {
            swal("添加分组成员失败");
        });
    }

    $scope.viewAdminSubmit = $scope.viewMemberSubmit = function () {
        var data = {
            "developer_id": $scope.userInfo.developer_id,
            "group_id": $scope.viewMember.group_id
        };
        $http({method:"get", url:'/admin', params:data}).success(function(response) {
            if (response.status == 200){
                $scope.members = response.data;
            }else{
                swal("查看分组成员失败:" + response.message?response.message:"");
            }
            // $scope.closeThisDialog($scope.newGroup.groupName);
        }).error(function(data, status) {
            swal("查看分组成员失败");
        });
    }

    $scope.deleteMember = function (user_id, group_id, developer_id) {
        var data = {
            "user_id": user_id,
            "group_id": group_id,
            "developer_id": developer_id
        };
        swal({
                title: "确定要删除吗?",
                type: "warning",
                showCancelButton: true,
                cancelButtonText: "取消",
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                closeOnConfirm: false
            },
            function(){
                    $http({method:"delete", url:'/admin', params:data}).success(function(response) {
                    if (response.status == 200){
                        swal("删除分组成员成功");
                    }else{
                        swal("删除分组成员失败:" + response.message?response.message:"");
                        return;
                    }
                    // 更新成员列表
                    $scope.viewMemberSubmit();
                    // $scope.closeThisDialog($scope.newGroup.groupName);
                    $scope.update();
                }).error(function(data, status) {
                    swal("删除成员失败");
                });
            }
        );
    }

    $scope.addGroupWlSubmit = function () {
        var data = {
            "developer_id": $scope.newGroupWl.developer_id,
            "group_id": $scope.newGroupWl.group_id
        };
        $http({method:"post", url:'/api_group_whitelist', params:data}).success(function(response) {
            if (response.status == 200){
                swal("添加分组白名单成功");
            }else{
                swal("添加分组白名单失败:" + response.message?response.message:"");
                return;
            }
            $scope.closeThisDialog($scope.newGroup.groupName);
        }).error(function(data, status) {
            swal("添加分组白名单失败");
        });
    }

    $scope.viewGroupWlSubmit = function () {
        var data = {
            "group_id": $scope.viewGroupWl.group_id
        };
        $http({method:"get", url:'/api_group_whitelist', params:data}).success(function(response) {
            if (response.status == 200){
                $scope.groupWls = response.data;
            }else{
                swal("查看分组白名单失败:" + response.message?response.message:"");
                return;
            }
            // $scope.closeThisDialog($scope.newGroup.groupName);
        }).error(function(data, status) {
            swal("查看分组白名单失败");
        });
    }

    $scope.deleteGroupWl = function (group_id, developer_id) {
        var data = {
            "group_id": group_id,
            "developer_id": developer_id
        };
        swal({
                title: "确定要删除吗?",
                type: "warning",
                showCancelButton: true,
                cancelButtonText: "取消",
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                closeOnConfirm: false
            },
            function(){
                $http({method:"delete", url:'/api_group_whitelist', params:data}).success(function(response) {
                    if (response.status == 200){
                        swal("删除分组白名单成功");
                    }else{
                        swal("删除分组白名单失败:" + response.message?response.message:"");
                        return;
                    }
                    // 更新白名单列表
                    $scope.viewGroupWlSubmit();
                    $scope.update();
                }).error(function(data, status) {
                    swal("删除分组白名单失败");
                });
            }
        );
    }

    // 复制开发者账户信息
    $scope.copy = function() {
        ngNotify.set('复制成功!');
    };

    //测试数据
    $scope.ctxs = [{"name": "test"}]
}


function respContraventionCtrl($scope, $routeParams, $http) {
}


var apiManager = angular.module('apiManager', ['ngRoute','angularLocalStorage', 'ngClipboard', 'chart.js', 'ngTable', 'ngDialog', 'ngNotify', 'angucomplete', 'btford.markdown', 'echartline', 'angular-uuid']);
apiManager.value('subtitle', '');

apiManager.factory('UserInfo', ['$http', '$q', '$cookieStore', function ($http, $q, $cookieStore) {
    var deferred = $q.defer();
    $http({method: 'GET', url: '/user',params:{rtx: $cookieStore.get('resthub_user_name')}}).
    success(function(data, status, headers, config) {
        deferred.resolve(data);
    }).error(function(data, status, headers, config) {
        deferred.reject(data);
    });
    return deferred.promise;
}]);

apiManager.factory('AdminInfo', ['$http', '$q', '$cookieStore', function ($http, $q, $cookieStore) {
    var deferred = $q.defer();
    $http({method: 'GET', url: '/admin', params:{user_id: $cookieStore.get('resthub_user_id')}}).
    success(function(data, status, headers, config) {
        deferred.resolve(data);
    }).error(function(data, status, headers, config) {
        deferred.reject(data);
    });
    return deferred.promise;
}]);

// router
apiManager.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
        resolve:{'UserInfo': 'UserInfo', 'AdminInfo': 'AdminInfo'},
        templateUrl: 'html/api_group_list.html',
        controller: ApiGroupListCtrl
    }).when('/dashboard', {
        resolve:{'UserInfo':'UserInfo'},
        templateUrl: 'html/dashboard.html',
        controller: DashboardCtrl
    }).when('/dashboard_rt', {
        resolve:{'UserInfo':'UserInfo'},
        templateUrl: 'html/dashboard_rt.html',
        controller: DashboardRTCtrl
    }).when('/dashboard_history/:type', {
        resolve:{'UserInfo':'UserInfo'},
        templateUrl: 'html/dashboard_history.html',
        controller: DashboardHistoryCtrl
    }).when('/apihotmap', {
        resolve:{'UserInfo':'UserInfo'},
        templateUrl: 'html/apihotmap.html',
        controller: ApiHotMapCtrl
    }).when('/api_group_list', {
        resolve:{'UserInfo': 'UserInfo', 'AdminInfo': 'AdminInfo'},
        templateUrl: 'html/api_group_list.html',
        controller: ApiGroupListCtrl
    }).when('/api_version_list', {
        resolve:{'UserInfo':'UserInfo'},
        templateUrl: 'html/api_version_list.html',
        controller: ApiVersionListCtrl
    }).when('/api_version_list/:apiGroupId', {
        resolve:{'UserInfo':'UserInfo'},
        templateUrl: 'html/api_version_list.html',
        controller: ApiVersionListCtrl
    }).when('/api_version_detail/:id', {
        resolve:{'UserInfo':'UserInfo'},
        templateUrl: 'html/api_version_detail.html',
        controller: ApiVersionDetailCtrl
    }).when('/add_api_version', {
        resolve:{'UserInfo':'UserInfo'},
        templateUrl: 'html/add_api_version.html',
        controller: AddApiVersionCtrl
    }).when('/api_cookie_list', {
        resolve:{'UserInfo':'UserInfo'},
        templateUrl: 'html/api_cookie_list.html',
        controller: ApiCookieCtrl
    }).when('/update_api_version/:id', {
        resolve:{'UserInfo':'UserInfo'},
        templateUrl: 'html/update_api_version.html',
        controller: UpdateApiVersionCtrl
    }).when('/sync_api_version/:id', {
        resolve:{'UserInfo':'UserInfo'},
        templateUrl: 'html/api_versions_transshipment.html',
        controller: SyncApiVersionCtrl
    }).when('/audit_api_version/:id', {
        resolve:{'UserInfo':'UserInfo'},
        templateUrl: 'html/audit_api_version.html',
        controller: AuditApiVersionCtrl
    }).when('/add_api', {
        resolve:{'UserInfo':'UserInfo'},
        templateUrl: 'html/add_api.html',
        controller: AddApiCtrl
    }).when('/update_api/:id', {
        resolve:{'UserInfo':'UserInfo'},
        templateUrl: 'html/update_api.html',
        controller: UpdateApiCtrl
    }).when('/release_log', {
        resolve:{'UserInfo':'UserInfo'},
        templateUrl: 'html/release_log.html',
        controller: ReleaseLogCtrl
    }).when('/faq', {
        resolve:{'UserInfo':'UserInfo'},
        templateUrl: 'html/faq.html',
        controller: FaqCtrl
    }).when('/turl', {
        resolve:{'UserInfo':'UserInfo'},
        templateUrl: 'html/turl.html',
        controller: TurlCtrl
    }).when('/gw_conf', {
        resolve:{'UserInfo':'UserInfo'},
        templateUrl: 'html/gw_conf.html',
        controller: GwConfCtrl
    }).when('/upstream', {
        resolve:{'UserInfo':'UserInfo'},
        templateUrl: 'html/upstream.html',
        controller: UpstreamCtrl
    }).when('/server', {
        resolve:{'UserInfo':'UserInfo'},
        templateUrl: 'html/add_server.html',
        controller: AddServerCtrl
    }).when('/api_owner_conf', {
        resolve:{'UserInfo':'UserInfo'},
        templateUrl: 'html/api_owner_conf.html',
        controller: APIOwnerCtrl
    }).when('/open_user_list', {
         resolve:{'UserInfo':'UserInfo'},
        templateUrl: 'html/open_user_list.html',
        controller: OpenUserListCtrl
    }).when('/subscribe', {
        resolve:{'UserInfo':'UserInfo'},
        templateUrl: 'html/subscribe.html',
        controller: subscribeCtrl
    }).when('/monitor', {
        resolve:{'UserInfo':'UserInfo'},
        templateUrl: 'html/monitor.html',
        controller: monitorCtrl
    }).when('/monitor_detail', {
        resolve:{'UserInfo':'UserInfo'},
        templateUrl: 'html/monitor_detail.html',
        controller: monitorDetailCtrl
    }).when('/monitor_api_version', {
        resolve:{'UserInfo':'UserInfo'},
        templateUrl: 'html/monitor_api_version.html',
        controller: monitorApiVersionCtrl
    }).when('/account', {
        resolve:{'UserInfo':'UserInfo'},
        templateUrl: 'html/account.html',
        controller: accountCtrl
    });
}]);

apiManager.config(['ngClipProvider', function(ngClipProvider) {
    ngClipProvider.setPath("js/ZeroClipboard.swf");
}]);

apiManager.config(function($sceDelegateProvider) {
   $sceDelegateProvider.resourceUrlWhitelist([
       'self',
       'http://proxy-monitor.mumway.com/**']);
});

// filter
apiManager.filter('echoIfNotNull', function() {
    return function(input, value) {
        var result = '';
        if(null === input)
            result = value;
        return result;
    };
});
apiManager.filter('echoIfTrue', function() {
    return function(input, value) {
        var result = '';
        if(input)
            result = value;
        return result;
    };
});
apiManager.filter('stripPrefixSlash',function(){
    return function(input){
        return input.replace(/^\//, "");
    };
});
apiManager.filter('compareDefaultAndValue',function(){
    return function(_default, value){
        if(_default == value) {
            return '默认';
        }else {
            return '用户配置';
        }
    };
});
apiManager.filter('digitToChineseCharacter',function(){
    return function(input){
        if(input == 1) {
            return '可信网络(包含内网)';
        }else {
            return '公网';
        }
    };
});
apiManager.filter('tokenToChineseCharacter',function(){
    return function(input){
        if(input == 1) {
            return '是';
        }else {
            return '否';
        }
    };
});
apiManager.filter('booleanToChineseCharacter',function(){
    return function(input){
        if(input == 1) {
            return '是';
        }else {
            return '否';
        }
    };
});
apiManager.filter('waitngTxt', function(){
    return function(input) {
        if ((typeof input ==='string') && (input !=='')) {
            input = Number(input);
        }
        if (typeof input !== "number") {
            return '-';
        } else {
            return input;
        }
    };
});
apiManager.filter('charactarTxt', function(){
    return function(input){
        if(input == 0){
            return "超级管理员";
        }else if (input == 1){
            return "管理员"
        }else if (input == 2){
            return "操作员"
        }else {
            return input;
        }
    };
});
apiManager.filter('groupTxt', function(){
    return function(input){
        if(input === null){
            return "@企业管理员";
        }else {
            return input;
        }
    };
});
apiManager.filter('formatnumber', function () {
        return function (input) {
                if (input){
                    return input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                }else{
                     return input;
            }
        };
});
apiManager.filter('datetime',function(){
    return function(input){
        var unixTimestamp = new Date(parseInt(input) * 1000);
        var timeString = unixTimestamp.getFullYear();
        timeString = timeString + "-" + ((unixTimestamp.getMonth()>=9)?(unixTimestamp.getMonth()+1):("0"+(unixTimestamp.getMonth()+1)));
        timeString = timeString + "-" + ((unixTimestamp.getDate()>9)?unixTimestamp.getDate():("0"+unixTimestamp.getDate()));
        timeString = timeString + " " + ((unixTimestamp.getHours()>9)?unixTimestamp.getHours():("0"+unixTimestamp.getHours()));
        timeString = timeString + ":" + ((unixTimestamp.getMinutes()>9)? unixTimestamp.getMinutes():("0"+unixTimestamp.getMinutes()));
        timeString = timeString + ":" + ((unixTimestamp.getSeconds()>9)?unixTimestamp.getSeconds():("0"+unixTimestamp.getSeconds()));
        return timeString;
    };
});
apiManager.filter('enabled2txt', function(){
    return function(input){
        if(input === 1){
            return "已启用";
        }else {
            return "已禁用";
        }
    };
});
apiManager.filter('pipeline2txt', function(){
    return function(input){
        if(input !== ""){
            return "pipelining-" + input;
        }else {
            return "";
        }
    };
});


var loginManager = angular.module('loginManager', []);

loginManager.controller('LoginController', ['$scope', '$http', '$location', function($scope, $http, $location) {
    $scope.username = "";
    $scope.password = "";

    $scope.submit = function() {
        var data = {username:$scope.username, password:$scope.password};
        $http({method:"post", url:'/login', params:data}).success(function() {
            window.location.href = "/#" + $location.url();
        }).error(function(){
            swal("用户名或密码错误");
        });
    };
}]);

var utils={
       "check_api_cookies":function check_api_cookies(cookies) {
            var is_cookies_ok = true;
            if(typeof cookies != 'string'){
                is_cookies_ok = false;
            }else{
                var len = cookies.length;
                if (len>264){
                    is_cookies_ok = false;
                }else if (len==0){
                }else{
                    var cookie_list = cookies.split(",");
                    var duplicate_removal_list = [];
                    var array_len = cookie_list.length;
                    for (var i=0;i<array_len;i++){
                        if (cookie_list[i].length>32){
                            is_cookies_ok = false;
                            break;
                        }else{
                            if(duplicate_removal_list.indexOf(cookie_list[i])!=-1){
                                is_cookies_ok = false;
                                break;
                            }
                            duplicate_removal_list.push(cookie_list[i]);
                        }
                    }
                }
            }
            return is_cookies_ok;
    },
    "classify_group_by_pinyin": function classify_group_by_pinyin(groups){
        var metatype_array = [];
        var metatype_names = [];
        var category_obj = null;
        var pinyin_header = "";
        var index = -1;
        angular.forEach(groups,function(group,i){
            if (group.group_description_pinyin.length > 0){
                pinyin_header = group.group_description_pinyin[0].toUpperCase();
            }else{
                pinyin_header = "其它";
            }

            index = metatype_names.indexOf(pinyin_header);
            if (index == -1){
                category_obj = {"metatype":pinyin_header,"api_groups":[group]};
                metatype_names.push(pinyin_header);
                metatype_array.push(category_obj);
            }else{
                category_obj = metatype_array[index];
                category_obj.api_groups.push(group);
                category_obj.api_groups.sort(function(a,b){return a.group_description_pinyin>b.group_description_pinyin});
            }
        });
        //metatype_array.sort(function(a,b){return a.metatype > b.metatype});
        metatype_array.unshift({"metatype":"所有分类","api_groups":groups});
        return metatype_array;
    },
     "getSpecialLabelText": function getSpecialLabelText(apiVersion) {
        if (apiVersion.status === STATUS_INDEX["已废弃"]){
            return "已废弃";
        }/*else if(apiVersion.is_audit !== IS_AUDIT_INDEX["审核通过"]){
            if(apiVersion.is_audit < IS_AUDIT_ARRAY.length){
                return IS_AUDIT_ARRAY[apiVersion.is_audit];
             }else{
                 return IS_AUDIT_ARRAY[0];
             }
        }*/else{
            if(apiVersion.is_audit < IS_AUDIT_ARRAY.length){
                return IS_AUDIT_ARRAY[apiVersion.is_audit];
             }else{
                 return IS_AUDIT_ARRAY[0];
             }
        }
        return "";
    },
    "getSpecialLabelClass": function getSpecialLabelClass(apiVersion) {
        if (apiVersion.status === STATUS_INDEX["已废弃"]){
            return "label-danger";
        }else if(apiVersion.is_audit === IS_AUDIT_INDEX["审核通过"]){
            return "label-success";
        }else if(apiVersion.is_audit === IS_AUDIT_INDEX["审核未通过"]){
            return "label-warning";
        }else if(apiVersion.is_audit === IS_AUDIT_INDEX["未审核"]){
            return "label-info";
        }
        return "";
    },
    "isSpecialLabelShow": function isSpecialLabelShow(apiVersion) {
        return true;
    }
}


