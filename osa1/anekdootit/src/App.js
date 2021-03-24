import React, { useState } from 'react'
const Button = ({handleClick, text}) => (
    <button onClick={handleClick}>
      {text}
    </button>
)
const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
  ]
  const [vote, setVote] = useState(Array(6).fill(0))
  const [selected, setSelected] = useState(0)
  const handleVoteClick = () => {
    vote[selected] = vote[selected] + 1
    setVote([...vote])
  }
  const handleNextClick = () => {
    setSelected(getRandomInt(5))
  }
  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  const mostVotes = vote.indexOf(Math.max(...vote))


  return (
      <div>
        <h1>Anecdote of the day</h1>
        <p>{anecdotes[selected]}</p>
        <Button handleClick={handleVoteClick} text={"vote"}/>
        <Button handleClick={handleNextClick} text={"next anecdote"}/>
        <h1>Anecdote with most votes</h1>
        {anecdotes[mostVotes]}
      </div>
  )
}

export default App