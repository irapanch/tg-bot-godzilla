require("dotenv").config();
const TelegramApi = require("node-telegram-bot-api");
const { gameOptions, againOptions } = require("./options");
const axios = require("axios");

const { TELEGRAM_BOT_TOKEN } = process.env;
const bot = new TelegramApi(TELEGRAM_BOT_TOKEN, { polling: true });
const chats = {};
// const enterCity = async (chatId) => {
//   await bot.sendMessage(
//     chatId,

//     "Enter your city"
//   );
// };
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
    { command: "/weather", description: "The weather in your place" },
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
    if (text === "/weather") {
      bot.on("message", async (msg) => {
        const chatId = msg.chat.id;
        const userInput = msg.text;

        try {
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&appid=ea05f0b6617d998492f421c4335d3bba`
          );
          const data = response.data;
          const weather = data.weather[0].description;
          const temperature = data.main.temp - 273.15;
          const city = data.name;
          const humidity = data.main.humidity;
          const pressure = data.main.pressure;
          const windSpeed = data.wind.speed;
          const message = `The weather in ${city} is ${weather} with a temperature of ${temperature.toFixed(
            2
          )}°C. The humidity is ${humidity}%, the pressure is ${pressure}hPa, and the wind speed is ${windSpeed}m/s.`;

          bot.sendMessage(chatId, message);
        } catch (error) {
          bot.sendMessage(chatId, "City doesn't exist.");
        }
      });
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
