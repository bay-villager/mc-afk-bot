const mineflayer = require('mineflayer');

const serverHost = 'baystellardynasty.aternos.me';
const serverPort = 45295;

// 要啟動的機器人名稱
const botNames = ['AFK_Bot_1', 'AFK_Bot_2'];

function startBot(username) {
  console.log(`[${username}] 正在嘗試連線...`);

  const bot = mineflayer.createBot({
    host: serverHost,
    port: serverPort,
    username: username,
    auth: 'offline', // 強制使用離線模式認證
    version: false,  // 自動匹配伺服器版本
  });

  // 成功進場
  bot.once('spawn', () => {
    console.log(`🟢 [${username}] 已成功進入伺服器！`);
  });

  // 顯示被踢出的原因
  bot.on('kicked', (reason) => {
    console.log(`⚠️ [${username}] 被伺服器踢出，原因:`, reason);
  });

  // 發生錯誤
  bot.on('error', (err) => {
    console.log(`❌ [${username}] 發生錯誤:`, err.message);
  });

  // 斷線處理（加上防止重複重連的機制）
  bot.once('end', (reason) => {
    console.log(`🔴 [${username}] 已斷線 (${reason})。等待 15 秒後重新連線...`);
    // 清除舊的事件監聽，避免記憶體洩漏與重複重連
    bot.removeAllListeners();
    
    // 延遲 15 秒再重新連線，避開 Aternos 的防刷限制
    setTimeout(() => {
      startBot(username);
    }, 15000);
  });
}

// 依次啟動機器人，中間間隔 10 秒（避免觸發 Aternos 防刷保護）
botNames.forEach((name, index) => {
  setTimeout(() => {
    startBot(name);
  }, index * 10000);
});
