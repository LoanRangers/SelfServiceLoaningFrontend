import './CreateItem.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { 
    Box, Container, TextField, Select, MenuItem, FormControl, 
    InputLabel, Checkbox, FormControlLabel, Button, List, ListItem, ListItemText
} from '@mui/material';

import Autocomplete from '@mui/material/Autocomplete';

function CreateItem() {
    const [category, setCategory] = useState('');
    const [showNewCategoryField, setShowNewCategoryField] = useState(false);
    const [selectedTags, setSelectedTags] = useState([]);
    const [itemName, setItemName] = useState('');
    const [itemDescription, setItemDescription] = useState('');
    const [itemLocation, setItemLocation] = useState('');
    const [manufacturedYear, setManufacturedYear] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [showTagCreation, setShowTagCreation] = useState(false);
    const [newTag, setNewTag] = useState('');
    const [itemCreated, setItemCreated] = useState(false);
    const [newItem, setNewItem] = useState({});
    const [showError, setShowError] = useState(false);
    const [locations, setLocations] = useState([]);
    const [allCategories, setAllCategories] = useState([]);

    // Fetch locations and categories from the backend
    useEffect(() => {
        const fetchLocationsAndCategories = async () => {
            try {
                // Fetch locations
                const locationsResponse = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}:${import.meta.env.VITE_BACKEND_PORT}/locations`,
                    { withCredentials: true }
                );
                setLocations(locationsResponse.data.map(location => location.name));

                // Fetch categories
                const categoriesResponse = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}:${import.meta.env.VITE_BACKEND_PORT}/categories`,
                    { withCredentials: true }
                );
                setAllCategories(categoriesResponse.data.map(category => category.name));
            } catch (error) {
                console.error('Error fetching locations or categories:', error);
            }
        };

        fetchLocationsAndCategories();
    }, []); // Empty dependency array ensures this runs once when the component mounts

    const handleCategoryChange = (event) => {
        const value = event.target.value;
        setCategory(value);
        setShowNewCategoryField(value === 'new-category');
    };

    const handleCreateItem = async () => {
        if (
            isNaN(parseInt(manufacturedYear)) ||
            manufacturedYear < 1900 ||
            manufacturedYear > new Date().getFullYear() ||
            (!category && !newCategory)
        ) {
            setShowError(true);
        } else {
            const createdItem = {
                name: itemName,
                description: itemDescription,
                location: itemLocation,
                manufacturedYear: manufacturedYear,
                categoryName: showNewCategoryField ? newCategory.trim() : category.trim(),
                markers: selectedTags,
                isAvailable: true,
            };

            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}:${import.meta.env.VITE_BACKEND_PORT}/items/`,
                    createdItem,
                    { withCredentials: true }
                );
                console.log('Item successfully created:', response.data);
                setNewItem(response.data);
                setItemCreated(true);
            } catch (error) {
                console.error('Error creating item:', error);
            }
        }
    };

    return (
        <div>
            {!itemCreated ? (
                <Container maxWidth="xl" className="container">
                    <Box className="box">
                        <h2>Create an item</h2>
                        <TextField
                            className="input"
                            fullWidth
                            label="Item name"
                            margin="normal"
                            variant="filled"
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                        />
                        <TextField
                            className="input"
                            fullWidth
                            multiline
                            label="Item description"
                            margin="normal"
                            variant="filled"
                            value={itemDescription}
                            onChange={(e) => setItemDescription(e.target.value)}
                        />
                        <TextField
                            className="input"
                            fullWidth
                            label="Manufactured in (year)"
                            margin="normal"
                            variant="filled"
                            value={manufacturedYear}
                            error={showError || manufacturedYear > new Date().getFullYear()} // Check if the year exceeds the current year
                            helperText={
                                showError
                                    ? 'Enter a valid year'
                                    : manufacturedYear > new Date().getFullYear()
                                    ? `Year cannot exceed ${new Date().getFullYear()}`
                                    : ''
                            }
                            onChange={(e) => {
                                const year = e.target.value;
                                setManufacturedYear(year);
                                setShowError(isNaN(parseInt(year)) || year < 1900 || year > new Date().getFullYear());
                            }}
                        />
                        <FormControl className="input" fullWidth variant="filled" margin="normal">
                            <InputLabel>Select a Category</InputLabel>
                            <Select
                                className="input"
                                displayEmpty
                                value={category}
                                onChange={handleCategoryChange}
                                fullWidth
                                variant="filled"
                            >
                                {allCategories.map((category, index) => (
                                    <MenuItem key={index} value={category}>
                                        {category}
                                    </MenuItem>
                                ))}
                                <MenuItem value="new-category">Create a new category</MenuItem>
                            </Select>
                        </FormControl>
                        {showNewCategoryField && (
                            <TextField
                                className="input"
                                fullWidth
                                label="New category"
                                margin="normal"
                                variant="filled"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                            />
                        )}
                        <Autocomplete
                            options={locations}
                            getOptionLabel={(option) => option}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Search for a location"
                                    variant="filled"
                                    margin="normal"
                                    fullWidth
                                    style={{ backgroundColor: 'white' }} // Add white background
                                />
                            )}
                            value={itemLocation}
                            onChange={(event, newValue) => setItemLocation(newValue)}
                        />
                        <Button
                            variant="outlined"
                            className="create-button"
                            onClick={handleCreateItem}
                            disabled={
                                !itemName ||
                                !itemLocation ||
                                !manufacturedYear ||
                                (!category || (category === 'new-category' && !newCategory))
                            }
                        >
                            Create Item
                        </Button>
                    </Box>
                </Container>
            ) : (
                <Container maxWidth="xl" className="container">
                    <Box className="box">
                        <h4>Item created successfully!</h4>
                        <p>Item name: {itemName}</p>
                        <p>Description: {itemDescription}</p>
                        <p>Location: {itemLocation}</p>
                        <p>Manufactured in: {manufacturedYear}</p>
                        <p>Category: {showNewCategoryField ? newCategory : category}</p>
                        <p>Tags: {selectedTags.join(', ')}</p>
                    </Box>
                </Container>
            )}
        </div>
    );
}

export default CreateItem;