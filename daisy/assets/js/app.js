(function () {
  'use strict';

  angular
    .module('daisy', [
      'ui.router',
      'daisy.config',
      'daisy.routes',
      'daisy.controllers',
      'daisy.services',
      'daisy.directives',
      'ngHandsontable',
      'ui.bootstrap',
      'localytics.directives'
    ]);

  angular
    .module('daisy.config', []);

  angular
    .module('daisy.routes', ['ngRoute']);

  angular
    .module('daisy.controllers', []);

  angular
    .module('daisy.services', []);

  angular
    .module('daisy.directives', []);

  angular
    .module('daisy')
    .run(run);

  run.$inject = ['$http'];

  /**
  * @name run
  * @desc Update xsrf $http headers to align with Django's defaults
  */
  function run($http) {
    $http.defaults.xsrfHeaderName = 'X-CSRFToken';
    $http.defaults.xsrfCookieName = 'csrftoken';
  }

})();

(function (window) {
  'use strict';

  angular
    .module('daisy.config')
    .config(config);

  config.$inject = ['$locationProvider', '$httpProvider'];

  /**
  * @name config
  * @desc Enable HTML5 routing
  */
  function config($locationProvider, $httpProvider) {
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
  }

  angular
    .module('daisy.config')
    .constant('AppConstants', {
      config: window.appConfig,

      handsontableSettings: {
        autoColumnSize: true,
        colHeaders: true,
        rowHeaders: true,
        manualColumnResize: true,
        minCols: 1,
        minRows: 1,
        contextMenu: ["row_above", "row_below", "---------", "col_left", "col_right", "---------", "remove_row", "remove_col", "---------", "undo", "redo"],
        readOnly: true,
      },

      handsontableReadOnly: {
        autoColumnSize: true,
        colHeaders: true,
        rowHeaders: true,
		renderAllRows: (window.navigator.userAgent.indexOf('MSIE ') > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)),
        manualColumnResize: true,
        minSpareCols: 20,
        minSpareRows: 15,
        stretchH: 'all',
        readOnly: true,
        minCols: 1,
        minRows: 1
      },

      NJColors: [{
        label: '기본 2색상 프리셋',
        colors: NJ.Utils.category2
      }, {
        label: '기본 4색상 프리셋',
        colors: NJ.Utils.category4
      }, {
        label: '기본 8색상 프리셋 A',
        colors: NJ.Utils.category8a
      }, {
        label: '기본 8색상 프리셋 B',
        colors: NJ.Utils.category8b
      }, {
        label: '기본 20색상 프리셋',
        colors: NJ.Utils.category20
      }],

      visualizeAttrs: {
        brush: '브러시',
        categories: '카테고리',
        color: '색상',
		colors: '색상',
        colorPreset: '색상 프리셋',
        colorBegin: '색상범위 시작',
        colorEnd: '색상범위 끝',
        comparison: '비교군',
        dimensions: '차원',
		fontColor: '글자 색상',
        fontFamily: '글꼴',
        fontSize: '글자 크기',
        graph: '그래프 속성',
        group: '그룹',
        groupColor: '그룹 동일색상 사용',
		hexaRadius: '반지름',
        innerInterval: '안쪽 막대 간격',
        innerRadius: '안쪽 반지름',
        label: '라벨',
        lineWidth: '선 굵기',
        key: '그룹 키',
        maxTagSize: '태그 크기 (최대)',
        minTagSize: '태그 크기 (최대)',
        offset: '변위',
        outerInterval: '바깥쪽 막대 간격',
        outerRadius: '바깥쪽 반지름',
        radius: '반지름',
        region: '지역',
        scale: '비율',
        shape: '모양',
        size: '크기',
        tagMargin: '태그 간격',
        term: '기간',
        timeFormat: '시간 형식',
        titleMargin: '제목 간격',
        titleSize: '제목 크기',
        traits: '특성',
        value: '값',
        x: 'X축',
        xAxis: 'X축',
        xLabel: 'X축 라벨',
        y: 'Y축',
        yAxis: 'Y축',
        yLabel: 'Y축 라벨',
      }
    });
})(window);

(function () {
  'use strict';

  angular
    .module('daisy.routes')
    .config(config);

  config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];

  /**
  * @name config
  * @desc Define valid application routes
  */
  function config($stateProvider, $urlRouterProvider, $locationProvider) {
    var requireVisualizeTypes = ['ApiService', function (ApiService) {
      return ApiService.Visualize.getTypes();
    }];

    $urlRouterProvider.otherwise('project');
    $stateProvider
    .state('project', {
      url: "/",
      controller: 'ProjectListController',
      controllerAs: 'vm',
      templateUrl: 'static/templates/project-list.html'
    })

    .state('project-new', {
      url: "/project/new",
      controller: 'ProjectNewController',
      controllerAs: 'vm',
      templateUrl: 'static/templates/project-new.html',
      resolve: { types: requireVisualizeTypes },
      params: {
        keyword: ""
      }
    })

    .state('project-item', {
      url: "/project/:id",
      controller: 'ProjectItemController',
      controllerAs: 'vm',
	  templateUrl: 'static/templates/project-item.html'
    })

	$locationProvider.html5Mode(true);
  }
})();

(function () {

'use strict';

// angular.module('daisy.controllers').controller('AppController', ['$modal', '$rootScope', '$route', 'ApiService', 'AppConstants', 'AppService', 'ToastService', 'UtilService', function ($modal, $rootScope, $route, ApiService, AppConstants, AppService, ToastService, UtilService) {
angular.module('daisy.controllers').controller('AppController', ['$rootScope', '$route', 'AppConstants', 'ToastService', 'UtilService', function ($rootScope, $route, AppConstants, ToastService, UtilService) {
  var self = this;

  self.$route = $route;
  self.constants = AppConstants;
  self.ToastService = ToastService;
  self.util = UtilService;


  self.toggleSidebar = function () {
    self.service.sidebarShown = ! self.service.sidebarShown;
  };
}]);

})();

(function () {
  'use strict';

  angular
    .module('daisy.controllers')
    .controller('ProjectListController', ProjectListController);

  ProjectListController.$inject = ['$location', '$scope', 'ApiService', '$state'];

  function ProjectListController($location, $scope, ApiService, $state) {
    var vm = this;

    vm.currentPage = 1;

    vm.pageChanged     = pageChanged;
    vm.searchByKeyword = searchByKeyword;
    vm.pageChanged();

    function searchByKeyword(keyword) {
      $state.go('project-new', {keyword: keyword});
    }

    function pageChanged() {
      ApiService.Project.getList(vm.currentPage).then(function (data) {
        vm.projectList = data;
      }, function() {
        vm.projectList = [];
      });
    }

    $(window).unbind('beforeunload');
  }
})();

(function () {
  'use strict';

  angular
    .module('daisy.controllers')
    .controller('ProjectItemController', ProjectItemController);

  ProjectItemController.$inject = ['$location', '$scope', '$rootScope', '$timeout', 'AppService', 'ApiService', 'ToastService', 'UtilService', '$stateParams', '$state'];

  function ProjectItemController($location, $scope, $rootScope, $timeout, AppService, ApiService, ToastService, UtilService, $stateParams, $state) {
    var vm = this;

    vm.stateParams = $stateParams;

    vm.active_tab  = 0;
    vm.sidebarHide = true;
    vm.table_data = [[]];
    vm.metadata = {};
    vm.detailMode = { verbose: true, data: false }; // 상세보기 / 데이터보기 toggle

    ApiService.Project.getItem(vm.stateParams.id).then(function (data) {
      vm.item = data;
      vm.draw(); // DB 정보를 불러오면 바로 시각화 나타내준다.
    }, function() {
      vm.item = [];
    });

    // Scope Functions
    vm.toggleSideBar   = toggleSideBar;
    vm.refreshTable    = refreshTable;
    vm.draw            = draw;
    vm.download        = download;
    vm.remove          = remove;
    vm.showDetail      = showDetail;
    vm.searchByKeyword = searchByKeyword;

    function download(type) {
      $rootScope.$broadcast('nj-visualization:get-uri', type);
    };

    function toggleSideBar() {
      vm.sidebarHide = !vm.sidebarHide;
    }

    function draw() {
      $timeout(function () { $rootScope.$broadcast('nj-visualization:draw'); });
    }

    function refreshTable() {
      $rootScope.$broadcast('hot-table-container:render', 'visualize-table-data');
    }

    function remove() {
      ApiService.Project.deleteItem(vm.item.id).then(function () {
        ToastService.show({ text: '삭제하였습니다.', type: 'info' });
        UtilService.navigation.path('/');
      });
    }

    function showDetail(data) {
      vm.table_data = data.visualize_data;
      vm.refreshTable();
      vm.metadata = data.metadata;
      vm.sidebarHide = false;
    }

    function searchByKeyword(keyword) {
      $state.go('project-new', {keyword: keyword});
    }

    $(window).unbind('beforeunload');

    // Events
    $scope.$on('nj-visualization:got-uri', function (ev, data) {
      $rootScope.$broadcast('visualize-item:download', data);
    });
  }

})();

