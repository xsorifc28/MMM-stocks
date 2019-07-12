
'use strict';


Module.register("stocks", {

    result: [],
    // Default module config.
    defaults: {
        crypto: 'BTCUSDT,LTCUSDT,ETHUSDT',
        stocks: 'MSFT,AAPL,GOOG,INTC',
        updateInterval: 60000
    },

    getStyles: function () {
        return ["stocks.css"];
    },

    start: function () {
        this.getStocks();
        this.scheduleUpdate();
    },

    // Override dom generator.
    getDom: function () {
        var wrapper = document.createElement("marquee");
        var count = 0;
        var _this = this;

        wrapper.className = 'medium bright';

        if (this.result.length > 0) {
            this.result.forEach(function (stock) {
                var symbolElement = document.createElement("span");
                var symbol = stock.symbol;
                var lastPrice = stock.latestPrice;
                var changePercentage = stock.changePercent;
                var changeValue = stock.change;
                var lastClosePrice = stock.close;
                var lastPriceFix = stock.latestPrice;

                symbolElement.innerHTML = symbol + ' ';
                wrapper.appendChild(symbolElement);

                var priceElement = document.createElement("span");
                priceElement.innerHTML = `$${_this.formatMoney(lastPrice)}`;

                var changeElement = document.createElement("span");
                if (changePercentage > 0)
                    changeElement.className = "up";
                else
                    changeElement.className = "down";

                var change = Math.abs(changeValue, -2);

                changeElement.innerHTML = " " + change;

                var divider = document.createElement("span");

                if (count < _this.result.length - 1)
                    divider.innerHTML = '  •  ';

                wrapper.appendChild(priceElement);
                wrapper.appendChild(changeElement);
                wrapper.appendChild(divider);
                count++;
            });

        }

        return wrapper;
    },

    formatMoney: function (amount, decimalCount = 2, decimal = ".", thousands = ",") {
        try {
            decimalCount = Math.abs(decimalCount);
            decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

            const negativeSign = amount < 0 ? "-" : "";

            let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
            let j = (i.length > 3) ? i.length % 3 : 0;

            return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
        } catch (e) {
            console.log(e)
        }
    },

    scheduleUpdate: function (delay) {
        var nextLoad = this.config.updateInterval;
        if (typeof delay !== "undefined" && delay >= 0) {
            nextLoad = delay;
        }

        var self = this;
        setInterval(function () {
            self.getStocks();
        }, nextLoad);
    },

    roundValue: function (value) {
        return Math.round(value * 100) / 100;
    },

    getStocks: function () {
        var requestUrls = [];
        var token = 'YOUR_TOKEN_HERE'
        var url = "https://cloud.iexapis.com/v1/"
        var stocksArray = this.config.stocks.split(',');
        var cryptoArray = this.config.crypto.split(',');


        cryptoArray.forEach(function (stock) {
            var requestUrl = url + 'crypto/' + stock + "/quote?token=" + token;
            requestUrls.push(requestUrl);
        });


        stocksArray.forEach(function (stock) {
            var requestUrl = url + 'stock/' + stock + "/quote?token=" + token;
            requestUrls.push(requestUrl);
        });

        this.sendSocketNotification('GET_STOCKS_MULTI', requestUrls);
    },


    socketNotificationReceived: function (notification, payload) {
        if (notification === "STOCKS_RESULT") {
            this.result = payload;
            this.updateDom(self.config.fadeSpeed);
        }
    },

});
