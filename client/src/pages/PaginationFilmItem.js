import React from "react"
import {Link} from 'react-router-dom'

const PaginationFilmItem = ({film}) => {

    return (
        <div className='col container'>
            <div className='row s1 m1'>
                <div className="card">
                    <div className="card-image waves-effect waves-block waves-light">
                        <img className="activator"
                             src={require(`../filmImages/186013_900.jpg`)}
                             height={400}/>
                    </div>
                    <div className="card-content">
                    <span className="card-title activator grey-text text-darken-4">{film.name}<i
                        className="material-icons right">more_vert</i></span>
                        <Link to={`/films/${film._id}`}>Подробнее</Link>
                    </div>
                    <div className="card-reveal">
                    <span className="card-title grey-text text-darken-4">Card Title<i
                        className="material-icons right">close</i></span>
                        <p>Here is some more information about this product that is only revealed once clicked on.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default PaginationFilmItem