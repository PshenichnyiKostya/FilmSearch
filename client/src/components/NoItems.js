import React from "react"

const NoItems = ({error}) => {
    return (
        <div className="center">
            <p className="flow-text">{error}</p>
        </div>
    )
}
export default NoItems

