import { useState } from 'react';
import items from '../assets/fakeItems.json';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, FormControlLabel, Checkbox, IconButton, InputAdornment } from "@mui/material";
import { Link } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';

function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRooms, setExpandedRooms] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState([]);
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

  const handleRoomAccordionChange = (room) => (event, isExpanded) => {
    setExpandedRooms(isExpanded ? [...expandedRooms, room] : expandedRooms.filter(item => item !== room));
  };

  {/* Expand Accordion on click */}
  const handleCategoryAccordionChange = (category) => (event, isExpanded) => {
    setExpandedCategories(isExpanded ? [...expandedCategories, category] : expandedCategories.filter(item => item !== category))
  };

  {/* Expand Accordions on search */}
  const handleSearch = (event) => {
    if (event.target.value) {
      setExpandedRooms(Object.keys(groupedItems));
      setExpandedCategories(items.map(category => category.category));
    } else {
      setExpandedRooms([]);
      setExpandedCategories([]);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setWord('');
    setExpandedRooms([]);
    setExpandedCategories([]);
  };

  const groupedItems = {};
  items.forEach((category) => {
    category.items.forEach((item) => {
      if (!groupedItems[item.location]) {
        groupedItems[item.location] = {};
      }
      if (!groupedItems[item.location][category.category]) {
        groupedItems[item.location][category.category] = [];
      }
      groupedItems[item.location][category.category].push(item);
    });
  });

  const filteredRooms = Object.entries(groupedItems)
  .map(([room, categories]) => ({
    room,
    categories: Object.entries(categories).map(([category, categoryItems]) => ({
      category,
      items: categoryItems.filter((item) => {
        const matchesSearchTerm = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesAvailability = !availableOnly || item.available;
        return matchesSearchTerm && matchesAvailability;
      }),
    })).filter((category) => category.items.length > 0)
  }))
  .filter((room) => room.categories.length > 0);

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
      {filteredRooms.map((room) => (
        <Accordion
          key={room.room}
          expanded={expandedRooms.includes(room.room)}
          onChange={handleRoomAccordionChange(room.room)}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel-${expandedCategories.category}-content`}
            id={`panel-${expandedCategories.category}-header`}
          >
            <Typography component="span" variant="h6">{room.room}</Typography>
          </AccordionSummary>
          <AccordionDetails>

            {/* 🔹 Added: Second-Level Accordion for Categories inside Rooms */}
            {room.categories.map((category) => (
              <Accordion
                key={category.category}
                expanded={expandedCategories.includes(category.category)}
                onChange={handleCategoryAccordionChange(category.category)}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography component="span" variant="h6">{category.category}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Item</TableCell>
                          <TableCell>Availability</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {category.items.map((item) => (
                          <TableRow key={item.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell component="th" scope="row">
                              <Link to={`/item/${item.id}`}>{item.name}</Link>
                            </TableCell>
                            <TableCell className={item.available ? "available" : "not-available"}>{item.available ? "Yes" : "No"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </AccordionDetails>
              </Accordion>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
}

export default Home;