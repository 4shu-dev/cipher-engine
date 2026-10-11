const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const DynamicRotorCipher = require('../core/rotor');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const PREFIX = '!crypt ';

client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(' ');
    const action = args[0]; // enc or dec
    const key = args[1];
    const text = args.slice(2).join(' ');

    if (!action || !key || !text) {
        return message.reply('❌ Usage: `!crypt enc <key> <message>` or `!crypt dec <key> <ciphertext>`');
    }

    try {
        const cipher = new DynamicRotorCipher(key);
        let output = action === 'enc' ? cipher.encrypt(text) : cipher.decrypt(text);

        const embed = new EmbedBuilder()
            .setTitle('🔐 Cryptographic Engine Execution')
            .addFields(
                { name: 'Operation', value: `\`${action.toUpperCase()}\``, inline: true },
                { name: 'Input', value: `\`\`\`${text}\`\`\`` },
                { name: 'Output', value: `\`\`\`${output}\`\`\`` }
            )
            .setColor(0x57F287)
            .setTimestamp();

        await message.reply({ embeds: [embed] });
    } catch (err) {
        await message.reply(`❌ Engine Exception: \`${err.message}\``);
    }
});

client.login(process.env.BOT_TOKEN);
