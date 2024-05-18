import {Alert, CircularProgress, Grid, IconButton, Typography} from "@mui/material";
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
                ? <Grid container justifyContent='center' mt={2}><CircularProgress/></Grid>
                : <Grid container sx={{mt: 2}}>
                    <Grid
                        width={200}
                        sx={{border: '2px solid black', borderRadius: 2, marginRight: 3}}
                        item
                    >
                        <Typography textAlign='center' variant='h6'>Online users:</Typography>
                    </Grid>
                    <Grid
                        sx={{
                            border: '2px solid black',
                            flex: 1,
                            borderRadius: 2,
                            px: 2,
                            pb: 2,
                            maxHeight: '70%',
                            height: '70%'
                        }}
                    >
                        <Typography variant='h6'>Chat room</Typography>
                        <Grid sx={{
                            flex: 1,
                            wordWrap: 'break-word',
                            overflow: 'auto',
                            maxHeight: '70%',
                            boxShadow: 3,
                            pl: 1,
                            borderRadius: 2
                        }}>
                            {!messageLoading && messageList.length === 0
                                ? <Alert severity='warning'>There are no messages in DB</Alert>
                                : messageList.map(message => {
                                    return <Typography key={message._id}
                                                       mt='auto'><strong>{message.user.username}</strong>: {message.text}
                                    </Typography>;
                                })
                            }
                        </Grid>
                        <Grid container mt={2}>
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