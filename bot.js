const mineflayer = require('mineflayer');

function createBot() {
  const bot = mineflayer.createBot({
    host: process.env.SERVER_IP,
    port: parseInt(process.env.SERVER_PORT || '25565'),
    username: 'IronFarm_Bot',
    version: '1.20.1', // 1.20.1 與 ViaVersion 的相容性最好
    checkTimeoutInterval: 120 * 1000,
    hideErrors: true // 隱藏未知的封包解析錯誤
  });

  // 靜音並忽略未知的 Protocol 封包拋錯，防止 Socket 斷開
  if (bot._client) {
    bot._client.on('error', (err) => {
      if (err.message.includes('Deserialization error') || err.message.includes('No data available')) {
        return; // 忽略 26.3 新版本的未知封包
      }
      console.log('Client error:', err.message);
    });
  }

  bot.on('spawn', () => {
    console.log('機器人已成功進服並穩定掛機！');
    
    // 微幅轉動視角防掛機（完全不觸發位移與封包異常）
    setInterval(() => {
      if (bot.entity) {
        bot.look(bot.entity.yaw + 0.1, bot.entity.pitch, true);
      }
    }, 20000);
  });

  bot.on('end', (reason) => {
    console.log('連線中斷，原因:', reason, '5 秒後重新連線...');
    setTimeout(createBot, 5000);
  });

  bot.on('error', err => {
    // 忽略非致命的 protocol 解析錯誤
  });
}

createBot();
