import React from 'react'

const Header = (props) => {
    return (
        <h1>{props.course}</h1>
    )
}

const Part = (props) => {
    return (
        <p>
            {props.partName} {props.exercises}
        </p>
    )
}
const Content = (props) => {
    return (
        <>
            <Part partName={props.parts[0].name} exercises={props.parts[0].exercises}/>
            <Part partName={props.parts[1].name} exercises={props.parts[1].exercises}/>
            <Part partName={props.parts[2].name} exercises={props.parts[2].exercises}/>
        </>
    )
}
const Total = (props) => {
    return (
        <p>Number of exercises {props.sum}</p>
    )
}

const App = () => {
    const course = {
        name: 'Half Stack application development',
        parts: [
            {
                name: 'Fundamentals of React',
                exercises: 10
            },
            {
                name: 'Using props to pass data',
                exercises: 7
            },

            {
                name: 'State of a component',
                exercises: 14
            }
        ]
    }


    return (
        <div>
            <Header course={course.name}/>
            <Content parts={course.parts}/>
            <Total sum={course.parts[0].exercises + course.parts[1].exercises + course.parts[2].exercises}/>
        </div>

    )
}
export default App
