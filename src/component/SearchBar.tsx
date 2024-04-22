import { useState, ChangeEvent } from "react";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import { styled } from '@mui/system';

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': {
      borderColor: 'orange', // border color when focused
    },
  },
}));

interface SearchBarProps {
  setSearchQuery: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ setSearchQuery }) => (
  <form>
    <IconButton aria-label="search" disabled>
      <SearchIcon style={{ fill: "orange" }} />
    </IconButton>
    <StyledTextField
      id="search-bar"
      onInput={(e: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
      }}
      variant="outlined"
      placeholder="Search task here..."
      size="small"
    />
  </form>
);

export default SearchBar;
