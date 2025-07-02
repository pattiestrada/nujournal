import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { supabase } from '../../lib/supabaseClient';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const DRAFT_KEY = 'journal-draft';
const TITLE_KEY = 'journal-title-draft';

function getTodayDateString() {
  return new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function NewJournalEntry() {
  const [title, setTitle] = useState<string>(getTodayDateString());
  const [content, setContent] = useState<string>('');
  const [saved, setSaved] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Save draft to localStorage on change
  useEffect(() => {
    if (content) {
      localStorage.setItem(DRAFT_KEY, content);
    }
  }, [content]);

  useEffect(() => {
    if (title) {
      localStorage.setItem(TITLE_KEY, title);
    }
  }, [title]);

  // On mount, check for draft and ask to restore
  useEffect(() => {
    const draft = localStorage.getItem(DRAFT_KEY);
    const titleDraft = localStorage.getItem(TITLE_KEY);
    if (draft) {
      const shouldRestore = window.confirm('A draft was found. Restore it?');
      if (shouldRestore) {
        if (draft) setContent(draft);
        if (titleDraft) setTitle(titleDraft);
      } else {
        localStorage.removeItem(DRAFT_KEY);
        localStorage.removeItem(TITLE_KEY);
      }
    }
  }, []);

  function handleSaveDraft(e: React.FormEvent) {
    e.preventDefault();
    localStorage.setItem(DRAFT_KEY, content);
    localStorage.setItem(TITLE_KEY, title);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from('entries').insert({ title, content });
    if (!error) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 2000);
      // clear the draft after successful submit
      localStorage.removeItem(DRAFT_KEY);
      localStorage.removeItem(TITLE_KEY);
    } else {
      alert('Error saving entry');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h2 className="text-2xl font-semibold mb-4">New Journal Entry</h2>
      <form className="flex flex-col gap-4">
        <input
          type="text"
          className="border rounded px-3 py-2 text-lg font-medium"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Entry Title"
        />
        <ReactQuill
          value={content}
          onChange={setContent}
          theme="snow"
          style={{ height: 300, marginBottom: 50 }}
        />
        <div className="flex gap-4">
          <button
            onClick={handleSaveDraft}
            type="button"
            className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400"
          >
            Save Draft
          </button>
          <button
            onClick={handleSubmit}
            type="button"
            className="bg-pink-200 text-white py-2 px-4 rounded hover:bg-pink-300"
          >
            Submit Entry
          </button>
        </div>
        {saved && <p className="mt-2 text-blue-600">Draft saved!</p>}
        {submitted && <p className="mt-2 text-green-600">Entry submitted!</p>}
      </form>
    </div>
  );
}