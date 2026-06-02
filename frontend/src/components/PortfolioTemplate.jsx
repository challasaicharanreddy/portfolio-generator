import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PortfolioTemplate({ data, onReset }) {
  const { profile, repos } = data;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-12 py-12 animate-in fade-in duration-500">
      
      {/* Navigation / Header Actions */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <span className="text-xl font-bold tracking-tight text-teal-400">⚡ Your Portfolio</span>
        <Button variant="outline" size="sm" onClick={onReset} className="border-slate-800 text-slate-400 hover:text-slate-100">
          Back to Generator
        </Button>
      </div>

      {/* Hero / Profile Section */}
      <section className="flex flex-col md:flex-row items-center gap-8 bg-slate-900/40 p-8 rounded-2xl border border-slate-900">
        <img 
          src={profile.avatar} 
          alt={profile.name} 
          className="w-32 h-32 rounded-full border-2 border-teal-500 shadow-xl shadow-teal-500/10"
        />
        <div className="flex-1 text-center md:text-left space-y-4">
          <h1 className="text-4xl font-extrabold text-slate-100">{profile.name}</h1>
          <p className="text-slate-400 text-lg max-w-2xl">{profile.bio}</p>
          
          {profile.linkedin_handle && (
            <a
            href={profile.linkedin_url}
            target="_blank"
            rel="noreferrer"
            className="inline-block text-blue-400 hover:underline font-medium"
            >
            💼 @{profile.linkedin_handle}
            </a>
          )}

          <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
            <a href={profile.html_url} target="_blank" rel="noreferrer">
              <Button size="sm" className="bg-slate-800 hover:bg-slate-700 text-slate-100">
                GitHub Profile
              </Button>
            </a>
            {profile.linkedin_url && (
              <a href={profile.linkedin_url} target="_blank" rel="noreferrer">
                <Button size="sm" className="bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30">
                  LinkedIn Connection
                </Button>
              </a>
            )}
            {profile.has_resume && (
            <a
                href={profile.resume_url}
                target="_blank"
                rel="noreferrer"
            >
                <Button
                size="sm"
                variant="secondary"
                className="bg-teal-500 hover:bg-teal-600 text-slate-950 font-medium"
                >
                📄 View Resume
                </Button>
            </a>
            )}
          </div>
        </div>
      </section>




      {/* About Me */}
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">
        About Me
      </h2>

      <p className="text-slate-300 leading-relaxed">
        {profile.about}
      </p>
    </section>




      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 text-center">
        <h3 className="text-slate-400 text-sm">
            Repositories
        </h3>

        <p className="text-3xl font-bold text-teal-400 mt-2">
            {data.stats.totalRepos}
        </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 text-center">
        <h3 className="text-slate-400 text-sm">
            Total Stars
        </h3>

        <p className="text-3xl font-bold text-yellow-400 mt-2">
            ⭐ {data.stats.totalStars}
        </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 text-center">
        <h3 className="text-slate-400 text-sm">
            Languages Used
        </h3>

        <p className="text-3xl font-bold text-blue-400 mt-2">
            {data.stats.totalLanguages}
        </p>
        </div>

        </section>


        {/* Contact Section */}
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">
        Contact
      </h2>

      {profile.contact_email && (
        <p className="text-slate-300">
          📧 {profile.contact_email}
        </p>
      )}

      {profile.linkedin_url && (
        <a
          href={profile.linkedin_url}
          target="_blank"
          rel="noreferrer"
          className="text-blue-400"
        >
          LinkedIn
        </a>
      )}
    </section>

      {/* 🚀 Dynamic Skills Section parsed from the user's uploaded Resume */}
        {profile.skills && profile.skills.length > 0 && (
        <section className="space-y-4">
            <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-100">Technical Expertise</h2>
            </div>
            <div className="flex flex-wrap gap-2.5">
            {profile.skills.map((skill, index) => (
                <span 
                key={index} 
                className="text-xs md:text-sm px-3.5 py-1.5 rounded-xl font-mono font-medium border transition-all duration-300 bg-teal-500/5 text-teal-400 border-teal-500/20 hover:bg-teal-500/10"
                >
                {skill}
                </span>
            ))}
            </div>
        </section>
        )}

        <section className="space-y-4">
        <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-100">
            Education
            </h2>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
        {profile.education?.map((edu, index) => (
          <div
            key={index}
            className="bg-slate-900 p-4 rounded-lg"
          >
            <h3>{edu.degree}</h3>

            <p>{edu.institution}</p>

            <p>
              {edu.year} • {edu.grade || edu.score}
            </p>
          </div>
        ))}
        </div>
        </section>


      {/* Projects Grid Section */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight">Featured Projects</h2>
          <p className="text-slate-400 text-sm">Curated directly from recent repositories activity.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {repos.map((repo, idx) => (
            <Card key={idx} className="bg-slate-900/60 border-slate-900 hover:border-slate-800 transition-all duration-300 flex flex-col justify-between">
              <CardHeader>
                <div className="flex justify-between items-start gap-2">
                  <CardTitle className="text-lg font-bold text-slate-200 truncate group-hover:text-teal-400">
                    {repo.name}
                  </CardTitle>
                  <span className="text-xs px-2 py-1 bg-slate-800 rounded-full text-slate-400 font-mono">
                    ⭐ {repo.stars}
                  </span>
                </div>
                <CardDescription className="text-slate-400 text-sm line-clamp-2 pt-2">
                  {repo.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-between items-center pt-0 mt-auto">
                <span className="flex items-center gap-1.5 text-xs text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-400 block" />
                  {repo.language}
                </span>
                <a href={repo.url} target="_blank" rel="noreferrer" className="text-xs text-teal-400 hover:underline">
                  Codebase →
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      
    </div>
  );
}