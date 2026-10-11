const { Client, GatewayIntentBits, EmbedBuilder, ActivityType } = require('discord.js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const { CipherPipelineFactory } = require('../core/pipeline');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const PREFIX = '!crypt ';

client.once('ready', () => {
    console.log(`🤖 Logged in as ${client.user.tag}!`);
    
    // Set status as Streaming with a clickable URL link
    client.user.setPresence({
        activities: [{
            name: 'Cipher-Engine v1.0',
            type: ActivityType.Streaming,
            url: 'https://github.com/4shu-dev/cipher-engine'
        }],
        status: 'online'
    });
});

client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(' ');
    const mode = args[0]; // 'pipeline' or single action ('enc'/'dec')
    
    try {
        let output = '';
        let description = '';

        if (mode === 'pipeline') {
            // Usage: !crypt pipeline enc rotor:key1,caesar:3 Hello World!
            const action = args[1]; // enc or dec
            const pipelineSpec = args[2]; // e.g. "rotor:key1,caesar:3"
            const text = args.slice(3).join(' ');

            if (!action || !pipelineSpec || !text || !['enc', 'dec'].includes(action)) {
                return message.reply('❌ Usage: `!crypt pipeline <enc/dec> <type:key,type:key> <message>`');
            }

            const configs = pipelineSpec.split(',').map(part => {
                const [type, ...keyParts] = part.split(':');
                return { type, key: keyParts.join(':') || 'default' };
            });

            const pipeline = CipherPipelineFactory.create(configs);
            output = action === 'enc' ? pipeline.encrypt(text) : pipeline.decrypt(text);
            description = `Pipeline: \`${pipelineSpec}\``;

            const embed = new EmbedBuilder()
                .setTitle('🔐 Multi-Cipher Pipeline Execution')
                .setDescription(description)
                .addFields(
                    { name: 'Operation', value: `\`${action.toUpperCase()}\``, inline: true },
                    { name: 'Input', value: `\`\`\`${text}\`\`\`` },
                    { name: 'Output', value: `\`\`\`${output}\`\`\`` }
                )
                .setColor(0x57F287)
                .setTimestamp();

            await message.reply({ embeds: [embed] });

        } else {
            // Legacy single cipher fallback: !crypt enc <key> <message>
            const action = mode; // enc or dec
            const key = args[1];
            const text = args.slice(2).join(' ');

            if (!action || !key || !text || !['enc', 'dec'].includes(action)) {
                return message.reply('❌ Usage: `!crypt enc <key> <message>` or `!crypt pipeline <enc/dec> <specs> <text>`');
            }

            const configs = [{ type: 'rotor', key }];
            const pipeline = CipherPipelineFactory.create(configs);
            output = action === 'enc' ? pipeline.encrypt(text) : pipeline.decrypt(text);

            const embed = new EmbedBuilder()
                .setTitle('🔐 Rotor Engine Execution')
                .addFields(
                    { name: 'Operation', value: `\`${action.toUpperCase()}\``, inline: true },
                    { name: 'Input', value: `\`\`\`${text}\`\`\`` },
                    { name: 'Output', value: `\`\`\`${output}\`\`\`` }
                )
                .setColor(0x57F287)
                .setTimestamp();

            await message.reply({ embeds: [embed] });
        }
    } catch (err) {
        await message.reply(`❌ Engine Exception: \`${err.message}\``);
    }
});

client.login(process.env.BOT_TOKEN);