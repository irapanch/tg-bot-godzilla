require("dotenv").config();
const TelegramApi = require("node-telegram-bot-api");
const { gameOptions, againOptions } = require("./options");

const { TELEGRAM_BOT_TOKEN } = process.env;
const bot = new TelegramApi(TELEGRAM_BOT_TOKEN, { polling: true });
const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    // "Вгадай рік випуску першого фільму про Годзіллу!"
    "Я загадав число від  0 до 9. Спробуй вгадати його!"
  );
  const randomNumber = Math.floor(Math.random() * 10);
  // const randomeNumber = 6;
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, "Відгадуй!", gameOptions);
};
const start = () => {
  bot.setMyCommands([
    { command: "/start", description: "Greeting" },
    { command: "/info", description: "User`s info" },
    { command: "/game", description: "Гра вгадай число" },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    if (text === "/start") {
      await bot.sendSticker(
        chatId,
        "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExaXA2NTAzbWpraWZ6N2JyYjIyN3dpa2s1eWM3emppcjV2am50MHkyZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/4kdhrgN4bXwmu3fBDy/giphy.gif"
      );
      return bot.sendMessage(
        chatId,
        "Welcome to Godzilla-bot by author https://www.youtube.com/@VovanGodzilla "
      );
    }
    if (text === "/info") {
      return bot.sendMessage(chatId, `Your name is ${msg.from.first_name}`);
    }
    if (text === "/game") {
      return startGame(chatId);
    }
    return bot.sendMessage(
      chatId,
      `I don't understand you ${msg.from.first_name}...  Try again!`
    );
  });
  bot.on("callback_query", (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === "/again") {
      return startGame(chatId);
    }

    if (parseInt(data) === chats[chatId]) {
      return bot.sendMessage(
        chatId,
        `Вітаю! Ти вгадав число ${chats[chatId]}!`,
        againOptions
      );
    } else {
      return bot.sendMessage(
        chatId,
        `Нажаль, ти не вгадав, бот обрав число ${chats[chatId]}`,
        againOptions
      );
    }
    // bot.sendMessage(chatId, `Ти обрав число ${data}`);
  });
};
start();
