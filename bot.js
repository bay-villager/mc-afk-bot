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
        version: '1.21' // 強制指定 1.21 版本 protocol
      });

      bot.once('spawn', () => {
        console.log(`🟢 [${username}] 已成功進入伺服器！`);
      });

      // 關鍵修復：針對 Purpur 1.21 強制每 tick (50ms) 發送一次 client_tick_end 封包
      bot.on('physicsTick', () => {
        if (bot._client && bot._client.write) {
          try {
            bot._client.write('client_tick_end', {});
          } catch (e) {
            // 忽略封包發送失敗
          }
        }
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

// 啟動兩隻機器人
createBot('AFK_Bot_1', 0);
createBot('AFK_Bot_2', 10000);
