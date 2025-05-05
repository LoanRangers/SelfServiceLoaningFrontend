import { useEffect, useState } from 'react';
import api from '../services/APIservice';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  FormControlLabel,
  Checkbox,
  IconButton,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  Button,
  SvgIcon,
} from "@mui/material";
import { Link } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import './ItemSearch.css'; // Import the CSS file

// Custom Flag Icon Component
function FlagIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M6 2v20h2v-6h8l-2-4 2-4H8V2H6z" />
    </SvgIcon>
  );
}

function ItemSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRooms, setExpandedRooms] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [availableOnly, setAvailableOnly] = useState(true);
  const [word, setWord] = useState('');
  const [items, setItems] = useState([]);
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);

  // State for flagging functionality
  const [openFlagDialog, setOpenFlagDialog] = useState(false);
  const [selectedFlag, setSelectedFlag] = useState('');
  const [flagComment, setFlagComment] = useState('');
  const [itemToFlag, setItemToFlag] = useState(null);
  const [predefinedFlags, setPredefinedFlags] = useState([]);

  useEffect(() => {
    async function fetchItems() {
      let req = await api.get(`/items`);
      setItems(req.data);
      setLocations(req.data.map(item => item.currentLocation).filter((value, index, self) => self.indexOf(value) === index));
      setCategories(req.data.map(item => item.categoryName).filter((value, index, self) => self.indexOf(value) === index));
    }
    fetchItems();
  }, []);

  // Fetch predefined flags
  useEffect(() => {
    async function fetchFlags() {
      try {
        const response = await api.get('/flags');
        setPredefinedFlags(response.data.map((flag) => flag.name)); // Extract flag names
      } catch (error) {
        console.error('Error fetching flags:', error);
      }
    }
    fetchFlags();
  }, []);

  const handleKeyPress = (event) => {
    setWord(event.target.value);
  };

  const handleSearchClick = () => {
    setSearchTerm(word);
    handleSearch({ target: { value: word } });
  };

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

  const handleCategoryAccordionChange = (category) => (event, isExpanded) => {
    setExpandedCategories(isExpanded ? [...expandedCategories, category] : expandedCategories.filter(item => item !== category));
  };

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

  const handleOpenFlagDialog = (item) => {
    setItemToFlag(item);
    setOpenFlagDialog(true);
  };

  const handleCloseFlagDialog = () => {
    setOpenFlagDialog(false);
    setSelectedFlag('');
    setFlagComment('');
  };

  const handleSubmitFlag = async () => {
    if (!selectedFlag || !flagComment.trim()) {
      alert('Please select a flag and add a comment.');
      return;
    }

    try {
      // Check if the flag already exists
      const existingFlag = predefinedFlags.includes(selectedFlag);

      if (!existingFlag) {
        // Create the flag if it doesn't exist
        try {
          const response = await api.post(
            '/flags',
            { name: selectedFlag },
            { withCredentials: true }
          );
          console.log(`Flag created: ${response.data.name}`);
          setPredefinedFlags([...predefinedFlags, response.data.name]); // Update predefined flags
        } catch (error) {
          if (error.response?.data?.error === 'A flag with this name already exists') {
            console.warn(`Flag "${selectedFlag}" already exists.`);
          } else {
            console.error(`Error creating flag "${selectedFlag}":`, error);
            alert('Failed to create the flag. Please try again.');
            return;
          }
        }
      }

      // Attach the flag to the item
      try {
        const response = await api.post(
          '/flags/items',
          {
            itemId: itemToFlag.id, // ID of the flagged item
            flagName: selectedFlag, // Selected flag name
            comment: flagComment.trim(), // Comment added by the user
          },
          { withCredentials: true }
        );

        alert('Item flagged successfully.');
        console.log('Flag response:', response.data);
        handleCloseFlagDialog();
      } catch (error) {
        console.error('Error attaching flag to item:', error);
        alert('Failed to flag the item. Please try again.');
      }
    } catch (error) {
      console.error('Error during flagging process:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  const groupedItems = {};
  categories.forEach((categoryName) => {
    items
      .filter((item) => item.categoryName === categoryName)
      .forEach((item) => {
        if (!groupedItems[item.currentLocation]) {
          groupedItems[item.currentLocation] = {};
        }
        if (!groupedItems[item.currentLocation][categoryName]) {
          groupedItems[item.currentLocation][categoryName] = [];
        }
        groupedItems[item.currentLocation][categoryName].push(item);
      });
  });

  const filteredRooms = locations.map((location) => ({
    room: location,
    categories: categories.map((category) => ({
      category,
      items: items.filter((item) => {
        const matchesLocation = item.currentLocation === location;
        const matchesCategory = item.categoryName === category;
        const matchesSearchTerm = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.markers && item.markers.some(marker => marker.toLowerCase().includes(searchTerm.toLowerCase()))) ||
          (item.categoryName && item.categoryName.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (item.currentLocation && item.currentLocation.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesAvailability = !availableOnly || item.isAvailable;
        return matchesLocation && matchesCategory && matchesSearchTerm && matchesAvailability;
      }),
    })).filter((category) => category.items.length > 0),
  })).filter((room) => room.categories.length > 0);

  return (
    <>
      {/* Search bar */}
      <TextField
        label="Search for an item (name, category, location or tag)"
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
                    <SearchIcon />
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

            {/* Second-Level Accordion for Categories inside Rooms */}
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
                          <TableCell>Flag</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {category.items.map((item) => (
                          <TableRow key={item.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell component="th" scope="row">
                              <Link to={`/item/${item.id}`}>{item.name}</Link>
                            </TableCell>
                            <TableCell className={item.isAvailable ? "available" : "not-available"}>
                              {item.isAvailable ? "Yes" : "No"}
                            </TableCell>
                            <TableCell>
                              <IconButton onClick={() => handleOpenFlagDialog(item)} sx={{ color: 'orange' }}>
                                <span role="img" aria-label="flag">
                                  🚩
                                </span>
                              </IconButton>
                            </TableCell>
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

      {/* Flag Dialog */}
      <Dialog open={openFlagDialog} onClose={handleCloseFlagDialog}>
        <DialogTitle>Flag Item</DialogTitle>
        <DialogContent>
          <Select
            fullWidth
            value={selectedFlag}
            onChange={(e) => setSelectedFlag(e.target.value)}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select a flag
            </MenuItem>
            {predefinedFlags.map((flag) => (
              <MenuItem key={flag} value={flag}>
                {flag}
              </MenuItem>
            ))}
          </Select>
          <TextField
            fullWidth
            multiline
            margin="normal"
            label="Add a comment"
            value={flagComment}
            onChange={(e) => setFlagComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFlagDialog}>Cancel</Button>
          <Button onClick={handleSubmitFlag} variant="contained" color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ItemSearch;