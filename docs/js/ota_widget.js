// ota_widget object: all variables and behavior of the OTA Widget is stored here
'use strict';

window.ota_widget = {

  locale: 'en',

  // this key will hold the RiotJS mounted tag. We usually need this tag to access its data and behaviour.
  tag: null,

  data: {},

  initted: false,

  init: function init(token) {
    if (this.initted) return;
    if (window.google) google.charts.load('current', { 'packages': ['corechart'] });
    if (token) this.api.token = token;
    this.i18n.load();
    this.initted = true;
  },

  // initialization function: loads locale and loads Riot component
  load: function load(token) {
    var _this = this;

    this.init(token);

    riot.compile(function () {
      if (!_this.tag) _this.tag = _this.loadTag('ota-widget', _this.ui.tagClass);

      _this.api.review_widget({}).then(function (json) {
        _.assign(_this.data, _this.ui.transformData(json.data));
        if (window.google) return google.charts.setOnLoadCallback(_this.tag.update);else _this.tag.update();
      });
    });
  },

  // loadTag function. Mounts template tag
  loadTag: function loadTag(name, scriptFunc, opts) {
    riot.tag2(name, null, '', '', scriptFunc);
    return this.mountTag(name, opts);
  },

  mountTag: function mountTag(name, opts) {
    var tag = riot.mount(name, opts)[0];
    tag.root.style.display = 'block';
    return tag;
  }
};

// translation functions. Can receive a opts Object with values for a translation.
// Example translation: %{number} dishes in the table
// While translating this sentence above, a number value should be given.
// Depending on the language, the %{number} piece can be in a different position
window.ota_widget.i18n = {

  compiled: null,

  load: function load() {
    var _this2 = this;

    if (this.compiled) return;
    this.compiled = _.mapValues(this.locales, function (t) {
      return _this2.flatten(t);
    });

    if (ota_widget.url.params.lang && this.compiled[ota_widget.url.params.lang]) ota_widget.locale = ota_widget.url.params.lang;
  },

  translate: function translate(key, opts) {
    var value = ota_widget.i18n.compiled[ota_widget.locale][key];
    if (value == undefined) // fallback to en
      value = ota_widget.i18n.compiled['en'][key];

    value && _.each(opts, function (v, k) {
      value = value.replace("%{" + k + "}", v);
    });

    opts = opts || { 'default': '' };

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
window.ota_widget.t = window.ota_widget.i18n.translate;

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

  // function used by RiotJS when it's mounting the ota-widget tag
  tagClass: function tagClass(opts) {
    this.w = window.ota_widget;
    this.d = this.w.data;
    this.t = this.w.i18n.translate;
  },

  // Make little changes in the received data to present it in the blocks.
  transformData: function transformData(data) {
    data.ratings = _.orderBy(data.ratings, 'value', 'desc');

    data.summaries = _.map(data.summaries, function (s) {
      return s[Object.keys(s)[0]];
    });

    ota_widget.ui.calcRatingsPercentages(data.guests.countries);
    ota_widget.ui.calcRatingsPercentages(data.guests.compositions);
    data.cached_at = new Date(data.updated_at).toLocaleDateString();

    _.each(data.recent_reviews, function (review) {
      ota_widget.ui.joinTopics(review, ota_widget.i18n.translate('recent_reviews.separator').toLowerCase());
    });

    return data;
  },

  // calculates the overall ratings percentages
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

  // transforms data needed by recent reviews block
  joinTopics: function joinTopics(review, sep) {
    var _this3 = this;

    _.each(['positive', 'negative'], function (polarity) {

      var topics = _.compact(_.uniq(_.flatten(_.map(review.opinions, function (op) {
        if (op.polarity == polarity) return op.topics;
      }))));

      var key = polarity + '_topics';
      review[key] = _.join(_.map(topics, function (topic) {
        return _this3.topicLabelFor(topic);
      }), sep);
    });
  },

  // Try to load a translation for a topic. If none found, returns the capitalized version of the topic.
  // It's a fallback function for missing topic translations
  topicLabelFor: function topicLabelFor(topic) {
    var label = ota_widget.i18n.translate('opinions.topics.' + topic, { 'default': undefined });
    if (!label) label = _.startCase(topic);

    return label.toLowerCase();
  }
};

// Generates classes to render in the recent reviews block with ratings through stars.
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

window.ota_widget.mentions = {

  score: function score(m) {
    var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var _ref$scale = _ref.scale;
    var scale = _ref$scale === undefined ? 10 : _ref$scale;

    if (m.score) return m.score;

    var pScale = scale / 2;
    var nominator = m.positive_opinions - m.negative_opinions;

    var total = nominator > 0 ? m.positive_opinions : m.negative_opinions;
    var score = pScale + (total ? pScale * nominator / total : 0);
    m.score = score;
    return m.score;
  },
  scoreClass: function scoreClass(m) {
    return ota_widget.ratings.toCss(this.score(m));
  },
  scoreLabel: function scoreLabel(m) {
    var score = Math.round(this.score(m));
    if (score == undefined) return;
    return score;
  },

  percentage: function percentage(m) {
    return 100 * m.positive_opinions / m.opinions_count;
  },
  percentageClass: function percentageClass(m) {
    return ota_widget.ratings.toCss100(100 * m.positive_opinions / m.opinions_count);
  },
  percentageLabel: function percentageLabel(m) {
    return Math.round(this.percentage(m)) + '% ' + ota_widget.t('mentions.positive');
  }
};

// Generates classes for colouring the ratings from red (0) to green (100).
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
    return this.toCss100(parseFloat(value10) * 10);
  },

  toCss100: function toCss100(value) {
    if (!value && value != '0') return 'rating-unknown';

    value = parseFloat(value);
    if (value <= 4) return 'rating0-4';
    if (value >= 97) return 'rating97-100';

    return 'rating' + (this.mod4(value) + 1) + '-' + (this.mod4(value) + 4);
  }
};

