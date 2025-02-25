import styled from 'styled-components'

export const MenuStyled = styled.div`
  border: solid 2px black;
  border-radius: 0.25em;
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 2em;
  padding-left: 0.25em;
  .input {
    display: flex;
    margin: 0 auto;
    align-items: center;
    color: black;
    text-align: center;
    input {
      border: none;
      text-align: center;
      width: 4em;
      height: 80%;
      margin-left: 0.25em;
    }
  }
  .scales {
    width: 75%;
    display: flex;
    justify-content: space-evenly;
    button {
      width: 100%;
      padding: 0 1em;
      border-left: 2px solid black;
      &:hover {
        background-color: lightgray;
      }
    }
  }

  @media screen and (max-height: 450px) {
    flex-direction: column;
    width: calc(25% - 1vmin);
    height: 100%;
    width: 5em;
    padding: 0;

    .input {
      margin-top: 1vmin;
      padding: 0.2em;
      flex-direction: column;
      border: 1px solid black;
      border-radius: 0.25em;
      input {
        padding: 0.25em;
      }
    }
    .scales {
      width: 100%;
      margin: 0;
      padding: 0;
      border: none;
      flex-direction: column;
      button {
        border: none;
        border-top: 2px solid black;
        padding: 0.5em 0;
      }
    }
  }

  @media screen and (min-width: 768px) and (max-width: 1023px) {
    .scales {
      button {
        font-size: 0.7em;
      }
    }
  }
`
