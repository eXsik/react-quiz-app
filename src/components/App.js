import React, { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";

const initialState = {
  questions: [],

  //'loadinh', 'error', 'ready', 'active', 'finished'
  status: "loading",
  index: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return { ...state, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...state, status: "error" };
    case "start": 
      return {...state, status: "active"};
    default:
      throw new Error("Action unknown");
  }
}

const App = () => {
  const [ state, dispatch] = useReducer(reducer, initialState);

  const numQuestions = state.questions.length;

  useEffect(() => {
    fetch("http://localhost:8000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);
  return (
    <div className="app">
      <Header />

      <Main>
      
        {state.status === "loading" && <Loader />}
        {state.status === "error" && <Error />}
        {state.status === "ready" && <StartScreen numQuestions={numQuestions} dispatch={dispatch} />}
        {state.status === "active" && <Question question={state.questions[state.index]} />}

      </Main>
    </div>
  );
};

export default App;
