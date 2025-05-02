import './ItemTimeline.css';
import { useState, useEffect } from 'react';
import { Button, TextField, Checkbox, FormControlLabel } from '@mui/material';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import CommentIcon from '@mui/icons-material/Comment';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CreateIcon from '@mui/icons-material/Create';
import api from '../services/APIservice';

function ItemTimeline({ item, user }) {
  const [events, setEvents] = useState([]);
  const [viewableTimeline, setViewableTimeline] = useState([]);
  const [viewWholeTimeline, setViewWholeTimeline] = useState(false);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Fetch comments for the current item
        const response = await api.get(`/comments?itemId=${item.id}`, { withCredentials: true });
  
        const fetchedEvents = response.data
          .filter((comment) => comment.itemId === item.id) // Ensure only comments for the current item are processed
          .map((comment) => ({
            user: comment.user || 'Unknown',
            eventType: 'comment',
            timestamp: new Date(comment.createdAt),
            location: item.currentLocation,
            eventContent: comment.content,
          }));
  
        const combinedEvents = [...fetchedEvents];
  
        // Sort events by timestamp (descending)
        const sortedEvents = combinedEvents.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setEvents(sortedEvents);
        setViewableTimeline(sortedEvents.filter((event) => event.eventType === 'comment'));
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
  
    if (item?.id) {
      fetchEvents();
    }
  }, [item]);

  const handleCheckboxChange = (event) => {
    setViewWholeTimeline(!event.target.checked);
    if (!event.target.checked) {
      setViewableTimeline(events);
    } else {
      setViewableTimeline(events.filter((event) => event.eventType === 'comment'));
    }
  };

  const handleComment = async () => {
    if (!newComment || newComment.trim() === '' || !item.id) {
      alert('Comment content and item ID are required.');
      return;
    }

    const commentData = {
      content: newComment.trim(),
      itemId: item.id,
    };

    try {
      // Send the comment to the backend
      const response = await api.post('/comments', commentData, { withCredentials: true });

      // Add the new comment to the timeline
      const newCommentFromBackend = {
        user: user.nickname,
        eventType: 'comment',
        timestamp: new Date(response.data.createdAt),
        location: item.currentLocation,
        eventContent: response.data.content,
      };

      const updatedEvents = [newCommentFromBackend, ...events];
      setEvents(updatedEvents);
      setViewableTimeline(updatedEvents.filter((event) => (viewWholeTimeline ? true : event.eventType === 'comment')));
      setNewComment('');
    } catch (error) {
      console.error('Error submitting comment:', error);
      if (error.response?.data?.error) {
        alert(`Error: ${error.response.data.error}`);
      }
    }
  };

  return (
    <div className="timeline-container">
      <h4>Comments and timeline for {item.name}:</h4>
      {user && (
        <div>
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
          <Button className="button" variant="outlined" onClick={handleComment} disabled={!newComment}>
            Submit comment
          </Button>
        </div>
      )}
      <FormControlLabel
        control={<Checkbox checked={!viewWholeTimeline} onChange={handleCheckboxChange} />}
        label="Show comments only"
        className="checkbox-label"
      />
      <VerticalTimeline layout="1-column-left" animate={false}>
        {viewableTimeline.map((event, index) => (
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{ background: '#20374e' }}
            contentArrowStyle={{ borderRight: '7px solid  #20374e' }}
            date={event.timestamp.toLocaleString()}
            iconStyle={{ background: '#0f2842', color: '#fff' }}
            icon={
              event.eventType === 'comment' ? (
                <CommentIcon />
              ) : event.eventType === 'return' ? (
                <ArrowBackIcon />
              ) : event.eventType === 'loan' ? (
                <ArrowForwardIcon />
              ) : (
                <CreateIcon />
              )
            }
            key={index}
            dateClassName="date-element"
            textClassName="text-element"
          >
            <h4 className="vertical-timeline-element-title">
              {event.eventType === 'itemCreation'
                ? `Item created by ${event.user} in ${event.location}`
                : ''}
              {event.eventType === 'loan' ? `Loaned by ${event.user} from ${event.location}` : ''}
              {event.eventType === 'return' ? `Returned by ${event.user} to ${event.location}` : ''}
              {event.eventType === 'itemUpdate'
                ? `Item updated by ${event.user} in ${event.location}`
                : ''}
              {event.eventType === 'comment' ? `Comment by ${event.user}` : ''}
            </h4>
            {event.eventContent &&
              event.eventContent.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
          </VerticalTimelineElement>
        ))}
      </VerticalTimeline>
    </div>
  );
}

export default ItemTimeline;