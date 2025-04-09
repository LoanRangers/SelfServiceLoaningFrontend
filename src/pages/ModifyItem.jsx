import { useState, useEffect } from 'react';
import './ItemPage.css';
import {Box, Container, Button, TextField, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox} from '@mui/material';


function ModifyItem ({item, handleModify}) {

    const [itemName, setItemName] = useState(item.name || '');
    const [itemDescription, setItemDescription] = useState(item.description || '');
    const [manufacturedYear, setManufacturedYear] = useState(item.manufacturedYear || '');
    const [category, setCategory] = useState(item.categoryName || '');
    const [showError, setShowError] = useState(false);
    const [showNewCategoryField, setShowNewCategoryField] = useState(false);
    const [newCategory, setNewCategory] = useState('');

    const [selectedTags, setSelectedTags] = useState(item.markers || [])
    const [showTagCreation, setShowTagCreation] = useState(false);
    const [newTag, setNewTag] = useState('');

    const fields = ["Item name", "Item description"];

    const [allCategories, setAllCategories] = useState([]);

    useEffect(() => {
        async function fetchData() {
            let req = await axios.get('http://localhost:3000/items/');
            setAllCategories([...new Set(req.data.map(item => item.categoryName))]);
        }
        fetchData();
        }, [])


    const handleModifyItem = () => {
        if (isNaN(parseInt(manufacturedYear)) || manufacturedYear < 1900 || manufacturedYear > new Date().getFullYear()) {
            setShowError(true);
        }
        else {
            const modifiedItem = {
                name: itemName,
                description: itemDescription,
                manufacturedYear: manufacturedYear,
                categoryName: showNewCategoryField ? newCategory : category,
                markers: selectedTags
            };
            handleModify(modifiedItem)
        }
    }

    const hasChanges = 
        itemName !== item.name ||
        itemDescription !== item.description ||
        manufacturedYear !== item.manufacturedYear ||
        category !== item.categoryName ||
        JSON.stringify(selectedTags) !== JSON.stringify(item.tags || []);


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

    const [tags, setTags] = useState([
        "tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7", "tag8", "tag9", "tag10",
        ...(item.tags || [])])

    const handleTagCreation = () => {
        setTags([...tags, newTag]);
        setShowTagCreation(false);
        setSelectedTags([...selectedTags, newTag]);
        setNewTag('');
    }
  
  
    return (
        <>
        <Container 
            maxWidth="xl"
            className="container">
            <Box className="box">
                <h2>Modify {item.name}</h2>
                {fields.map((field, index) => (
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
                        value={category}
                        onChange={handleCategoryChange}
                        fullWidth
                        variant="filled"
                    >
                    {allCategories.map((category, index) => (
                        <MenuItem key={index} value={category}>{category}</MenuItem>
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

                <Button variant='outlined' 
                className='button' 
                onClick={handleModifyItem}
                disabled ={!hasChanges ||
                    (!itemName ||
                    !manufacturedYear ||
                    (!category || (category === "new-category" && !newCategory)))
                }
                >
                    Modify Item
                </Button>
            </Box>
        </Container>
        </>
    )
}

export default ModifyItem