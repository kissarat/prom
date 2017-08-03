const http = require('http')
const {JSDOM} = require('jsdom')
const request = require('request-promise')
const qs = require('querystring')

function setupDOMUtils(window) {
  const document = window.document

  function properties(entity) {
    const o = {}
    for (const element of entity.querySelectorAll('[itemprop]')) {
      let value
      if ('A' === element.tagName) {
        value = element.href
      }
      else if ('IMG' === element.tagName) {
        value = element.src
      }
      else {
        value = element.innerHTML.trim().replace(/\s+/g, ' ')
      }
      o[element.getAttribute('itemprop')] = value
    }
    return o
  }

  function entities(name = 'Product', fn = properties) {
    return [].map.call(document.querySelectorAll(`[itemtype="http://schema.org/${name}"]`), fn)
  }

  return {entities, properties}
}

function normalizeProduct(product) {
  delete product.offers
  delete product.reviewRating
  delete product.ratingValue
  delete product.author
  delete product.dateCreated
  delete product.relatedLink
  return product
}

const server = http.createServer(async function (req, res) {
  let status = 200
  let data
  const jsonp = /callback=([\w_]+)/.exec(req.url)
  const rsHeaders = {
    'content-type': (jsonp ? 'text/javascript' : 'application/json') + '; charset=utf8'
  }
  try {
    if (['/robots.txt', '/favicon.ico'].indexOf(req.url) >= 0) {
      res.writeHead(404)
      return res.end()
    }
    const url = /\/https?:\/\//.test(req.url) ? req.url.slice(1) : 'http://prom.ua' + req.url
    const rqHeaders = {}
    if (url.indexOf('my.prom.ua/remote/context_ads') < 0) {
      rqHeaders['x-requested-with'] = 'XMLHttpRequest'
    }
    for (const header of ['cookie', 'user-agent']) {
      rqHeaders[header] = req.headers[header]
    }
    const clientRequest = request({url, headers: rqHeaders})
    const body = await clientRequest
    const cRes = clientRequest.response
    if (cRes.statusCode >= 300) {
      if (cRes.headers.location) {
        data = {
          status: 200,
          redirect: cRes.headers.location
        }
      }
      status = cRes.statusCode
      if (400 === cRes.statusCode || cRes.statusCode > 404) {
        data = {
          error: {
            message: 'Unknown response'
          },
          content: body
        }
      }
    }
    else if (/class="[^"]*x-product-page[^"]*"/.test(body)) {
      const {window} = new JSDOM(body)
      const document = window.document
      const {properties} = setupDOMUtils(window)
      data = {
        type: 'product',
        url: clientRequest.href,
        product: properties(document.body)
      }
      const contact = document.querySelector('[data-qaid="show-all-phones-link"]')
      if (contact) {
        data.contact = {
          url: contact.getAttribute('contacts-url'),
          phones: JSON.parse(contact.getAttribute('data-pl-phones')),
          main_phone: contact.getAttribute('data-pl-main-phone')
        }
        data.product_id = contact.getAttribute('data-product-id')
        data.company_id = contact.getAttribute('data-company-id')
      }
      data.product = normalizeProduct(data.product)
    }
    else {
      const prom = JSON.parse(body)
      const {window} = new JSDOM(`<html><body>${prom.products_html}</body></html>`)
      const products = setupDOMUtils(window).entities()
      for (const product of products) {
        if (product.url) {
          const parts = product.url.split('?')
          if (parts[1]) {
            const params = qs.parse(parts[1])
            for (const key in params) {
              if (params[key]) {
                product[key] = params[key]
              }
            }
          }
        }
      }
      data = {
        type: 'product-list',
        products: products.map(normalizeProduct)
      }
      if (prom.deferred_payloads) {
        data.deferred_payloads = prom.deferred_payloads
      }
      if (prom.targeting_params) {
        data.targeting_params = prom.targeting_params
      }
      if (0 === products.length) {
        data.content = body
      }
    }
  }
  catch (ex) {
    status = ex.statusCode || 500
    data = {
      error: {
        message: ex.message || ex.toString()
      }
    }
  }
  data = JSON.stringify(data)
  if (jsonp) {
    data = jsonp[1] + `(${data})`
  }
  res.writeHead(status, rsHeaders)
  res.end(data)
})

const port = +process.argv[process.argv.length - 1] || 8080
server.listen(port, function () {
  console.log(`Listen at http://localhost:${port}/`)
})
