import React, { useState } from "react";
import { motion } from "framer-motion";
import { GiCardJoker } from "react-icons/gi";

// Placeholder for location cards
const locations = Array.from({ length: 13 }, (_, i) => ({
  id: i + 1,
  name: `Location ${i + 1}`,
  image: null,
  submitted: false,
  placeholderImage:
    "https://imgs.search.brave.com/1_cKyTdSLoq4_IDgHYWkVuZr94wzMBjbBFtxMeBABLk/rs:fit:860:0:0:0/g:ce/aHR0cDovL2xnaW1h/Z2VzLnMzLmFtYXpv/bmF3cy5jb20vZGF0/YS9pbWFnZW1hbmFn/ZXIvNzU2NS9wdXp6/bGUzMDAuanBn",
}));

const Homepage = () => {
  const [teamName, setTeamName] = useState("Team Shadow");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [image, setImage] = useState(null);
  const [locationsData, setLocationsData] = useState(locations);
  const [notification, setNotification] = useState("");
  const [redBackgroundLocation, setRedBackgroundLocation] = useState(null); // State to manage the red background for submitted locations
  const [isImageZoomed, setIsImageZoomed] = useState(false); // State to toggle image zoom

  // Handle image upload
  const handleImageUpload = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = (locationId) => {
    const updatedLocations = locationsData.map((location) =>
      location.id === locationId
        ? { ...location, submitted: true }
        : location
    );
    setLocationsData(updatedLocations);
    setNotification("Image successfully uploaded!");
    setTimeout(() => setNotification(""), 3000); // Hide notification after 3 seconds
    setSelectedLocation(null); // Close modal
  };

  const handleCardClick = (location) => {
    if (location.submitted) {
      setRedBackgroundLocation(location.id);
      setNotification("You can only submit an image once for each location.");
      setTimeout(() => {
        setRedBackgroundLocation(null); // Remove the red background after 3 seconds
        setNotification(""); // Clear the notification
      }, 3000);
      return; // Don't open the modal
    }
    setSelectedLocation(location);
  };

  const handleCloseModal = () => {
    setSelectedLocation(null);
    setImage(null);
    setIsImageZoomed(false); // Reset zoom when closing the modal
  };

  // Calculate submitted and not submitted counts
  const submittedCount = locationsData.filter((location) => location.submitted).length;
  const notSubmittedCount = locationsData.length - submittedCount;

  const handleImageClick = () => {
    setIsImageZoomed(!isImageZoomed); // Toggle zoom on image click
  };

  const handleImageContextMenu = (event) => {
    event.preventDefault(); // Prevent right-click context menu
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Welcome, {teamName}</h1>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold">
          Submitted: {submittedCount} | Not Submitted: {notSubmittedCount}
        </h2>
      </div>

      {notification && (
        <div className="fixed top-0 left-0 w-full p-4 bg-red-700 text-white text-center z-50">
          {notification}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {locationsData.map((location) => (
          <motion.div
            key={location.id}
            className={`relative p-6 rounded-lg shadow-lg cursor-pointer transition ${
              redBackgroundLocation === location.id
                ? "bg-red-600"
                : "bg-gray-800"
            }`}
            onClick={() => handleCardClick(location)}
            style={{ maxWidth: "400px", margin: "0 auto" }}
          >
            <div
              className={`absolute top-2 right-2 text-5xl ${
                location.submitted ? "text-green-500" : "text-red-500"
              }`}
            >
              <GiCardJoker />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold">{location.name}</h3>
              <div className="mt-2">
                {/* Image on the card */}
                <img
                  src={location.placeholderImage}
                  alt="Location"
                  className="w-full h-64 object-cover rounded-md"
                  onContextMenu={handleImageContextMenu} // Disable right-click on the card image
                  draggable="false" // Disable dragging the image
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal for Image Upload */}
      {selectedLocation && !selectedLocation.submitted && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">
                {selectedLocation.name}
              </h2>
              <button className="text-white" onClick={handleCloseModal}>
                &times;
              </button>
            </div>

            {/* Enlarged Image with Zoom Effect */}
            <div
              className={`w-full mb-4 overflow-hidden cursor-pointer ${
                isImageZoomed ? "scale-150 transition-transform" : "scale-100"
              }`}
              onClick={handleImageClick}
            >
              <img
                src={selectedLocation.placeholderImage}
                alt="Enlarged Location"
                className="w-full h-auto object-cover rounded-lg transition-transform duration-300"
                onContextMenu={handleImageContextMenu} // Disable right-click on the enlarged image
                draggable="false" // Disable dragging the image
              />
            </div>

            <input
              type="file"
              onChange={handleImageUpload}
              className="w-full mb-4 p-2 bg-gray-800 text-white rounded-lg"
            />
            <div className="flex justify-end">
              <button
                onClick={() => handleSubmit(selectedLocation.id)}
                className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Homepage;