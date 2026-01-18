import { useState } from 'react'
import { Suggestion } from '../App'

interface SuggestionListProps {
  suggestions: Suggestion[]
  onRefresh: () => void
}

function SuggestionList({ suggestions, onRefresh }: SuggestionListProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [deployingId, setDeployingId] = useState<number | null>(null)
  const [analyzingId, setAnalyzingId] = useState<number | null>(null)
  const [generatingId, setGeneratingId] = useState<number | null>(null)
  const [analysis, setAnalysis] = useState<Record<number, any>>({})
  const [changes, setChanges] = useState<Record<number, any>>({})

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

  const handleDeploy = async (id: number) => {
    setDeployingId(id)
    try {
      const response = await fetch(`http://localhost:8000/api/suggestions/${id}/deploy`, {
        method: 'POST',
      })
      
      if (!response.ok) {
        const error = await response.json()
        alert(`Failed to deploy: ${error.detail}`)
        return
      }
      
      alert('Component deployed successfully! Refresh to see it in the gallery.')
      onRefresh()
    } catch (error) {
      console.error('Deploy error:', error)
      alert('Failed to deploy component')
    } finally {
      setDeployingId(null)
    }
  }

  const handleUndeploy = async (id: number) => {
    setDeployingId(id)
    try {
      const response = await fetch(`http://localhost:8000/api/suggestions/${id}/undeploy`, {
        method: 'POST',
      })
      
      if (!response.ok) {
        const error = await response.json()
        alert(`Failed to undeploy: ${error.detail}`)
        return
      }
      
      alert('Component undeployed successfully!')
      onRefresh()
    } catch (error) {
      console.error('Undeploy error:', error)
      alert('Failed to undeploy component')
    } finally {
      setDeployingId(null)
    }
  }

  const handleAnalyze = async (id: number) => {
    setAnalyzingId(id)
    try {
      const response = await fetch(`http://localhost:8000/api/suggestions/${id}/analyze`, {
        method: 'POST',
      })
      
      if (!response.ok) {
        const error = await response.json()
        alert(`Analysis failed: ${error.detail}`)
        return
      }
      
      const data = await response.json()
      setAnalysis({ ...analysis, [id]: data })
    } catch (error) {
      console.error('Analysis error:', error)
      alert('Failed to analyze suggestion')
    } finally {
      setAnalyzingId(null)
    }
  }

  const handleGenerateChanges = async (id: number) => {
    setGeneratingId(id)
    try {
      const response = await fetch(`http://localhost:8000/api/suggestions/${id}/generate-changes`, {
        method: 'POST',
      })
      
      if (!response.ok) {
        const error = await response.json()
        alert(`Generation failed: ${error.detail}`)
        return
      }
      
      const data = await response.json()
      setChanges({ ...changes, [id]: data })
      alert('Multi-file changes generated! Review the results below.')
    } catch (error) {
      console.error('Generation error:', error)
      alert('Failed to generate changes')
    } finally {
      setGeneratingId(null)
    }
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
              <div className="flex gap-2 mb-2">
                <button
                  onClick={() => toggleExpand(suggestion.id)}
                  className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                >
                  {expandedId === suggestion.id ? '🔽 Hide Code' : '🔼 View Code'}
                </button>
                
                <button
                  onClick={() => handleAnalyze(suggestion.id)}
                  disabled={analyzingId === suggestion.id}
                  className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  {analyzingId === suggestion.id ? '⏳' : '🔍 Analyze'}
                </button>

                <button
                  onClick={() => handleGenerateChanges(suggestion.id)}
                  disabled={generatingId === suggestion.id}
                  className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  {generatingId === suggestion.id ? '⏳' : '🤖 Generate'}
                </button>
                
                {!suggestion.deployed ? (
                  <button
                    onClick={() => handleDeploy(suggestion.id)}
                    disabled={deployingId === suggestion.id}
                    className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                  >
                    {deployingId === suggestion.id ? '⏳' : '🚀 Deploy'}
                  </button>
                ) : (
                  <button
                    onClick={() => handleUndeploy(suggestion.id)}
                    disabled={deployingId === suggestion.id}
                    className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                  >
                    {deployingId === suggestion.id ? '⏳' : '📦 Undeploy'}
                  </button>
                )}
              </div>

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

              {analysis[suggestion.id] && (
                <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-900 mb-2">🔍 Analysis Results</h4>
                  <p className="text-sm text-gray-700 mb-2"><strong>Files to modify:</strong> {analysis[suggestion.id].files_to_modify.join(', ')}</p>
                  <p className="text-sm text-gray-700 mb-2"><strong>Reasoning:</strong> {analysis[suggestion.id].reasoning}</p>
                  <p className="text-sm text-gray-700"><strong>Complexity:</strong> {analysis[suggestion.id].complexity}</p>
                </div>
              )}

              {changes[suggestion.id] && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">🤖 Multi-Agent Results</h4>
                  
                  <div className="mb-3">
                    <p className="text-sm font-semibold text-gray-700">Review Status:</p>
                    <div className={`inline-block px-3 py-1 rounded text-sm ${
                      changes[suggestion.id].review.approved 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {changes[suggestion.id].review.approved ? '✅ Approved' : '❌ Issues Found'}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      Risk: {changes[suggestion.id].review.risk_level}
                    </span>
                  </div>

                  {changes[suggestion.id].review.issues.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm font-semibold text-gray-700">Issues:</p>
                      <ul className="list-disc list-inside text-sm text-gray-700">
                        {changes[suggestion.id].review.issues.map((issue: string, i: number) => (
                          <li key={i}>{issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {changes[suggestion.id].review.suggestions.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm font-semibold text-gray-700">Suggestions:</p>
                      <ul className="list-disc list-inside text-sm text-gray-700">
                        {changes[suggestion.id].review.suggestions.map((sug: string, i: number) => (
                          <li key={i}>{sug}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Files Modified:</p>
                    {Object.entries(changes[suggestion.id].changes).map(([file, code]: [string, any]) => (
                      <details key={file} className="mb-2">
                        <summary className="cursor-pointer text-sm text-blue-700 hover:text-blue-900 font-medium">
                          📄 {file}
                        </summary>
                        <pre className="mt-2 bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
                          <code>{code}</code>
                        </pre>
                      </details>
                    ))}
                  </div>
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
