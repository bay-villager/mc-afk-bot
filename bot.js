const mineflayer = require('mineflayer');

function createBot() {
  const bot = mineflayer.createBot({
    host: process.env.SERVER_IP,
    port: parseInt(process.env.SERVER_PORT || '25565'),
    username: 'IronFarm_Bot',
    version: '1.20.1',
    checkTimeoutInterval: 60 * 1000,
    physicsEnabled: false // 關鍵：徹底關閉物理模擬，防止發送非法位移封包 (Invalid move player packet)
  });

  bot.on('spawn', () => {
    console.log('機器人已成功進服並穩定掛機！');
    
    // 改用單純發送聊天或靜態動作來防自動斷線/AFK
    setInterval(() => {
      bot.setControlState('sneak', true);
      setTimeout(() => bot.setControlState('sneak', false), 500);
    }, 15000);
  });

  bot.on('end', (reason) => {
    console.log('連線中斷，原因:', reason, '5 秒後重新連線...');
    setTimeout(createBot, 5000);
  });

  bot.on('error', err => console.log('發生錯誤:', err));
}

createBot();
