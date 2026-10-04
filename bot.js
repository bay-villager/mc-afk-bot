const mineflayer = require('mineflayer');

const serverHost = 'baystellardynasty.aternos.me';
const serverPort = 45295;

// 設定兩隻機器人的名字
const botNames = ['AFK_Bot_1', 'AFK_Bot_2'];

function startBot(botUsername) {
  console.log(`[${botUsername}] 正在嘗試連線伺服器...`);

  const bot = mineflayer.createBot({
    host: serverHost,
    port: serverPort,
    username: botUsername,
    auth: 'offline',
    version: false
  });

  // 成功進場
  bot.once('spawn', () => {
    console.log(`🟢 [${botUsername}] 已成功進入伺服器！`);
    
    // 進場後暫停 1 秒物理模擬，避免地圖未加載完畢落地被踢
    bot.physicsEnabled = false;
    setTimeout(() => {
      bot.physicsEnabled = true;
    }, 1000);
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
    console.log(`🔴 [${botUsername}] 已斷線 (${reason})。等待 15 秒後重新連線...`);
    bot.removeAllListeners();
    setTimeout(() => {
      startBot(botUsername);
    }, 15000);
  });
}

// 依序啟動機器人（間隔 10 秒，避免同時進入被伺服器防刷機制擋掉）
botNames.forEach((username, index) => {
  setTimeout(() => {
    startBot(username);
  }, index * 10000);
});
