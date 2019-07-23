# Module: stocks
The `stocks` module is a <a href="https://github.com/MichMich/MagicMirror">MagicMirror</a> addon.
This module displays a scrolling stocks ticker on your MagicMirror.


## Using the module

To use this module, add it to the modules array in the `config/config.js` file:
````javascript
modules: [
  {
    module: 'stocks',
        position: 'bottom_bar',
    config: {
      apiKey: 'YOUR_KEY_GOES_HERE', // api token from https://cloud.iexapis.com
      crypto: 'BTCUSDT,LTCUSDT,ETHUSDT', // crypto symbols
      separator: '&nbsp;&nbsp;•&nbsp;&nbsp;', // separator between stocks
      stocks: 'MSFT,AAPL,GOOG,INTC', // stock symbols
      updateInterval: 37000 // update interval in milliseconds
    }
  }
]
````

