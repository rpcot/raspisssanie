const { Keyboard } = require("grammy");
const { errorAnswer } = require("../utils/utils");
const { sendActionLog } = require("../utils/logging-functions");
const { checkAdminPerms } = require("../utils/users-functions");
const { developerId } = require("../config");

module.exports = {
    name: 'start',
    description: 'Запустить бота',
    hide: false,
    async execute(bot, ctx) {

        if (ctx.chat.type !== 'private')
            return await errorAnswer(ctx, 'Данная команда доступна <b>только</b> в личных сообщениях с ботом', {
                deleteAfter: 5,
            });

        let text = `<b>❤️‍🔥 Приветствую</b>
        ❓ Я бот, который <b>поможет тебе</b> с поиском актуального <b>расписания</b> и <b>домашнего задания</b>.
        
        📅 Расписание можно посмотреть на <b><a href="https://schedule.rpcot.ru">сайте</a></b> (<b>/site</b>) или с помощью <b>команд</b>, список которых можно посмотреть, прописав <b>/help</b>.

        ✏️ Расписание в данном боте заполняется <b>учениками</b>, поэтому тут мы можем указать <b>абсолютно все детали</b>, начиная от <b>домашнего задания</b>, <b>проверочных работ</b> и <b>отмененных</b> или <b>перенесенных</b> уроков и заканчивая какими-либо <b>внеурочными мероприятиями</b>.
        ☝️ Если <b>ты</b> хочешь <b>помочь</b> в заполнении расписания, то <b>жми</b> кнопку <b>🚀 Стать админом</b> или пиши <b>/go_admin</b>.

        💡 Заметил <b>ошибку</b> или хочешь предложить <b>что-то новое</b>?
        Ты всегда можешь связаться с <b>разработчиком бота</b> в <b><a href="tg://user?id=${developerId}">личке</a></b> или командой <b>/feedback</b>.

        <b>В создании бота принимали участие:</b>
        @rpcotik • @linkas_sx
        
        <i>Техническую информацию о боте можно посмотреть командой <b>/tech_info</b></i>

        <b>💖</b>
        `.replace(/  +/g, '');

        const keyboard = new Keyboard()
            .text('📅 Расписание на сегодня')
            .text('📅 Расписание на завтра')
            .row()
            .text('🌐 Сайт бота')
            .row()
            .text('🚀 Стать админом')
            .text('💖 Обратная связь')
            .row()
            .resized();

        const isAdmin = await checkAdminPerms(ctx.from.id);
        if (isAdmin) {
            keyboard.text('🔧 Управление расписанием');
        }

        await ctx.reply(text, {
            parse_mode: 'HTML',
            reply_markup: keyboard,
        });

        await sendActionLog(ctx, `Бот запущен`);

    }
};
