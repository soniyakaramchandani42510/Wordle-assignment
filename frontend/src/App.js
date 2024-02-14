import React, { useState, useEffect } from 'react';
import io from 'socket.io-client'

const socket = io.connect("http://localhost:8000");
function App() {
    const [totalClients, setTotalClients] = useState(0);
    const [messages, setMessages] = useState([]);
    const [name, setName] = useState('anonymous(write your name..)');
    const [messageInput, setMessageInput] = useState('');


    useEffect(() => {
        const handleClientsTotal = (data) => {
            setTotalClients(data);
        };
    
        const handleChatMessage = (data) => {
            console.log('frontend data', data);
            setMessages((prevMessages) => [...prevMessages, data]);
        };
        
    
        // Here We Listen for events
        socket.on('clients-total', handleClientsTotal);
        socket.on('chat-message', handleChatMessage);
        // Cleanup function to remove event listeners
        return () => {
            socket.off('clients-total', handleClientsTotal);
            socket.off('chat-message', handleChatMessage);
        };
    }, [socket,messages]); 
    
   
    const sendMessage = (e) => {
        // this function for adding messages in socket.io
        e.preventDefault();
        if (messageInput.trim() === '') return;
        const data = {
            name,
            message: messageInput,
            dateTime: new Date(),
        };
        // console.log('data frontend',data);
        socket.emit('message', data);
        setMessageInput('');
    };

    return (
        <div style={style.section}>
            <h1 style={{ margin: '20px 0' }}>WordleCup Chat 💬</h1>
            <div className="main" style={style.heading}>
                <div className="name" style={{
                    display: 'flex',
                    fontSize: '32px',
                    fontWeight: '700',
                    padding: '8px 16px',
                    color: '#7e7e7e',
                    backgroundColor: '#ebebeb'
                }}>
                    <span><i className="far fa-user"></i></span>
                    <input
                        type="text"
                        id="name-input"
                        className="name-input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        maxLength="20"
                        style={style.input}
                    />
                </div>

                <ul className="message-container" id="message-container" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: '#f6f6f6',
                    width: '400px',
                    height: '600px',
                    overflowY: 'scroll',
                    overflowX: 'hidden'
                }}>
                    {messages.map((message, index) => (
                        <li key={index} className={message.name === name ? 'message-right' : 'message-left'} style={{
                            listStyle: 'none',
                            padding: '8px 12px',
                            margin: '12px',
                            maxWidth: '250px',
                            fontSize: '18px',
                            wordWrap: 'break-word',
                            borderRadius: message.name === name ? '20px 20px 0px 20px' : '20px 20px 20px 0px',
                            alignSelf: message.name === name ? 'flex-end' : 'flex-start',
                            backgroundColor: message.name === name ? '#2d2d2d' : '#fff',
                            boxShadow: message.name === name ? '2px 2px 4px #dcdcdc' : '-2px 2px 4px #dcdcdc',
                            color: message.name === name ? '#f6f6f6' : '#000'
                        }}>
                            <p className="message">{message.message}</p>
                            <hr />
                            <span>{message.name} ● {message.dateTime}</span>

                        </li>
                    ))}
                </ul>
               
              
                <form className="message-form" id="message-form" onSubmit={sendMessage} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '400px'
                }}>
                    <input
                        type="text"
                        name="message"
                        id="message-input"
                        className="message-input"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        style={style.textbox}
                    />
                    <div className="v-divider" style={{
                        height: '48px',
                        width: '2px',
                        backgroundColor: '#f6f6f6'
                    }}></div>
                    <button type="submit" className="send-button" style={style.button}>
                        send <span><i className="fas fa-paper-plane"></i></span>
                    </button>
                </form>
            </div>
            <h3 className="clients-total" id="client-total" style={{ margin: '20px 0', color: '#7e7e7e' }}>Total clients: {totalClients}</h3>
        </div>
    );
}
const style = {
    input: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#7e7e7e',
      flexGrow: '1',
      border: 'none',
      margin: '0px 12px',
      outline: 'none',
      backgroundColor: '#ebebeb',
    },
    textbox:{
        
            flexGrow: '1',
            height: '48px',
            fontSize: '16px',
            border: 'none',
            outline: 'none',
            padding: '0 12px',
            backgroundColor: '#fff'
        
    },
    button:{
        height: '48px',
        fontSize: '16px',
        border: 'none',
        padding: '0px 20px',
        outline: 'none',
        backgroundColor: '#fff',
        cursor: 'pointer'
    },
    heading:{
        border: '8px solid #dddddd',
        borderRadius: '24px',
        overflow: 'hidden'
    },
    section:{
        fontFamily: 'Open Sans, sans-serif',
        display: 'grid',
        placeItems: 'center',
        backgroundColor: '#ebebeb'
    }
  }

export default App;
