import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function InputForm({ onGenerate, loading }) {
  const [githubUser, setGithubUser] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [resumeFile, setResumeFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!githubUser || !resumeFile) {
      alert("Please provide at least a GitHub username and a resume PDF.");
      return;
    }
    // Pass the raw parameters up to the parent container
    onGenerate({ githubUser, linkedinUrl, resumeFile });
  };

  return (
    <Card className="bg-slate-900 border-slate-800 text-slate-50">
      <CardHeader>
        <CardTitle>Professional Details</CardTitle>
        <CardDescription className="text-slate-400">
          Fill in your profiles and upload your resume to start parsing.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* GitHub Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">GitHub Username</label>
            <Input 
              type="text" 
              placeholder="e.g., challasaicharan" 
              value={githubUser}
              onChange={(e) => setGithubUser(e.target.value)}
              className="bg-slate-950 border-slate-800 text-slate-50 focus-visible:ring-teal-500"
            />
          </div>

          {/* LinkedIn Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">LinkedIn Profile URL (Optional)</label>
            <Input 
              type="url" 
              placeholder="https://linkedin.com/in/username" 
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              className="bg-slate-950 border-slate-800 text-slate-50 focus-visible:ring-teal-500"
            />
          </div>

          {/* Resume File Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Upload Resume (PDF)</label>
            <Input 
              type="file" 
              accept=".pdf"
              onChange={(e) => setResumeFile(e.target.files[0])}
              className="bg-slate-950 border-slate-800 text-slate-50 file:text-slate-400 file:bg-slate-800 file:border-0 file:rounded-md file:px-3 file:py-1 cursor-pointer"
            />
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-linear-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-semibold py-2 rounded-md transition-all duration-200"
          >
            {loading ? "Parsing Profiles & Building Portfolio..." : "Generate Portfolio"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
export default InputForm;