import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GiCardJoker } from "react-icons/gi";
import spade from "../assets/spade.png";
import data from "../assets/data.json"; // Import JSON data

const SpadeIcon = ({ filled, size }) => {
  return (
    <img
      src={spade}
      alt="Spade Icon"
      style={{
        width: size,
        height: size,
        filter: filled
          ? "invert(36%) sepia(89%) saturate(7482%) hue-rotate(358deg) brightness(91%) contrast(102%)"
          : "grayscale(100%) invert(10%) brightness(500%)",
      }}
      className="mx-0.5"
    />
  );
};

const Homepage = () => {
  const [locations, setLocations] = useState([]);
  const [teamName, setTeamName] = useState("Team Shadow");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [image, setImage] = useState(null);
  const [notification, setNotification] = useState("");
  const [redBackgroundLocation, setRedBackgroundLocation] = useState(null);
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  useEffect(() => {
    setLocations(data.map((location) => ({ ...location, submitted: false })));
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        setNotification("File size exceeds 2MB. Please upload a smaller file.");
        setImage(null);
      } else {
        setImage(file);
        setNotification("");
      }
    }
  };

  const handleSubmit = (locationId) => {
    if (!image) {
      setNotification("No image uploaded.");
      return;
    }
    const updatedLocations = locations.map((location) =>
      location.id === locationId ? { ...location, submitted: true } : location
    );
    setLocations(updatedLocations);
    setNotification("Image successfully uploaded!");
    setTimeout(() => setNotification(""), 3000);
    setSelectedLocation(null); // Close modal after submit
  };

  const handleCardClick = (location) => {
    if (location.submitted) {
      setRedBackgroundLocation(location.id);
      setNotification("You can only submit an image once for each location.");
      setTimeout(() => {
        setRedBackgroundLocation(null);
        setNotification("");
      }, 3000);
      return;
    }
    setSelectedLocation(location);
  };

  const handleCloseModal = () => {
    setSelectedLocation(null);
    setImage(null);
    setIsImageZoomed(false); // Reset zoom when closing the modal
  };

  // const handleImageClick = () => {
  //   setIsImageZoomed(!isImageZoomed); // Toggle zoom on image click
  // };

  const handleImageContextMenu = (event) => {
    event.preventDefault(); // Prevent right-click context menu
  };

  const submittedCount = locations.filter((loc) => loc.submitted).length;
  const notSubmittedCount = locations.length - submittedCount;

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6">
      <motion.div
        className="text-center mb-6"
        animate={{ textShadow: ["0 0 8px #ef4444", "0 0 16px #ef4444"] }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
      >
        <h2 className="text-2xl font-bold text-white mb-2">
          TSEC Code <span className="text-red-600">Tantra</span>
        </h2>
        <div className="flex items-center justify-center gap-2 text-3xl font-extrabold">
          <GiCardJoker className="text-red-600" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-800">
            Decked Out
          </span>
          <GiCardJoker className="text-red-600" />
        </div>
      </motion.div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-red-600">Welcome, {teamName}</h1>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold">
          Submitted: {submittedCount} | Not Submitted: {notSubmittedCount}
        </h2>
      </div>

      {notification && (
        <div className="fixed top-0 left-0 w-full p-4 bg-red-800 text-white text-center z-50">
          {notification}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {locations.map((location) => (
          <motion.div
            key={location.id}
            className={`relative p-6 rounded-lg shadow-lg cursor-pointer transition transform ${
              redBackgroundLocation === location.id
                ? "bg-red-800"
                : "bg-gray-800"
            } border-2 ${
              location.submitted ? "border-green-500" : "border-red-600"
            }`}
            onClick={() => handleCardClick(location)}
          >
            <div className="flex items-center justify-between mb-2">
              <div
                className={`text-white text-sm font-bold px-2 py-1 rounded-md shadow-md ${
                  location.submitted ? "bg-green-500" : "bg-red-600"
                }`}
              >
                #{location.id}
              </div>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, index) => (
                  <SpadeIcon
                    key={index}
                    filled={index < location.difficulty}
                    size="1.7rem"
                  />
                ))}
              </div>
              <GiCardJoker
                className={`text-5xl ${
                  location.submitted ? "text-green-500" : "text-red-600"
                }`}
              />
            </div>
            <img
              src={location.image}
              alt={location.name}
              className="w-full h-auto max-h-[500px] object-cover rounded-md"
            />
          </motion.div>
        ))}
      </div>

      {/* Modal for Image Upload - This part was missing */}
      {selectedLocation && !selectedLocation.submitted && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-3">
          <div className="bg-gray-900 p-4 sm:p-6 rounded-lg shadow-lg w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                {selectedLocation.name}
              </h2>
              <button
                className="text-white text-2xl sm:text-3xl"
                onClick={handleCloseModal}
              >
                &times;
              </button>
            </div>

            {/* Notification inside the modal */}
            {notification && (
              <div className="mb-3 sm:mb-4 p-2 text-white bg-red-600 text-center rounded-lg">
                {notification}
              </div>
            )}

            {/* Enlarged Image with Zoom Effect */}
            <div
              className={`w-full mb-3 sm:mb-4 overflow-hidden flex justify-center cursor-pointer ${
                isImageZoomed ? "scale-150 transition-transform" : "scale-100"
              }`}
              // onClick={handleImageClick}
            >
              <img
                src={selectedLocation.image}
                alt="Enlarged Location"
                className="w-4/5 h-auto max-h-[50vh] object-contain rounded-lg transition-transform duration-300"
                onContextMenu={handleImageContextMenu}
                draggable="false"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <input
                type="file"
                onChange={handleImageUpload}
                className="w-full sm:w-4/5 p-2 bg-gray-700 text-white rounded-lg text-sm"
                accept="image/*"
              />

              {/* Submit button disabled if image size is too large */}
              <div className="w-full sm:w-auto">
                <button
                  onClick={() => handleSubmit(selectedLocation.id)}
                  className={`w-full sm:w-auto bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition ${
                    !image || notification
                      ? "cursor-not-allowed opacity-50"
                      : ""
                  }`}
                  disabled={!image || notification}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Homepage;
