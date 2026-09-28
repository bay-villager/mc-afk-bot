const mineflayer = require('mineflayer');

function createBot() {
  const bot = mineflayer.createBot({
    host: process.env.SERVER_IP,
    port: parseInt(process.env.SERVER_PORT || '25565'),
    username: 'IronFarm_Bot',
    version: '1.20.4',
    checkTimeoutInterval: 60 * 1000
  });

  bot.on('spawn', () => {
    console.log('機器人已成功進服並穩定掛機！');
    
    // 改用「原地蹲下與站立」防掛機，完全不會觸發 Invalid move player packet 錯誤
    setInterval(() => {
      bot.setControlState('sneak', true);
      setTimeout(() => bot.setControlState('sneak', false), 1000);
    }, 15000);
  });

  bot.on('end', (reason) => {
    console.log('連線中斷，原因:', reason, '準備重新連線...');
    setTimeout(createBot, 10000);
  });

  bot.on('error', err => console.log('發生錯誤:', err));
}

createBot();
