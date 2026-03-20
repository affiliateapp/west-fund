import React, { useState } from 'react';
import { Upload, Coins } from 'lucide-react';
import { uploadBook } from './firebaseService';
import { checkDuplicateBookURL } from './seedDemoData';
import { COIN_RATES } from './CoinSystem';
import { BookCountrySelector } from './CountrySystem';

const PROMOTION_DURATION_DAYS = 5;

const UploadBookForm = ({ 
  currentUser, 
  onUploadSuccess, 
  canAddMorePromotions,
  MAX_PROMOTED_BOOKS,
  getActivePromotedBooks,
  setShowSubscriptionModal 
}) => {
  const [loading, setLoading] = useState(false);
  const [bookForm, setBookForm] = useState({
    title: '', 
    author: '', 
    genre: '', 
    description: '', 
    pageCount: '', 
    amazonLink: '',
    isPromoted: false, 
    coverImage: '', 
    bookFileUrl: '',
    bookFileData: '', // 🔧 NEW: Store base64 file data
    bookFileName: '', // 🔧 NEW: Store filename separately
    language: 'English',
    isExplicit: false,
    keywords: '', 
    mainCharacters: '', 
    coinsOffered: '',
    targetCountries: [],
    readerTypes: {
      standard: false,
      kindleUnlimited: false,
      verifiedPurchase: false
    }
  });

  const [coverImagePreview, setCoverImagePreview] = useState('');

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a valid image file (.jpg, .png, or .gif)');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result);
        setBookForm(prev => ({ ...prev, coverImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // 🔧 FIXED: Now properly converts file to base64
  const handleBookFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['application/pdf', 'application/epub+zip'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a valid file (.pdf or .epub)');
        return;
      }

      // Convert file to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result; // This includes "data:application/pdf;base64,..." prefix
        setBookForm(prev => ({ 
          ...prev, 
          bookFileData: base64Data, // Store the full base64 data
          bookFileName: file.name,   // Store filename for display
          bookFileUrl: file.name     // Keep this for backward compatibility
        }));
        alert(`File "${file.name}" ready to upload`);
      };
      reader.readAsDataURL(file); // This creates base64 with data URI prefix
    }
  };

  const handleBookUpload = async () => {
    setLoading(true);
    
    if (!bookForm.title || !bookForm.author || !bookForm.genre || !bookForm.pageCount || !bookForm.description || !bookForm.amazonLink) {
      setLoading(false);
      alert('Please fill in all required fields');
      return;
    }

    const hasReaderType = bookForm.readerTypes.standard || 
                          bookForm.readerTypes.kindleUnlimited || 
                          bookForm.readerTypes.verifiedPurchase;
    
    if (!hasReaderType) {
      setLoading(false);
      alert('Please select at least one reader type (Standard, Kindle Unlimited, or Verified Purchase)');
      return;
    }

    // 🔧 FIXED: Check for bookFileData instead of just bookFileUrl
    if (bookForm.readerTypes.standard && !bookForm.bookFileData) {
      setLoading(false);
      alert('Standard reviews require a PDF or ePub file. Please upload your book file.');
      return;
    }

    if (!currentUser || typeof currentUser.coins !== 'number') {
      setLoading(false);
      alert('User data not fully loaded. Please refresh and try again.');
      return;
    }

    const coinsOffered = parseInt(bookForm.coinsOffered, 10);
    if (!coinsOffered || coinsOffered < 5) {
      setLoading(false);
      alert('Please offer at least 5 coins per review');
      return;
    }

    if (currentUser.coins < coinsOffered) {
      setLoading(false);
      alert(`You need at least ${coinsOffered} coins to upload this book. Current balance: ${currentUser.coins} coins.\n\nEarn more coins by reviewing other books!`);
      return;
    }

    const descriptionWords = bookForm.description.trim().split(/\s+/).filter(w => w).length;
    if (descriptionWords > 10) {
      setLoading(false);
      alert(`Description is too long. Maximum 10 words allowed. Current: ${descriptionWords} words.`);
      return;
    }

    console.log('🔍 Checking for duplicate book URL...');
    const duplicateCheck = await checkDuplicateBookURL(bookForm.amazonLink);
    
    if (duplicateCheck.isDuplicate) {
      setLoading(false);
      alert(`⚠️ Duplicate Book Detected!\n\n${duplicateCheck.message}\n\nPlease upload a different book.`);
      return;
    }

    if (bookForm.isPromoted) {
      const hasActivePromotion = currentUser?.promotionSubscription?.active;
      const promotionExpiry = currentUser?.promotionSubscription?.expiresAt;
      const isExpired = promotionExpiry && new Date(promotionExpiry) <= new Date();
      
      if (!hasActivePromotion || isExpired) {
        setLoading(false);
        alert('⚠️ Promotion Feature Locked!\n\nYou need an active Promotion Plan to promote your books.\n\nSubscribe to Promotion Plan to unlock this feature.');
        setShowSubscriptionModal(true);
        return;
      }

      if (!canAddMorePromotions()) {
        setLoading(false);
        alert('All promotion slots are currently full. Please wait for a promoted book to expire.');
        return;
      }
    }

    if (!currentUser.coins || currentUser.coins < (COIN_RATES?.MIN_COINS_TO_RECEIVE || 10)) {
      setLoading(false);
      alert(`You need at least ${COIN_RATES?.MIN_COINS_TO_RECEIVE || 10} coins to receive reviews on your book. Your current balance: ${currentUser.coins || 0} coins.`);
      return;
    }

    const shouldPromote = bookForm.isPromoted && 
                          currentUser?.promotionSubscription?.active && 
                          new Date(currentUser?.promotionSubscription?.expiresAt) > new Date();

    const promotedAt = shouldPromote ? new Date().toISOString() : null;
    const promotionExpiresAt = shouldPromote
      ? new Date(Date.now() + PROMOTION_DURATION_DAYS * 24 * 60 * 60 * 1000).toISOString()
      : null;

    // 🔧 FIXED: Now passing the actual base64 file data
    const result = await uploadBook({
      title: bookForm.title,
      author: bookForm.author,
      genre: bookForm.genre,
      description: bookForm.description,
      pageCount: parseInt(bookForm.pageCount, 10),
      amazonLink: bookForm.amazonLink,
      coinsRequired: coinsOffered,
      isPromoted: shouldPromote,
      promotedAt: promotedAt,
      promotionExpiresAt: promotionExpiresAt,
      promotionPaymentRef: currentUser?.promotionSubscription?.flutterwaveReference || null,
      coverImage: bookForm.coverImage,
      bookFileUrl: bookForm.bookFileUrl,     // Filename for display
      bookFileData: bookForm.bookFileData,   // 🔧 NEW: Base64 file data
      bookFileName: bookForm.bookFileName,   // 🔧 NEW: Original filename
      language: bookForm.language,
      isExplicit: bookForm.isExplicit,
      readerTypes: bookForm.readerTypes,
      keywords: bookForm.keywords,
      mainCharacters: bookForm.mainCharacters,
      targetCountries: bookForm.targetCountries || [],
      visibilityEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'pending'
    }, currentUser.id);

    setLoading(false);
    
    if (result.success) {
      setBookForm({
        title: '', author: '', genre: '', description: '', pageCount: '',
        amazonLink: '', isPromoted: false, coverImage: '', bookFileUrl: '',
        bookFileData: '', bookFileName: '', // 🔧 FIXED: Clear new fields too
        language: 'English', isExplicit: false, keywords: '',
        mainCharacters: '', coinsOffered: '', targetCountries: [],
        readerTypes: { standard: false, kindleUnlimited: false, verifiedPurchase: false }
      });
      setCoverImagePreview('');
      
      if (shouldPromote) {
        alert(`✅ Book submitted for approval and will be promoted!\n\nYour book will appear at the top for ${PROMOTION_DURATION_DAYS} days once approved.`);
      } else {
        alert('✅ Book submitted for approval!\n\nYou will be notified once approved (usually within 24 hours).');
      }
      
      onUploadSuccess();
    } else {
      alert('Failed to upload book: ' + result.error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Upload Your Book</h2>
        <div className="text-sm text-gray-600">
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
            New Book
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <div className="space-y-6">
          
          {/* Choose Your Readers Section */}
          <div>
            <h3 className="text-lg font-bold mb-3">Choose your readers</h3>
            <p className="text-sm text-gray-600 mb-4">
              Choose one or more of the options below. No matter which options you select, 
              all reviews are posted directly to Amazon by your readers.
            </p>

            <div className="space-y-3">
              {/* Standard Option */}
              <label className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition ${
                bookForm.readerTypes.standard ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
              }`}>
                <input
                  type="checkbox"
                  checked={bookForm.readerTypes.standard}
                  onChange={(e) => setBookForm(prev => ({
                    ...prev,
                    readerTypes: { ...prev.readerTypes, standard: e.target.checked }
                  }))}
                  className="w-5 h-5 mt-1"
                />
                <div className="flex-1">
                  <div className="font-semibold text-blue-600 mb-1">Standard</div>
                  <p className="text-sm text-gray-700 mb-2">
                    All readers can review your book using a free copy that you provide to read.
                  </p>
                  <p className="text-sm text-blue-600 font-medium">
                    Requires a PDF or ePub copy of your book
                  </p>
                </div>
              </label>

              {/* Kindle Unlimited Option */}
              <label className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition ${
                bookForm.readerTypes.kindleUnlimited ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300'
              }`}>
                <input
                  type="checkbox"
                  checked={bookForm.readerTypes.kindleUnlimited}
                  onChange={(e) => setBookForm(prev => ({
                    ...prev,
                    readerTypes: { ...prev.readerTypes, kindleUnlimited: e.target.checked }
                  }))}
                  className="w-5 h-5 mt-1"
                />
                <div className="flex-1">
                  <div className="font-semibold text-orange-600 mb-1">Kindle Unlimited</div>
                  <p className="text-sm text-gray-700 mb-2">
                    Readers with a Kindle Unlimited subscription can review your book. 
                    Your readers will read your book using Kindle Unlimited.
                  </p>
                  <p className="text-sm text-orange-600 font-medium">
                    Requires your book to be free for KU subscribers
                  </p>
                </div>
              </label>

              {/* Verified Purchase Option */}
              <label className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition ${
                bookForm.readerTypes.verifiedPurchase ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'
              }`}>
                <input
                  type="checkbox"
                  checked={bookForm.readerTypes.verifiedPurchase}
                  onChange={(e) => setBookForm(prev => ({
                    ...prev,
                    readerTypes: { ...prev.readerTypes, verifiedPurchase: e.target.checked }
                  }))}
                  className="w-5 h-5 mt-1"
                />
                <div className="flex-1">
                  <div className="font-semibold text-green-600 mb-1">Verified Purchases</div>
                  <p className="text-sm text-gray-700 mb-2">
                    Readers who agree to purchase your book on Amazon can review your book. 
                    Your readers will read your book using Kindle.
                  </p>
                  
                </div>
              </label>
            </div>
          </div>

          {/* Book File Upload (only show if Standard is selected) */}
          {bookForm.readerTypes.standard && (
            <div>
              <label className="block text-sm font-medium mb-2">
                📄 Upload Book File (PDF or ePub) *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition">
                <input
                  type="file"
                  accept=".pdf,.epub"
                  onChange={handleBookFileChange}
                  className="hidden"
                  id="bookFileInput"
                />
                <label htmlFor="bookFileInput" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-blue-600 font-medium mb-1">Drop files here to upload</p>
                  <p className="text-sm text-gray-500">Accepted file types: .epub, .pdf</p>
                  {bookForm.bookFileName && (
                    <p className="mt-3 text-sm text-green-600 font-medium">
                      ✅ {bookForm.bookFileName}
                    </p>
                  )}
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Your book copy will be securely encrypted and only made accessible to readers 
                who have already agreed to review your book.
              </p>
            </div>
          )}

          {/* Cover Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">
              📸 Front Cover *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition">
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.gif"
                onChange={handleCoverImageChange}
                className="hidden"
                id="coverImageInput"
              />
              <label htmlFor="coverImageInput" className="cursor-pointer">
                {coverImagePreview ? (
                  <div>
                    <img src={coverImagePreview} alt="Cover preview" className="max-h-48 mx-auto mb-3 rounded" />
                    <button
                      type="button"
                      onClick={() => {
                        setCoverImagePreview('');
                        setBookForm(prev => ({ ...prev, coverImage: '' }));
                      }}
                      className="text-red-600 text-sm underline"
                    >
                      Remove File
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-blue-600 font-medium mb-1">Drop files here to upload</p>
                    <p className="text-sm text-gray-500">Accepted file types: .jpg, .png, .gif</p>
                  </>
                )}
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Please provide the 2D image of your front cover only.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Book Title *</label>
            <input 
              value={bookForm.title} 
              onChange={(e) => setBookForm(prev => ({ ...prev, title: e.target.value }))} 
              className="w-full px-3 py-2 border rounded" 
              placeholder="Enter your book title"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Author *</label>
            <input 
              value={bookForm.author} 
              onChange={(e) => setBookForm(prev => ({ ...prev, author: e.target.value }))} 
              className="w-full px-3 py-2 border rounded" 
              placeholder="Author name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Amazon URL *</label>
            <input 
              value={bookForm.amazonLink} 
              onChange={(e) => setBookForm(prev => ({ ...prev, amazonLink: e.target.value }))} 
              className="w-full px-3 py-2 border rounded" 
              placeholder="https://amazon.com/dp/YOUR_BOOK_ID"
            />
            <p className="text-xs text-gray-500 mt-1">
              Example: https://www.amazon.com/Meditations-Marcus-Aurelius-ebook/dp/B08RYB957M/
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Genre *</label>
            <select 
              value={bookForm.genre} 
              onChange={(e) => setBookForm(prev => ({ ...prev, genre: e.target.value }))} 
              className="w-full px-3 py-2 border rounded"
            >
              <option value="">Select genre</option>
              <option>Fiction</option>
              <option>Non-Fiction</option>
              <option>Romance</option>
              <option>Mystery, Thriller & Suspense</option>
              <option>Science Fiction</option>
              <option>Fantasy</option>
              <option>Horror</option>
              <option>Historical</option>
              <option>Young Adult</option>
              <option>Children's Books</option>
              <option>Biography & Memoir</option>
              <option>Self-Help</option>
              <option>Business & Money</option>
            </select>
          </div>

          {/* Language Dropdown */}
          <div>
            <label className="block text-sm font-medium mb-1">Language *</label>
            <select 
              value={bookForm.language} 
              onChange={(e) => setBookForm(prev => ({ ...prev, language: e.target.value }))} 
              className="w-full px-3 py-2 border rounded"
            >
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
              <option>Dutch</option>
              <option>Italian</option>
              <option>Japanese</option>
              <option>Other</option>
            </select>
          </div>

          {/* Explicit Content Checkbox */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={bookForm.isExplicit}
                onChange={(e) => setBookForm(prev => ({ ...prev, isExplicit: e.target.checked }))}
                className="w-5 h-5"
              />
              <span className="text-sm font-medium">Explicit content?</span>
            </label>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Page Count *</label>
            <input 
              type="number" 
              value={bookForm.pageCount} 
              onChange={(e) => setBookForm(prev => ({ ...prev, pageCount: e.target.value }))} 
              className="w-full px-3 py-2 border rounded" 
              min="1" 
              placeholder="Number of pages"
            />
          </div>

          <BookCountrySelector
            selectedCountries={bookForm.targetCountries}
            onChange={(countries) => setBookForm(prev => ({ 
              ...prev, 
              targetCountries: countries 
            }))}
          />

          <div>
            <label className="block text-sm font-medium mb-1">
              Coins to Pay Reviewer * 
              <span className="text-gray-500 text-xs ml-2">(How many coins will you pay per review?)</span>
            </label>
            <input 
              type="number" 
              value={bookForm.coinsOffered || ''} 
              onChange={(e) => setBookForm(prev => ({ ...prev, coinsOffered: e.target.value }))} 
              className="w-full px-3 py-2 border rounded" 
              min="5"
              placeholder="e.g., 10, 15, 20..."
            />
            <p className="text-xs text-gray-500 mt-1">
              💡 Higher coins attract more reviewers! Minimum: 5 coins
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Book Summary *</label>
            <textarea 
              value={bookForm.description} 
              onChange={(e) => setBookForm(prev => ({ ...prev, description: e.target.value }))} 
              rows="4" 
              className="w-full px-3 py-2 border rounded" 
              placeholder="If you'd like, please add a brief summary of your book." 
            />
            <p className="text-xs text-gray-500 mt-1">
              Word count: {bookForm.description.trim().split(/\s+/).filter(w => w).length}/10 
              {bookForm.description.trim().split(/\s+/).filter(w => w).length > 10 ? 
                <span className="text-red-600 ml-1">⚠ Exceeds limit!</span> : 
                <span className="text-green-600 ml-1">✓</span>
              }
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Keywords (optional)</label>
            <input 
              value={bookForm.keywords} 
              onChange={(e) => setBookForm(prev => ({ ...prev, keywords: e.target.value }))} 
              className="w-full px-3 py-2 border rounded" 
              placeholder="e.g., adventure, mystery, romance"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Main Characters (optional)</label>
            <textarea 
              value={bookForm.mainCharacters} 
              onChange={(e) => setBookForm(prev => ({ ...prev, mainCharacters: e.target.value }))} 
              rows="2" 
              className="w-full px-3 py-2 border rounded" 
              placeholder="Brief description of main characters"
            />
          </div>

          {/* Promotion Option */}
          <div>
            <label className="block text-sm font-medium mb-1">Promote Your Book (Optional)</label>
            
            {currentUser?.promotionSubscription?.active && 
             new Date(currentUser?.promotionSubscription?.expiresAt) > new Date() ? (
              <>
                {getActivePromotedBooks().length < MAX_PROMOTED_BOOKS ? (
                  <label className="flex items-center gap-2 bg-purple-50 p-3 rounded border-2 border-purple-200 cursor-pointer hover:bg-purple-100 transition">
                    <input 
                      type="checkbox" 
                      checked={bookForm.isPromoted} 
                      onChange={(e) => setBookForm(prev => ({ ...prev, isPromoted: e.target.checked }))} 
                      className="w-5 h-5"
                    />
                    <div>
                      <div className="font-semibold text-purple-800">
                        ✨ Promote this book (FREE with your plan)
                      </div>
                      <div className="text-xs text-purple-600">
                        Your book will appear at the top for {PROMOTION_DURATION_DAYS} days
                      </div>
                    </div>
                  </label>
                ) : (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded text-sm">
                    ⚠️ All {MAX_PROMOTED_BOOKS} promotion slots are currently full. Please wait for a promoted book to expire.
                  </div>
                )}
              </>
            ) : (
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <input 
                    type="checkbox" 
                    disabled
                    className="w-5 h-5 mt-1 opacity-50 cursor-not-allowed"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-700 mb-1">
                      🔒 Promotion Feature Locked
                    </div>
                    <div className="text-sm text-gray-600 mb-3">
                      Subscribe to Promotion Plan to feature your book at the top and get more reviews!
                    </div>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        setShowSubscriptionModal(true);
                      }}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition"
                    >
                      🚀 Subscribe to Promotion Plan
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-amber-50 p-3 rounded">
            <div className="text-sm"><strong>Your balance:</strong> {currentUser?.coins} coins</div>
          </div>

          <button 
            onClick={handleBookUpload} 
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg font-semibold"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Submitting for Approval...</span>
              </>
            ) : (
              'SUBMIT FOR APPROVAL'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadBookForm;
