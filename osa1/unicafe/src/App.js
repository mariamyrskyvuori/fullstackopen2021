import React, {useState} from 'react'

const Button = ({handleClick, text}) => (
    <button onClick={handleClick}>
        {text}
    </button>
)
const StatisticLine = (props) => {
    return (
        <tbody>
        <tr>
            <td>{props.text}</td>
            <td>{props.value}</td>
        </tr>
        </tbody>
    )
}

const Statistics = (props) => {
    const all = props.good + props.neutral + props.bad
    const average = (props.good - props.bad) / (props.good + props.neutral + props.bad)
    const positive = (props.good / (props.good + props.neutral + props.bad) * 100)  + "%"
    if (all >= 1) {
        return (
            <table>
                <StatisticLine text="good" value={props.good}/>
                <StatisticLine text="neutral" value={props.neutral}/>
                <StatisticLine text="bad" value={props.bad}/>
                <StatisticLine text="all" value={all}/>
                <StatisticLine text="average" value={average}/>
                <StatisticLine text="positive" value={positive}/>
            </table>
        )
    } else {
        return (
            <div>
                <p>No feedback given</p>
            </div>
        )
    }
}


const App = () => {
    // tallenna napit omaan tilaansa
    const [good, setGood] = useState(0)
    const [neutral, setNeutral] = useState(0)
    const [bad, setBad] = useState(0)


    const handleGoodClick = () => {
        setGood(good + 1)
    }
    const handleNeutralClick = () => {
        setNeutral(neutral + 1)
    }
    const handleBadClick = () => {
        setBad(bad + 1)
    }

    return (
        <div>
            <h1>give feedback</h1>
            <Button handleClick={handleGoodClick} text={"Good"}/>
            <Button handleClick={handleNeutralClick} text={"Neutral"}/>
            <Button handleClick={handleBadClick} text={"Bad"}/>
            <h1>statistics</h1>
            <Statistics good={good} bad={bad} neutral={neutral}/>
        </div>
    )
}

export default App
