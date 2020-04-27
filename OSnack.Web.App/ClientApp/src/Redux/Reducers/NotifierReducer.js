const initState = {
    bgColor: "",
    message: "",
    links: [{
        linkTo: "/",
        displayName: "Go to home page"
    }]
}
const NotifierReducer = (state = initState, action) => {

    switch (action.type) {
        case "SUCCESS":
            return state ={
                bgColor: "bg-green",
                message: action.message,
                links: action.links
            }
        case "FAILED":
            return state ={
                bgColor: "bg-red",
                message: action.message,
                links: action.links
            }
        case "WARNING":
            return state = {
                bgColor: "bg-yellow",
                message: action.message,
                links: action.links
            }
        default:
            return state;
    }
}
export default NotifierReducer;