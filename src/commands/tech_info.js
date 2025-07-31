const { errorAnswer } = require("../utils/utils");

module.exports = {
    name: 'tech_info',
    description: 'Техническая информация о боте',
    async execute(bot, ctx) {
        const text = `
        <b>🤖 Бот</b>
        • Разработчик: <a href="https://t.me/rpcotik">@rpcotik</a>
        • Версия бота: <code>v1.1.1</code>
        • Последнее обновление: <code>01.09.2025</code>

        <b>🌐 Сайт и API</b>
        • Сайт: <a href="https://schedule.rpcot.ru">schedule.rpcot.ru</a>
        • Версия сайта: <code>1.1.0</code>
        • Версия API: <code>1.1.0</code>
        • Последнее обновление: <code>01.09.2025</code>

        <b>🛠 Стек технологий</b>
        • Язык программирования: <code>JavaScript</code> (+ CSS, HTML)
        • Версия Node.js: <code>${process.version}</code>
        • База данных: <code>MySQL</code>

        <b>📂 Репозиторий</b>
        • https://github.com/rpcot/raspisssanie
        `.replace(/  +/g, '');

        await ctx.reply(text, {
            parse_mode: 'HTML',
            disable_web_page_preview: true,
        });
    }
};