(function () {
  'use strict';

  angular
    .module('daisy.controllers')
    .controller('ProjectNewController', ProjectNewController);

  ProjectNewController.$inject = ['$location', '$scope', '$rootScope', 'ApiService', 'AppService', 'AppConstants', 'ToastService', 'UtilService', '$timeout', 'types', '$uibModal', '$stateParams', '$state', '$anchorScroll', 'hotRegisterer', '$window'];

  function ProjectNewController($location, $scope, $rootScope, ApiService, AppService, AppConstants, ToastService, UtilService, $timeout, types, $uibModal, $stateParams, $state, $anchorScroll, hotRegisterer, $window) {
    var vm = this;

    vm.stateParams = $stateParams;

    vm.types             = types || [];
    vm.keyword           = '';
    vm.sidebarHide       = true;
    vm.sidebar_view      = 'choose-method'; // 'data-edit', 'public-list'
    vm.active_tab        = 0;
    vm.viztypeSelected   = vm.types[0];
    vm.viz_success       = false; // 현재 수정 중인 visualize 가 제대로 생성되었는지 여부.
    vm.visualize_arr     = []; // 현재 프로젝트에 속한 모든 시각화 데이터 배열.
    vm.cur_item_key      = -1;
    vm.date_now          = moment().format();
    vm.is_file_upload    = true; // 데이터 - 업로드(true) or 파일 변경(false)
    vm.save_now          = false; // 데이터 세이브

    vm.cur_viz = { // 현재 수정하는 시각화
      data: {
        type: 1,
        visualize_data: null,
        metadata: {},
        origin_data: null
      },
      visualize_type: 1,
      thumbnail: {
        image: ""
      },
      attribute: {},
      matched: false
    };

    vm.match             = [];
    vm.searchPage        = 1;
    vm.isGettingData     = false;
    vm.item = { // 최종 저장할 project item
      title: '',
      user: '',
      description: '',
      visualize: vm.visualize_arr,
      status: 2,
      copyright: '',
    };

    vm.handsontableSettings = {
      autoColumnSize: true,
      colHeaders: true,
      rowHeaders: true,
	  renderAllRows: detectIE() ? true : false,
      manualColumnResize: true,
      outsideClickDeselects: false,
      minCols: 1,
      minRows: 1,
      minSpareCols: 20,
      minSpareRows: 15,
	  columnSorting: true,
	  sortIndicator: true,
	  onAfterInit: function() {
		this.updateSettings({
		  contextMenu: {
	  		items: {
	  		  "row_above": {
	  			name: '위에 1행 삽입',
	  		  },
	  		  "row_below": {
	  			name: '아래에 1행 삽입',
	  		  },
			  "hsep1": "---------",
	  		  "col_left": {
	  			name: '왼쪽에 1열 삽입',
	  		  },
	  		  "col_right": {
	  			name: '오른쪽에 1열 삽입',
	  		  },
			  "hsep2": "---------",
	  		  "remove_row": {
	  			name: '행 삭제',
	  		  },
	  		  "remove_col": {
	  			name: '열 삭제',
	  		  },
			  "hsep3": "---------",
	  		  "undo": {
	  			name: '되돌리기'
	  		  },
	  		  "redo": {
	  			name: '취소하기'
	  		  }
	  		}
		  }
		})
	  },
      onAfterCreateRow: function(index, amount) {
        // console.log('onAfterCreateRow call => index:' + index + ', amount: ' + amount);
      },
      onAfterRemoveRow: function(index, amount) {
        vm.refreshTable();
        vm.draw();
      }
    };

    var constants = {
      types: {
        blank: 'blank',
        boolean: 'boolean',
        categorical: 'categorical',
        date: 'date',
        numeric: 'numeric',
        string: 'string',
        stringAddress: 'string-address'
      }
    };
    [{
        name: '선',
        alias: 'line',
        inputs: {
          types: [
            { type: NJ.Vtr.constants.types.date, count: { eq: 1 }, weight: 2 },
            { type: NJ.Vtr.constants.types.date, count: { eq: 0 }, weight: -1 },
            { type: NJ.Vtr.constants.types.numeric, count: { gte: 1 }, weight: 1 }
          ]
        },
        outputs: {
          header: [
            { key: 'x', isArray: false, type: NJ.Vtr.constants.types.date },
            { key: 'categories', isArray: true, type: NJ.Vtr.constants.types.numeric }
          ]
        }
      },

      {
        name: '비교-선',
        alias: 'line-diff',
        inputs: {
          types: [
            { type: NJ.Vtr.constants.types.date, count: { eq: 1 }, weight: 0 },
            { type: NJ.Vtr.constants.types.date, count: { eq: 0 }, weight: 0 },
            { type: NJ.Vtr.constants.types.numeric, count: { gte: 2 }, weight: 0 }
          ]
        },
        outputs: {
          header: [
            { key: 'x', isArray: false, type: NJ.Vtr.constants.types.date },
            { key: 'comparison', isArray: true, type: NJ.Vtr.constants.types.numeric },
            { key: 'value', isArray: false, type: NJ.Vtr.constants.types.numeric }
          ]
        }
      },

      {
        name: '영역',
        alias: 'area',
        inputs: {
          types: [
            { type: NJ.Vtr.constants.types.date, count: { eq: 1 }, weight: 0 },
            { type: NJ.Vtr.constants.types.date, count: { eq: 0 }, weight: 0 },
            { type: NJ.Vtr.constants.types.numeric, count: { gte: 1 }, weight: 0 }
          ]
        },
        outputs: {
          header: [
            { key: 'x', isArray: false, type: NJ.Vtr.constants.types.date },
            { key: 'categories', isArray: true, type: NJ.Vtr.constants.types.numeric }
          ]
        }
      },

      {
        name: '막대',
        alias: 'bar',
        inputs: {
          types: [
			{ type: NJ.Vtr.constants.types.string, count: { lt: 1 }, weight: -1 },
            { type: NJ.Vtr.constants.types.string, count: { eq: 1 }, weight: 1 },
            { type: NJ.Vtr.constants.types.string, count: { gt: 1 }, weight: 0.5 },
            { type: NJ.Vtr.constants.types.numeric, count: { gte: 1 }, weight: 1 }
          ]
        },
        outputs: {
          header: [
            { key: 'x', isArray: false, type: NJ.Vtr.constants.types.string },
            { key: 'categories', isArray: true, type: NJ.Vtr.constants.types.numeric }
          ]
        }
      },

      {
        name: '평행 좌표',
        alias: 'parallel-coords',
        inputs: {
          types: [
            { type: NJ.Vtr.constants.types.categorical, count: { lt: 1 }, weight: -1 },
            { type: NJ.Vtr.constants.types.categorical, count: { eq: 1 }, weight: 2 },
            { type: NJ.Vtr.constants.types.string, count: { lt: 1 }, weight: -1 },
            { type: NJ.Vtr.constants.types.string, count: { eq: 1 }, weight: 1 },
            { type: NJ.Vtr.constants.types.string, count: { gt: 1 }, weight: 0.5 },
            { type: NJ.Vtr.constants.types.numeric, count: { lt: 1 }, weight: -1 },
            { type: NJ.Vtr.constants.types.numeric, count: { gte: 2 }, weight: 2 }
          ]
        },
        outputs: {
          header: [
            { key: 'group', isArray: false, type: NJ.Vtr.constants.types.categorical },
            { key: 'traits', isArray: true, type: NJ.Vtr.constants.types.numeric }
          ]
        }
      },

	  {
        name: '패러럴 태그클라우드',
        alias: 'parallel-tag-cloud',
        inputs: {
          types: [
            { type: NJ.Vtr.constants.types.categorical, count: { lt: 1 }, weight: 0 },
            { type: NJ.Vtr.constants.types.categorical, count: { eq: 1 }, weight: 0 },
            { type: NJ.Vtr.constants.types.string, count: { lt: 1 }, weight: 0 },
            { type: NJ.Vtr.constants.types.string, count: { eq: 1 }, weight: 0 },
            { type: NJ.Vtr.constants.types.string, count: { gt: 1 }, weight: 0 },
            { type: NJ.Vtr.constants.types.numeric, count: { lt: 1 }, weight: 0 },
            { type: NJ.Vtr.constants.types.numeric, count: { gte: 2 }, weight: 0 }
          ]
        },
        outputs: {
          header: [
            { key: 'group', isArray: false, type: NJ.Vtr.constants.types.categorical },
            { key: 'key', isArray: false, type: NJ.Vtr.constants.types.numeric },
			{ key: 'size', isArray: false, type: NJ.Vtr.constants.types.numeric }

          ]
        }
      },

      {
        name: '파이',
        alias: 'pie',
        inputs: {
          types: [
            { type: NJ.Vtr.constants.types.string, count: { eq: 1 }, weight: 1 },
            { type: NJ.Vtr.constants.types.string, count: { gt: 1 }, weight: 0.5 },
            { type: NJ.Vtr.constants.types.numeric, count: { eq: 1 }, weight: 1 },
            { type: NJ.Vtr.constants.types.numeric, count: { gt: 1 }, weight: 0.25 }
          ]
        },
        outputs: {
          header: [
            { key: 'variable', isArray: false, type: NJ.Vtr.constants.types.string },
            { key: 'value', isArray: false, type: NJ.Vtr.constants.types.numeric }
          ]
        }
      },

      {
        name: '서울 지도',
        alias: 'choropleth-seoul',
        inputs: {
          types: [
            { type: NJ.Vtr.constants.types.stringAddress, count: { eq: 1 }, weight: 1 },
            { type: NJ.Vtr.constants.types.stringAddress, count: { gt: 1 }, weight: 0.75 },
            { type: NJ.Vtr.constants.types.numeric, count: { eq: 1 }, weight: 1 },
            { type: NJ.Vtr.constants.types.numeric, count: { gt: 1 }, weight: 0.5 }
          ]
        },
        outputs: {
          header: [
            { key: 'region', isArray: false, type: NJ.Vtr.constants.types.stringAddress },
            { key: 'value', isArray: false, type: NJ.Vtr.constants.types.numeric }
          ]
        }
      },

      {
        name: '버블 차트',
        alias: 'bubble',
        inputs: {
          types: [
            { type: NJ.Vtr.constants.types.numeric, count: { eq: 1 }, weight: 1 },
            { type: NJ.Vtr.constants.types.numeric, count: { gte: 1 }, weight: 0.5 }
          ],
          hierarchy: [
            { count: { eq: 1 }, weight: 1 },
            { count: { eq: 0 }, weight: -0.75 },
            { count: { gt: 1 }, weight: 1 }
          ],
        },
        outputs: {
          header: [
            { key: 'key', isArray: true, hierarchy: true },
            { key: 'key', isArray: true, type: NJ.Vtr.constants.types.stringAddress },
            { key: 'value', isArray: false, type: NJ.Vtr.constants.types.numeric }
          ]
        }
      },

      {
        name: '트리맵',
        alias: 'treemap',
        inputs: {
          types: [
            { type: NJ.Vtr.constants.types.numeric, count: { eq: 1 }, weight: 0 },
            { type: NJ.Vtr.constants.types.numeric, count: { gte: 1 }, weight: 0 }
          ],
          hierarchy: [
            { count: { eq: 1 }, weight: 0 },
            { count: { eq: 0 }, weight: 0 },
            { count: { gt: 1 }, weight: 0 }
          ],
        },
        outputs: {
          header: [
            { key: 'key', isArray: true, hierarchy: true },
            { key: 'key', isArray: true, type: NJ.Vtr.constants.types.stringAddress },
            { key: 'value', isArray: false, type: NJ.Vtr.constants.types.numeric }
          ]
        }
      },

      {
        name: '원형 트리',
        alias: 'tree-circular',
        inputs: {
          types: [
            { type: NJ.Vtr.constants.types.numeric, count: { eq: 1 }, weight: 0 },
            { type: NJ.Vtr.constants.types.numeric, count: { gte: 1 }, weight: 0 }
          ],
          hierarchy: [
            { count: { eq: 1 }, weight: 0 },
            { count: { eq: 0 }, weight: 0 },
            { count: { gt: 1 }, weight: 0 }
          ],
        },
        outputs: {
          header: [
            { key: 'key', isArray: true, hierarchy: true },
            { key: 'key', isArray: true, type: NJ.Vtr.constants.types.stringAddress },
            { key: 'value', isArray: false, type: NJ.Vtr.constants.types.numeric }
          ]
        }
      },

      {
        name: '위계 막대',
        alias: 'bar-hierarchy',
        inputs: {
          types: [
            { type: NJ.Vtr.constants.types.numeric, count: { eq: 1 }, weight: 0 },
            { type: NJ.Vtr.constants.types.numeric, count: { gte: 1 }, weight: 0 }
          ],
          hierarchy: [
            { count: { eq: 1 }, weight: 0 },
            { count: { eq: 0 }, weight: 0 },
            { count: { gt: 1 }, weight: 0 }
          ],
        },
        outputs: {
          header: [
            { key: 'key', isArray: true, hierarchy: true },
            { key: 'key', isArray: true, type: NJ.Vtr.constants.types.stringAddress },
            { key: 'value', isArray: false, type: NJ.Vtr.constants.types.numeric }
          ]
        }
      },

      {
        name: '스몰 멀티플즈',
        alias: 'small-multiples',
        inputs: {
          types: [
            { type: NJ.Vtr.constants.types.categorical, count: { eq: 0 }, weight: -1 },
            { type: NJ.Vtr.constants.types.categorical, count: { eq: 1 }, weight: 1 },
			{ type: NJ.Vtr.constants.types.categorical, count: { gt: 1 }, weight: 1.5 },
            { type: NJ.Vtr.constants.types.date, count: { eq: 1 }, weight: 1 },
            { type: NJ.Vtr.constants.types.date, count: { eq: 0 }, weight: -1 },
            { type: NJ.Vtr.constants.types.numeric, count: { gte: 1 }, weight: 1 }
          ]
        },
        outputs: {
          header: [
            { key: 'x', isArray: false, type: NJ.Vtr.constants.types.date },
            { key: 'value', isArray: false, type: NJ.Vtr.constants.types.numeric },
            { key: 'group', isArray: false, type: NJ.Vtr.constants.types.categorical }
          ]
        }
      },

      {
        name: '캘린더',
        alias: 'calendar',
        inputs: {
          types: [
            { type: NJ.Vtr.constants.types.date, count: { lt: 1 }, weight: 0 },
            { type: NJ.Vtr.constants.types.date, count: { eq: 1 }, weight: 0 },
            { type: NJ.Vtr.constants.types.date, count: { gt: 1 }, weight: 0 },
            { type: NJ.Vtr.constants.types.numeric, count: { eq: 1 }, weight: 0 },
            { type: NJ.Vtr.constants.types.numeric, count: { eq: 2 }, weight: 0 }
          ]
        },
        outputs: {
          header: [
            { key: 'value', isArray: false, type: NJ.Vtr.constants.types.numeric },
            { key: 'term', isArray: false, type: NJ.Vtr.constants.types.date }
          ]
        }
      },

      {
        name: '히트맵',
        alias: 'heatmap',
        inputs: {
          types: [
            { type: NJ.Vtr.constants.types.numeric, count: { lt: 3 }, weight: 0 },
            { type: NJ.Vtr.constants.types.numeric, count: { gte: 3 }, weight: 0 }
          ]
        },
        outputs: {
          header:[
            { key: 'x', isArray: false, type: NJ.Vtr.constants.types.numeric },
            { key: 'y', isArray: false, type: NJ.Vtr.constants.types.numeric },
            { key: 'value', isArray: false, type: NJ.Vtr.constants.types.numeric }
          ]
        }
      },

      {
        name: '선버스트',
        alias: 'sunburst',
        inputs: {
          types: [
            { type: NJ.Vtr.constants.types.numeric, count: { eq: 1 }, weight: 0 },
            { type: NJ.Vtr.constants.types.numeric, count: { gt: 1 }, weight: 0 }
          ],
          hierarchy: [
            { count: { eq: 1 }, weight: 0 },
            { count: { eq: 0 }, weight: 0 },
            { count: { gt: 1 }, weight: 0 }
          ],
        },
        outputs: {
          header: [
            { key: 'key', isArray: true, hierarchy: true },
            { key: 'value', isArray: false, type: NJ.Vtr.constants.types.numeric }
          ]
        }
      },

      {
        name: '헥사고널 비닝',
        alias: 'hexagonal-binning',
        inputs: {
          types: [
            { type: NJ.Vtr.constants.types.numeric, count: { lt: 2 }, weight: -1 },
            { type: NJ.Vtr.constants.types.numeric, count: { eq: 2 }, weight: 2 },
            { type: NJ.Vtr.constants.types.numeric, count: { gt: 2 }, weight: 0.5 }
          ]
        },
        outputs: {
          header: [
            { key: 'x', isArray: false, type: NJ.Vtr.constants.types.numeric },
            { key: 'y', isArray: false, type: NJ.Vtr.constants.types.numeric }
          ]
        }
      },

      {
        name: '산점도 행렬',
        alias: 'scatterplot-matrix',
        inputs: {
          types: [
			{ type: NJ.Vtr.constants.types.categorical, count: { lt: 1 }, weight: -1 },
			{ type: NJ.Vtr.constants.types.categorical, count: { eq: 1 }, weight: 1 },
			{ type: NJ.Vtr.constants.types.categorical, count: { gt: 1 }, weight: 0.5 },
            { type: NJ.Vtr.constants.types.numeric, count: { lt: 2 }, weight: -0.5 },
            { type: NJ.Vtr.constants.types.numeric, count: { eq: 2 }, weight: 0.75 },
            { type: NJ.Vtr.constants.types.numeric, count: { gte: 2 }, weight: 1 }
          ]
        },
        outputs: {
          header: [
            { key: 'group', isArray: false, type: NJ.Vtr.constants.types.categorical },
            { key: 'traits', isArray: true, type: NJ.Vtr.constants.types.numeric }
          ]
        }
      },

	  {
        name: '산점도',
        alias: 'scatterplot',
        inputs: {
          types: [
			{ type: NJ.Vtr.constants.types.categorical, count: { lt: 1 }, weight: 0 },
			{ type: NJ.Vtr.constants.types.categorical, count: { eq: 1 }, weight: 0 },
			{ type: NJ.Vtr.constants.types.categorical, count: { gt: 1 }, weight: 0 },
            { type: NJ.Vtr.constants.types.numeric, count: { lt: 2 }, weight: 0 },
            { type: NJ.Vtr.constants.types.numeric, count: { eq: 2 }, weight: 0 },
            { type: NJ.Vtr.constants.types.numeric, count: { gte: 2 }, weight: 0 }
          ]
        },
        outputs: {
          header: [
            { key: 'group', isArray: false, type: NJ.Vtr.constants.types.categorical },
            { key: 'x', isArray: false, type: NJ.Vtr.constants.types.numeric },
			{ key: 'y', isArray: false, type: NJ.Vtr.constants.types.numeric },
			{ key: 'radius', isArray: false, type: NJ.Vtr.constants.types.numeric }
          ]
        }
      },

      {
        name: '패러럴 세트',
        alias: 'parallel-sets',
        inputs: {
          types: [
            { type: NJ.Vtr.constants.types.categorical, count: { lt: 2 }, weight: -1 },
            { type: NJ.Vtr.constants.types.categorical, count: { gte: 2 }, weight: 1 }
          ]
        },
        outputs: {
          header: [
            { key: 'dimensions', isArray: true, type: NJ.Vtr.constants.types.categorical },
          ]
        }
      },

      {
        name: '워드클라우드',
        alias: 'wordcloud',
        inputs: {
          types: [
            { type: NJ.Vtr.constants.types.string, count: { lt: 1 }, weight: -1 },
            { type: NJ.Vtr.constants.types.string, count: { eq: 1 }, weight: 3 },
            { type: NJ.Vtr.constants.types.string, count: { gt: 1 }, weight: -1 },
            { type: NJ.Vtr.constants.types.numeric, count: { lt: 1 }, weight: -1 },
            { type: NJ.Vtr.constants.types.numeric, count: { eq: 1 }, weight: 3 },
            { type: NJ.Vtr.constants.types.numeric, count: { gt: 1 }, weight: -1 }
          ]
        },
        outputs: {
          header: [
            { key: 'key', isArray: false, type: NJ.Vtr.constants.types.string },
            { key: 'size', isArray: false, type: NJ.Vtr.constants.types.numeric }
          ]
        }
      }
    ].forEach(function (meta) {
      NJ.Vtr.Match.register(meta);
    });

    // Scope Functions
    vm.vtr                = vtr;
    vm.changeFile         = changeFile;
    vm.uploadFile         = uploadFile;
    vm.refreshTable       = refreshTable;
    vm.save               = save;
    vm.draw               = draw;
    vm.imgDownload        = imgDownload;
    vm.dataDownload       = dataDownload;
    vm.search             = search;
    vm.searchPageChanged  = searchPageChanged;
    vm.loadPublicItems    = loadPublicItems;
    vm.addItemToArr       = addItemToArr;
    vm.changeSidebar      = changeSidebar;
    vm.editItem           = editItem;
    vm.deleteItem         = deleteItem;
    vm.openChartModal     = openChartModal;
    vm.cantSaveModal      = cantSaveModal;
    vm.confirmCancelModal = confirmCancelModal;
    vm.updateThumbnail    = updateThumbnail;
    vm.testFunction       = testFunction;
    vm.selectVizRange     = selectVizRange;
    vm.viztypeHelpModal   = viztypeHelpModal;

    function testFunction() {
      // $location.hash('viz-scroll-id-1');
      // $anchorScroll();
    }

    function selectVizRange() {
      var selected_area = getSelectedCell();
      if (selected_area === null) {
        alert('범위가 설정되지 않았습니다.');
        return;
      }
      vm.cur_viz.data.visualize_data = selected_area;
      var vtr_result = vm.vtr(selected_area);
      if (vtr_result.success) {
        var viz_selected = findViztypeByAlias(vtr_result.match.results[0].alias);
        vm.cur_viz.visualize_type = viz_selected.id;
        vm.model = NJ.Model.findModel(viz_selected.alias);
        vm.cur_viz.attribute = angular.copy(vm.model.properties);
        vm.cur_viz.attribute.header = angular.extend({}, vm.cur_viz.attribute.header, vtr_result.match.header);
        vm.cur_viz.matched = true;

        var borders = document.querySelectorAll('.handsontable .wtBorder');
        for (var i = 0; i < borders.length; i++) {
          borders[i].style.backgroundColor = '#89aff9';
        }
      } else { // 자동 시각화 실패
        var viz_selected = vm.types[0];
        vm.model = NJ.Model.findModel(viz_selected.alias);
        vm.cur_viz.attribute = angular.copy(vm.model.properties);
        vm.cur_viz.matched = false;
        var borders = document.querySelectorAll('.handsontable .wtBorder');
        for (var i = 0; i < borders.length; i++) {
          borders[i].style.backgroundColor = 'red';
        }
      }
    }

    function updateThumbnail() {
      var svg_thumbnail = angular.element(document.getElementsByClassName("NJ-lib-svg"))[0];

      svgAsDataUri(svg_thumbnail, {}, function (uri) {
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');
        var img = document.createElement('img');
        img.id = 'thumbnail';
        img.src = uri;
        img.style.visibility = 'hidden';
        document.body.appendChild(img);

		if (img.complete) {
          canvas.width = img.clientWidth;
          canvas.height = img.clientHeight;
          ctx.drawImage(img, 0, 0);
          document.body.removeChild(img);

          try { uri = canvas.toDataURL('image/png'); } catch (e) { type = 'svg'; }
		}
		vm.item.visualize[0].thumbnail.image = uri;
        return;
      });
    }

    function vtr(visualize_data) {
      // 자동시각화 함수.
      // Output : 성공여부, match 결과
      var table, match, viztype, model;
      table = new NJ.Vtr.Table(visualize_data);
      match = NJ.Vtr.Match.match(table);
      var format = table.columns.filter(function(d) {
        return d.format ? d.format : null;
      });
      format = format.length > 0 ? format[0].format : '';

      if (match.results.length === 0) { // 자동 매칭 실패
        return { success: false, timeFormat: format }
      } else { // 성공
        return { success: true, match: match, timeFormat: format }
      }
    }

    function draw() {
      $timeout(function () { $rootScope.$broadcast('nj-visualization:draw'); });
    }

    function imgDownload(type) {
      $rootScope.$broadcast('nj-visualization:get-uri', type);
    };

    function dataDownload() {
      var text = Papa.unparse(vm.cur_viz.data.visualize_data);
      downloadCSV(vm.cur_viz.data.metadata.title, text);
    }

    function search(keyword) {
      vm.keyword = keyword;

      if (keyword === '') {
        alert('검색어를 입력하세요');
        return;
      }

      vm.isSearching = true;
      ApiService.PublicData.searchByKeyword(vm.keyword, vm.searchPage).then(function (data) {
        vm.changeSidebar('public-list');
        vm.searchResult = data;
      }, function () {
        vm.searchResult = [];
      }).finally(function () {
        vm.isSearching = false;
      });
    }

    function searchPageChanged() {
      ApiService.PublicData.searchByKeyword(vm.keyword, vm.searchPage).then(function (data) {
        vm.changeSidebar('public-list');
        vm.searchResult = data;
      }, function () {
        vm.searchResult = [];
      }).finally(function () {
        vm.isSearching = false;
      });
    }

    function save() {
      if (vm.item.visualize.length === 0) {
        vm.cantSaveModal('저장할 데이터가 없습니다.');
        return;
      }

      if (!vm.item.title) {
        vm.cantSaveModal('프로젝트 이름을 작성해주세요.');
        return;
      }

      if (!vm.item.user) {
        vm.cantSaveModal('제작자 이름을 작성해주세요.');
        return;
      }

      vm.updateThumbnail();
      createOrder();

      ApiService.Project.saveItem(vm.item).then(function (data) {
        ToastService.show({ text: '저장하였습니다.', type: 'info' });
        vm.save_now = true;
        UtilService.navigation.path('/project/' + data.id);
      }, function (error) {
        vm.cantSaveModal('저장할 수 없습니다.');
        return;
      });
    }

    // 공공데이터 로드
    function loadPublicItems(item) {
      vm.isGettingData = true; // 공공데이터 로드 중 표시 기능.
      var vtr_result = {};
      var new_viz = {
        data: {
          type: 1,
          visualize_data: null,
          metadata: {},
          origin_data: null
        },
        visualize_type: 1,
        thumbnail: {
          image: ""
        },
        attribute: {},
        matched: false
      };

      var url = item.data;
      var metadata = {
        'title': item.title,
        'source': item.source,
        'regist_date': item.regist_date,
        'category': item.category,
        'upload_type': 3 // 공공데이터 업로드
      };

      ApiService.PublicData.getItem(url).then(function (data) {
        vm.isGettingData = false;

        if (data.link) {
          // data link 가 있는 경우는 직접 받도록 해야함.
          alert(data.detail);
          $window.open(data.link, '_blank');
          return;
        }

        // 테이블 데이터 및 메타데이터 등록
        new_viz.data.visualize_data = data;
        new_viz.data.origin_data = data;
        new_viz.data.metadata = metadata;

        // 자동시각화
        try { vtr_result = vm.vtr(new_viz.data.visualize_data); } catch (e) { alert('자동시각화 실패'); }

        vtrPostProcess(vtr_result, new_viz);
        vm.addItemToArr(new_viz); // array 에 담기
        scrollToCurViz();
      }, function (error) {
        alert('데이터 담기 실패');
        vm.isGettingData = false;
      });
    }

    function changeFile() {
      vm.is_file_upload = false;
      $rootScope.$broadcast('file-uploader:click', { accept: '.csv, .tsv, .xls, .xlsx, .json' });
    }

    function uploadFile() {
      vm.is_file_upload = true;
      $rootScope.$broadcast('file-uploader:click', { accept: '.csv, .tsv, .xls, .xlsx, .json' });
    }

    function refreshTable() {
      $rootScope.$broadcast('hot-table-container:render', 'visualize-table-data');
    };

    function addItemToArr(item) {
      vm.visualize_arr.push(item);
      vm.cur_viz = item;
    }

    function changeSidebar(viewname) {
      vm.sidebar_view = viewname;
      vm.sidebarHide = false;
      if (viewname === 'data-edit') {
        vm.active_tab = 1;
      } else {
        vm.active_tab = 0;
      }
    }

    function editItem(key) {
      vm.cur_item_key = key;
      vm.cur_viz = vm.item.visualize[key];
      vm.refreshTable();
      vm.changeSidebar('data-edit');
    }

    function deleteItem(key) {
      vm.visualize_arr.splice(key, 1);
      vm.cur_item_key = -1;
      vm.sidebarHide = true;
    }

    // Private functions (controller 안에서만 사용할 함수)
    function downloadCSV(title, text) {
      // TODO: IE9으로 파일을 받을 경우 인코딩이 깨지거나 엑셀에서 이상하게 보여서 해결 필요
      if(detectIE() && detectIE() <= 9) {
        var frame = document.createElement('iframe');
        document.body.appendChild(frame);

        frame.contentWindow.document.open('text/html', 'replace');
        frame.contentWindow.document.write(text);
        frame.contentWindow.document.close();
        frame.contentWindow.focus();
        frame.contentWindow.document.execCommand('SaveAs', true, title + '.csv');

        document.body.removeChild(frame);
      }
      else if(detectIE()) {
        var blob = new Blob( [ '\ufeff' + text ], { type: 'text/csv;charset=utf-8,' } );
        navigator.msSaveOrOpenBlob( blob, title + '.csv' );
      }
      else {
        var encodedUri = encodeURI('data:text/csv;charset=utf-8,' + text);
        var link = document.createElement("a");
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', title + '.csv');
        link.click(); // This will download the data file named "my_data.csv".
        $(link).remove();
      }
    }

    function parseData(data) {
      var keys = Object.keys(data.DESCRIPTION),
          firstRow = keys.map(function (key) { return data.DESCRIPTION[key]; }),
          rows = data.DATA,
          sheet = [firstRow];

      var arrayData = rows.map(function (row) { return keys.map(function (key) { return typeof row[key] === 'undefined' ? '' : String(row[key]); }); });
      return sheet.concat(arrayData);
    }

    function createOrder() {
      for (var i = 0; i < vm.item.visualize.length; i++) {
        vm.item.visualize[i].order = i+1;
      }
    }

    function detectIE() {
      var ua = window.navigator.userAgent;
      var msie = ua.indexOf('MSIE ');
      if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
      }
      var trident = ua.indexOf('Trident/');
      if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
      }
      var edge = ua.indexOf('Edge/');
      if (edge > 0) {
       // Edge (IE 12+) => return version number
       return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
     }
      // other browser
      return false;
    }

    // Modals
    function viztypeHelpModal(viz_id) {
      $uibModal.open({
        templateUrl: 'static/templates/modals/visualize-help.html',
        controller: ['$uibModalInstance', function ($uibModalInstance) {
          var that = this;
          ApiService.Visualize.getTypeByID(viz_id).then(function (data) {
            that.viztype = data;
          }, function () {
            // error
          });
          this.close = function () { $uibModalInstance.dismiss('cancel'); };
        }],
        controllerAs: 'Modal',
        size: 'md',
        windowClass: 'modal-body-scrollable modal-visualize-help'
      }).result.then(function (data) {
        //
      });
    }

    function cantSaveModal(reason) {
      $uibModal.open({
        templateUrl: 'static/templates/modals/cant-save.html',
        controller: ['$uibModalInstance', function ($uibModalInstance) {
          this.reason = reason;
          this.close = function () { $uibModalInstance.dismiss('cancel'); };
          this.ok = function() { $uibModalInstance.dismiss('cancel'); }
        }],
        controllerAs: 'Modal',
        size: 'sm',
        windowClass: 'modal-cantsave'
      }).result.then(function (data) {
        // console.log(data);
      });
    }

    function confirmCancelModal() {
      $uibModal.open({
        templateUrl: 'static/templates/modals/confirm-cancel.html',
        controller: ['$uibModalInstance', function ($uibModalInstance) {
          this.ok = function () {
            vm.save_now = true;
            $state.go('project');
            $uibModalInstance.dismiss('cancel');
          };

          this.cancel = function () {
            $uibModalInstance.dismiss('cancel');
          };

          this.close = function () { $uibModalInstance.dismiss('cancel'); };
        }],
        controllerAs: 'Modal',
        size: 'sm',
        windowClass: 'modal-confirm-cancel'
      }).result.then(function (data) {
        // console.log(data);
      });
    }

    function openChartModal() {
      $uibModal.open({
        templateUrl: 'static/templates/modals/visualize-chart.html',
        controller: ['$uibModalInstance', function ($uibModalInstance) {
          this.list = vm.types;
          this.close = function () { $uibModalInstance.dismiss('cancel'); };
          this.select = function (item) { $uibModalInstance.close(item); };
        }],
        controllerAs: 'Modal',
        size: 'md',
        windowClass: 'modal-body-scrollable modal-visualize-chart'
      }).result.then(function (data) {
        vm.viztypeSelected = data;

        // 헤더 세팅
        var table = new NJ.Vtr.Table(vm.cur_viz.data.visualize_data);
        var header = NJ.Vtr.Match.getByAlias(vm.viztypeSelected.alias).getVisualizationHeader(table);

        // 시각화 변경 적용.
        vm.model = NJ.Model.findModel(vm.viztypeSelected.alias);
        vm.cur_viz.attribute = angular.copy(vm.model.properties);
        vm.cur_viz.attribute.header = angular.extend({}, vm.cur_viz.attribute.header, header);
        vm.cur_viz.visualize_type = vm.viztypeSelected.id;
      });
    }

    /////////////////////////////////////////////////////////////////////////////////
    // Private functions
    function findViztypeByAlias(alias) {
      return $.grep(vm.types, function(e) { return e.alias === alias })[0];
    }

    function scrollToCurViz(scroll_to_idx) {
      var to_Idx = 0;

      if (scroll_to_idx) {
        to_Idx = scroll_to_idx;
      } else {
        to_Idx = vm.visualize_arr.length - 1;
      }

      if (vm.visualize_arr.length > 1) {
        var scroll_id = 'viz-scroll-id-' + to_Idx;
        $location.hash(scroll_id);
        $anchorScroll();
      } else {
        return;
      }
    }

    function getSelectedCell() {
      var instance = hotRegisterer.getInstance('visualize-table-data');
      var sel = instance.getSelected();
      if (sel) {
        return instance.getData(sel[0], sel[1], sel[2], sel[3]);
      } else {
        return null; // selected Cell 이 없음. [] 빈 array 는 어떨지.
      }
    }

    function vtrPostProcess(vtr_result, new_viz) {
      var viz_selected = {};

      if (vtr_result.success) {
        viz_selected = findViztypeByAlias(vtr_result.match.results[0].alias);
        new_viz.visualize_type = viz_selected.id;
        vm.model = NJ.Model.findModel(viz_selected.alias);
        if (vm.model.properties.timeFormat) { vm.model.properties.timeFormat = vtr_result.timeFormat }
        new_viz.attribute = angular.copy(vm.model.properties);
        new_viz.attribute.header = angular.extend({}, new_viz.attribute.header, vtr_result.match.header);
        new_viz.matched = true;
      } else { // 자동 시각화 실패
        viz_selected = vm.types[0];
        vm.model = NJ.Model.findModel(viz_selected.alias);
        if (vm.model.properties.timeFormat) { vm.model.properties.timeFormat = vtr_result.timeFormat }
        new_viz.attribute = angular.copy(vm.model.properties);
        new_viz.matched = false;
      }
      return new_viz;
    }

    function objToArr(src) {
      var header = _.keys(src[0]),
      values = src.map(function(d) {
          return _.values(d);
      });
      values.unshift(header);

      return values;
    }

    // Init condition
    // 메인페이지에서 키워드를 지정하고 들어오는 경우
    if (vm.stateParams.keyword) {
      vm.search(vm.stateParams.keyword);
      vm.changeSidebar('public-list');
      vm.sidebarHide = false;
    }

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options){
      if (fromState.name == 'project-new') {
        if (vm.save_now) {
          return;
        } else {
          confirmCancelModal();
          event.preventDefault();
        }
      }
    })

    $(window).bind('beforeunload', function(e){
      return '아직 저장하지 않은 변경 사항이 있을 수 있습니다.';
    });

    /////////////////////////////////////////////////////////////////////////////////
    // Events & Watch
    $scope.$watch(function () {
      return vm.cur_viz.attribute;
    }, function (newVal, oldVal) {
      if (!newVal)
        return;

      // 데이터 수정 탭인 경우에만 차트를 업데이트한다.
      if (vm.sidebar_view !== 'data-edit')
        return;

      vm.cur_viz.matched = true; // 이부분 고쳐야함. 일단은 matched 된 것으로 가정한다. (TODO)
      vm.draw();
    }, true);

    $scope.$watchCollection('vm.visualize_arr', function(newValue, oldValue) {
      // 데이터가 하나씩 담길 때 마다 새로 visualize 그려준다.
      vm.draw();
    });

    $scope.$on('nj-visualization:drawn', function (ev, isSuccess) {
      if (!isSuccess) {
        ToastService.show({ text: '데이터와 시각화 설정이 맞지 않아 시각화가 생성되지 않을 수 있습니다.', type: 'warning' });
        vm.viz_success = false;
      }
    });

    // 파일 직접 업로드 완료 뒤,
    // 메타데이터 기록 -> 자동시각화 -> attribute 가지고 draw
    $scope.$on('file-uploader:loaded', function (ev, data, filename) {
      var dataType = filename.match(/([^.]*$)/)[0];
      var vtr_result = {};

      var new_viz = {
        data: {
          type: 1,
          visualize_data: null,
          metadata: {},
          origin_data: null
        },
        visualize_type: 1,
        thumbnail: {
          image: ""
        },
        attribute: {},
        matched: false
      };

	  new_viz.data.metadata = {
        title: filename,
        upload_type: 1 // 직접 업로드
	  };
      if (dataType == "xls" || dataType == "xlsx"){
        new_viz.data.visualize_data = data;
        new_viz.data.origin_data = data;
      } else if (dataType == "json") {
        data = objToArr(JSON.parse(data));
        new_viz.data.visualize_data = data;
        new_viz.data.origin_data = data;
      } else {
        new_viz.data.visualize_data = Papa.parse(data, { skipEmptyLines: true }).data;
        new_viz.data.origin_data = Papa.parse(data, { skipEmptyLines: true }).data;
      }

      // 자동시각화
      try { vtr_result = vm.vtr(new_viz.data.visualize_data); } catch (e) {
        alert('자동시각화 실패');
      }
      vtrPostProcess(vtr_result, new_viz);

      if (vm.is_file_upload) {
        vm.addItemToArr(new_viz); // 파일 추가
        scrollToCurViz();
      } else {
        vm.cur_viz = new_viz; // 파일 변경
        vm.visualize_arr[vm.cur_item_key] = new_viz;
        scrollToCurViz(vm.cur_item_key);
      }

      vm.refreshTable();
      $scope.$digest(); // 새로 담긴 visualize 그리기

    });

    $scope.$on('nj-visualization:got-uri', function (ev, data) {
      // 이미지 다운로드
      $rootScope.$broadcast('visualize-item:download', data);
    });
  } // ProjectNewController
})();

(function () {
'use strict';

angular.module('daisy.directives').directive('fileUploader', ['$rootScope', 'ToastService', function ($rootScope, ToastService) {
  return {
    restrict: 'E',
    link: function (scope, elem) {
      var $input;

      elem[0].style.display = 'none';

      scope.$on('file-uploader:click', function (ev, params) {
        elem.html('');

        params = params || {};

        $input = angular.element('<input type="file"' + (params.accept ? (' accept="' + params.accept + '"') : '') + '>');
        $input.on('change', function (ev) {
          if (! ev.target.files[0]) return;

          var file = ev.target.files[0],
              size = file.size,
              dataType = file.name.match(/([^.]*$)/)[0];

          var reader = new FileReader();

          switch (params.readAs) {
            case 'dataURL':
              reader.onload = onLoad;
              reader.readAsDataURL(file);
              break;

            default:
              if (size > 5 * 1048576)
                return ToastService.show({ text: '파일 업로드는 5MB 이하만 가능합니다.', type: 'warning' });

              if (dataType == "xls" || dataType == "xlsx"){
                reader.onload = handleExcelFile;
                reader.readAsArrayBuffer(file);
              } else if(dataType == "json") {
                reader.onload = onReadAsArrayBuffer;
                reader.readAsArrayBuffer(file);
              } else {
                reader.onload = onReadAsArrayBuffer;
                reader.readAsArrayBuffer(file);
              }
              break;
          }

          function onReadAsArrayBuffer(e) {
            var fileSize = Math.min(size, 512),
                str = String.fromCharCode.apply(null, new Uint8Array(reader.result, 0, fileSize)),
                charset = 'euc-kr',
                detect = jschardet.detect(str);
                if (detect.confidence >= 0.7) {
                  charset = jschardet.detect(str).encoding;
                }

            reader.onload = onLoad;
            reader.readAsText(file, charset.toLowerCase());
          }

          function handleExcelFile(e) {
            var data = e.target.result;
            var arr = fixdata(data);
            var workbook, oXLS;

            oXLS = XLSX;

            workbook = oXLS.read(btoa(arr), {type: 'base64'});

            var Sheet1 = workbook.Sheets[workbook.SheetNames[0]];
            data = oXLS.utils.sheet_to_json(Sheet1, {header:1});
            $rootScope.$broadcast('file-uploader:loaded', data, file.name);
          }

          function fixdata(data) {
            var o = "", l = 0, w = 10240;
            for(; l<data.byteLength/w; ++l) o+=String.fromCharCode.apply(null,new Uint8Array(data.slice(l*w,l*w+w)));
            o+=String.fromCharCode.apply(null, new Uint8Array(data.slice(l*w)));
            return o;
          }

          function onLoad() {
            $rootScope.$broadcast('file-uploader:loaded', reader.result, file.name);
          }
        });
        elem.html($input);

        $input.click();
      });
    }
  };
}]);

})();

(function () {

'use strict';

angular.module('daisy.directives').directive('hotTableContainer', ['$compile', '$timeout', '$window', function ($compile, $timeout, $window) {
  return {
    restrict: 'A',
    link: function (scope, elem, attrs) {
      var $elem = angular.element(elem);

      render();
      scope.$on('hot-table-container:render', render);

      var fullHeightSelector = attrs.fullHeightSelector,
          bodyOffsetSelector = attrs.bodyOffsetSelector,
          contentOffsetSelector = attrs.contentOffsetSelector;

      if (fullHeightSelector && bodyOffsetSelector) {
        $window.addEventListener('resize', resize);
        $timeout(resize, 0);
      }

      function render(ev, id) {
        if (ev && id && elem[0].id !== id)
          return;

        $timeout(function () {
          // if ($elem.is(':hidden'))
          //   return;

          var hotTable = '<hot-table ' + ['hotId', 'settings', 'datarows', 'readOnly'].map(function (attr) {
            return attrs[attr] ? attr.replace(/([A-Z])/g, '-$1').toLowerCase() + '="' + attrs[attr] + '"' : '';
          }).join(' ') + '></hot-table>';

          $compile(hotTable)(scope, function (compiled) {
            $elem.html(compiled);
          });
        }, 10);
      }

      function resize() {
        var fullHeight = angular.element(fullHeightSelector).outerHeight(),
            bodyOffset = angular.element(bodyOffsetSelector).outerHeight(),
            contentOffset = contentOffsetSelector.split(',').reduce(function (offset, elem) { offset += angular.element(elem).outerHeight(); return offset; }, 0);

        $elem.height(fullHeight - bodyOffset - contentOffset);
      }
    }
  };
}]);

})();

(function (ng, NJ) {

'use strict';

ng.module('daisy.directives').directive('njVisualization', ['$rootScope', 'AppConstants', function ($rootScope, AppConstants) {
  return {
    restrict: 'E',
    templateNamespace: 'svg',
    scope: { type: '=', properties: '=', data: '=', style: '=' },
    link: function (scope, elem) {
      var defaultStyle = { width: 600, height: 600, margin: { top: 50, right: 50, bottom: 50, left: 50 } };

      scope.$on('nj-visualization:draw', onDraw);
      scope.$on('nj-visualization:get-uri', onGetUri);

      function onDraw() {
        if (! scope.type || ng.equals(scope.data, []) || ng.equals(scope.data, []))
          return $rootScope.$broadcast('nj-visualization:drawn', false);

        $(elem).html('');
        var njv = new NJ.Visualization(elem[0], ng.extend({}, defaultStyle, scope.style));


        var data;
        try {
          var result = [];
          for(var i = 0; i < scope.data.length; i++) {
			for(var j = 0; j < scope.data[i].length; j++) {
               if(typeof scope.data[i][j] === 'string' || scope.data[i][j] instanceof String) {
                 scope.data[i][j] = scope.data[i][j].replace(/,/g,'')
               }
            }
            result.push(scope.data[i])
		  }
          var keys = result[0];
          data = result.slice(1).map(function (val) {
            return keys.reduce(function (obj, key, idx) {
              obj[key] = val[idx];
              return obj;
            }, {});
          });
        } catch (e) {
          return $(elem).html('') && $rootScope.$broadcast('nj-visualization:drawn', false);
        }

        if (scope.type === 'choropleth-seoul')
          scope.properties.geometryUrl = AppConstants.config.staticUrl + 'geometry-seoul.json';

        njv.bindData('raw', data, { dataType: 'json' });
        njv.setModel(scope.type);
        njv.setProperties(scope.properties);

        var isDrawn = true;
        try { njv.render(true); } catch (e) { isDrawn = false; }
        return $rootScope.$broadcast('nj-visualization:drawn', isDrawn);
      }

      function onGetUri(ev, type) {
        return svgAsDataUri(elem[0].getElementsByClassName('NJ-lib-svg')[0], {}, function (uri) {
          if (type === 'svg')
            return $rootScope.$broadcast('nj-visualization:got-uri', { type: type, uri: uri });

          var img = document.createElement('img');
          img.addEventListener('load', function () {
            var canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            document.body.removeChild(img);

            try { uri = canvas.toDataURL('image/png'); } catch (e) { type = 'svg'; }
            return $rootScope.$broadcast('nj-visualization:got-uri', { type: type, uri: uri });
          });

          img.id = 'thumbnail';
          img.src = uri;
          img.style.visibility = 'hidden';
          document.body.appendChild(img);
        });
      }
    }
  };
}]);

})(angular, NJ);

