const fs = require('node:fs');
const { SlashCommandBuilder, bold, italic, blockQuote } = require('@discordjs/builders');
const wait = require('node:timers/promises').setTimeout;


/**
 * addsUpToOne
 * @param {*} array A simple array of weights
 * @returns boolean Returns true if sum of all weights is equal to 1.
 */
const addsUpToOne = (weights) => {
    let i, sumWeights = 0;
    for (i = 0; i < weights.length; i++) sumWeights += (weights[i] || 0);
    sumWeights = Math.round(sumWeights); 
    return (sumWeights == 1);
};


/**
 * chooseRandomFromWeightedList
 * @param {*} list A weighted list of the format [{ weight: ..., ... }, ...]
 * @returns A random list element.
 */
const chooseRandomFromWeightedList = (list) => {
    let rand = Math.random(); // Random number in [0, 1)
    let i, threshold = 0, pickedItem;

    for (i = 0; i < list.length; i++) {
        threshold += (list[i].weight || 0);
        if (rand < threshold) {
            pickedItem = list[i];
            break;
        }
    }

    return pickedItem;
};


/**
 * giveSuppeReply
 * @param
 * @returns
 */
const giveSuppeReplies = async function (interaction, watery, replies) {
    await interaction.deferReply();

    let timestamp, datetime;

    for (let i = 0; i < replies.length; i++) {
        timestamp = new Date();
        datetime = timestamp.getDate() + "." 
            + (timestamp.getMonth() + 1) + "." 
            + timestamp.getFullYear() + " " 
            + timestamp.getHours() + ":" 
            + timestamp.getMinutes() + ":" 
            + timestamp.getSeconds();

        if (watery && 'wateryValue' in replies[i]) {
            i === 0 
                ? await interaction.editReply(replies[i].wateryValue) 
                : await interaction.followUp(replies[i].wateryValue);
            console.log(datetime + ' ', replies[i]);
        } else {
            i === 0 
                ? await interaction.editReply(replies[i].value) 
                : await interaction.followUp(replies[i].value);
            console.log(datetime + ' ', replies[i]);
        }

        if ('wait' in replies[i]) await wait(replies[i].wait);
    }
};

