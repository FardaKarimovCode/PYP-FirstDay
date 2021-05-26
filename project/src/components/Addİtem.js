import React,{useState} from 'react';
import { useDispatch } from 'react-redux';
import { AddItem } from '../redux/action'
import {v1 as uuid} from 'uuid'
const Add = () => {
    const [name,setName] = useState();
    let dispatch = useDispatch()
    return (
       
        <div className="row m-5">
            <input value={name} onChange={(e) => setName(e.target.value)} className="form-control col-10 w-75 mr-2" type="text"></input>
            <button onClick={() => { 
                dispatch(AddItem(
                    {id:uuid(),name:name}
                    ))
                    setName('')}} className="btn btn-warning col-2"  style={{fontWeight:"bold"}} > Add New Item </button>
        </div>
        
    );
}

export default Add;
