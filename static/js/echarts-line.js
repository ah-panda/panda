angular.module('echartline', [] )
  .directive('line', function() {
  	function s2d(v) {
        		return v < 10 ? '0' + v : v;
    	};
    	function optionApply(obj, option) {
		for (var attr in option) {
			obj[attr] = option[attr];
		}
	};
	function formatnumber(input) {
        		if (input){
            		return input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        		}else{
            	 	return input;
            }
    };
	return {
		scope: {
			id: "@",
			legend: "=",
			serieoption: "=",
			datezoomstart: "@",
			title: "@",
			xaxissplitnumber : "@",
			data: "="
		},
		restrict: 'E',
		template: '<div style="height:300px;"></div>',
		replace: true,
		link: function($scope, element, attrs, controller) {
			var option = {
				title : {
					text :  $scope.title//,
					//y    :  15
				},
				// 提示框，鼠标悬浮交互时的信息提示
				tooltip: {
					show: true,
					trigger: 'item',
					formatter : function(params) {
						var date = new Date(params.value[0]);
						res = date.getFullYear() + '-' + s2d((date.getMonth() + 1))
								+ '-' + s2d(date.getDate()) + ' ' + s2d(date.getHours())
								+ ':' + s2d(date.getMinutes()) + ':' + s2d(date.getSeconds());
						res += '<br/>' + params.seriesName +' : '+ formatnumber(params.value[1]);
						return res;
					}
				},
				// 图例
				legend : {
					data : $scope.legend,
					y    : 25
				},
				grid : {
					x : 60,
					y : 50,
					x2 : 90,
					y2 : 60
				},
				toolbox : {
					show : false,
					feature : {
						mark : {
							show : true
						},
						dataView : {
							show : true,
							readOnly : false
						},
						magicType : {
							show : true,
							type : ['line', 'bar', 'stack', 'tiled']
						},
						restore : {
							show : true
						},
						saveAsImage : {
							show : true
						}
					}
				},
				dataZoom : {
					show : true,
					start : 90
				},
				// 横轴坐标轴
				xAxis: [{
					type: 'time',
					//type : 'category',
					boundaryGap:[0.005,0.00],
					axisLabel : {
						formatter : 'hh:mm:ss'
					},
					splitLine: {show:false},
					splitNumber:$scope.xaxissplitnumber?0+$scope.xaxissplitnumber:10
				}],
				// 纵轴坐标轴
				yAxis: [{
					scale:true,
					type: 'value'
				}],
				//默认颜色
				color: [
    				'#97BBCD', '#87cefa', '#ff7f50', '#32cd32', '#6495ed',
    				'#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0',
    				'#1e90ff', '#ff6347', '#7b68ee', '#00fa9a', '#ffd700',
    				'#6b8e23', '#ff00ff', '#3cb371', '#b8860b', '#30e0e0'
				],
				// 数据内容数组
				noDataLoadingOption : {
					text : '暂无数据',
					effect : 'bubble',
					effectOption : {
						effect : {
							n : 0
						}
					},
					textStyle : {
						fontSize : 32,
						fontWeight : 'bold'
					}
				},
				series: getSeries()
			};
			function getSeries() {
				var serie = [];
				for (var i = 0; i < $scope.legend.length; i++) {
					var item = {
						showAllSymbol : true,
						symbolSize : 1,
						type : 'line',
						name : $scope.legend[i],
						data : $scope.data[i]
					};
					if ($scope.serieoption[i]) {
						optionApply(item, $scope.serieoption[i]);
					}
					serie.push(item);
				}
				return serie;
			};
			if( $scope.datezoomstart){
					option.dataZoom.start = Number($scope.datezoomstart);
			}

			var myChart = echarts.init(document.getElementById($scope.id),'macarons');
			myChart.showLoading({
						text : '数据读取中...',
						effect : 'whirling',
						textStyle : {
							fontSize : 20
						}
			});
			if (option.series.length != 0) {
				myChart.setOption(option);
			}
			setTimeout(function() {
				window.onresize = function() {
					myChart.resize();
				}
			}, 200)
			$scope.$watch("data", function(){
				if ($scope.data.length != 0 && $scope.legend.length != 0) {
					option.legend.data = $scope.legend;
					option.series = getSeries();

					var hasBarType = false;
					for(var i=0;i<option.series.length;i++){
						if(option.series[i].type == 'bar'){
							hasBarType = true;
							break;
						}
					}
					if(!hasBarType){
						option.xAxis[0].boundaryGap = [0, 0];
					}

					myChart.hideLoading();
					myChart.setOption(option,true);
				}
			});
		}
	};
});