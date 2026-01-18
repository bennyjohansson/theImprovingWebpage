import { useState, FormEvent } from 'react'

interface SuggestionFormProps {
  onSubmit: (content: string) => Promise<void>
}

function SuggestionForm({ onSubmit }: SuggestionFormProps) {
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!content.trim() || submitting) return

    setSubmitting(true)
    try {
      await onSubmit(content)
      setContent('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        💡 Submit Your Suggestion
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="suggestion" className="block text-sm font-medium text-gray-700 mb-2">
            What would you like to improve?
          </label>
          <textarea
            id="suggestion"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            rows={4}
            placeholder="e.g., Add a welcome message with the user's name..."
            disabled={submitting}
          />
        </div>
        <button
          type="submit"
          disabled={!content.trim() || submitting}
          className="w-full bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? '⏳ Submitting...' : '🚀 Submit Suggestion'}
        </button>
      </form>
    </div>
  )
}

export default SuggestionForm
