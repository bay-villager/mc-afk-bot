const mineflayer = require('mineflayer');

const serverHost = 'baystellardynasty.aternos.me';
const serverPort = 45295;

function createAFKBot(botUsername, delay) {
  setTimeout(() => {
    function start() {
      console.log(`[${botUsername}] 正在嘗試連線伺服器...`);
      
      const bot = mineflayer.createBot({
        host: serverHost,
        port: serverPort,
        username: botUsername,
        auth: 'offline',
        version: false
      });

      let timer = null;

      bot.once('spawn', () => {
        console.log(`🟢 [${botUsername}] 已成功進入伺服器！`);
        // 暫停重力避免落下觸發檢測
        bot.physicsEnabled = false;

        // 每 100ms 微幅旋轉視角，發送 active client tick 封包
        timer = setInterval(() => {
          if (bot && bot.entity) {
            bot.look(bot.entity.yaw + 0.001, bot.entity.pitch, true);
          }
        }, 100);
      });

      bot.on('kicked', (reason) => {
        console.log(`⚠️ [${botUsername}] 被伺服器踢出:`, JSON.stringify(reason));
      });

      bot.on('error', (err) => {
        console.log(`❌ [${botUsername}] 錯誤:`, err.message);
      });

      bot.once('end', (reason) => {
        if (timer) clearInterval(timer);
        console.log(`🔴 [${botUsername}] 斷線 (${reason})，15 秒後重連...`);
        bot.removeAllListeners();
        setTimeout(start, 15000);
      });
    }

    start();
  }, delay);
}

// 啟動兩隻機器人（間隔 10 秒錯開進入）
createAFKBot('AFK_Bot_1', 0);
createAFKBot('AFK_Bot_2', 10000);
