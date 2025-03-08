import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaSkull } from "react-icons/fa";
import {
  GiCardJoker,
  GiDeathSkull,
  GiBloodySword,
  GiSpades,
} from "react-icons/gi";

import { auth } from "../firebaseConfig";  // Import auth from firebaseConfig.js
import { signInWithEmailAndPassword } from "firebase/auth"; // Import directly from firebase/auth



const teams = [
  { teamName: "Alpha", password: "alpha123", teamNumber: "1", email: "team1@example.com" },
  { teamName: "Beta", password: "beta123", teamNumber: "2", email: "team2@example.com" },
  { teamName: "Gamma", password: "gamma123", teamNumber: "3", email: "team3@example.com" },
  { teamName: "Delta", password: "delta123", teamNumber: "4", email: "team4@example.com" },
  { teamName: "Epsilon", password: "epsilon123", teamNumber: "5", email: "team5@example.com" },
];


const BloodDrop = ({ className, style }) => (
  <svg viewBox="0 0 30 40" className={className} style={style}>
    <path
      d="M15 0
         C15 0, 30 25, 30 33
         C30 37, 23 40, 15 40
         C7 40, 0 37, 0 33
         C0 25, 15 0, 15 0 Z"
      fill="currentColor"
    />
  </svg>
);

const LoginPage = () => {
  const navigate = useNavigate();
  const [isFlipped, setIsFlipped] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [password, setPassword] = useState("");
  const [teamNumber, setTeamNumber] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [bloodDrops, setBloodDrops] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFlipped(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Generate blood drops with more natural variations
  useEffect(() => {
    const drops = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 2,
      duration: 4 + Math.random() * 2, // Slower, more natural fall
      size: 15 + Math.random() * 20, // More consistent drop sizes
      scaleY: 1 + Math.random() * 0.3, // Slight vertical stretch
      rotation: -5 + Math.random() * 10, // Slight tilt
      color: `rgba(${160 + Math.random() * 50}, 0, 0, ${
        0.8 + Math.random() * 0.2
      })`, // Deeper red with high opacity
    }));
    setBloodDrops(drops);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const team = teams.find((t) => t.teamName === teamName && t.password === password && t.teamNumber === teamNumber);

    if (!team) {
      setError("Invalid Team Name, Password, or Team Number");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, team.email, password);
      navigate("/home");
    } catch (error) {
      setError("Authentication Failed!");
    }
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Blood Drops */}
      {bloodDrops.map((drop) => (
        <motion.div
          key={drop.id}
          className="absolute"
          style={{
            left: drop.left,
            top: -drop.size,
            width: drop.size,
            height: drop.size * 1.3, // Make drops slightly elongated
            color: drop.color,
            filter: "blur(0.3px)", // Slight blur for realism
          }}
          animate={{
            y: ["0vh", "120vh"],
            scaleY: [drop.scaleY, drop.scaleY * 1.2, drop.scaleY], // Subtle stretching animation
            rotate: [drop.rotation, drop.rotation], // Maintain consistent tilt
          }}
          transition={{
            duration: drop.duration,
            repeat: Infinity,
            delay: drop.delay,
            ease: [0.5, 0.05, 0.9, 0.95], // Custom ease for natural acceleration
            scaleY: {
              duration: 0.8,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        >
          <BloodDrop />
        </motion.div>
      ))}

      {/* Main container with perspective */}
      <div className="flex items-center justify-center  py-8 px-4">
        <div
          className="relative w-full max-w-md h-[600px]"
          style={{ perspective: "2000px" }}
        >
          {/* Card container with 3D flip */}
          <motion.div
            className="relative w-full h-full"
            initial={false}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 1.5, type: "spring", stiffness: 50 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Front of card (Ace of Spades) */}
            <div
              className="absolute w-full h-full backface-hidden bg-white rounded-xl border-8 border-black p-8"
              style={{ backfaceVisibility: "hidden" }}
            >
              <div className="flex flex-col items-center justify-between h-full">
                <div className="flex flex-col items-center">
                  <GiSpades className="text-6xl" />
                  <div className="text-4xl font-bold mt-2">A</div>
                </div>

                <motion.div
                  className="flex-1 flex items-center justify-center"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                >
                  <GiSpades className="text-[200px]" />
                </motion.div>

                <div className="flex flex-col items-center rotate-180">
                  <div className="text-4xl font-bold">A</div>
                  <GiSpades className="text-6xl" />
                </div>
              </div>
            </div>

            {/* Back of card (Login Form) */}
            <div
              className="absolute w-full h-full backface-hidden bg-gray-900 rounded-xl border-2 border-red-800 p-8 shadow-[0_0_15px_rgba(220,38,38,0.5)] overflow-y-auto"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              {/* Title */}
              <motion.div
                className="text-center mb-6"
                animate={{
                  textShadow: ["0 0 8px #ef4444", "0 0 16px #ef4444"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
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

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-center text-red-500 mb-4 flex items-center justify-center gap-2"
                  >
                    
                    <span>{error} </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Team Name Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Team Name
                  </label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border-2 border-red-800/50 rounded-lg text-white focus:border-red-600 focus:ring-2 focus:ring-red-600 transition-colors"
                    placeholder="Enter your team name"
                  />
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border-2 border-red-800/50 rounded-lg text-white focus:border-red-600 focus:ring-2 focus:ring-red-600 transition-colors"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      {showPassword ? (
                        <FaEyeSlash size={20} />
                      ) : (
                        <FaEye size={20} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Team Number Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Team Number
                  </label>
                  <input
                    type="number"
                    value={teamNumber}
                    onChange={(e) => setTeamNumber(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border-2 border-red-800/50 rounded-lg text-white focus:border-red-600 focus:ring-2 focus:ring-red-600 transition-colors"
                    placeholder="Enter your team number"
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 mt-6 bg-gradient-to-r from-red-700 to-red-900 text-white rounded-lg font-bold text-lg shadow-lg shadow-red-900/50 flex items-center justify-center gap-2 hover:from-red-800 hover:to-red-950 transition-all"
                >
                  <GiBloodySword className="text-xl" />
                  Enter the Game
                </motion.button>

                {/* Below the "Enter the Game" Button */}
                <div className="mt-4 text-center text-gray-400">
                  <motion.div
                    className="text-l font-semibold text-red-500"
                    animate={{
                      opacity: [0.5, 1, 0.5],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  >
                    <span className="flex justify-center items-center gap-2">
                      <span>Will you survive this game of fate?</span>
                    </span>
                    <span className="flex justify-center items-center gap-2">
                      <span>Refuse to participate, and death will be your reward!</span>
                    </span>
                  </motion.div>
                </div>

                
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
