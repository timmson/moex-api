# Moex API / API Московской Бирже


MOEX ISS API  
[http://moex.com/iss/reference/](http://moex.com/iss/reference/)

#### ru
Доступ к данным Московской Бирже через ISS API.

## Installation
`npm install micex.api`

```js
const MoexAPI = require("moex-api");

const moexApi = new MoexAPI();
```

## Request example

Get current USD/RUB value.

```js
moexApi.securityMarketdata("USD000UTSTOM").then((security) => {
        console.log(security.node.last); // e.g. 64.04
        console.log(security);
    });
```

part of output
```js
{ SPREAD: 0.009,
  HIGH: 64.7,
  LOW: 63.455,
  OPEN: 64.098,
  LAST: 64.04,
  LASTCNGTOLASTWAPRICE: -0.0359,
  VALTODAY: 303942518535,
  VOLTODAY: 4738709000,
  VALTODAY_USD: 4738709000,
  WAPRICE: 64.1404,
  WAPTOPREVWAPRICE: 0.0645,
  CLOSEPRICE: 63.8399,
  NUMTRADES: 58453,
```

## More examples

```js
moexApi.securityMarketdata("MICEXINDEXCF"); //MICEX INDEX
moexApi.securityMarketdata("RTSI"); //RTS INDEX
moexApi.securityMarketdata("SBER"; //SBERBANK SHARES
moexApi.securityMarketdata("RIZ5"); //FUTURES RTS 12.15
```

## Available methods

```js
moexApi.index;
moexApi.engines;
moexApi.markets(engine);
moexApi.boards(engine, market);
moexApi.securitiesDefinitions(query);
moexApi.securityDefinition(security);
moexApi.securitiesMarketData(engine, market, query);
moexApi.securitiesDataRaw(engine, market, query);
moexApi.getSecurityInfo(security);
moexApi.securityMarketData(security);
```

## More info

Api class - [api.js](api.js)  
Usage examples / tests - [test/test-api.js](test/test-api.js)