// Build the url params into a hash to be processed and back to string for building the new url
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

// Build the api endpoint url. You should change at least baseURL and probably adjust the req function for your server url pattern.
window.ota_widget.api = {

  baseUrl: 'https://agora.olery.com',
  //baseUrl:    'http://localhost:9292',
  version: 'v3',
  company_id: ota_widget.url.params.company_id || '',
  token: ota_widget.url.params.token,
  ep: ota_widget.url.params.ep,

  review_widget: function review_widget(_ref2) {
    var _ref2$params = _ref2.params;
    var params = _ref2$params === undefined ? {} : _ref2$params;

    if (!this.company_id) return Promise.reject();
    return ota_widget.api.req({
      path: 'companies/' + this.company_id + '/review_widget'
    });
  },

  req: function req(_ref3) {
    var path = _ref3.path;
    var _ref3$baseUrl = _ref3.baseUrl;
    var baseUrl = _ref3$baseUrl === undefined ? this.baseUrl : _ref3$baseUrl;
    var _ref3$version = _ref3.version;
    var version = _ref3$version === undefined ? this.version : _ref3$version;
    var _ref3$params = _ref3.params;
    var params = _ref3$params === undefined ? {} : _ref3$params;

    if (this.token) params.auth_token = this.token;
    if (this.ep) params.ep = this.ep;
    params = ota_widget.url.objectToQuery(params);

    return window.fetch(baseUrl + '/' + version + '/' + path + '?' + params).then(function (response) {
      return response.json();
    });
  }
};

// Transforms distance from mile to kilometer
window.ota_widget.ml2km = function (distance) {
  return Math.round(distance * 160.934) / 100;
};

window.ota_widget.charts = {

  t: function t(arr) {
    return _.map(arr, function (n) {
      return ota_widget.t('charts.' + n);
    });
  },

  findObjFromDateKey: function findObjFromDateKey(rows, period, date) {
    return _.find(rows, function (row) {
      return ota_widget.date.format(row.date, period, new Date().getFullYear()) == date;
    });
  },

  draw: function draw(tag) {
    var _this4 = this;

    var dateKey, count, rows, obj;
    if (!window.google) return;

    var data = tag.data();
    if (!data) return;

    var dataTable = [data.header];
    var series = {};

    _.each(data.data[data.series[0]][tag.period], function (d, i) {
      dataTable[i + 1] = [ota_widget.date.format(d.date, tag.period)];
      _.each(data.series, function (serie) {
        series[i] = { targetAxisIndex: i };
        var obj = _this4.findObjFromDateKey(data.data[serie][tag.period], tag.period, dataTable[i + 1][0]);
        var count = _this4.getCount(obj);
        dataTable[i + 1].push(count);
      });
    });

    // Remove last row if data is empty
    var lastRow = _.last(dataTable);
    if (_.compact(lastRow).length == 1) dataTable.splice(-1, 1);

    var dataArray = google.visualization.arrayToDataTable(dataTable);
    var options = {
      hAxis: {
        slantedText: true,
        titleTextStyle: { color: '#333', fontSize: '10px' }
      },
      legend: { position: 'top', alignment: 'start' },
      vAxis: { gridlines: { count: 4 }, minValue: 0 },
      chartArea: { width: '85%', height: '80%' }
    };
    if (data.options) options = _.merge(options, data.options);
    if (data.axesSeries) {
      options.series = series;
      options.vAxis = { textPosition: 'none' };
    }

    if (!tag.chart) tag.chart = new data.chartClass(document.getElementById(data.id));
    tag.chart.draw(dataArray, options);
  },

  getCount: function getCount(obj) {
    if (!obj) return null;
    if (obj.count) return parseInt(obj.count);
    return obj.count;
  },

  changePeriod: function changePeriod(tag, period) {
    if (tag.period == period) return;
    tag.period = period;
    tag.update();
  }
};

// Calculates the number of days from received date until now
window.ota_widget.date = {

  days_from: function days_from(date) {
    return parseInt((Date.now() - Date.parse(date)) / (1000 * 3600 * 24));
  },

  getMonday: function getMonday(date, year) {
    if (year && date.getFullYear() != year) {
      date.setYear(year);
    }
    var day = date.getDay();
    var diff = date.getDate() - day + (day == 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  },

  // it can be based on a specific year to match dates by beginning of week
  format: function format(dateStr, period, year) {
    var fmt = period == 'quarter' ? 'week' : 'month';
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var date_arr = dateStr.split('-');

    if (period == 'year') date_arr[2] = 1;
    var date = new Date(date_arr);

    if (period == 'quarter') date = this.getMonday(date, year);

    var month = monthNames[date.getMonth()];
    var year = date.getFullYear();

    if (fmt == 'week') return date.getDate() + ' of ' + month;else if (fmt == 'month') return month + ' ' + year;
  }
};