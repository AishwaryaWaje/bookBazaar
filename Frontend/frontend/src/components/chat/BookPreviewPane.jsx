/**
 * @description BookPreviewPane component displays a detailed preview of a book within a chat modal.
 * It allows a user to buy the book if they are not the owner and the book is not already ordered.
 * @param {object} props - React props.
 * @param {object} props.book - The book object to display.
 * @param {function(string): void} props.onBuy - Function to call when the "Buy Now" button is clicked.
 * @param {object|null} props.currentUser - The currently authenticated user object.
 * @param {boolean} props.isOrdered - Indicates if the book has already been ordered.
 * @returns {JSX.Element|null} The BookPreviewPane component, or null if no book is provided.
 */
const BookPreviewPane = ({ book, onBuy, currentUser, isOrdered }) => {
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

      {!isOwner &&
        (isOrdered ? (
          <p className="mt-auto text-red-500 font-semibold">This book has been ordered.</p>
        ) : (
          <button
            onClick={() => onBuy(book._id)}
            className="mt-auto bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 transition cursor-pointer">
            <i className="fa-solid fa-bolt"></i>Buy Now
          </button>
        ))}
    </aside>
  );
};

export default BookPreviewPane;
