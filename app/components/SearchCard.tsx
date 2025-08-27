"use client";
import { useState, useRef } from "react";
import { db } from "@/firebaseConfig"; // আপনার path ঠিক করুন
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";

interface Choice {
  choice_number: number;
  department: string;
  result: string;
}

interface Student {
  id: string;
  choices: Choice[];
}

export default function SearchCard() {
  const [roll, setRoll] = useState("");
  const [result, setResult] = useState<Student | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [adminMode, setAdminMode] = useState(false);
  const [password, setPassword] = useState("");
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAdminLogin = () => {
    if (password === "admin123") {
      setAdminMode(true);
      setShowAdminLogin(false);
      setPassword("");
    } else {
      setError("Wrong password");
    }
  };

  const handleAdminLogout = () => {
    setAdminMode(false);
  };

  // 🔹 CSV Upload → Firestore এ Save
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        if (file.name.endsWith(".csv")) {
          const lines = content.split("\n");
          let count = 0;

          for (const line of lines) {
            if (!line.trim()) continue;
            const values = line.split(",").map((v) => v.trim());

            if (values.length > 1) {
              const studentData: Student = {
                id: values[0],
                choices: [],
              };

              for (let i = 1; i < values.length; i += 2) {
                if (values[i] && values[i + 1]) {
                  studentData.choices.push({
                    choice_number: studentData.choices.length + 1,
                    department: values[i],
                    result: values[i + 1],
                  });
                }
              }

              await addDoc(collection(db, "results"), studentData);
              count++;
            }
          }

          alert(`File uploaded successfully! ${count} records saved to Firebase`);
        } else {
          alert("Only CSV files are supported");
        }
      } catch (err) {
        setError("Error reading file");
      }
    };

    reader.readAsText(file);
  };

  // 🔹 Roll দিয়ে Firestore থেকে Search
  const handleSearch = async () => {
    if (!roll) {
      setError("Please enter a roll number");
      setResult(null);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const q = query(collection(db, "results"), where("id", "==", roll));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const data = querySnapshot.docs[0].data() as Student;
        setResult(data);
      } else {
        setError("No result found for this roll number");
      }
    } catch {
      setError("Search error");
    } finally {
      setLoading(false);
    }
  };

  const getResultBadge = (result: string) =>
    result.includes("ACCEPTED")
      ? "text-green-600 font-bold"
      : "text-red-600 font-bold";

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center bg-blue-800 p-5 text-white">
        <h1 className="text-xl font-bold">Test Pass Number</h1>
        {adminMode ? (
          <button
            onClick={handleAdminLogout}
            className="px-3 py-1 bg-red-600 text-white rounded text-sm"
          >
            Admin Logout
          </button>
        ) : (
          <button
            onClick={() => setShowAdminLogin(true)}
            className="px-3 py-1 bg-gray-600 text-white rounded text-sm"
          >
            Admin Login
          </button>
        )}
      </div>

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div className="fixed inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-80">
            <h2 className="text-xl font-bold mb-4">Admin Login</h2>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
              onKeyPress={(e) => e.key === "Enter" && handleAdminLogin()}
            />
            <div className="flex gap-2">
              <button
                onClick={handleAdminLogin}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded"
              >
                Login
              </button>
              <button
                onClick={() => setShowAdminLogin(false)}
                className="flex-1 px-4 py-2 bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin File Upload */}
      {adminMode && (
        <div className="p-4 bg-blue-50 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            Upload Result File (Admin)
          </h2>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".csv"
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
      )}

      {/* Search Section */}
      <div className="p-5 bg-gray-50 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">
          Q. SEARCH RESULTS
        </h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter Roll Number"
            value={roll}
            onChange={(e) => {
              setRoll(e.target.value);
              if (!e.target.value) setResult(null);
            }}
            className="flex-1 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white text-gray-900"
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
          >
            {loading ? "..." : "Search"}
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="p-5">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Your Results</h2>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-center text-red-600">
            {error}
          </div>
        )}
        {!result && !error && !loading && (
          <div className="text-center py-8 text-gray-500">
            Enter your roll number and click Search to see results
          </div>
        )}
        {result && (
          <div className="space-y-1">
            <div className="text-center mb-5">
              <span className="text-sm text-gray-500">Test Pass: </span>
              <span className="text-lg font-bold text-blue-600">{result.id}</span>
            </div>
            {result.choices.map((choice) => (
              <div
                key={choice.choice_number}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  <span className="text-lg mr-2">●</span>
                  <div>
                    <span className="font-semibold text-gray-700">
                      {choice.choice_number === 1
                        ? "1ST"
                        : choice.choice_number === 2
                        ? "2ND"
                        : choice.choice_number === 3
                        ? "3RD"
                        : "4TH"}{" "}
                      CHOICE
                    </span>
                    <p className="text-sm text-gray-600">
                      {choice.department}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-sm ${getResultBadge(choice.result)}`}>
                  ● {choice.result || "N/A"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
