import { useState } from 'react'
import { Suggestion } from '../App'

interface SuggestionListProps {
  suggestions: Suggestion[]
}

function SuggestionList({ suggestions }: SuggestionListProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [copiedId, setCopiedId] = useState<number | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return '⏳'
      case 'processing':
        return '⚙️'
      case 'completed':
        return '✅'
      case 'failed':
        return '❌'
      default:
        return '❓'
    }
  }

  const handleCopyCode = (code: string, id: number) => {
    navigator.clipboard.writeText(code)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id)
  }

  if (suggestions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-12 text-center">
        <div className="text-6xl mb-4">🎯</div>
        <p className="text-gray-500 text-lg">
          No suggestions yet. Be the first to submit one!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        📋 Suggestions ({suggestions.length})
      </h2>
      
      {suggestions.map((suggestion) => (
        <div
          key={suggestion.id}
          className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                {suggestion.content}
              </h3>
              <p className="text-sm text-gray-500">
                Submitted: {new Date(suggestion.created_at).toLocaleString()}
              </p>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(
                suggestion.status
              )}`}
            >
              {getStatusIcon(suggestion.status)} {suggestion.status.toUpperCase()}
            </span>
          </div>

          {suggestion.status === 'completed' && suggestion.generated_code && (
            <div className="mt-4">
              <button
                onClick={() => toggleExpand(suggestion.id)}
                className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                {expandedId === suggestion.id ? '🔽 Hide Code' : '🔼 View Code'}
              </button>

              {expandedId === suggestion.id && (
                <div className="mt-4 relative">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Generated Component:</span>
                    <button
                      onClick={() => handleCopyCode(suggestion.generated_code!, suggestion.id)}
                      className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded transition-colors"
                    >
                      {copiedId === suggestion.id ? '✓ Copied!' : '📋 Copy'}
                    </button>
                  </div>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                    <code>{suggestion.generated_code}</code>
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default SuggestionList
