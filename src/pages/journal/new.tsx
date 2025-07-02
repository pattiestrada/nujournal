import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { supabase } from '../../lib/supabaseClient';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const DRAFT_KEY = 'journal-draft';

export default function NewJournalEntry() {
  const [content, setContent] = useState<string>('');
  const [saved, setSaved] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Save draft to localStorage on change
  useEffect(() => {
    if (content) {
      localStorage.setItem(DRAFT_KEY, content);
    }
  }, [content]);

  // On mount, check for draft and ask to restore
  useEffect(() => {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      const shouldRestore = window.confirm('A draft was found. Restore it?');
      if (shouldRestore) {
        setContent(draft);
      } else {
        localStorage.removeItem(DRAFT_KEY);
      }
    }
  }, []);

  function handleSaveDraft(e: React.FormEvent) {
    e.preventDefault();
    localStorage.setItem(DRAFT_KEY, content);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from('entries').insert({ content });
    if (!error) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 2000);
      // Optionally clear the draft after successful submit
      // localStorage.removeItem(DRAFT_KEY);
    } else {
      alert('Error saving entry');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h2 className="text-2xl font-semibold mb-4">New Journal Entry</h2>
      <form className="flex flex-col gap-4">
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