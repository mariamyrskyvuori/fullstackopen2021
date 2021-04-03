import React from 'react'

const Header = ({courseName}) => {
    return (
        <h2>{courseName}</h2>
    )
}
const Course = ({courses}) => {


    return (
        <>
            {courses.map(course =>
                <div key={course.id}>
                    <Header courseName={course.name}/>
                    <Content parts={course.parts}/>
                    <Total parts={course.parts}/>
                </div>
            )}
        </>
    )
}
const Content = ({parts}) => {

    return (
        <>
            {parts.map((x) => <div key={x.id}>{x.name + " " + x.exercises}</div>)}
        </>
    )
}
const Total = ({parts}) => {
    let total = parts.reduce(function (sum, x) {
        return sum + x.exercises
    }, 0)
    return (
        <div>
            total of {total} exercises
        </div>
    )
}

export default Course