import React, { Component } from 'react';

interface Props {
    // title: string;
    // year: string;
    // poster: string;
    // description: string;
    dummy?: undefined;
    addMovie: any;
}

class AddMovie extends Component<Props> {
    private title: HTMLInputElement | null = null;
    private year: HTMLInputElement | null = null;
    private description: HTMLTextAreaElement | null = null;
    private poster: HTMLInputElement | null = null;
    constructor(props: Props) {
        super(props);
        this.addNewMovie = this.addNewMovie.bind(this);
    }
    render(): JSX.Element {
        return (
            <form className="movie-form" onSubmit={(e) => this.addNewMovie(e)}>
                <p>Add a Movie</p>
                <input ref={(input) => (this.title = input)} type="text" placeholder="Title" />
                <input ref={(input) => (this.year = input)} type="text" placeholder="Year" />
                <input ref={(input) => (this.poster = input)} type="text" placeholder="Poster" />
                <textarea ref={(input) => (this.description = input)} placeholder="Description"></textarea>
                <button type="submit">Add Movie</button>
            </form>
        );
    }

    addNewMovie(e: any): void {
        e.preventDefault();
        const movie = {
            title: this.title?.value,
            year: this.year?.value,
            description: this.description?.value,
            poster: this.poster?.value,
        };
        this.props.addMovie(movie);
    }
}

export default AddMovie;
