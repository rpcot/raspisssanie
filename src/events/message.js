const { developerId } = require("../config");
const { Days } = require("../models");
const { sendActionLog } = require("../utils/logging-functions");
const { getDayScheduleById, showManageDay } = require("../utils/schedule-functions");
const { getUserData, setWait } = require("../utils/users-functions");
const { errorAnswer } = require("../utils/utils");

module.exports = {
    name: 'msg',
    async execute(bot, ctx) {

        if (ctx.chat.type !== 'private') return;

        const { wait } = await getUserData(ctx.from.id);

        if (wait?.id) {
            if (wait.id === 'add_note') {

                try {
                    await ctx.api.deleteMessage(ctx.chat.id, ctx.msg.message_id);
                } catch (_) { }

                if (!ctx.msg.text)
                    return void await errorAnswer(ctx, `Сообщение должно содержать текст`, { deleteAfter: 5 });

                const data = await getDayScheduleById(wait.dataId);

                if (!data)
                    return void await setWait(ctx.from.id, {});

                data.note = ctx.msg.text.slice(-100);
                await data.save();

                await showManageDay(ctx, data.weekId, data.index, { editMessageId: wait.editMessageId });

                await setWait(ctx.from.id, {});

                await sendActionLog(ctx, 'Добавлено примечание', [
                    `Текст: ${data.note}`,
                    `Айди дня: ${data.id}`,
                    `Айди недели: ${data.weekId}`,
                ]);

            } else if (wait.id === 'add_exam') {

                try {
                    await ctx.api.deleteMessage(ctx.chat.id, ctx.msg.message_id);
                } catch (_) { }

                if (!ctx.msg.text)
                    return void await errorAnswer(ctx, `Сообщение должно содержать текст`, { deleteAfter: 5 });

                const data = await getDayScheduleById(wait.dataId);

                if (!data)
                    return void await setWait(ctx.from.id, {});

                data.lessons[wait.lessonIndex].exam = ctx.msg.text.slice(0, 100);
                await Days.update({ lessons: data.lessons }, { where: { id: data.id } });

                await showManageDay(ctx, data.weekId, data.index, { editMessageId: wait.editMessageId });

                await setWait(ctx.from.id, {});

                const lessonData = data.lessons[wait.lessonIndex];

                await sendActionLog(ctx, 'Добавлена проверочная работа', [
                    `Текст: ${ctx.msg.text.slice(0, 100)}`,
                    `Урок: ${lessonData.name}`,
                    `Индекс урока: ${wait.lessonIndex}`,
                    `Айди дня: ${data.id}`,
                    `Айди недели: ${data.weekId}`,
                ]);

            } else if (wait.id === 'add_homework') {

                try {
                    await ctx.api.deleteMessage(ctx.chat.id, ctx.msg.message_id);
                } catch (_) { }

                if (!ctx.msg.text)
                    return void await errorAnswer(ctx, `Сообщение должно содержать текст`, { deleteAfter: 5 });

                const data = await getDayScheduleById(wait.dataId);

                if (data.lessons[wait.lessonIndex].homework.length >= 3)
                    return void await errorAnswer(ctx, `Для данного урока достигнуто максимальное количество домашних заданий`, { deleteAfter: 5 });

                const homeworkText = ctx.msg.text.slice(0, 300);
                const targetLessonData = data.lessons[wait.lessonIndex];

                for (const lesson of data.lessons) {
                    if (lesson.name === targetLessonData.name && lesson.homework.length < 3) {
                        lesson.homework.push(homeworkText);
                    }
                }
                await Days.update({ lessons: data.lessons }, { where: { id: data.id } });

                await showManageDay(ctx, data.weekId, data.index, { editMessageId: wait.editMessageId });

                await setWait(ctx.from.id, {});

                const lessonData = data.lessons[wait.lessonIndex];

                await sendActionLog(ctx, 'Добавлено домашнее задание', [
                    `Текст: ${ctx.msg.text.slice(0, 110)}`,
                    `Урок: ${lessonData.name}`,
                    `Индекс урока: ${wait.lessonIndex}`,
                    `Айди дня: ${data.id}`,
                    `Айди недели: ${data.weekId}`,
                ]);

            } else if (wait.id === 'feedback') {
                try {
                    await ctx.api.editMessageReplyMarkup(ctx.chat.id, wait.deleteMessageId, [])
                        .catch((error) => { console.log(error) });
                        
                    await ctx.api.sendMessage(developerId, `<b>Новое сообщение с обратной связью:</b>\n${ctx.from.username || `${ctx.from.first_name} ${ctx.from.last_name}`} | <code>${ctx.from.id}</code>`, {
                        parse_mode: 'HTML',
                    });

                    await ctx.api.forwardMessage(developerId, ctx.chat.id, ctx.msg.message_id);

                    await ctx.reply(`💖 <b>Спасибо за обратную связь</b>, твоё сообщение <b>отправлено</b> разработчику.\nВ случае чего, разработчик свяжется с тобой <b>в ЛС</b>.`, {
                        parse_mode: 'HTML',
                        reply_parameters: {
                            message_id: ctx.msg.message_id,
                        },
                    });

                    await setWait(ctx.from.id, {});
                } catch (error) {
                    bot.logger.error(`Возникла ошибка при оптравке фидбека:\n${error.stack}`, { ctx });
                    await errorAnswer(ctx, `<b>Возникла непредвиденная ошибка</b>\nПожалуйста, попробуй ещё раз`, {
                        deleteAfter: 5,
                    });
                }
            }
        }

    }
};
