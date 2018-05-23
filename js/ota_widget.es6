---
---

window.ota_widget = {

  tags: {},
  
  init: (token) => {
    if (token) ota_widget.api.token = token
  },

  load: () => {
    ota_widget.api.review_content({}).then((json) => {
      ota_widget.loadTag('overall', json.data)
    })
  },

  loadTag: (name, opts) => {
    riot.tag(name)
    ota_widget.tags[name] = riot.mount(name, opts)[0]
  },
}

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

window.ota_widget.api = {
  baseUrl:    'https://agora.olery.com',
  version:    'v3',
  company_id: ota_widget.url.params.company_id,
  token:      ota_widget.url.params.token,

  review_content: ({params = {}}) => {
    return ota_widget.api.req({
      path: `companies/${ota_widget.api.company_id}/review_content`,
    })
  },

  req: ({path, params = {}}) => {
    params.auth_token = ota_widget.api.token
    return window
      .fetch(`${ota_widget.api.baseUrl}/${ota_widget.api.version}/${path}?${ota_widget.url.objectToQuery(params)}`)
    .then((response) => {
      return response.json()
    })
  },
}

