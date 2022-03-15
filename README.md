<div id="top"></div>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/Nando-C/StriveM7D5">
    <img src="public/spotify-logo.png" alt="Logo" height="100">
  </a>

<h3 align="center">Spotify - Clone  -> [Front-End]</h3>

  <p align="center">
    A project that clones Spotify, developed during Strive School's Full Stack program!
    <br />
    <br />
    <a href="https://nandotify.vercel.app/">View Demo</a>
    <!-- ·
    <a href="https://github.com/Nando-C/Buildweek2/issues">Report Bug</a> -->
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li><a href="#app-use">App Use</a>
     <ul>
        <li><a href="#home">Home</a></li>
        <li><a href="#search">Search</a></li>
      </ul>
    </li>
    <li><a href="#redux-store">Redux Store</a>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

<img src="public/nandotify-screenshot.png" alt="album">

A Spotify clone project to put in practise our Front-End skills, as part of the Full Stack Master Camp at Strive School. This was my first real world project, started during the first modules of the program, but then I decided to create this new repo and built it again from scratch, as I have a much better understanding of the technologies and code practises.

All the information is retrieved from the dezzer API.

<p align="right">(<a href="#top">back to top</a>)</p>

### Built With

- [Node.js](https://nodejs.org/)
- [React.js](https://reactjs.org/)
- [Bootstrap](https://getbootstrap.com)
- [Redux](https://redux.js.org/)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## App Use

The work flow of this application is similar to the real spotify. However, not all features have been implemented, yet.

### Home

- Home is the landing page, you will start from here, where you have some recomendations of the day.
- By clicking on the album cover or the song title, you will be directed to the album page.

    <img src="public/assets/home-album.gif" alt="to-album">

- Otherwise, clicking on the artist name will take you to the artist page.

    <img src="public/assets/home-artist.gif" alt="to-artist">

<p align="right">(<a href="#top">back to top</a>)</p>

### Search

- Go to the search page by clicking on the search option on the navigation bar.
- Here you have a pre-selection of "trending" tracks.
- To perform a search, start typing the name of your favorite song or artist on the search box.

    <img src="public/assets/search.gif" alt="search">

- Once you have found what you are looking for, access the content in the same way as in the home page.

<p align="right">(<a href="#top">back to top</a>)</p>

## Redux Store

Part of this project objectives was to experiment with Redux and Redux Tool Kit.
So I have created 3 slices:

- home: to fetch the info just once and store it to be reused everytime needed.
- selectedArtist: to handle all the information related to the artist selected.
- selectedAlbum: to handle all the information related to the album selected.

    <img src="public/assets/redux-graph.png" alt="redux-graph">

I did not see the point of including the search information in the redux store, that is managed on the local state.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

[@Nando](https://hernando-crespo.vercel.app/) - Get in touch and let me know what do you think of this project! 😉

<p align="right">(<a href="#top">back to top</a>)</p>
