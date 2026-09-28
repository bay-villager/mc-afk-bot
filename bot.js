const mineflayer = require('mineflayer');

function createBot() {
  const bot = mineflayer.createBot({
    host: process.env.SERVER_IP,
    port: parseInt(process.env.SERVER_PORT || '25565'),
    username: 'IronFarm_Bot',
    version: '1.20.4' 
  });

  bot.on('spawn', () => {
    console.log('機器人已成功進服！');
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
