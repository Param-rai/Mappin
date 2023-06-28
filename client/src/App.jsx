import React, { useEffect, useState } from "react";
import { format } from "timeago.js";
import Map, { Marker, Popup, NavigationControl } from "react-map-gl";
import "./App.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { AiFillStar } from "react-icons/ai";
import axios from "axios";
import Register from "./components/Register";
import Login from "./components/Login";

function App() {
  const myStorage = window.localStorage;
  const [currentUser, setCurrentUser] = useState(myStorage.getItem("user"));
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(0);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const MAPBOX_TOKEN = import.meta.env.VITE_APP_MAPBOX;
  const [viewport, setViewport] = useState({
    latitude: 22.090214649119034,
    longitude: 78.47896529678519,
    zoom: 4,
  });

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get(
          "https://mappin-7xjq.onrender.com/api/pins"
        );
        setPins(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    getPins();
  }, []);

  const handleAddClick = (e) => {
    console.log(e);
    const { lng, lat } = e.lngLat;
    setNewPlace({
      lat,
      long: lng,
    });
  };

  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewport({ ...viewport, latitude: lat, longitude: long });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title,
      desc,
      rating,
      lat: newPlace.lat,
      long: newPlace.long,
    };

    try {
      const res = await axios.post(
        "https://mappin-7xjq.onrender.com/api/pins",
        newPin
      );
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    myStorage.removeItem("user");
    setCurrentUser(null);
  };

  return (
    <div className="App">
      <Map
        {...viewport}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
        doubleClickZoom={false}
        onDblClick={handleAddClick}
        onMove={(evt) => setViewport(evt.viewState)}
      >
        {pins.map((pin, i) => (
          <div key={i}>
            <Marker
              latitude={pin.lat}
              longitude={pin.long}
              offsetLeft={-3.5}
              offsetTop={-7}
              color={pin.username === currentUser ? "red" : "slateblue"}
              style={{
                cursor: "pointer",
              }}
              onClick={() => {
                handleMarkerClick(pin._id, pin.lat, pin.long);
              }}
            />

            {currentPlaceId === pin._id && (
              <Popup
                longitude={pin.long}
                latitude={pin.lat}
                anchor="left"
                closeButton={true}
                closeOnClick={false}
                onClose={() => setCurrentPlaceId(null)}
              >
                <div className="card">
                  <label>Place</label>
                  <h4 className="place">{pin.title}</h4>
                  <label>Review</label>
                  <p className="desc">{pin.desc}</p>
                  <label>Rating</label>
                  <div className="stars">
                    {Array(pin.rating).fill(<AiFillStar className="star" />)}
                  </div>
                  <label>Information</label>
                  <span className="username">
                    Created by <b>{pin.username}</b>
                  </span>
                  <span className="date">{format(pin.createdAt)}</span>
                </div>
              </Popup>
            )}
          </div>
        ))}

        {newPlace && (
          <Popup
            longitude={newPlace.long}
            latitude={newPlace.lat}
            anchor="left"
            closeButton={true}
            closeOnClick={false}
            onClose={() => setNewPlace(null)}
          >
            <div>
              <form onSubmit={handleSubmit} className="newPin">
                <label>Title</label>
                <input
                  type="text"
                  placeholder="Enter a title"
                  onChange={(e) => setTitle(e.target.value)}
                />
                <label>Review</label>
                <textarea
                  placeholder="Say something about place"
                  onChange={(e) => setDesc(e.target.value)}
                ></textarea>
                <label>Rating</label>
                <select onChange={(e) => setRating(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <button className="submitBtn" type="submit">
                  Add Plan
                </button>
              </form>
            </div>
          </Popup>
        )}
        <NavigationControl maxWidth={200} position="top-right" />

        {currentUser ? (
          <button className="button logout" onClick={handleLogout}>
            Log out
          </button>
        ) : (
          <div className="buttons">
            <button className="button login" onClick={() => setShowLogin(true)}>
              Log In
            </button>
            <button
              className="button register"
              onClick={() => setShowRegister(true)}
            >
              Register
            </button>
          </div>
        )}

        {showRegister && <Register setShowRegister={setShowRegister} />}
        {showLogin && (
          <Login
            setShowLogin={setShowLogin}
            myStorage={myStorage}
            setCurrentUser={setCurrentUser}
          />
        )}
      </Map>
    </div>
  );
}

export default App;
