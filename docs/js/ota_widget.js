'use strict';

window.ota_widget = {

  tags: {},

  init: function init(token) {
    if (token) ota_widget.api.token = token;
  },

  load: function load() {
    ota_widget.api.review_content({}).then(function (json) {
      ota_widget.loadTag('overall', json.data);
    });
  },

  loadTag: function loadTag(name, opts) {
    riot.tag(name);
    ota_widget.tags[name] = riot.mount(name, opts)[0];
  }
};

window.ota_widget.url = {
  params: _.chain(window.location.search.slice(1).split('&')).map(function (item) {
    if (item) return item.split('=');
  }).compact().fromPairs().value(),

  objectToQuery: function objectToQuery(obj) {
    return _.map(obj, function (v, k) {
      return k + '=' + encodeURIComponent(v);
    }).join('&');
  }
};

window.ota_widget.api = {
  baseUrl: 'https://agora.olery.com',
  version: 'v3',
  company_id: ota_widget.url.params.company_id,
  token: ota_widget.url.params.token,

  review_content: function review_content(_ref) {
    var _ref$params = _ref.params;
    var params = _ref$params === undefined ? {} : _ref$params;

    return ota_widget.api.req({
      path: 'companies/' + ota_widget.api.company_id + '/review_content'
    });
  },

  req: function req(_ref2) {
    var path = _ref2.path;
    var _ref2$params = _ref2.params;
    var params = _ref2$params === undefined ? {} : _ref2$params;

    params.auth_token = ota_widget.api.token;
    return window.fetch(ota_widget.api.baseUrl + '/' + ota_widget.api.version + '/' + path + '?' + ota_widget.url.objectToQuery(params)).then(function (response) {
      return response.json();
    });
  }
};