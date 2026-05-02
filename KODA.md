# KODA.md — Контекст проекта Moex API

## Обзор проекта

**Назначение:** Node.js-библиотека для работы с API Московской Биржи (MOEX ISS API). Предоставляет удобные методы для получения котировок, информации о ценных бумагах, индексах и других данных фондовой биржи.

**Основные технологии:**
- JavaScript (ES6+)
- Node.js
- Библиотеки: `node-fetch`, `lodash`, `debug`
- Тестирование: Jest

**Архитектура:**
- Основной класс `MoexAPI` в файле `api.js`
- Обертка над методами `lodash` в `lib/lodash.js`
- REST API запросы к `https://iss.moex.com/iss`
- Использование промисов для асинхронных операций
- Кэширование информации о ценных бумагах в памяти

## Сборка и запуск

### Установка зависимостей
```bash
npm install
```

### Запуск линтинга
```bash
npm run lint
```

### Запуск тестов
```bash
npm test
```

### Сборка покрытия кода
```bash
npm run coverage
```

### Использование в проекте
```bash
npm install moex-api
```

```javascript
const MoexAPI = require("moex-api");
const moexApi = new MoexAPI();

// Пример получения данных по USD/RUB
moexApi.securityMarketData("USD000UTSTOM").then((security) => {
    console.log(security.node.last);
});
```

## Доступные методы API

### Основные методы
- `engines()` — получение списка двигателей (stock, currency, forts и др.)
- `markets(engine)` — получение списка рынков для двигателя
- `boards(engine, market)` — получение списка торговых досок
- `securitiesDefinitions(query)` — поиск определений ценных бумаг
- `securityDefinition(security)` — получение информации о конкретной ценной бумаге
- `securityMarketData(security, currency)` — получение рыночных данных по бумаге
- `securityMarketDataExplicit(engine, market, security, currency)` — явное получение данных
- `securitiesDataRaw(engine, market, query)` — сырые данные по ценным бумагам
- `securitiesMarketData(engine, market, query)` — группированные рыночные данные

### Внутренние методы
- `_request(method, query)` — выполнение HTTP-запроса к MOEX API
- `_responseToBlocks(response)` — преобразование ответа в блоки данных
- `_responseBlockToArray(block)` — конвертация блока в массив объектов
- `_securityCustomFields(security, requestParams)` — добавление пользовательских полей

## Правила разработки

### Стиль кодирования
- **Индентация:** табы (вместо пробелов)
- **Кавычки:** двойные (`"`)
- **Семиклоны:** обязательны в конце инструкций
- **Версия ECMAScript:** ES6+ (2018)
- **Модули:** CommonJS (`require`/`module.exports`)

### Структура проекта
```
moex-api/
├── api.js              # Основной класс MoexAPI
├── lib/
│   └── lodash.js       # Обертка над lodash
├── test/
│   ├── test-api.js     # Тесты API
│   └── test-lodash.js  # Тесты утилит
├── .eslintrc.js        # Конфигурация ESLint
├── jest.config.js      # Конфигурация Jest
├── package.json        # Зависимости и скрипты
└── README.md           # Документация
```

### Тестирование
- Фреймворк: Jest
- Расположение тестов: `test/` директория
- Покрытие кода: `npm run coverage`
- Отчеты о покрытии: формат `lcov`

### Контрибуция
1. Убедитесь, что все тесты проходят (`npm test`)
2. Пройдите линтинг (`npm run lint`)
3. Добавьте тесты для нового функционала
4. Обновите документацию при необходимости

## Зависимости

### Production
- `node-fetch@^2.6.7` — HTTP-клиент для запросов к API
- `lodash@^4.17.21` — утилитарные функции
- `debug@^4.3.4` — отладочный логгинг

### Development
- `jest@^28.1.3` — фреймворк для тестирования

## Особенности реализации

### Кэширование
Информация о ценных бумагах кэшируется в глобальном объекте `SECURITY_INFO` для избежания повторных запросов к API.

### Обработка ошибок
- HTTP-ошибки возвращаются через reject промиса
- Отладочная информация логируется через `debug`
- Требуется указание обязательных параметров

### Фильтрация данных
- Поддержка фильтрации по валюте (`currency` параметр)
- Сортировка по объему торгов (`VALTODAY`)
- Пагинация через параметр `start`

### Торговые доски
При получении данных по ценной бумаге автоматически выбирается торговая доска с максимальным объемом торгов.
