import React, { useState } from 'react'
import "./weatherpage_style.css"
import moment from 'moment'
import { useEffect } from 'react'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Radio from '@material-ui/core/Radio';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { createStyles, useTheme, makeStyles, Theme } from '@material-ui/core/styles';
import { useHistory } from 'react-router';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      justifyContent: 'end',
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
    appBar: {
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
   
  }),
);

  


export const WeatherPage = () => {
  const [auth, setAuth] = React.useState(true);
  const history = useHistory()
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);


  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogOut = () => {
    localStorage.removeItem("token")
    sessionStorage.removeItem("user")
    history.push("/")
  }
  const [show, setShow] = React.useState(false);
  const handleClickShow = () => {
    setShow(true);
  };
  const handleHide = () => {
    setShow(false);
  };

 

  const [city, setCity] = useState("")
  const [temp, setTemp] = useState("")
  const [date, setDate] = useState("")
  const [weather, setWeather] = useState("")
  const [wind, setWind] = useState("")
  const [humidity, setHumidity] = useState<string>("")
  const [pressure, setPressure] = useState("")
  const [firstday, setFirstDay] = useState("")
  const [secondday, setSecondDay] = useState("")
  const [thirdday, setThirdDay] = useState("")
  const [firsttemp, setFirstTemp] = useState("")
  const [secondtemp, setSecondTemp] = useState("")
  const [thirdtemp, setThirdTemp] = useState("")
  const [latitude, setLatitude] = useState('40.4093')
  const [longitude, setLongitude] = useState('49.8671')
  const [coords, setCoords] = useState([latitude, longitude])
  const weekdays = ["Sunday", 'Monday', 'Tuesday', 'Wednesday', "Thursday", "Friday", "Saturday"]
  const [forecastedWeather, setForecastedWeather] = useState<string[]>([])
  const [location, setLocation] = useState<number[]>([])
  const [calc, setCalc] = useState(1)
  const [mark, setMark] = useState("°K")
  const [degree, setDegree] = useState(0)
  const [addDegree, setAddDegree] = useState(0)
  const [cityName,setCityName] = useState("")
  const [place,setPlace] = useState<any>('Baku')

  const [checked,setChecked] = useState<boolean>(false)
  function getCurrentLocation() {
    return navigator.geolocation.getCurrentPosition(function (position:any) {
      sessionStorage.setItem("latitude",String(position.coords.latitude))
      sessionStorage.setItem("longitude",String(position.coords.longitude))

    })
  }
useEffect(() => {
  const successfulGetLocation = (position:any) => {
    const {latitude,longitude} = position.coords
    fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=711b37fcea1a49bd89499ec24dafea27`).then(response => response.json()).then(data => {console.log(data.results[0].components.city)
  })}
    navigator.geolocation.getCurrentPosition(successfulGetLocation)

},[])

  useEffect(() => {
    window.addEventListener('load', getCurrentLocation);
  }, [])
  
  useEffect(() => {
    
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${String(Number(sessionStorage.getItem('latitude')).toFixed(2))}&lon=${String(Number(sessionStorage.getItem("longitude")).toFixed(2))}&appid=3567fe94af59f4eb83cd9d03c1b384a8`)
      .then(response => response.json()).then((data) => { console.log(data) })
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=3567fe94af59f4eb83cd9d03c1b384a8`).then(resp => resp.json()).then(data => {data == undefined ? console.log("loading") :setCity(data.city.name); setTemp(data.list[0].main.temp); setDate(data.list[0].dt_txt.split(" ")[0]); setWeather(data.list[0].weather[0].description); setWind(data.list[0].wind.speed); setHumidity(data.list[0].main.humidity); setPressure(data.list[0].main.pressure); setFirstDay(data.list[8].dt_txt); setSecondDay(data.list[16].dt_txt); setThirdDay(data.list[24].dt_txt); setFirstTemp(data.list[24].main.temp); setSecondTemp(data.list[16].main.temp); setThirdTemp(data.list[24].main.temp); setForecastedWeather([data.list[0].weather[0].description, data.list[8].weather[0].description, data.list[16].weather[0].description, data.list[24].weather[0].description])})
    if(checked == false){    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=3567fe94af59f4eb83cd9d03c1b384a8`).then(resp => resp.json()).then(data => { data == undefined ? console.log('loading') :console.log(data);setCity(data.city.name); setTemp(data.list[4].main.temp); setDate(data.list[4].dt_txt.split(" ")[0]); setWeather(data.list[4].weather[0].description); setWind(data.list[4].wind.speed); setHumidity(data.list[4].main.humidity); setPressure(data.list[4].main.pressure); setFirstDay(data.list[12].dt_txt); setSecondDay(data.list[20].dt_txt); setThirdDay(data.list[28].dt_txt); setFirstTemp(data.list[28].main.temp); setSecondTemp(data.list[20].main.temp); setThirdTemp(data.list[28].main.temp); setForecastedWeather([data.list[4].weather[0].description, data.list[12].weather[0].description, data.list[20].weather[0].description, data.list[28].weather[0].description])})
  }
    }, [place,checked])
  const firstforecast = moment(firstday).day()
  const secondforecast = moment(secondday).day()
  const thirdforecast = moment(thirdday).day()

  const localdate = moment(date);
  const dayOfWeek = localdate.day();
  const [selectedValue, setSelectedValue] = React.useState('b');
