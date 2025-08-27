"use client";

import { useState, useRef, useEffect } from "react";

export default function SearchCard() {
  const [roll, setRoll] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [adminMode, setAdminMode] = useState(false);
  const [password, setPassword] = useState("");
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [fileData, setFileData] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // লোকাল স্টোরেজ থেকে ডেটা লোড
  useEffect(() => {
    const savedData = localStorage.getItem("resultData");
    if (savedData) {
      setFileData(JSON.parse(savedData));
    }
  }, []);

  // অ্যাডমিন লগিন
  const handleAdminLogin = () => {
    if (password === "admin123") {
      setAdminMode(true);
      setShowAdminLogin(false);
      setPassword("");
    } else {
      setError("Wrong password");
    }
  };

  // অ্যাডমিন লগআউট
  const handleAdminLogout = () => {
    setAdminMode(false);
  };

  // CSV আপলোড হ্যান্ডলার
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        if (file.name.endsWith(".csv")) {
          const lines = content.split("\n");
          const data = [];

          for (const line of lines) {
            if (!line.trim()) continue;
            const values = line.split(",").map((v) => v.trim());

            if (values.length >= 9) {
              // Format 1
              data.push({
                id: values[0],
                choices: [
                  { choice_number: 1, department: values[1], result: values[2] },
                  { choice_number: 2, department: values[3], result: values[4] },
                  { choice_number: 3, department: values[5], result: values[6] },
                  { choice_number: 4, department: values[7], result: values[8] },
                ],
              });
            } else if (values.length >= 5) {
              // Format 2
              const choices = [];
              for (let i = 1; i < values.length; i += 2) {
                if (values[i] && values[i + 1]) {
                  choices.push({
                    choice_number: choices.length + 1,
                    department: values[i],
                    result: values[i + 1],
                  });
                }
              }
              data.push({ id: values[0], choices });
            }
          }

          setFileData(data);
          localStorage.setItem("resultData", JSON.stringify(data));
          alert(`File uploaded successfully! ${data.length} records loaded`);
        } else {
          alert("Only CSV files are supported");
        }
      } catch (err) {
        setError("Error reading file: " + err);
      }
    };

    reader.readAsText(file);
  };

  // Roll search
  const handleSearch = () => {
    if (!roll) {
      setError("Please enter a roll number");
      setResult(null);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      if (fileData.length > 0) {
        const foundResult = fileData.find((item) => item.id === roll);
        if (foundResult) {
          setResult(foundResult);
        } else {
          setError("No result found for this roll number");
        }
      } else {
        setError("No result data available. Please upload a result file first.");
      }
    } catch (err) {
      setError("Search error: " + err);
    } finally {
      setLoading(false);
    }
  };

  // Badge color
  const getResultBadge = (result: string) => {
    if (result && result.includes("ACCEPTED")) {
      return "text-green-600 font-bold";
    } else {
      return "text-red-600 font-bold";
    }
  };

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

      {/* Admin login modal */}
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

      {/* File upload */}
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
          {fileData.length > 0 && (
            <p className="text-xs text-green-600 mt-1">
              {fileData.length} records loaded
            </p>
          )}
        </div>
      )}

      {/* Search */}
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
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-red-600 text-center">{error}</p>
          </div>
        )}

        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-500">Searching...</p>
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

            {result.choices &&
              result.choices.map((choice: any, index: number) => (
                <div
                  key={index}
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
                      <p className="text-sm text-gray-600">{choice.department}</p>
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
