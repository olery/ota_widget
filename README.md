# Welcome to OTA Widget by Olery BV

## What's this?
OTA Widget is an example of the implementation of a widget showing the main review content for a specific hotel.
It's free for our customers to checkout and use directly or selecting specific blocks of content. You can also use it as an inspiration on how to build your own.

## The data
This widget relies on the data provided by the `review_widget` endpoint. An example of the structure of the data is provided [here](/data_example.md)
A minimal change in its structure is made in the js code just before the rendering (`function transformData`).

## The code
This repository uses the github pages structure to build the pages into the `docs` directory. You can get the code already compiled in the docs directory instead of using the source and having to learn how to code in `slim` by example.

This widget is written using components (HTML tags) rendered by [RiotJS](https://riot.js.org/).

The css styles were kept very minimalist to make it easy for customizations. We use [Material Design](https://material.io/collections/developer-tutorials/#web) (Google Material Components for the Web) for organizing the boxes. You can identify the its classes by the `mdc-` preffix.

For the country flags, we are using a library called [Flag Sprites](https://www.flag-sprites.com/). It's free for use. 

## Getting Started

1. Start by closing this repository into your computer or server

2. Enter the directory

```
$ cd ota_widget
```

3. If you don't have it. Install Bundler. You should have ruby and rubygem installed.
```
$ gem install bundler
```

4. Install dependencies
```
$ bundle install
```

5. Run jekyll as server, so it will update on any change you make
```
$ jekyll s --watch
```

6. Point your browser to [http://localhost:4000/](http://localhost:4000?token=XXX&company_id=) (update `token` with your received token and `company_id` with a company you have access to) and check it working.

You can start making changes in the js, css or index.slim files and see the results in the browser by hitting F5 or you can get the resulting code in the `docs` directory and adjust to embed in your actual website.

7. Before publishing the widget, replace the API endpoint url to your server. This way, you won't publish your Olery user token.

## Translations
This widget is prepared to receive translations. In the `js` folder, you will find a file called `locales.es6`, or you can use directly the compiled version in `docs/js/locales.js`.
You can copy-and-paste the entire `en` translation into another key and translate the content. For testing, you should append the `lang=` parameter in the url.
For instance, if you want to translate this widget into the japanese language, you should have a new hash key `ja` and point your browser to http://localhost:4000?token=XXX&company_id=123&lang=ja

You can also change the default language in the `ota_widget.js` file (`locale` variable)
