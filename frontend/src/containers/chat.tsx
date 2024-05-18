import {CircularProgress, Grid, IconButton, Typography} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import TextField from "@mui/material/TextField";
import {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../app/hooks.ts";
import {selectMessages, selectMessagesLoading} from "../store/message/messageSlice.ts";
import {getMessages, sendMessage} from "../store/message/messageThunk.ts";

const Chat = () => {
    const dispatch = useAppDispatch();
    const messageList = useAppSelector(selectMessages);
    const messageLoading = useAppSelector(selectMessagesLoading);
    const [message, setMessage] = useState('');

    useEffect(() => {
        dispatch(getMessages());
    }, [dispatch]);

    const sendMsg = () => {
        if (message[0] === ' ' || message === '') {
            setMessage('');
            return alert("You can't send an empty or begins from whitespace message.");
        }
        dispatch(sendMessage(message));
        setMessage('');
    };

    return (
        <>
            {messageLoading
                ? <Grid justifyContent='center' mt={2}><CircularProgress/></Grid>
                : <Grid container sx={{border: '1px solid black', height: '92vh'}}>
                    <Grid
                        width={200}
                        sx={{border: '1px solid red'}}
                        item
                    >
                        <Typography textAlign='center' variant='h6'>Online users:</Typography>
                    </Grid>
                    <Grid
                        sx={{border: '1px solid blue', flex: 1}}
                        container
                        direction='column'
                    >
                        <Typography variant='h6'>Chat room</Typography>
                        <Grid sx={{border: '1px solid grey', flex: 1}}>
                            {messageList.map(message => {
                                return <Typography key={message._id}>{message.user.username}: {message.text}</Typography>;
                            })}
                        </Grid>
                        <Grid container mt='auto'>
                            <TextField
                                label="Message"
                                variant="outlined"
                                sx={{flex: 1, marginRight: 1}}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                            />
                            <IconButton onClick={sendMsg}>
                                <SendIcon color='primary'/>
                            </IconButton>
                        </Grid>
                    </Grid>
                </Grid>
            }
        </>
    );
};

export default Chat;