import { useState, useEffect } from 'react'
import axios from 'axios'
import './index.css'

const API_URL = 'http://localhost:8000/api/todos/'

function App() {
  const [todos, setTodos] = useState([])
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      const response = await axios.get(API_URL)
      setTodos(response.data)
    } catch (error) {
      console.error('Error fetching todos:', error)
    }
  }

  const handleAddTodo = async () => {
    if (!inputValue.trim()) return
    try {
      const response = await axios.post(API_URL, {
        title: inputValue,
        completed: false
      })
      setTodos([response.data, ...todos])
      setInputValue('')
    } catch (error) {
      console.error('Error adding todo:', error)
    }
  }

  const handleToggleTodo = async (todo) => {
    try {
      const response = await axios.patch(`${API_URL}${todo.id}/`, {
        completed: !todo.completed
      })
      setTodos(todos.map(t => t.id === todo.id ? response.data : t))
    } catch (error) {
      console.error('Error toggling todo:', error)
    }
  }

  const handleDeleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}${id}/`)
      setTodos(todos.filter(t => t.id !== id))
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddTodo()
    }
  }

  return (
    <div className="todo-container">
      <h1>Todoify</h1>
      
      <div className="input-group">
        <input 
          type="text" 
          placeholder="Add a new task..." 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="add-btn" onClick={handleAddTodo}>Add Task</button>
      </div>

      <div className="todo-list">
        {todos.map((todo) => (
          <div key={todo.id} className="todo-item">
            <div className="todo-content" onClick={() => handleToggleTodo(todo)}>
              <div className={`checkbox ${todo.completed ? 'checked' : ''}`}></div>
              <span className={`todo-text ${todo.completed ? 'completed' : ''}`}>
                {todo.title}
              </span>
            </div>
            <button className="delete-btn" onClick={() => handleDeleteTodo(todo.id)}>
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
