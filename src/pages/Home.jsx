import { useState } from 'react';
import items from '../assets/fakeItems.json';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, FormControlLabel, Checkbox, IconButton, InputAdornment } from "@mui/material";
import { Link } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';

function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expanded, setExpanded] = useState([]);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [word, setWord] = useState('');

  {/* Search word change */}
  const handleKeyPress = (event) => {
    setWord(event.target.value);
  };

  {/* Trigger search on button */}
  const handleSearchClick = () => {
    setSearchTerm(word); 
    handleSearch({ target: { value: word } });
  }

  {/* Trigger search on Enter */}
  const handleEnter = (event) => {
    if (event.key === 'Enter') {
      setSearchTerm(word);
      handleSearch(event);
    }
  };

  const handleCheckboxChange = (event) => {
    setAvailableOnly(event.target.checked);
  };

  {/* Expand Accordion on click */}
  const handleAccordionChange = (category) => (event, isExpanded) => {
    if (isExpanded) {
      setExpanded(prevExpanded => [...prevExpanded, category]);
    } else {
      setExpanded(prevExpanded => prevExpanded.filter(item => item !== category));
    }
  };

  {/* Expand Accordions on search */}
  const handleSearch = (event) => {
    if (event.target.value) {
      setExpanded(items.map(category => category.category));
    } else {
      setExpanded([]);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setWord('');
    setExpanded([]);
  };

  const filteredItems = items.map((category) => ({
    ...category,
    items: category.items.filter((item) => {
      const matchesSearchTerm = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesAvailability = !availableOnly || item.available;
      return matchesSearchTerm && matchesAvailability;
    }),
  })).filter((category) => category.items.length > 0);

  return (
    <>
    {/* Search bar */}
      <TextField
        label="Search for an item"
        variant="filled"
        fullWidth
        margin="normal"
        value={word}
        onChange={handleKeyPress}
        onKeyDown={handleEnter}
        className="search-bar"
        slotProps={{
          input: {
            startAdornment: (
              searchTerm && (
                <InputAdornment position="start">
                  <IconButton onClick={handleClearSearch}>
                    <ArrowBackIcon />
                  </IconButton>
                </InputAdornment>
              )
            ),
            endAdornment: (
              (
                <InputAdornment position="end">
                  <IconButton onClick={handleSearchClick}>
                    <SearchIcon/>
                  </IconButton>
                </InputAdornment>
              )
            ),
          },
        }}
      />
      {!searchTerm && (
        <Typography variant="h5" style={{ margin: '10px 0', fontWeight: 'bold' }}>
          Or browse items by category
        </Typography>
      )}
      {/* Checkbox for showing only available items */}
      <FormControlLabel
        control={
          <Checkbox
            checked={availableOnly}
            onChange={handleCheckboxChange}
            name="availableOnly"
          />
        }
        label="Show only available items"
        className='checkbox-label'
      />
        {/* Accordion for each category */}
      {filteredItems.map((categories) => (
        <Accordion
          key={categories.category}
          expanded={expanded.includes(categories.category)}
          onChange={handleAccordionChange(categories.category)}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel-${categories.category}-content`}
            id={`panel-${categories.category}-header`}
          >
            <Typography component="span" variant="h6">{categories.category}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell>Availability</TableCell>
                    <TableCell>Location</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {categories.items.map((item) => (
                    <TableRow key={item.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell component="th" scope="row">
                        <Link to={`/item/${item.id}`}>{item.name}</Link>
                      </TableCell>
                      <TableCell className={item.available ? "available" : "not-available"}>{item.available ? "Yes" : "No"}</TableCell>
                      <TableCell>{item.location ? item.location : "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
}

export default Home;