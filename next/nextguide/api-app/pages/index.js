import React, { useState, useRef } from "react";

const HomePage = () => {
  const [apiDataItems, setApiDataItems] = useState([]);

  const nameInputRef = useRef();
  const emailInputRef = useRef();
  const messageInputRef = useRef();

  function submitFormHandler(event) {
    event.preventDefault();
    const enteredname = nameInputRef.current.value;
    const enteredEmail = emailInputRef.current.value;
    const enteredMessage = messageInputRef.current.value;

    const reqBody = {
      name: enteredname,
      email: enteredEmail,
      text: enteredMessage,
    };

    fetch("/api/feedback", {
      method: "POST",
      body: JSON.stringify(reqBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => console.log(data));
  }

  function getDataFromApiHandler() {
    fetch("/api/feedback")
      .then((response) => response.json())
      .then((data) => {
        setApiDataItems(data.message);
      });
  }

  return (
    <main>
      <h1>Home page</h1>

      <form onSubmit={submitFormHandler}>
        <div>
          <label htmlFor="name">your name</label>
          <input type="text" id="name" ref={nameInputRef} />
        </div>
        <div>
          <label htmlFor="email">your email address</label>
          <input type="email" id="email" ref={emailInputRef} />
        </div>
        <div>
          <label htmlFor="message">your email address</label>
          <textarea id="message" rows="10" ref={messageInputRef}></textarea>
          <button type="submit">Send Message</button>
        </div>
      </form>
      <hr />

      <button onClick={getDataFromApiHandler}>Get Data</button>

      <div>
        {apiDataItems &&
          apiDataItems.map((item) => (
            <div key={item.id}>
              <h2>{item.name}</h2>
              <h2>{item.email}</h2>
              <h2>{item.text}</h2>
            </div>
          ))}
      </div>
    </main>
  );
};

export default HomePage;
