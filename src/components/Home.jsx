import React from 'react';
import { BookOpen, Calendar, Lock, Edit3 } from 'lucide-react';

const Home = () => {
  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
              Welcome to <span className="text-primary-600">MyDiary</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Your personal sanctuary for thoughts, memories, and reflections.
              Capture life's moments with beautiful simplicity.
            </p>

            {/* Motivational Quote */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 mb-16 max-w-4xl mx-auto shadow-xl border border-blue-200">
              <blockquote className="text-2xl md:text-3xl font-light text-gray-700 italic leading-relaxed">
                "The life of every man is a diary in which he means to write one story,
                and writes another; and his humblest hour is when he compares the volume as it is with what he vowed to make it."
              </blockquote>
              <cite className="block mt-4 text-lg text-primary-700 font-medium">
                — J.M. Barrie
              </cite>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 group">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors">
                <BookOpen className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Daily Journaling</h3>
              <p className="text-gray-600 leading-relaxed">
                Write and organize your thoughts with our intuitive diary interface.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-emerald-100 group">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-emerald-200 transition-colors">
                <Calendar className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Calendar View</h3>
              <p className="text-gray-600 leading-relaxed">
                Navigate through your entries with our beautiful calendar interface.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-rose-100 group">
              <div className="bg-rose-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-rose-200 transition-colors">
                <Lock className="h-8 w-8 text-rose-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Private & Secure</h3>
              <p className="text-gray-600 leading-relaxed">
                Your thoughts are safe with encrypted storage and secure authentication.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-indigo-100 group">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-indigo-200 transition-colors">
                <Edit3 className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Easy Editing</h3>
              <p className="text-gray-600 leading-relaxed">
                Revisit and edit your past entries whenever inspiration strikes.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 max-w-2xl mx-auto shadow-xl border border-blue-200">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Ready to Start Your Journey?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Join thousands of writers who trust MyDiary with their most precious thoughts and memories.
              </p>
              <div className="space-y-4">
                <div className="text-sm text-gray-500">
                  ✓ Free forever &nbsp;&nbsp; ✓ No ads &nbsp;&nbsp; ✓ Private & secure
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Home;