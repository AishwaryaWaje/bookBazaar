const BookPreviewPane = ({ book }) => {
  if (!book) return null;
  return (
    <aside className="p-6 bg-gray-50 border-r h-full flex flex-col items-center justify-center">
      <img
        src={book.image || "https://placehold.co/150x220?text=No+Image"}
        alt={book.title}
        className="w-40 h-56 object-cover mb-4 rounded-md shadow"
      />
      <h2 className="text-lg font-bold text-center">{book.title}</h2>
      <p className="text-center text-gray-600">by {book.author}</p>
      <p className="text-center text-green-600 font-bold mt-2">₹{book.price}</p>
      <p className="text-sm text-gray-500 mt-1">Condition: {book.condition}</p>
      <p className="text-sm text-gray-500">Genre: {book.genere}</p>
    </aside>
  );
};

export default BookPreviewPane;
