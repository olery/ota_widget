'use strict';

window.ota_widget = {

  locale: 'en',

  tag: null,

  init: function init(token) {
    if (token) ota_widget.api.token = token;

    ota_widget.i18n.compiled = _.mapValues(ota_widget.i18n.locales, function (t) {
      return ota_widget.i18n.flatten(t);
    });

    ota_widget.tag = ota_widget.loadTag('ota-widget', ota_widget.ui.tagClass);
  },

  load: function load() {
    ota_widget.api.review_widget({}).then(function (json) {
      ota_widget.tag.d = ota_widget.ui.transformData(json.data);
      ota_widget.tag.update();
    });
  },

  loadTag: function loadTag(name, scriptFunc, opts) {
    riot.tag2(name, null, '', '', scriptFunc);
    var tag = riot.mount(name, opts)[0];
    tag.root.style.display = 'block';
    return tag;
  }
};

window.ota_widget.i18n = {
  translate: function translate(key, opts) {
    var value = ota_widget.i18n.compiled[ota_widget.locale][key];

    value && _.each(opts, function (v, k) {
      value = value.replace("%{" + k + "}", v);
    });

    return value ? value : opts['default'];
  },

  flatten: function flatten(obj) {
    var flattenOne = function flattenOne(plainObject, namespace, result) {
      if (namespace == null) namespace = '';
      if (result == null) result = {};

      return _.reduce(plainObject, function (result, value, key) {
        var newKey = '' + namespace + (namespace ? '.' : '') + key;
        if (_.isPlainObject(value)) {
          if (_.size(value)) flattenOne(value, newKey, result);
        } else result[newKey] = value;
        return result;
      }, result);
    };
    return flattenOne(obj);
  }
};

window.ota_widget.ui = {

  compositionIcons: {
    families: 'child_friendly',
    couples: 'favorite',
    friends: 'group',
    solo: 'person',
    business: 'business_center',
    group: 'directions_bus',
    other: 'person',
    seniors: 'person',
    young_adults: 'person'
  },

  topicIgnoreList: ['room', 'cleanliness', 'facilities', 'food', 'location', 'problem', 'value_for_money'],

  tagClass: function tagClass(opts) {
    this.w = window.ota_widget;
    this.d = {};
    this.t = this.w.i18n.translate;

    this.clear = function () {
      this.d = {};
      this.update();
    };
  },

  transformData: function transformData(data) {
    data.ratings = _.orderBy(data.ratings, 'value', 'desc');

    _.remove(data.mentions, function (m) {
      m.percentage = 100 * m.positive_opinions / m.opinions_count;
      return _.find(ota_widget.ui.topicIgnoreList, function (t) {
        return t == m.topic;
      });
    });

    data.summaries = _.map(data.summaries, function (s) {
      return s[Object.keys(s)[0]];
    });

    ota_widget.ui.calcRatingsPercentages(data.guests.countries);
    ota_widget.ui.calcRatingsPercentages(data.guests.compositions);
    data.cached_at = new Date(data.updated_at).toLocaleDateString();

    _.each(data.recent_reviews, function (review) {
      ota_widget.ui.join_topics(review, ota_widget.i18n.translate('recent_reviews.separator').toLowerCase());
    });

    return data;
  },

  calcRatingsPercentages: function calcRatingsPercentages(groupedRatings) {
    var total = _.sumBy(groupedRatings, function (c) {
      c.review_count = _.find(c.ratings, function (r) {
        return r.topic == 'overall';
      }).review_count;
      return c.review_count;
    });
    _.each(groupedRatings, function (c) {
      return c.percentage = 100 * c.review_count / total;
    });
  },

  join_topics: function join_topics(review, sep) {
    _.each(['positive', 'negative'], function (polarity) {

      var topics = _.compact(_.uniq(_.flatten(_.map(review.opinions, function (op) {
        if (op.polarity == polarity) return op.topics;
      }))));

      var key = polarity + '_topics';
      review[key] = _.join(_.map(topics, function (topic) {
        return ota_widget.topic_label_for(topic);
      }), sep);
    });
  }
};

window.ota_widget.rating_stars = function (ratings, category) {
  var value = _.compact(_.map(ratings, function (rating) {
    if (rating.category == category) return rating.rating;
  }))[0];
  var classes = [];
  for (var i = 0; i < parseInt(value / 20); i++) {
    classes.push('star');
  }for (var i = 0; i < parseInt(value % 20 / 10); i++) {
    classes.push('star_half');
  }return classes;
};

window.ota_widget.ratings = {

  mod4: function mod4(value) {
    return Math.floor((value - 1) / 4) * 4;
  },

  format: function format(value) {
    if (!value && value != '0') return '-';
    value = parseFloat(value).toFixed(1);
    return value == 10 ? '10' : value;
  },

  toCss: function toCss(value10) {
    return ota_widget.ratings.toCss100(parseFloat(value10) * 10);
  },

  toCss100: function toCss100(value) {
    if (!value && value != '0') return 'rating-unknown';

    value = parseFloat(value);
    if (value <= 4) return 'rating0-4';
    if (value >= 97) return 'rating97-100';

    return 'rating' + (ota_widget.ratings.mod4(value) + 1) + '-' + (ota_widget.ratings.mod4(value) + 4);
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

  review_widget: function review_widget(_ref) {
    var _ref$params = _ref.params;
    var params = _ref$params === undefined ? {} : _ref$params;

    return ota_widget.api.req({
      path: 'companies/' + ota_widget.api.company_id + '/review_widget'
    });
  },

  req: function req(_ref2) {
    var path = _ref2.path;
    var _ref2$baseUrl = _ref2.baseUrl;
    var baseUrl = _ref2$baseUrl === undefined ? ota_widget.api.baseUrl : _ref2$baseUrl;
    var _ref2$version = _ref2.version;
    var version = _ref2$version === undefined ? ota_widget.api.version : _ref2$version;
    var _ref2$params = _ref2.params;
    var params = _ref2$params === undefined ? {} : _ref2$params;

    params.auth_token = ota_widget.api.token;
    params = ota_widget.url.objectToQuery(params);

    return window.fetch(baseUrl + '/' + version + '/' + path + '?' + params).then(function (response) {
      return response.json();
    });
  }
};

window.ota_widget.ml2km = function (distance) {
  return Math.round(distance * 160.934) / 100;
};

window.ota_widget.days_from = function (date) {
  return parseInt((Date.now() - Date.parse(date)) / (1000 * 3600 * 24));
};

window.ota_widget.topic_label_for = function (topic) {
  var label = ota_widget.i18n.translate('opinions.topics.' + topic, { 'default': undefined });
  if (label == undefined) {
    label = _.startCase(topic);
  }
  return label.toLowerCase();
};