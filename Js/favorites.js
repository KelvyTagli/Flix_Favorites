import { MovieAPI } from "./tmdb.js"

export class Favorite {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()
    }

    load() {
        this.entries = JSON.parse(localStorage.getItem('@movie-favorites:')) || []
    }

    save() {
        localStorage.setItem('@movie-favorites:', JSON.stringify(this.entries))
    }

    async add(movieID) {
        try {
            const movieExists = this.entries.find(entry => entry.title === movieID)

            if(movieExists) {
                throw new Error('Filme já cadastrado!')
            }

            const movies = await MovieAPI.search(movieID)

            if(movies.title === undefined) {
                throw new Error('Filme não encontrado!')
            }

            this.entries = [movies, ...this.entries]
            this.update()
            this.save()

        } catch(error) {
            alert(error.message)
        }
    }

    delete(movie) {
        const filterEdEntries = this.entries.filter ( entry => entry.title !== movie.title )

        this.entries = filterEdEntries
        this.update()
        this.save()
    }
}

export class MovieView extends Favorite {
    constructor(root) {
        super(root)

        this.tbody = this.root.querySelector('table tbody')
        this.update()
        this.onAdd()
    }

    update() {
        this.removeAlltr()
        this.entries.forEach(movie => {
            const row = this.creatRow()
            row.querySelector('.film img').src = `https://image.tmdb.org/t/p/w200/${movie.poster_path}`
            row.querySelector('.film img').alt = `poster ${movie.title}`
            row.querySelector('.film p').textContent = movie.title
            row.querySelector('.film span').textContent = movie.release_date

            row.querySelector('.sinopce').textContent = movie.overview
            row.querySelector('.nota').textContent = movie.vote_average.toFixed(2)

            row.querySelector('.remove').onclick = () => {
                const isOk = confirm('Tem certeza que deseja deletar essa linha?')
                if(isOk) {
                    this.delete(movie)
                }
            }

            this.tbody.append(row)
        })
    }

    onAdd() {
        const addButton = this.root.querySelector('.search button')
        const Input = this.root.querySelector('.search input')

        addButton.onclick = () => {
            const {value} = Input
            this.add(value)
            Input.value = ''
        }

        Input.addEventListener('keyup', ({key}) => {
            if(key === 'Enter') {
                const {value} = Input
                this.add(value)
                Input.value = ''
            }
        })
    }

    creatRow() {
        const tr = document.createElement('tr')

        tr.innerHTML = `
        <td class="film">
            <img src="https://image.tmdb.org/t/p/w200/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg" alt="">
            <div>
                <p>Vingadores: Guerra Infinita</p>
                <span>2018-04-25</span>
            </div>
        </td>
        <td class="sinopce">
            Homem de Ferro, Thor, Hulk e os Vingadores se unem para combater seu inimigo mais poderoso, o maligno Thanos. Em uma missão para coletar todas as seis pedras infinitas, Thanos planeja usá-las para infligir sua vontade maléfica sobre a realidade.
        </td>
        <td class="nota">
            8.2
        </td>
        <td>
            <button class="remove">&times</button>
        </td>`

        return tr
    }

    removeAlltr() {
        this.tbody.querySelectorAll('tr').forEach((tr) => {
            tr.remove()
        })
    }
}