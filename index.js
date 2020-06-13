const http = require('http');
const url = require('url');

require('dotenv').config();
const ACCOUNT_ID = process.env.TWILIO_ACCOUNT_ID;
const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;

const axios = require('axios');
const cheerio = require('cheerio');
const twilio = require('twilio')(ACCOUNT_ID, AUTH_TOKEN);

const productNotification = function (productInfo) {
  const id = productInfo.id;
  const title = productInfo.title;
  const url = productInfo.url;

  const body = title + ' is in stock at ' + url + '!';

  twilio.messages
    .create({
      'body': body,
      'from': process.env.FROM_NUMBER,
      'to': process.env.TO_NUMBER,
    })
    .then(message => console.log(message.sid));
}

const productsInfo = [
  {
    'id': '85743',
    'title': '15 pound fleck',
    'url': 'https://www.roguefitness.com/rogue-fleck-plates',
  },
  {
    'id': '85745',
    'title': '25 pound fleck',
    'url': 'https://www.roguefitness.com/rogue-fleck-plates',
  },
  {
    'id': '85747',
    'title': '35 pound fleck',
    'url': 'https://www.roguefitness.com/rogue-fleck-plates',
  },
  {
    'id': '85749',
    'title': '45 pound fleck',
    'url': 'https://www.roguefitness.com/rogue-fleck-plates',
  },
  {
    'id': '85753',
    'title': '55 pound fleck',
    'url': 'https://www.roguefitness.com/rogue-fleck-plates',
  },
];

const checkStock = function () {
  const url = 'https://www.roguefitness.com/rogue-fleck-plates';
  axios.get(url)
    .then(response => {
      const $ = cheerio.load(response.data);
      productsInfo.forEach((productInfo) => {
        const id = productInfo.id;
        const title = productInfo.title;
        const productURL = productInfo.url;

        let product = $('.product-purchase-wrapper-' + id);
        if (!product) return;

        if (product.find('.color-swatch-wrapper').length === 1) {
          const swatch_container = product.find('color-swatch-container');
          const swatches = swatch_container.find('div[id^="swatch-main-' + productID + '"]');

        for (var swatch_index = 0; swatch_index < swatches.length; swatch_index++) {
          var swatch = swatches[swatch_index];
          if (!swatch.classList.contains('swatch-oos')) {
            productNotification({'id': id, 'title': title, 'url': productURL});
            break;
          }
        };

        } else if (product.find('.bin-stock-availability')) {
          console.log('Product not available.');
        } else {
          console.log('Product is available! ' + title);
          productNotification({'id': id, 'title': title, 'url': productURL});
        }

      });
    })
    .catch(error => {
      console.log(error);
    })
}
setInterval(checkStock, 15 * 1000)
