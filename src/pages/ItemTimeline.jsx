import './ItemTimeline.css';
import { useState } from 'react';
import { Button, TextField, Checkbox, FormControlLabel } from '@mui/material';
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import CommentIcon from '@mui/icons-material/Comment';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CreateIcon from '@mui/icons-material/Create';

function ItemTimeline({item, user}) {
    const unsortedEvents = [
        {"user": "eemil", "eventType": "itemCreation", "timestamp": new Date("2023-10-01T12:00:00Z"), "location": "Agora"},
        {"user": "eemil", "eventType": "loan", "timestamp": new Date("2023-11-03T14:21:00Z"), "location": "Agora"},
        {"user": "eemil", "eventType": "return", "timestamp": new Date("2023-11-13T12:50:00Z"), "location": "Agora"},
        {"user": "eemil", "eventType": "itemUpdate", "timestamp": new Date("2023-12-05T09:53:23Z"), "location": "Agora"},
        {"user": "eemil", "eventType": "comment", "timestamp": new Date("2023-12-20T18:11:55Z"), "location": "Agora", "eventContent":
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."},
    ]

    const events = unsortedEvents.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    const [viewableTimeline, setViewableTimeline] = useState(events.filter(event => event.eventType === "comment"))
    const [viewWholeTimeline, setViewWholeTimeline] = useState(false)
    const [newComment, setNewComment] = useState('');

    const handleCheckboxChange = (event) => {
        setViewWholeTimeline(!event.target.checked);
        if (!event.target.checked) {
            setViewableTimeline(events);
        } else {
            setViewableTimeline(events.filter(event => event.eventType === "comment"));
        }
    }

    const handleComment = () => {
        const pushComment = {
            "user": user.nickname,
            "eventType": "comment",
            "item": item.id,
            "timestamp": new Date(),
            "location": item.currentLocation,
            "eventContent": newComment
        }
        events.push(pushComment)
        setViewableTimeline([...viewableTimeline, pushComment].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)))
        setNewComment('')
        console.log(pushComment)

    }

    return (
        <div className='timeline-container'>
        <h4>Comments and timeline for {item.name}:</h4>
        {user && (<div>
            <TextField
            className="comment"
            fullWidth
            multiline
            label="Add a comment..."
            margin="normal"
            variant="filled"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            />
            <Button className='button' variant='outlined' onClick={handleComment} disabled={!newComment}>
                Submit comment
            </Button>
        </div>)}
        <FormControlLabel
            control={
                <Checkbox
                checked={!viewWholeTimeline}
                onChange={handleCheckboxChange}
                />
            }
            label="Show comments only"
            className='checkbox-label'
        />
        <VerticalTimeline layout='1-column-left'animate={false}>
            {viewableTimeline.map((event, index) => (
                <VerticalTimelineElement
                className='vertical-timeline-element--work'
                contentStyle={{ background: '#20374e' }}
                contentArrowStyle={{ borderRight: '7px solid  #20374e' }}
                date={event.timestamp.toLocaleString()}
                iconStyle={{ background: '#0f2842', color: '#fff' }}
                icon={
                event.eventType === "comment" ? <CommentIcon /> : 
                event.eventType === "return" ? <ArrowBackIcon /> :
                event.eventType === "loan" ? <ArrowForwardIcon /> : 
                <CreateIcon />
                }
                key={index}
                dateClassName='date-element'
                textClassName='text-element'
                >
                <h4 className="vertical-timeline-element-title">
                    {event.eventType === "itemCreation" ? `Item created by ${event.user} in ${event.location}` : ""}   
                    {event.eventType === "loan" ? `Loaned by ${event.user} from ${event.location}` : ""}    
                    {event.eventType === "return" ? `Returned by ${event.user} to ${event.location}` : ""}
                    {event.eventType === "itemUpdate" ? `Item updated by ${event.user} in ${event.location}` : ""}  
                    {event.eventType === "comment" ? `Comment by ${event.user}` : ""}  
                    
                </h4>
                {event.eventContent && event.eventContent.split('\n').map((paragraph, index) => (
                    <p key={index}>
                        {paragraph}
                    </p>
                ))}

                </VerticalTimelineElement>
            ))}
            </VerticalTimeline>            
        </div>
    )
}
export default ItemTimeline;