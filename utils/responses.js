const errorResponse = (res, err) => {
    return (
        res.status(500).send(
            `Error: ${err.message}`
        )
    )
}

const successResponse = (res, results) => {
    return (
        res.status(200).json({
            results
        })
    )
}

const incompleteResponse = res => {
    return (
        res.status(404).send(
            'Action was unable to be completed'
        )
    )
}

module.exports = {
    errorResponse, successResponse, incompleteResponse
}