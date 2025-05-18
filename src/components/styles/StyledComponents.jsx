import { styled } from "@mui/material";
import { Link as LinkComponent } from 'react-router-dom';


export const VisuallyHiddenInput = styled("input")({
  border: 0,
  clip: "rect(0 0 0 0)",
  height: 1,
  margin: -1,
  overflow: "hidden",
  padding: 0,
  position: "absolute",
  whiteSpace: "nowrap",
  width: 1,
})


export const Link = styled(LinkComponent)({
  textDecoration: "none",
  color: "black",
  borderBottom: "1px solid rgba(0,0,0,0.1)",
  transition: "0.2s",
  "&:hover": {
    backgroundColor: "rgba(25,137,240,0.2)"
  }
})

export const InputBox = styled("input")`
width: 85%;
height: 100%;
max-height: "8vmin";
border: none;
outline: none;
padding: 0 1rem;
padding-left: 3rem;
border-radius: 1.5rem;
background-color: rgba(0,0,0,0.1);  
`

export const SearchInput = styled("input")`
height: 2.5rem;
min-height: 2.5rem;
max-height: 2.5rem;
width: 15rem;
min-width: 4rem;
max-width: 20rem;
border: none;
outline: none;
padding: 0rem 0rem;
background-color: transparent;
font-size: 1rem;
`