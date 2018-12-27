---
---

// ota_widget object: all variables and behavior of the OTA Widget is stored here
window.ota_widget = {

  locale: 'en',

  // this key will hold the RiotJS mounted tag. We usually need this tag to access its data and behaviour.
  tag: null,

  // initialization function: loads locale and loads Riot component
  init: (token) => {
    if (token) ota_widget.api.token = token

    ota_widget.i18n.compiled = _.mapValues(ota_widget.i18n.locales, (t) => ota_widget.i18n.flatten(t))

    if (ota_widget.url.params.lang && ota_widget.i18n.compiled[ota_widget.url.params.lang]) {
      ota_widget.locale = ota_widget.url.params.lang
    }

    ota_widget.tag = ota_widget.loadTag('ota-widget', ota_widget.ui.tagClass)
  },

  // load widget data from api and transform it to be shown in each block
  load: () => {
    ota_widget.api.review_widget({}).then((json) => {
      ota_widget.tag.d = ota_widget.ui.transformData(json.data)
      ota_widget.tag.update()
    })
  },

  // loadTag function. Mounts template tag
  loadTag: (name, scriptFunc, opts) => {
    riot.tag2(name, null, '', '', scriptFunc)
    var tag = riot.mount(name, opts)[0]
    tag.root.style.display = 'block'
    return tag
  },
}

// translation functions. Can receive a opts Object with values for a translation.
// Example translation: %{number} dishes in the table
// While translating this sentence above, a number value should be given.
// Depending on the language, the %{number} piece can be in a different position
window.ota_widget.i18n = {
  translate: (key, opts) => {
    var value = ota_widget.i18n.compiled[ota_widget.locale][key]
    value && _.each(opts, (v, k) => {
      value = value.replace("%{" + k + "}", v)
    })

    opts = opts || {default: ''}
    
    return value ? value : opts.default
  },

  flatten: (obj) => {
    var flattenOne = (plainObject, namespace, result) => {
      if (namespace == null) namespace = ''
      if (result == null) result = {}

      return _.reduce(plainObject, (result, value, key) => {
        var newKey = `${namespace}${namespace ? '.' : ''}${key}`
        if (_.isPlainObject(value)) {
          if (_.size(value)) flattenOne(value, newKey, result)
        } else result[newKey] = value
        return result
      }, result)
    }
    return flattenOne(obj)
  },
}

window.ota_widget.ui = {

  compositionIcons: {
    families:     'child_friendly',
    couples:      'favorite',
    friends:      'group',
    solo:         'person',
    business:     'business_center',
    group:        'directions_bus',
    other:        'person',
    seniors:      'person',
    young_adults: 'person',
  },

  topicIgnoreList: [
    'room',
    'cleanliness',
    'facilities',
    'food',
    'location',
    'problem',
    'value_for_money'
  ],

  // function used by RiotJS when it's mounting the ota-widget tag
  tagClass: function (opts) {
    this.w = window.ota_widget
    this.d = {}
    this.t = this.w.i18n.translate

    this.clear = function () {
      this.d = {}
      this.update()
    }
  },
  
  // Make little changes in the received data to present it in the blocks.
  transformData: (data) => {
    data.ratings   = _.orderBy(data.ratings, 'value', 'desc')

    _.remove(data.mentions, (m) => {
      m.percentage = 100*m.positive_opinions/m.opinions_count
      return _.find(ota_widget.ui.topicIgnoreList, (t) => t == m.topic)
    })

    data.summaries = _.map(data.summaries, (s) => s[Object.keys(s)[0]] )

    ota_widget.ui.calcRatingsPercentages(data.guests.countries)
    ota_widget.ui.calcRatingsPercentages(data.guests.compositions)
    data.cached_at = new Date(data.updated_at).toLocaleDateString()

    _.each(data.recent_reviews, (review) => {
      ota_widget.ui.join_topics(review, ota_widget.i18n.translate('recent_reviews.separator').toLowerCase())
    })

    return data
  },

  // calculates the overall ratings percentages
  calcRatingsPercentages: (groupedRatings) => {
    var total = _.sumBy(groupedRatings, (c) => {
      c.review_count = _.find(c.ratings, (r) => r.topic == 'overall').review_count
      return c.review_count
    })
    _.each(groupedRatings, (c) => c.percentage = 100*c.review_count/total )
  },

  // transforms data needed by recent reviews block
  join_topics: (review, sep) => {
    _.each(['positive', 'negative'], (polarity) => {

      var topics = _.compact(_.uniq(_.flatten(_.map(review.opinions, (op) => {
        if (op.polarity == polarity) return op.topics
      }))))

      var key = polarity + '_topics'
      review[key] = _.join(_.map(topics, (topic) => { return ota_widget.topic_label_for(topic) }), sep)
    })
  }
}

