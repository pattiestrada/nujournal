import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function NewJournalEntry() {
  const [content, setContent] = useState('');
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from('entries').insert({ content });
    if (!error) {
      setContent('');
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } else {
      alert('Error saving entry');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h2 className="text-2xl font-semibold mb-4">New Journal Entry</h2>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <textarea
          className="border rounded p-3 h-48 mb-4"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind today?"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Save Entry
        </button>
        {saved && <p className="mt-2 text-green-600">Saved!</p>}
      </form>
    </div>
  );
}