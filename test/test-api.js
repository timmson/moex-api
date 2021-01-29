const MoexAPI = require("../api");

describe("MoexAPI.", () => {

	const moexApi = new MoexAPI();

	describe("General.", () => {

		test("General request", () => {
			expect(moexApi).not.toBeUndefined();
			expect(MoexAPI._request).not.toBeUndefined();
			return MoexAPI._request("engines").then((data) => {
				expect(data).toHaveProperty("engines");
				expect(data.engines).toHaveProperty("data");
			});
		});

		test("Index request. Should have engines, markets, boards", () => {
			return moexApi.index().then((blocks) => {
				expect(blocks).not.toBeUndefined();
				expect(blocks.engines).not.toBeUndefined();
				expect(blocks.markets).not.toBeUndefined();
				expect(blocks.boards).not.toBeUndefined();

				expect(blocks.engines.length).toBeGreaterThanOrEqual(5);
				expect(blocks.markets.length).toBeGreaterThanOrEqual(5);
				expect(blocks.boards.length).toBeGreaterThanOrEqual(5);
			});
		});

		test("Engines. Should be at least 3, should have stock engine", () => {
			return moexApi.engines()
				.then((engines) => {
					expect(engines.length).toBeGreaterThanOrEqual(3);
					let stockEngine = engines.find(engine => engine.name === "stock");
					expect(stockEngine).not.toBeUndefined();
				});
		});

		test("Markets. Should contains shares market for stock engine", () => {
			return moexApi.markets("stock").then((markets) => {
				expect(markets.length).toBeGreaterThanOrEqual(5);
				let sharesMarket = markets.find(market => market.NAME === "shares");
				expect(sharesMarket).not.toBeUndefined();
			});
		});

		test("Boards. Should return ETC board for currency/selt", () => {
			return moexApi.boards("currency", "selt").then((boards) => {
				let board = boards.find(board => board.boardid === "CETS");
				expect(board).not.toBeUndefined();
			});
		});
	});

	describe("Securities.", () => {

		test("Should contains at least 50 securities", () => {
			return moexApi.securitiesDefinitions().then((securities) => {
				expect(securities.length).toBeGreaterThanOrEqual(50);
			});
		});

		test("Pagination should works for securities method", function () {
			return moexApi.securitiesDefinitions().then((firstPageSecurities) => {
				return moexApi.securitiesDefinitions({start: 100}).then((securities) => {
					expect(securities.length).toBeGreaterThanOrEqual(50);
					expect(securities[0].id).not.toEqual(firstPageSecurities[0].id);
				});
			});
		});


		test("Should give specific security -  USD000UTSTOM ", () => {
			return moexApi.securityDefinition("USD000UTSTOM").then((security) => {
				expect(security).not.toBeUndefined();
				expect(security.description).not.toBeUndefined();
				expect(security.boards).not.toBeUndefined();
				expect(security.boards.CETS).not.toBeUndefined();
			});
		});
	});

	describe("MarketData.", () => {

		test("Should have securities data for currency/selt", () => {
			return moexApi.securitiesDataRaw("currency", "selt").then((response) => {
				expect(response).not.toBeUndefined();

				expect(response.securities).not.toBeUndefined();
				expect(response.securities.data).not.toBeUndefined();
				expect(response.securities.data.length).toBeGreaterThanOrEqual(50);

				expect(response.marketdata).not.toBeUndefined();
				expect(response.marketdata.data).not.toBeUndefined();
				expect(response.marketdata.data.length).toBeGreaterThanOrEqual(50);
			});
		});

		test("Should return only 10 rows", () => {
			return moexApi.securitiesDataRaw("currency", "selt", {first: 10}).then((response) => {
				expect(response.marketdata.data.length).toEqual(10);
			});
		});

		test("Marketdata should return only 4 rows with max VALTODAY", () => {
			return moexApi.securitiesMarketData("currency", "selt", {first: 4}).then((marketData) => {
				expect(Object.values(marketData).length).toEqual(4);
			});
		});

		test("Marketdata should return max VALTODAY", () => {
			return moexApi.securitiesMarketData("stock", "index").then((marketData) => {
				expect(Object.values(marketData).length).toBeGreaterThanOrEqual(10);
			});
		});

		test("Should return one security in few boards", () => {
			return moexApi.securityDataRawExplicit("currency", "selt", "USD000UTSTOM");
		});

		test("Should return marketdata for one security", () => {
			return moexApi.securityMarketDataExplicit("currency", "selt", "USD000UTSTOM").then((security) => {
				expect(security).not.toBeUndefined();
				expect(security.LAST).not.toBeUndefined();
				expect(security.VALTODAY_RUR).not.toBeUndefined();
			});
		});

		test("Caching security info", () => {
			return moexApi.getSecurityInfo("USD000UTSTOM").then((security) => {
				expect(security).not.toBeUndefined();
				expect(security.engine).not.toBeUndefined();
				expect(security.market).not.toBeUndefined();
			});
		});
	});

	describe("MarketData specific securities.", () => {
		function securityPrint(security) {
			expect(security).not.toBeUndefined();
			// console.log(security.node);
			return;
		}

		function securityTest(securityName) {
			return moexApi.securityMarketData(securityName)
				.then((security) => {
					securityPrint(security);
					expect(security).not.toBeUndefined();
					expect(security.node).not.toBeUndefined();
					expect(security.node.last).not.toBeUndefined();
					expect(security.node.volume).not.toBeUndefined();
					expect(security.node.friendlyTitle).not.toBeUndefined();
				});
		}

		test("USD Today", () => securityTest("USD000UTSTOM"));
		test("MOEX Index", () => securityTest("IMOEX"));
		test("RTS Index", () => securityTest("RTSI"));
		test("Sberbank", () => securityTest("SBER"));

	});
});