/**
 * Command: /süppé [user]
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

        // Fetch global variables
        const fileName = './suppe-vars.json';
        const fileData = fs.readFileSync(fileName);
        const fileJSON = JSON.parse(fileData);
        let watery = fileJSON.watery;
        let suppeOnGround = fileJSON.suppeOnGround;

        // Fetch options and initialize constants
        const user = interaction.user;
        const mention = interaction.options.getMentionable('für') ?? user;
        const randomUser = interaction.user; // TODO: Choose one random user 

        // List of Süppé-replies
        const suppeList = [
            {
                weight: 0.1,
                replies: [
                    {
                        value: `Hallo ${mention}, es gibt Süppé.`,
                        wateryValue: `Hallo ${mention}, es gibt Süppé. Ich habe sie mit Wasser gestreckt, weil sie mir langsam ausgeht. :x`,
                    },
                ],
            },
            {
                weight: 0.05,
                replies: [
                    {
                        value: `Hallo ${mention}, ich habe eine schmackhafte Süppé für dich gekocht.`,
                        wateryValue: `Hallo ${mention}, ich habe eine schmackhafte Süppé für dich gekocht. Ich meine, sie wär schmackhaft, wenn sie nicht so wässrig wäre. :x`,
                    },
                ],
            },
            {
                weight: 0.05,
                replies: [
                    {
                        value: `Hallo ${mention}, ich habe dir eine Süppé zubereitet. Sie ist warm und köstlich.`,
                        wateryValue: `Hallo ${mention}, es sollte eigentlich Süppé geben. Aber es schmeckt wie heißes Wasser. :<`,
                    },
                ],
            },
            {
                weight: 0.05,
                replies: [
                    {
                        value: `Hallo ${mention}, es gibt Süppé. Sie duftet so toll. :3`,
                        wateryValue: `Hallo ${mention}, es gibt Süppé. Sie duftet so wässrig. :roll:`,
                    },
                ],
            },
            {
                weight: 0.05,
                replies: [
                    {
                        value: `Hallo ${mention}, es gibt Süppé. Sie ist mir heute besonders gelungen. :o`,
                        wateryValue: `Hallo ${mention}, es gibt Wasser. Es ist mir heute besonders süppíg gelungen.`,
                    },
                ],
            },
            {
                weight: 0.05,
                replies: [
                    {
                        value: `Hallo ${mention}, es gibt Süppé. Ich habe sie heute scharf gewürzt. :3`,
                        wateryValue: `Hallo ${mention}, es gibt Süppé. Ich habe sie heute scharf gewürzt, damit man das Wässrige nicht so herausschmeckt. :x`,
                    },
                ],
            },
            {
                weight: 0.02,
                replies: [
                    {
                        value: `Hallo ${mention}, es gibt gar keine Süppé. Ich habe sie selbst gegessen. Hihi. :3`,
                        wateryValue: `Hallo ${mention}, es gibt gar keine Süppé. Ich habe sie selbst gegessen, aber sie war so wässrig. ;<`,
                    },
                ],
            },
            {
                weight: 0.03,
                replies: [
                    {
                        value: `Hallo ${mention}, es tut mir leider gar nicht leid, aber ich habe die ganze Süppé auf dich geschüttet. Gnihihi. :>`,
                        wateryValue: `Hallo ${mention}, es tut mir leider gar nicht leid, aber ich habe die ganze Süppé auf dich geschüttet. Sie wär auch viel zu wässrig zum Essen gewesen.`,
                    },
                ],
            },
            {
                weight: 0.03,
                replies: [
                    {
                        value: `Hallo ${mention}, ich habe eine Süppé für dich zubereitet. Sie ist versalzen, aber mir schmeckt sie.`,
                        wateryValue: `Hallo ${mention}, ich habe eine Süppé für dich zubereitet. Ich habe sie versalzen, damit sie nicht so wässrig wirkt!`,
                    },
                ],
            },
            {
                weight: 0.05,
                replies: [
                    {
                        value: `Hallo ${mention}, es gibt keine Süppé, sondern Brei. Mir muss ein Fehler bei der Zubereitung unterlaufen sein. ;x`,
                        wateryValue: `Hallo ${mention}, es gibt Süppé. Leider ist sie wässrig geworden. Ich hätte einen Kübel Wasser weniger reinkippen sollen.`,
                    },
                ],
            },
            {
                weight: 0.02,
                replies: [
                    {
                        value: `Hallo ${mention}, es gibt Süppé. Leider ist sie mir angebrannt. ;<`,
                        wateryValue: `Hallo ${mention}, es gibt Süppé. Sie ist mir leider angebrannt. Und dann ist sie noch wässrig. Ich schäme mich ja so. :<`,
                    },
                ],
            },
            {
                weight: 0.03,
                replies: [
                    {
                        value: `Hallo ${mention}, heute wärme ich Süppé vom Vortag auf :!:`,
                        wateryValue: `Hallo ${mention}, heute wärme ich Süppé vom Vortag auf. Die ist wenigstens nicht wässrig. :3`,
                    },
                ],
            },
            {
                weight: 0.05,
                replies: [
                    {
                        value: `Hallo ${mention}, es gibt Kuchen. Keine Ahnung, warum.`,
                        wateryValue: `Hallo ${mention}, es gibt Kuchen. Keine Ahnung, warum. Und irgendwie ist er wässrig.`,
                    },
                ],
            },
            {
                weight: 0.03,
                replies: [
                    {
                        value: `Hallo ${mention}, es gibt Erdbeerkuchen. Keine Ahnung, warum.`,
                        wateryValue: `Hallo ${mention}, es gibt Erdbeerkuchen. Keine Ahnung, warum. Und irgendwie ist er wässrig.`,
                    },
                ],
            },
            {
                weight: 0.02,
                replies: [
                    {
                        value: `Hallo ${mention}, es gibt Buttermilchkuchen. Keine Ahnung, warum.`,
                        wateryValue: `Hallo ${mention}, es gibt Buttermilchkuchen. Keine Ahnung, warum. Und irgendwie ist er wässrig.`,
                    },
                ],
            },
            {
                weight: 0.05,
                replies: [
                    {
                        value: `Hallo ${mention}, ich hätte dir ja gern die Edelsüppé serviert, aber ich habe keine Elfenbeinteller mehr.`,
                    },
                ],
            },
            {
                weight: 0.03,
                replies: [
                    {
                        value: `Hallo ${randomUser}, ich gebe lieber dir die Süppé.`,
                    },
                ],
            },
            {
                weight: 0.02,
                replies: [
                    {
                        value: `Hallo ${mention}, es gibt Süppé. Ich habe aber ein Haar von ${randomUser} in der Süppé gefunden. Ekelick :!:`,
                    },
                ],
            },
            {
                weight: 0.05,
                replies: [
                    {
                        value: `Ich habe kaum noch Süppé übrig. Deswegen werde ich die Süppé jetzt mit ein wenig Wasser anreichern. :o`,
                    },
                ],
                event: 'suppeAlmostEmpty',
            },
            {
                weight: 0.02,
                replies: [
                    {
                        value: `Hallo ${mention}, heute gibt es nur Suppe.`,
                    },
                ],
                event: 'suppeEmpty',
            },
            {
                weight: 0.02,
                replies: [
                    {
                        value: `Hallo ${mention}, mir ist die Süppé ausgegangen. Ich fahre jetzt nach Berlin und kaufe mir neue. :o`,
                    },
                ],
                event: 'suppeEmpty',
            },
            {
                weight: 0.01,
                replies: [
                    {
                        value: `Hallo ${mention}, mir ist die Süppé ausgegangen. Ich fahre jetzt mit meinem Wohnwagen nach Hamburg und kaufe mir neue. :o`,
                    },
                ],
                event: 'suppeEmpty',
            },
            {
                weight: 0.01,
                replies: [
                    {
                        value: `Hallo ${mention}, mir ist die Süppé ausgegangen. Ich trampe nach Dortmund und kaufe mir neue. :o`,
                    },
                ],
                event: 'suppeEmpty',
            },
            {
                weight: 0.01,
                replies: [
                    {
                        value: `Hallo ${mention}, mir ist die Süppé ausgegangen. Ich fliege jetzt nach Frankreich und protestiere. :o`,
                    },
                ],
                event: 'suppeEmpty',
            },
            {
                id: 'edelsuppe',
                weight: .02,
                replies: [
                    {
                        value: blockQuote(bold('0o Es gibt Edelsüppé! 0o\n\n'))
                            + `Hallo ${mention}, es gibt mit Blattgold garnierte Edelsüppé. Ich serviere sie heute auf teuren Elfenbeintellern.`,
                        wateryValue: blockQuote(bold('0o Es gibt Edelsüppé! 0o\n\n'))
                            + `Hallo ${mention}, es gibt mit Blattgold garnierte Edelsüppé. Ich serviere sie heute auf teuren Elfenbeintellern. Aber ich weiß nicht, irgendwie ist sie heute wässrig. :x`,
                    },
                ],
            },
            {
                id: 'edelsuppe2',
                weight: .01,
                replies: [
                    {
                        value: blockQuote(bold('0o Es gibt besonders edle Edelsüppé! 0o\n\n'))
                            + `Hallo ${mention}, es gibt mit Blattgold garnierte Edelsüppé mit Trüffeln und dazu ein Glas teuersten Champagner. Ich serviere sie heute auf teuren Elfenbeintellern und reiche dazu edelstes Silberbesteck.`,
                    }
                ],
            },
            {
                id: 'sieb',
                weight: .04,
                replies: [
                    {
                        value: `Hallo ${mention}, heute gibt es Süppé im Sieb. Ich habe keine Teller mehr gefunden. ᕙ(^▿^-ᕙ)`,
                        wait: 20000,
                    },
                    {
                        value: `Die Süppé tropft aus dem Sieb. :s`,
                        wait: 20000,
                    },
                    {
                        value: `Die Süppé tropft immer noch. :s`,
                        wait: 20000,
                    },
                    {
                        value: `Die Süppé kriecht am Boden lang ...`,
                        wait: 20000,
                    },
                    {
                        value: `Die Süppé wird fest. Man kann sie nun abschaben. :3`,
                    },
                ],
                event: 'sieb',
            },
            {
                id: 'werfen',
                weight: .04,
                replies: [
                    {
                        value: italic(`bewirft ${mention} mit Süppé.`),
                        wateryValue: italic(`bewirft ${mention} mit wässriger Süppé.`),
                        wait: 5000,
                    },
                    {
                        value: `Huch, wie tollpatschig. :x`,
                    },
                ],
            },
            {
                id: 'abfall',
                weight: .01,
                replies: [
                    {
                        value: `Hallo ${mention}, ich habe eine leckere Süppé aus Küchenabfällen für dich zubereitet.`,
                        wait: 10000,
                    },
                    {
                        value: `Wo ist eigentlich mein Putzlappen hin? D:`,
                        wait: 5000,
                    },
                    {
                        value: `Ich muss ihn wohl vorhin in die Süppé mit den Küchenabfällen geworfen haben. :x`,
                    },
                ],
            },
            {
                id: 'omaewa',
                weight: .03,
                replies: [
                    {
                        value: `Omae wa mou shindeiru.`,
                        wait: 5000,
                    },
                    {
                        value: bold(`Nani??`),
                    }
                ],
            },
        ];

        // Check plausability of weights in suppeList
        let i, weights = [];
        for (i = 0; i < suppeList.length; i++) weights.push(suppeList[i].weight);
        if (!addsUpToOne(weights)) {
            console.log('>> WARNING: Weights do not add up to one!');
            return;
        }

        // Check if süppé is on the ground 
        if (suppeOnGround) {
            giveSuppeReplies(interaction, watery, [{
                    value: `Hallo ${mention}, ich serviere dir Süppé, die ich vom Boden abgeschabt habe. :3`,
            }]);

            fileJSON.suppeOnGround = false;
            fs.writeFileSync(fileName, JSON.stringify(fileJSON));

            return;
        }

        // Choose a random element
        let suppe = chooseRandomFromWeightedList(suppeList);

        // Check if special event occurs
        if ('event' in suppe) {
            switch (suppe.event) {
                case 'suppeAlmostEmpty':
                    fileJSON.watery = true;
                    fs.writeFileSync(fileName, JSON.stringify(fileJSON));
                    giveSuppeReplies(interaction, watery, suppe.replies);
                    break;
                case 'suppeEmpty':
                    fileJSON.watery = false;
                    fs.writeFileSync(fileName, JSON.stringify(fileJSON));
                    giveSuppeReplies(interaction, watery, suppe.replies);
                    break;
                case 'sieb':
                    await giveSuppeReplies(interaction, watery, suppe.replies);
                    fileJSON.suppeOnGround = true;
                    fs.writeFileSync(fileName, JSON.stringify(fileJSON));
                    break;
            }

            return;
        }

        // All the other normal cases
        giveSuppeReplies(interaction, watery, suppe.replies);
    },
};