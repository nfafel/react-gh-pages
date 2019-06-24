import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup'

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      version: null,
      cars: null,
      shouldGetPostData: false,
      shouldGetPutData: false,
      carIdUpdate: null
    }
  }
  
  componentDidMount() {
    this.getVersionData()
      .then(res => this.setState({ version: res.version }))
      .catch(err => console.log(err));

    this.getCarsData()
      .then(res => this.setState({ cars: res.cars }))
      .catch(err => console.log(err));
  }

  // Fetches our GET route from the Express server. (Note the route we are fetching matches the GET route from server.js
  getVersionData = async() => {
    const response = await fetch('https://tranquil-caverns-41069.herokuapp.com/version');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body) 
    }
    return body;
  };

  getCarsData = async() => {
    const response = await fetch('https://tranquil-caverns-41069.herokuapp.com/cars');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body) 
    }
    return body;
  };

  callDeleteData(carId) {
    this.deleteData(carId)
      .then(res => this.setState({cars: res.cars}))
      .catch(err => console.log(err));
  }

  deleteData = async(carId) => {
    const response = await fetch(`https://tranquil-caverns-41069.herokuapp.com/cars/${carId}`, {
      method: 'DELETE'
    });
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body) 
    }
    return body;
  }

  getPutData(car, setValues) {
    this.setState({
      shouldGetPutData: true,
      carIdUpdate: car._id
    });
    setValues({
      make: car.make,
      model: car.model,
      year: car.year,
      rating: car.rating
    });
  }

  callPutData(carId, values) {
    this.putData(carId, values)
    .then(res => this.setState({ 
        cars: res.cars,
        shouldGetPostData: false,
        shouldGetPutData: false,
        carIdUpdate: null
      }))
    .catch(err => console.log(err));
  }

  putData = async(carId, values) => {
    const response = await fetch(`https://tranquil-caverns-41069.herokuapp.com/cars/${carId}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        make: values.make,
        model: values.model,
        year: values.year,
        rating: values.rating
      })
    });
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body) 
    }
    return body;
  }

  getPostData(setValues) {
    this.setState({shouldGetPostData: true});
    setValues({
      make: "",
      model: "",
      year: "",
      rating: ""
    })
  }

  callPostData(values) {
    this.postData(values)
      .then(res => this.setState({ 
          cars: res.cars,
          shouldGetPostData: false,
          shouldGetPutData: false,
          carIdUpdate: null,
        }))
      .catch(err => console.log(err));
  }

  postData = async(values) => {
    const response = await fetch('https://tranquil-caverns-41069.herokuapp.com/cars', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        make: values.make,
        model: values.model,
        year: values.year,
        rating: values.rating
      })
    });
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body) 
    }
    return body;
  }

  tableStyles() {
    return ({
      "width": "80%",
      "border-collapse": "collapse",
      "border": "1px solid #dddddd",
      "margin": "1em auto"
    });
  };

  rowColStyles() {
    return ({
      "border-collapse": "collapse",
      "border": "1px solid #dddddd"
    });
  };
  
  updateRowForm = (values) => {
    return (
      <tr style={this.rowColStyles()}>
          <td>
            <Field type="text" name="make" />
            <ErrorMessage name="make" />
          </td>
          <td>
            <Field type="text" name="model" />
            <ErrorMessage name="model" />
          </td>
          <td>
            <Field type="text" name="year" />
            <ErrorMessage name="year" />
          </td>
          <td>
            <Field type="text" name="rating" />
            <ErrorMessage name="rating" />
          </td>
          <td>
            <button type="button" onClick={() => this.callPutData(this.state.carIdUpdate, values)}>UPDATE</button>
          </td>
      </tr>
    )
  }

  newCarForm = () => {
    return (
      <tr style={this.rowColStyles()}>
          <td>
            <Field type="text" name="make" placeHolder="Make" />
            <ErrorMessage name="make" />
          </td>
          <td>
            <Field type="text" name="model" placeHolder="Model" />
            <ErrorMessage name="model" />
          </td>
          <td>
            <Field type="text" name="year" placeHolder="Year" />
            <ErrorMessage name="year" />
          </td>
          <td>
            <Field type="text" name="rating" placeHolder="Rating" />
            <ErrorMessage name="rating" />
          </td>
          <td>
            <button type="button" onClick={()=>{this.setState({shouldGetPostData:false})}}>cancel</button>
            <button type="submit">SUMBIT</button>
          </td>
      </tr>
  )}

  getCarsDisplay = (setValues, values) => {
    var carsDisplay;
    if (this.state.cars == null) {
      carsDisplay = <tr style={this.rowColStyles()}>"Loading ..."</tr>;
    } else {
      carsDisplay = this.state.cars.map((car) => { 
        if (this.state.shouldGetPutData && car._id === this.state.carIdUpdate) {
          return (this.updateRowForm(values));
        } else if (this.state.shouldGetPostData || this.state.shouldGetPutData) {
          return (
          <tr style={this.rowColStyles()}>
            <td>{car.make}</td>
            <td>{car.model}</td>
            <td>{car.year}</td>
            <td> {car.rating} </td>
            <td></td>
          </tr>)
        } else {
          return (
            <tr style={this.rowColStyles()}>
              <td>{car.make}</td>
              <td>{car.model}</td>
              <td>{car.year}</td>
              <td> {car.rating} </td>
              <td>
                <button type="button" style={{"margin-bottom":"1em"}} onClick={() => this.getPutData(car, setValues)}>EDIT</button>
                <button type="button" style={{"margin-bottom":"1em"}} onClick={() => this.callDeleteData(car._id)}>DELETE</button> 
              </td>
            </tr>)
        }
      });
      if (this.state.shouldGetPostData) {
        carsDisplay.push([this.newCarForm()]);
      }
    }
    return carsDisplay;
  }

  handleCorrectSumbit = (values) => {
    if (this.state.shouldGetPostData) {
      this.callPostData(values);
    } else {
      this.callPutData(this.state.carIdUpdate, values);
    }
  }

  CarValidationSchema = Yup.object().shape({
    make: Yup.string()
      .required('Required'),
    model: Yup.string()
      .required('Required'),
    year: Yup.number('Must be a number')
      .integer('Must be an Integer')
      .min(1885, "Too Old!")
      .required('Required'),
    rating: Yup.number('Must be a number')
      .positive('Must be positive')
      .integer('Must be an Integer')
      .min(0, 'Rating must be 0-10')
      .max(10, 'Rating must be 0-10')
      .required('Required')
  })

  render() {

    var versionText;
    if (this.state.version == null) {
      versionText = "Loading ...";
    } else {
      versionText = this.state.version;
    }

    return(
      <div className="App">
        <header className="App-header" style={{"height":"50%"}}>
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
          <p>{versionText}</p>
        </header>

        <Formik
          initialValues = {{make: '', model: '', year: '', rating: ''}}
          validationSchema={this.CarValidationSchema}
          onSubmit = {(values) => {
            this.handleCorrectSumbit(values)
          }}
        >
        {({setValues, values}) => (
          <Form>
            <table style={this.tableStyles()}>
              <tr style={this.rowColStyles()}>
                <th>Make</th>
                <th>Model</th>
                <th>Year</th>
                <th>Rating</th>
                <th>Action</th>
              </tr>
              {this.getCarsDisplay(setValues, values)}
            </table>
            <button type="button" style={{"margin-bottom":"1em"}} onClick={() => this.getPostData(setValues)}>NEW CAR</button>
          </Form>
        )}
        </Formik>

      </div>
    );
  }
}

export default App;


/*
import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup'

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      version: null,
      cars: null,
      shouldGetPostData: false,
      shouldGetPutData: false,
      carIdUpdate: null
    }
  }
  
  componentDidMount() {
    this.getVersionData()
      .then(res => this.setState({ version: res.version }))
      .catch(err => console.log(err));

    this.getCarsData()
      .then(res => this.setState({ cars: res.cars }))
      .catch(err => console.log(err));
  }

  // Fetches our GET route from the Express server. (Note the route we are fetching matches the GET route from server.js
  getVersionData = async() => {
    const response = await fetch('https://tranquil-caverns-41069.herokuapp.com/version');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body) 
    }
    return body;
  };

  getCarsData = async() => {
    const response = await fetch('https://tranquil-caverns-41069.herokuapp.com/cars');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body) 
    }
    return body;
  };

  callDeleteData(carId) {
    this.deleteData(carId)
      .then(res => this.setState({cars: res.cars}))
      .catch(err => console.log(err));
  }

  deleteData = async(carId) => {
    const response = await fetch(`https://tranquil-caverns-41069.herokuapp.com/cars/${carId}`, {
      method: 'DELETE'
    });
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body) 
    }
    return body;
  }

  getPutData(car, setValues) {
    this.setState({
      shouldGetPutData: true,
      carIdUpdate: car._id
    });
    setValues({
      make: car.make,
      model: car.model,
      year: car.year,
      rating: car.rating
    });
  }

  callPutData(carId, values) {
    this.putData(carId, values)
    .then(res => this.setState({ 
        cars: res.cars,
        shouldGetPostData: false,
        shouldGetPutData: false,
        carIdUpdate: null
      }))
    .catch(err => console.log(err));
  }

  putData = async(carId, values) => {
    const response = await fetch(`https://tranquil-caverns-41069.herokuapp.com/cars/${carId}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        make: values.make,
        model: values.model,
        year: values.year,
        rating: values.rating
      })
    });
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body) 
    }
    return body;
  }

  getPostData(setValues) {
    this.setState({shouldGetPostData: true});
    setValues({
      make: "",
      model: "",
      year: "",
      rating: ""
    })
  }

  callPostData(values) {
    this.postData(values)
      .then(res => this.setState({ 
          cars: res.cars,
          shouldGetPostData: false,
          shouldGetPutData: false,
          carIdUpdate: null,
        }))
      .catch(err => console.log(err));
  }

  postData = async(values) => {
    const response = await fetch('https://tranquil-caverns-41069.herokuapp.com/cars', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        make: values.make,
        model: values.model,
        year: values.year,
        rating: values.rating
      })
    });
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body) 
    }
    return body;
  }

  tableStyles() {
    return ({
      "width": "80%",
      "border-collapse": "collapse",
      "border": "1px solid #dddddd",
      "margin": "1em auto"
    });
  };

  rowColStyles() {
    return ({
      "border-collapse": "collapse",
      "border": "1px solid #dddddd"
    });
  };
  
  updateRowForm = (handleChange, values, errors) => {
    return (
      <tr style={this.rowColStyles()}>
          <td>
            <input onChange={handleChange} 
                  value={values.make} 
                  type="text" 
                  name="make"
                  placeholder="Make">
            </input>
            {errors.make}
          </td>
          <td>
            <input onChange={handleChange} 
                  value={values.model} 
                  type="text" 
                  name="model"
                  placeholder="Model">
            </input>
          </td>
          <td>
            <input onChange={handleChange} 
                  value={values.year} 
                  type="text" 
                  name="year"
                  placeholder="Year">
            </input>
          </td>
          <td>
            <input onChange={handleChange} 
                  value={values.rating} 
                  type="text" 
                  name="rating"
                  placeholder="Rating">
            </input>
          </td>
          <td>
            <button type="submit">UPDATE</button>
          </td>
      </tr>
    )
  }

  newCarForm = (handleChange, values, errors) => {
    return (
      <tr style={this.rowColStyles()}>
          <td>
            <input onChange={handleChange} 
                  value={values.make} 
                  type="text" 
                  name="make"
                  placeholder="Make">
            </input>
          </td>
          <td>
            <input onChange={handleChange} 
                  value={values.model} 
                  type="text" 
                  name="model"
                  placeholder="Model">
            </input>
          </td>
          <td>
            <input onChange={handleChange} 
                  value={values.year} 
                  type="text" 
                  name="year"
                  placeholder="Year">
            </input>
          </td>
          <td>
            <input onChange={handleChange} 
                  value={values.rating} 
                  type="text" 
                  name="rating"
                  placeholder="Rating">
            </input>
          </td>
          <td>
            <button type="button" onClick={()=>{this.setState({shouldGetPostData:false})}}>cancel</button>
            <button type="submit">SUMBIT</button>
          </td>
      </tr>
  )}

  getCarsDisplay = (handleChange, values, setValues, errors) => {
    var carsDisplay;
    if (this.state.cars == null) {
      carsDisplay = <tr style={this.rowColStyles()}>"Loading ..."</tr>;
    } else {
      carsDisplay = this.state.cars.map((car) => { 
        if (this.state.shouldGetPutData && car._id === this.state.carIdUpdate) {
          return (this.updateRowForm(handleChange, values, errors));
        } else {
          return (
          <tr style={this.rowColStyles()}>
            <td>{car.make}</td>
            <td>{car.model}</td>
            <td>{car.year}</td>
            <td> {car.rating} </td>
            <button type="button" style={{"margin-bottom":"1em"}} onClick={() => this.getPutData(car, setValues)}>EDIT</button>
            <button type="button" style={{"margin-bottom":"1em"}} onClick={() => this.callDeleteData(car._id)}>DELETE</button> 
          </tr>)
        }
      });
      if (this.state.shouldGetPostData) {
        carsDisplay.push([this.newCarForm(handleChange, values, errors)]);
      }
    }
    return carsDisplay;
  }

  handleCorrectSumbit = (values) => {
    if (this.state.shouldGetPostData) {
      this.callPostData(values);
    } else {
      this.callPutData(this.state.carIdUpdate, values);
    }
  }

  CarValidationSchema = Yup.object().shape({
    make: Yup.string()
      .required('Required'),
    model: Yup.string()
      .required('Required'),
    year: Yup.number()
      .integer('Must be an Integer')
      .min(1885, "Too Old!")
      .required('Required'),
    rating: Yup.number()
      .integer('Must be an Integer')
      .min(0, 'Rating must by 0-10')
      .max(10, 'Rating must by 0-10')
  })

  render() {

    var versionText;
    if (this.state.version == null) {
      versionText = "Loading ...";
    } else {
      versionText = this.state.version;
    }

    return(
      <div className="App">
        <header className="App-header" style={{"height":"50%"}}>
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
          <p>{versionText}</p>
        </header>

        <Formik
          initialValues = {{make: this.state.newCarMake, model: this.state.newCarModel, year: this.state.newCarYear, rating: this.state.newCarRating}}
          validationSchema={this.CarValidationSchema}
          onSubmit = {(values) => {
            this.handleCorrectSumbit(values)
          }}
        >
        {({ handleSubmit, handleChange, values, setValues, errors }) => (
          <form onSubmit={handleSubmit}>
            <table style={this.tableStyles()}>
              <tr style={this.rowColStyles()}>
                <th>Make</th>
                <th>Model</th>
                <th>Year</th>
                <th>Rating</th>
                <th>Action</th>
              </tr>
              {this.getCarsDisplay(handleChange, values, setValues, errors)}
            </table>
            <button type="button" style={{"margin-bottom":"1em"}} onClick={() => this.getPostData(setValues)}>NEW CAR</button>
          </form>
        )}
        </Formik>

      </div>
    );
  }
}

export default App;
*/

