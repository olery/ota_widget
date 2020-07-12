// ota_widget object: all variables and behavior of the OTA Widget is stored here
'use strict';

window.ota_widget = {

  locale: 'en',

  // this key will hold the RiotJS mounted tag. We usually need this tag to access its data and behaviour.
  tag: null,

  data: {},

  // initialization function: loads locale and loads Riot component
  load: function load(token) {
    if (token) ota_widget.api.token = token;

    ota_widget.i18n.load();

    riot.compile(function () {
      ota_widget.tag = ota_widget.loadTag('ota-widget', ota_widget.ui.tagClass);
      ota_widget.api.review_widget({}).then(function (json) {
        _.assign(ota_widget.data, ota_widget.ui.transformData(json.data));
        ota_widget.tag.update();

        if (window.google) {
          google.charts.load('current', { 'packages': ['corechart'] });
          google.charts.setOnLoadCallback(ota_widget.charts.load);
        }
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

  compiled: {},

  load: function load() {
    this.compiled = _.mapValues(ota_widget.i18n.locales, function (t) {
      return ota_widget.i18n.flatten(t);
    });

    if (ota_widget.url.params.lang && this.compiled[ota_widget.url.params.lang]) ota_widget.locale = ota_widget.url.params.lang;
  },

  translate: function translate(key, opts) {
    var value = ota_widget.i18n.compiled[ota_widget.locale][key];
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

  topicIgnoreList: ['room', 'cleanliness', 'facilities', 'food', 'location', 'problem', 'value_for_money'],

  // function used by RiotJS when it's mounting the ota-widget tag
  tagClass: function tagClass(opts) {
    this.w = window.ota_widget;
    this.d = this.w.data;
    this.t = this.w.i18n.translate;
  },

  // Make little changes in the received data to present it in the blocks.
  transformData: function transformData(data) {
    data.ratings = _.orderBy(data.ratings, 'value', 'desc');

    _.remove(data.mentions, function (m) {
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
    if (!score) return;
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

  //baseUrl:    'https://agora.olery.com',
  baseUrl: 'http://localhost:9292',
  version: 'v3',
  company_id: ota_widget.url.params.company_id || '',
  token: ota_widget.url.params.token,
  ep: ota_widget.url.params.ep,

  review_widget: function review_widget(_ref2) {
    var _ref2$params = _ref2.params;
    var params = _ref2$params === undefined ? {} : _ref2$params;

    return ota_widget.api.req({
      path: 'companies/' + ota_widget.api.company_id + '/review_widget'
    });
  },

  req: function req(_ref3) {
    var path = _ref3.path;
    var _ref3$baseUrl = _ref3.baseUrl;
    var baseUrl = _ref3$baseUrl === undefined ? ota_widget.api.baseUrl : _ref3$baseUrl;
    var _ref3$version = _ref3.version;
    var version = _ref3$version === undefined ? ota_widget.api.version : _ref3$version;
    var _ref3$params = _ref3.params;
    var params = _ref3$params === undefined ? {} : _ref3$params;

    if (ota_widget.api.token) params.auth_token = ota_widget.api.token;
    if (ota_widget.api.ep) params.ep = ota_widget.api.ep;
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

// Try to load a translation for a topic. If none found, returns the capitalized version of the topic.
// It's a fallback function for missing topic translations
window.ota_widget.topic_label_for = function (topic) {
  var label = ota_widget.i18n.translate('opinions.topics.' + topic, { 'default': undefined });
  if (label == undefined) {
    label = _.startCase(topic);
  }
  return label.toLowerCase();
};

window.ota_widget.charts = {
  load: function load() {
    window.ota_widget.charts.draw('reviews_over_time');
    window.ota_widget.charts.draw('reviews_trends');
    window.ota_widget.charts.draw('covid_events');
  },

  t: function t(arr) {
    return _.map(arr, function (n) {
      return ota_widget.t('charts.' + n);
    });
  },

  draw: function draw(component) {
    var driver = ota_widget[component];
    if (!driver) return;
    var data = driver.loadData();
    var dataTable = [data.header];
    var dateFmt = driver.period == 'quarter' ? 'week' : 'month';
    var chart = ota_widget.charts[component];

    _.each(data.series, function (serie) {
      var obj = data.data[serie][driver.period];
      _.each(obj, function (d, i) {
        if (dataTable[i + 1] == undefined) dataTable.push([window.ota_widget.date.format(d['date'], dateFmt)]);

        dataTable[i + 1].push(parseInt(d['count']));
      });
    });

    var dataArray = google.visualization.arrayToDataTable(dataTable);
    var options = {
      hAxis: {
        title: ota_widget.i18n.translate('charts.haxis'),
        slantedText: true,
        titleTextStyle: { color: '#333', fontSize: '10px' }
      },
      vAxis: { minValue: 0 }
    };

    if (!driver.chart) driver.chart = new google.visualization.AreaChart(document.getElementById(data.id));
    driver.chart.draw(dataArray, options);
  },

  changePeriod: function changePeriod(component, period) {
    if (window.ota_widget[component].period == period) return;
    window.ota_widget[component].period = period;
    window.ota_widget.charts.draw(component);
    ota_widget.tag.update();
  }
};

window.ota_widget.reviews_over_time = {

  period: 'quarter',

  loadData: function loadData() {
    var series = ['current', 'previous'];
    return {
      header: ota_widget.charts.t(['date'].concat(series)),
      id: 'over-time-chart',
      series: series,
      data: ota_widget.data.reviews_over_time.company
    };
  }
};

window.ota_widget.reviews_trends = {

  period: 'quarter',

  loadData: function loadData() {
    var series = ['property', 'covid_cases'];
    var data = {
      property: ota_widget.data.reviews_over_time.company.current,
      //country: ota_widget.data.reviews_over_time.country,
      //continent: ota_widget.data.reviews_over_time.continent,
      covid_cases: ota_widget.data.events.country
    };
    return {
      id: 'trends-chart',
      header: ota_widget.charts.t(['date'].concat(series)),
      series: series,
      data: data
    };
  }
};

window.ota_widget.covid_events = {

  period: 'quarter',

  loadData: function loadData() {
    var series = _.keys(ota_widget.data.events.continents);
    return {
      id: 'covid_events-chart',
      header: ota_widget.charts.t(['date'].concat(series)),
      series: series,
      data: ota_widget.data.events.continents
    };
  }
};

// Calculates the number of days from received date until now
window.ota_widget.date = {

  days_from: function days_from(date) {
    return parseInt((Date.now() - Date.parse(date)) / (1000 * 3600 * 24));
  },

  format: function format(dateStr, fmt) {
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var date = new Date(dateStr.split('-'));
    var month = monthNames[date.getMonth()];

    if (fmt == 'week') return date.getDate() + ' of ' + month;else if (fmt == 'month') return '' + month;
  }
};