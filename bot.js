const mineflayer = require('mineflayer');

const serverHost = 'baystellardynasty.aternos.me';
const serverPort = 45295;

// 第隻機器人
function startBot1() {
  console.log('[AFK_Bot_1] 正在嘗試連線伺服器...');
  const bot1 = mineflayer.createBot({
    host: serverHost,
    port: serverPort,
    username: 'AFK_Bot_1',
    auth: 'offline',
    version: false
  });

  bot1.once('spawn', () => {
    console.log('🟢 [AFK_Bot_1] 已成功進入伺服器！');
  });

  bot1.on('kicked', (reason) => {
    console.log('⚠️ [AFK_Bot_1] 被伺服器踢出:', JSON.stringify(reason));
  });

  bot1.on('error', (err) => {
    console.log('❌ [AFK_Bot_1] 錯誤:', err.message);
  });

  bot1.once('end', (reason) => {
    console.log(`🔴 [AFK_Bot_1] 斷線 (${reason})，15 秒後重連...`);
    bot1.removeAllListeners();
    setTimeout(startBot1, 15000);
  });
}

// 第二隻機器人
function startBot2() {
  console.log('[AFK_Bot_2] 正在嘗試連線伺服器...');
  const bot2 = mineflayer.createBot({
    host: serverHost,
    port: serverPort,
    username: 'AFK_Bot_2',
    auth: 'offline',
    version: false
  });

  bot2.once('spawn', () => {
    console.log('🟢 [AFK_Bot_2] 已成功進入伺服器！');
  });

  bot2.on('kicked', (reason) => {
    console.log('⚠️ [AFK_Bot_2] 被伺服器踢出:', JSON.stringify(reason));
  });

  bot2.on('error', (err) => {
    console.log('❌ [AFK_Bot_2] 錯誤:', err.message);
  });

  bot2.once('end', (reason) => {
    console.log(`🔴 [AFK_Bot_2] 斷線 (${reason})，15 秒後重連...`);
    bot2.removeAllListeners();
    setTimeout(startBot2, 15000);
  });
}

// 啟動第一隻
startBot1();

// 10 秒後啟動第二隻（錯開進場）
setTimeout(() => {
  startBot2();
}, 10000);
