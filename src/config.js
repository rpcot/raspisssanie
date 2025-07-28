const { join, resolve } = require('node:path');

module.exports = {
    token: TOKEN,

    apiHost: API_HOST,
    apiPort: API_PORT,
    siteUrlQueryTemplate: 'https://schedule.rpcot.ru?week=',

    databaseSettings: {
        dialect: 'mysql',
        port: DB_PORT,
        host: DB_HOST,
        db: DB_NAME,
        user: DB_USER,
        password: DB_PASSWORD,
        modelsPath: join(__dirname, 'models'),
    },
    
    eventsPath: join(__dirname, 'events'),
    commandsPath: join(__dirname, 'commands'),
    inlinePath: join(__dirname, 'inline'),
    keyboardPath: join(__dirname, 'keyboard'),
    defaultLessonsSchedulePath: join(__dirname, 'data', 'default_lessons_schedule.json'),
    defaultBellsPath: join(__dirname, 'data', 'default_bells.json'),
    defaultPrefixesPath: join(__dirname, 'data', 'default_prefixes.json'),
    defaultLessonsPath: join(__dirname, 'data', 'default_lessons.json'),

    logsPath: join(resolve(__dirname, '..'), 'logs'),
    consoleLogging: false,
    logging: true,

    developerId: 1769795890,

    loggingChannelId: -4624414723,

    dayNames: [
        'Понедельник',
        'Вторник',
        'Среда',
        'Четверг',
        'Пятница',
        'Суббота',
    ],
}