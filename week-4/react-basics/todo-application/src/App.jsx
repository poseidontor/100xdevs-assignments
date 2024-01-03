import Todo from "./components/Todo"
import { useState } from "react"
import "./css/main.css"





export default function App() {
   
    const [todo,setTodo] = useState([{
        title: "",
        description: ""
    }])

    function onClickHandler(event) {
        event.preventDefault();
        let title = document.getElementById("title").value;
        let description = document.getElementById("description").value;


        setTodo([...todo, {
            title: title,
            description: description
        }])


    }

    

    return (
        <>
            <div className="center-div">
                <div className="child-div">
                    <div>
                        <h3 className="header">My To-Do List</h3>
                    </div>
                    <div>
                            <form id="todoform" action="">
                                <label htmlFor="todolist">&#128220; Add your to-do item: </label><br />
                                <input type="text" id="title" placeholder="title"></input>
                                <input type="text" id="description" placeholder="description"></input>
                                <br />
                                <br />
                                <button onClick={onClickHandler}>save To-Do item</button>
                            </form>
                    </div>
                    <br />
                    <br />
                    <div id="continer">
                        <label>ToDo Items for today</label>
                        {todo.map((td) => {
                            return <Todo title={td.title} description={td.description} ></Todo>
                        })}
                    </div>
                </div>
            </div>

        </>
    );
}