const { SlashCommandBuilder } = require('@discordjs/builders');


/**
 * chooseRandomWithWeights
 * @param {*} list A weighted list of the format [{ value: ..., probability: ... }, ...]
 * @returns The value of an element of the list and if the reply is private.
 */
const chooseRandomWithWeights = (list) => {
    let rand = Math.random(); // Random number in [0, 1)
    let i, sumWeights = 0, threshold = 0, pickedValue;
    
    // Check whether the weights in the list add up to 1
    for (i = 0; i < list.length; i++) {
        sumWeights += list[i].probability;
    }
    
    sumWeights = Math.ceil(sumWeights);

    if (sumWeights > 1) {
        console.log('>>> WARNING: Weights sum up to a value greater than 1.');
    } else if (sumWeights < 1) {
        console.log('>>> WARNING: Weights sum up to a value lesser than 1.');
        return [
            list[0].value 
                + ' Und sag Yusel, er soll den Bot mal vernünftig konfigurieren.',
            false
        ];
    }

    // Choose random element from list
    for (i = 0; i < list.length; i++) {
        threshold += list[i].probability;

        if (rand < threshold) {
            pickedValue = list[i].value;
            break;
        }
    }

    return [pickedValue, false];
};


/**
 * 
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName('süppé')
        .setDescription('Gelüstet es dir nach einer warmen Süppé?')
        .addMentionableOption(option =>
            option.setName('für')
                .setDescription('Soll die Süppé etwa für jemand Besonderes sein?!')
                .setRequired(false)),
    async execute(interaction) {
        // Fetch options
        const user = interaction.user;
        let mention = interaction.options.getMentionable('für');
        if(mention === null) mention = user;

        // List of Süppé-replies
        const suppeList = [{ 
                value: `Hallo ${mention}, es gibt köstliche Süppé!`, 
                probability: .6 
            },
            { 
                value: `Hallo ${mention}, heute gibt es leider keine Süppé.`, 
                probability: .3
            },
            { 
                value: `Halt die Fresse, Denis!`, 
                probability: .1 
            },
        ];

        // Choose a random reply
        let [suppe, isPrivate] = chooseRandomWithWeights(suppeList);
        await interaction.reply({ content: `${suppe}`, ephemeral: isPrivate });
    },
};