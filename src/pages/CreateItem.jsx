
import './CreateItem.css';
import items from '../assets/fakeItems.json';
import { useState } from 'react';
import { 
    Box, Container, TextField, Select, MenuItem, FormControl, 
    InputLabel, Checkbox, FormControlLabel, Button, List, ListItem, ListItemText
    }    from '@mui/material';

function CreateItem() {

    const [category, setCategory] = useState('');
    const [showNewCategoryField, setShowNewCategoryField] = useState(false);
    const [selectedTags, setSelectedTags] = useState([])
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
    
    const handleCategoryChange = (event) => {
        const value = event.target.value;
        setCategory(value);
        setShowNewCategoryField(value === 'new-category');
    };

    const [tags, setTags] = useState([
        "tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7", "tag8", "tag9", "tag10"
    ])
    const handleTagCreation = () => {
        setTags([...tags, newTag]);
        setShowTagCreation(false);
        setSelectedTags([...selectedTags, newTag]);
        setNewTag('');
    }
    const handleTagChange = (event) => {
        const value = event.target.name;
        setSelectedTags((prevSelectedTags) =>
            prevSelectedTags.includes(value)
                ? prevSelectedTags.filter((tag) => tag !== value)
                : [...prevSelectedTags, value]
        );
    };

    const inputFields = [
        "Item name", "Item description"
    ]

    const locations =[
        "Location 1", "Location 2", "Location 3", "Location 4", "Location 5", "Location 6", "Location 7", "Location 8", "Location 9", "Location 10"
    ]
    const handleLocationChange = (event) => {
        const value = event.target.value;
        setItemLocation(value);
    }
    
    const handleCreateItem = () => {
        if (isNaN(parseInt(manufacturedYear)) || manufacturedYear < 1900 || manufacturedYear > new Date().getFullYear()) {
            setShowError(true);
        }
        else {
            const createdItem = {
                name: itemName,
                description: itemDescription,
                location: itemLocation,
                manufacturedYear: manufacturedYear,
                category: showNewCategoryField ? newCategory : category,
                tags: selectedTags,
                available: true,
                created_on: new Date().toISOString()
            };
            setNewItem(createdItem);
            setItemCreated(true);
            console.log(manufacturedYear)
            console.log('New item created:', createdItem);
        }
    };

    
    return (
        <div>
            {!itemCreated ? (
            <Container 
                maxWidth="xl"
                className="container">
                <Box className="box">
                <h2>Create an item</h2>
                    {inputFields.map((field, index) => (
                    <TextField
                    key={field + " " + index}
                    className='input'
                    fullWidth
                    label={field}
                    margin='normal'
                    variant="filled"
                    value={
                        index === 0 ? itemName :
                        itemDescription
                    }
                    onChange={(e) => {
                        switch(index) {
                        case 0:
                            setItemName(e.target.value)
                            break;
                        case 1:
                            setItemDescription(e.target.value)
                            break;
                        default:
                            break;
                        }
                    }}
                    />
                    ))}
                    <TextField
                    className='input'
                    fullWidth
                    label="Manufactured in (year)" 
                    margin='normal'
                    variant="filled"
                    value={manufacturedYear}
                    error={showError}
                    helperText={showError ? "Enter valid year" : ""}
                    onChange={(e) => setManufacturedYear(e.target.value)}
                    >

                    </TextField>
                    <FormControl className='input' fullWidth variant="filled" margin='normal'>
                    <InputLabel>Select a Category</InputLabel>
                    <Select
                        className='input'
                        displayEmpty
                        value={category}
                        onChange={handleCategoryChange}
                        fullWidth
                        variant="filled"
                    >
                    {items.map((category, index) => (
                        <MenuItem key={index} value={category.category}>{category.category}</MenuItem>
                    ))}
                    <MenuItem value="new-category">Create a new category</MenuItem>
                    </Select>
                    </FormControl>
                    {showNewCategoryField && (
                    <TextField
                        className='input'
                        fullWidth
                        label="New category"
                        margin="normal"
                        variant="filled"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                    />                
                    )}
                    <div>
                        <h4>Select tags</h4>
                        {tags.map((tag) => (
                            <FormControlLabel
                            key={tag}
                            control={
                                <Checkbox
                                checked={selectedTags.includes(tag)}
                                onChange={handleTagChange}
                                name={tag}
                                />
                            }
                            label={tag}
                            className='checkbox-label'
                            />
                        ))}
                        {!showTagCreation && (
                            <Button variant='outlined' className='tag-button' onClick={() => setShowTagCreation(true)}>
                                Add tag
                            </Button>)}
                    </div>
                    
                    {showTagCreation && (
                    <div>
                        <TextField
                        className='input'
                        fullWidth
                        label="New tag"
                        margin="normal"
                        variant="filled"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        />
                        <Button variant='outlined' className='tag-button' onClick={handleTagCreation} disabled={!newTag || (tags.includes(newTag))}>
                        Add tag
                        </Button>  
                        <Button variant='outlined' className='tag-button' onClick={() => setShowTagCreation(false)}>
                        Cancel
                        </Button>
                    </div>
                    )}

                    <FormControl className='input' fullWidth variant="filled" margin='normal'>
                    <InputLabel>Select a Location</InputLabel>
                    <Select
                        className='input'
                        displayEmpty
                        value={itemLocation}
                        onChange={handleLocationChange}
                        fullWidth
                        variant="filled"
                    >
                    {locations.map((location, index) => (
                        <MenuItem key={index} value={location}>{location}</MenuItem>
                    ))}
                    </Select>
                    </FormControl>

                    <Button variant='outlined' 
                    className='create-button' 
                    onClick={() => {
                    handleCreateItem()
                    }}
                    disabled ={
                    !itemName ||
                    !itemLocation ||
                    !manufacturedYear ||
                    (!category || (category === "new-category" && !newCategory))
                    }
                    >
                    Create Item
                    </Button>
                </Box>
            </Container>
            ) : (
            <Container maxWidth="xl" className="container">
                <Box className="box">
                <h4>Create item:</h4>
                <List className='new-item-list'>
                    <ListItem className='new-item-list-item'>
                        <ListItemText primary={"Item name: " + itemName} primaryTypographyProps={{align: "center"}}></ListItemText>
                    </ListItem>
                    <ListItem className='new-item-list-item'>
                        <ListItemText primary={"Description: " + itemDescription} primaryTypographyProps={{align: "center"}}></ListItemText>
                    </ListItem>
                    <ListItem className='new-item-list-item'>
                        <ListItemText primary={"Location: " + itemLocation} primaryTypographyProps={{align: "center"}}></ListItemText>
                    </ListItem>
                    <ListItem className='new-item-list-item'>
                        <ListItemText primary={"Manufactured in: " + manufacturedYear} primaryTypographyProps={{align: "center"}}></ListItemText>
                    </ListItem>
                    <ListItem className='new-item-list-item'>
                        <ListItemText primary={"Category: " + (showNewCategoryField ? newCategory : category)} primaryTypographyProps={{align: "center"}}></ListItemText>
                    </ListItem>
                    <ListItem className='new-item-list-item'>
                        <ListItemText primary={"Tags: " + selectedTags.join(", ")} primaryTypographyProps={{align: "center"}}></ListItemText>
                    </ListItem>
                </List>
                <Button variant='outlined' className='create-button' onClick={() => console.log('Scan QR code, item: ' + JSON.stringify(newItem))}>
                    Scan QR code
                </Button>
                </Box>
            </Container>
            )}
        </div>
    )
}

export default CreateItem