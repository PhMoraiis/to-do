import { useState, useEffect } from 'react'
import { BsTrash, BsBookmarkCheck, BsBookmarkCheckFill } from 'react-icons/bs'
import './App.css'

const API = 'http://localhost:3000'

function App() {

  const [title, setTitle] = useState('')
  const [time, setTime] = useState('')
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      const res = await fetch(API + '/todos')
        .then((res) => res.json())
        .then((data) => data)
        .catch((err) => console.log(err))

      setLoading(false)
      setTodos(res)
    }
    loadData()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const todo = {
      id: Math.random(),
      title,
      time,
      done: false,
    }

    await fetch(API + '/todos', {
      method: 'POST',
      body: JSON.stringify(todo),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    setTodos((prevState) => [...prevState, todo])
    setTitle('')
    setTime('')
  }

  const handleDelete = async (id) => {
    await fetch(API + '/todos/' + id, {
      method: 'DELETE',
    })

    setTodos((prevState) => prevState.filter((todo) => todo.id !== id))
  }

  const handleEdit = async (todo) => {
    todo.done = !todo.done

    const data = await fetch(API + '/todos/' + todo.id, {
      method: 'PUT',
      body: JSON.stringify(todo),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    setTodos((prevState) => prevState.map((t) => (t.id === data.id ? (t = data) : t)))
  }

  if (loading) {
    return <p>Carregando...</p>
  }

  return (
    <div className="App">
      <div className="HeaderTodo">
        <h1>React To-Do</h1>
      </div>
      <div className="FormTodo">
        <h2>Insira a sua tarefa:</h2>
        <form onSubmit={handleSubmit}>
          <div className="FormControl">
            <label htmlFor="title">O que você vai fazer ?</label>
            <input type="text"
              name='title'
              placeholder='Titulo da tarefa'
              onChange={(e) => setTitle(e.target.value)}
              value={title || ''}
              required
            />
          </div>
          <div className="FormControl">
            <label htmlFor="time">Duração:</label>
            <input type="text"
              name='time'
              placeholder='Tempo estimado (em horas)'
              onChange={(e) => setTime(e.target.value)}
              value={time || ''}
              required
            />
          </div>
          <input type="submit" value="Criar Tarefa" />
        </form>
      </div>
      <div className="ListTodo">
        <h2>Lista de Tarefas:</h2>
        {todos.length === 0 && <p>Não há tarefas cadastradas!</p>}
        {todos.map((todo) => (
          <div className="Todo" key={todo.id}>
            <h3 className={todo.done ? 'TodoDone' : ""}>{todo.title}</h3>
            <p>DURAÇÃO:{todo.time}</p>
            <div className="TodoActions">
              <span onClick={() => handleEdit(todo)}>
                {!todo.done ? <BsBookmarkCheck /> : <BsBookmarkCheckFill />}
              </span>
              <BsTrash onClick={() => handleDelete(todo.id)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
