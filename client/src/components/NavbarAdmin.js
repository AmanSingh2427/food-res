import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import axios from 'axios';
import reactLogo from '../images/image2.png'; // Update this path with the actual path to your logo

const NavbarAdmin = ({ toggleTableDisplay, setFilteredProducts }) => {
  const username = localStorage.getItem('username');
  const userImage = localStorage.getItem('userImage');
  const [pendingUsers, setPendingUsers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showCategories, setShowCategories] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/pending-registrations', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setPendingUsers(response.data);
      } catch (err) {
        console.error('Error fetching pending users:', err);
      }
    };
    fetchPendingUsers();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/categories', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setCategories(response.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userImage');
    window.location.href = '/login';
  };

  const handleOrderRequestsClick = () => {
    navigate('/order-request');
  };

  const handleCategoryClick = async (category) => {
    try {
      const response = await axios.get(`http://localhost:5000/products/category/${category}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setFilteredProducts(response.data);
    } catch (err) {
      console.error('Error fetching category products:', err);
    }
    setShowCategories(false); // Close the dropdown after selecting a category
  };

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
    if (event.target.value) {
      setShowCategories(true);
    } else {
      setShowCategories(false);
    }
  };

  const handleLogoClick = () => {
    navigate('/adminhome');
  };

  return (
    <nav className="bg-gray-800 p-4 w-full">
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <div className="p-1">
            <img
              src={reactLogo}
              className="h-12 w-auto cursor-pointer"
              alt="React logo"
              onClick={handleLogoClick}
            />
          </div>
        </div>
        <div className="flex space-x-4 items-center">
          {username ? (
            <>
              <img
                src={userImage ? `http://localhost:5000/${userImage}` : "default-image-url"}
                alt="User profile"
                className="w-8 h-8 rounded-full"
              />
              <span className="text-white">{username}</span>
              <div className="relative">
                <button
                  onClick={() => {
                    toggleTableDisplay();
                    setShowDropdown(!showDropdown);
                  }}
                  onMouseEnter={() => setShowDropdown(true)}
                  onMouseLeave={() => setShowDropdown(false)}
                  className="relative"
                >
                  <FaBell className="text-white" />
                  {pendingUsers.length > 0 && (
                    <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-600 rounded-full"></span>
                  )}
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
                    <ul>
                      {pendingUsers.length > 0 ? (
                        pendingUsers.map(user => (
                          <li key={user.id} className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                            {user.username} ({user.email})
                          </li>
                        ))
                      ) : (
                        <li className="px-4 py-2 text-sm text-gray-700">No pending requests</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="text-red-400 hover:text-red-700 transition-colors w-auto"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="text-white">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavbarAdmin;