const [display,setDisplay] = useState("none")
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
  };
const [float,setFloat ] = useState("left")

/*
https://github.com/HMugera/Weather-app
https://github.com/HMugera/Weather-app
https://github.com/asishgeorge/weather-website/blob/master/index.html
https://github.com/ravindu9802/React-Weather-App
https://devchallenges.io/challenges/mM1UIenRhK808W8qmLWv
https://github.com/TylerPottsDev/weather-react
https://github.com/akashyap2013/Weather_App
https://reactweatherapp.com/
https://github.com/denniskigen/react-weather
https://github.com/codebucks27/React-Weather-app
https://github.com/Gigacore/react-weather-forecast
https://github.com/mattiaerre/react-open-weather-map
https://github.com/farahat80/react-open-weather
https://github.com/iamsainikhil/weather-react
https://github.com/alexkowsik/react-weather-app

*/
 
   


  return (
    <body className="body" style={{backgroundSize:"cover",backgroundImage:checked == false ? 'url("https://wallpaperaccess.com/full/4929556.png")' : 'url("https://images.unsplash.com/photo-1559311745-a57f6233488e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80")'}}>
         {place ? '' : <Backdrop className={classes.backdrop} open>
        <CircularProgress color="inherit" />
        <h3 style={{ display: "block", marginLeft: '1rem' }}>    Loading ... </h3>
      </Backdrop>}
     <div className={classes.root} style={{ backgroundColor: "#151414",position:"fixed",width:"100%",top:"0%" }}>
        <AppBar position="static" style={{ backgroundColor: "#151414" }}>
          <Toolbar >
    
            <Typography variant="h6" onClick={() => { history.push("/covid"); window.location.reload() }} style={{ padding: " 0 2rem",cursor: "pointer" }} className={`header-link ${classes.title}`}>Covid Statistics</Typography>
            <Typography variant="h6" style={{ cursor: "pointer" }} className={'link head-link'} onClick={() => history.push("/main")} >Home Page</Typography>
            <Typography variant="h6" style={{ cursor: "pointer", padding: " 0 1rem 0 2rem" }} className={"head-link"} >{sessionStorage.getItem('user')}</Typography>
            {auth && (
              <div>
                             {sessionStorage.getItem("userImage") != null ? <img alt="menu" onClick={handleMenu} style={{ width: "40px", borderRadius: '50%' }} src={String(sessionStorage.getItem('userImage'))} /> : <div onClick={handleMenu} style={{ width: "40px", height: "40px", paddingTop: "5px", borderRadius: '50%', backgroundColor: `#3F51B5`, color: 'white' }}><h4>{sessionStorage.getItem('user')?.charAt(0)}</h4></div>}

                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={open}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleLogOut}>Log Out</MenuItem>
                </Menu>
              </div>
            )}
          </Toolbar>
        </AppBar>
      </div>
      <div className="contain">
  <div className="switch">
    <label htmlFor="toggle" style={{padding:'5px'}}>
      <input id="toggle" className="toggle-switch" onClick={() => {setChecked(checked == false ? true : false);}} checked={checked} type="checkbox"></input>
      <div className="sun-moon"><div className="dots"></div></div>
      <div className="background"><div className="stars1"></div><div className="stars2"></div></div>
    </label>
  </div>
