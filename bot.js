const mineflayer = require('mineflayer');

// 定義伺服器資訊
const serverHost = 'baystellardynasty.aternos.me';
const serverPort = 45295;

// 要啟動的機器人名稱清單
const botNames = ['AFK_Bot_1', 'AFK_Bot_2'];

function createBot(username) {
  const bot = mineflayer.createBot({
    host: serverHost,
    port: serverPort,
    username: username,
    version: false // 自動偵測版本
  });

  bot.on('spawn', () => {
    console.log(`[${username}] 已成功進場！`);
  });

  bot.on('chat', (username_sender, message) => {
    if (username_sender === bot.username) return;
    console.log(`[${username_sender}]: ${message}`);
  });

  bot.on('error', (err) => {
    console.log(`[${username}] 發生錯誤:`, err.message);
  });

  bot.on('end', (reason) => {
    console.log(`[${username}] 斷線 (${reason})，10 秒後重新連線...`);
    setTimeout(() => createBot(username), 10000);
  });
}

// 依次啟動每一個機器人（間隔 5 秒，避免同時進入被 Aternos 擋掉）
botNames.forEach((name, index) => {
  setTimeout(() => {
    console.log(`正在啟動 ${name}...`);
    createBot(name);
  }, index * 5000); 
});
