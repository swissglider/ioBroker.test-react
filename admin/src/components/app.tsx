import React, { Component } from 'react';
import { CreateCSSProperties } from '@material-ui/core/styles/withStyles';
import { withStyles } from '@material-ui/core/styles';

import Header from './Header';
import Movie from './Movie';
import AddMovie from './AddMovie';

import { initialMovies } from '../movies';
import { additionalMovies } from '../movies';

const styles = (): Record<string, CreateCSSProperties> => ({});

interface RootState {
    movies: { [key: string]: any };
}

interface SettingsProps {
    // classes: Record<string, string>;
    // native: Record<string, any>;
    // onChange: (attr: string, value: any) => void;

    // add your props properties here
    dummy?: undefined;
}

interface RootState {
    movies: { [key: string]: any };
}

class AppC extends Component<SettingsProps, RootState> {
    constructor(props: SettingsProps) {
        super(props);
        this.state = {
            movies: initialMovies,
        };
        this.state.movies;
        this.loadAdditionalMovies = this.loadAdditionalMovies.bind(this);
        this.addMovieToGallery = this.addMovieToGallery.bind(this);
    }

    render(): JSX.Element {
        return (
            <div>
                <Header title="Bla Bla Bla" />
                <div className="add-movies">
                    <button onClick={this.loadAdditionalMovies}>Load more...</button>
                </div>

                <div className="AppC">
                    {Object.keys(this.state.movies).map((key) => (
                        <Movie key={key} meta={this.state.movies[key]} />
                    ))}
                </div>
                <AddMovie addMovie={this.addMovieToGallery} />
            </div>
        );
    }

    loadAdditionalMovies() {
        const currentMovies = { ...this.state.movies };
        const newMovies = Object.assign(currentMovies, additionalMovies);

        this.setState({ movies: newMovies });
    }

    addMovieToGallery(movie): void {
        const ts = Date.now();
        const newMovie = {};
        newMovie['movie' + ts] = movie;
        const currentMovies = { ...this.state.movies };
        const newMovies = Object.assign(currentMovies, newMovie);
        this.setState({ movies: newMovies });
    }
}

export default withStyles(styles)(AppC);
