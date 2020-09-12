const fs    = require("fs");
const axios = require("axios");

const sheetID = "1i5BM1WzReDZ__95Vz2LLk0JHb0WaJeTsBoJhv5D_y3g";
const googleSheetUrl = `https://spreadsheets.google.com/feeds/list/${sheetID}/od6/public/values?alt=json`;
const columns = ["date", "title", "description", "tag", "layout", "content"];

module.exports = () => {
	return new Promise((resolve, reject) => {
		console.log(`Requesting content from ${googleSheetUrl}`);
		axios.get(googleSheetUrl)
			.then(response => {
				var data = [];
				response.data.feed.entry.forEach(item => {
					let itemData = {};
					for (col of columns) {
						if (col === 'date')
							itemData[col] = new Date(item[`gsx$${col}`].$t).toISOString();
						else
							itemData[col] = item[`gsx$${col}`].$t;
					}
					data.push(itemData);
				});

				let path = `${__dirname}/../sheet.json`;

				fs.writeFile(path, JSON.stringify(data), err => {
					if(err) {
						return reject(error);
					} else {
						console.log(`Data saved at ${path}`);
					}
				});
				resolve(data);
			})
			.catch(error => {
				console.log('Error :', error);
				reject(error);
			});
	})
}
