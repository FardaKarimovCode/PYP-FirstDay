import React, { useState, useEffect } from 'react'
import './index.scss'

import { useHistory } from 'react-router';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Formik, Field } from "formik";
import * as Yup from "yup";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { addNews, getNews, deleteNews, editNews } from '../redux/newsAction';
import { useDispatch, useSelector } from "react-redux";
import Footer from './footer'
const drawerWidth = 240;
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
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      ...theme.mixins.toolbar,
      justifyContent: 'flex-end',
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: -drawerWidth,
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
  }),
);
const SignupSchema = Yup.object().shape({
  title: Yup.string()
    .required("Title is a required field!")
    .min(10, "Too Short!")
    .max(200, "Too Long!"),
  author: Yup.string().required("Author is a required field!"),
  url: Yup.string()
    .required("Url is a required field!")
    .min(5, "Too Short!")
    .max(300, "Too Long!"),
  content: Yup.string()
    .required("Content is a required field!")
    .min(300, "Too Short!")
    .max(30000, "Too Long!"),
});
export const Main = () => {
  const [newsdata, setNewsdata] = useState<any>()
  const [headData, setHeadData] = useState<any>()
  const [info, setInfo] = useState<any>()
  useEffect(() => {
    /* https://newsapi.org/v2/everything?q=Apple&from=2021-06-28&sortBy=popularity&apiKey=fc951feaf1ed4dc6ba4edba127305bde */
    fetch("https://api.npoint.io/28d8d790105050200e23").then((resp) => resp.json()).then(data => {  setNewsdata(data.articles) })
    fetch("https://api.npoint.io/a05e4d423619db61e3d9").then((resp) => resp.json()).then(data => { setHeadData(data.articles) })
    fetch("https://api.npoint.io/b29bcd11b992df4ab8fa").then((resp) => resp.json()).then(data => {  setInfo(data) })
    /*https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=fc951feaf1ed4dc6ba4edba127305bde*/
  }, [])
  const dispatch = useDispatch();
  let editData: string[] = []
  const history = useHistory()
  const state = useSelector((state: any) => state);
  const classes = useStyles();
  const auth = true;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [test, setTest] = useState(editData)
  const userId = 1;
  const [id, setId] = useState(0)
  const [category, setCategory] = useState("All")
  useEffect(() => {
    getNews(userId)(dispatch);
  }, [dispatch]);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogOut = () => {
    localStorage.removeItem("token")
    sessionStorage.removeItem("user")
    sessionStorage.removeItem("userImage")
    history.push("/")
  }
  const [show, setShow] = React.useState(false);
  const [display, setDisplay] = React.useState(false);
  const [modalClose, setModalClose] = useState("none")


  const handleClickOpen = () => {
    setDisplay(true);
  };

  const handleClickClose = () => {
    setDisplay(false);
  };
  const handleHide = () => {
    setShow(false);
  };

  const checkAdmin = sessionStorage.getItem("user")
  return (
    <div style={{ backgroundColor: "#23272A" }}>
      {newsdata ? '' : <Backdrop className={classes.backdrop} open>
        <CircularProgress color="inherit" />
        <h3 style={{ display: "block", marginLeft: '1rem' }}>    Loading ... </h3>
      </Backdrop>}
      <div className={classes.root} style={{ backgroundColor: "#151414" }}>
        <div className="modal" style={{ display: modalClose }}>
          <div className="content-modal" style={{ backgroundImage: 'url(https://image.freepik.com/free-vector/abstract-minimal-white-background_23-2148887988.jpg)' }}>
            <h2> Add New Articles </h2>
            <Formik
              initialValues={{
                title: "",
                author: "",
                url: "",
                content: ""
              }}
              validationSchema={SignupSchema}
              onSubmit={(values) => {
                const newSubObject = {
                  title: values.title,
                  author: values.author,
                  url: values.url,
                  content: values.content,
                };
                addNews(newSubObject, userId)(dispatch);
                handleClose();
              }}
            >
              {({ errors, touched, handleSubmit }) => (
                <form style={{ width: "80%" }} onSubmit={handleSubmit}>

                  <label
                    htmlFor="title"
                    className="modal-label"
                    style={{ color: "#3f51b5", fontWeight: "bold" }}
                  >
                    Title
                  </label>
                  <Field name="title" className="modal-form" style={{ backgroundColor: "#dfdfdf", color: "black", padding: "7px 0", fontWeight: "bold", borderRadius: '5px' }} />
                  {errors.title && touched.title ? (
                    <div style={{ color: "red", fontWeight: "bold", textAlign: "left" }}>
                      {errors.title}
                    </div>
                  ) : null}
                  <label
                    htmlFor="author"
                    className="modal-label"
                    style={{ color: "#3f51b5", fontWeight: "bold" }}
                  >
                    Author
                  </label>
                  <Field name="author" className="modal-form" style={{ backgroundColor: "#dfdfdf", color: "black", padding: "7px 0", fontWeight: "bold", borderRadius: '5px', }} />
                  {errors.author && touched.author ? (
                    <div style={{ color: "red", fontWeight: "bold", textAlign: "left" }}>
                      {errors.author}
                    </div>
                  ) : null}
                  <label
                    htmlFor="Url"
                    className="modal-label"
                    style={{ color: "#3f51b5", fontWeight: "bold" }}
                  >
                    Picture Url
                  </label>
                  <Field name="url" type="text" className="modal-form" style={{ backgroundColor: "#dfdfdf", padding: "7px 0", color: "black", fontWeight: "bold", borderRadius: '5px' }} />
                  {errors.url && touched.url ? (
                    <div style={{ color: "red", fontWeight: "bold", textAlign: "left" }}>
                      {errors.url}
                    </div>
                  ) : null}
                  <label
                    htmlFor="content"
                    className="modal-label"
                    style={{ color: "#3f51b5", fontWeight: "bold" }}
                  >
                    Content
                  </label>
                  <Field name="content" className="modal-form" style={{ backgroundColor: "#eee", color: "black", padding: "2px 0", paddingBottom: "40px", height: "60px", width: "100%", borderRadius: '5px', fontWeight: "bold"}} />
                  {errors.content && touched.content ? (
                    <div style={{ color: "red", fontWeight: "bold", textAlign: "left" }}>
                      {errors.content}
                    </div>
                  ) : null}
                  <div className={'buttons'} style={{ display: "flex", justifyContent: "center" }}>
                    <Button onClick={(e) => {
                      setModalClose("none")
                    }} className="close" style={{ color: "black", fontWeight: "bold", padding: "1rem 2.5rem", marginTop: "1rem", backgroundColor: "#eee" }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={(e) => {
                      e.preventDefault();
                      handleSubmit();
                      handleHide();
                      window.location.reload()
                    }} style={{ color: "black", fontWeight: "bold", margin: "0 0 0 0.5rem", marginTop: "1rem", backgroundColor: "#eee", padding: "1rem 2.5rem" }}>
                      Add
                    </Button>
                  </div>
                </form>
              )}
            </Formik>
          </div>
        </div>
        <AppBar position="fixed" style={{ backgroundColor: "#151414", height: "80px", marginBottom: '0.5rem' }}>
          <Toolbar style={{ height: "80px" }}>
            {['General', 'Technology', 'Economy', 'Sport'].map((text, index) => {
              return (
                <p style={text === "Sport" ? { padding: " 0 1rem", cursor: "pointer", marginRight: "auto" } : { padding: " 0 1rem", cursor: "pointer" }} onClick={() => { setCategory(text === "General" ? "All" : text); }} className={`header-link ${classes.title}`}>{text}</p>
              )
            })}
            {checkAdmin === "Admin" ? <Typography variant="h6" style={{ marginLeft: "auto", cursor: "pointer" }} onClick={() => setModalClose("inline-block")} className={`header-link ${classes.title}`}>Add New Article</Typography> : null
            }
            <Typography variant="h6" onClick={() => { history.push("/covid"); window.location.reload() }} style={{ padding: " 0 1rem", cursor: "pointer" }} className={`header-link ${classes.title}`}>Covid Statistics</Typography>
            <Typography variant="h6" style={{ cursor: "pointer" }} className={'link head-link'} onClick={() => history.push("/weather")} >Current Weather</Typography>
            <Typography variant="h6" style={{ cursor: "pointer", padding: " 0 1rem" }} className={"head-link"} >{sessionStorage.getItem('user')}</Typography>
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
      <h3 className="popular-news-title" style={{ color: '#fff', margin: "1.5rem 0" }}> Latest News </h3>
      <section className="news">
        {headData && headData.slice(0, 8).map((item: any, index: any) => {
          return (
            <article className="post" key={index}>
              <div className="media" onClick={() => history.push(`/main/${index + 1}`)} style={{ cursor: "pointer", backgroundImage: `url(${item.urlToImage})` }}></div>
              <div className="caption">
                <h1 className="title" style={{ color: "white" }}>{item.title}</h1>
                <div className="author" style={{ color: "white" }}> by {item.author}</div>
              </div>
            </article>
          )
        })}
      </section>
      <section className="news-section">
        <div className="container" style={{ width: "80%" }}>
          <div className="main-title-box text-center">
            <div className="small-title">News and Blog</div>
            <h2 className="big-title">Our Recent News</h2>
          </div>
          <div className="row">
            {newsdata && newsdata.map((item: any, index: any) => {
              return (
                <div key={index} style={category === "All" ? { display: "inline-block" } : item.category !== category ? { display: "none" } : { display: "inline-block" }} className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0ms">
                  <div className={`news-item ${item.category}`}>
                    <div className="news_box">
                      <div className="newsimg"><img className="img-responsive" style={{ height: "15rem" }} src={item.urlToImage} alt={item.title}></img></div>
                      <div className="news-content">
                        <div className="news_postdate">
                          <span>{new Date(item.publishedAt).toLocaleString()}</span>
                        </div>
                        <a href="title">
                          <h3>{item.title}</h3>
                        </a>
                        <p style={{ marginBottom: "1rem", overflow: "hidden" }}>{item.description.slice(0, 120)}</p>
                        <Button variant="contained" color="primary" onClick={() => history.push(`/main/${index + 9}`)} >
                          Read More
                        </Button>
                      </div>
                      <div className="news_authorinfo" style={{ display: "flex", justifyContent: "space-around", alignItems: "center", color: "white" }} >
                        <span><i className="fa fa-user"></i>  <a href="author">{item.author} </a></span>
                        <span><i className="fab fa-sourcetree"></i><a href="source.name" >{item.source.name}</a></span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
            {state && state.news.map((item: any, index: any) => {
              return (
                <div key={index} style={category !== "All" ? { display: 'none' } : { display: 'inline-block' }} className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0ms">
                  <div className="news-item">
                    <div className="news_box">
                      <div className="newsimg"><img className="img-responsive" style={{ height: "15rem" }} src={item.url} alt={item.title}></img></div>
                      <div className="news-content">
                        <div className="news_postdate">
                          <span>{String(new Date().toLocaleString())}</span>
                        </div>
                        <a href="title">
                          <h3>{item.title}</h3>
                        </a>
                        <p style={{ marginBottom: "1rem", overflow: "hidden", wordBreak: "break-all" }}>{item.content.slice(0, 150)}</p>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <Button variant="contained" color="primary" onClick={() => history.push(`/main/${index + 29}`)} >
                            Read More
                          </Button>
                          {checkAdmin === "Admin" ? <Button color='primary' style={{ margin: "0 10px" }} variant="contained" className="btn" onClick={() => { deleteNews(userId, item._id)(dispatch); window.location.reload() }}>Delete</Button> : null}
                        </div>
                        <br />
                        {checkAdmin === "Admin" ? <Button color='primary' variant="contained" className="btn" onClick={() => { handleClickOpen(); setTest([item.title, item.author, item.url, item.content]); setId(item._id) }}>Edit</Button> : null}
                        <Dialog open={display} onClose={handleClickClose} aria-labelledby="form-dialog-title" >
                          <DialogContent style={{ padding: "1rem 3rem", backgroundImage: 'url(https://image.freepik.com/free-vector/white-abstract-background_23-2148810113.jpg)' }}>
                            <DialogTitle id="form-dialog-title">Edit Article Info</DialogTitle>
                            <DialogContentText>
                              You can edit any information about your articles
                            </DialogContentText>
                            <Formik
                              initialValues={{
                                title: test[0],
                                author: test[1],
                                url: test[2],
                                content: test[3]
                              }}
                              validationSchema={SignupSchema}
                              onSubmit={(values) => {
                                const newSubObject = {
                                  title: values.title,
                                  author: values.author,
                                  url: values.url,
                                  content: values.content,
                                };
                                editNews(newSubObject, userId, id)(dispatch);
                                handleClose();
                              }}
                            >
                              {({ errors, touched, handleSubmit }) => (
                                <form style={{ width: "100%" }}>
                                  <label
                                    htmlFor="title"
                                    className="edit-label"
                                    style={{ color: "#3f51b5", fontWeight: "bold" }}
                                  >
                                    Title
                                  </label>
                                  <Field name="title" className="modal-form" style={{ backgroundColor: "#ddd", padding: "7px 0", width: "100%", borderRadius: '5px', color: "black" }} />
                                  {errors.title && touched.title ? (
                                    <div style={{ color: "red", textAlign: "left", fontWeight: "bold" }}>
                                      {errors.title}
                                    </div>
                                  ) : null}
                                  <label
                                    htmlFor="author"
                                    className="edit-label"
                                    style={{ color: "#3f51b5", fontWeight: "bold" }}
                                  >
                                    Author
                                  </label>
                                  <Field name="author" className="modal-form" style={{ backgroundColor: "#ddd", padding: "7px 0", width: "100%", borderRadius: '5px', color: "black", }} />
                                  {errors.author && touched.author ? (
                                    <div style={{ color: "red", textAlign: "left", fontWeight: "bold" }}>
                                      {errors.author}
                                    </div>
                                  ) : null}
                                  <label
                                    htmlFor="Url"
                                    className="edit-label"
                                    style={{ color: "#3f51b5", fontWeight: "bold" }}
                                  >
                                    Picture Url
                                  </label>
                                  <Field name="url" type="text" className="modal-form" style={{ backgroundColor: "#ddd", padding: "7px 0", width: "100%", color: "black", borderRadius: '5px', }} />
                                  {errors.url && touched.url ? (
                                    <div style={{ color: "red", textAlign: "left", fontWeight: "bold" }}>
                                      {errors.url}
                                    </div>
                                  ) : null}
                                  <label
                                    htmlFor="content"
                                    className="edit-label"
                                    style={{ color: "#3f51b5", fontWeight: "bold" }}
                                  >
                                    Content
                                  </label>
                                  <Field name="content" className="modal-form" style={{ backgroundColor: "#ddd", padding: "5px 0", width: "100%", color: "black", borderRadius: '5px', }} />
                                  {errors.content && touched.content ? (
                                    <div style={{ color: "red", textAlign: "left", fontWeight: "bold" }}>
                                      {errors.content}
                                    </div>
                                  ) : null}
                                  <div className={'buttons'}>
                                    <Button onClick={(e) => {
                                      e.preventDefault();
                                      handleClickClose();
                                      handleHide()
                                    }} style={{ color: "black", fontWeight: "bold", marginRight: "auto", marginTop: "1rem" }}>
                                      Cancel
                                    </Button>
                                    <Button onClick={(e) => {
                                      e.preventDefault();
                                      handleSubmit();
                                      handleClickClose()
                                      handleHide();
                                      window.location.reload()
                                    }} style={{ color: "black", fontWeight: "bold", margin: "1rem 0.5rem 0 0.5rem" }}>
                                      Edit
                                    </Button>
                                  </div>
                                </form>
                              )}
                            </Formik>
                          </DialogContent>
                        </Dialog>
                      </div>
                      <div className="news_authorinfo" style={{ display: "flex", justifyContent: "space-around", alignItems: "center", color: "white" }} >
                        <span><i className="fa fa-user"></i>  <a href="author">{item.author} </a></span>
                        <span><i className="fab fa-sourcetree"></i><a href="source" >Source</a></span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
            <h2 className="big-title">Our Recent Articles</h2>
            <div className="articles-container articles" style={{ margin: "0 auto" }}>
              <div className="row">
                <div className="col-md-3 col-sm-6 col-xs-12 quote-primary">
                  <div>
                    <p>
                      Opinion
                    </p>
                    <p>“If you can’t annoy somebody with what you write, there’s little point in writing.”
                    </p>
                    <p>
                      Kinglsley Amis
                      <span className="right-arrow"></span>
                    </p>
                  </div>
                </div>
                <div className="col-md-6 col-sm-12 col-xs-12 article2">
                  <div className="article-thumb culture-thumb" style={{ backgroundImage: `url(${info && info.articles[0].urlToImage})` }}>
                  </div>
                  <div className="category-tag " style={{ backgroundColor: 'transparent' }}>
                    <span className=" tag culture-tag">
                      Culture
                    </span>
                  </div>
                  <div className="article-text">
                    <p>
                      {info && info.articles[0].title}
                    </p>
                    <p>
                      {info && info.articles[0].description}
                    </p>
                  </div>
                </div>
                {info && info.articles.slice(1, 15).map((item: any, index: any) => {
                  return (
                    <div key={index} className="col-md-3 col-sm-6 col-xs-12 article1" onClick={() => history.push(`/main/${index + 30 + state.news.length}`)}>
                      <div className="article-thumb technology-thumb" style={{ backgroundSize: "cover", backgroundImage: `url(${item.urlToImage})` }}>
                      </div>
                      <div className="category-tag " style={{ backgroundColor: 'transparent' }}>
                        <span className=" tag technology-tag">
                          Articles
                        </span>
                      </div>
                      <div className="article-text">
                        <p>
                          {item.title}
                        </p>
                        <p style={{ marginBottom: "5px" }}>
                          {item.author}
                        </p>
                        <p>
                          {new Date(item.publishedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )
                })}
                <div className="col-md-3 col-sm-6 col-xs-12 quote-primary">
                  <div>
                    <p>
                      Opinion
                    </p>
                    <p>““I would sum up my fear about the future in one word: boring.”
                    </p>
                    <p>
                      J.G. Ballard
                      <span className="right-arrow"></span>
                    </p>
                  </div>
                </div>
                <div className="col-md-6 col-sm-12 col-xs-12 article2">
                  <div className="article-thumb news-thumb" style={{ backgroundImage: `url(${info && info.articles[16].urlToImage})` }}>
                  </div>
                  <div className="category-tag " style={{ backgroundColor: "transparent" }}>
                    <span className=" tag news-tag">
                      Economy
                    </span>
                  </div>
                  <div className="article-text">
                    <p>
                      {info && info.articles[16].title}
                    </p>
                    <p>
                      {info && info.articles[16].description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </section>

      <Footer />

    </div>
  )
}

export default Main