</div>
 

 <div className="mainpage_container container" style={{marginTop:"50px"}}>
        <div className="weather-side" style={{backgroundSize:"cover",backgroundImage : checked == false ? 'url("https://i.gifer.com/CTa.gif")' : String(forecastedWeather[0]).indexOf("clear") != -1 ? 'url("https://phoneky.co.uk/thumbs/screensavers/down/nature/sunnylands_odo3axeu.gif")' : String(forecastedWeather[0]).indexOf("broken") != -1 || String(forecastedWeather[0]).indexOf("scattered") != -1 ? 'url("https://phoneky.co.uk/thumbs/screensavers/down/places/lightatthe_8e1hv56b.gif")' : String(forecastedWeather[0]).indexOf("rain") != -1 ? 'url("https://media3.giphy.com/media/oSaLJmbUgZQm4/giphy.gif")' : 'url("https://thumbs.gfycat.com/GreatBasicCranefly-max-1mb.gif")'}}>
          <div className="weather-gradient"></div>
          <div className="date-container">
            <h2 className="date-dayname" onClick={getCurrentLocation}>{weekdays[dayOfWeek]}</h2><span className="date-day">{date}</span><i className="location-icon" data-feather="map-pin"></i><span className="location">{city}</span>
          </div>
          <div className="weather-container"><i className="weather-icon" data-feather="sun"></i>
            <h1 className="weather-temp">{`${(Math.round(Number(temp) - degree) * calc * 10) / 10 + addDegree} ${mark}`}</h1>
            <h3 className="weather-desc" style={{ textTransform: 'capitalize' }}>{weather}</h3>
          </div>
        </div>
        <div className="info-side">
          
          <div className="today-info-container" style={display !== "none" ? {display:"none"} :  {display:"block"}}>
       
            <Radio
              checked={selectedValue === 'a'}
              onChange={handleChange}
              onClick={() => { setDegree(273.15); setMark("°C"); setCalc(1); setAddDegree(0) }}
              value="a"
              color="default"
              name="radio-button-demo"
              inputProps={{ 'aria-label': 'A' }}
              id="celcius"
            />Celcius
            <Radio
              checked={selectedValue === 'b'}
              onChange={handleChange}
              onClick={() => { setDegree(0); setMark("°K"); setCalc(1); setAddDegree(0) }}
              value="b"
              color="default"
              name="radio-button-demo"
              inputProps={{ 'aria-label': 'B' }}
              id="kelvin"
            />Kelvin
            <Radio
              checked={selectedValue === 'd'}
              onChange={handleChange}
              onClick={() => { setDegree(273.15); setMark("°F"); setCalc(9 / 5); setAddDegree(32) }}
              value="d"
              color="default"
              name="radio-button-demo"
              inputProps={{ 'aria-label': 'D' }}
              id="fehrenheit"
            />Fehrenheit
            <div className="today-info">
              <div className="wind"> <span className="title">WIND</span><span className="value">{wind} km/h</span>
                <div className="clear"></div>
              </div>
              <div className="humidity"> <span className="title">HUMIDITY</span><span className="value">{humidity} %</span>
                <div className="clear"></div>
              </div>
              <div className="pressure"> <span className="title">PRESSURE</span><span className="value">{pressure}</span>
                <div className="clear"></div>
              </div>
            </div>
          </div>
          <div className="week-container" style={display !== "none" ? {display:"none"} :  {display:"block"}}>
            <ul className="week-list">
              <li className="active">{checked == false ? <i className="fas fa-moon"></i> : String(forecastedWeather[0]).indexOf("clear") != -1 ? <img  style={{width:"2.7rem"}}  src="https://media.baamboozle.com/uploads/images/124085/1618639708_18167_gif-url.gif"></img> : String(forecastedWeather[0]).indexOf("broken") != -1 ? <img style={{width:"2.7rem"}} src="https://www.emoji.com/wp-content/uploads/filebase/3d%20icons/emoji-3d%20icons-glossy-3d-icons-sun-behind-small-cloud-72dpi-forPersonalUseOnly.gif"></img> : String(forecastedWeather[0]).indexOf("rain") != -1 ? <i className="fas fa-cloud-showers-heavy"></i> : <i className="fas fa-cloud"></i>}<span className="day-name">{String(weekdays[dayOfWeek]).slice(0, 3)}</span><span className="day-temp">{`${(Math.round(Number(temp) - degree) * 10 * calc) / 10 + addDegree}${mark}`}</span></li>
              <li>{ checked == false ? <i className="fas fa-moon"></i> : String(forecastedWeather[1]).indexOf("clear") != -1 ? <img  style={{width:"2.7rem"}}  src="https://media.baamboozle.com/uploads/images/124085/1618639708_18167_gif-url.gif"></img> : String(forecastedWeather[1]).indexOf("broken") != -1 ? <i className="fas fa-cloud-sun"></i> : String(forecastedWeather[1]).indexOf("rain") != -1 ? <i className="fas fa-cloud-showers-heavy"></i> : <i className="fas fa-cloud"></i>}<span className="day-name">{String(weekdays[firstforecast]).slice(0, 3)}</span><span className="day-temp">{`${(Math.round(Number(firsttemp) - degree) * 10 * calc) / 10 + addDegree}${mark}`}</span></li>
              <li>{checked == false ? <i className="fas fa-moon"></i> : String(forecastedWeather[2]).indexOf("clear") != -1 ? <img  style={{width:"2.7rem"}}  src="https://media.baamboozle.com/uploads/images/124085/1618639708_18167_gif-url.gif"></img>: String(forecastedWeather[2]).indexOf("broken") != -1 ? <i className="fas fa-cloud-sun"></i> : String(forecastedWeather[2]).indexOf("rain") != -1 ? <i className="fas fa-cloud-showers-heavy"></i> : <i className="fas fa-cloud"></i>}<span className="day-name">{String(weekdays[secondforecast]).slice(0, 3)}</span><span className="day-temp">{`${(Math.round(Number(secondtemp) - degree) * 10 * calc) / 10 + addDegree}${mark}`}</span></li>
              <li>{checked == false ? <i className="fas fa-moon"></i> : String(forecastedWeather[3]).indexOf("clear") != -1 ? <img  style={{width:"2.7rem"}}  src="https://media.baamboozle.com/uploads/images/124085/1618639708_18167_gif-url.gif"></img>: String(forecastedWeather[3]).indexOf("broken") != -1 ? <i className="fas fa-cloud-sun"></i> : String(forecastedWeather[3]).indexOf("rain") != -1 ? <i className="fas fa-cloud-showers-heavy"></i> : <i className="fas fa-cloud"></i>}<span className="day-name">{String(weekdays[thirdforecast]).slice(0, 3)}</span><span className="day-temp">{`${(Math.round(Number(thirdtemp) - degree) * 10 * calc) / 10 + addDegree}${mark}`}</span></li>
              <div className="clear"></div>
            </ul>
          </div>



          <div style={{display:display,marginTop:"5rem"}}>
            <label style={{color:"white"}}> Enter City Name</label>
          <input type="text" onChange={(e) => setCityName(e.target.value) }style={{width:"80%",margin:"0 auto",backgroundColor:"white",color:"black"}}></input>
        <button type="button" className={'add-button'} onClick={() => {setPlace(cityName);setDisplay("none");setFloat("left")}}>Add New Location</button>
        </div>
          <div className="location-container" style={display !== "none" ? {display:"none"} :  {display:"block"}}>
      
            <button className="location-button" onClick={() => {setDisplay("block");setFloat("both")}} id="change-location"> <i data-feather="map-pin"></i><span>Change location</span></button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
              <DialogTitle id="form-dialog-title">Add City Coordinates</DialogTitle>
              <DialogContent>
              {/* onClick={handleClickOpen} */}
                <TextField
                  autoFocus
                  value={latitude}
                  onChange={(e) => {setLatitude(e.target.value) }}
                  margin="dense"
                  id="latitude"
                  label="Latitude"
                  type="number"
                  fullWidth
                />
                <TextField
                  autoFocus
                  value={longitude}
                  onChange={(e) => { setLongitude(e.target.value) }}
                  margin="dense"
                  id="longitude"
                  label="Longitude"
                  type="number"
                  fullWidth
                />
                 <TextField
                  autoFocus
                  value={place}
                  onChange={(e) => { setPlace(e.target.value)}}
                  margin="dense"
                  id="place"
                  label="place"
                  type="test"
                  fullWidth
                />
              </DialogContent>
              <h4 style={{ textAlign: "center", marginTop: "1rem" }}>Coords of Some Cities</h4>
              <table className="table table-bordered table-hovered w-75 mb-3" style={{ textAlign: "center", margin: "0 auto" }}>
                <thead className="table-dark">
                  <tr>
                    <th style={{ fontWeight: "bold" }}> City </th>
                    <th style={{ fontWeight: "bold" }}>Latitude</th>
                    <th style={{ fontWeight: "bold" }}>Longitude</th>
                  </tr>
                </thead><tbody>
                  <tr>
                    <td>Baku</td>
                    <td>40.4093</td>
                    <td>49.8671</td>
                  </tr>
                  <tr>
                    <td>Istanbul</td>
                    <td>41.0082</td>
                    <td>28.9784</td>
                  </tr>
                  <tr>
                    <td>Paris</td>
                    <td>48.8566</td>
                    <td>2.3522</td>
                  </tr>
                  <tr>
                    <td>London</td>
                    <td>51.5074</td>
                    <td>0.1278</td>
                  </tr>
                  <tr>
                    <td>Barcelona</td>
                    <td> 41.3851</td>
                    <td>2.1734</td>
                  </tr>
                  <tr>
                    <td>Moscow</td>
                    <td> 55.7558</td>
                    <td>37.6173</td>
                  </tr>
                </tbody>
              </table>
              <DialogActions>
                <Button onClick={handleClose} color="default">
                  Cancel
                </Button>
                <Button onClick={() => { handleClose(); setCoords([latitude, longitude]) }} color="default">
                  Add
                </Button>
              </DialogActions>
            </Dialog>
          </div>
          
        </div>
       
      </div>
    </body>
  )
}

export default WeatherPage