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

      let heartbeatTimer = null;

      // 1. 攔截伺服器傳送封包並立即回應 Confirm，防止 1 秒踢出
      bot._client.on('position', (packet) => {
        if (packet && packet.teleportId !== undefined) {
          bot._client.write('teleport_confirm', { teleportId: packet.teleportId });
        }
      });

      bot.once('spawn', () => {
        console.log(`🟢 [${botUsername}] 已成功進入伺服器！`);

        // 2. 開啟物理引擎，讓 Bot 正常計算重力與踩踏
        bot.physicsEnabled = true;

        // 3. 每 1 秒微調 0.001 視角並補發 client_tick_end，突破 9 秒位移檢測
        heartbeatTimer = setInterval(() => {
          if (bot && bot.entity) {
            bot.look(bot.entity.yaw + 0.001, bot.entity.pitch, true);
            if (bot._client && bot._client.write) {
              try {
                bot._client.write('client_tick_end', {});
              } catch (e) {
                // 忽略發送例外
              }
            }
          }
        }, 1000);
      });

      bot.on('kicked', (reason) => {
        console.log(`⚠️ [${botUsername}] 被伺服器踢出:`, JSON.stringify(reason));
      });

      bot.on('error', (err) => {
        console.log(`❌ [${botUsername}] 錯誤:`, err.message);
      });

      bot.once('end', (reason) => {
        if (heartbeatTimer) clearInterval(heartbeatTimer);
        console.log(`🔴 [${botUsername}] 斷線 (${reason})，15 秒後重連...`);
        bot.removeAllListeners();
        setTimeout(start, 15000);
      });
    }

    start();
  }, delay);
}

// 啟動兩隻機器人（間隔 10 秒錯開進入，避免 Aternos 流量限制）
createAFKBot('AFK_Bot_1', 0);
createAFKBot('AFK_Bot_2', 10000);
