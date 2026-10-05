const mineflayer = require('mineflayer');

const serverHost = 'baystellardynasty.aternos.me';
const serverPort = 45295;

function createBot(username, delay) {
  setTimeout(() => {
    function start() {
      console.log(`[${username}] 正在嘗試連線伺服器...`);

      const bot = mineflayer.createBot({
        host: serverHost,
        port: serverPort,
        username: username,
        auth: 'offline',
        version: false
      });

      bot.once('spawn', () => {
        console.log(`🟢 [${username}] 已成功進入伺服器！`);
      });

      bot.on('kicked', (reason) => {
        console.log(`⚠️ [${username}] 被伺服器踢出:`, JSON.stringify(reason));
      });

      bot.on('error', (err) => {
        console.log(`❌ [${username}] 錯誤:`, err.message);
      });

      bot.once('end', (reason) => {
        console.log(`🔴 [${username}] 斷線 (${reason})，15 秒後重連...`);
        bot.removeAllListeners();
        setTimeout(start, 15000);
      });
    }

    start();
  }, delay);
}

// 啟動兩隻機器人（間隔 10 秒）
createBot('AFK_Bot_1', 0);
createBot('AFK_Bot_2', 10000);
