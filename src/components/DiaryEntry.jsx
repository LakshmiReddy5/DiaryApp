import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Calendar, Edit3 } from 'lucide-react';

const DiaryEntry = ({ date, entry, onSave, onBack }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (entry) {
      setTitle(entry.title);
      setBody(entry.body);
      setIsEditing(false);
    } else {
      setTitle('');
      setBody('');
      setIsEditing(true);
    }
  }, [entry]);

  const handleSave = async () => {
    if (!title.trim() || !body.trim()) {
      alert('Please fill in both title and body');
      return;
    }

    setLoading(true);
    const success = await onSave({ date, title, body });

    if (success) {
      setIsEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } else {
      alert('Failed to save diary entry');
    }

    setLoading(false);
  };

  const formatDate = (dateStr) => {   0
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isToday = (dateStr) => {
    const today = new Date().toISOString().split('T')[0];
    return dateStr === today;
  };

  return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to Calendar</span>
            </button>

            {!isEditing && entry && (
                <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>Edit Entry</span>
                </button>
            )}
          </div>

          {/* Date Display */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-8">
            <div className="bg-gradient-to-r from-primary-600 to-blue-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center space-x-3">
                <Calendar className="h-6 w-6" />
                <div>
                  <h1 className="text-2xl font-bold">{formatDate(date)}</h1>
                  {isToday(date) && (
                      <span className="text-blue-100 text-sm">Today's Entry</span>
                  )}
                </div>
              </div>
            </div>

            {/* Entry Content */}
            <div className="p-8">
              {isEditing ? (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Entry Title
                      </label>
                      <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="What's on your mind today?"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-primary-600 outline-none transition-colors text-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Thoughts
                      </label>
                      <textarea
                          value={body}
                          onChange={(e) => setBody(e.target.value)}
                          placeholder="Share your thoughts, experiences, and reflections..."
                          rows={12}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-primary-600 outline-none transition-colors resize-none leading-relaxed"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <button
                          onClick={() => {
                            if (entry) {
                              setTitle(entry.title);
                              setBody(entry.body);
                              setIsEditing(false);
                            } else {
                              onBack();
                            }
                          }}
                          className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                      >
                        Cancel
                      </button>

                      <button
                          onClick={handleSave}
                          disabled={loading || !title.trim() || !body.trim()}
                          className="flex items-center space-x-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                      >
                        <Save className="h-4 w-4" />
                        <span>{loading ? 'Saving...' : 'Save Entry'}</span>
                      </button>
                    </div>

                    {saved && (
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg">
                          ✓ Entry saved successfully!
                        </div>
                    )}
                  </div>
              ) : (
                  <div className="space-y-6">
                    {entry ? (
                        <>
                          <div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-4">
                              {entry.title}
                            </h2>
                          </div>
                          <div className="prose prose-lg max-w-none">
                            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
                              {entry.body}
                            </div>
                          </div>
                          <div className="pt-6 border-t border-gray-200 text-sm text-gray-500">
                            Last updated: {new Date(entry.updated_at).toLocaleString()}
                          </div>
                        </>
                    ) : (
                        <div className="text-center py-12">
                          <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                            <Edit3 className="h-12 w-12 text-gray-400" />
                          </div>
                          <h3 className="text-xl font-medium text-gray-800 mb-2">
                            No entry for this date
                          </h3>
                          <p className="text-gray-600 mb-6">
                            Start writing your thoughts and experiences for {formatDate(date)}
                          </p>
                          <button
                              onClick={() => setIsEditing(true)}
                              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
                          >
                            Create Entry
                          </button>
                        </div>
                    )}
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
};

export default DiaryEntry;