import styled, { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  *{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  }

  html, body {
    touch-action: none;
    user-select: none;
    overscroll-behavior: contain;
  }

  button {
    cursor: pointer;
    background-color: transparent;
    border: none;
  }

  .--d-none {
    display: none;
  }

  .--hidden {
    visibility: hidden;
  }

  .--bg-lightgray {
    background-color: lightgray;
  }

  .--bg-darkgray {
    background-color: darkgray;
  }

  .--bg-darkergray {
    background-color: rgba(100, 100, 100);
  }

  .--bg-blackkeypressed {
    background-color: rgba(25, 25, 25) !important;
  }

  @media screen and (max-width: 767px) {
  }
  @media screen and (min-width: 768px) and (max-width: 1023px) {
  }
  @media screen and (min-width: 1024px) {
  }
`
export const Container = styled.div`
  color: white;
  background-color: black;
  height: 100svh;
  display: flex;
  justify-content: center;
  align-items: center;
`