this.j$ = this.jStat = (function(Math, undefined) {

// For quick reference.
var concat = Array.prototype.concat;
var slice = Array.prototype.slice;
var toString = Object.prototype.toString;

// Calculate correction for IEEE error
// TODO: This calculation can be improved.
function calcRdx(n, m) {
  var val = n > m ? n : m;
  return Math.pow(10,
                  17 - ~~(Math.log(((val > 0) ? val : -val)) * Math.LOG10E));
}


var isArray = Array.isArray || function isArray(arg) {
  return toString.call(arg) === '[object Array]';
};


function isFunction(arg) {
  return toString.call(arg) === '[object Function]';
}


function isNumber(arg) {
  return typeof arg === 'number' && arg === arg;
}


// Converts the jStat matrix to vector.
function toVector(arr) {
  return concat.apply([], arr);
}


// The one and only jStat constructor.
function jStat() {
  return new jStat._init(arguments);
}


// TODO: Remove after all references in src files have been removed.
jStat.fn = jStat.prototype;


// By separating the initializer from the constructor it's easier to handle
// always returning a new instance whether "new" was used or not.
jStat._init = function _init(args) {
  var i;

  // If first argument is an array, must be vector or matrix.
  if (isArray(args[0])) {
    // Check if matrix.
    if (isArray(args[0][0])) {
      // See if a mapping function was also passed.
      if (isFunction(args[1]))
        args[0] = jStat.map(args[0], args[1]);
      // Iterate over each is faster than this.push.apply(this, args[0].
      for (i = 0; i < args[0].length; i++)
        this[i] = args[0][i];
      this.length = args[0].length;

    // Otherwise must be a vector.
    } else {
      this[0] = isFunction(args[1]) ? jStat.map(args[0], args[1]) : args[0];
      this.length = 1;
    }

  // If first argument is number, assume creation of sequence.
  } else if (isNumber(args[0])) {
    this[0] = jStat.seq.apply(null, args);
    this.length = 1;

  // Handle case when jStat object is passed to jStat.
  } else if (args[0] instanceof jStat) {
    // Duplicate the object and pass it back.
    return jStat(args[0].toArray());

  // Unexpected argument value, return empty jStat object.
  // TODO: This is strange behavior. Shouldn't this throw or some such to let
  // the user know they had bad arguments?
  } else {
    this[0] = [];
    this.length = 1;
  }

  return this;
};
jStat._init.prototype = jStat.prototype;
jStat._init.constructor = jStat;


// Utility functions.
// TODO: for internal use only?
jStat.utils = {
  calcRdx: calcRdx,
  isArray: isArray,
  isFunction: isFunction,
  isNumber: isNumber,
  toVector: toVector
};


// Easily extend the jStat object.
// TODO: is this seriously necessary?
jStat.extend = function extend(obj) {
  var i, j;

  if (arguments.length === 1) {
    for (j in obj)
      jStat[j] = obj[j];
    return this;
  }

  for (i = 1; i < arguments.length; i++) {
    for (j in arguments[i])
      obj[j] = arguments[i][j];
  }

  return obj;
};


// Returns the number of rows in the matrix.
jStat.rows = function rows(arr) {
  return arr.length || 1;
};


// Returns the number of columns in the matrix.
jStat.cols = function cols(arr) {
  return arr[0].length || 1;
};


// Returns the dimensions of the object { rows: i, cols: j }
jStat.dimensions = function dimensions(arr) {
  return {
    rows: jStat.rows(arr),
    cols: jStat.cols(arr)
  };
};


// Returns a specified row as a vector
jStat.row = function row(arr, index) {
  return arr[index];
};


// Returns the specified column as a vector
jStat.col = function cols(arr, index) {
  var column = new Array(arr.length);
  for (var i = 0; i < arr.length; i++)
    column[i] = [arr[i][index]];
  return column;
};


// Returns the diagonal of the matrix
jStat.diag = function diag(arr) {
  var nrow = jStat.rows(arr);
  var res = new Array(nrow);
  for (var row = 0; row < nrow; row++)
    res[row] = [arr[row][row]];
  return res;
};


// Returns the anti-diagonal of the matrix
jStat.antidiag = function antidiag(arr) {
  var nrow = jStat.rows(arr) - 1;
  var res = new Array(nrow);
  for (var i = 0; nrow >= 0; nrow--, i++)
    res[i] = [arr[i][nrow]];
  return res;
};

// Transpose a matrix or array.
jStat.transpose = function transpose(arr) {
  var obj = [];
  var objArr, rows, cols, j, i;

  // Make sure arr is in matrix format.
  if (!isArray(arr[0]))
    arr = [arr];

  rows = arr.length;
  cols = arr[0].length;

  for (i = 0; i < cols; i++) {
    objArr = new Array(rows);
    for (j = 0; j < rows; j++)
      objArr[j] = arr[j][i];
    obj.push(objArr);
  }

  // If obj is vector, return only single array.
  return obj.length === 1 ? obj[0] : obj;
};


// Map a function to an array or array of arrays.
// "toAlter" is an internal variable.
jStat.map = function map(arr, func, toAlter) {
  var row, nrow, ncol, res, col;

  if (!isArray(arr[0]))
    arr = [arr];

  nrow = arr.length;
  ncol = arr[0].length;
  res = toAlter ? arr : new Array(nrow);

  for (row = 0; row < nrow; row++) {
    // if the row doesn't exist, create it
    if (!res[row])
      res[row] = new Array(ncol);
    for (col = 0; col < ncol; col++)
      res[row][col] = func(arr[row][col], row, col);
  }

  return res.length === 1 ? res[0] : res;
};


// Cumulatively combine the elements of an array or array of arrays using a function.
jStat.cumreduce = function cumreduce(arr, func, toAlter) {
  var row, nrow, ncol, res, col;

  if (!isArray(arr[0]))
    arr = [arr];

  nrow = arr.length;
  ncol = arr[0].length;
  res = toAlter ? arr : new Array(nrow);

  for (row = 0; row < nrow; row++) {
    // if the row doesn't exist, create it
    if (!res[row])
      res[row] = new Array(ncol);
    if (ncol > 0)
      res[row][0] = arr[row][0];
    for (col = 1; col < ncol; col++)
      res[row][col] = func(res[row][col-1], arr[row][col]);
  }
  return res.length === 1 ? res[0] : res;
};


// Destructively alter an array.
jStat.alter = function alter(arr, func) {
  return jStat.map(arr, func, true);
};


// Generate a rows x cols matrix according to the supplied function.
jStat.create = function  create(rows, cols, func) {
  var res = new Array(rows);
  var i, j;

  if (isFunction(cols)) {
    func = cols;
    cols = rows;
  }

  for (i = 0; i < rows; i++) {
    res[i] = new Array(cols);
    for (j = 0; j < cols; j++)
      res[i][j] = func(i, j);
  }

  return res;
};


function retZero() { return 0; }


// Generate a rows x cols matrix of zeros.
jStat.zeros = function zeros(rows, cols) {
  if (!isNumber(cols))
    cols = rows;
  return jStat.create(rows, cols, retZero);
};


function retOne() { return 1; }


// Generate a rows x cols matrix of ones.
jStat.ones = function ones(rows, cols) {
  if (!isNumber(cols))
    cols = rows;
  return jStat.create(rows, cols, retOne);
};


// Generate a rows x cols matrix of uniformly random numbers.
jStat.rand = function rand(rows, cols) {
  if (!isNumber(cols))
    cols = rows;
  return jStat.create(rows, cols, Math.random);
};


function retIdent(i, j) { return i === j ? 1 : 0; }


// Generate an identity matrix of size row x cols.
jStat.identity = function identity(rows, cols) {
  if (!isNumber(cols))
    cols = rows;
  return jStat.create(rows, cols, retIdent);
};


// Tests whether a matrix is symmetric
jStat.symmetric = function symmetric(arr) {
  var issymmetric = true;
  var size = arr.length;
  var row, col;

  if (arr.length !== arr[0].length)
    return false;

  for (row = 0; row < size; row++) {
    for (col = 0; col < size; col++)
      if (arr[col][row] !== arr[row][col])
        return false;
  }

  return true;
};


// Set all values to zero.
jStat.clear = function clear(arr) {
  return jStat.alter(arr, retZero);
};


// Generate sequence.
jStat.seq = function seq(min, max, length, func) {
  if (!isFunction(func))
    func = false;

  var arr = [];
  var hival = calcRdx(min, max);
  var step = (max * hival - min * hival) / ((length - 1) * hival);
  var current = min;
  var cnt;

  // Current is assigned using a technique to compensate for IEEE error.
  // TODO: Needs better implementation.
  for (cnt = 0;
       current <= max;
       cnt++, current = (min * hival + step * hival * cnt) / hival) {
    arr.push((func ? func(current, cnt) : current));
  }

  return arr;
};


// TODO: Go over this entire implementation. Seems a tragic waste of resources
// doing all this work. Instead, and while ugly, use new Function() to generate
// a custom function for each static method.

// Quick reference.
var jProto = jStat.prototype;

// Default length.
jProto.length = 0;

// For internal use only.
// TODO: Check if they're actually used, and if they are then rename them
// to _*
jProto.push = Array.prototype.push;
jProto.sort = Array.prototype.sort;
jProto.splice = Array.prototype.splice;
jProto.slice = Array.prototype.slice;


// Return a clean array.
jProto.toArray = function toArray() {
  return this.length > 1 ? slice.call(this) : slice.call(this)[0];
};


// Map a function to a matrix or vector.
jProto.map = function map(func, toAlter) {
  return jStat(jStat.map(this, func, toAlter));
};


// Cumulatively combine the elements of a matrix or vector using a function.
jProto.cumreduce = function cumreduce(func, toAlter) {
  return jStat(jStat.cumreduce(this, func, toAlter));
};


// Destructively alter an array.
jProto.alter = function alter(func) {
  jStat.alter(this, func);
  return this;
};


// Extend prototype with methods that have no argument.
(function(funcs) {
  for (var i = 0; i < funcs.length; i++) (function(passfunc) {
    jProto[passfunc] = function(func) {
      var self = this,
      results;
      // Check for callback.
      if (func) {
        setTimeout(function() {
          func.call(self, jProto[passfunc].call(self));
        });
        return this;
      }
      results = jStat[passfunc](this);
      return isArray(results) ? jStat(results) : results;
    };
  })(funcs[i]);
})('transpose clear symmetric rows cols dimensions diag antidiag'.split(' '));


// Extend prototype with methods that have one argument.
(function(funcs) {
  for (var i = 0; i < funcs.length; i++) (function(passfunc) {
    jProto[passfunc] = function(index, func) {
      var self = this;
      // check for callback
      if (func) {
        setTimeout(function() {
          func.call(self, jProto[passfunc].call(self, index));
        });
        return this;
      }
      return jStat(jStat[passfunc](this, index));
    };
  })(funcs[i]);
})('row col'.split(' '));


// Extend prototype with simple shortcut methods.
(function(funcs) {
  for (var i = 0; i < funcs.length; i++) (function(passfunc) {
    jProto[passfunc] = new Function(
        'return jStat(jStat.' + passfunc + '.apply(null, arguments));');
  })(funcs[i]);
})('create zeros ones rand identity'.split(' '));


// Exposing jStat.
return jStat;

}(Math));
(function(jStat, Math) {

var isFunction = jStat.utils.isFunction;

// Ascending functions for sort
function ascNum(a, b) { return a - b; }

function clip(arg, min, max) {
  return Math.max(min, Math.min(arg, max));
}


// sum of an array
jStat.sum = function sum(arr) {
  var sum = 0;
  var i = arr.length;
  var tmp;
  while (--i >= 0)
    sum += arr[i];
  return sum;
};


// sum squared
jStat.sumsqrd = function sumsqrd(arr) {
  var sum = 0;
  var i = arr.length;
  while (--i >= 0)
    sum += arr[i] * arr[i];
  return sum;
};


// sum of squared errors of prediction (SSE)
jStat.sumsqerr = function sumsqerr(arr) {
  var mean = jStat.mean(arr);
  var sum = 0;
  var i = arr.length;
  var tmp;
  while (--i >= 0) {
    tmp = arr[i] - mean;
    sum += tmp * tmp;
  }
  return sum;
};


// product of an array
jStat.product = function product(arr) {
  var prod = 1;
  var i = arr.length;
  while (--i >= 0)
    prod *= arr[i];
  return prod;
};


// minimum value of an array
jStat.min = function min(arr) {
  var low = arr[0];
  var i = 0;
  while (++i < arr.length)
    if (arr[i] < low)
      low = arr[i];
  return low;
};


// maximum value of an array
jStat.max = function max(arr) {
  var high = arr[0];
  var i = 0;
  while (++i < arr.length)
    if (arr[i] > high)
      high = arr[i];
  return high;
};


// mean value of an array
jStat.mean = function mean(arr) {
  return jStat.sum(arr) / arr.length;
};


// mean squared error (MSE)
jStat.meansqerr = function meansqerr(arr) {
  return jStat.sumsqerr(arr) / arr.length;
};


// geometric mean of an array
jStat.geomean = function geomean(arr) {
  return Math.pow(jStat.product(arr), 1 / arr.length);
};


// median of an array
jStat.median = function median(arr) {
  var arrlen = arr.length;
  var _arr = arr.slice().sort(ascNum);
  // check if array is even or odd, then return the appropriate
  return !(arrlen & 1)
    ? (_arr[(arrlen / 2) - 1 ] + _arr[(arrlen / 2)]) / 2
    : _arr[(arrlen / 2) | 0 ];
};


// cumulative sum of an array
jStat.cumsum = function cumsum(arr) {
  return jStat.cumreduce(arr, function (a, b) { return a + b; });
};


// cumulative product of an array
jStat.cumprod = function cumprod(arr) {
  return jStat.cumreduce(arr, function (a, b) { return a * b; });
};


// successive differences of a sequence
jStat.diff = function diff(arr) {
  var diffs = [];
  var arrLen = arr.length;
  var i;
  for (i = 1; i < arrLen; i++)
    diffs.push(arr[i] - arr[i - 1]);
  return diffs;
};


// mode of an array
// if there are multiple modes of an array, return all of them
// is this the appropriate way of handling it?
jStat.mode = function mode(arr) {
  var arrLen = arr.length;
  var _arr = arr.slice().sort(ascNum);
  var count = 1;
  var maxCount = 0;
  var numMaxCount = 0;
  var mode_arr = [];
  var i;

  for (i = 0; i < arrLen; i++) {
    if (_arr[i] === _arr[i + 1]) {
      count++;
    } else {
      if (count > maxCount) {
        mode_arr = [_arr[i]];
        maxCount = count;
        numMaxCount = 0;
      }
      // are there multiple max counts
      else if (count === maxCount) {
        mode_arr.push(_arr[i]);
        numMaxCount++;
      }
      // resetting count for new value in array
      count = 1;
    }
  }

  return numMaxCount === 0 ? mode_arr[0] : mode_arr;
};


// range of an array
jStat.range = function range(arr) {
  return jStat.max(arr) - jStat.min(arr);
};

// variance of an array
// flag = true indicates sample instead of population
jStat.variance = function variance(arr, flag) {
  return jStat.sumsqerr(arr) / (arr.length - (flag ? 1 : 0));
};


// standard deviation of an array
// flag = true indicates sample instead of population
jStat.stdev = function stdev(arr, flag) {
  return Math.sqrt(jStat.variance(arr, flag));
};


// mean deviation (mean absolute deviation) of an array
jStat.meandev = function meandev(arr) {
  var devSum = 0;
  var mean = jStat.mean(arr);
  var i;
  for (i = arr.length - 1; i >= 0; i--)
    devSum += Math.abs(arr[i] - mean);
  return devSum / arr.length;
};


// median deviation (median absolute deviation) of an array
jStat.meddev = function meddev(arr) {
  var devSum = 0;
  var median = jStat.median(arr);
  var i;
  for (i = arr.length - 1; i >= 0; i--)
    devSum += Math.abs(arr[i] - median);
  return devSum / arr.length;
};


// coefficient of variation
jStat.coeffvar = function coeffvar(arr) {
  return jStat.stdev(arr) / jStat.mean(arr);
};


// quartiles of an array
jStat.quartiles = function quartiles(arr) {
  var arrlen = arr.length;
  var _arr = arr.slice().sort(ascNum);
  return [
    _arr[ Math.round((arrlen) / 4) - 1 ],
    _arr[ Math.round((arrlen) / 2) - 1 ],
    _arr[ Math.round((arrlen) * 3 / 4) - 1 ]
  ];
};


// Arbitary quantiles of an array. Direct port of the scipy.stats
// implementation by Pierre GF Gerard-Marchant.
jStat.quantiles = function quantiles(arr, quantilesArray, alphap, betap) {
  var sortedArray = arr.slice().sort(ascNum);
  var quantileVals = [quantilesArray.length];
  var n = arr.length;
  var i, p, m, aleph, k, gamma;

  if (typeof alphap === 'undefined')
    alphap = 3 / 8;
  if (typeof betap === 'undefined')
    betap = 3 / 8;

  for (i = 0; i < quantilesArray.length; i++) {
    p = quantilesArray[i];
    m = alphap + p * (1 - alphap - betap);
    aleph = n * p + m;
    k = Math.floor(clip(aleph, 1, n - 1));
    gamma = clip(aleph - k, 0, 1);
    quantileVals[i] = (1 - gamma) * sortedArray[k - 1] + gamma * sortedArray[k];
  }

  return quantileVals;
};


// The percentile rank of score in a given array. Returns the percentage
// of all values in the input array that are less than (kind='strict') or
// less or equal than (kind='weak') score. Default is weak.
jStat.percentileOfScore = function percentileOfScore(arr, score, kind) {
  var counter = 0;
  var len = arr.length;
  var strict = false;
  var value, i;

  if (kind === 'strict')
    strict = true;

  for (i = 0; i < len; i++) {
    value = arr[i];
    if ((strict && value < score) ||
        (!strict && value <= score)) {
      counter++;
    }
  }

  return counter / len;
};


// Histogram (bin count) data
jStat.histogram = function histogram(arr, bins) {
  var first = jStat.min(arr);
  var binCnt = bins || 4;
  var binWidth = (jStat.max(arr) - first) / binCnt;
  var len = arr.length;
  var bins = [];
  var i;

  for (i = 0; i < binCnt; i++)
    bins[i] = 0;
  for (i = 0; i < len; i++)
    bins[Math.min(Math.floor(((arr[i] - first) / binWidth)), binCnt - 1)] += 1;

  return bins;
};


// covariance of two arrays
jStat.covariance = function covariance(arr1, arr2) {
  var u = jStat.mean(arr1);
  var v = jStat.mean(arr2);
  var arr1Len = arr1.length;
  var sq_dev = new Array(arr1Len);
  var i;

  for (i = 0; i < arr1Len; i++)
    sq_dev[i] = (arr1[i] - u) * (arr2[i] - v);

  return jStat.sum(sq_dev) / (arr1Len - 1);
};


// (pearson's) population correlation coefficient, rho
jStat.corrcoeff = function corrcoeff(arr1, arr2) {
  return jStat.covariance(arr1, arr2) /
      jStat.stdev(arr1, 1) /
      jStat.stdev(arr2, 1);
};

// statistical standardized moments (general form of skew/kurt)
jStat.stanMoment = function stanMoment(arr, n) {
  var mu = jStat.mean(arr);
  var sigma = jStat.stdev(arr);
  var len = arr.length;
  var skewSum = 0;

  for (i = 0; i < len; i++)
    skewSum += Math.pow((arr[i] - mu) / sigma, n);

  return skewSum / arr.length;
};

// (pearson's) moment coefficient of skewness
jStat.skewness = function skewness(arr) {
  return jStat.stanMoment(arr, 3);
};

// (pearson's) (excess) kurtosis
jStat.kurtosis = function kurtosis(arr) {
  return jStat.stanMoment(arr, 4) - 3;
};


var jProto = jStat.prototype;


// Extend jProto with method for calculating cumulative sums and products.
// This differs from the similar extension below as cumsum and cumprod should
// not be run again in the case fullbool === true.
// If a matrix is passed, automatically assume operation should be done on the
// columns.
(function(funcs) {
  for (var i = 0; i < funcs.length; i++) (function(passfunc) {
    // If a matrix is passed, automatically assume operation should be done on
    // the columns.
    jProto[passfunc] = function(fullbool, func) {
      var arr = [];
      var i = 0;
      var tmpthis = this;
      // Assignment reassignation depending on how parameters were passed in.
      if (isFunction(fullbool)) {
        func = fullbool;
        fullbool = false;
      }
      // Check if a callback was passed with the function.
      if (func) {
        setTimeout(function() {
          func.call(tmpthis, jProto[passfunc].call(tmpthis, fullbool));
        });
        return this;
      }
      // Check if matrix and run calculations.
      if (this.length > 1) {
        tmpthis = fullbool === true ? this : this.transpose();
        for (; i < tmpthis.length; i++)
          arr[i] = jStat[passfunc](tmpthis[i]);
        return arr;
      }
      // Pass fullbool if only vector, not a matrix. for variance and stdev.
      return jStat[passfunc](this[0], fullbool);
    };
  })(funcs[i]);
})(('cumsum cumprod').split(' '));


// Extend jProto with methods which don't require arguments and work on columns.
(function(funcs) {
  for (var i = 0; i < funcs.length; i++) (function(passfunc) {
    // If a matrix is passed, automatically assume operation should be done on
    // the columns.
    jProto[passfunc] = function(fullbool, func) {
      var arr = [];
      var i = 0;
      var tmpthis = this;
      // Assignment reassignation depending on how parameters were passed in.
      if (isFunction(fullbool)) {
        func = fullbool;
        fullbool = false;
      }
      // Check if a callback was passed with the function.
      if (func) {
        setTimeout(function() {
          func.call(tmpthis, jProto[passfunc].call(tmpthis, fullbool));
        });
        return this;
      }
      // Check if matrix and run calculations.
      if (this.length > 1) {
        tmpthis = fullbool === true ? this : this.transpose();
        for (; i < tmpthis.length; i++)
          arr[i] = jStat[passfunc](tmpthis[i]);
        return fullbool === true
            ? jStat[passfunc](jStat.utils.toVector(arr))
            : arr;
      }
      // Pass fullbool if only vector, not a matrix. for variance and stdev.
      return jStat[passfunc](this[0], fullbool);
    };
  })(funcs[i]);
})(('sum sumsqrd sumsqerr product min max mean meansqerr geomean median diff ' +
    'mode range variance stdev meandev meddev coeffvar quartiles histogram ' +
    'skewness kurtosis').split(' '));


// Extend jProto with functions that take arguments. Operations on matrices are
// done on columns.
(function(funcs) {
  for (var i = 0; i < funcs.length; i++) (function(passfunc) {
    jProto[passfunc] = function() {
      var arr = [];
      var i = 0;
      var tmpthis = this;
      var args = Array.prototype.slice.call(arguments);

      // If the last argument is a function, we assume it's a callback; we
      // strip the callback out and call the function again.
      if (isFunction(args[args.length - 1])) {
        var callbackFunction = args[args.length - 1];
        var argsToPass = args.slice(0, args.length - 1);

        setTimeout(function() {
          callbackFunction.call(tmpthis,
                                jProto[passfunc].apply(tmpthis, argsToPass));
        });
        return this;

      // Otherwise we curry the function args and call normally.
      } else {
        var callbackFunction = undefined;
        var curriedFunction = function curriedFunction(vector) {
          return jStat[passfunc].apply(tmpthis, [vector].concat(args));
        }
      }

      // If this is a matrix, run column-by-column.
      if (this.length > 1) {
        tmpthis = tmpthis.transpose();
        for (; i < tmpthis.length; i++)
          arr[i] = curriedFunction(tmpthis[i]);
        return arr;
      }

      // Otherwise run on the vector.
      return curriedFunction(this[0]);
    };
  })(funcs[i]);
})('quantiles percentileOfScore'.split(' '));

}(this.jStat, Math));
// Special functions //
(function(jStat, Math) {

// Log-gamma function
jStat.gammaln = function gammaln(x) {
  var j = 0;
  var cof = [
    76.18009172947146, -86.50532032941677, 24.01409824083091,
    -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5
  ];
  var ser = 1.000000000190015;
  var xx, y, tmp;
  tmp = (y = xx = x) + 5.5;
  tmp -= (xx + 0.5) * Math.log(tmp);
  for (; j < 6; j++)
    ser += cof[j] / ++y;
  return Math.log(2.5066282746310005 * ser / xx) - tmp;
};


// gamma of x
jStat.gammafn = function gammafn(x) {
  var p = [-1.716185138865495, 24.76565080557592, -379.80425647094563,
           629.3311553128184, 866.9662027904133, -31451.272968848367,
           -36144.413418691176, 66456.14382024054
  ];
  var q = [-30.8402300119739, 315.35062697960416, -1015.1563674902192,
           -3107.771671572311, 22538.118420980151, 4755.8462775278811,
           -134659.9598649693, -115132.2596755535];
  var fact = false;
  var n = 0;
  var xden = 0;
  var xnum = 0;
  var y = x;
  var i, z, yi, res, sum, ysq;
  if (y <= 0) {
    res = y % 1 + 3.6e-16;
    if (res) {
      fact = (!(y & 1) ? 1 : -1) * Math.PI / Math.sin(Math.PI * res);
      y = 1 - y;
    } else {
      return Infinity;
    }
  }
  yi = y;
  if (y < 1) {
    z = y++;
  } else {
    z = (y -= n = (y | 0) - 1) - 1;
  }
  for (i = 0; i < 8; ++i) {
    xnum = (xnum + p[i]) * z;
    xden = xden * z + q[i];
  }
  res = xnum / xden + 1;
  if (yi < y) {
    res /= yi;
  } else if (yi > y) {
    for (i = 0; i < n; ++i) {
      res *= y;
      y++;
    }
  }
  if (fact) {
    res = fact / res;
  }
  return res;
};


// lower incomplete gamma function, which is usually typeset with a
// lower-case greek gamma as the function symbol
jStat.gammap = function gammap(a, x) {
  return jStat.lowRegGamma(a, x) * jStat.gammafn(a);
};


// The lower regularized incomplete gamma function, usually written P(a,x)
jStat.lowRegGamma = function lowRegGamma(a, x) {
  var aln = jStat.gammaln(a);
  var ap = a;
  var sum = 1 / a;
  var del = sum;
  var b = x + 1 - a;
  var c = 1 / 1.0e-30;
  var d = 1 / b;
  var h = d;
  var i = 1;
  // calculate maximum number of itterations required for a
  var ITMAX = -~(Math.log((a >= 1) ? a : 1 / a) * 8.5 + a * 0.4 + 17);
  var an, endval;

  if (x < 0 || a <= 0) {
    return NaN;
  } else if (x < a + 1) {
    for (; i <= ITMAX; i++) {
      sum += del *= x / ++ap;
    }
    return (sum * Math.exp(-x + a * Math.log(x) - (aln)));
  }

  for (; i <= ITMAX; i++) {
    an = -i * (i - a);
    b += 2;
    d = an * d + b;
    c = b + an / c;
    d = 1 / d;
    h *= d * c;
  }

  return (1 - h * Math.exp(-x + a * Math.log(x) - (aln)));
};

// natural log factorial of n
jStat.factorialln = function factorialln(n) {
  return n < 0 ? NaN : jStat.gammaln(n + 1);
};

// factorial of n
jStat.factorial = function factorial(n) {
  return n < 0 ? NaN : jStat.gammafn(n + 1);
};

// combinations of n, m
jStat.combination = function combination(n, m) {
  // make sure n or m don't exceed the upper limit of usable values
  return (n > 170 || m > 170)
      ? Math.exp(jStat.combinationln(n, m))
      : (jStat.factorial(n) / jStat.factorial(m)) / jStat.factorial(n - m);
};


jStat.combinationln = function combinationln(n, m){
  return jStat.factorialln(n) - jStat.factorialln(m) - jStat.factorialln(n - m);
};


// permutations of n, m
jStat.permutation = function permutation(n, m) {
  return jStat.factorial(n) / jStat.factorial(n - m);
};


// beta function
jStat.betafn = function betafn(x, y) {
  // ensure arguments are positive
  if (x <= 0 || y <= 0)
    return undefined;
  // make sure x + y doesn't exceed the upper limit of usable values
  return (x + y > 170)
      ? Math.exp(jStat.betaln(x, y))
      : jStat.gammafn(x) * jStat.gammafn(y) / jStat.gammafn(x + y);
};


// natural logarithm of beta function
jStat.betaln = function betaln(x, y) {
  return jStat.gammaln(x) + jStat.gammaln(y) - jStat.gammaln(x + y);
};


// Evaluates the continued fraction for incomplete beta function by modified
// Lentz's method.
jStat.betacf = function betacf(x, a, b) {
  var fpmin = 1e-30;
  var m = 1;
  var qab = a + b;
  var qap = a + 1;
  var qam = a - 1;
  var c = 1;
  var d = 1 - qab * x / qap;
  var m2, aa, del, h;

  // These q's will be used in factors that occur in the coefficients
  if (Math.abs(d) < fpmin)
    d = fpmin;
  d = 1 / d;
  h = d;

  for (; m <= 100; m++) {
    m2 = 2 * m;
    aa = m * (b - m) * x / ((qam + m2) * (a + m2));
    // One step (the even one) of the recurrence
    d = 1 + aa * d;
    if (Math.abs(d) < fpmin)
      d = fpmin;
    c = 1 + aa / c;
    if (Math.abs(c) < fpmin)
      c = fpmin;
    d = 1 / d;
    h *= d * c;
    aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
    // Next step of the recurrence (the odd one)
    d = 1 + aa * d;
    if (Math.abs(d) < fpmin)
      d = fpmin;
    c = 1 + aa / c;
    if (Math.abs(c) < fpmin)
      c = fpmin;
    d = 1 / d;
    del = d * c;
    h *= del;
    if (Math.abs(del - 1.0) < 3e-7)
      break;
  }

  return h;
};


// Returns the inverse of the lower regularized inomplete gamma function
jStat.gammapinv = function gammapinv(p, a) {
  var j = 0;
  var a1 = a - 1;
  var EPS = 1e-8;
  var gln = jStat.gammaln(a);
  var x, err, t, u, pp, lna1, afac;

  if (p >= 1)
    return Math.max(100, a + 100 * Math.sqrt(a));
  if (p <= 0)
    return 0;
  if (a > 1) {
    lna1 = Math.log(a1);
    afac = Math.exp(a1 * (lna1 - 1) - gln);
    pp = (p < 0.5) ? p : 1 - p;
    t = Math.sqrt(-2 * Math.log(pp));
    x = (2.30753 + t * 0.27061) / (1 + t * (0.99229 + t * 0.04481)) - t;
    if (p < 0.5)
      x = -x;
    x = Math.max(1e-3,
                 a * Math.pow(1 - 1 / (9 * a) - x / (3 * Math.sqrt(a)), 3));
  } else {
    t = 1 - a * (0.253 + a * 0.12);
    if (p < t)
      x = Math.pow(p / t, 1 / a);
    else
      x = 1 - Math.log(1 - (p - t) / (1 - t));
  }

  for(; j < 12; j++) {
    if (x <= 0)
      return 0;
    err = jStat.lowRegGamma(a, x) - p;
    if (a > 1)
      t = afac * Math.exp(-(x - a1) + a1 * (Math.log(x) - lna1));
    else
      t = Math.exp(-x + a1 * Math.log(x) - gln);
    u = err / t;
    x -= (t = u / (1 - 0.5 * Math.min(1, u * ((a - 1) / x - 1))));
    if (x <= 0)
      x = 0.5 * (x + t);
    if (Math.abs(t) < EPS * x)
      break;
  }

  return x;
};


// Returns the error function erf(x)
jStat.erf = function erf(x) {
  var cof = [-1.3026537197817094, 6.4196979235649026e-1, 1.9476473204185836e-2,
             -9.561514786808631e-3, -9.46595344482036e-4, 3.66839497852761e-4,
             4.2523324806907e-5, -2.0278578112534e-5, -1.624290004647e-6,
             1.303655835580e-6, 1.5626441722e-8, -8.5238095915e-8,
             6.529054439e-9, 5.059343495e-9, -9.91364156e-10,
             -2.27365122e-10, 9.6467911e-11, 2.394038e-12,
             -6.886027e-12, 8.94487e-13, 3.13092e-13,
             -1.12708e-13, 3.81e-16, 7.106e-15,
             -1.523e-15, -9.4e-17, 1.21e-16,
             -2.8e-17];
  var j = cof.length - 1;
  var isneg = false;
  var d = 0;
  var dd = 0;
  var t, ty, tmp, res;

  if (x < 0) {
    x = -x;
    isneg = true;
  }

  t = 2 / (2 + x);
  ty = 4 * t - 2;

  for(; j > 0; j--) {
    tmp = d;
    d = ty * d - dd + cof[j];
    dd = tmp;
  }

  res = t * Math.exp(-x * x + 0.5 * (cof[0] + ty * d) - dd);
  return isneg ? res - 1 : 1 - res;
};


// Returns the complmentary error function erfc(x)
jStat.erfc = function erfc(x) {
  return 1 - jStat.erf(x);
};


// Returns the inverse of the complementary error function
jStat.erfcinv = function erfcinv(p) {
  var j = 0;
  var x, err, t, pp;
  if (p >= 2)
    return -100;
  if (p <= 0)
    return 100;
  pp = (p < 1) ? p : 2 - p;
  t = Math.sqrt(-2 * Math.log(pp / 2));
  x = -0.70711 * ((2.30753 + t * 0.27061) /
                  (1 + t * (0.99229 + t * 0.04481)) - t);
  for (; j < 2; j++) {
    err = jStat.erfc(x) - pp;
    x += err / (1.12837916709551257 * Math.exp(-x * x) - x * err);
  }
  return (p < 1) ? x : -x;
};


// Returns the inverse of the incomplete beta function
jStat.ibetainv = function ibetainv(p, a, b) {
  var EPS = 1e-8;
  var a1 = a - 1;
  var b1 = b - 1;
  var j = 0;
  var lna, lnb, pp, t, u, err, x, al, h, w, afac;
  if (p <= 0)
    return 0;
  if (p >= 1)
    return 1;
  if (a >= 1 && b >= 1) {
    pp = (p < 0.5) ? p : 1 - p;
    t = Math.sqrt(-2 * Math.log(pp));
    x = (2.30753 + t * 0.27061) / (1 + t* (0.99229 + t * 0.04481)) - t;
    if (p < 0.5)
      x = -x;
    al = (x * x - 3) / 6;
    h = 2 / (1 / (2 * a - 1)  + 1 / (2 * b - 1));
    w = (x * Math.sqrt(al + h) / h) - (1 / (2 * b - 1) - 1 / (2 * a - 1)) *
        (al + 5 / 6 - 2 / (3 * h));
    x = a / (a + b * Math.exp(2 * w));
  } else {
    lna = Math.log(a / (a + b));
    lnb = Math.log(b / (a + b));
    t = Math.exp(a * lna) / a;
    u = Math.exp(b * lnb) / b;
    w = t + u;
    if (p < t / w)
      x = Math.pow(a * w * p, 1 / a);
    else
      x = 1 - Math.pow(b * w * (1 - p), 1 / b);
  }
  afac = -jStat.gammaln(a) - jStat.gammaln(b) + jStat.gammaln(a + b);
  for(; j < 10; j++) {
    if (x === 0 || x === 1)
      return x;
    err = jStat.ibeta(x, a, b) - p;
    t = Math.exp(a1 * Math.log(x) + b1 * Math.log(1 - x) + afac);
    u = err / t;
    x -= (t = u / (1 - 0.5 * Math.min(1, u * (a1 / x - b1 / (1 - x)))));
    if (x <= 0)
      x = 0.5 * (x + t);
    if (x >= 1)
      x = 0.5 * (x + t + 1);
    if (Math.abs(t) < EPS * x && j > 0)
      break;
  }
  return x;
};


// Returns the incomplete beta function I_x(a,b)
jStat.ibeta = function ibeta(x, a, b) {
  // Factors in front of the continued fraction.
  var bt = (x === 0 || x === 1) ?  0 :
    Math.exp(jStat.gammaln(a + b) - jStat.gammaln(a) -
             jStat.gammaln(b) + a * Math.log(x) + b *
             Math.log(1 - x));
  if (x < 0 || x > 1)
    return false;
  if (x < (a + 1) / (a + b + 2))
    // Use continued fraction directly.
    return bt * jStat.betacf(x, a, b) / a;
  // else use continued fraction after making the symmetry transformation.
  return 1 - bt * jStat.betacf(1 - x, b, a) / b;
};


// Returns a normal deviate (mu=0, sigma=1).
// If n and m are specified it returns a object of normal deviates.
jStat.randn = function randn(n, m) {
  var u, v, x, y, q, mat;
  if (!m)
    m = n;
  if (n)
    return jStat.create(n, m, function() { return jStat.randn(); });
  do {
    u = Math.random();
    v = 1.7156 * (Math.random() - 0.5);
    x = u - 0.449871;
    y = Math.abs(v) + 0.386595;
    q = x * x + y * (0.19600 * y - 0.25472 * x);
  } while (q > 0.27597 && (q > 0.27846 || v * v > -4 * Math.log(u) * u * u));
  return v / u;
};


// Returns a gamma deviate by the method of Marsaglia and Tsang.
jStat.randg = function randg(shape, n, m) {
  var oalph = shape;
  var a1, a2, u, v, x, mat;
  if (!m)
    m = n;
  if (!shape)
    shape = 1;
  if (n) {
    mat = jStat.zeros(n,m);
    mat.alter(function() { return jStat.randg(shape); });
    return mat;
  }
  if (shape < 1)
    shape += 1;
  a1 = shape - 1 / 3;
  a2 = 1 / Math.sqrt(9 * a1);
  do {
    do {
      x = jStat.randn();
      v = 1 + a2 * x;
    } while(v <= 0);
    v = v * v * v;
    u = Math.random();
  } while(u > 1 - 0.331 * Math.pow(x, 4) &&
          Math.log(u) > 0.5 * x*x + a1 * (1 - v + Math.log(v)));
  // alpha > 1
  if (shape == oalph)
    return a1 * v;
  // alpha < 1
  do {
    u = Math.random();
  } while(u === 0);
  return Math.pow(u, 1 / oalph) * a1 * v;
};


// making use of static methods on the instance
(function(funcs) {
  for (var i = 0; i < funcs.length; i++) (function(passfunc) {
    jStat.fn[passfunc] = function() {
      return jStat(
          jStat.map(this, function(value) { return jStat[passfunc](value); }));
    }
  })(funcs[i]);
})('gammaln gammafn factorial factorialln'.split(' '));


(function(funcs) {
  for (var i = 0; i < funcs.length; i++) (function(passfunc) {
    jStat.fn[passfunc] = function() {
      return jStat(jStat[passfunc].apply(null, arguments));
    };
  })(funcs[i]);
})('randn'.split(' '));

}(this.jStat, Math));
(function(jStat, Math) {

// generate all distribution instance methods
(function(list) {
  for (var i = 0; i < list.length; i++) (function(func) {
    // distribution instance method
    jStat[func] = function(a, b, c) {
      if (!(this instanceof arguments.callee))
        return new arguments.callee(a, b, c);
      this._a = a;
      this._b = b;
      this._c = c;
      return this;
    };
    // distribution method to be used on a jStat instance
    jStat.fn[func] = function(a, b, c) {
      var newthis = jStat[func](a, b, c);
      newthis.data = this;
      return newthis;
    };
    // sample instance method
    jStat[func].prototype.sample = function(arr) {
      var a = this._a;
      var b = this._b;
      var c = this._c;
      if (arr)
        return jStat.alter(arr, function() {
          return jStat[func].sample(a, b, c);
        });
      else
        return jStat[func].sample(a, b, c);
    };
    // generate the pdf, cdf and inv instance methods
    (function(vals) {
      for (var i = 0; i < vals.length; i++) (function(fnfunc) {
        jStat[func].prototype[fnfunc] = function(x) {
          var a = this._a;
          var b = this._b;
          var c = this._c;
          if (!x && x !== 0)
            x = this.data;
          if (typeof x !== 'number') {
            return jStat.fn.map.call(x, function(x) {
              return jStat[func][fnfunc](x, a, b, c);
            });
          }
          return jStat[func][fnfunc](x, a, b, c);
        };
      })(vals[i]);
    })('pdf cdf inv'.split(' '));
    // generate the mean, median, mode and variance instance methods
    (function(vals) {
      for (var i = 0; i < vals.length; i++) (function(fnfunc) {
        jStat[func].prototype[fnfunc] = function() {
          return jStat[func][fnfunc](this._a, this._b, this._c);
        };
      })(vals[i]);
    })('mean median mode variance'.split(' '));
  })(list[i]);
})((
  'beta centralF cauchy chisquare exponential gamma invgamma kumaraswamy ' +
  'lognormal noncentralt normal pareto studentt weibull uniform  binomial ' +
  'negbin hypgeom poisson triangular'
).split(' '));



// extend beta function with static methods
jStat.extend(jStat.beta, {
  pdf: function pdf(x, alpha, beta) {
    // PDF is zero outside the support
    if (x > 1 || x < 0)
      return 0;
    // PDF is one for the uniform case
    if (alpha == 1 && beta == 1)
      return 1;

    if (alpha < 512 || beta < 512) {
      return (Math.pow(x, alpha - 1) * Math.pow(1 - x, beta - 1)) /
          jStat.betafn(alpha, beta);
    } else {
      return Math.exp((alpha - 1) * Math.log(x) +
                      (beta - 1) * Math.log(1 - x) -
                      jStat.betaln(alpha, beta));
    }
  },

  cdf: function cdf(x, alpha, beta) {
    return (x > 1 || x < 0) ? (x > 1) * 1 : jStat.ibeta(x, alpha, beta);
  },

  inv: function inv(x, alpha, beta) {
    return jStat.ibetainv(x, alpha, beta);
  },

  mean: function mean(alpha, beta) {
    return alpha / (alpha + beta);
  },

  median: function median(alpha, beta) {
    throw new Error('median not yet implemented');
  },

  mode: function mode(alpha, beta) {
    return (alpha - 1 ) / ( alpha + beta - 2);
  },

  // return a random sample
  sample: function sample(alpha, beta) {
    var u = jStat.randg(alpha);
    return u / (u + jStat.randg(beta));
  },

  variance: function variance(alpha, beta) {
    return (alpha * beta) / (Math.pow(alpha + beta, 2) * (alpha + beta + 1));
  }
});

// extend F function with static methods
jStat.extend(jStat.centralF, {
  // This implementation of the pdf function avoids float overflow
  // See the way that R calculates this value:
  // https://svn.r-project.org/R/trunk/src/nmath/df.c
  pdf: function pdf(x, df1, df2) {
    var p, q, f;

    if (x < 0)
      return undefined;

    if (df1 <= 2) {
      if (df1 === 1 && df2 === 1) {
        return Infinity;
      }
      if (df1 === 2 && df2 === 1) {
        return 1;
      }
      return Math.sqrt((Math.pow(df1 * x, df1) * Math.pow(df2, df2)) /
                       (Math.pow(df1 * x + df2, df1 + df2))) /
                       (x * jStat.betafn(df1/2, df2/2));
    }

    p = (df1 * x) / (df2 + x * df1);
    q = df2 / (df2 + x * df1);
    f = df1 * q / 2.0;
    return f * jStat.binomial.pdf((df1 - 2) / 2, (df1 + df2 - 2) / 2, p);
  },

  cdf: function cdf(x, df1, df2) {
    return jStat.ibeta((df1 * x) / (df1 * x + df2), df1 / 2, df2 / 2);
  },

  inv: function inv(x, df1, df2) {
    return df2 / (df1 * (1 / jStat.ibetainv(x, df1 / 2, df2 / 2) - 1));
  },

  mean: function mean(df1, df2) {
    return (df2 > 2) ? df2 / (df2 - 2) : undefined;
  },

  mode: function mode(df1, df2) {
    return (df1 > 2) ? (df2 * (df1 - 2)) / (df1 * (df2 + 2)) : undefined;
  },

  // return a random sample
  sample: function sample(df1, df2) {
    var x1 = jStat.randg(df1 / 2) * 2;
    var x2 = jStat.randg(df2 / 2) * 2;
    return (x1 / df1) / (x2 / df2);
  },

  variance: function variance(df1, df2) {
    if (df2 <= 4)
      return undefined;
    return 2 * df2 * df2 * (df1 + df2 - 2) /
        (df1 * (df2 - 2) * (df2 - 2) * (df2 - 4));
  }
});


// extend cauchy function with static methods
jStat.extend(jStat.cauchy, {
  pdf: function pdf(x, local, scale) {
    return (scale / (Math.pow(x - local, 2) + Math.pow(scale, 2))) / Math.PI;
  },

  cdf: function cdf(x, local, scale) {
    return Math.atan((x - local) / scale) / Math.PI + 0.5;
  },

  inv: function(p, local, scale) {
    return local + scale * Math.tan(Math.PI * (p - 0.5));
  },

  median: function median(local, scale) {
    return local;
  },

  mode: function mode(local, scale) {
    return local;
  },

  sample: function sample(local, scale) {
    return jStat.randn() *
        Math.sqrt(1 / (2 * jStat.randg(0.5))) * scale + local;
  }
});



// extend chisquare function with static methods
jStat.extend(jStat.chisquare, {
  pdf: function pdf(x, dof) {
    return x === 0 ? 0 :
        Math.exp((dof / 2 - 1) * Math.log(x) - x / 2 - (dof / 2) *
                 Math.log(2) - jStat.gammaln(dof / 2));
  },

  cdf: function cdf(x, dof) {
    return jStat.lowRegGamma(dof / 2, x / 2);
  },

  inv: function(p, dof) {
    return 2 * jStat.gammapinv(p, 0.5 * dof);
  },

  mean : function(dof) {
    return dof;
  },

  // TODO: this is an approximation (is there a better way?)
  median: function median(dof) {
    return dof * Math.pow(1 - (2 / (9 * dof)), 3);
  },

  mode: function mode(dof) {
    return (dof - 2 > 0) ? dof - 2 : 0;
  },

  sample: function sample(dof) {
    return jStat.randg(dof / 2) * 2;
  },

  variance: function variance(dof) {
    return 2 * dof;
  }
});



// extend exponential function with static methods
jStat.extend(jStat.exponential, {
  pdf: function pdf(x, rate) {
    return x < 0 ? 0 : rate * Math.exp(-rate * x);
  },

  cdf: function cdf(x, rate) {
    return x < 0 ? 0 : 1 - Math.exp(-rate * x);
  },

  inv: function(p, rate) {
    return -Math.log(1 - p) / rate;
  },

  mean : function(rate) {
    return 1 / rate;
  },

  median: function (rate) {
    return (1 / rate) * Math.log(2);
  },

  mode: function mode(rate) {
    return 0;
  },

  sample: function sample(rate) {
    return -1 / rate * Math.log(Math.random());
  },

  variance : function(rate) {
    return Math.pow(rate, -2);
  }
});



// extend gamma function with static methods
jStat.extend(jStat.gamma, {
  pdf: function pdf(x, shape, scale) {
    return Math.exp((shape - 1) * Math.log(x) - x / scale -
                    jStat.gammaln(shape) - shape * Math.log(scale));
  },

  cdf: function cdf(x, shape, scale) {
    return jStat.lowRegGamma(shape, x / scale);
  },

  inv: function(p, shape, scale) {
    return jStat.gammapinv(p, shape) * scale;
  },

  mean : function(shape, scale) {
    return shape * scale;
  },

  mode: function mode(shape, scale) {
    if(shape > 1) return (shape - 1) * scale;
    return undefined;
  },

  sample: function sample(shape, scale) {
    return jStat.randg(shape) * scale;
  },

  variance: function variance(shape, scale) {
    return shape * scale * scale;
  }
});

// extend inverse gamma function with static methods
jStat.extend(jStat.invgamma, {
  pdf: function pdf(x, shape, scale) {
    return Math.exp(-(shape + 1) * Math.log(x) - scale / x -
                    jStat.gammaln(shape) + shape * Math.log(scale));
  },

  cdf: function cdf(x, shape, scale) {
    return 1 - jStat.lowRegGamma(shape, scale / x);
  },

  inv: function(p, shape, scale) {
    return scale / jStat.gammapinv(1 - p, shape);
  },

  mean : function(shape, scale) {
    return (shape > 1) ? scale / (shape - 1) : undefined;
  },

  mode: function mode(shape, scale) {
    return scale / (shape + 1);
  },

  sample: function sample(shape, scale) {
    return scale / jStat.randg(shape);
  },

  variance: function variance(shape, scale) {
    if (shape <= 2)
      return undefined;
    return scale * scale / ((shape - 1) * (shape - 1) * (shape - 2));
  }
});


// extend kumaraswamy function with static methods
jStat.extend(jStat.kumaraswamy, {
  pdf: function pdf(x, alpha, beta) {
    return Math.exp(Math.log(alpha) + Math.log(beta) + (alpha - 1) *
                    Math.log(x) + (beta - 1) *
                    Math.log(1 - Math.pow(x, alpha)));
  },

  cdf: function cdf(x, alpha, beta) {
    return (1 - Math.pow(1 - Math.pow(x, alpha), beta));
  },

  mean : function(alpha, beta) {
    return (beta * jStat.gammafn(1 + 1 / alpha) *
            jStat.gammafn(beta)) / (jStat.gammafn(1 + 1 / alpha + beta));
  },

  median: function median(alpha, beta) {
    return Math.pow(1 - Math.pow(2, -1 / beta), 1 / alpha);
  },

  mode: function mode(alpha, beta) {
    if (!(alpha >= 1 && beta >= 1 && (alpha !== 1 && beta !== 1)))
      return undefined;
    return Math.pow((alpha - 1) / (alpha * beta - 1), 1 / alpha);
  },

  variance: function variance(alpha, beta) {
    throw new Error('variance not yet implemented');
    // TODO: complete this
  }
});



// extend lognormal function with static methods
jStat.extend(jStat.lognormal, {
  pdf: function pdf(x, mu, sigma) {
    return Math.exp(-Math.log(x) - 0.5 * Math.log(2 * Math.PI) -
                    Math.log(sigma) - Math.pow(Math.log(x) - mu, 2) /
                    (2 * sigma * sigma));
  },

  cdf: function cdf(x, mu, sigma) {
    return 0.5 +
        (0.5 * jStat.erf((Math.log(x) - mu) / Math.sqrt(2 * sigma * sigma)));
  },

  inv: function(p, mu, sigma) {
    return Math.exp(-1.41421356237309505 * sigma * jStat.erfcinv(2 * p) + mu);
  },

  mean: function mean(mu, sigma) {
    return Math.exp(mu + sigma * sigma / 2);
  },

  median: function median(mu, sigma) {
    return Math.exp(mu);
  },

  mode: function mode(mu, sigma) {
    return Math.exp(mu - sigma * sigma);
  },

  sample: function sample(mu, sigma) {
    return Math.exp(jStat.randn() * sigma + mu);
  },

  variance: function variance(mu, sigma) {
    return (Math.exp(sigma * sigma) - 1) * Math.exp(2 * mu + sigma * sigma);
  }
});



// extend noncentralt function with static methods
jStat.extend(jStat.noncentralt, {
  pdf: function pdf(x, dof, ncp) {
    var tol = 1e-14;
    if (Math.abs(ncp) < tol)  // ncp approx 0; use student-t
      return jStat.studentt.pdf(x, dof)

    if (Math.abs(x) < tol) {  // different formula for x == 0
      return Math.exp(jStat.gammaln((dof + 1) / 2) - ncp * ncp / 2 -
                      0.5 * Math.log(Math.PI * dof) - jStat.gammaln(dof / 2));
    }

    // formula for x != 0
    return dof / x *
        (jStat.noncentralt.cdf(x * Math.sqrt(1 + 2 / dof), dof+2, ncp) -
         jStat.noncentralt.cdf(x, dof, ncp));
  },

  cdf: function cdf(x, dof, ncp) {
    var tol = 1e-14;
    var min_iterations = 200;

    if (Math.abs(ncp) < tol)  // ncp approx 0; use student-t
      return jStat.studentt.cdf(x, dof);

    // turn negative x into positive and flip result afterwards
    var flip = false;
    if (x < 0) {
      flip = true;
      ncp = -ncp;
    }

    var prob = jStat.normal.cdf(-ncp, 0, 1);
    var value = tol + 1;
    // use value at last two steps to determine convergence
    var lastvalue = value;
    var y = x * x / (x * x + dof);
    var j = 0;
    var p = Math.exp(-ncp * ncp / 2);
    var q = Math.exp(-ncp * ncp / 2 - 0.5 * Math.log(2) -
                     jStat.gammaln(3 / 2)) * ncp;
    while (j < min_iterations || lastvalue > tol || value > tol) {
      lastvalue = value;
      if (j > 0) {
        p *= (ncp * ncp) / (2 * j);
        q *= (ncp * ncp) / (2 * (j + 1 / 2));
      }
      value = p * jStat.beta.cdf(y, j + 0.5, dof / 2) +
          q * jStat.beta.cdf(y, j+1, dof/2);
      prob += 0.5 * value;
      j++;
    }

    return flip ? (1 - prob) : prob;
  }
});


// extend normal function with static methods
jStat.extend(jStat.normal, {
  pdf: function pdf(x, mean, std) {
    return Math.exp(-0.5 * Math.log(2 * Math.PI) -
                    Math.log(std) - Math.pow(x - mean, 2) / (2 * std * std));
  },

  cdf: function cdf(x, mean, std) {
    return 0.5 * (1 + jStat.erf((x - mean) / Math.sqrt(2 * std * std)));
  },

  inv: function(p, mean, std) {
    return -1.41421356237309505 * std * jStat.erfcinv(2 * p) + mean;
  },

  mean : function(mean, std) {
    return mean;
  },

  median: function median(mean, std) {
    return mean;
  },

  mode: function (mean, std) {
    return mean;
  },

  sample: function sample(mean, std) {
    return jStat.randn() * std + mean;
  },

  variance : function(mean, std) {
    return std * std;
  }
});



// extend pareto function with static methods
jStat.extend(jStat.pareto, {
  pdf: function pdf(x, scale, shape) {
    if (x < scale)
      return undefined;
    return (shape * Math.pow(scale, shape)) / Math.pow(x, shape + 1);
  },

  cdf: function cdf(x, scale, shape) {
    return 1 - Math.pow(scale / x, shape);
  },

  mean: function mean(scale, shape) {
    if (shape <= 1)
      return undefined;
    return (shape * Math.pow(scale, shape)) / (shape - 1);
  },

  median: function median(scale, shape) {
    return scale * (shape * Math.SQRT2);
  },

  mode: function mode(scale, shape) {
    return scale;
  },

  variance : function(scale, shape) {
    if (shape <= 2)
      return undefined;
    return (scale*scale * shape) / (Math.pow(shape - 1, 2) * (shape - 2));
  }
});



// extend studentt function with static methods
jStat.extend(jStat.studentt, {
  pdf: function pdf(x, dof) {
    dof = dof > 1e100 ? 1e100 : dof;
    return (1/(Math.sqrt(dof) * jStat.betafn(0.5, dof/2))) *
        Math.pow(1 + ((x * x) / dof), -((dof + 1) / 2));
  },

  cdf: function cdf(x, dof) {
    var dof2 = dof / 2;
    return jStat.ibeta((x + Math.sqrt(x * x + dof)) /
                       (2 * Math.sqrt(x * x + dof)), dof2, dof2);
  },

  inv: function(p, dof) {
    var x = jStat.ibetainv(2 * Math.min(p, 1 - p), 0.5 * dof, 0.5);
    x = Math.sqrt(dof * (1 - x) / x);
    return (p > 0.5) ? x : -x;
  },

  mean: function mean(dof) {
    return (dof > 1) ? 0 : undefined;
  },

  median: function median(dof) {
    return 0;
  },

  mode: function mode(dof) {
    return 0;
  },

  sample: function sample(dof) {
    return jStat.randn() * Math.sqrt(dof / (2 * jStat.randg(dof / 2)));
  },

  variance: function variance(dof) {
    return (dof  > 2) ? dof / (dof - 2) : (dof > 1) ? Infinity : undefined;
  }
});



// extend weibull function with static methods
jStat.extend(jStat.weibull, {
  pdf: function pdf(x, scale, shape) {
    if (x < 0)
      return 0;
    return (shape / scale) * Math.pow((x / scale), (shape - 1)) *
        Math.exp(-(Math.pow((x / scale), shape)));
  },

  cdf: function cdf(x, scale, shape) {
    return x < 0 ? 0 : 1 - Math.exp(-Math.pow((x / scale), shape));
  },

  inv: function(p, scale, shape) {
    return scale * Math.pow(-Math.log(1 - p), 1 / shape);
  },

  mean : function(scale, shape) {
    return scale * jStat.gammafn(1 + 1 / shape);
  },

  median: function median(scale, shape) {
    return scale * Math.pow(Math.log(2), 1 / shape);
  },

  mode: function mode(scale, shape) {
    if (shape <= 1)
      return undefined;
    return scale * Math.pow((shape - 1) / shape, 1 / shape);
  },

  sample: function sample(scale, shape) {
    return scale * Math.pow(-Math.log(Math.random()), 1 / shape);
  },

  variance: function variance(scale, shape) {
    return scale * scale * jStat.gammafn(1 + 2 / shape) -
        Math.pow(this.mean(scale, shape), 2);
  }
});



// extend uniform function with static methods
jStat.extend(jStat.uniform, {
  pdf: function pdf(x, a, b) {
    return (x < a || x > b) ? 0 : 1 / (b - a);
  },

  cdf: function cdf(x, a, b) {
    if (x < a)
      return 0;
    else if (x < b)
      return (x - a) / (b - a);
    return 1;
  },

  inv: function(p, a, b) {
    return a + (p * (b - a));
  },

  mean: function mean(a, b) {
    return 0.5 * (a + b);
  },

  median: function median(a, b) {
    return jStat.mean(a, b);
  },

  mode: function mode(a, b) {
    throw new Error('mode is not yet implemented');
  },

  sample: function sample(a, b) {
    return (a / 2 + b / 2) + (b / 2 - a / 2) * (2 * Math.random() - 1);
  },

  variance: function variance(a, b) {
    return Math.pow(b - a, 2) / 12;
  }
});



// extend uniform function with static methods
jStat.extend(jStat.binomial, {
  pdf: function pdf(k, n, p) {
    return (p === 0 || p === 1) ?
      ((n * p) === k ? 1 : 0) :
      jStat.combination(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
  },

  cdf: function cdf(x, n, p) {
    var binomarr = [],
    k = 0;
    if (x < 0) {
      return 0;
    }
    if (x < n) {
      for (; k <= x; k++) {
        binomarr[ k ] = jStat.binomial.pdf(k, n, p);
      }
      return jStat.sum(binomarr);
    }
    return 1;
  }
});



// extend uniform function with static methods
jStat.extend(jStat.negbin, {
  pdf: function pdf(k, r, p) {
    return k !== k | 0
      ? false
      : k < 0
        ? 0
        : jStat.combination(k + r - 1, r - 1) * Math.pow(1 - p, k) * Math.pow(p, r);
  },

  cdf: function cdf(x, r, p) {
    var sum = 0,
    k = 0;
    if (x < 0) return 0;
    for (; k <= x; k++) {
      sum += jStat.negbin.pdf(k, r, p);
    }
    return sum;
  }
});



// extend uniform function with static methods
jStat.extend(jStat.hypgeom, {
  pdf: function pdf(k, N, m, n) {
    // Hypergeometric PDF.

    // A simplification of the CDF algorithm below.

    // k = number of successes drawn
    // N = population size
    // m = number of successes in population
    // n = number of items drawn from population

    if(k !== k | 0) {
      return false;
    } else if(k < 0 || k < m - (N - n)) {
      // It's impossible to have this few successes drawn.
      return 0;
    } else if(k > n || k > m) {
      // It's impossible to have this many successes drawn.
      return 0;
    } else if (m * 2 > N) {
      // More than half the population is successes.

      if(n * 2 > N) {
        // More than half the population is sampled.

        return jStat.hypgeom.pdf(N - m - n + k, N, N - m, N - n)
      } else {
        // Half or less of the population is sampled.

        return jStat.hypgeom.pdf(n - k, N, N - m, n);
      }

    } else if(n * 2 > N) {
      // Half or less is successes.

      return jStat.hypgeom.pdf(m - k, N, m, N - n);

    } else if(m < n) {
      // We want to have the number of things sampled to be less than the
      // successes available. So swap the definitions of successful and sampled.
      return jStat.hypgeom.pdf(k, N, n, m);
    } else {
      // If we get here, half or less of the population was sampled, half or
      // less of it was successes, and we had fewer sampled things than
      // successes. Now we can do this complicated iterative algorithm in an
      // efficient way.

      // The basic premise of the algorithm is that we partially normalize our
      // intermediate product to keep it in a numerically good region, and then
      // finish the normalization at the end.

      // This variable holds the scaled probability of the current number of
      // successes.
      var scaledPDF = 1;

      // This keeps track of how much we have normalized.
      var samplesDone = 0;

      for(var i = 0; i < k; i++) {
        // For every possible number of successes up to that observed...

        while(scaledPDF > 1 && samplesDone < n) {
          // Intermediate result is growing too big. Apply some of the
          // normalization to shrink everything.

          scaledPDF *= 1 - (m / (N - samplesDone));

          // Say we've normalized by this sample already.
          samplesDone++;
        }

        // Work out the partially-normalized hypergeometric PDF for the next
        // number of successes
        scaledPDF *= (n - i) * (m - i) / ((i + 1) * (N - m - n + i + 1));
      }

      for(; samplesDone < n; samplesDone++) {
        // Apply all the rest of the normalization
        scaledPDF *= 1 - (m / (N - samplesDone));
      }

      // Bound answer sanely before returning.
      return Math.min(1, Math.max(0, scaledPDF));
    }
  },

  cdf: function cdf(x, N, m, n) {
    // Hypergeometric CDF.

    // This algorithm is due to Prof. Thomas S. Ferguson, <tom@math.ucla.edu>,
    // and comes from his hypergeometric test calculator at
    // <http://www.math.ucla.edu/~tom/distributions/Hypergeometric.html>.

    // x = number of successes drawn
    // N = population size
    // m = number of successes in population
    // n = number of items drawn from population

    if(x < 0 || x < m - (N - n)) {
      // It's impossible to have this few successes drawn or fewer.
      return 0;
    } else if(x >= n || x >= m) {
      // We will always have this many successes or fewer.
      return 1;
    } else if (m * 2 > N) {
      // More than half the population is successes.

      if(n * 2 > N) {
        // More than half the population is sampled.

        return jStat.hypgeom.cdf(N - m - n + x, N, N - m, N - n)
      } else {
        // Half or less of the population is sampled.

        return 1 - jStat.hypgeom.cdf(n - x - 1, N, N - m, n);
      }

    } else if(n * 2 > N) {
      // Half or less is successes.

      return 1 - jStat.hypgeom.cdf(m - x - 1, N, m, N - n);

    } else if(m < n) {
      // We want to have the number of things sampled to be less than the
      // successes available. So swap the definitions of successful and sampled.
      return jStat.hypgeom.cdf(x, N, n, m);
    } else {
      // If we get here, half or less of the population was sampled, half or
      // less of it was successes, and we had fewer sampled things than
      // successes. Now we can do this complicated iterative algorithm in an
      // efficient way.

      // The basic premise of the algorithm is that we partially normalize our
      // intermediate sum to keep it in a numerically good region, and then
      // finish the normalization at the end.

      // Holds the intermediate, scaled total CDF.
      var scaledCDF = 1;

      // This variable holds the scaled probability of the current number of
      // successes.
      var scaledPDF = 1;

      // This keeps track of how much we have normalized.
      var samplesDone = 0;

      for(var i = 0; i < x; i++) {
        // For every possible number of successes up to that observed...

        while(scaledCDF > 1 && samplesDone < n) {
          // Intermediate result is growing too big. Apply some of the
          // normalization to shrink everything.

          var factor = 1 - (m / (N - samplesDone));

          scaledPDF *= factor;
          scaledCDF *= factor;

          // Say we've normalized by this sample already.
          samplesDone++;
        }

        // Work out the partially-normalized hypergeometric PDF for the next
        // number of successes
        scaledPDF *= (n - i) * (m - i) / ((i + 1) * (N - m - n + i + 1));

        // Add to the CDF answer.
        scaledCDF += scaledPDF;
      }

      for(; samplesDone < n; samplesDone++) {
        // Apply all the rest of the normalization
        scaledCDF *= 1 - (m / (N - samplesDone));
      }

      // Bound answer sanely before returning.
      return Math.min(1, Math.max(0, scaledCDF));
    }
  }
});



// extend uniform function with static methods
jStat.extend(jStat.poisson, {
  pdf: function pdf(k, l) {
    return Math.pow(l, k) * Math.exp(-l) / jStat.factorial(k);
  },

  cdf: function cdf(x, l) {
    var sumarr = [],
    k = 0;
    if (x < 0) return 0;
    for (; k <= x; k++) {
      sumarr.push(jStat.poisson.pdf(k, l));
    }
    return jStat.sum(sumarr);
  },

  mean : function(l) {
    return l;
  },

  variance : function(l) {
    return l;
  },

  sample: function sample(l) {
    var p = 1, k = 0, L = Math.exp(-l);
    do {
      k++;
      p *= Math.random();
    } while (p > L);
    return k - 1;
  }
});

// extend triangular function with static methods
jStat.extend(jStat.triangular, {
  pdf: function pdf(x, a, b, c) {
    if (b <= a || c < a || c > b) {
      return undefined;
    } else {
      if (x < a || x > b) {
        return 0;
      } else {
        if (x <= c) {
          if ( c === a)
            return 1;
          else
            return (2 * (x - a)) / ((b - a) * (c - a));
        } else {
          if (c === b)
            return 1;
          else
            return (2 * (b - x)) / ((b - a) * (b - c));
        }
      }
    }
  },

  cdf: function cdf(x, a, b, c) {
    if (b <= a || c < a || c > b)
      return undefined;
    if (x < a) {
      return 0;
    } else {
      if (x <= c)
        return Math.pow(x - a, 2) / ((b - a) * (c - a));
      return 1 - Math.pow(b - x, 2) / ((b - a) * (b - c));
    }
    // never reach this
    return 1;
  },

  mean: function mean(a, b, c) {
    return (a + b + c) / 3;
  },

  median: function median(a, b, c) {
    if (c <= (a + b) / 2) {
      return b - Math.sqrt((b - a) * (b - c)) / Math.sqrt(2);
    } else if (c > (a + b) / 2) {
      return a + Math.sqrt((b - a) * (c - a)) / Math.sqrt(2);
    }
  },

  mode: function mode(a, b, c) {
    return c;
  },

  sample: function sample(a, b, c) {
    var u = Math.random();
    if (u < ((c - a) / (b - a)))
      return a + Math.sqrt(u * (b - a) * (c - a))
    return b - Math.sqrt((1 - u) * (b - a) * (b - c));
  },

  variance: function variance(a, b, c) {
    return (a * a + b * b + c * c - a * b - a * c - b * c) / 18;
  }
});

}(this.jStat, Math));
/* Provides functions for the solution of linear system of equations, integration, extrapolation,
 * interpolation, eigenvalue problems, differential equations and PCA analysis. */

(function(jStat, Math) {

var push = Array.prototype.push;
var isArray = jStat.utils.isArray;

jStat.extend({

  // add a vector/matrix to a vector/matrix or scalar
  add: function add(arr, arg) {
    // check if arg is a vector or scalar
    if (isArray(arg)) {
      if (!isArray(arg[0])) arg = [ arg ];
      return jStat.map(arr, function(value, row, col) {
        return value + arg[row][col];
      });
    }
    return jStat.map(arr, function(value) { return value + arg; });
  },

  // subtract a vector or scalar from the vector
  subtract: function subtract(arr, arg) {
    // check if arg is a vector or scalar
    if (isArray(arg)) {
      if (!isArray(arg[0])) arg = [ arg ];
      return jStat.map(arr, function(value, row, col) {
        return value - arg[row][col] || 0;
      });
    }
    return jStat.map(arr, function(value) { return value - arg; });
  },

  // matrix division
  divide: function divide(arr, arg) {
    if (isArray(arg)) {
      if (!isArray(arg[0])) arg = [ arg ];
      return jStat.multiply(arr, jStat.inv(arg));
    }
    return jStat.map(arr, function(value) { return value / arg; });
  },

  // matrix multiplication
  multiply: function multiply(arr, arg) {
    var row, col, nrescols, sum,
    nrow = arr.length,
    ncol = arr[0].length,
    res = jStat.zeros(nrow, nrescols = (isArray(arg)) ? arg[0].length : ncol),
    rescols = 0;
    if (isArray(arg)) {
      for (; rescols < nrescols; rescols++) {
        for (row = 0; row < nrow; row++) {
          sum = 0;
          for (col = 0; col < ncol; col++)
          sum += arr[row][col] * arg[col][rescols];
          res[row][rescols] = sum;
        }
      }
      return (nrow === 1 && rescols === 1) ? res[0][0] : res;
    }
    return jStat.map(arr, function(value) { return value * arg; });
  },

  // Returns the dot product of two matricies
  dot: function dot(arr, arg) {
    if (!isArray(arr[0])) arr = [ arr ];
    if (!isArray(arg[0])) arg = [ arg ];
    // convert column to row vector
    var left = (arr[0].length === 1 && arr.length !== 1) ? jStat.transpose(arr) : arr,
    right = (arg[0].length === 1 && arg.length !== 1) ? jStat.transpose(arg) : arg,
    res = [],
    row = 0,
    nrow = left.length,
    ncol = left[0].length,
    sum, col;
    for (; row < nrow; row++) {
      res[row] = [];
      sum = 0;
      for (col = 0; col < ncol; col++)
      sum += left[row][col] * right[row][col];
      res[row] = sum;
    }
    return (res.length === 1) ? res[0] : res;
  },

  // raise every element by a scalar
  pow: function pow(arr, arg) {
    return jStat.map(arr, function(value) { return Math.pow(value, arg); });
  },

  // exponentiate every element
  exp: function exp(arr) {
    return jStat.map(arr, function(value) { return Math.exp(value); });
  },

  // generate the natural log of every element
  log: function exp(arr) {
    return jStat.map(arr, function(value) { return Math.log(value); });
  },

  // generate the absolute values of the vector
  abs: function abs(arr) {
    return jStat.map(arr, function(value) { return Math.abs(value); });
  },

  // computes the p-norm of the vector
  // In the case that a matrix is passed, uses the first row as the vector
  norm: function norm(arr, p) {
    var nnorm = 0,
    i = 0;
    // check the p-value of the norm, and set for most common case
    if (isNaN(p)) p = 2;
    // check if multi-dimensional array, and make vector correction
    if (isArray(arr[0])) arr = arr[0];
    // vector norm
    for (; i < arr.length; i++) {
      nnorm += Math.pow(Math.abs(arr[i]), p);
    }
    return Math.pow(nnorm, 1 / p);
  },

  // computes the angle between two vectors in rads
  // In case a matrix is passed, this uses the first row as the vector
  angle: function angle(arr, arg) {
    return Math.acos(jStat.dot(arr, arg) / (jStat.norm(arr) * jStat.norm(arg)));
  },

  // augment one matrix by another
  // Note: this function returns a matrix, not a jStat object
  aug: function aug(a, b) {
    var newarr = a.slice(),
    i = 0;
    for (; i < newarr.length; i++) {
      push.apply(newarr[i], b[i]);
    }
    return newarr;
  },

  // The inv() function calculates the inverse of a matrix
  // Create the inverse by augmenting the matrix by the identity matrix of the
  // appropriate size, and then use G-J elimination on the augmented matrix.
  inv: function inv(a) {
    var rows = a.length;
    var cols = a[0].length;
    var b = jStat.identity(rows, cols);
    var c = jStat.gauss_jordan(a, b);
    var result = [];
    var i = 0;
    var j;

    //We need to copy the inverse portion to a new matrix to rid G-J artifacts
    for (; i < rows; i++) {
      result[i] = [];
      for (j = cols; j < c[0].length; j++)
        result[i][j - cols] = c[i][j];
    }
    return result;
  },

  // calculate the determinant of a matrix
  det: function det(a) {
    var alen = a.length,
    alend = alen * 2,
    vals = new Array(alend),
    rowshift = alen - 1,
    colshift = alend - 1,
    mrow = rowshift - alen + 1,
    mcol = colshift,
    i = 0,
    result = 0,
    j;
    // check for special 2x2 case
    if (alen === 2) {
      return a[0][0] * a[1][1] - a[0][1] * a[1][0];
    }
    for (; i < alend; i++) {
      vals[i] = 1;
    }
    for (i = 0; i < alen; i++) {
      for (j = 0; j < alen; j++) {
        vals[(mrow < 0) ? mrow + alen : mrow ] *= a[i][j];
        vals[(mcol < alen) ? mcol + alen : mcol ] *= a[i][j];
        mrow++;
        mcol--;
      }
      mrow = --rowshift - alen + 1;
      mcol = --colshift;
    }
    for (i = 0; i < alen; i++) {
      result += vals[i];
    }
    for (; i < alend; i++) {
      result -= vals[i];
    }
    return result;
  },

  gauss_elimination: function gauss_elimination(a, b) {
    var i = 0,
    j = 0,
    n = a.length,
    m = a[0].length,
    factor = 1,
    sum = 0,
    x = [],
    maug, pivot, temp, k;
    a = jStat.aug(a, b);
    maug = a[0].length;
    for(i = 0; i < n; i++) {
      pivot = a[i][i];
      j = i;
      for (k = i + 1; k < m; k++) {
        if (pivot < Math.abs(a[k][i])) {
          pivot = a[k][i];
          j = k;
        }
      }
      if (j != i) {
        for(k = 0; k < maug; k++) {
          temp = a[i][k];
          a[i][k] = a[j][k];
          a[j][k] = temp;
        }
      }
      for (j = i + 1; j < n; j++) {
        factor = a[j][i] / a[i][i];
        for(k = i; k < maug; k++) {
          a[j][k] = a[j][k] - factor * a[i][k];
        }
      }
    }
    for (i = n - 1; i >= 0; i--) {
      sum = 0;
      for (j = i + 1; j<= n - 1; j++) {
        sum = sum + x[j] * a[i][j];
      }
      x[i] =(a[i][maug - 1] - sum) / a[i][i];
    }
    return x;
  },

  gauss_jordan: function gauss_jordan(a, b) {
    var m = jStat.aug(a, b),
    h = m.length,
    w = m[0].length;
    // find max pivot
    for (var y = 0; y < h; y++) {
      var maxrow = y;
      for (var y2 = y+1; y2 < h; y2++) {
        if (Math.abs(m[y2][y]) > Math.abs(m[maxrow][y]))
          maxrow = y2;
      }
      var tmp = m[y];
      m[y] = m[maxrow];
      m[maxrow] = tmp
      for (var y2 = y+1; y2 < h; y2++) {
        c = m[y2][y] / m[y][y];
        for (var x = y; x < w; x++) {
          m[y2][x] -= m[y][x] * c;
        }
      }
    }
    // backsubstitute
    for (var y = h-1; y >= 0; y--) {
      c = m[y][y];
      for (var y2 = 0; y2 < y; y2++) {
        for (var x = w-1; x > y-1; x--) {
          m[y2][x] -= m[y][x] * m[y2][y] / c;
        }
      }
      m[y][y] /= c;
      for (var x = h; x < w; x++) {
        m[y][x] /= c;
      }
    }
    return m;
  },

  lu: function lu(a, b) {
    throw new Error('lu not yet implemented');
  },

  cholesky: function cholesky(a, b) {
    throw new Error('cholesky not yet implemented');
  },

  gauss_jacobi: function gauss_jacobi(a, b, x, r) {
    var i = 0;
    var j = 0;
    var n = a.length;
    var l = [];
    var u = [];
    var d = [];
    var xv, c, h, xk;
    for (; i < n; i++) {
      l[i] = [];
      u[i] = [];
      d[i] = [];
      for (j = 0; j < n; j++) {
        if (i > j) {
          l[i][j] = a[i][j];
          u[i][j] = d[i][j] = 0;
        } else if (i < j) {
          u[i][j] = a[i][j];
          l[i][j] = d[i][j] = 0;
        } else {
          d[i][j] = a[i][j];
          l[i][j] = u[i][j] = 0;
        }
      }
    }
    h = jStat.multiply(jStat.multiply(jStat.inv(d), jStat.add(l, u)), -1);
    c = jStat.multiply(jStat.inv(d), b);
    xv = x;
    xk = jStat.add(jStat.multiply(h, x), c);
    i = 2;
    while (Math.abs(jStat.norm(jStat.subtract(xk,xv))) > r) {
      xv = xk;
      xk = jStat.add(jStat.multiply(h, xv), c);
      i++;
    }
    return xk;
  },

  gauss_seidel: function gauss_seidel(a, b, x, r) {
    var i = 0;
    var n = a.length;
    var l = [];
    var u = [];
    var d = [];
    var j, xv, c, h, xk;
    for (; i < n; i++) {
      l[i] = [];
      u[i] = [];
      d[i] = [];
      for (j = 0; j < n; j++) {
        if (i > j) {
          l[i][j] = a[i][j];
          u[i][j] = d[i][j] = 0;
        } else if (i < j) {
          u[i][j] = a[i][j];
          l[i][j] = d[i][j] = 0;
        } else {
          d[i][j] = a[i][j];
          l[i][j] = u[i][j] = 0;
        }
      }
    }
    h = jStat.multiply(jStat.multiply(jStat.inv(jStat.add(d, l)), u), -1);
    c = jStat.multiply(jStat.inv(jStat.add(d, l)), b);
    xv = x;
    xk = jStat.add(jStat.multiply(h, x), c);
    i = 2;
    while (Math.abs(jStat.norm(jStat.subtract(xk, xv))) > r) {
      xv = xk;
      xk = jStat.add(jStat.multiply(h, xv), c);
      i = i + 1;
    }
    return xk;
  },

  SOR: function SOR(a, b, x, r, w) {
    var i = 0;
    var n = a.length;
    var l = [];
    var u = [];
    var d = [];
    var j, xv, c, h, xk;
    for (; i < n; i++) {
      l[i] = [];
      u[i] = [];
      d[i] = [];
      for (j = 0; j < n; j++) {
        if (i > j) {
          l[i][j] = a[i][j];
          u[i][j] = d[i][j] = 0;
        } else if (i < j) {
          u[i][j] = a[i][j];
          l[i][j] = d[i][j] = 0;
        } else {
          d[i][j] = a[i][j];
          l[i][j] = u[i][j] = 0;
        }
      }
    }
    h = jStat.multiply(jStat.inv(jStat.add(d, jStat.multiply(l, w))),
                       jStat.subtract(jStat.multiply(d, 1 - w),
                                      jStat.multiply(u, w)));
    c = jStat.multiply(jStat.multiply(jStat.inv(jStat.add(d,
        jStat.multiply(l, w))), b), w);
    xv = x;
    xk = jStat.add(jStat.multiply(h, x), c);
    i = 2;
    while (Math.abs(jStat.norm(jStat.subtract(xk, xv))) > r) {
      xv = xk;
      xk = jStat.add(jStat.multiply(h, xv), c);
      i++;
    }
    return xk;
  },

  householder: function householder(a) {
    var m = a.length;
    var n = a[0].length;
    var i = 0;
    var w = [];
    var p = [];
    var alpha, r, k, j, factor;
    for (; i < m - 1; i++) {
      alpha = 0;
      for (j = i + 1; j < n; j++)
      alpha += (a[j][i] * a[j][i]);
      factor = (a[i + 1][i] > 0) ? -1 : 1;
      alpha = factor * Math.sqrt(alpha);
      r = Math.sqrt((((alpha * alpha) - a[i + 1][i] * alpha) / 2));
      w = jStat.zeros(m, 1);
      w[i + 1][0] = (a[i + 1][i] - alpha) / (2 * r);
      for (k = i + 2; k < m; k++) w[k][0] = a[k][i] / (2 * r);
      p = jStat.subtract(jStat.identity(m, n),
          jStat.multiply(jStat.multiply(w, jStat.transpose(w)), 2));
      a = jStat.multiply(p, jStat.multiply(a, p));
    }
    return a;
  },

  // TODO: not working properly.
  QR: function QR(a, b) {
    var m = a.length;
    var n = a[0].length;
    var i = 0;
    var w = [];
    var p = [];
    var x = [];
    var j, alpha, r, k, factor, sum;
    for (; i < m - 1; i++) {
      alpha = 0;
      for (j = i + 1; j < n; j++)
        alpha += (a[j][i] * a[j][i]);
      factor = (a[i + 1][i] > 0) ? -1 : 1;
      alpha = factor * Math.sqrt(alpha);
      r = Math.sqrt((((alpha * alpha) - a[i + 1][i] * alpha) / 2));
      w = jStat.zeros(m, 1);
      w[i + 1][0] = (a[i + 1][i] - alpha) / (2 * r);
      for (k = i + 2; k < m; k++)
        w[k][0] = a[k][i] / (2 * r);
      p = jStat.subtract(jStat.identity(m, n),
          jStat.multiply(jStat.multiply(w, jStat.transpose(w)), 2));
      a = jStat.multiply(p, a);
      b = jStat.multiply(p, b);
    }
    for (i = m - 1; i >= 0; i--) {
      sum = 0;
      for (j = i + 1; j <= n - 1; j++)
      sum = x[j] * a[i][j];
      x[i] = b[i][0] / a[i][i];
    }
    return x;
  },

  jacobi: function jacobi(a) {
    var condition = 1;
    var count = 0;
    var n = a.length;
    var e = jStat.identity(n, n);
    var ev = [];
    var b, i, j, p, q, maxim, theta, s;
    // condition === 1 only if tolerance is not reached
    while (condition === 1) {
      count++;
      maxim = a[0][1];
      p = 0;
      q = 1;
      for (i = 0; i < n; i++) {
        for (j = 0; j < n; j++) {
          if (i != j) {
            if (maxim < Math.abs(a[i][j])) {
              maxim = Math.abs(a[i][j]);
              p = i;
              q = j;
            }
          }
        }
      }
      if (a[p][p] === a[q][q])
        theta = (a[p][q] > 0) ? Math.PI / 4 : -Math.PI / 4;
      else
        theta = Math.atan(2 * a[p][q] / (a[p][p] - a[q][q])) / 2;
      s = jStat.identity(n, n);
      s[p][p] = Math.cos(theta);
      s[p][q] = -Math.sin(theta);
      s[q][p] = Math.sin(theta);
      s[q][q] = Math.cos(theta);
      // eigen vector matrix
      e = jStat.multiply(e, s);
      b = jStat.multiply(jStat.multiply(jStat.inv(s), a), s);
      a = b;
      condition = 0;
      for (i = 1; i < n; i++) {
        for (j = 1; j < n; j++) {
          if (i != j && Math.abs(a[i][j]) > 0.001) {
            condition = 1;
          }
        }
      }
    }
    for (i = 0; i < n; i++) ev.push(a[i][i]);
    //returns both the eigenvalue and eigenmatrix
    return [e, ev];
  },

  rungekutta: function rungekutta(f, h, p, t_j, u_j, order) {
    var k1, k2, u_j1, k3, k4;
    if (order === 2) {
      while (t_j <= p) {
        k1 = h * f(t_j, u_j);
        k2 = h * f(t_j + h, u_j + k1);
        u_j1 = u_j + (k1 + k2) / 2;
        u_j = u_j1;
        t_j = t_j + h;
      }
    }
    if (order === 4) {
      while (t_j <= p) {
        k1 = h * f(t_j, u_j);
        k2 = h * f(t_j + h / 2, u_j + k1 / 2);
        k3 = h * f(t_j + h / 2, u_j + k2 / 2);
        k4 = h * f(t_j +h, u_j + k3);
        u_j1 = u_j + (k1 + 2 * k2 + 2 * k3 + k4) / 6;
        u_j = u_j1;
        t_j = t_j + h;
      }
    }
    return u_j;
  },

  romberg: function romberg(f, a, b, order) {
    var i = 0;
    var h = (b - a) / 2;
    var x = [];
    var h1 = [];
    var g = [];
    var m, a1, j, k, I, d;
    while (i < order / 2) {
      I = f(a);
      for (j = a, k = 0; j <= b; j = j + h, k++) x[k] = j;
      m = x.length;
      for (j = 1; j < m - 1; j++) {
        I += (((j % 2) !== 0) ? 4 : 2) * f(x[j]);
      }
      I = (h / 3) * (I + f(b));
      g[i] = I;
      h /= 2;
      i++;
    }
    a1 = g.length;
    m = 1;
    while (a1 !== 1) {
      for (j = 0; j < a1 - 1; j++)
      h1[j] = ((Math.pow(4, m)) * g[j + 1] - g[j]) / (Math.pow(4, m) - 1);
      a1 = h1.length;
      g = h1;
      h1 = [];
      m++;
    }
    return g;
  },

  richardson: function richardson(X, f, x, h) {
    function pos(X, x) {
      var i = 0;
      var n = X.length;
      var p;
      for (; i < n; i++)
        if (X[i] === x) p = i;
      return p;
    }
    var n = X.length,
    h_min = Math.abs(x - X[pos(X, x) + 1]),
    i = 0,
    g = [],
    h1 = [],
    y1, y2, m, a, j;
    while (h >= h_min) {
      y1 = pos(X, x + h);
      y2 = pos(X, x);
      g[i] = (f[y1] - 2 * f[y2] + f[2 * y2 - y1]) / (h * h);
      h /= 2;
      i++;
    }
    a = g.length;
    m = 1;
    while (a != 1) {
      for (j = 0; j < a - 1; j++)
      h1[j] = ((Math.pow(4, m)) * g[j + 1] - g[j]) / (Math.pow(4, m) - 1);
      a = h1.length;
      g = h1;
      h1 = [];
      m++;
    }
    return g;
  },

  simpson: function simpson(f, a, b, n) {
    var h = (b - a) / n;
    var I = f(a);
    var x = [];
    var j = a;
    var k = 0;
    var i = 1;
    var m;
    for (; j <= b; j = j + h, k++)
      x[k] = j;
    m = x.length;
    for (; i < m - 1; i++) {
      I += ((i % 2 !== 0) ? 4 : 2) * f(x[i]);
    }
    return (h / 3) * (I + f(b));
  },

  hermite: function hermite(X, F, dF, value) {
    var n = X.length;
    var p = 0;
    var i = 0;
    var l = [];
    var dl = [];
    var A = [];
    var B = [];
    var j;
    for (; i < n; i++) {
      l[i] = 1;
      for (j = 0; j < n; j++) {
        if (i != j) l[i] *= (value - X[j]) / (X[i] - X[j]);
      }
      dl[i] = 0;
      for (j = 0; j < n; j++) {
        if (i != j) dl[i] += 1 / (X [i] - X[j]);
      }
      A[i] = (1 - 2 * (value - X[i]) * dl[i]) * (l[i] * l[i]);
      B[i] = (value - X[i]) * (l[i] * l[i]);
      p += (A[i] * F[i] + B[i] * dF[i]);
    }
    return p;
  },

  lagrange: function lagrange(X, F, value) {
    var p = 0;
    var i = 0;
    var j, l;
    var n = X.length;
    for (; i < n; i++) {
      l = F[i];
      for (j = 0; j < n; j++) {
        // calculating the lagrange polynomial L_i
        if (i != j) l *= (value - X[j]) / (X[i] - X[j]);
      }
      // adding the lagrange polynomials found above
      p += l;
    }
    return p;
  },

  cubic_spline: function cubic_spline(X, F, value) {
    var n = X.length;
    var i = 0, j;
    var A = [];
    var B = [];
    var alpha = [];
    var c = [];
    var h = [];
    var b = [];
    var d = [];
    for (; i < n - 1; i++)
      h[i] = X[i + 1] - X[i];
    alpha[0] = 0;
    for (i = 1; i < n - 1; i++) {
      alpha[i] = (3 / h[i]) * (F[i + 1] - F[i]) -
          (3 / h[i-1]) * (F[i] - F[i-1]);
    }
    for (i = 1; i < n - 1; i++) {
      A[i] = [];
      B[i] = [];
      A[i][i-1] = h[i-1];
      A[i][i] = 2 * (h[i - 1] + h[i]);
      A[i][i+1] = h[i];
      B[i][0] = alpha[i];
    }
    c = jStat.multiply(jStat.inv(A), B);
    for (j = 0; j < n - 1; j++) {
      b[j] = (F[j + 1] - F[j]) / h[j] - h[j] * (c[j + 1][0] + 2 * c[j][0]) / 3;
      d[j] = (c[j + 1][0] - c[j][0]) / (3 * h[j]);
    }
    for (j = 0; j < n; j++) {
      if (X[j] > value) break;
    }
    j -= 1;
    return F[j] + (value - X[j]) * b[j] + jStat.sq(value-X[j]) *
        c[j] + (value - X[j]) * jStat.sq(value - X[j]) * d[j];
  },

  gauss_quadrature: function gauss_quadrature() {
    throw new Error('gauss_quadrature not yet implemented');
  },

  PCA: function PCA(X) {
    var m = X.length;
    var n = X[0].length;
    var flag = false;
    var i = 0;
    var j, temp1;
    var u = [];
    var D = [];
    var result = [];
    var temp2 = [];
    var Y = [];
    var Bt = [];
    var B = [];
    var C = [];
    var V = [];
    var Vt = [];
    for (i = 0; i < m; i++) {
      u[i] = jStat.sum(X[i]) / n;
    }
    for (i = 0; i < n; i++) {
      B[i] = [];
      for(j = 0; j < m; j++) {
        B[i][j] = X[j][i] - u[j];
      }
    }
    B = jStat.transpose(B);
    for (i = 0; i < m; i++) {
      C[i] = [];
      for (j = 0; j < m; j++) {
        C[i][j] = (jStat.dot([B[i]], [B[j]])) / (n - 1);
      }
    }
    result = jStat.jacobi(C);
    V = result[0];
    D = result[1];
    Vt = jStat.transpose(V);
    for (i = 0; i < D.length; i++) {
      for (j = i; j < D.length; j++) {
        if(D[i] < D[j])  {
          temp1 = D[i];
          D[i] = D[j];
          D[j] = temp1;
          temp2 = Vt[i];
          Vt[i] = Vt[j];
          Vt[j] = temp2;
        }
      }
    }
    Bt = jStat.transpose(B);
    for (i = 0; i < m; i++) {
      Y[i] = [];
      for (j = 0; j < Bt.length; j++) {
        Y[i][j] = jStat.dot([Vt[i]], [Bt[j]]);
      }
    }
    return [X, D, Vt, Y];
  }
});

// extend jStat.fn with methods that require one argument
(function(funcs) {
  for (var i = 0; i < funcs.length; i++) (function(passfunc) {
    jStat.fn[passfunc] = function(arg, func) {
      var tmpthis = this;
      // check for callback
      if (func) {
        setTimeout(function() {
          func.call(tmpthis, jStat.fn[passfunc].call(tmpthis, arg));
        }, 15);
        return this;
      }
      if (typeof jStat[passfunc](this, arg) === 'number')
        return jStat[passfunc](this, arg);
      else
        return jStat(jStat[passfunc](this, arg));
    };
  }(funcs[i]));
}('add divide multiply subtract dot pow exp log abs norm angle'.split(' ')));

}(this.jStat, Math));
(function(jStat, Math) {

var slice = [].slice;
var isNumber = jStat.utils.isNumber;

// flag==true denotes use of sample standard deviation
// Z Statistics
jStat.extend({
  // 2 different parameter lists:
  // (value, mean, sd)
  // (value, array, flag)
  zscore: function zscore() {
    var args = slice.call(arguments);
    if (isNumber(args[1])) {
      return (args[0] - args[1]) / args[2];
    }
    return (args[0] - jStat.mean(args[1])) / jStat.stdev(args[1], args[2]);
  },

  // 3 different paramter lists:
  // (value, mean, sd, sides)
  // (zscore, sides)
  // (value, array, sides, flag)
  ztest: function ztest() {
    var args = slice.call(arguments);
    if (args.length === 4) {
      if(isNumber(args[1])) {
        var z = jStat.zscore(args[0],args[1],args[2])
        return (args[3] === 1) ?
          (jStat.normal.cdf(-Math.abs(z),0,1)) :
          (jStat.normal.cdf(-Math.abs(z),0,1)* 2);
      }
      var z = args[0]
      return (args[2] === 1) ?
        (jStat.normal.cdf(-Math.abs(z),0,1)) :
        (jStat.normal.cdf(-Math.abs(z),0,1)*2);
    }
    var z = jStat.zscore(args[0],args[1],args[3])
    return (args[1] === 1) ?
      (jStat.normal.cdf(-Math.abs(z), 0, 1)) :
      (jStat.normal.cdf(-Math.abs(z), 0, 1)*2);
  }
});

jStat.extend(jStat.fn, {
  zscore: function zscore(value, flag) {
    return (value - this.mean()) / this.stdev(flag);
  },

  ztest: function ztest(value, sides, flag) {
    var zscore = Math.abs(this.zscore(value, flag));
    return (sides === 1) ?
      (jStat.normal.cdf(-zscore, 0, 1)) :
      (jStat.normal.cdf(-zscore, 0, 1) * 2);
  }
});

// T Statistics
jStat.extend({
  // 2 parameter lists
  // (value, mean, sd, n)
  // (value, array)
  tscore: function tscore() {
    var args = slice.call(arguments);
    return (args.length === 4) ?
      ((args[0] - args[1]) / (args[2] / Math.sqrt(args[3]))) :
      ((args[0] - jStat.mean(args[1])) /
       (jStat.stdev(args[1], true) / Math.sqrt(args[1].length)));
  },

  // 3 different paramter lists:
  // (value, mean, sd, n, sides)
  // (tscore, n, sides)
  // (value, array, sides)
  ttest: function ttest() {
    var args = slice.call(arguments);
    var tscore;
    if (args.length === 5) {
      tscore = Math.abs(jStat.tscore(args[0], args[1], args[2], args[3]));
      return (args[4] === 1) ?
        (jStat.studentt.cdf(-tscore, args[3]-1)) :
        (jStat.studentt.cdf(-tscore, args[3]-1)*2);
    }
    if (isNumber(args[1])) {
      tscore = Math.abs(args[0])
      return (args[2] == 1) ?
        (jStat.studentt.cdf(-tscore, args[1]-1)) :
        (jStat.studentt.cdf(-tscore, args[1]-1) * 2);
    }
    tscore = Math.abs(jStat.tscore(args[0], args[1]))
    return (args[2] == 1) ?
      (jStat.studentt.cdf(-tscore, args[1].length-1)) :
      (jStat.studentt.cdf(-tscore, args[1].length-1) * 2);
  }
});

jStat.extend(jStat.fn, {
  tscore: function tscore(value) {
    return (value - this.mean()) / (this.stdev(true) / Math.sqrt(this.cols()));
  },

  ttest: function ttest(value, sides) {
    return (sides === 1) ?
      (1 - jStat.studentt.cdf(Math.abs(this.tscore(value)), this.cols()-1)) :
      (jStat.studentt.cdf(-Math.abs(this.tscore(value)), this.cols()-1)*2);
  }
});

// F Statistics
jStat.extend({
  // Paramter list is as follows:
  // (array1, array2, array3, ...)
  // or it is an array of arrays
  // array of arrays conversion
  anovafscore: function anovafscore() {
    var args = slice.call(arguments),
    expVar, sample, sampMean, sampSampMean, tmpargs, unexpVar, i, j;
    if (args.length === 1) {
      tmpargs = new Array(args[0].length);
      for (i = 0; i < args[0].length; i++) {
        tmpargs[i] = args[0][i];
      }
      args = tmpargs;
    }
    // 2 sample case
    if (args.length === 2) {
      return jStat.variance(args[0]) / jStat.variance(args[1]);
    }
    // Builds sample array
    sample = new Array();
    for (i = 0; i < args.length; i++) {
      sample = sample.concat(args[i]);
    }
    sampMean = jStat.mean(sample);
    // Computes the explained variance
    expVar = 0;
    for (i = 0; i < args.length; i++) {
      expVar = expVar + args[i].length * Math.pow(jStat.mean(args[i]) - sampMean, 2);
    }
    expVar /= (args.length - 1);
    // Computes unexplained variance
    unexpVar = 0;
    for (i = 0; i < args.length; i++) {
      sampSampMean = jStat.mean(args[i]);
      for (j = 0; j < args[i].length; j++) {
        unexpVar += Math.pow(args[i][j] - sampSampMean, 2);
      }
    }
    unexpVar /= (sample.length - args.length);
    return expVar / unexpVar;
  },

  // 2 different paramter setups
  // (array1, array2, array3, ...)
  // (anovafscore, df1, df2)
  anovaftest: function anovaftest() {
    var args = slice.call(arguments),
    df1, df2, n, i;
    if (isNumber(args[0])) {
      return 1 - jStat.centralF.cdf(args[0], args[1], args[2]);
    }
    anovafscore = jStat.anovafscore(args);
    df1 = args.length - 1;
    n = 0;
    for (i = 0; i < args.length; i++) {
      n = n + args[i].length;
    }
    df2 = n - df1 - 1;
    return 1 - jStat.centralF.cdf(anovafscore, df1, df2);
  },

  ftest: function ftest(fscore, df1, df2) {
    return 1 - jStat.centralF.cdf(fscore, df1, df2);
  }
});

jStat.extend(jStat.fn, {
  anovafscore: function anovafscore() {
    return jStat.anovafscore(this.toArray());
  },

  anovaftes: function anovaftes() {
    var n = 0;
    var i;
    for (i = 0; i < this.length; i++) {
      n = n + this[i].length;
    }
    return jStat.ftest(this.anovafscore(), this.length - 1, n - this.length);
  }
});

// Error Bounds
jStat.extend({
  // 2 different parameter setups
  // (value, alpha, sd, n)
  // (value, alpha, array)
  normalci: function normalci() {
    var args = slice.call(arguments),
    ans = new Array(2),
    change;
    if (args.length === 4) {
      change = Math.abs(jStat.normal.inv(args[1] / 2, 0, 1) *
                        args[2] / Math.sqrt(args[3]));
    } else {
      change = Math.abs(jStat.normal.inv(args[1] / 2, 0, 1) *
                        jStat.stdev(args[2]) / Math.sqrt(args[2].length));
    }
    ans[0] = args[0] - change;
    ans[1] = args[0] + change;
    return ans;
  },

  // 2 different parameter setups
  // (value, alpha, sd, n)
  // (value, alpha, array)
  tci: function tci() {
    var args = slice.call(arguments),
    ans = new Array(2),
    change;
    if (args.length === 4) {
      change = Math.abs(jStat.studentt.inv(args[1] / 2, args[3] - 1) *
                        args[2] / Math.sqrt(args[3]));
    } else {
      change = Math.abs(jStat.studentt.inv(args[1] / 2, args[2].length - 1) *
                        jStat.stdev(args[2], true) / Math.sqrt(args[2].length));
    }
    ans[0] = args[0] - change;
    ans[1] = args[0] + change;
    return ans;
  },

  significant: function significant(pvalue, alpha) {
    return pvalue < alpha;
  }
});

jStat.extend(jStat.fn, {
  normalci: function normalci(value, alpha) {
    return jStat.normalci(value, alpha, this.toArray());
  },

  tci: function tci(value, alpha) {
    return jStat.tci(value, alpha, this.toArray());
  }
});

}(this.jStat, Math));

//! moment.js
//! version : 2.10.6
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com
!function(a,b){"object"==typeof exports&&"undefined"!=typeof module?module.exports=b():"function"==typeof define&&define.amd?define(b):a.moment=b()}(this,function(){"use strict";function a(){return Hc.apply(null,arguments)}function b(a){Hc=a}function c(a){return"[object Array]"===Object.prototype.toString.call(a)}function d(a){return a instanceof Date||"[object Date]"===Object.prototype.toString.call(a)}function e(a,b){var c,d=[];for(c=0;c<a.length;++c)d.push(b(a[c],c));return d}function f(a,b){return Object.prototype.hasOwnProperty.call(a,b)}function g(a,b){for(var c in b)f(b,c)&&(a[c]=b[c]);return f(b,"toString")&&(a.toString=b.toString),f(b,"valueOf")&&(a.valueOf=b.valueOf),a}function h(a,b,c,d){return Ca(a,b,c,d,!0).utc()}function i(){return{empty:!1,unusedTokens:[],unusedInput:[],overflow:-2,charsLeftOver:0,nullInput:!1,invalidMonth:null,invalidFormat:!1,userInvalidated:!1,iso:!1}}function j(a){return null==a._pf&&(a._pf=i()),a._pf}function k(a){if(null==a._isValid){var b=j(a);a._isValid=!(isNaN(a._d.getTime())||!(b.overflow<0)||b.empty||b.invalidMonth||b.invalidWeekday||b.nullInput||b.invalidFormat||b.userInvalidated),a._strict&&(a._isValid=a._isValid&&0===b.charsLeftOver&&0===b.unusedTokens.length&&void 0===b.bigHour)}return a._isValid}function l(a){var b=h(NaN);return null!=a?g(j(b),a):j(b).userInvalidated=!0,b}function m(a,b){var c,d,e;if("undefined"!=typeof b._isAMomentObject&&(a._isAMomentObject=b._isAMomentObject),"undefined"!=typeof b._i&&(a._i=b._i),"undefined"!=typeof b._f&&(a._f=b._f),"undefined"!=typeof b._l&&(a._l=b._l),"undefined"!=typeof b._strict&&(a._strict=b._strict),"undefined"!=typeof b._tzm&&(a._tzm=b._tzm),"undefined"!=typeof b._isUTC&&(a._isUTC=b._isUTC),"undefined"!=typeof b._offset&&(a._offset=b._offset),"undefined"!=typeof b._pf&&(a._pf=j(b)),"undefined"!=typeof b._locale&&(a._locale=b._locale),Jc.length>0)for(c in Jc)d=Jc[c],e=b[d],"undefined"!=typeof e&&(a[d]=e);return a}function n(b){m(this,b),this._d=new Date(null!=b._d?b._d.getTime():NaN),Kc===!1&&(Kc=!0,a.updateOffset(this),Kc=!1)}function o(a){return a instanceof n||null!=a&&null!=a._isAMomentObject}function p(a){return 0>a?Math.ceil(a):Math.floor(a)}function q(a){var b=+a,c=0;return 0!==b&&isFinite(b)&&(c=p(b)),c}function r(a,b,c){var d,e=Math.min(a.length,b.length),f=Math.abs(a.length-b.length),g=0;for(d=0;e>d;d++)(c&&a[d]!==b[d]||!c&&q(a[d])!==q(b[d]))&&g++;return g+f}function s(){}function t(a){return a?a.toLowerCase().replace("_","-"):a}function u(a){for(var b,c,d,e,f=0;f<a.length;){for(e=t(a[f]).split("-"),b=e.length,c=t(a[f+1]),c=c?c.split("-"):null;b>0;){if(d=v(e.slice(0,b).join("-")))return d;if(c&&c.length>=b&&r(e,c,!0)>=b-1)break;b--}f++}return null}function v(a){var b=null;if(!Lc[a]&&"undefined"!=typeof module&&module&&module.exports)try{b=Ic._abbr,require("./locale/"+a),w(b)}catch(c){}return Lc[a]}function w(a,b){var c;return a&&(c="undefined"==typeof b?y(a):x(a,b),c&&(Ic=c)),Ic._abbr}function x(a,b){return null!==b?(b.abbr=a,Lc[a]=Lc[a]||new s,Lc[a].set(b),w(a),Lc[a]):(delete Lc[a],null)}function y(a){var b;if(a&&a._locale&&a._locale._abbr&&(a=a._locale._abbr),!a)return Ic;if(!c(a)){if(b=v(a))return b;a=[a]}return u(a)}function z(a,b){var c=a.toLowerCase();Mc[c]=Mc[c+"s"]=Mc[b]=a}function A(a){return"string"==typeof a?Mc[a]||Mc[a.toLowerCase()]:void 0}function B(a){var b,c,d={};for(c in a)f(a,c)&&(b=A(c),b&&(d[b]=a[c]));return d}function C(b,c){return function(d){return null!=d?(E(this,b,d),a.updateOffset(this,c),this):D(this,b)}}function D(a,b){return a._d["get"+(a._isUTC?"UTC":"")+b]()}function E(a,b,c){return a._d["set"+(a._isUTC?"UTC":"")+b](c)}function F(a,b){var c;if("object"==typeof a)for(c in a)this.set(c,a[c]);else if(a=A(a),"function"==typeof this[a])return this[a](b);return this}function G(a,b,c){var d=""+Math.abs(a),e=b-d.length,f=a>=0;return(f?c?"+":"":"-")+Math.pow(10,Math.max(0,e)).toString().substr(1)+d}function H(a,b,c,d){var e=d;"string"==typeof d&&(e=function(){return this[d]()}),a&&(Qc[a]=e),b&&(Qc[b[0]]=function(){return G(e.apply(this,arguments),b[1],b[2])}),c&&(Qc[c]=function(){return this.localeData().ordinal(e.apply(this,arguments),a)})}function I(a){return a.match(/\[[\s\S]/)?a.replace(/^\[|\]$/g,""):a.replace(/\\/g,"")}function J(a){var b,c,d=a.match(Nc);for(b=0,c=d.length;c>b;b++)Qc[d[b]]?d[b]=Qc[d[b]]:d[b]=I(d[b]);return function(e){var f="";for(b=0;c>b;b++)f+=d[b]instanceof Function?d[b].call(e,a):d[b];return f}}function K(a,b){return a.isValid()?(b=L(b,a.localeData()),Pc[b]=Pc[b]||J(b),Pc[b](a)):a.localeData().invalidDate()}function L(a,b){function c(a){return b.longDateFormat(a)||a}var d=5;for(Oc.lastIndex=0;d>=0&&Oc.test(a);)a=a.replace(Oc,c),Oc.lastIndex=0,d-=1;return a}function M(a){return"function"==typeof a&&"[object Function]"===Object.prototype.toString.call(a)}function N(a,b,c){dd[a]=M(b)?b:function(a){return a&&c?c:b}}function O(a,b){return f(dd,a)?dd[a](b._strict,b._locale):new RegExp(P(a))}function P(a){return a.replace("\\","").replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g,function(a,b,c,d,e){return b||c||d||e}).replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&")}function Q(a,b){var c,d=b;for("string"==typeof a&&(a=[a]),"number"==typeof b&&(d=function(a,c){c[b]=q(a)}),c=0;c<a.length;c++)ed[a[c]]=d}function R(a,b){Q(a,function(a,c,d,e){d._w=d._w||{},b(a,d._w,d,e)})}function S(a,b,c){null!=b&&f(ed,a)&&ed[a](b,c._a,c,a)}function T(a,b){return new Date(Date.UTC(a,b+1,0)).getUTCDate()}function U(a){return this._months[a.month()]}function V(a){return this._monthsShort[a.month()]}function W(a,b,c){var d,e,f;for(this._monthsParse||(this._monthsParse=[],this._longMonthsParse=[],this._shortMonthsParse=[]),d=0;12>d;d++){if(e=h([2e3,d]),c&&!this._longMonthsParse[d]&&(this._longMonthsParse[d]=new RegExp("^"+this.months(e,"").replace(".","")+"$","i"),this._shortMonthsParse[d]=new RegExp("^"+this.monthsShort(e,"").replace(".","")+"$","i")),c||this._monthsParse[d]||(f="^"+this.months(e,"")+"|^"+this.monthsShort(e,""),this._monthsParse[d]=new RegExp(f.replace(".",""),"i")),c&&"MMMM"===b&&this._longMonthsParse[d].test(a))return d;if(c&&"MMM"===b&&this._shortMonthsParse[d].test(a))return d;if(!c&&this._monthsParse[d].test(a))return d}}function X(a,b){var c;return"string"==typeof b&&(b=a.localeData().monthsParse(b),"number"!=typeof b)?a:(c=Math.min(a.date(),T(a.year(),b)),a._d["set"+(a._isUTC?"UTC":"")+"Month"](b,c),a)}function Y(b){return null!=b?(X(this,b),a.updateOffset(this,!0),this):D(this,"Month")}function Z(){return T(this.year(),this.month())}function $(a){var b,c=a._a;return c&&-2===j(a).overflow&&(b=c[gd]<0||c[gd]>11?gd:c[hd]<1||c[hd]>T(c[fd],c[gd])?hd:c[id]<0||c[id]>24||24===c[id]&&(0!==c[jd]||0!==c[kd]||0!==c[ld])?id:c[jd]<0||c[jd]>59?jd:c[kd]<0||c[kd]>59?kd:c[ld]<0||c[ld]>999?ld:-1,j(a)._overflowDayOfYear&&(fd>b||b>hd)&&(b=hd),j(a).overflow=b),a}function _(b){a.suppressDeprecationWarnings===!1&&"undefined"!=typeof console&&console.warn&&console.warn("Deprecation warning: "+b)}function aa(a,b){var c=!0;return g(function(){return c&&(_(a+"\n"+(new Error).stack),c=!1),b.apply(this,arguments)},b)}function ba(a,b){od[a]||(_(b),od[a]=!0)}function ca(a){var b,c,d=a._i,e=pd.exec(d);if(e){for(j(a).iso=!0,b=0,c=qd.length;c>b;b++)if(qd[b][1].exec(d)){a._f=qd[b][0];break}for(b=0,c=rd.length;c>b;b++)if(rd[b][1].exec(d)){a._f+=(e[6]||" ")+rd[b][0];break}d.match(ad)&&(a._f+="Z"),va(a)}else a._isValid=!1}function da(b){var c=sd.exec(b._i);return null!==c?void(b._d=new Date(+c[1])):(ca(b),void(b._isValid===!1&&(delete b._isValid,a.createFromInputFallback(b))))}function ea(a,b,c,d,e,f,g){var h=new Date(a,b,c,d,e,f,g);return 1970>a&&h.setFullYear(a),h}function fa(a){var b=new Date(Date.UTC.apply(null,arguments));return 1970>a&&b.setUTCFullYear(a),b}function ga(a){return ha(a)?366:365}function ha(a){return a%4===0&&a%100!==0||a%400===0}function ia(){return ha(this.year())}function ja(a,b,c){var d,e=c-b,f=c-a.day();return f>e&&(f-=7),e-7>f&&(f+=7),d=Da(a).add(f,"d"),{week:Math.ceil(d.dayOfYear()/7),year:d.year()}}function ka(a){return ja(a,this._week.dow,this._week.doy).week}function la(){return this._week.dow}function ma(){return this._week.doy}function na(a){var b=this.localeData().week(this);return null==a?b:this.add(7*(a-b),"d")}function oa(a){var b=ja(this,1,4).week;return null==a?b:this.add(7*(a-b),"d")}function pa(a,b,c,d,e){var f,g=6+e-d,h=fa(a,0,1+g),i=h.getUTCDay();return e>i&&(i+=7),c=null!=c?1*c:e,f=1+g+7*(b-1)-i+c,{year:f>0?a:a-1,dayOfYear:f>0?f:ga(a-1)+f}}function qa(a){var b=Math.round((this.clone().startOf("day")-this.clone().startOf("year"))/864e5)+1;return null==a?b:this.add(a-b,"d")}function ra(a,b,c){return null!=a?a:null!=b?b:c}function sa(a){var b=new Date;return a._useUTC?[b.getUTCFullYear(),b.getUTCMonth(),b.getUTCDate()]:[b.getFullYear(),b.getMonth(),b.getDate()]}function ta(a){var b,c,d,e,f=[];if(!a._d){for(d=sa(a),a._w&&null==a._a[hd]&&null==a._a[gd]&&ua(a),a._dayOfYear&&(e=ra(a._a[fd],d[fd]),a._dayOfYear>ga(e)&&(j(a)._overflowDayOfYear=!0),c=fa(e,0,a._dayOfYear),a._a[gd]=c.getUTCMonth(),a._a[hd]=c.getUTCDate()),b=0;3>b&&null==a._a[b];++b)a._a[b]=f[b]=d[b];for(;7>b;b++)a._a[b]=f[b]=null==a._a[b]?2===b?1:0:a._a[b];24===a._a[id]&&0===a._a[jd]&&0===a._a[kd]&&0===a._a[ld]&&(a._nextDay=!0,a._a[id]=0),a._d=(a._useUTC?fa:ea).apply(null,f),null!=a._tzm&&a._d.setUTCMinutes(a._d.getUTCMinutes()-a._tzm),a._nextDay&&(a._a[id]=24)}}function ua(a){var b,c,d,e,f,g,h;b=a._w,null!=b.GG||null!=b.W||null!=b.E?(f=1,g=4,c=ra(b.GG,a._a[fd],ja(Da(),1,4).year),d=ra(b.W,1),e=ra(b.E,1)):(f=a._locale._week.dow,g=a._locale._week.doy,c=ra(b.gg,a._a[fd],ja(Da(),f,g).year),d=ra(b.w,1),null!=b.d?(e=b.d,f>e&&++d):e=null!=b.e?b.e+f:f),h=pa(c,d,e,g,f),a._a[fd]=h.year,a._dayOfYear=h.dayOfYear}function va(b){if(b._f===a.ISO_8601)return void ca(b);b._a=[],j(b).empty=!0;var c,d,e,f,g,h=""+b._i,i=h.length,k=0;for(e=L(b._f,b._locale).match(Nc)||[],c=0;c<e.length;c++)f=e[c],d=(h.match(O(f,b))||[])[0],d&&(g=h.substr(0,h.indexOf(d)),g.length>0&&j(b).unusedInput.push(g),h=h.slice(h.indexOf(d)+d.length),k+=d.length),Qc[f]?(d?j(b).empty=!1:j(b).unusedTokens.push(f),S(f,d,b)):b._strict&&!d&&j(b).unusedTokens.push(f);j(b).charsLeftOver=i-k,h.length>0&&j(b).unusedInput.push(h),j(b).bigHour===!0&&b._a[id]<=12&&b._a[id]>0&&(j(b).bigHour=void 0),b._a[id]=wa(b._locale,b._a[id],b._meridiem),ta(b),$(b)}function wa(a,b,c){var d;return null==c?b:null!=a.meridiemHour?a.meridiemHour(b,c):null!=a.isPM?(d=a.isPM(c),d&&12>b&&(b+=12),d||12!==b||(b=0),b):b}function xa(a){var b,c,d,e,f;if(0===a._f.length)return j(a).invalidFormat=!0,void(a._d=new Date(NaN));for(e=0;e<a._f.length;e++)f=0,b=m({},a),null!=a._useUTC&&(b._useUTC=a._useUTC),b._f=a._f[e],va(b),k(b)&&(f+=j(b).charsLeftOver,f+=10*j(b).unusedTokens.length,j(b).score=f,(null==d||d>f)&&(d=f,c=b));g(a,c||b)}function ya(a){if(!a._d){var b=B(a._i);a._a=[b.year,b.month,b.day||b.date,b.hour,b.minute,b.second,b.millisecond],ta(a)}}function za(a){var b=new n($(Aa(a)));return b._nextDay&&(b.add(1,"d"),b._nextDay=void 0),b}function Aa(a){var b=a._i,e=a._f;return a._locale=a._locale||y(a._l),null===b||void 0===e&&""===b?l({nullInput:!0}):("string"==typeof b&&(a._i=b=a._locale.preparse(b)),o(b)?new n($(b)):(c(e)?xa(a):e?va(a):d(b)?a._d=b:Ba(a),a))}function Ba(b){var f=b._i;void 0===f?b._d=new Date:d(f)?b._d=new Date(+f):"string"==typeof f?da(b):c(f)?(b._a=e(f.slice(0),function(a){return parseInt(a,10)}),ta(b)):"object"==typeof f?ya(b):"number"==typeof f?b._d=new Date(f):a.createFromInputFallback(b)}function Ca(a,b,c,d,e){var f={};return"boolean"==typeof c&&(d=c,c=void 0),f._isAMomentObject=!0,f._useUTC=f._isUTC=e,f._l=c,f._i=a,f._f=b,f._strict=d,za(f)}function Da(a,b,c,d){return Ca(a,b,c,d,!1)}function Ea(a,b){var d,e;if(1===b.length&&c(b[0])&&(b=b[0]),!b.length)return Da();for(d=b[0],e=1;e<b.length;++e)(!b[e].isValid()||b[e][a](d))&&(d=b[e]);return d}function Fa(){var a=[].slice.call(arguments,0);return Ea("isBefore",a)}function Ga(){var a=[].slice.call(arguments,0);return Ea("isAfter",a)}function Ha(a){var b=B(a),c=b.year||0,d=b.quarter||0,e=b.month||0,f=b.week||0,g=b.day||0,h=b.hour||0,i=b.minute||0,j=b.second||0,k=b.millisecond||0;this._milliseconds=+k+1e3*j+6e4*i+36e5*h,this._days=+g+7*f,this._months=+e+3*d+12*c,this._data={},this._locale=y(),this._bubble()}function Ia(a){return a instanceof Ha}function Ja(a,b){H(a,0,0,function(){var a=this.utcOffset(),c="+";return 0>a&&(a=-a,c="-"),c+G(~~(a/60),2)+b+G(~~a%60,2)})}function Ka(a){var b=(a||"").match(ad)||[],c=b[b.length-1]||[],d=(c+"").match(xd)||["-",0,0],e=+(60*d[1])+q(d[2]);return"+"===d[0]?e:-e}function La(b,c){var e,f;return c._isUTC?(e=c.clone(),f=(o(b)||d(b)?+b:+Da(b))-+e,e._d.setTime(+e._d+f),a.updateOffset(e,!1),e):Da(b).local()}function Ma(a){return 15*-Math.round(a._d.getTimezoneOffset()/15)}function Na(b,c){var d,e=this._offset||0;return null!=b?("string"==typeof b&&(b=Ka(b)),Math.abs(b)<16&&(b=60*b),!this._isUTC&&c&&(d=Ma(this)),this._offset=b,this._isUTC=!0,null!=d&&this.add(d,"m"),e!==b&&(!c||this._changeInProgress?bb(this,Ya(b-e,"m"),1,!1):this._changeInProgress||(this._changeInProgress=!0,a.updateOffset(this,!0),this._changeInProgress=null)),this):this._isUTC?e:Ma(this)}function Oa(a,b){return null!=a?("string"!=typeof a&&(a=-a),this.utcOffset(a,b),this):-this.utcOffset()}function Pa(a){return this.utcOffset(0,a)}function Qa(a){return this._isUTC&&(this.utcOffset(0,a),this._isUTC=!1,a&&this.subtract(Ma(this),"m")),this}function Ra(){return this._tzm?this.utcOffset(this._tzm):"string"==typeof this._i&&this.utcOffset(Ka(this._i)),this}function Sa(a){return a=a?Da(a).utcOffset():0,(this.utcOffset()-a)%60===0}function Ta(){return this.utcOffset()>this.clone().month(0).utcOffset()||this.utcOffset()>this.clone().month(5).utcOffset()}function Ua(){if("undefined"!=typeof this._isDSTShifted)return this._isDSTShifted;var a={};if(m(a,this),a=Aa(a),a._a){var b=a._isUTC?h(a._a):Da(a._a);this._isDSTShifted=this.isValid()&&r(a._a,b.toArray())>0}else this._isDSTShifted=!1;return this._isDSTShifted}function Va(){return!this._isUTC}function Wa(){return this._isUTC}function Xa(){return this._isUTC&&0===this._offset}function Ya(a,b){var c,d,e,g=a,h=null;return Ia(a)?g={ms:a._milliseconds,d:a._days,M:a._months}:"number"==typeof a?(g={},b?g[b]=a:g.milliseconds=a):(h=yd.exec(a))?(c="-"===h[1]?-1:1,g={y:0,d:q(h[hd])*c,h:q(h[id])*c,m:q(h[jd])*c,s:q(h[kd])*c,ms:q(h[ld])*c}):(h=zd.exec(a))?(c="-"===h[1]?-1:1,g={y:Za(h[2],c),M:Za(h[3],c),d:Za(h[4],c),h:Za(h[5],c),m:Za(h[6],c),s:Za(h[7],c),w:Za(h[8],c)}):null==g?g={}:"object"==typeof g&&("from"in g||"to"in g)&&(e=_a(Da(g.from),Da(g.to)),g={},g.ms=e.milliseconds,g.M=e.months),d=new Ha(g),Ia(a)&&f(a,"_locale")&&(d._locale=a._locale),d}function Za(a,b){var c=a&&parseFloat(a.replace(",","."));return(isNaN(c)?0:c)*b}function $a(a,b){var c={milliseconds:0,months:0};return c.months=b.month()-a.month()+12*(b.year()-a.year()),a.clone().add(c.months,"M").isAfter(b)&&--c.months,c.milliseconds=+b-+a.clone().add(c.months,"M"),c}function _a(a,b){var c;return b=La(b,a),a.isBefore(b)?c=$a(a,b):(c=$a(b,a),c.milliseconds=-c.milliseconds,c.months=-c.months),c}function ab(a,b){return function(c,d){var e,f;return null===d||isNaN(+d)||(ba(b,"moment()."+b+"(period, number) is deprecated. Please use moment()."+b+"(number, period)."),f=c,c=d,d=f),c="string"==typeof c?+c:c,e=Ya(c,d),bb(this,e,a),this}}function bb(b,c,d,e){var f=c._milliseconds,g=c._days,h=c._months;e=null==e?!0:e,f&&b._d.setTime(+b._d+f*d),g&&E(b,"Date",D(b,"Date")+g*d),h&&X(b,D(b,"Month")+h*d),e&&a.updateOffset(b,g||h)}function cb(a,b){var c=a||Da(),d=La(c,this).startOf("day"),e=this.diff(d,"days",!0),f=-6>e?"sameElse":-1>e?"lastWeek":0>e?"lastDay":1>e?"sameDay":2>e?"nextDay":7>e?"nextWeek":"sameElse";return this.format(b&&b[f]||this.localeData().calendar(f,this,Da(c)))}function db(){return new n(this)}function eb(a,b){var c;return b=A("undefined"!=typeof b?b:"millisecond"),"millisecond"===b?(a=o(a)?a:Da(a),+this>+a):(c=o(a)?+a:+Da(a),c<+this.clone().startOf(b))}function fb(a,b){var c;return b=A("undefined"!=typeof b?b:"millisecond"),"millisecond"===b?(a=o(a)?a:Da(a),+a>+this):(c=o(a)?+a:+Da(a),+this.clone().endOf(b)<c)}function gb(a,b,c){return this.isAfter(a,c)&&this.isBefore(b,c)}function hb(a,b){var c;return b=A(b||"millisecond"),"millisecond"===b?(a=o(a)?a:Da(a),+this===+a):(c=+Da(a),+this.clone().startOf(b)<=c&&c<=+this.clone().endOf(b))}function ib(a,b,c){var d,e,f=La(a,this),g=6e4*(f.utcOffset()-this.utcOffset());return b=A(b),"year"===b||"month"===b||"quarter"===b?(e=jb(this,f),"quarter"===b?e/=3:"year"===b&&(e/=12)):(d=this-f,e="second"===b?d/1e3:"minute"===b?d/6e4:"hour"===b?d/36e5:"day"===b?(d-g)/864e5:"week"===b?(d-g)/6048e5:d),c?e:p(e)}function jb(a,b){var c,d,e=12*(b.year()-a.year())+(b.month()-a.month()),f=a.clone().add(e,"months");return 0>b-f?(c=a.clone().add(e-1,"months"),d=(b-f)/(f-c)):(c=a.clone().add(e+1,"months"),d=(b-f)/(c-f)),-(e+d)}function kb(){return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")}function lb(){var a=this.clone().utc();return 0<a.year()&&a.year()<=9999?"function"==typeof Date.prototype.toISOString?this.toDate().toISOString():K(a,"YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"):K(a,"YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]")}function mb(b){var c=K(this,b||a.defaultFormat);return this.localeData().postformat(c)}function nb(a,b){return this.isValid()?Ya({to:this,from:a}).locale(this.locale()).humanize(!b):this.localeData().invalidDate()}function ob(a){return this.from(Da(),a)}function pb(a,b){return this.isValid()?Ya({from:this,to:a}).locale(this.locale()).humanize(!b):this.localeData().invalidDate()}function qb(a){return this.to(Da(),a)}function rb(a){var b;return void 0===a?this._locale._abbr:(b=y(a),null!=b&&(this._locale=b),this)}function sb(){return this._locale}function tb(a){switch(a=A(a)){case"year":this.month(0);case"quarter":case"month":this.date(1);case"week":case"isoWeek":case"day":this.hours(0);case"hour":this.minutes(0);case"minute":this.seconds(0);case"second":this.milliseconds(0)}return"week"===a&&this.weekday(0),"isoWeek"===a&&this.isoWeekday(1),"quarter"===a&&this.month(3*Math.floor(this.month()/3)),this}function ub(a){return a=A(a),void 0===a||"millisecond"===a?this:this.startOf(a).add(1,"isoWeek"===a?"week":a).subtract(1,"ms")}function vb(){return+this._d-6e4*(this._offset||0)}function wb(){return Math.floor(+this/1e3)}function xb(){return this._offset?new Date(+this):this._d}function yb(){var a=this;return[a.year(),a.month(),a.date(),a.hour(),a.minute(),a.second(),a.millisecond()]}function zb(){var a=this;return{years:a.year(),months:a.month(),date:a.date(),hours:a.hours(),minutes:a.minutes(),seconds:a.seconds(),milliseconds:a.milliseconds()}}function Ab(){return k(this)}function Bb(){return g({},j(this))}function Cb(){return j(this).overflow}function Db(a,b){H(0,[a,a.length],0,b)}function Eb(a,b,c){return ja(Da([a,11,31+b-c]),b,c).week}function Fb(a){var b=ja(this,this.localeData()._week.dow,this.localeData()._week.doy).year;return null==a?b:this.add(a-b,"y")}function Gb(a){var b=ja(this,1,4).year;return null==a?b:this.add(a-b,"y")}function Hb(){return Eb(this.year(),1,4)}function Ib(){var a=this.localeData()._week;return Eb(this.year(),a.dow,a.doy)}function Jb(a){return null==a?Math.ceil((this.month()+1)/3):this.month(3*(a-1)+this.month()%3)}function Kb(a,b){return"string"!=typeof a?a:isNaN(a)?(a=b.weekdaysParse(a),"number"==typeof a?a:null):parseInt(a,10)}function Lb(a){return this._weekdays[a.day()]}function Mb(a){return this._weekdaysShort[a.day()]}function Nb(a){return this._weekdaysMin[a.day()]}function Ob(a){var b,c,d;for(this._weekdaysParse=this._weekdaysParse||[],b=0;7>b;b++)if(this._weekdaysParse[b]||(c=Da([2e3,1]).day(b),d="^"+this.weekdays(c,"")+"|^"+this.weekdaysShort(c,"")+"|^"+this.weekdaysMin(c,""),this._weekdaysParse[b]=new RegExp(d.replace(".",""),"i")),this._weekdaysParse[b].test(a))return b}function Pb(a){var b=this._isUTC?this._d.getUTCDay():this._d.getDay();return null!=a?(a=Kb(a,this.localeData()),this.add(a-b,"d")):b}function Qb(a){var b=(this.day()+7-this.localeData()._week.dow)%7;return null==a?b:this.add(a-b,"d")}function Rb(a){return null==a?this.day()||7:this.day(this.day()%7?a:a-7)}function Sb(a,b){H(a,0,0,function(){return this.localeData().meridiem(this.hours(),this.minutes(),b)})}function Tb(a,b){return b._meridiemParse}function Ub(a){return"p"===(a+"").toLowerCase().charAt(0)}function Vb(a,b,c){return a>11?c?"pm":"PM":c?"am":"AM"}function Wb(a,b){b[ld]=q(1e3*("0."+a))}function Xb(){return this._isUTC?"UTC":""}function Yb(){return this._isUTC?"Coordinated Universal Time":""}function Zb(a){return Da(1e3*a)}function $b(){return Da.apply(null,arguments).parseZone()}function _b(a,b,c){var d=this._calendar[a];return"function"==typeof d?d.call(b,c):d}function ac(a){var b=this._longDateFormat[a],c=this._longDateFormat[a.toUpperCase()];return b||!c?b:(this._longDateFormat[a]=c.replace(/MMMM|MM|DD|dddd/g,function(a){return a.slice(1)}),this._longDateFormat[a])}function bc(){return this._invalidDate}function cc(a){return this._ordinal.replace("%d",a)}function dc(a){return a}function ec(a,b,c,d){var e=this._relativeTime[c];return"function"==typeof e?e(a,b,c,d):e.replace(/%d/i,a)}function fc(a,b){var c=this._relativeTime[a>0?"future":"past"];return"function"==typeof c?c(b):c.replace(/%s/i,b)}function gc(a){var b,c;for(c in a)b=a[c],"function"==typeof b?this[c]=b:this["_"+c]=b;this._ordinalParseLenient=new RegExp(this._ordinalParse.source+"|"+/\d{1,2}/.source)}function hc(a,b,c,d){var e=y(),f=h().set(d,b);return e[c](f,a)}function ic(a,b,c,d,e){if("number"==typeof a&&(b=a,a=void 0),a=a||"",null!=b)return hc(a,b,c,e);var f,g=[];for(f=0;d>f;f++)g[f]=hc(a,f,c,e);return g}function jc(a,b){return ic(a,b,"months",12,"month")}function kc(a,b){return ic(a,b,"monthsShort",12,"month")}function lc(a,b){return ic(a,b,"weekdays",7,"day")}function mc(a,b){return ic(a,b,"weekdaysShort",7,"day")}function nc(a,b){return ic(a,b,"weekdaysMin",7,"day")}function oc(){var a=this._data;return this._milliseconds=Wd(this._milliseconds),this._days=Wd(this._days),this._months=Wd(this._months),a.milliseconds=Wd(a.milliseconds),a.seconds=Wd(a.seconds),a.minutes=Wd(a.minutes),a.hours=Wd(a.hours),a.months=Wd(a.months),a.years=Wd(a.years),this}function pc(a,b,c,d){var e=Ya(b,c);return a._milliseconds+=d*e._milliseconds,a._days+=d*e._days,a._months+=d*e._months,a._bubble()}function qc(a,b){return pc(this,a,b,1)}function rc(a,b){return pc(this,a,b,-1)}function sc(a){return 0>a?Math.floor(a):Math.ceil(a)}function tc(){var a,b,c,d,e,f=this._milliseconds,g=this._days,h=this._months,i=this._data;return f>=0&&g>=0&&h>=0||0>=f&&0>=g&&0>=h||(f+=864e5*sc(vc(h)+g),g=0,h=0),i.milliseconds=f%1e3,a=p(f/1e3),i.seconds=a%60,b=p(a/60),i.minutes=b%60,c=p(b/60),i.hours=c%24,g+=p(c/24),e=p(uc(g)),h+=e,g-=sc(vc(e)),d=p(h/12),h%=12,i.days=g,i.months=h,i.years=d,this}function uc(a){return 4800*a/146097}function vc(a){return 146097*a/4800}function wc(a){var b,c,d=this._milliseconds;if(a=A(a),"month"===a||"year"===a)return b=this._days+d/864e5,c=this._months+uc(b),"month"===a?c:c/12;switch(b=this._days+Math.round(vc(this._months)),a){case"week":return b/7+d/6048e5;case"day":return b+d/864e5;case"hour":return 24*b+d/36e5;case"minute":return 1440*b+d/6e4;case"second":return 86400*b+d/1e3;case"millisecond":return Math.floor(864e5*b)+d;default:throw new Error("Unknown unit "+a)}}function xc(){return this._milliseconds+864e5*this._days+this._months%12*2592e6+31536e6*q(this._months/12)}function yc(a){return function(){return this.as(a)}}function zc(a){return a=A(a),this[a+"s"]()}function Ac(a){return function(){return this._data[a]}}function Bc(){return p(this.days()/7)}function Cc(a,b,c,d,e){return e.relativeTime(b||1,!!c,a,d)}function Dc(a,b,c){var d=Ya(a).abs(),e=ke(d.as("s")),f=ke(d.as("m")),g=ke(d.as("h")),h=ke(d.as("d")),i=ke(d.as("M")),j=ke(d.as("y")),k=e<le.s&&["s",e]||1===f&&["m"]||f<le.m&&["mm",f]||1===g&&["h"]||g<le.h&&["hh",g]||1===h&&["d"]||h<le.d&&["dd",h]||1===i&&["M"]||i<le.M&&["MM",i]||1===j&&["y"]||["yy",j];return k[2]=b,k[3]=+a>0,k[4]=c,Cc.apply(null,k)}function Ec(a,b){return void 0===le[a]?!1:void 0===b?le[a]:(le[a]=b,!0)}function Fc(a){var b=this.localeData(),c=Dc(this,!a,b);return a&&(c=b.pastFuture(+this,c)),b.postformat(c)}function Gc(){var a,b,c,d=me(this._milliseconds)/1e3,e=me(this._days),f=me(this._months);a=p(d/60),b=p(a/60),d%=60,a%=60,c=p(f/12),f%=12;var g=c,h=f,i=e,j=b,k=a,l=d,m=this.asSeconds();return m?(0>m?"-":"")+"P"+(g?g+"Y":"")+(h?h+"M":"")+(i?i+"D":"")+(j||k||l?"T":"")+(j?j+"H":"")+(k?k+"M":"")+(l?l+"S":""):"P0D"}var Hc,Ic,Jc=a.momentProperties=[],Kc=!1,Lc={},Mc={},Nc=/(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g,Oc=/(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,Pc={},Qc={},Rc=/\d/,Sc=/\d\d/,Tc=/\d{3}/,Uc=/\d{4}/,Vc=/[+-]?\d{6}/,Wc=/\d\d?/,Xc=/\d{1,3}/,Yc=/\d{1,4}/,Zc=/[+-]?\d{1,6}/,$c=/\d+/,_c=/[+-]?\d+/,ad=/Z|[+-]\d\d:?\d\d/gi,bd=/[+-]?\d+(\.\d{1,3})?/,cd=/[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i,dd={},ed={},fd=0,gd=1,hd=2,id=3,jd=4,kd=5,ld=6;H("M",["MM",2],"Mo",function(){return this.month()+1}),H("MMM",0,0,function(a){return this.localeData().monthsShort(this,a)}),H("MMMM",0,0,function(a){return this.localeData().months(this,a)}),z("month","M"),N("M",Wc),N("MM",Wc,Sc),N("MMM",cd),N("MMMM",cd),Q(["M","MM"],function(a,b){b[gd]=q(a)-1}),Q(["MMM","MMMM"],function(a,b,c,d){var e=c._locale.monthsParse(a,d,c._strict);null!=e?b[gd]=e:j(c).invalidMonth=a});var md="January_February_March_April_May_June_July_August_September_October_November_December".split("_"),nd="Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),od={};a.suppressDeprecationWarnings=!1;var pd=/^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,qd=[["YYYYYY-MM-DD",/[+-]\d{6}-\d{2}-\d{2}/],["YYYY-MM-DD",/\d{4}-\d{2}-\d{2}/],["GGGG-[W]WW-E",/\d{4}-W\d{2}-\d/],["GGGG-[W]WW",/\d{4}-W\d{2}/],["YYYY-DDD",/\d{4}-\d{3}/]],rd=[["HH:mm:ss.SSSS",/(T| )\d\d:\d\d:\d\d\.\d+/],["HH:mm:ss",/(T| )\d\d:\d\d:\d\d/],["HH:mm",/(T| )\d\d:\d\d/],["HH",/(T| )\d\d/]],sd=/^\/?Date\((\-?\d+)/i;a.createFromInputFallback=aa("moment construction falls back to js Date. This is discouraged and will be removed in upcoming major release. Please refer to https://github.com/moment/moment/issues/1407 for more info.",function(a){a._d=new Date(a._i+(a._useUTC?" UTC":""))}),H(0,["YY",2],0,function(){return this.year()%100}),H(0,["YYYY",4],0,"year"),H(0,["YYYYY",5],0,"year"),H(0,["YYYYYY",6,!0],0,"year"),z("year","y"),N("Y",_c),N("YY",Wc,Sc),N("YYYY",Yc,Uc),N("YYYYY",Zc,Vc),N("YYYYYY",Zc,Vc),Q(["YYYYY","YYYYYY"],fd),Q("YYYY",function(b,c){c[fd]=2===b.length?a.parseTwoDigitYear(b):q(b)}),Q("YY",function(b,c){c[fd]=a.parseTwoDigitYear(b)}),a.parseTwoDigitYear=function(a){return q(a)+(q(a)>68?1900:2e3)};var td=C("FullYear",!1);H("w",["ww",2],"wo","week"),H("W",["WW",2],"Wo","isoWeek"),z("week","w"),z("isoWeek","W"),N("w",Wc),N("ww",Wc,Sc),N("W",Wc),N("WW",Wc,Sc),R(["w","ww","W","WW"],function(a,b,c,d){b[d.substr(0,1)]=q(a)});var ud={dow:0,doy:6};H("DDD",["DDDD",3],"DDDo","dayOfYear"),z("dayOfYear","DDD"),N("DDD",Xc),N("DDDD",Tc),Q(["DDD","DDDD"],function(a,b,c){c._dayOfYear=q(a)}),a.ISO_8601=function(){};var vd=aa("moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548",function(){var a=Da.apply(null,arguments);return this>a?this:a}),wd=aa("moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548",function(){var a=Da.apply(null,arguments);return a>this?this:a});Ja("Z",":"),Ja("ZZ",""),N("Z",ad),N("ZZ",ad),Q(["Z","ZZ"],function(a,b,c){c._useUTC=!0,c._tzm=Ka(a)});var xd=/([\+\-]|\d\d)/gi;a.updateOffset=function(){};var yd=/(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/,zd=/^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/;Ya.fn=Ha.prototype;var Ad=ab(1,"add"),Bd=ab(-1,"subtract");a.defaultFormat="YYYY-MM-DDTHH:mm:ssZ";var Cd=aa("moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.",function(a){return void 0===a?this.localeData():this.locale(a)});H(0,["gg",2],0,function(){return this.weekYear()%100}),H(0,["GG",2],0,function(){return this.isoWeekYear()%100}),Db("gggg","weekYear"),Db("ggggg","weekYear"),Db("GGGG","isoWeekYear"),Db("GGGGG","isoWeekYear"),z("weekYear","gg"),z("isoWeekYear","GG"),N("G",_c),N("g",_c),N("GG",Wc,Sc),N("gg",Wc,Sc),N("GGGG",Yc,Uc),N("gggg",Yc,Uc),N("GGGGG",Zc,Vc),N("ggggg",Zc,Vc),R(["gggg","ggggg","GGGG","GGGGG"],function(a,b,c,d){b[d.substr(0,2)]=q(a)}),R(["gg","GG"],function(b,c,d,e){c[e]=a.parseTwoDigitYear(b)}),H("Q",0,0,"quarter"),z("quarter","Q"),N("Q",Rc),Q("Q",function(a,b){b[gd]=3*(q(a)-1)}),H("D",["DD",2],"Do","date"),z("date","D"),N("D",Wc),N("DD",Wc,Sc),N("Do",function(a,b){return a?b._ordinalParse:b._ordinalParseLenient}),Q(["D","DD"],hd),Q("Do",function(a,b){b[hd]=q(a.match(Wc)[0],10)});var Dd=C("Date",!0);H("d",0,"do","day"),H("dd",0,0,function(a){return this.localeData().weekdaysMin(this,a)}),H("ddd",0,0,function(a){return this.localeData().weekdaysShort(this,a)}),H("dddd",0,0,function(a){return this.localeData().weekdays(this,a)}),H("e",0,0,"weekday"),H("E",0,0,"isoWeekday"),z("day","d"),z("weekday","e"),z("isoWeekday","E"),N("d",Wc),N("e",Wc),N("E",Wc),N("dd",cd),N("ddd",cd),N("dddd",cd),R(["dd","ddd","dddd"],function(a,b,c){var d=c._locale.weekdaysParse(a);null!=d?b.d=d:j(c).invalidWeekday=a}),R(["d","e","E"],function(a,b,c,d){b[d]=q(a)});var Ed="Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),Fd="Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),Gd="Su_Mo_Tu_We_Th_Fr_Sa".split("_");H("H",["HH",2],0,"hour"),H("h",["hh",2],0,function(){return this.hours()%12||12}),Sb("a",!0),Sb("A",!1),z("hour","h"),N("a",Tb),N("A",Tb),N("H",Wc),N("h",Wc),N("HH",Wc,Sc),N("hh",Wc,Sc),Q(["H","HH"],id),Q(["a","A"],function(a,b,c){c._isPm=c._locale.isPM(a),c._meridiem=a}),Q(["h","hh"],function(a,b,c){b[id]=q(a),j(c).bigHour=!0});var Hd=/[ap]\.?m?\.?/i,Id=C("Hours",!0);H("m",["mm",2],0,"minute"),z("minute","m"),N("m",Wc),N("mm",Wc,Sc),Q(["m","mm"],jd);var Jd=C("Minutes",!1);H("s",["ss",2],0,"second"),z("second","s"),N("s",Wc),N("ss",Wc,Sc),Q(["s","ss"],kd);var Kd=C("Seconds",!1);H("S",0,0,function(){return~~(this.millisecond()/100)}),H(0,["SS",2],0,function(){return~~(this.millisecond()/10)}),H(0,["SSS",3],0,"millisecond"),H(0,["SSSS",4],0,function(){return 10*this.millisecond()}),H(0,["SSSSS",5],0,function(){return 100*this.millisecond()}),H(0,["SSSSSS",6],0,function(){return 1e3*this.millisecond()}),H(0,["SSSSSSS",7],0,function(){return 1e4*this.millisecond()}),H(0,["SSSSSSSS",8],0,function(){return 1e5*this.millisecond()}),H(0,["SSSSSSSSS",9],0,function(){return 1e6*this.millisecond()}),z("millisecond","ms"),N("S",Xc,Rc),N("SS",Xc,Sc),N("SSS",Xc,Tc);var Ld;for(Ld="SSSS";Ld.length<=9;Ld+="S")N(Ld,$c);for(Ld="S";Ld.length<=9;Ld+="S")Q(Ld,Wb);var Md=C("Milliseconds",!1);H("z",0,0,"zoneAbbr"),H("zz",0,0,"zoneName");var Nd=n.prototype;Nd.add=Ad,Nd.calendar=cb,Nd.clone=db,Nd.diff=ib,Nd.endOf=ub,Nd.format=mb,Nd.from=nb,Nd.fromNow=ob,Nd.to=pb,Nd.toNow=qb,Nd.get=F,Nd.invalidAt=Cb,Nd.isAfter=eb,Nd.isBefore=fb,Nd.isBetween=gb,Nd.isSame=hb,Nd.isValid=Ab,Nd.lang=Cd,Nd.locale=rb,Nd.localeData=sb,Nd.max=wd,Nd.min=vd,Nd.parsingFlags=Bb,Nd.set=F,Nd.startOf=tb,Nd.subtract=Bd,Nd.toArray=yb,Nd.toObject=zb,Nd.toDate=xb,Nd.toISOString=lb,Nd.toJSON=lb,Nd.toString=kb,Nd.unix=wb,Nd.valueOf=vb,Nd.year=td,Nd.isLeapYear=ia,Nd.weekYear=Fb,Nd.isoWeekYear=Gb,Nd.quarter=Nd.quarters=Jb,Nd.month=Y,Nd.daysInMonth=Z,Nd.week=Nd.weeks=na,Nd.isoWeek=Nd.isoWeeks=oa,Nd.weeksInYear=Ib,Nd.isoWeeksInYear=Hb,Nd.date=Dd,Nd.day=Nd.days=Pb,Nd.weekday=Qb,Nd.isoWeekday=Rb,Nd.dayOfYear=qa,Nd.hour=Nd.hours=Id,Nd.minute=Nd.minutes=Jd,Nd.second=Nd.seconds=Kd,
Nd.millisecond=Nd.milliseconds=Md,Nd.utcOffset=Na,Nd.utc=Pa,Nd.local=Qa,Nd.parseZone=Ra,Nd.hasAlignedHourOffset=Sa,Nd.isDST=Ta,Nd.isDSTShifted=Ua,Nd.isLocal=Va,Nd.isUtcOffset=Wa,Nd.isUtc=Xa,Nd.isUTC=Xa,Nd.zoneAbbr=Xb,Nd.zoneName=Yb,Nd.dates=aa("dates accessor is deprecated. Use date instead.",Dd),Nd.months=aa("months accessor is deprecated. Use month instead",Y),Nd.years=aa("years accessor is deprecated. Use year instead",td),Nd.zone=aa("moment().zone is deprecated, use moment().utcOffset instead. https://github.com/moment/moment/issues/1779",Oa);var Od=Nd,Pd={sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},Qd={LTS:"h:mm:ss A",LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY h:mm A",LLLL:"dddd, MMMM D, YYYY h:mm A"},Rd="Invalid date",Sd="%d",Td=/\d{1,2}/,Ud={future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},Vd=s.prototype;Vd._calendar=Pd,Vd.calendar=_b,Vd._longDateFormat=Qd,Vd.longDateFormat=ac,Vd._invalidDate=Rd,Vd.invalidDate=bc,Vd._ordinal=Sd,Vd.ordinal=cc,Vd._ordinalParse=Td,Vd.preparse=dc,Vd.postformat=dc,Vd._relativeTime=Ud,Vd.relativeTime=ec,Vd.pastFuture=fc,Vd.set=gc,Vd.months=U,Vd._months=md,Vd.monthsShort=V,Vd._monthsShort=nd,Vd.monthsParse=W,Vd.week=ka,Vd._week=ud,Vd.firstDayOfYear=ma,Vd.firstDayOfWeek=la,Vd.weekdays=Lb,Vd._weekdays=Ed,Vd.weekdaysMin=Nb,Vd._weekdaysMin=Gd,Vd.weekdaysShort=Mb,Vd._weekdaysShort=Fd,Vd.weekdaysParse=Ob,Vd.isPM=Ub,Vd._meridiemParse=Hd,Vd.meridiem=Vb,w("en",{ordinalParse:/\d{1,2}(th|st|nd|rd)/,ordinal:function(a){var b=a%10,c=1===q(a%100/10)?"th":1===b?"st":2===b?"nd":3===b?"rd":"th";return a+c}}),a.lang=aa("moment.lang is deprecated. Use moment.locale instead.",w),a.langData=aa("moment.langData is deprecated. Use moment.localeData instead.",y);var Wd=Math.abs,Xd=yc("ms"),Yd=yc("s"),Zd=yc("m"),$d=yc("h"),_d=yc("d"),ae=yc("w"),be=yc("M"),ce=yc("y"),de=Ac("milliseconds"),ee=Ac("seconds"),fe=Ac("minutes"),ge=Ac("hours"),he=Ac("days"),ie=Ac("months"),je=Ac("years"),ke=Math.round,le={s:45,m:45,h:22,d:26,M:11},me=Math.abs,ne=Ha.prototype;ne.abs=oc,ne.add=qc,ne.subtract=rc,ne.as=wc,ne.asMilliseconds=Xd,ne.asSeconds=Yd,ne.asMinutes=Zd,ne.asHours=$d,ne.asDays=_d,ne.asWeeks=ae,ne.asMonths=be,ne.asYears=ce,ne.valueOf=xc,ne._bubble=tc,ne.get=zc,ne.milliseconds=de,ne.seconds=ee,ne.minutes=fe,ne.hours=ge,ne.days=he,ne.weeks=Bc,ne.months=ie,ne.years=je,ne.humanize=Fc,ne.toISOString=Gc,ne.toString=Gc,ne.toJSON=Gc,ne.locale=rb,ne.localeData=sb,ne.toIsoString=aa("toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)",Gc),ne.lang=Cd,H("X",0,0,"unix"),H("x",0,0,"valueOf"),N("x",_c),N("X",bd),Q("X",function(a,b,c){c._d=new Date(1e3*parseFloat(a,10))}),Q("x",function(a,b,c){c._d=new Date(q(a))}),a.version="2.10.6",b(Da),a.fn=Od,a.min=Fa,a.max=Ga,a.utc=h,a.unix=Zb,a.months=jc,a.isDate=d,a.locale=w,a.invalid=l,a.duration=Ya,a.isMoment=o,a.weekdays=lc,a.parseZone=$b,a.localeData=y,a.isDuration=Ia,a.monthsShort=kc,a.weekdaysMin=nc,a.defineLocale=x,a.weekdaysShort=mc,a.normalizeUnits=A,a.relativeTimeThreshold=Ec;var oe=a;return oe});
var NJ = NJ || {};

(function (NJ) {
  NJ.Vtr = NJ.Vtr || {
    constants: {
      types: {
        blank: 'blank',
        boolean: 'boolean',
        categorical: 'categorical',
        date: 'date',
        numeric: 'numeric',
        string: 'string',
        stringAddress: 'string-address'
      }
    }
  };

  Array.prototype.average = function () {
    return this.length === 0 ? 0
                             : this.reduce(function (sum, item) { return sum + Number(item); }, 0) / this.length;
  };
})(NJ);

(function (Vtr) {
  var regExps = {
    addr: {
      state: /^(서울(특별시)?)|((부산|대구|인천|광주|대전|울산)(광역시)?)|(세종(특별자치시)?)|((경기|강원|충청북|충청남|경상북|경상남|전라북|전라남|제주(특별자치)?)도?)|(충북|충남|경북|경남|전북|전남)/,
      city: /^[가-힣]+(시|군|구)/,
      town: /^[가-힣0-9.,·]+([동|가]|((읍|면) ?([가-힣]+\d?리)?))/
    },
    blank: /^ +$/,
    boolean: {
      all: /^([yn]|[네예]|(아니[요오])|(yes)|(no)|(true)|(false))$/i,
      true: /^(y|[네예]|(yes)|(true))$/i
    },
    date: {
      replace: {
        date: /년|월|일/,
        time: /(시 ?)|(분 ?)/
      }
    },
    numeric: /^[+-]?(\d+|(\d{1,3}(,\d{3})*))(\.\d+)?([eE]-?\d+)?$/
  };


  function Cell(data) {
    var _type, _data;

    _type = getType(data),
    _data = getData(data, _type);

    Object.defineProperty(this, 'data', { get: function () { return _data; } });
    Object.defineProperty(this, 'type', { get: function () { return _type; } });

    return this;
  }


  function getData(data, type) {
    switch (type) {
      case Vtr.constants.types.blank:
        return null;

      case Vtr.constants.types.boolean:
        return regExps.boolean.true.test(data);

      case Vtr.constants.types.date:
        return data;

      case Vtr.constants.types.numeric:
        return Number(typeof data === 'string' ? data.replace(',', '') : data);

      case Vtr.constants.types.string:
      case Vtr.constants.types.stringAddress:
        return String(data);
    }
  }

  function getNormalizedDate(date) {
    return [
      [regExps.date.replace.date, '.'],
      [regExps.date.replace.time, ':'],
      ['초', '']
    ].reduce(function (date, arg) {
      return date.replace(arg[0], arg[1]);
    }, date);
  }

  function getType(data) {
    if (isBlank(data))   return Vtr.constants.types.blank;
    if (isBoolean(data)) return Vtr.constants.types.boolean;
    if (isNumeric(data)) return Vtr.constants.types.numeric;
    if (isAddress(data)) return Vtr.constants.types.stringAddress;
    if (isDate(data))    return Vtr.constants.types.date;
                         return Vtr.constants.types.string;
  }

  function isAddress(data) {
    var addr = data;

    if (regExps.addr.state.test(data)) return true;

    addr = data.replace(regExps.addr.state, '').trim();
    if (regExps.addr.city.test(data)) return true;

    addr = data.replace(regExps.addr.city, '').trim();
    if (regExps.addr.town.test(data)) return true;

    return false;
  }

  function isBlank(data) {
    if (data === undefined || data === null || data === '')
      return true;

    if (regExps.blank.test(data))
      return true;

    return false;
  }

  function isBoolean(data) {
    if (data === true || data === false)
      return true;

    if (regExps.boolean.all.test(data))
      return true;

    return false;
  }

  function isNumeric(data) {
    return ! isNaN(data) || regExps.numeric.test(data);
  }

  function isDate(data) {
    var date = getNormalizedDate(data.trim());

    if (moment(new Date(date)).isBetween('1900-01-01', '2100-01-01'))
      return true;
    if (moment(date).isBetween('1900-01-01', '2100-01-01'))
      return true;


    return false;
  }


  Vtr.Cell = Cell;
})(NJ.Vtr);

(function (Vtr) {
  var regExps = {
    addr: /(지역|구역|도|시|군|구|읍|면|동|리)$/,
    date: /(년|월|일)$/,
    numeric: /(값|양|량)$/
  };

  function Column(title, cells) {
    var _data, _statistics, _title, _type, _format;

    if (! cells instanceof Array)
      throw new Error('The first argument must be an array of cells');

    _data = cells;
    _title = title;
    _type = getType(_data, _title);
    if (_type === Vtr.constants.types.numeric)
      _statistics = getStatistics(_data);
    if (_type === NJ.Vtr.constants.types.date)
      _format = getDateFormat(_data);

    Object.defineProperty(this, 'data',       { get: function () { return _data; } });
    Object.defineProperty(this, 'size',       { get: function () { return _data.length; } });
    Object.defineProperty(this, 'statistics', { get: function () { return _statistics instanceof Object ? _statistics : null; } });
    Object.defineProperty(this, 'title',      { get: function () { return _title; } });
    Object.defineProperty(this, 'type',       { get: function () { return _type; } });
    Object.defineProperty(this, 'format',       { get: function () { return _format ; } });

    return this;
  }


  function getType(data, title) {
    var types = data.map(function (cell) {
      if (! cell instanceof Vtr.Cell)
        throw new Error('The array must contain cells only');
      return cell.type;
    });

    var uniqs = Object.keys(data.reduce(function (obj, item) {
      obj[item.data] = true;
      return obj;
    }, {}));

    var length = data.length,
        uniqLength = uniqs.length;

    if (1 === uniqLength)
      return NJ.Vtr.constants.types.blank;

    var typesCount = types.reduce(function (count, type) {
      count[type] = count[type] ? count[type]+1 : 1;
      return count;
    }, {});

    var type = Object.keys(typesCount).reduce(function (foundType, type) {
      if (typesCount[type] > foundType.count)
        return { type: type, count: typesCount[type] }
      return foundType;
    }, { type: '', count: 0 }).type;

  // switch (type) {
  //   case NJ.Vtr.constants.types.numeric:
  //   case NJ.Vtr.constants.types.string:
  //     if (regExps.addr.test(title))
  //       return NJ.Vtr.constants.types.stringAddress;

  //     if (regExps.date.test(title))
  //       return NJ.Vtr.constants.types.date;

  //     if (regExps.numeric.test(title))
  //       return NJ.Vtr.constants.types.numeric;
  // }

    if (1 < uniqLength && uniqLength < 9 && length > uniqLength * 10)
      return NJ.Vtr.constants.types.categorical;

    return type;


  }

  function getStatistics(data) {
    var values = jStat(
      data.filter(function (value) {
        return value.type === Vtr.constants.types.numeric;

      }).map(function (value) {
        return value.data;
      })
    );

    return {
      sum: values.sum(),
      avg: values.mean(),
      med: values.median(),
      max: values.max(),
      min: values.min(),
      std: values.stdev()
    };
  }

function getDateFormat(data) {
  var values = data.filter(function (value) {
      return value.type === NJ.Vtr.constants.types.date;
    }).map(function (value) {
      return value.data;
    });

  var match = /(\d{1,2})([^a-zA-Z\d:]{0,2})([a-zA-Z]+)([^a-zA-Z\d:]{0,2})(\d{1,2})(\D{0,2})?(\d{1,2})?(\D{0,2})?(\d{1,2})?(\D{0,2})?(\d{1,2})?(\D{0,2})/.exec(values[0]);
  var format = ["%d", "%B", "%Y", "%H", "%M", "%S"];

  if (match) {
	for (var i = 1; i < match.length; i += 2) {
      if (match[i]) {
		if (typeof match[i] === 'string' && match[i].length === 3) {
		  result += format[Math.floor(i/2)].toLowerCase() + (match[i + 1] != null ? match[i + 1] : "")
		}
		else {
          result += format[Math.floor(i/2)] + (match[i + 1] != null ? match[i + 1] :"");
		}
	  }
	}
	return result.replace(/undefined/g,"");
  }

  var match = /(\d{2,4})(\D{0,2})(\d{1,2})?(\D{0,2})?(\d{1,2})?(\D{0,2})?(\d{1,2})?(\D{0,2})?(\d{1,2})?(\D{0,2})?(\d{1,2})?(\D{0,2})?/.exec(values[0]);
  var format = ["%Y", "%m", "%d", "%H", "%M", "%S"];
  var result = "";

  if (match) {
	for (var i = 1; i < match.length; i += 2) {
      if (match[i]) {
        result += format[Math.floor(i/2)] + (match[i + 1] != null ? match[i + 1] : "");
      }
	}
  }

  return result.replace(/undefined/g,"");
}

  Vtr.Column = Column;
})(NJ.Vtr);

(function (Vtr) {
  var matches = [];


  var Match = {};

  Match.getByAlias = function (alias) {
    return matches.filter(function (match) {
      return match.alias === alias;
    })[0];
  };

  Match.match = function (table) {
    if (! table instanceof Vtr.Table)
      throw new Error('The first argument must be a NJ.Vtr.Table instance');

    var types = table.columns.map(function (col) { return col.type; })
                             .reduce(function (map, types) { map[types] = map[types] ? map[types]+1 : 1; return map; }, {});
    var hierarchy = Object.keys(table.hierarchy).map(function (key) { return table.hierarchy[key]; })
                                                .reduce(function (hierarchy, item) { hierarchy = hierarchy.concat(item); return hierarchy; }, []);

    var results = matches.map(function (matchItem) {
      return matchItem.getMatchResult(types, hierarchy);

    }).filter(function (match) {
      return match.score > 0;

    }).sort(function (a, b) {
      return b.score - a.score;
    });

    var header = Match.getByAlias(results[0].alias).getVisualizationHeader(table);

    return { results: results, header: header };
  }

  Match.register = function (meta) {
    var item = new MatchItem(meta);
    matches.push(item);

    return item;
  };


  Vtr.Match = Match;


  function MatchItem(meta) {
    var _name, _alias, _inputs, _outputs;

    if (! meta instanceof Object)
      throw new Error('The first argument must be a match object');

    _name = meta.name;
    _alias = meta.alias;
    _inputs = meta.inputs;
    _outputs = meta.outputs;

    Object.defineProperty(this, 'name', { get: function () { return _name; } });
    Object.defineProperty(this, 'alias', { get: function () { return _alias; } });
    Object.defineProperty(this, 'inputs', { get: function () { return _inputs; } });
    Object.defineProperty(this, 'outputs', { get: function () { return _outputs; } });

    this.getMatchResult = function (types, hierarchy) {
      var typeRules = this.inputs.types,
          hierarchyRules = this.inputs.hierarchy;

      var tscore = getScoreArray(typeRules, types).average(),
          hscore = getScoreArray(hierarchyRules, hierarchy, true).average();

      return { name: this.name, alias: this.alias, score: tscore+hscore };


      function getScoreArray(rules, item, isLength) {
        if (! rules || ! rules.length) return [];

        return rules.map(function (rule) {
          var type = isLength ? 'length' : rule.type;

          var score = Object.keys(rule.count).reduce(function (score, key) {
            if (score === 0) return 0;
            switch (key) {
              case 'gt' : return rule.count[key] <   (item[type] || 0) ? rule.weight : 0;
              case 'gte': return rule.count[key] <=  (item[type] || 0) ? rule.weight : 0;
              case 'lt' : return rule.count[key] >   (item[type] || 0) ? rule.weight : 0;
              case 'lte': return rule.count[key] >=  (item[type] || 0) ? rule.weight : 0;
              case 'eq' : return rule.count[key] === (item[type] || 0) ? rule.weight : 0;
              case 'ne' : return rule.count[key] !== (item[type] || 0) ? rule.weight : 0;
            }
          }, null);

          return score ? score : 0;
        });
      }
    };

    this.getVisualizationHeader = function (table) {
      var columns = table.columns.map(function (column) {
        return { title: column.title, type: column.type };
      });

      var header = this.outputs.header.reduce(function (header, item) {
        if (header[item.key]) return header;

        var hierarchy = item.hierarchy && table.hierarchy && table.hierarchy['string-address'] && table.hierarchy['string-address'][0];
        if (hierarchy) {
          header[item.key] = hierarchy.map(function (idx) {
            return columns[idx].title;
          });

          columns = columns.filter(function (column, idx) {
            return hierarchy.indexOf(idx) < 0;
          });

          return header;
        }

        if (item.isArray) {
          var idxToRemove = [];
          header[item.key] = columns.filter(function (column) {
            return column.type === item.type;

          }).map(function (item, idx) {
            idxToRemove.push(idx);
            return item.title;
          });

          columns = columns.filter(function (item, idx) {
            return idxToRemove.indexOf(idx) > -1;
          });

          return header;
        }

        for (var i=0; i<columns.length; i++) {
          if (columns[i].type === item.type) {
            header[item.key] = columns[i].title;
            columns.splice(i, 1);
            break;
          }
        }

        return header;
      }, {});

      return header;
    };

    return this;
  }
})(NJ.Vtr);

(function (Vtr) {
  function Table(data) {
    var _columns, _data, _hierarchy, _title;

    if (! data instanceof Array)
      throw new Error('The first argument must be an array of arrays');

    _title = data[0];
    var sliced = data.slice(1);

    _data = sliced.map(function (val) {
      return _title.reduce(function (obj, key, idx) {
        obj[key] = val[idx];
        return obj;
      }, {});
    });

    var rows = sliced.map(function (row) {
      return row.map(function (cell) {
        return new Vtr.Cell(cell);
      });
    });
    var columns = _title.map(function (title, idx) {
      return new NJ.Vtr.Column(title, rows.map(function (cell) { return cell[idx]; }));
    });
    _columns = columns;

    _hierarchy = getHierarchy(_columns);

    Object.defineProperty(this, 'columns',   { get: function () { return _columns; } });
    Object.defineProperty(this, 'data',      { get: function () { return _data; } });
    Object.defineProperty(this, 'hierarchy', { get: function () { return _hierarchy; } });
    Object.defineProperty(this, 'size',      { get: function () { return { columns: columns.length, rows: columns.length }; } });

    return this;
  }


  function getHierarchy(data) {
    var types = data.map(function (column) { return column.type; });

    var indices = [
      Vtr.constants.types.stringAddress,
    ].reduce(function (indices, type) {
      indices[type] = [];
      return indices;
    }, {});

    types.forEach(function (type, idx) {
      switch (type) {
        case Vtr.constants.types.stringAddress:
          indices[type].push(idx);

        default:
          return;
      }
    });

    // string-address
    var addrs = [];
    if (indices['string-address'].length > 1) {
      var cols = indices['string-address'];

      var idxArray = [];
      cols.forEach(function (col, idx) {
        if (idx === 0)
          return idxArray.push(col);

        if (idxArray[idxArray.length-1] !== col-1) {
          if (idxArray.length > 1)
            addrs.push(idxArray);
          idxArray = [];
        }

        idxArray.push(col);
      });

      if (idxArray.length > 1)
        addrs.push(idxArray);
    }
    var addrGroups = [];
    addrs.forEach(function (colGroup, idx) {
      var group = colGroup.map(function (col) {
        return {
          count: Object.keys(
            data[col].data.map(function (cell) {
              return cell.data;

            }).filter(function (cell) {
              return !! cell;

            }).reduce(function (obj, cell) {
              obj[cell] = true;
              return obj;
            }, {})
          ).length,
          idx: col
        };

      }).sort(function (a, b) {
        return a.count - b.count;

      }).map(function (col) {
        return col.idx;
      });

      addrGroups.push(group);
    });

    return {
      'string-address': addrGroups
    };
  }


  Vtr.Table = Table;
})(NJ.Vtr);


(function () {

  'use strict';

  angular
    .module('daisy.services')
    .service('ApiService', ['$http', '$q', '$window', function ($http, $q, $window) {
	  var vm = this;
      vm.Project = {
        getList: function(page) {
          var url = 'api/project?format=json';
          if (page) {
            url = url + '&page=' + page;
          }

          return $http.get(url).then(function (response) {
            var res = response.data;
            return res ? res : [];
          }, function () {
            return [];
          });
        },

        getItem: function(projectId) {
          return $http.get('api/project/' + projectId + '?format=json').then(function (response) {
            var res = response.data;
            return res ? res : $q.reject(null);
          }, function (response) {
            return $q.reject(response.data.status, response.status);
          });
        },

        saveItem: function (params) {
          var item = {
            title: params.title,
            user: params.user,
            description: params.description,
            visualize: params.visualize,
            status: params.status,
            copyright: params.copyright
          };

          return $http.post('api/project?format=json', item).then(function (response) {
            var res = response.data;
            return res ? res : $q.reject(null);
          }, function (response) {
            return $q.reject(response.data.status, response.status);
          });
        },

        deleteItem: function (projectId) {
          return $http.delete('api/project/' + projectId).then(function () {
            return true;
          }, function (response) {
            return $q.reject(response.data.reason, response.status);
          });
        }
      };

      vm.Visualize = {
        getTypes: function () {
          return $http.get('api/visualize-type?format=json').then(function (response) {
            var res = response.data;
            return res ? res : $q.reject(null);
          }, function (response) {
            return $q.reject(response.data.reason, response.status);
          });
        },
        getTypeByID: function(id) {
          return $http.get('api/visualize-type/' + id + '?format=json').then(function (response) {
            var res = response.data;
            return res ? res : $q.reject(null);
          }, function (response) {
            return $q.reject(response.data.reason, response.status);
          });
        }
      };

      vm.PublicData = {
        searchByKeyword: function (keyword, page) {
          var url = 'api/publicdata?keyword=' + encodeURIComponent(keyword);
          if (page) {
            url = url + '&page=' + page;
          }

          return $http.get(url).then(function (response) {
            var res = response.data;
            return res ? res : $q.reject(null);
          }, function (response) {
            return $q.reject(response.data.reason, response.status);
          });
        },

        getItem: function (url) {
          return $http.get(url).then(function (response) {
            var res = response.data;
            return res ? res : $q.reject(null);
          }, function (response) {
            return $q.reject(response.data.reason, response.status);
          });
        },

        getItemPreview: function (code) {
          return $http.get('api/publicdata/' + code + '/preview').then(function (response) {
            var res = response.data;
            return res ? res : $q.reject(null);
          }, function (response) {
            return $q.reject(response.data.reason, response.status);
          });
        }
      };
    }]);
})();

(function () {

'use strict';

angular
  .module('daisy.services')
  .service('AppService', ['$interval', '$q', '$rootScope', '$route', '$timeout', '$window', 'ApiService', 'UtilService', function ($interval, $q, $rootScope, $route, $timeout, $window, ApiService, UtilService) {
	var self = this;

    $rootScope.$on('visualize-item:download', function (ev, data) {
      switch (data.type) {
        case 'svg':
          return downloadFile(dataUriToBlob(data.uri), 'thumbnail.svg');

        case 'png':
          return downloadFile(dataUriToBlob(data.uri, true), 'thumbnail.png');
      }
    });

    function dataUriToBlob(url, isBinary) {
      var urlSplit = url.split(',');

      var type = urlSplit[0].split(':')[1].split(';')[0],
          data = $window.atob(urlSplit[1]);

      if (isBinary) {
        var buf = new ArrayBuffer(data.length),
            arr = new Uint8Array(buf);
        for (var i=0, len=arr.length; i<len; i++)
          arr[i] = data.charCodeAt(i);
        data = arr;
      }

      return {
        type: type,
        blob: new Blob([data], { type: type })
      };
    }

    function downloadFile(blob, filename) {
      var agent = getAgent();

      if (agent === 'ie')
        return $window.navigator.msSaveBlob(blob.blob, filename);

      var a = $window.document.createElement('a'), url;
      if (agent === 'safari') {
        url = $window.webkitURL.createObjectURL(blob.blob);
        a.target = '_blank';
      } else {
        url = $window.URL.createObjectURL(blob.blob, { type: blob.type });
        a.download = filename;
      }
      a.href = url;

      $window.document.body.appendChild(a);
      a.click();
      $window.document.body.removeChild(a);
    }

    function getAgent() {
      var a = $window.document.createElement('a');
      if (typeof a.download !== 'undefined')
        return 'chrome-firefox';

      var agent = navigator.userAgent;
      if (agent.indexOf('MSIE') > -1 || agent.indexOf('Trident') > -1)
        return 'ie';

      return 'safari';
    }


  }]);

})();

(function () {

'use strict';

angular.module('daisy.services').service('ToastService', ['$timeout', '$rootScope', function ($timeout, $rootScope) {
  var self = this;

  var timeout;

  self.message = null;

  self.close = function () {
    self.message = null;
    $timeout.cancel(timeout);
  };

  self.show = function (message) {
    self.message = { text: message.text, type: message.type || 'info' };
    if (! $rootScope.$$phase)
      $rootScope.$digest();

    $timeout.cancel(timeout);
    timeout = $timeout(function () { self.close(); }, 5000);
  };
}]);

})();

(function () {

'use strict';

angular.module('daisy.services').service('UtilService', ['$location', '$route', '$window', function ($location, $route, $window) {
  var self = this;

  self.isArray = angular.isArray;

  self.navigation = {
    getPath: function () { return $location.path(); },
    go: function (location) { $window.location.href = location; },
    path: function (location, reload) {
      if (location === $location.path() && reload)
        $route.reload();
      else
        $location.path(location);
    },
    reload: function () { $window.location.reload(); },
    replace: function () { $location.replace(); }
  };

  self.getEmptyArray = function () {
    return [['','','','','','','','','',''],['','','','','','','','','',''],['','','','','','','','','',''],['','','','','','','','','',''],['','','','','','','','','',''],['','','','','','','','','',''],['','','','','','','','','',''],['','','','','','','','','',''],['','','','','','','','','',''],['','','','','','','','','',''],['','','','','','','','','',''],['','','','','','','','','',''],['','','','','','','','','',''],['','','','','','','','','',''],['','','','','','','','','',''],['','','','','','','','','',''],['','','','','','','','','',''],['','','','','','','','','',''],['','','','','','','','','',''],['','','','','','','','','','']];
  };

  self.getFilename = function (filename) {
    var dotIndex = filename.lastIndexOf('.');
    return dotIndex === -1 ? filename : filename.substring(0, dotIndex);
  };
}]);

})();
