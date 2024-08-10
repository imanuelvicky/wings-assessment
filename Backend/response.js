const response = (status_code, message, data, res) => {
    res.status(status_code).json({
        status_code: status_code,
        message: message,
        data: data
    })
}

// const response = (status_code, message, res) => {
//     res.send(status_code, message)
// }

module.exports = response