//3220302
//Irfan Juliana
const books = require("./books")
const { nanoid } = require('nanoid')



const test = (request,h) =>{
    const response = h.response({
        status : 'success',
        message : 'Server Hidup'
    })
    response.code(200)
    return response

}

const addBookHandler = (request, h) => {
    if (!request.payload) {
        const response = h.response({
            status: 'fail',
            message: 'Payload request kosong',
        })
        response.code(400)
        return response
    }

    const { name, year, author, summary, publisher, pageCount, readPage,reading } = request.payload

    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        })
        response.code(400)
        return response
    }

    if (typeof pageCount !== 'number' || typeof readPage !== 'number') {
        const response = h.response({
            status: 'fail',
            message: 'Tipe data pageCount dan readPage harus number',
        })
        response.code(400)
        return response
    }

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        })
        response.code(400)
        return response
    }

    const id = nanoid(16)
    const insertedAt = new Date().toISOString()
    const updatedAt = insertedAt
    const finished = pageCount === readPage
    const newBook = {
        id, name, year, author, summary, publisher, pageCount, readPage,reading, finished, insertedAt, updatedAt,
    }

    books.push(newBook)

    const isSuccess = books.filter((book) => book.id === id).length > 0

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id
            },
        })
        response.code(201)
        return response
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
    })
    response.code(500)
    return response
};


const getAllBooksHandler = (request) => {
    let filteredBooks = [...books];

    const { reading } = request.query;
    if (reading === '1') { 
        filteredBooks = filteredBooks.filter(book => book.reading === true);
    }else{
        filteredBooks = filteredBooks.filter(book => book.reading === false);
    }

    const { finished } = request.query;
    if (finished === '1') { 
        filteredBooks = filteredBooks.filter(book => book.readPage == book.pageCount);
    } else if (finished === '0') {
        filteredBooks = filteredBooks.filter(book => book.readPage !== book.pageCount);
    };

    const { name } = request.query;
    if (name) {
        filteredBooks = filteredBooks.filter(book => book.name.toLowerCase().includes(name.toLowerCase()));
    }

    const result = filteredBooks.map(book => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher
    }));

    return {
        status: 'success',
        data: {
            books: result
        }
    };
};


const getBookByIdHandler = (request, h) => {
    const { bookId }  = request.params;
    const book = books.find((n) => n.id === bookId);

    if (book) {
        return {
            status: 'success',
            data: {
                book: {
                    id: book.id,
                    name: book.name,
                    year: book.year,
                    author: book.author,
                    summary: book.summary,
                    publisher: book.publisher,
                    pageCount: book.pageCount,
                    readPage: book.readPage,
                    finished: book.pageCount === book.readPage,
                    reading: false,
                    insertedAt: book.insertedAt,
                    updatedAt: book.updatedAt
                }
            }
        };
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
};

const updateBookHandler = (request, h) => {
    const { bookId } = request.params;
    const { name, year, author, summary, publisher, pageCount, readPage } = request.payload;

    if (!name || !year || !author || !summary || !publisher || !pageCount || !readPage) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    const index = books.findIndex((book) => book.id === bookId);
    if (index === -1) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan',
        });
        response.code(404);
        return response;
    }

    books[index] = {
        ...books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished: pageCount === readPage,
        updatedAt: new Date().toISOString(),
    };

    const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
};

const deleteBookHandler = (request, h) => {
    const { bookId } = request.params;

    const index = books.findIndex((book) => book.id === bookId);
    if (index === -1) {
        const response = h.response({
            status: 'fail',
            message: 'Buku gagal dihapus. Id tidak ditemukan',
        });
        response.code(404);
        return response;
    }

    books.splice(index, 1);

    const response = h.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
};





module.exports = { addBookHandler, test, getAllBooksHandler,getBookByIdHandler,updateBookHandler,deleteBookHandler}