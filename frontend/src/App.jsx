import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [todos, setTodos] = useState([])
  const [inputValue, setInputValue] = useState('')
  const API_URL = 'http://localhost:8080/api/todos'

  // 백엔드에서 할 일 목록 가져오기
  const fetchTodos = async () => {
    try {
      const response = await fetch(API_URL)
      const data = await response.json()
      setTodos(data)
    } catch (error) {
      console.error('Error fetching todos:', error)
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  // 할 일 추가
  const addTodo = async (e) => {
    e.preventDefault()
    if (inputValue.trim() === '') return
    
    const newTodo = {
      text: inputValue,
      completed: false
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTodo)
      })
      if (response.ok) {
        fetchTodos()
        setInputValue('')
      }
    } catch (error) {
      console.error('Error adding todo:', error)
    }
  }

  // 완료 상태 토글
  const toggleTodo = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT'
      })
      if (response.ok) {
        fetchTodos()
      }
    } catch (error) {
      console.error('Error toggling todo:', error)
    }
  }

  // 할 일 삭제
  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        fetchTodos()
      }
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }

  return (
    <div className="container">
      <header>
        <h1>My Todo List</h1>
      </header>

      <main>
        <form className="todo-form" onSubmit={addTodo}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="할 일을 입력하세요..."
          />
          <button type="submit">추가</button>
        </form>

        <ul className="todo-list">
          {todos.map(todo => (
            <li key={todo.id} className={todo.completed ? 'completed' : ''}>
              <span onClick={() => toggleTodo(todo.id)}>
                {todo.text}
              </span>
              <button onClick={() => deleteTodo(todo.id)} className="delete-btn">
                삭제
              </button>
            </li>
          ))}
        </ul>
      </main>

      {todos.length > 0 && (
        <footer>
          <p>총 {todos.length}개의 할 일이 있습니다.</p>
        </footer>
      )}
    </div>
  )
}

export default App
