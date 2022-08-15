import React from "react";
import "../styles/modal.css";


export const Modal = ({active, setActive}) => {
    
    return (
        <div className={active ? 'modal active': 'modal'}>
            <div className='modal__content'>
                <p>Amount of beed exeedes your balance !</p>
                <button className='exit' onClick={() => {setActive(false)}}>OK</button>
            </div>
        </div>
    )  
}