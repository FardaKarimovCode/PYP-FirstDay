import React,{useState} from 'react';
import { useDispatch } from 'react-redux';
import { DeleteItem, UpdateItem } from '../redux/action';

const Listİtems = ({todo}) => {
    const [editable, seteditable] = useState(false);
    const [name, setName] = useState(todo.name);
    let dispatch = useDispatch()
    return (
        <div>
        <div className="row m-4 d-flex justify-content-center">
            <div className="col-1"><h5>{todo.id}</h5></div>
            <div className="col-1"> <input className="form-check-input" type="checkbox">
            </input></div>
            <div className="col-4">{editable ? <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)}/> : <h4>{todo.name}</h4>}</div>
            <button style={{fontWeight:"bold"}} onClick={() => dispatch(DeleteItem(todo.id))} className="btn btn-danger col-2 mx-2"> Delete </button>
            <button  style={{fontWeight:"bold"}}  onClick={() => {
                 console.log("Update")
                 dispatch(UpdateItem(
                    {...todo,name:name}
                    ));
                if(editable){setName(todo.name)} seteditable(!editable)}}  className="btn btn-warning col-2 p-2 mx-2">{editable ? "Update" : "Edit"}</button>
        </div>
        </div>
    );
}

export default Listİtems;
