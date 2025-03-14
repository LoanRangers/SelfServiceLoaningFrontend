
import './CreateItem.css';
import items from '../assets/fakeItems.json';
import { useState } from 'react';
import { Box, Container, TextField, Select, MenuItem, FormControl, InputLabel, Checkbox, FormControlLabel, Button } from '@mui/material';

function CreateItem() {

    {/* Item creation forms. Currently able to write in name, description, location, manufacturing year,
        select or create new category, select tags. Location probably needs to change to selection menu as well. */}

    const [category, setCategory] = useState('');
    const [showNewCategoryField, setShowNewCategoryField] = useState(false);
    const [selectedTags, setSelectedTags] = useState([])
    const [itemName, setItemName] = useState('');
    const [itemDescription, setItemDescription] = useState('');
    const [itemLocation, setItemLocation] = useState('');
    const [manufacturedYear, setManufacturedYear] = useState('');
    const [newCategory, setNewCategory] = useState('');

    const handleCategoryChange = (event) => {
        const value = event.target.value;
        setCategory(value);
        setShowNewCategoryField(value === 'new-category');
    };

    const handleTagChange = (event) => {
        const value = event.target.name;
        setSelectedTags((prevSelectedTags) =>
            prevSelectedTags.includes(value)
                ? prevSelectedTags.filter((tag) => tag !== value)
                : [...prevSelectedTags, value]
        );
    };

    const handleCreateItem = () => {
        const newItem = {
            name: itemName,
            description: itemDescription,
            location: itemLocation,
            manufacturedYear: manufacturedYear,
            category: showNewCategoryField ? newCategory : category,
            tags: selectedTags
        };
    
        console.log('New item created:', newItem);
    };

    const inputFields = [
        "Item name", "Item description", "Item location", "Manufactured in (Year)"
    ]
    const tags =[
        "tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7", "tag8", "tag9", "tag10"
    ]
    
    return (
        <div>
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
                            index === 1 ? itemDescription : 
                            index === 2 ? itemLocation : 
                            manufacturedYear
                        }
                        onChange={(e) => {
                            switch(index) {
                                case 0:
                                    setItemName(e.target.value)
                                    break;
                                case 1:
                                    setItemDescription(e.target.value)
                                    break;
                                case 2: 
                                    setItemLocation(e.target.value)
                                    break;
                                case 3:
                                    setManufacturedYear(e.target.value)
                                    break;
                                default:
                                    break;
                            }
                        }}
                        />
                    ))}
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
                    </div>

                    <Button variant='outlined' 
                    className='create-button' 
                    onClick={handleCreateItem}
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
        </div>
    )
}

export default CreateItem