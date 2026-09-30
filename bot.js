const mineflayer = require('mineflayer');

function createBot(botName, delay) {
  setTimeout(() => {
    function start() {
      const bot = mineflayer.createBot({
        host: process.env.SERVER_IP,
        port: parseInt(process.env.SERVER_PORT || '25565'),
        username: botName,
        version: '1.20.1',
        checkTimeoutInterval: 60 * 1000,
        physicsEnabled: false
      });

      bot.on('spawn', () => {
        console.log(`[${botName}] 已成功進服！`);

        // 每 30 秒隨機改變視線角度 (Yaw/Pitch)，完美避開 Aternos 的 AFK 檢測
        setInterval(() => {
          if (bot.entity) {
            const yaw = (Math.random() * 3.14) - 1.57;
            const pitch = (Math.random() * 0.4) - 0.2;
            bot.look(yaw, pitch, true);
          }
        }, 30000);

        // 每 45 秒切換一次蹲下狀態，模擬真人操作
        setInterval(() => {
          bot.setControlState('sneak', true);
          setTimeout(() => bot.setControlState('sneak', false), 800);
        }, 45000);
      });

      bot.on('end', (reason) => {
        console.log(`[${botName}] 連線中斷:`, reason, '5秒後重連...');
        setTimeout(start, 5000);
      });

      bot.on('error', err => console.log(`[${botName}] 錯誤:`, err));
    }
    start();
  }, delay);
}

// 啟動機器人（若只有一隻只保留第一行即可）
createBot('IronFarm_Bot', 0);
// createBot('AFK_Bot_2', 5000);
