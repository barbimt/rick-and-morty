import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

import logo from "./images/logo.png";
import Loader from "./components/Loader";

function CharacterCard(props) {
  const { character } = props;

  return (
    <div
      className="CharacterCard"
      style={{ backgroundImage: `url(${character.image})` }}
    >
      <div className="CharacterCard__name-container text-truncate">
        {character.name}
      </div>
    </div>
  );
}

class App extends React.Component {
  state = {
    loading: true, //cuando la app empieza, comienza buscando los datos, esto es como se incializa la app
    error: null,
    data: {
      info: {},
      results: [],
    },
    nextPage: 1,
  };

  componentDidMount() {
    this.fetchCharacters();
  }

  //no me regresa los datos, es una respuesta, y a esa respuesta si le puedo sacar los datos, usando response.json, esto es otra función asíncrona, asi q hay q esperarla.
  fetchCharacters = async () => {
    this.setState({ loading: true, error: null }); //quiere decir q estamos cargando datos, comenzamos ocn loading true y no hay error

    //esta petición la vamos a intentar, si falla, capturamos el error.
    try {
      const response = await fetch(
        `https://rickandmortyapi.com/api/character/?page=${this.state.nextPage}`
      );
      const data = await response.json();

      //a los datos los queremos guardar, asi que lo guardamos en el estado de este componente.
      this.setState({
        loading: false,
        data: {
          info: data.info,
          results: [].concat(this.state.data.results, data.results),
        },
        nextPage: this.state.nextPage + 1,
      });
    } catch (error) {
      this.setState({ loading: false, error: error });
    }
  };

  render() {
    if (this.state.error) {
      return "Error!";
    }

    return (
      <div className="container">
        <div className="App">
          <img className="Logo" src={logo} alt="Rick y Morty" />
          <ul className="row">
            {this.state.data.results.map((character) => (
              <li className="col-6 col-md-3" key={character.id}>
                <CharacterCard character={character} />
              </li>
            ))}
          </ul>
          {this.state.loading && (
            <div className="loader">
              <Loader />
            </div>
          )}

          {!this.state.loading && this.state.data.info.next && (
            <button onClick={() => this.fetchCharacters()}>Load More</button>
          )}
        </div>
      </div>
    ); //boton ver más, para cuando no esté el loading en la app,
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
