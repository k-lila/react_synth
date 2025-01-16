import styled, { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  *{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
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
