import './CreateItem.css';
import api from '../services/APIservice';
import { useState, useEffect } from 'react';
import QRCodeScanner from './QRCodeScanner';
import {
    Box, Container, TextField, Select, MenuItem, FormControl,
    InputLabel, Button, IconButton, Typography
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
    const [itemCreated, setItemCreated] = useState(false);
    const [newItem, setNewItem] = useState({});
    const [showError, setShowError] = useState(false);
    const [locations, setLocations] = useState([]);
    const [allCategories, setAllCategories] = useState([]);
    const [readQR, setReadQR] = useState(false);
    const [predefinedTags, setPredefinedTags] = useState([]);
    const [newTag, setNewTag] = useState('');
    const [showNewTagField, setShowNewTagField] = useState(false);

    // Fetch locations and categories from the backend
    useEffect(() => {
        const fetchLocationsAndCategories = async () => {
            try {
                const locationsResponse = await api.get(`/locations`, { withCredentials: true });
                setLocations(locationsResponse.data.map(location => location.name));

                const categoriesResponse = await api.get(`/categories`, { withCredentials: true });
                setAllCategories(categoriesResponse.data.map(category => category.name));
            } catch (error) {
                console.error('Error fetching locations or categories:', error);
            }
        };

        fetchLocationsAndCategories();
    }, []);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await api.get('/tags', { withCredentials: true });
                setPredefinedTags(response.data.map((tag) => tag.name));
            } catch (error) {
                console.error('Error fetching tags:', error);
            }
        };

        fetchTags();
    }, []);

    const handleCategoryChange = (event) => {
        const value = event.target.value;
        setCategory(value);
        setShowNewCategoryField(value === 'new-category');
    };

    const handleAddTag = () => {
        if (newTag.trim() && !selectedTags.includes(newTag.trim())) {
            setSelectedTags([...selectedTags, newTag.trim()]);
            setNewTag('');
            setShowNewTagField(false);
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
    };

    const handleCreateItem = async (qr) => {
        if (
            (manufacturedYear && (isNaN(parseInt(manufacturedYear)) || manufacturedYear < 1900 || manufacturedYear > new Date().getFullYear())) ||
            (!category && !newCategory)
        ) {
            setShowError(true);
            return;
        }

        const newTags = selectedTags.filter((tag) => !predefinedTags.includes(tag));

        try {
            const savedTags = [];
            for (const tag of newTags) {
                try {
                    const response = await api.post('/tags', { name: tag }, { withCredentials: true });
                    console.log(`Tag created: ${response.data.name}`);
                    savedTags.push(response.data.name);
                } catch (error) {
                    if (error.response?.data?.error === 'A tag with this name already exists') {
                        console.warn(`Tag "${tag}" already exists.`);
                    } else {
                        console.error(`Error creating tag "${tag}":`, error);
                    }
                }
            }

            const allTags = [...predefinedTags.filter((tag) => selectedTags.includes(tag)), ...savedTags];

            const createdItem = {
                name: itemName,
                description: itemDescription,
                location: itemLocation,
                manufacturedYear: manufacturedYear || null,
                categoryName: showNewCategoryField ? newCategory.trim() : category.trim(),
                isAvailable: true,
                qr: parseInt(qr)
            };

            const itemResponse = await api.post(`/items/`, createdItem, { withCredentials: true });
            console.log('Item created:', itemResponse.data);

            // Attach tags to the created item
            for (const tag of allTags) {
                try {
                    await api.post('/itemsTags', { itemId: itemResponse.data.id, tagName: tag }, { withCredentials: true });
                    console.log(`Tag "${tag}" attached to item "${itemResponse.data.id}"`);
                } catch (error) {
                    console.error(`Error attaching tag "${tag}" to item:`, error);
                }
            }

            setNewItem(itemResponse.data);
            setItemCreated(true);
            setReadQR(false);
        } catch (error) {
            console.error('Error creating item:', error);
        }
    };

    const handleQrReading = (qr) => {
        console.log(qr);
        handleCreateItem(qr);
    };

    return (
        <div>
            {!readQR && !itemCreated && (
                <Container maxWidth="xl" className="container">
                    <Box className="box">
                        <h2>Create an item</h2>
                        <TextField
                            className="input"
                            fullWidth
                            label={
                                <>
                                    Item name <span style={{ color: 'red' }}>*</span>
                                </>
                            }
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
                            error={showError && manufacturedYear !== '' && (isNaN(parseInt(manufacturedYear)) || manufacturedYear < 1900 || manufacturedYear > new Date().getFullYear())}
                            helperText={
                                showError && manufacturedYear !== ''
                                    ? 'Enter a valid year'
                                    : manufacturedYear > new Date().getFullYear()
                                        ? `Year cannot exceed ${new Date().getFullYear()}`
                                        : ''
                            }
                            onChange={(e) => {
                                const year = e.target.value;
                                setManufacturedYear(year);
                                setShowError(year !== '' && (isNaN(parseInt(year)) || year < 1900 || year > new Date().getFullYear()));
                            }}
                        />
                        <Autocomplete
                            options={['new-category', ...allCategories]}
                            getOptionLabel={(option) => (option === 'new-category' ? 'Create a new category' : option)}
                            freeSolo
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={
                                        <>
                                            Select or Add a Category <span style={{ color: 'red' }}>*</span>
                                        </>
                                    }
                                    variant="filled"
                                    margin="normal"
                                    style={{ backgroundColor: 'white' }}
                                    fullWidth
                                />
                            )}
                            value={category}
                            onChange={(event, newValue) => {
                                if (newValue === 'new-category') {
                                    setShowNewCategoryField(true);
                                    setCategory('');
                                } else {
                                    setCategory(newValue);
                                    setShowNewCategoryField(false);
                                }
                            }}
                            onInputChange={(event, newInputValue) => {
                                if (!showNewCategoryField) {
                                    setCategory(newInputValue);
                                } else {
                                    setNewCategory(newInputValue);
                                }
                            }}
                        />

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
                        <FormControl className="input" fullWidth variant="filled" margin="normal">
                            <InputLabel>Select or Add Tags</InputLabel>
                            <Select
                                className="input"
                                displayEmpty
                                value=""
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value === 'new-tag') {
                                        setShowNewTagField(true);
                                    } else if (!selectedTags.includes(value)) {
                                        setSelectedTags([...selectedTags, value]);
                                    }
                                }}
                                fullWidth
                                variant="filled"
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            maxHeight: 200, 
                                            overflowY: 'auto', 
                                        },
                                    },
                                }}
                            >
                                <MenuItem value="new-tag">Create a new tag</MenuItem>
                                {predefinedTags.map((tag, index) => (
                                    <MenuItem key={index} value={tag}>
                                        {tag}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {showNewTagField && (
                            <TextField
                                className="input"
                                fullWidth
                                label="Add a new tag"
                                margin="normal"
                                variant="filled"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddTag();
                                    }
                                }}
                            />
                        )}
                        <Box className="tags-container" sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, marginTop: 2 }}>
                            {selectedTags.map((tag, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        backgroundColor: 'primary.main',
                                        color: 'white',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                    }}
                                >
                                    {tag}
                                    <IconButton
                                        size="small"
                                        onClick={() => handleRemoveTag(tag)}
                                        sx={{ color: 'white' }}
                                    >
                                        ✕
                                    </IconButton>
                                </Box>
                            ))}
                        </Box>
                        <Autocomplete
                            options={locations}
                            getOptionLabel={(option) => option}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={
                                        <>
                                            Search for a location <span style={{ color: 'red' }}>*</span>
                                        </>
                                    }
                                    variant="filled"
                                    margin="normal"
                                    fullWidth
                                    style={{ backgroundColor: 'white' }}
                                />
                            )}
                            value={itemLocation}
                            onChange={(event, newValue) => setItemLocation(newValue)}
                        />
                        <Button
                            variant="outlined"
                            className="create-button"
                            onClick={() => setReadQR(true)}
                            disabled={
                                !itemName ||
                                !itemLocation ||
                                (category === 'new-category' && !newCategory) // If "Create a new category" is selected, newCategory must be filled
                            }
                        >
                            Create Item
                        </Button>
                    </Box>
                </Container>
            )}
            {readQR && (
                <>
                    <Container maxWidth="xl" className="container">
                        <Box className="box">
                            <h3>Scan a QR code for {itemName}</h3>
                            <p>Description: {itemDescription}</p>
                            <p>Location: {itemLocation}</p>
                            <p>Manufactured in: {manufacturedYear}</p>
                            <p>Category: {showNewCategoryField ? newCategory : category}</p>
                            
                            <Button variant="outlined" className="create-button" onClick={() => setReadQR(false)}>
                                Back to editing
                            </Button>
                        </Box>
                    </Container>
                    <QRCodeScanner className="qr-code-scanner" handleScan={handleQrReading} />
                </>
            )}
            {itemCreated && (
                <Container maxWidth="xl" className="container">
                    {newItem.id && (
                        <Box className="box">
                            <h3>Item created successfully!</h3>
                            <p>Item ID: {newItem.id}</p>
                            <p>Name: {newItem.name}</p>
                            <p>Description: {newItem.description || 'No description provided'}</p>
                            <p>Location: {newItem.location || itemLocation || 'No location specified'}</p>
                            <p>Manufactured in: {newItem.manufacturedYear || manufacturedYear || 'Not specified'}</p>
                            <p>Category: {newItem.categoryName || category || 'No category specified'}</p>
                            <p>Tags: {selectedTags.join(', ') || 'No tags specified'}</p>
                        </Box>
                    )}
                </Container>
            )}
        </div>
    );
}

export default CreateItem;