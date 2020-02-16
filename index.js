// Run dotenv
require('dotenv').config();
const { TOKEN, PREFIX } = process.env;
const Rest = require('node-rest-client').Client;

const Discord = require('discord.js');
const client = new Discord.Client();
const restClient = new Rest();

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
    if (!message.content.startsWith(PREFIX) || message.author.bot) return;

    const args = message.content.slice(PREFIX.length).split(/ +/);
    const command = args.shift().toLowerCase();

    message.channel.send(`--DEBUG-- command: ${command}, arguments: ${args}, message content: ${message.content}`);

    if (command === 'deals') {
        message.reply('some uris for game deals');
    }
    else if (command === 'server') {
        message.reply(`This server's name is: ${message.guild.name}\nTotal members: ${message.guild.memberCount}\nServer created at: ${message.guild.createdAt}\nServer's region: ${message.guild.region}`);
    }
    else if (command === 'user-info') {
        message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
    }
    else if (command === 'args-info') {
        if (!args.length) {
            return message.channel.send(`You didn't provide any arguments for command ${command}, ${message.author}!`);
        }
        message.channel.send(`Command name: ${command}\nArguments: ${args}`);
    }
    else if (command === 'avatar') {
        if (!message.mentions.users.size) {
            return message.channel.send(`Your avatar: ${message.author.displayAvatarURL}`);
        }
        const avatarList = message.mentions.users.map(user => {
            return `${user.displayAvatarURL}`;
        });
        message.channel.send(avatarList);
    }
    else if (command === 'hot') {
        restClient.get('https://www.reddit.com/r/GameDeals/hot/', function (data, response) {
            message.reply(data);
        });
    }
    else if (command === 'prune') {
        const amount = parseInt(args[0]) + 1;
        if (isNaN(amount)) {
            return message.reply('argument for prune should be a valid number');
        }
        else if (amount <= 1 || amount > 100) {
            return message.reply('you can only prune between 1 and 100 messages at a time.');
        }
        message.channel.bulkDelete(amount, true).catch(err => {
            message.reply(`This command would have deleted last ${amount} messages, however something went wrong: ${err}`);
        });
    }
});

client.login(TOKEN);