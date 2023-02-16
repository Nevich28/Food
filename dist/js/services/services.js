const postData = async (url, data) => { //функция для отправки запроса на вервер и получения обратно ответа в json
	const res =  await fetch(url, {
		method: 'POST',
		headers: {
			'Content-type': 'application/json'
		},
		body: data
	});

	return await res.json();
};

export {postData};