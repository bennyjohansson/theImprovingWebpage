import { useState, useEffect } from 'react'
import SuggestionForm from './components/SuggestionForm'
import SuggestionList from './components/SuggestionList'
import ComponentGallery from './components/ComponentGallery'
import Footer from './components/Footer'

export interface Suggestion {
  id: number
  content: string
  status: string
  generated_code: string | null
  deployed: boolean
  component_name: string | null
  created_at: string
  updated_at: string | null
}

function App() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSuggestions = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/suggestions')
      if (!response.ok) throw new Error('Failed to fetch suggestions')
      const data = await response.json()
      setSuggestions(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSuggestions()
    const interval = setInterval(fetchSuggestions, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (content: string) => {
    try {
      const response = await fetch('http://localhost:8000/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })
      
      if (!response.ok) throw new Error('Failed to create suggestion')
      
      await fetchSuggestions()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit suggestion')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            🔬 Research on a self-improving webpage
          </h1>
          <p className="text-xl text-gray-600">
            Submit suggestions and watch AI generate code automatically
          </p>
        </header>

        <div className="space-y-8">
          <SuggestionForm onSubmit={handleSubmit} />
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              <p className="mt-4 text-gray-600">Loading suggestions...</p>
            </div>
          ) : (
            <>
              <ComponentGallery />
              <SuggestionList suggestions={suggestions} onRefresh={fetchSuggestions} />
            </>
          )}
        </div>

        <Footer />
      </div>
    </div>
  )
}

export default App
