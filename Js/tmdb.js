export class MovieAPI {
    static async search(movie) {

        const endPoint = `https://api.themoviedb.org/3/search/movie?api_key=8734d18b1c59ba1e8242ff5d1d3704a5&query=${movie}&include_adult=false&language=pt-br&page=1`

        const response = await fetch(endPoint)
        if(response.ok) {
            const data = await response.json()
            const movie = {
                title: data["results"][0].title,
                poster_path: data["results"][0].poster_path,
                overview: data["results"][0].overview,
                release_date: data["results"][0].release_date,
                vote_average: data["results"][0].vote_average
            }
            return movie
        }
    }
}