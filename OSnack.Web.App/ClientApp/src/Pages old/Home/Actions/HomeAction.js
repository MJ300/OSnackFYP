import { PUBLIC_URL, preloadImage, preloadImages } from '../../../components/_Main/AppConst';
export const carouselItems = () => {
    return async dispatch => {
        let state = {
            Items: [],
            Loading: true
        }
        const response = await fetch('api/Carousel/getProducts');
        switch (response.status) {
            case 200:// Ok Response
                await response.json().then(async data => {
                    await preloadImages(data).then(loaded => {
                        console.log(data)
                        state.Items = data;
                        state.Loading = false;
                    })
                }).catch(err => console.log(err));
                break;
            case 400: // Bad Request
            default:
                break;
        }
        return state;
    }
}