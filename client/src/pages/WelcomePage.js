import React, {useContext} from "react"
import Grid from "@material-ui/core/Grid";
import {makeStyles} from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from '@material-ui/core/Paper';
import {AuthContext} from "../context/AuthContext";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import {useHistory} from "react-router-dom";

const WelcomePage = () => {
    const auth = useContext(AuthContext)
    const history = useHistory()
    const useStyles = makeStyles((theme) => ({
            root: {
                height: '80vh',
            },
            image: {
                backgroundImage: 'url(https://source.unsplash.com/random)',
                backgroundRepeat: 'no-repeat',
                backgroundColor:
                    theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
                backgroundSize: 'cover',
                backgroundPosition: 'left',
            },
            paper: {
                margin: theme.spacing(8, 4),
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor:
                    theme.palette.type === 'light' ? theme.palette.grey[0] : theme.palette.grey[0],

            },
            submit: {
                backgroundColor: 'red'
            }, backGround: {
                'background-image': 'url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/5908/food.png)',
            }
            ,
        }))
    ;
    const classes = useStyles();
    const textButton = (auth && auth.payload) ? 'К фильмам' : 'Войти'

    const handleClick = (e) => {
        e.preventDefault()
        if (auth) {
            auth.payload ? history.push('/films?page=1'):history.push('/login')
        }
    }

    return (

        <Grid container component="main" className={classes.root}>
            <CssBaseline/>
            <Grid item xs={false} sm={4} md={7} className={classes.image}/>
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square className={classes.backGround}>
                <div className={classes.paper}>
                    <Typography component="h1" variant="h8">
                        Фильмо Поиск
                    </Typography>


                    <p id="start">
                        <h5>Давным давно в далекой галактике&hellip;</h5>
                    </p>

                    {auth && !auth.payload && <Typography component="h6" variant="h6">
                        Добро пожаловать на сайт!<br/>
                        Ты еще не авторизовался?<br/>
                        Тогда чего же ты ждешь<br/>
                    </Typography>}

                    {auth && auth.payload && <Typography component="h6" variant="h6">
                        Добро пожаловать на сайт!<br/>
                        Чего ты ждешь?<br/>
                        Бегом выбирать фильм!<br/>
                    </Typography>}

                    <div id="titles1">
                        <div id="title1content">¬
                            <p className="center">Эпизод 4<br/>
                                Выбор фильма</p>

                            <p>Это период войны киноманов.</p>

                            <p>Любители Marvel продолжают смотреть плохие фильмы.</p>

                            <p>Netflix продолжает снимать сериалы про меньшинства с прогрессивными отношениями.</p>

                            <p>За оскар борются фильмы "Черная пантера" и "Мстители Война бесконечности".</p>

                            <p>Но в мире продолжают сниматься хорошое кино с хорошим актерским составом, продуманным сюжетом,
                                диалогами и подходящим саундтреком.</p>

                            <p>Мир рискует остаться без хорошего кино. Под натиском актеров в трико и бешенных бюджетов
                                зрители переходят на сторону тьмы и смотрят спецэфекты 3 часа.</p>

                            <p>На за адекватный кинематограф продолжает бороться отряд сопротивления.
                            Глава сопротевления - BadComedian просвещает народ и открывает глаза на происходящее.</p>

                            <p>В конце концов, пусть каждый смотрит то, что ему нравится. Приятного выбора и просмотра кино!</p>
                        </div>
                    </div>
                    <iframe style={{visibility: 'hidden',}}
                            src="https://www.youtube.com/embed/1KAOq7XX2OY" frameBorder="0" allowFullScreen/>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        className={classes.submit}
                        onClick={handleClick}
                    >
                        {textButton}
                    </Button>
                </div>
            </Grid>
        </Grid>
    )
}
export default WelcomePage