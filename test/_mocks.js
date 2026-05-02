const nock = require('nock');

const createSecuritiesData = (start, count) => {
    const data = [];
    for (let i = 0; i < count; i++) {
        const secid = `SEC${String(start + i).padStart(4, '0')}`;
        data.push([
            secid, `Security ${start + i}`, '123', `Full name ${start + i}`, 'ISIN123',
            1, 1, 'Issuer', 'INN123', 'OKPO123', 'stock', 'group1', 'CETS', null
        ]);
    }
    return data;
};

const createMarketData = (count) => {
    const data = [];
    for (let i = 0; i < count; i++) {
        const secid = `SEC${String(i).padStart(4, '0')}`;
        data.push([
            secid, 'CETS', 100 + i, 90 + i, 110 + i, 80 + i, 95 + i, 5 + i,
            1000 + i * 10, 5000 + i * 50, 10000 + i * 100, 50000 + i * 500,
            100000 + i * 1000, 500 + i * 5, 2500 + i * 25, 12500 + i * 125, 'RUR', '2024-01-01'
        ]);
    }
    return data;
};

const setupMocks = () => {
    nock.disableNetConnect();

    // engines endpoint - camelCase
    nock('https://iss.moex.com').get('/iss/engines.json').reply(200, {
        engines: {
            columns: ['name', 'description'],
            data: [['stock', 'Stocks'], ['currency', 'Currency'], ['futures', 'Futures'], ['bond', 'Bonds'], ['marketdata', 'Market Data']]
        }
    }).persist();

    // index endpoint - camelCase
    nock('https://iss.moex.com').get('/iss.json').reply(200, {
        engines: { columns: ['name'], data: [['stock'], ['currency'], ['futures'], ['bond'], ['marketdata']] },
        markets: { columns: ['name'], data: [['shares'], ['selt'], ['index'], ['derivatives'], ['bonds']] },
        boards: { columns: ['boardid'], data: [['CETS'], ['TQBR'], ['RFUD'], ['RFLS'], ['INAV']] }
    }).persist();

    // securities definitions - camelCase, query(true) для гибкого сопоставления
    nock('https://iss.moex.com').get('/iss/securities.json').query(true).reply(function(uri) {
        const url = new URL(uri, 'https://iss.moex.com');
        const start = parseInt(url.searchParams.get('start') || '0', 10);
        const count = Math.min(100, 500 - start);
        const data = createSecuritiesData(start, count);
        return [200, {
            securities: {
                columns: ['secid', 'shortname', 'regnumber', 'name', 'isin', 'is_traded', 'emitent_id', 'emitent_title', 'emitent_inn', 'emitent_okpo', 'type', 'group', 'primary_boardid', 'marketprice_boardid'],
                data: data
            }
        }];
    }).persist();

    // markets endpoint - camelCase
    nock('https://iss.moex.com').get('/iss/engines/stock/markets.json').reply(200, {
        markets: {
            columns: ['NAME', 'DESCRIPTION'],
            data: [['shares', 'Shares'], ['index', 'Indexes'], ['derivatives', 'Derivatives'], ['bonds', 'Bonds'], ['futures', 'Futures']]
        }
    }).persist();

    // boards endpoint - camelCase
    nock('https://iss.moex.com').get('/iss/engines/currency/markets/selt/boards.json').reply(200, {
        boards: {
            columns: ['boardid', 'engine', 'market', 'boardname', 'active', 'primary'],
            data: [['CETS', 'currency', 'selt', 'Main', 1, 1], ['TQBR', 'currency', 'selt', 'Secondary', 1, 0]]
        }
    }).persist();

    // security definitions - camelCase
    nock('https://iss.moex.com').get('/iss/securities/USD000UTSTOM.json').reply(200, {
        securities: {
            columns: ['secid', 'shortname', 'regnumber', 'name', 'isin', 'is_traded', 'emitent_id', 'emitent_title', 'emitent_inn', 'emitent_okpo', 'type', 'group', 'primary_boardid', 'marketprice_boardid'],
            data: [['USD000UTSTOM', 'USD/RUB', '123', 'US Dollar', 'US123', 1, 1, 'Issuer', 'INN', 'OKPO', 'currency', 'selt', 'CETS', null]]
        },
        description: { columns: ['name', 'value'], data: [['description', 'USD/RUB Security']] },
        boards: { columns: ['boardid', 'engine', 'market', 'boardname', 'active', 'primary'], data: [['CETS', 'currency', 'selt', 'Main', 1, 1]] }
    }).persist();

    nock('https://iss.moex.com').get('/iss/securities/IMOEX.json').reply(200, {
        securities: {
            columns: ['secid', 'shortname', 'regnumber', 'name', 'isin', 'is_traded', 'emitent_id', 'emitent_title', 'emitent_inn', 'emitent_okpo', 'type', 'group', 'primary_boardid', 'marketprice_boardid'],
            data: [['IMOEX', 'MOEX Index', '123', 'Moscow Exchange Index', 'RU123', 1, 1, 'Issuer', 'INN', 'OKPO', 'stock', 'index', 'TQBR', null]]
        },
        description: { columns: ['name', 'value'], data: [['description', 'MOEX Index']] },
        boards: { columns: ['boardid', 'engine', 'market', 'boardname', 'active', 'primary'], data: [['TQBR', 'stock', 'index', 'Main', 1, 1]] }
    }).persist();

    nock('https://iss.moex.com').get('/iss/securities/RTSI.json').reply(200, {
        securities: {
            columns: ['secid', 'shortname', 'regnumber', 'name', 'isin', 'is_traded', 'emitent_id', 'emitent_title', 'emitent_inn', 'emitent_okpo', 'type', 'group', 'primary_boardid', 'marketprice_boardid'],
            data: [['RTSI', 'RTS Index', '123', 'RTS Index', 'RU123', 1, 1, 'Issuer', 'INN', 'OKPO', 'stock', 'index', 'TQBR', null]]
        },
        description: { columns: ['name', 'value'], data: [['description', 'RTS Index']] },
        boards: { columns: ['boardid', 'engine', 'market', 'boardname', 'active', 'primary'], data: [['TQBR', 'stock', 'index', 'Main', 1, 1]] }
    }).persist();

    nock('https://iss.moex.com').get('/iss/securities/SBER.json').reply(200, {
        securities: {
            columns: ['secid', 'shortname', 'regnumber', 'name', 'isin', 'is_traded', 'emitent_id', 'emitent_title', 'emitent_inn', 'emitent_okpo', 'type', 'group', 'primary_boardid', 'marketprice_boardid'],
            data: [['SBER', 'Sberbank', '123', 'Sberbank of Russia', 'RU123', 1, 1, 'Issuer', 'INN', 'OKPO', 'stock', 'shares', 'TQBR', null]]
        },
        description: { columns: ['name', 'value'], data: [['description', 'Sberbank']] },
        boards: { columns: ['boardid', 'engine', 'market', 'boardname', 'active', 'primary'], data: [['TQBR', 'stock', 'shares', 'Main', 1, 1]] }
    }).persist();

    // securitiesDataRaw for currency/selt - UPPER CASE
    nock('https://iss.moex.com').get('/iss/engines/currency/markets/selt/securities.json').query(true).reply(function(uri) {
        const url = new URL(uri, 'https://iss.moex.com');
        const first = parseInt(url.searchParams.get('first') || '50', 10);
        const securitiesData = createSecuritiesData(0, first);
        const marketData = createMarketData(first);
        return [200, {
            securities: {
                columns: ['SECID', 'SHORTNAME', 'REGNUMBER', 'NAME', 'ISIN', 'IS_TRADED', 'EMITENT_ID', 'EMITENT_TITLE', 'EMITENT_INN', 'EMITENT_OKPO', 'TYPE', 'GROUP', 'PRIMARY_BOARDID', 'MARKETPRICE_BOARDID', 'LAST', 'OPEN', 'HIGH', 'LOW', 'PREVPRICE', 'CURRENCYID'],
                data: securitiesData
            },
            marketdata: {
                columns: ['SECID', 'BOARDID', 'LAST', 'OPEN', 'HIGH', 'LOW', 'PREVPRICE', 'LASTCHANGE', 'VALUE', 'VALRUB', 'VOLUME', 'VOLUMERUB', 'TURNOVER', 'VOLTODAY', 'VALTODAY', 'VALTODAY_RUR', 'CURRENCYID', 'TRADEDATE'],
                data: marketData
            }
        }];
    }).persist();

    // securitiesDataRaw for stock/index
    nock('https://iss.moex.com').get('/iss/engines/stock/markets/index/securities.json').query(true).reply(function(uri) {
        const url = new URL(uri, 'https://iss.moex.com');
        const first = parseInt(url.searchParams.get('first') || '50', 10);
        const securitiesData = createSecuritiesData(0, first);
        const marketData = createMarketData(first);
        return [200, {
            securities: {
                columns: ['SECID', 'SHORTNAME', 'REGNUMBER', 'NAME', 'ISIN', 'IS_TRADED', 'EMITENT_ID', 'EMITENT_TITLE', 'EMITENT_INN', 'EMITENT_OKPO', 'TYPE', 'GROUP', 'PRIMARY_BOARDID', 'MARKETPRICE_BOARDID', 'LAST', 'OPEN', 'HIGH', 'LOW', 'PREVPRICE', 'CURRENCYID'],
                data: securitiesData
            },
            marketdata: {
                columns: ['SECID', 'BOARDID', 'LAST', 'OPEN', 'HIGH', 'LOW', 'PREVPRICE', 'LASTCHANGE', 'VALUE', 'VALRUB', 'VOLUME', 'VOLUMERUB', 'TURNOVER', 'VOLTODAY', 'VALTODAY', 'VALTODAY_RUR', 'CURRENCYID', 'TRADEDATE'],
                data: marketData
            }
        }];
    }).persist();

    // security market data for USD000UTSTOM - UPPER CASE
    nock('https://iss.moex.com').get('/iss/engines/currency/markets/selt/securities/USD000UTSTOM.json').reply(200, {
        securities: {
            columns: ['SECID', 'SHORTNAME', 'REGNUMBER', 'NAME', 'ISIN', 'IS_TRADED', 'EMITENT_ID', 'EMITENT_TITLE', 'EMITENT_INN', 'EMITENT_OKPO', 'TYPE', 'GROUP', 'PRIMARY_BOARDID', 'MARKETPRICE_BOARDID', 'LAST', 'OPEN', 'HIGH', 'LOW', 'PREVPRICE', 'CURRENCYID'],
            data: [['USD000UTSTOM', 'USD/RUB', '123', 'US Dollar', 'US123', 1, 1, 'Issuer', 'INN', 'OKPO', 'currency', 'selt', 'CETS', null, 100, 90, 110, 80, 95, 'RUR']]
        },
        marketdata: {
            columns: ['SECID', 'BOARDID', 'LAST', 'OPEN', 'HIGH', 'LOW', 'PREVPRICE', 'LASTCHANGE', 'VALUE', 'VALRUB', 'VOLUME', 'VOLUMERUB', 'TURNOVER', 'VOLTODAY', 'VALTODAY', 'VALTODAY_RUR', 'CURRENCYID', 'TRADEDATE'],
            data: [['USD000UTSTOM', 'CETS', 100, 90, 110, 80, 95, 5, 1000, 5000, 10000, 50000, 100000, 500, 2500, 12500, 'RUR', '2024-01-01']]
        }
    }).persist();

    // security market data for IMOEX - UPPER CASE
    nock('https://iss.moex.com').get('/iss/engines/stock/markets/index/securities/IMOEX.json').reply(200, {
        securities: {
            columns: ['SECID', 'SHORTNAME', 'REGNUMBER', 'NAME', 'ISIN', 'IS_TRADED', 'EMITENT_ID', 'EMITENT_TITLE', 'EMITENT_INN', 'EMITENT_OKPO', 'TYPE', 'GROUP', 'PRIMARY_BOARDID', 'MARKETPRICE_BOARDID', 'LAST', 'OPEN', 'HIGH', 'LOW', 'PREVPRICE', 'CURRENCYID'],
            data: [['IMOEX', 'MOEX Index', '123', 'Moscow Exchange Index', 'RU123', 1, 1, 'Issuer', 'INN', 'OKPO', 'stock', 'index', 'TQBR', null, 2500, 2490, 2510, 2480, 2495, null]]
        },
        marketdata: {
            columns: ['SECID', 'BOARDID', 'LAST', 'OPEN', 'HIGH', 'LOW', 'PREVPRICE', 'LASTCHANGE', 'VALUE', 'VALRUB', 'VOLUME', 'VOLUMERUB', 'TURNOVER', 'VOLTODAY', 'VALTODAY', 'VALTODAY_RUR', 'CURRENCYID', 'TRADEDATE'],
            data: [['IMOEX', 'TQBR', 2500, 2490, 2510, 2480, 2495, 5, 1000000, 5000000, 100000, 5000000, 100000000, 5000, 25000, 125000, null, '2024-01-01']]
        }
    }).persist();

    // security market data for RTSI - UPPER CASE
    nock('https://iss.moex.com').get('/iss/engines/stock/markets/index/securities/RTSI.json').reply(200, {
        securities: {
            columns: ['SECID', 'SHORTNAME', 'REGNUMBER', 'NAME', 'ISIN', 'IS_TRADED', 'EMITENT_ID', 'EMITENT_TITLE', 'EMITENT_INN', 'EMITENT_OKPO', 'TYPE', 'GROUP', 'PRIMARY_BOARDID', 'MARKETPRICE_BOARDID', 'LAST', 'OPEN', 'HIGH', 'LOW', 'PREVPRICE', 'CURRENCYID'],
            data: [['RTSI', 'RTS Index', '123', 'RTS Index', 'RU123', 1, 1, 'Issuer', 'INN', 'OKPO', 'stock', 'index', 'TQBR', null, 1000, 990, 1010, 980, 995, null]]
        },
        marketdata: {
            columns: ['SECID', 'BOARDID', 'LAST', 'OPEN', 'HIGH', 'LOW', 'PREVPRICE', 'LASTCHANGE', 'VALUE', 'VALRUB', 'VOLUME', 'VOLUMERUB', 'TURNOVER', 'VOLTODAY', 'VALTODAY', 'VALTODAY_RUR', 'CURRENCYID', 'TRADEDATE'],
            data: [['RTSI', 'TQBR', 1000, 990, 1010, 980, 995, 5, 500000, 2500000, 50000, 2500000, 50000000, 2500, 12500, 62500, null, '2024-01-01']]
        }
    }).persist();

    // security market data for SBER - UPPER CASE
    nock('https://iss.moex.com').get('/iss/engines/stock/markets/shares/securities/SBER.json').reply(200, {
        securities: {
            columns: ['SECID', 'SHORTNAME', 'REGNUMBER', 'NAME', 'ISIN', 'IS_TRADED', 'EMITENT_ID', 'EMITENT_TITLE', 'EMITENT_INN', 'EMITENT_OKPO', 'TYPE', 'GROUP', 'PRIMARY_BOARDID', 'MARKETPRICE_BOARDID', 'LAST', 'OPEN', 'HIGH', 'LOW', 'PREVPRICE', 'CURRENCYID'],
            data: [['SBER', 'Sberbank', '123', 'Sberbank of Russia', 'RU123', 1, 1, 'Issuer', 'INN', 'OKPO', 'stock', 'shares', 'TQBR', null, 250, 249, 251, 248, 249, 'RUR']]
        },
        marketdata: {
            columns: ['SECID', 'BOARDID', 'LAST', 'OPEN', 'HIGH', 'LOW', 'PREVPRICE', 'LASTCHANGE', 'VALUE', 'VALRUB', 'VOLUME', 'VOLUMERUB', 'TURNOVER', 'VOLTODAY', 'VALTODAY', 'VALTODAY_RUR', 'CURRENCYID', 'TRADEDATE'],
            data: [['SBER', 'TQBR', 250, 249, 251, 248, 249, 1, 2000000, 10000000, 200000, 10000000, 200000000, 10000, 50000, 250000, 'RUR', '2024-01-01']]
        }
    }).persist();
};

module.exports = { setupMocks, nock };

// Dummy test to prevent Jest from failing on this file
describe("Mock utilities", () => {
    test("should export setupMocks function", () => {
        expect(typeof setupMocks).toBe("function");
        expect(typeof nock).toBe("function");
    });
});