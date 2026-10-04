const mineflayer = require('mineflayer');

const serverHost = 'baystellardynasty.aternos.me';
const serverPort = 45295;

const botNames = ['AFK_Bot_1', 'AFK_Bot_2'];

function startBot(username) {
  console.log(`[${username}] 正在嘗試連線...`);

  const bot = mineflayer.createBot({
    host: serverHost,
    port: serverPort,
    username: username,
    auth: 'offline',
    version: false,
    physicsEnabled: false // 1. 先關閉物理模擬，防止因重力/懸空被判定為非法移動
  });

  // 成功進場
  bot.once('spawn', () => {
    console.log(`🟢 [${username}] 已成功進入伺服器！`);
    
    // 2. 延遲 1 秒待伺服器加載完地圖後，再開啟物理系統
    setTimeout(() => {
      bot.physicsEnabled = true;
    }, 1000);
  });

  bot.on('kicked', (reason) => {
    console.log(`⚠️ [${username}] 被伺服器踢出，原因:`, JSON.stringify(reason));
  });

  bot.on('error', (err) => {
    console.log(`❌ [${username}] 發生錯誤:`, err.message);
  });

  bot.once('end', (reason) => {
    console.log(`🔴 [${username}] 已斷線 (${reason})。等待 15 秒後重新連線...`);
    bot.removeAllListeners();
    setTimeout(() => {
      startBot(username);
    }, 15000);
  });
}

// 間隔 10 秒依序啟動
botNames.forEach((name, index) => {
  setTimeout(() => {
    startBot(name);
  }, index * 10000);
});
