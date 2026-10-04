const mineflayer = require('mineflayer');

const serverHost = 'baystellardynasty.aternos.me';
const serverPort = 45295;

const botNames = ['AFK_Bot_1', 'AFK_Bot_2'];

function startBot(botUsername) {
  console.log(`[${botUsername}] 正在嘗試連線伺服器...`);

  const bot = mineflayer.createBot({
    host: serverHost,
    port: serverPort,
    username: botUsername,
    auth: 'offline',
    version: false,
    checkTimeoutInterval: 60 * 1000
  });

  let antiKickInterval = null;

  // 成功進場
  bot.once('spawn', () => {
    console.log(`🟢 [${botUsername}] 已成功進入伺服器！`);
    
    // 先關閉重力，防止因碰撞箱懸空被踢
    bot.physicsEnabled = false;

    // 每 100 毫秒（0.1秒）讓機器人發送一次微小的視角調整，向 Purpur 回報活躍的 Client Tick
    antiKickInterval = setInterval(() => {
      if (bot && bot.entity) {
        // 微幅晃動視角 (0.001 弧度)，伺服器會收到封包但視覺上幾乎看不出來
        const yaw = bot.entity.yaw + 0.001;
        const pitch = bot.entity.pitch;
        bot.look(yaw, pitch, true);
      }
    }, 100);
  });

  // 被伺服器踢出
  bot.on('kicked', (reason) => {
    console.log(`⚠️ [${botUsername}] 被伺服器踢出，原因:`, JSON.stringify(reason));
  });

  // 發生錯誤
  bot.on('error', (err) => {
    console.log(`❌ [${botUsername}] 發生錯誤:`, err.message);
  });

  // 斷線自動重連
  bot.once('end', (reason) => {
    if (antiKickInterval) clearInterval(antiKickInterval);
    console.log(`🔴 [${botUsername}] 已斷線 (${reason})。等待 15 秒後重新連線...`);
    bot.removeAllListeners();
    setTimeout(() => {
      startBot(botUsername);
    }, 15000);
  });
}

// 依序啟動機器人（間隔 10 秒，避免觸發 Aternos 同時登入限制）
botNames.forEach((username, index) => {
  setTimeout(() => {
    startBot(username);
  }, index * 10000);
});
