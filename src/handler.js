const { nanoid } = require("nanoid");
const books = require("./books");

const createBooksHandler = (request, h) => {
	const {
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		reading,
	} = request.payload;
	const id = nanoid(16);
	const insertedAt = new Date().toISOString();
	const updatedAt = insertedAt;
	const finished = (readPage === pageCount);

	if (name === undefined) {
		const response = h.response({
			status: "fail",
			message: "Gagal menambahkan buku. Mohon isi nama buku",
		});
		response.code(400);
		return response;
	} else if (readPage > pageCount) {
		const response = h.response({
			status: "fail",
			message:
        "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
		});
		response.code(400);
		return response;
	}

	const newBook = {
		id,
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		reading,
		insertedAt,
		updatedAt,
		finished,
	};
	books.push(newBook);

	const isSuccess = books.filter((book) => book.id === id).length > 0;

	if (isSuccess) {
		const response = h.response({
			status: "success",
			message: "Buku berhasil ditambahkan",
			data: {
				bookId: id,
			},
		});
		response.code(201);
		return response;
	} else {
		const response = h.response({
			status: "fail",
			message: "Buku gagal ditambahkan",
		});
		response.code(500);
		return response;
	}
};

const readAllBooksHandler = (request, h) => {
	const {name, reading, finished } = request.query;

	if (!reading &&!finished &!name) {
		const response = h.response({
			status: "success",
			data: {
				books: books.map((data) => ({
					id: data.id,
					name: data.name,
					publisher: data.publisher,
				})),
			},
		});
		response.code(200);
		return response;
	}

	if (name !== undefined) {
		const filterBooks = [...books];
		const filterBooksName = filterBooks.filter((book) =>  book.name.toLowerCase().includes(name.toLowerCase())
		);
		const response = h.response({
			status: "success",
			data: {
				books: filterBooksName.map((data) => ({
					id: data.id,
					name: data.name,
					publisher: data.publisher,
				})),
			},
		});
		response.code(200);
		return response;
	}

	if (reading == true) {
		const response = h.response({
			status: "success",
			data: {
				books: books
					.filter((book) => book.reading === true)
					.map((book) => ({
						id: book.id,
						name: book.name,
						publisher: book.publisher,
					})),
			},
		});
		response.code(200);
		return response;
	}
	if (finished == true) {
		const response = h.response({
			status: "success",
			data: {
				books: books
					.filter((book) => book.finished === true)
					.map((book) => ({
						id: book.id,
						name: book.name,
						publisher: book.publisher,
					})),
			},
		});
		response.code(200);
		return response;
	}

	if (finished == false) {
		const response = h.response({
			status: "success",
			data: {
				books: books
					.filter((book) => book.finished === false)
					.map((book) => ({
						id: book.id,
						name: book.name,
						publisher: book.publisher,
					})),
			},
		});
		response.code(200);
		return response;
	}
	
	if (reading == false) {
		const response = h.response({
			status: "success",
			data: {
				books: books
					.filter((book) => book.reading === false)
					.map((book) => ({
						id: book.id,
						name: book.name,
						publisher: book.publisher,
					})),
			},
		});
		response.code(200);
		return response;
	}

};

const readBooksByIdHandler = (request, h) => {
	const {id} = request.params;
	const book = books.filter((n) => n.id === id)[0];

	if (book !== undefined) {
		const response = h.response({
			status: "success",
			data: {
				book,
			},
		});
		response.code(200);
		return response;
	}

	const response = h.response({
		status: "fail",
		message: "Buku tidak ditemukan",
	});
	response.code(404);
	return response;
};

const updateBooksByIdHandler = (request, h) => {
	const {id} = request.params;
	const {
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		reading,
	} = request.payload;

	const finished = readPage === pageCount;
	const index = books.findIndex((book) => book.id === id);
	if (name === undefined) {
		const response = h.response({
			status: "fail",
			message: "Gagal memperbarui buku. Mohon isi nama buku",
		});
		response.code(400);
		return response;
	} else if (readPage > pageCount) {
		const response = h.response({
			status: "fail",
			message:
        "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
		});
		response.code(400);
		return response;
	} else if (index !== -1) {
		const updatedAt = new Date().toISOString();
		books[index] = {
			...books[index],
			name,
			year,
			author,
			summary,
			publisher,
			pageCount,
			readPage,
			reading,
			updatedAt,
			finished,
		};
		const response = h.response({
			status: "success",
			message: "Buku berhasil diperbarui",
		});
		response.code(200);
		return response;
	} else {
		const response = h.response({
			status: "fail",
			message: "Gagal memperbarui buku. Id tidak ditemukan",
		});
		response.code(404);
		return response;
	}
};

const deleteBooksByIdHandler = (request, h) => {
	const {id} = request.params;
	const index = books.findIndex((book) => book.id === id);
	if (index !== -1) {
		books.splice(index, 1);
		const response = h.response({
			status: "success",
			message: "Buku berhasil dihapus",
		});
		response.code(200);
		return response;
	} else {
		const response = h.response({
			status: "fail",
			message: "Buku gagal dihapus. Id tidak ditemukan",
		});
		response.code(404);
		return response;
	}
};

module.exports = {
	createBooksHandler,
	readAllBooksHandler,
	readBooksByIdHandler,
	updateBooksByIdHandler,
	deleteBooksByIdHandler,
};
