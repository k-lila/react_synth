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

  @media screen and (max-height: 400px) {
    font-size: 3.75svh;
    .scales {
      button {
        font-size: 3.75svh;
      }
    }
  }
  @media screen and (max-width: 768px) {
    .scales {
      overflow: auto;
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
