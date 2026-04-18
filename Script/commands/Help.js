const fs = require("fs-extra");
const request = require("request");
const path = require("path");

module.exports.config = {
    name: "help",
    version: "2.0.1",
    hasPermssion: 0,
    credits: "RAZIM",
    description: "Shows all commands with details",
    commandCategory: "system",
    usages: "[command name/page number]",
    cooldowns: 5,
    envConfig: {
        autoUnsend: true,
        delayUnsend: 20
    }
};

module.exports.languages = {
    "en": {
        "moduleInfo": `╭━━━━━━━━━━━━━━━━╮
┃ ✨ 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐈𝐍𝐅𝐎 ✨
┣━━━━━━━━━━━┫
┃ 🔖 Name: %1
┃ 📄 Usage: %2
┃ 📜 Description: %3
┃ 🔑 Permission: %4
┃ 👨‍💻 Credit: %5
┃ 📂 Category: %6
┃ ⏳ Cooldown: %7s
┣━━━━━━━━━━━━━━━━┫
┃ ⚙ Prefix: %8
┃ 🤖 Bot Name: %9
┃ 👑 Owner: 𝐌𝐀𝐑𝐔𝐅 𝐇𝐀𝐒𝐀𝐍 𝐑𝐀𝐙𝐈𝐌
╰━━━━━━━━━━━━━━━━╯`,
        "helpList": "[ There are %1 commands. Use: \"%2help commandName\" to view more. ]",
        "user": "User",
        "adminGroup": "Admin Group",
        "adminBot": "Admin Bot"
    }
};

const helpImage = "https://i.ibb.co/BH3V8VXq/1776127786190.png";

function downloadImage(callback) {
    const filePath = path.join(__dirname, "cache", "help.jpg");

    request(helpImage)
        .pipe(fs.createWriteStream(filePath))
        .on("close", () => callback([filePath]))
        .on("error", () => callback([]));
}

module.exports.handleEvent = function ({ api, event, getText }) {
    const { commands } = global.client;
    const { threadID, messageID, body } = event;

    if (!body || body.indexOf("help") != 0) return;

    const splitBody = body.trim().split(/\s+/);
    if (splitBody.length < 2 || !commands.has(splitBody[1].toLowerCase())) return;

    const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
    const command = commands.get(splitBody[1].toLowerCase());
    const prefix = threadSetting.PREFIX || global.config.PREFIX;

    const detail = getText("moduleInfo",
        command.config.name,
        command.config.usages || "Not Provided",
        command.config.description || "Not Provided",
        command.config.hasPermssion,
        command.config.credits || "Unknown",
        command.config.commandCategory || "Unknown",
        command.config.cooldowns || 0,
        prefix,
        global.config.BOTNAME || "RAZIM CHAT BOT"
    );

    downloadImage(files => {
        const attachments = files.map(f => fs.createReadStream(f));
        api.sendMessage({ body: detail, attachment: attachments }, threadID, () => {
            files.forEach(f => fs.unlinkSync(f));
        }, messageID);
    });
};

module.exports.run = function ({ api, event, args, getText }) {

    const { commands } = global.client;
    const { threadID, messageID } = event;

    const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
    const prefix = threadSetting.PREFIX || global.config.PREFIX;

    if (args[0] && commands.has(args[0].toLowerCase())) {

        const command = commands.get(args[0].toLowerCase());

        const detailText = getText("moduleInfo",
            command.config.name,
            command.config.usages || "Not Provided",
            command.config.description || "Not Provided",
            command.config.hasPermssion,
            command.config.credits || "Unknown",
            command.config.commandCategory || "Unknown",
            command.config.cooldowns || 0,
            prefix,
            global.config.BOTNAME || "RAZIM CHAT BOT"
        );

        downloadImage(files => {
            const attachments = files.map(f => fs.createReadStream(f));
            api.sendMessage({ body: detailText, attachment: attachments }, threadID, () => {
                files.forEach(f => fs.unlinkSync(f));
            }, messageID);
        });

        return;
    }

    const arrayInfo = Array.from(commands.keys())
        .filter(cmd => cmd && cmd.trim() !== "")
        .sort();

    const page = Math.max(parseInt(args[0]) || 1, 1);
    const limit = 20;
    const totalPages = Math.ceil(arrayInfo.length / limit);
    const start = limit * (page - 1);

    const list = arrayInfo.slice(start, start + limit)
        .map(cmd => `┃ ✪ ${cmd}`)
        .join("\n");

    const text = `╭━━━━━━━━━━━━━━━━╮
┃ 📜 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐋𝐈𝐒𝐓 📜
┣━━━━━━━━━━━━━━━┫
┃ 📄 Page: ${page}/${totalPages}
┃ 🧮 Total: ${arrayInfo.length}
┣━━━━━━━━━━━━━━━━┫
${list}
┣━━━━━━━━━━━━━━━━┫
┃ ⚙ Prefix: ${prefix}
┃ 🤖 Bot Name: ${global.config.BOTNAME || "RAZIM CHAT BOT"}
┃ 👑 Owner: 𝐌𝐀𝐑𝐔𝐅 𝐇𝐀𝐒𝐀𝐍 𝐑𝐀𝐙𝐈𝐌
╰━━━━━━━━━━━━━━━━╯`;

    downloadImage(files => {
        const attachments = files.map(f => fs.createReadStream(f));
        api.sendMessage({ body: text, attachment: attachments }, threadID, () => {
            files.forEach(f => fs.unlinkSync(f));
        }, messageID);
    });
};
