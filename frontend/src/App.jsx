import React, { useState } from 'react';
import InputForm from './components/InputForm';
import PortfolioTemplate from './components/PortfolioTemplate';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [portfolioData, setPortfolioData] = useState(null);
  const [error, setError] = useState(null);

  const handleGeneratePortfolio = async (formDataFromChild) => {
    setLoading(true);
    setError(null);
    
    try {
      // 1. Create a native FormData instance
      const formData = new FormData();
      
      // 2. Append text inputs and the binary file matching the backend's expected names
      formData.append('username', formDataFromChild.githubUser);   // Backend reads this
      formData.append('githubUser', formDataFromChild.githubUser); // Or fallback
      formData.append('linkedinUrl', formDataFromChild.linkedinUrl);
      formData.append('resumeFile', formDataFromChild.resumeFile);

      // 3. Make the API Call to your Node backend
      const response = await fetch('http://localhost:5000/api/generate-portfolio', {
        method: 'POST',
        body: formData, // Browser automatically sets Content-Type to multipart/form-data
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to generate portfolio");
      }

      // 4. Store your generated profile and repository payload!
      console.log("Success! Received Portfolio Data:", result);
      setPortfolioData(result);

    } catch (err) {
      console.error("Generation Error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center justify-center p-6">
      {/* 💡 Note: Changed max-w-2xl to transition dynamically so your template has plenty of layout room */}
      <div className={`${portfolioData ? 'max-w-5xl' : 'max-w-2xl'} w-full space-y-8 transition-all duration-300`}>
        
        {/* Header Section - Only show when inputting data */}
        {!portfolioData && (
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight bg-linear-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
              Instant Portfolio Generator
            </h1>
            <p className="text-slate-400 text-lg">
              Turn your professional documents into a stunning developer landing page in seconds.
            </p>
          </div>
        )}

        {/* Error Alert Display */}
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Input Screen Component or Portfolio Preview Layout */}
        {!portfolioData ? (
          <InputForm onGenerate={handleGeneratePortfolio} loading={loading} />
        ) : (
          <PortfolioTemplate 
            data={portfolioData} 
            onReset={() => setPortfolioData(null)} 
          />
        )}
        
      </div>
    </div>
  );
}