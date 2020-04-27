const initState = {
    message: "",
    links: [{
        linkTo: "/",
        displayName: "Go to home page"
    }],
}

export const notifySuccess = (data = initState) => {
    return {
        type: 'SUCCESS',
        message: data.message,
        links: data.links
    }
}
export const notifyFailed = (data = initState) => {
    return {
        type: 'FAILED',
        message: data.message,
        links: data.links
    }
}
export const notifyWarning = (data = initState) => {
    return {
        type: 'WARNING',
        message: data.message,
        links: data.links
    }
}