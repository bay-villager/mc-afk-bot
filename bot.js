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

      let antiKickTimer = null;

      bot.once('spawn', () => {
        console.log(`🟢 [${botUsername}] 已成功進入伺服器！`);
        
        // 確保物理模擬開啟，讓客戶端正常計算地心引力與位置封包
        bot.physicsEnabled = true;

        // 每 3 秒微幅轉動角度 + 輕微擺頭，告訴 Purpur 這是一個活躍的真客戶端
        antiKickTimer = setInterval(() => {
          if (bot && bot.entity) {
            bot.look(bot.entity.yaw + 0.1, bot.entity.pitch, true);
          }
        }, 3000);
      });

      bot.on('kicked', (reason) => {
        console.log(`⚠️ [${botUsername}] 被伺服器踢出:`, JSON.stringify(reason));
      });

      bot.on('error', (err) => {
        console.log(`❌ [${botUsername}] 錯誤:`, err.message);
      });

      bot.once('end', (reason) => {
        if (antiKickTimer) clearInterval(antiKickTimer);
        console.log(`🔴 [${botUsername}] 斷線 (${reason})，15 秒後重連...`);
        bot.removeAllListeners();
        setTimeout(start, 15000);
      });
    }

    start();
  }, delay);
}

// 啟動兩隻機器人（錯開 10 秒進場避免 Aternos 防刷連線）
createAFKBot('AFK_Bot_1', 0);
createAFKBot('AFK_Bot_2', 10000);
