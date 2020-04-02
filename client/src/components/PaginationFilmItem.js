import React from "react"
import {Link} from 'react-router-dom'
import "react-responsive-carousel/lib/styles/carousel.min.css";

const PaginationFilmItem = ({film}) => {


    return (
        <div className='col container'>
            <div className='row s1 m1'>
                <div className="card">
                    <div className="card-image waves-effect waves-block waves-light">
                        <img className="activator"
                             src={require(`../filmImages/186013_900.jpg`)}
                             height={400}
                             alt={film.name}/>
                    </div>
                    <div className="card-content">
                    <span className="card-title activator grey-text text-darken-4">
                        <p>{film.name}</p>
                        <p>{film.rating ? film.rating : null} <i className="material-icons">grade</i></p>

                        <i className="material-icons right">more_vert</i>
                    </span>
                        <Link to={`/films/${film._id}`}>Подробнее</Link>
                    </div>
                    <div className="card-reveal">
                        <span className="card-title grey-text text-darken-4">
                            <i className="material-icons right">close</i></span>
                        <h3>О фильме</h3>
                        <h6><p>{film.description}</p></h6>
                        {/*{film.relatedMovies.length > 0 ?*/}
                        {/*    <Carousel showThumbs={false} showStatus={false} infiniteLoop={true}>*/}
                        {/*        <div>*/}
                        {/*            <img src={require(`../filmImages/186013_900.jpg`)}/>*/}
                        {/*            <p className="legend">Legend 1</p>*/}
                        {/*        </div>*/}
                        {/*    </Carousel> : <div>Похожих фильмов не найдено</div>*/}
                        {/*}*/}
                    </div>
                </div>

            </div>
        </div>
    )
}
export default PaginationFilmItem