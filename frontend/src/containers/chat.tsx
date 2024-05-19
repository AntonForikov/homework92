import {CircularProgress, Grid, IconButton, Typography} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import TextField from '@mui/material/TextField';
import {useEffect, useRef, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../app/hooks.ts';
import {selectMessages, selectMessagesLoading} from '../store/message/messageSlice.ts';
import {getMessages, sendMessage} from '../store/message/messageThunk.ts';
import {selectUser} from '../store/user/userSlice.ts';
import {MessageFromWS} from '../types';

const Chat = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const messageList = useAppSelector(selectMessages);
  const messageLoading = useAppSelector(selectMessagesLoading);
  const [message, setMessage] = useState('');
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const [messagesFromWS, setMessagesFromWS] = useState<MessageFromWS[]>([]);

  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://127.0.0.1:8000/messages/ws');
    ws.current?.addEventListener('close', () => console.log('Connection closed'));

    ws.current?.addEventListener('message', (msg) => {
      const parsed = JSON.parse(msg.data);
      if (parsed.type === 'WELCOME') {
        ws.current?.send(JSON.stringify({type: 'NEW_USER', payload: user?.username, token: user?.token}));
      }
      if (parsed.type === 'SET_USERNAME') setActiveUsers(parsed.payload);
      if (parsed.type === 'NEW_MESSAGE') {
        setMessagesFromWS((prevState) => [...prevState, parsed.payload]);
      }
    });
    return () => {
      if (ws.current) ws.current?.close();
    };
  }, [user?.username, user?.token]);

  useEffect(() => {
    dispatch(getMessages());
  }, [dispatch]);

  const sendMsg = async () => {
    if (message[0] === ' ' || message === '') {
      setMessage('');
      return alert('You can not send an empty or begins from whitespace message.');
    }
    await dispatch(sendMessage(message));
    setMessage('');
    ws.current?.send(JSON.stringify({type: 'NEW_MESSAGE', payload: message}));
  };

  const changeMessageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  return (
    <>
      {messageLoading
        ? <Grid container justifyContent="center" mt={2}><CircularProgress/></Grid>
        : <Grid container sx={{mt: 2}}>
          <Grid
            width={200}
            sx={styles.usersOnline}
            item
          >
            <Typography textAlign="center" variant="h6">Online users:</Typography>
            {activeUsers.length > 0 &&
              activeUsers.map((activeUser, index) => {
                return <Typography key={index}>{activeUser}</Typography>;
              })
            }
          </Grid>
          <Grid
            sx={styles.chatRoom}
          >
            <Typography variant="h6">Chat room</Typography>
            <Grid sx={styles.chat}>
              {messageList.length > 0 &&
                messageList.map(message => {
                  return <Typography key={message._id}
                                     mt="auto"><strong>{message.user.username}</strong>: {message.text}
                  </Typography>;
                })}
              {messagesFromWS.length > 0 &&
                messagesFromWS.map((message, index) =>
                  <Typography key={index}>
                    <strong>{message.username}</strong>: {message.message}
                  </Typography>
                )
              }
            </Grid>
            <Grid container mt={2}>
              <TextField
                label="Message"
                variant="outlined"
                sx={{flex: 1, marginRight: 1}}
                value={message}
                onChange={changeMessageHandler}
                required
              />
              <IconButton onClick={sendMsg}>
                <SendIcon color="primary"/>
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      }
    </>
  );
};

const styles = {
  usersOnline: {
    border: '2px solid black',
    borderRadius: 2,
    mr: 3,
    pl: 1
  },
  chatRoom: {
    border: '2px solid black',
    flex: 1,
    borderRadius: 2,
    px: 2,
    pb: 2,
    maxHeight: '70%',
    height: '70%'
  },
  chat: {
    flex: 1,
    wordWrap: 'break-word',
    overflow: 'auto',
    maxHeight: '75vh',
    height: '75vh',
    boxShadow: 3,
    pl: 1,
    borderRadius: 2
  }
};

export default Chat;