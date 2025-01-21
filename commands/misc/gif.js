require('dotenv').config();

module.exports= {
	name: 'gif',
	description: 'Searches the query on giphy and returns the result',
	execute(message, args, Discord, client, fetch){

		if(!args[0]) return message.channel.send({content: 'You need to include something to search Giphy with!'});
		const query = args.join(' ');
		console.log(`Gif command was executed and the search query was: ${query}`);

		function sendApiRequest() {
			const giphyApiKey = process.env.GIPHY_TOKEN;
			const giphyApiURL = `https://api.giphy.com/v1/gifs/search?q=${query}&rating=g&api_key=${giphyApiKey}`;

			fetch(giphyApiURL).then(function(data) {
				return data.json()
			})
			.then(function(json){
				imgPath = json.data[0].images.original.url;
				message.channel.send(imgPath);
				message.channel.send({files: ['resources/giphy_attribution_logo.png']});
				message.delete();
			})
		}

		sendApiRequest();
	}
}