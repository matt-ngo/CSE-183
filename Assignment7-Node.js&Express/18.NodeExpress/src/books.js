const books = require('../data/books.json');

// https://www.oreilly.com/library/view/regular-expressions-cookbook/9781449327453/ch04s13.html
const isbn10 = '^(?:ISBN(?:-10)?:?●)?(?=[0-9X]{10}$|(?=(?:[0-9]+[-●]){3})[-●0-9X]{13}$)[0-9]{1,5}[-●]?[0-9]+[-●]?[0-9]+[-●]?[0-9X]$';
const isbn13 = '^(?:ISBN(?:-13)?:?●)?(?=[0-9]{13}$|(?=(?:[0-9]+[-●]){4})[-●0-9]{17}$)97[89][-●]?[0-9]{1,5}[-●]?[0-9]+[-●]?[0-9]+[-●]?[0-9]$';

exports.getAll = async (req, res) => {
  res.status(200).json({books: books});
}

exports.getByISBN = async (req, res) => {
  if (req.params.isbn.match(isbn10) || req.params.isbn.match(isbn13)) {
    const book = books.find(book => book.isbn == req.params.isbn);
    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).send();
    }
  } else {
    res.status(400).send();
  }
} 

exports.post = async (req, res) => {
  if (req.body.isbn.match(isbn10) || req.body.isbn.match(isbn13)) {
    const book = books.find(book => book.isbn == req.body.isbn);
    if (book) {
      res.status(409).send();
    } else {
      books.push(req.body);
      res.status(201).send(req.body);
    }
  } else {
    res.status(400).send();
  }
}

