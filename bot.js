const mineflayer = require('mineflayer');

function createBot() {
  const bot = mineflayer.createBot({
    host: process.env.SERVER_IP, // 從 GitHub Secrets 讀取 IP
    port: parseInt(process.env.SERVER_PORT || '25565'),
    username: 'IronFarm_Bot',
    version: false
  });

  bot.on('spawn', () => {
    console.log('機器人已成功進服！');
    // 每 10 秒跳躍一次，防止被防掛機機制踢出
    setInterval(() => {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 500);
    }, 10000);
  });

  bot.on('end', () => {
    console.log('連線中斷，準備重新連線...');
    setTimeout(createBot, 30000);
  });

  bot.on('error', err => console.log('發生錯誤:', err));
}

createBot();