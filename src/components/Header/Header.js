import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../../firebase/config';
import { collection, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [products, setProducts] = useState([]);
  const searchBoxRef = useRef(null);
  const profileMenuRef = useRef(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productsList = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(product => product.visibility === true);
      setProducts(productsList);
    };

    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length > 0) {
      // Filter suggestions based on search term
      const filteredSuggestions = products.filter(product =>
        product.title.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5); // Limit suggestions to 5
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleKeyPress = async (e) => {
    if (e.key === 'Enter') {
      await performSearch();
    }
  };

  const handleSearchClick = async () => {
    await performSearch();
  };

  const performSearch = async () => {
    navigate(`/search-results?search=${searchTerm}`);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.title);
    navigate(`/search-results?search=${suggestion.title}`);
    setSuggestions([]);
  };

  const handleClickAway = () => {
    setSuggestions([]);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full bg-gradient-to-r from-[#131921] to-[#232f3e] shadow-xl z-50">
      <div className="container mx-auto flex items-center py-2 px-4">
        <Link to="/" className="flex-shrink-0 transform hover:scale-105 transition-transform duration-200 mr-4">
          <img src="/image/logo.jpg" alt="logo" className="h-8 w-auto rounded-lg" />
        </Link>
        
        <nav className="flex items-center justify-between flex-1">
          <div className="relative flex-1 mx-4" ref={searchBoxRef} onBlur={handleClickAway}>
            <form className="flex items-center w-[500px] border border-yellow-400 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
              <select className="px-4 py-2 bg-gray-100 border-r border-gray-300 text-sm focus:outline-none cursor-pointer hover:bg-gray-200 transition-colors duration-200">
                <option value="all">All Categories</option>
                <option value="fiction">Fiction</option>
                <option value="non-fiction">Non-Fiction</option>
                <option value="science-fiction">Science-Fiction</option>
                <option value="history">History</option>
                <option value="fantasy">Fantasy</option>
                <option value="competitive-books">Competitive Books</option>
                <option value="self-help">Self-help</option>
                <option value="children">Children's Books</option>
                <option value="bio-auto">Biography/Autobiography</option>
              </select>
              <input
                type="text"
                className="w-full px-4 py-2.5 focus:outline-none text-gray-700 placeholder-gray-400"
                placeholder="Search for books, authors, or ISBN..."
                value={searchTerm}
                onChange={handleSearch}
                onKeyPress={handleKeyPress}
              />
              <button
                type="button"
                className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-gray-700 transition-colors duration-200 flex items-center"
                onClick={handleSearchClick}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              {suggestions.length > 0 && (
                <ul className="absolute top-full left-0 right-0 bg-white border rounded-xl mt-2 shadow-xl z-50">
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="px-6 py-3 hover:bg-blue-50 cursor-pointer transition-colors duration-200 text-gray-700"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion.title}
                    </li>
                  ))}
                </ul>
              )}
            </form>
          </div>
          
          <div className="flex items-center justify-center space-x-8 flex-1 mx-8">
            <Link to="/" className="text-white hover:text-yellow-400 font-medium transition-colors duration-200 flex items-center space-x-1 whitespace-nowrap">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Home</span>
            </Link>
            <div className="relative group">
              <button className="text-white hover:text-yellow-400 font-medium transition-colors duration-200 flex items-center space-x-1">
                <span>Categories</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link to="/products?category=fiction" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200">Fiction</Link>
                <Link to="/products?category=non-fiction" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200">Non-Fiction</Link>
                <Link to="/products?category=children" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200">Children's Books</Link>
                <Link to="/products?category=academic" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200">Academic</Link>
              </div>
            </div>
            <Link to="/deals" className="text-white hover:text-yellow-400 font-medium transition-colors duration-200 flex items-center space-x-1 whitespace-nowrap">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
              <span>Deals</span>
            </Link>
            <Link to="/about-us" className="text-white hover:text-yellow-400 font-medium transition-colors duration-200 flex items-center space-x-1 whitespace-nowrap">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>About Us</span>
            </Link>
          </div>
          
          <div className="relative" ref={profileMenuRef}>
            <button 
              onClick={toggleProfileMenu}
              className="flex items-center space-x-2 text-white hover:text-blue-200 transition-colors duration-200 p-2 rounded-full hover:bg-[#2C3E50]/30"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <div className={`${isProfileMenuOpen ? 'block' : 'hidden'} absolute right-0 mt-2 w-72 bg-white border rounded-xl shadow-xl transform transition-all duration-200 ease-out`}>
              <div className="p-4 border-b">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white text-xl font-semibold">
                    {currentUser ? currentUser.displayName?.charAt(0).toUpperCase() || currentUser.email?.charAt(0).toUpperCase() : 'GU'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{currentUser ? currentUser.displayName || 'User' : 'Guest User'}</p>
                    <p className="text-xs text-gray-500">{currentUser ? currentUser.email : 'guest@example.com'}</p>
                  </div>
                </div>
              </div>
              <div className="p-2 space-y-1">
                <Link to="/user-login" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors duration-200 flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span>Login</span>
                </Link>
                <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors duration-200 flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Profile Settings</span>
                </Link>
                <Link to="/cart" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors duration-200 flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>Cart</span>
                </Link>
                <Link to="/wishlist" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors duration-200 flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>Wishlist</span>
                </Link>
                <Link to="/order-history" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors duration-200 flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span>Order History</span>
                </Link>
                <div className="border-t my-2"></div>
                <button className="w-full px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors duration-200 flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Logout</span>
                </button> 
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;