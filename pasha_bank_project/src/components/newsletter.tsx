import React, { useState } from 'react'
import './newsletterStyle.scss'
import { useHistory, useParams } from 'react-router';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { useEffect } from 'react';
import { useSelector } from "react-redux";
import Footer from './footer'
import $ from 'jquery';
declare const window: any;
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

export const NewsById = () => {
  const [textToSpeech, setTextToSpeech] = useState<string>()
  let speech: SpeechSynthesisUtterance
  try {
    speech = new SpeechSynthesisUtterance()
  } catch (e) {
    disableButton()
    showUnsupportedMessage()
  }
  function disableButton() {
    const button: any = document.getElementById('speak-btn')
    button.disabled = ''
  }
  function showUnsupportedMessage() {
    const unsupported = document.getElementById('unsupported')
    unsupported?.classList.add('show')
  }
  const [comment, setComment] = useState<string>()
  const params = useParams();
  const id = (Object(params).id)
  const auth = true;
  const [info, setInfo] = useState<any>()
  const [newsdata, setNewsdata] = useState<any>()
  const [headData, setHeadData] = useState<any>()
  useEffect(() => {
    /* https://newsapi.org/v2/everything?q=Apple&from=2021-06-28&sortBy=popularity&apiKey=fc951feaf1ed4dc6ba4edba127305bde */
    fetch("https://api.npoint.io/dcc23450af36f09da393").then((resp) => resp.json()).then(data => { setNewsdata(data.articles) })
    fetch("https://api.npoint.io/a05e4d423619db61e3d9").then((resp) => resp.json()).then(data => { setHeadData(data.articles) })
    fetch("https://api.npoint.io/b29bcd11b992df4ab8fa").then((resp) => resp.json()).then(data => { setInfo(data) })
    /* https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=fc951feaf1ed4dc6ba4edba127305bde*/
  }, [])
  const [notesDisplay, setNotesDisplay] = useState("none")
  const history = useHistory()
  const state = useSelector((state: any) => state);
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event?.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogOut = () => {
    localStorage.removeItem("token")
    sessionStorage.removeItem("user")
    history.push("/")
  }
  const randomGenerator = 13
  try {
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    var recognition = new SpeechRecognition();
  }
  catch (e) {

    $('.no-browser-support').show();
    $('.app').hide();
  }
  var noteTextarea = $('#note-textarea');
  var instructions = $('#recording-instructions');
  var notesList = $('ul#notes');
  var noteContent: any = '';
  // Get all notes from previous sessions and display them.
  var notes = getAllNotes();
  renderNotes(notes);
  recognition.continuous = true;
  recognition.onresult = function (event: any) {
    var current = event.resultIndex;
    var transcript = event.results[current][0].transcript;
    var mobileRepeatBug = (current === 1 && transcript === event.results[0][0].transcript);
    if (!mobileRepeatBug) {
      noteContent += transcript;
      noteTextarea.val(noteContent);
    }
  };
  recognition.onstart = function () {
    instructions.text('Voice recognition activated. Try speaking into the microphone.');
  }
  recognition.onspeechend = function () {
    instructions.text('You were quiet for a while so voice recognition turned itself off.');
  }
  recognition.onerror = function (event: any) {
    if (event.error === 'no-speech') {
      instructions.text('No speech was detected. Try again.');
    };
  }
  const [display, setDisplay] = useState<string>('inline-block')
  $('#start-record-btn').on('click', function (e) {
    if (noteContent.length) {
      noteContent += ' ';
    }
    recognition.start();
  });
  $('#pause-record-btn').on('click', function (e) {
    recognition.stop();
    instructions.text('Voice recognition paused.');
  });
  noteTextarea.on('input', function () {
    noteContent = $(this).val();
  })
  $('#save-note-btn').on('click', function (e) {
    recognition.stop();
    if (!noteContent.length) {
      instructions.text('Could not save empty note. Please add a message to your note.');
    }
    else {
      saveNote(new Date().toLocaleString(), noteContent);
      noteContent = '';
      renderNotes(getAllNotes());
      noteTextarea.val('');
      instructions.text('Note saved successfully.');
    }
  })
  notesList.on('click', function (e) {
    e.preventDefault();
    var target = $(e.target);
    if (target.hasClass('listen-note')) {
      var content = target.closest('.note').find('.content').text();
      readOutLoud(content);
    }
    if (target.hasClass('delete-note')) {
      var dateTime = target.siblings('.date').text();
      deleteNote(dateTime);
      target.closest('.note').remove();
    }
  });
  function readOutLoud(message: any) {
    var speech = new SpeechSynthesisUtterance();
    speech.text = message;
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;
    window.speechSynthesis.speak(speech);
  }
  function renderNotes(notes: any) {
    var html = '';
    if (notes.length) {
      notes.forEach(function (note: any) {
        html += `<li class="note">
            <p class="header">
              <span class="date">${note.date}</span>
              <a href="#" style="color:#EA5A41" class="delete-note" title="Delete">Delete</a>
            </p>
            <p class="note-content">${note.content}</p>
          </li>`;
      });
    }
    else {
      html = '<li><p class="content">You don\'t have any notes yet.</p></li>';
    }
    notesList.html(html);
  }
  function saveNote(dateTime: any, content: any) {
    localStorage.setItem('note-' + dateTime, content);
  }
  function getAllNotes() {
    var notes = [];
    var key;
    for (var i = 0; i < localStorage.length; i++) {
      key = localStorage.key(i);
      if (key?.substring(0, 5) === 'note-') {
        notes.push({
          date: key?.replace('note-', ''),
          content: localStorage.getItem(String(localStorage.key(i)))
        });
      }
    }
    return notes;
  }
  function deleteNote(dateTime: any) {
    localStorage.removeItem('note-' + dateTime);
  }
  const [userComments, setUserComments] = useState([{ "name": "Ahmad", "comment": "Hello this is a test comment", "date": "4/6/2021, 4:17:07 PM" }, { "name": "Cavid", "comment": "Hello this is a test comment and this comment is particularly very long and it goes on and on and on", "date": "1/7/2021, 7:13:56 PM" }, { "name": "Samir", "comment": "Hello this is a test comment", "date": "8/7/2021, 12:47:13 PM" }])
  let allComments: any = localStorage.getItem("comments") === null ? "" : localStorage.getItem("comments")
  useEffect(() => {
    setUserComments(userComments)
  }, [userComments])
  return (
    <div style={{ backgroundImage: "url(https://image.freepik.com/free-vector/elegant-white-background-with-shiny-lines_1017-17580.jpg)" }}>
      <header>
        <div className={classes.root} style={{ backgroundColor: "#151414" }}>
          <AppBar position="static" style={{ backgroundColor: "#151414" }}>
            <Toolbar >
              <Typography variant="h6" onClick={() => { history.push("/covid"); window.location.reload() }} style={{ padding: " 0 2rem", marginRight: "auto", cursor: "pointer" }} className={`header-link ${classes.title}`}>Covid Statistics</Typography>
              <Typography variant="h6" style={{ cursor: "pointer", margin: "0 2rem" }} className={'link head-link'} onClick={() => history.push("/main")}>Main Page</Typography>
              <Typography variant="h6" style={{ cursor: "pointer" }} className={'link head-link'} onClick={() => history.push("/weather")} >Current Weather</Typography>
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
        {id <= 8 ? headData && headData.slice(0.8).map((item: any, index: any) => {
          if (Number(id) === Number(index)) {
            return (
              <div className="header-banner" style={{ backgroundImage: `url(${headData[id - 1].urlToImage})` }}>
                <h2  >{headData[id - 1].title}</h2 >
              </div>
            )
          }
        }) : id < 29 ? headData && newsdata && newsdata.map((item: any, index: any) => {
          if (Number(id) === Number(index) + 9) {
            return (
              <div className="header-banner" style={{ backgroundImage: `url(${newsdata[index].urlToImage})` }}>
                <h2 >{newsdata[index].title}</h2 >
              </div>
            )
          }
        }) : id < 31 ? headData && newsdata && state && state.news.map((item: any, index: any) => {
          if (Number(id) === Number(index + 29)) {
            return (
              <div className="header-banner" style={{ backgroundImage: `url(${state.news[index].url})` }}>
                <h2 >{state.news[index].title}</h2 >
              </div>
            )
          }
        }) : info && headData && newsdata && state && info.articles.map((item: any, index: any) => {
          if (Number(id) === Number(index + 31)) {
            return (
              <div className="header-banner" style={{ backgroundImage: `url(${info.articles[index + 1].urlToImage})` }}>
                <h2 >{info.articles[index + 1].title}</h2 >
              </div>
            )
          }
        })}
        <div className="clear"></div>
      </header>
      <i className="fas fa-plus-circle" onClick={() => { setNotesDisplay(notesDisplay === "none" ? "inline-block" : "none"); setDisplay(display === 'inline-block' ? 'none' : 'inline-block') }}></i>
      <div className="card-form" style={{ backgroundImage: 'url(https://just.edu.bd/reserach.jpg)', height: "500px", zIndex: 10, overflow: "auto", width: '30%', display: `${notesDisplay}`, justifyContent: "end" }}>
        <div className="voice-controller">
          <h3 className="no-browser-support">Sorry, Your Browser Doesn't Support the Web Speech API. Try Opening This Demo In Google Chrome.</h3>
          <div className="app">
            <h3>Add New Note</h3>
            <div className="input-single">
              <textarea id="note-textarea" placeholder="Create a new note by typing or using voice recognition." data-rows="6"></textarea>
            </div>
            <button id="start-record-btn" style={{ margin: "10px" }} title="Start Recording">Start Recognition</button>
            <button id="pause-record-btn" style={{ margin: "10px" }} title="Pause Recording">Pause Recognition</button>
            <button id="save-note-btn" title="Save Note">Save Note</button>    <p id="recording-instructions">Press the <strong>Start Recognition</strong> button and allow access.</p>
            <h3>My Notes</h3>
            <ul id="notes">
              <li>
                <p className="no-notes">You don't have any notes.</p>
              </li>
            </ul>
            <button onClick={() => { setNotesDisplay(notesDisplay === "none" ? "inline-block" : "none") }}> Close </button>
          </div>

        </div>
      </div>
      <section className="content" style={{ display: "inline-block" }}>
        <div className='article-content' style={{ opacity: "1" }}>
          {id <= 8 ? headData && headData.slice(0.8).map((item: any, index: any) => {
            if (Number(id) === Number(index)) { return (<p onClick={() => { setTextToSpeech(headData[index - 1].content.slice(0, 700)) }} style={localStorage.getItem("subscribed") === null ? { filter: 'blur(2px)', fontWeight: 500, userSelect: "none" } : { opacity: "1", fontWeight: 500 }}>{`${headData[index - 1].content.slice(0, 700)}...`}</p>) }
          }) : id < 29 ? headData && newsdata && newsdata.map((item: any, index: any) => {
            if (Number(id) === Number(index) + 9) { return (<p style={localStorage.getItem("subscribed") == null ? { filter: 'blur(2px)', userSelect: "none", fontWeight: 500 } : { opacity: "1", fontWeight: 500 }}> {`${newsdata[index].content.slice(0, 700)}...`}</p>) }
          }) : id < 31 ? state && headData && newsdata && state.news.map((item: any, index: any) => {
            if (Number(id) === Number(index + 29)) {
              return (<p style={localStorage.getItem("subscribed") === null ? { filter: 'blur(2px)', userSelect: "none", wordBreak: "break-all" } : { opacity: "1", fontWeight: 500, wordBreak: "break-all" }}>{`${item.content.slice(0, 700)}...`}</p>)
            }
          }) : info && state && headData && newsdata && info.articles.map((item: any, index: any) => {
            if (Number(id) === Number(index + 31)) {
              return (<p style={localStorage.getItem("subscribed") === null ? { filter: 'blur(2px)', userSelect: "none", wordBreak: "break-all" } : { opacity: "1", fontWeight: 500, wordBreak: "break-all" }}>{`${info.articles[index + 1].content.slice(0, 700)}...`}</p>)
            }
          })}
          <div className="card text-center" style={(localStorage.getItem("subscribed") != null) ? { display: 'none' } : { backgroundColor: "#fcfcfc", marginBottom: "2rem" }}>
            <div className="card-header">
              <h4>Do you want to continue reading this article?
              </h4>
              <a href="/payment" className="remained-text" style={{ color: "#EA5A41" }}>Subscribe at once </a>
            </div>
            <div className="card-body">
              <h3 className="card-title" style={{ marginBottom: "2rem" }}>Enjoy 50% off digital subscription
              </h3>
              <a href="#" className="btn-primary subscription-details" onClick={(e) => { e.preventDefault(); sessionStorage.setItem("id", id); history.push("/payment") }} style={{ padding: "10px 1.5rem", borderRadius: "1rem" }}>View Subscription Options</a>
              <h6 className="card-text" style={{ marginTop: "2rem" }}>Cancelation at any time</h6>
            </div>
          </div>
          {id <= 8 ? headData && headData.slice(0.8).map((item: any, index: any) => {
            if (Number(id) === Number(index)) { return (localStorage.getItem("subscribed") === null ? <div></div> : <div><p className="remained-text">{headData[index].content.slice(700, headData[index].content.length)}</p>    </div>) }
          }) : id < 29 ? headData && newsdata && newsdata.map((item: any, index: any) => {
            if (Number(id) === Number(index) + 9) { return (localStorage.getItem("subscribed") === null ? <div></div> : <div><p className="remained-text">{newsdata[index].content.slice(700, newsdata[index].content.length)}</p>    </div>) }
          }) : id < 31 ? state && headData && newsdata && state.news.map((item: any, index: any) => {
            if (Number(id) === Number(index + 29)) {
              return (localStorage.getItem("subscribed") === null ? <div></div> : <div><p className="remained-text">{item.content.slice(700, item.content.length)}</p>    </div>)
            }
          }) : info && state && headData && newsdata && info.articles.map((item: any, index: any) => {
            if (Number(id) === Number(index + 31)) {
              return (localStorage.getItem("subscribed") === null ? <div></div> : <div><p className="remained-text">{info.articles[index + 1].content.slice(700, item.content.length)}</p>    </div>)
            }
          })}
          <div className="detailBox" style={localStorage.getItem('subscribed') == null ? { display: "none" } : { cursor: "pointer" }}>
            <div className="titleBox">
              <label>Comment Box</label>
            </div>
            <div className="actionBox">
              <ul className="commentList">
                {JSON.parse(allComments).map((item: any, index: any) => {
                  return (
                    <li>
                      <div className="commenterImage">

                        {index > 2 && sessionStorage.getItem("userImage") != null ? <img alt="menu" onClick={handleMenu} style={{ width: "30px", borderRadius: '50%' }} src={String(sessionStorage.getItem('userImage'))} /> : index < 3 ? <img alt="profile" src="https://support.logmeininc.com/assets/images/care/topnav/default-user-avatar.jpg" />
                          : <div onClick={handleMenu} style={{ width: "30px", height: "30px", borderRadius: '50%', backgroundColor: `#3F51B5`, color: 'white' }}><h4>{sessionStorage.getItem('user')?.charAt(0)}</h4></div>}
                      </div>
                      <div className="commentText">
                        <p className="" style={{ fontWeight: 400, color: "black" }}><span><b>{item.name}</b>- </span>{item.comment} </p> <p className="date sub-text" style={{ color: "black" }}>{item.date}</p>
                      </div>
                    </li>
                  )
                })}
              </ul>
              <form className="comment-form" style={{ width: "100%", marginTop: "1.5rem" }}>
                <input value={comment} onChange={(e) => setComment(e.target.value)} type="text" style={{ margin: "0.5rem 0" }} placeholder="Your comment" />
                <button className="add-comment" onClick={(e) => {
                  e.preventDefault(); userComments.push({ "name": `${sessionStorage.getItem("user") == null ? 'Unknown User' : sessionStorage.getItem("user") === "Admin" ?  "Admin" : sessionStorage.getItem("user")}`, "comment": `${String(comment)}`, "date": String(new Date().toLocaleString()) }); setComment(""); localStorage.setItem("comments", JSON.stringify(userComments))
                }}>Add Comment</button>
              </form>
            </div>
          </div>
        </div>
        <aside style={{ marginTop: 0 }}>
          <h4 className="mb-3 color-orange">Suggested News</h4>
          <div onClick={() => history.push(`/main/${randomGenerator}`)}>
            <img style={{ width: "100%", marginBottom: "1rem" }} src={newsdata && newsdata[randomGenerator - 9].urlToImage}></img>
            <h6>{newsdata && newsdata[randomGenerator - 9].title}
            </h6>
            <div className="small" style={{ marginBottom: "2rem" }}>Author: {newsdata && newsdata[randomGenerator - 9].author}
            </div>
          </div>
          <div onClick={() => history.push(`/main/${randomGenerator - 1}`)}>
            <img style={{ width: "100%", marginBottom: "1rem" }} src={newsdata && newsdata[randomGenerator - 10].urlToImage}></img>
            <h5>{newsdata && newsdata[randomGenerator - 10].title}
            </h5>
            <div className="small" style={{ marginBottom: "2rem" }}>Author: {newsdata && newsdata[randomGenerator - 10].author}
            </div>
          </div>
          <div onClick={() => history.push(`/main/${randomGenerator + 1}`)}>
            <img style={{ width: "100%", marginBottom: "1rem" }} src={newsdata && newsdata[randomGenerator - 8].urlToImage}></img>
            <h5>{newsdata && newsdata[randomGenerator - 8].title}
            </h5>
            <div className="small" style={{ marginBottom: "2rem" }}>Author: {newsdata && newsdata[randomGenerator - 8].author}
            </div>
          </div>
          <div onClick={() => history.push(`/main/${randomGenerator + 2}`)}>
            <img style={{ width: "100%", marginBottom: "1rem" }} src={newsdata && newsdata[(randomGenerator - 7) > 20 ? randomGenerator - 2 : randomGenerator - 7].urlToImage}></img>
            <h5>{newsdata && newsdata[(randomGenerator + 2) > 20 ? randomGenerator - 2 : randomGenerator - 7].title}
            </h5>
            <div className="small" style={{ marginBottom: "2rem" }}>Author: {newsdata && newsdata[(randomGenerator - 7) > 20 ? randomGenerator - 2 : randomGenerator - 7].author}
            </div>
          </div>
        </aside>
      </section>
      <Footer />
    </div>
  )
}

export default NewsById