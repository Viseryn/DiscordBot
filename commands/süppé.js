const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('süppé')
        .setDescription('Süppé'),
    async execute(interaction) {
        await interaction.reply('Halt die Fresse Denis!');
    },
};