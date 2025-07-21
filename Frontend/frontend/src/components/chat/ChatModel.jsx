import BookPreviewPane from "./BookPreviewPane";
import ChatPane from "./ChatPane";

const ChatModal = ({ book, conversationId, currentUser, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-4xl h-[70vh] bg-white rounded-xl shadow-xl grid grid-cols-1 md:grid-cols-2 relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300 text-gray-800">
          ✕
        </button>

        <BookPreviewPane book={book} />

        <div className="h-full">
          <ChatPane conversationId={conversationId} currentUser={currentUser} />
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
