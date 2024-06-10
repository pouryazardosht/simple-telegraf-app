const { default: axios } = require("axios");
const { Telegraf } = require("telegraf");
require("dotenv").config();
const bot = new Telegraf(process.env.BOT_TOKEN);

const cryptoToken = process.env.CRYPTO_TOKEN;

bot.command("crypto", (ctx) => {
  ctx.sendChatAction("typing");
  bot.telegram.sendMessage(ctx.chat.id, "منوی اصلی", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "قیمت رمز ارزها", callback_data: "pricing" }],
        [
          {
            text: "CoinList(cryptocompare)",
            url: "https://www.cryptocompare.com/",
          },
        ],
      ],
    },
  });
});

bot.action("pricing", (ctx) => {
  ctx.answerCbQuery();
  ctx.deleteMessage();
  bot.telegram.sendMessage(
    ctx.chat.id,
    "لطفا یکی از ارز های دیجیتال زیر را انتخاب کنید",
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "BTC", callback_data: "BTC" },
            { text: "ETH", callback_data: "ETH" },
          ],
          [
            { text: "USDT", callback_data: "USDT" },
            { text: "BUSD", callback_data: "BUSD" },
          ],
          [{ text: "منو اصلی", callback_data: "mainmenu" }],
        ],
      },
    }
  );
});

bot.action(["BTC", "ETH", "USDT", "BUSD"], async (ctx) => {
  try {
    const apiURL = `https://min-api.cryptocompare.com/data/price?fsym=${ctx.match}&tsyms=USD&api_key=${cryptoToken}`;
    const data = await axios.get(apiURL).then((res) => res.data);
    console.log(data);
    ctx.reply(
      `${ctx.match} : ${Object.values(data)[0].toLocaleString()}$`
    );
  } catch (error) {
    ctx.reply(error.message);
  }
  ctx.answerCbQuery();
});

bot.action("mainmenu", (ctx) => {
  ctx.answerCbQuery();
  ctx.deleteMessage();
  bot.telegram.sendMessage(ctx.chat.id, "منوی اصلی", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "قیمت رمز ارزها", callback_data: "pricing" }],
        [
          {
            text: "CoinList(cryptocompare)",
            url: "https://www.cryptocompare.com/",
          },
        ],
      ],
    },
  });
});

bot.launch();