// Generates classes to render in the recent reviews block with ratings through stars.
window.ota_widget.rating_stars = (ratings, category) => {
  let value = _.compact(_.map(ratings, (rating) => { if (rating.category == category) return rating.rating }))[0]
  let classes = [];
  for (let i = 0; i < parseInt(value / 20); i++ )
    classes.push('star')
  for (let i = 0; i < parseInt((value % 20)/10); i++ )
    classes.push('star_half')

  return classes;
}

// Generates classes for colouring the ratings from red (0) to green (100).
window.ota_widget.ratings = {

  mod4: (value) => {
    return Math.floor((value - 1) / 4) * 4
  },

  format: (value) => {
    if (!value && value != '0') return '-'
    value = parseFloat(value).toFixed(1)
    return value == 10 ? '10' : value
  },

  toCss: (value10) => {
    return ota_widget.ratings.toCss100(parseFloat(value10) * 10)
  },

  toCss100: (value) => {
    if (!value && value != '0') return 'rating-unknown'

    value = parseFloat(value)
    if (value <= 4)  return 'rating0-4'
    if (value >= 97) return 'rating97-100'

    return `rating${ota_widget.ratings.mod4(value) + 1}-${ota_widget.ratings.mod4(value) + 4}`
  },
}

// Build the url params into a hash to be processed and back to string for building the new url
window.ota_widget.url = {

  params: _.chain(window.location.search.slice(1).split('&'))
    .map((item) => { if (item) return item.split('=') })
    .compact()
    .fromPairs()
    .value(),

  objectToQuery: (obj) => {
    return _.map(obj, (v, k) => `${k}=${encodeURIComponent(v)}` ).join('&')
  },
}

// Build the api endpoint url. You should change at least baseURL and probably adjust the req function for your server url pattern.
window.ota_widget.api = {

  baseUrl:    'https://agora.olery.com',
  version:    'v3',
  company_id: ota_widget.url.params.company_id,
  token:      ota_widget.url.params.token,

  review_widget: ({params = {}}) => {
    return ota_widget.api.req({
      path: `companies/${ota_widget.api.company_id}/review_widget`,
    })
  },

  req: ({path, baseUrl = ota_widget.api.baseUrl,
        version = ota_widget.api.version, params = {}}) => {
    params.auth_token = ota_widget.api.token
    params = ota_widget.url.objectToQuery(params)

    return window
      .fetch(`${baseUrl}/${version}/${path}?${params}`)
      .then((response) => {
        return response.json()
      })
  },
}

// Transforms distance from mile to kilometer
window.ota_widget.ml2km = (distance) => {
  return Math.round(distance * 160.934) / 100;
}

// Calculates the number of days from received date until now
window.ota_widget.days_from = (date) => {
  return parseInt( (Date.now() - Date.parse(date)) / (1000*3600*24) )
}

// Try to load a translation for a topic. If none found, returns the capitalized version of the topic.
// It's a fallback function for missing topic translations
window.ota_widget.topic_label_for = (topic) => {
  let label = ota_widget.i18n.translate('opinions.topics.'+topic, {default: undefined})
  if (label == undefined) {
    label = _.startCase(topic)
  }
  return label.toLowerCase()
}
