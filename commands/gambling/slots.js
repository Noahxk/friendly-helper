const profileModel = require('../../models/profileSchema');
const { SlashCommandBuilder } = require('discord.js');

module.exports= {
	data: new SlashCommandBuilder()
            .setName("slots")
            .setDescription("Gambling away your money on a slot machine")
            .addIntegerOption(option =>
                option
                    .setName("bet")
                    .setDescription("How much money you gamble in the machine")
                    .setRequired(true)
                    .setMinValue(1)
            ),
	async execute(interaction, Discord, client, fetch, perm){

        let bet = interaction.options.getInteger("bet");
        msgProfileData = await profileModel.findOne({userID: interaction.user.id});
        if(msgProfileData.coins - bet < 0) return interaction.reply({content: "You don't have enough money to gamble that much."});
        bet = parseInt(bet);

        const slotSymbols = [":watermelon:",":grapes:",":gem:",":four_leaf_clover:",":peach:",":cherries:",":bell:",":seven:",":chocolate_bar:",":apple:",    ":gem:",":lemon:",":bell:",":kiwi:",":coconut:",":lime:",":avocado:",":tomato:",":pineapple:",":melon:"];
        const symbolsPerReel = 10;

        const slot1 = slotSymbols[Math.floor(Math.random() * symbolsPerReel)];
        const slot2 = slotSymbols[Math.floor(Math.random() * symbolsPerReel)];
        const slot3 = slotSymbols[Math.floor(Math.random() * symbolsPerReel)];

        if(slot1 == slot2 && slot2 == slot3){
            payout = bet * 73;
            const newEmbed = new Discord.EmbedBuilder()
            .setColor(colour.default)
            .setTitle('Dirty Slot')
            .setDescription(`
# ${slot1} | ${slot2} | ${slot3}
    
:sparkles: You Won: ${payout} :coin: :sparkles:
            `);
            try{ 
                dbResponse = await profileModel.findOneAndUpdate({
                    userID: interaction.user.id,
                }, {
                    $inc: {
                        coins: payout
                    }
                });
                interaction.reply({embeds: [newEmbed]});
            } catch (err){
                console.error(err);
            }
        } else {
            const newEmbed = new Discord.EmbedBuilder()
            .setColor(colour.default)
            .setTitle('Dirty Slot')
            .setDescription(`
# ${slot1} | ${slot2} | ${slot3}
    
You Lost: ${bet} :coin:
            `);
            try{ 
                dbResponse = await profileModel.findOneAndUpdate({
                    userID: interaction.user.id,
                }, {
                    $inc: {
                        coins: -bet
                    }
                });
                interaction.reply({embeds: [newEmbed]});
            } catch (err){
                console.error(err);
            }
        }

		console.log(`${interaction.user.username} used ${interaction.commandName}`);
	}
}