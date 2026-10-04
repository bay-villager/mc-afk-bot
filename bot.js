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

      // 關鍵修復：收到伺服器的定位請求時立刻回應，避免 1 秒被踢
      bot._client.on('position', (packet) => {
        bot._client.write('teleport_confirm', { teleportId: packet.teleportId });
      });

      bot.once('spawn', () => {
        console.log(`🟢 [${username}] 已成功進入伺服器！`);
        // 關閉客戶端物理運算，完全交由伺服器決定位置
        bot.physicsEnabled = false;
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
