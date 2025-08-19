const BookPreviewPane = ({ book, onBuy, currentUser }) => {
  if (!book) return null;
  const isOwner =
    currentUser && book.listedBy && String(book.listedBy._id) === String(currentUser._id);
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

      {!isOwner && (
        <button
          onClick={() => onBuy(book._id)}
          className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 transition cursor-pointer">
          <i className="fa-solid fa-bolt"></i>Buy Now
        </button>
      )}
    </aside>
  );
};

export default BookPreviewPane;
