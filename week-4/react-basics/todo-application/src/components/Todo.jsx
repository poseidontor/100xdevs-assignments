import { useState } from "react";



// State of ToDo application
// todo: [{title: "todo1", description: "description"}]


export default function Todo(props) {

    return (
        <div>
        <p className="todoTitle">{props.title}</p>
        <p className="todoDescription">{props.description}</p>
        </div>
    );
}



