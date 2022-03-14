// Book Class
class Book {
	constructor(title, author, isbn) {
		this.title = title;
		this.author = author;
		this.isbn = isbn;
	}
}

// UI Class
class UI {
	static displayBooks() {
		const books = Store.getBooks();

		books.map((book) => UI.addBookToList(book));
	}
	static addBookToList(book) {
		const list = document.querySelector('#book-list');
		const row = document.createElement('tr');
		row.innerHTML = `
			<td>${book.title}</td>
			<td>${book.author}</td>
			<td>${book.isbn}</td>
			<td><a href='#' class='btn btn-danger btn-sm delete' >X</a></td>
		`;
		list.appendChild(row);
	}

	static deleteItem(element) {
		if (element.classList.contains('delete')) {
			element.parentElement.parentElement.remove();
		}
	}

	static showAlert(message, className) {
		const div = document.createElement('div');
		div.className = `alert alert-${className}`;
		const text = document.createTextNode(message);
		div.appendChild(text);
		const container = document.querySelector('.container');
		const form = document.querySelector('#book-form');
		container.insertBefore(div, form);
		setTimeout(() => {
			const alert = document.querySelector('.alert');
			alert.remove();
		}, 3000);
	}

	static clearFields() {
		document.querySelector('#title').value = '';
		document.querySelector('#author').value = '';
		document.querySelector('#isbn').value = '';
	}
}

// Store Class

class Store {
	static getBooks() {
		let books;
		if (localStorage.getItem('books') === null) {
			books = [];
		} else {
			books = JSON.parse(localStorage.getItem('books'));
		}
		return books;
	}
	static addBook(book) {
		let books = Store.getBooks('books');
		books.push(book);
		localStorage.setItem('books', JSON.stringify(books));
	}
	static removeBook(isbn) {
		let books = Store.getBooks('books');
		books.forEach((book, index) => {
			if (book.isbn === isbn) {
				books.splice(index, 1);
			}
		});
		localStorage.setItem('books', JSON.stringify(books));
	}
}

// Display Event
document.addEventListener('DOMContentLoaded', UI.displayBooks);
// Add to list Event
document.querySelector('#book-form').addEventListener('submit', (e) => {
	e.preventDefault();
	// Get form values
	const title = document.querySelector('#title').value;
	const author = document.querySelector('#author').value;
	const isbn = document.querySelector('#isbn').value;
	// Validation
	if (title === '' || author === '' || isbn === '') {
		UI.showAlert('Please complete all fields', 'danger');
	} else {
		// inistiate a new book
		const book = new Book(title, author, isbn);
		// Add book to the list
		UI.addBookToList(book);
		Store.addBook(book);

		// Success Alert
		UI.showAlert('Book Added', 'success');
		// Clear Fields
		UI.clearFields();
	}
});

// Remove from List Event

const list = document.querySelector('#book-list');
list.addEventListener('click', (e) => {
	UI.deleteItem(e.target);
	UI.showAlert('Book removed', 'success');
	Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
});
