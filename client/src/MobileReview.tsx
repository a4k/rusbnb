import * as React from 'react';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import { Grid, Avatar } from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';
import { toast } from 'react-toastify';
import BgAvatar from './BgAvatar';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import {TextField, Rating } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const ShortText = styled(Typography)({
    height: '20vh', overflow: 'scroll', textOverflow: 'ellipsis', overflowX: 'hidden', '&::-webkit-scrollbar':{ display: 'none'}
}),
FullText = styled(Typography)({
    height: 'auto',
    marginBottom: '2vh'
}),
ShortReview = styled(Box)({
    width: '90vw', maxHeight: '25vh', marginRight: '10%',
    background: 'rgba(255,255,255,0.5)',
    borderRadius: '20px',
    padding: '1rem',
    transition: '0.3s',
    overflow: 'hidden'
}),
FullReview = styled(Grid)({
    width: '100%'
});

type ReviewParams = {
    userId: number,
    rate: number,
    text: string,
    short: boolean,
    roomId?: number,
    id?: number,
    value?: number,
    onChange?: (newVal: number) => void
}

/**
 * Отзыв для мобильной версии
 * @param props.userId айди пользователя, оставившего отзыв
 * @param props.rate оценка
 * @param props.text текст отзыва
 * @param props.short короткий или длинный отзыв: true - короткий, false - длинный
 * @param props.roomId айди жилья (для брони)
 * @param props.id айди отзыва (для удаления и редактирования)
 * @returns 
 */
export default function Review(props: ReviewParams){
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = React.useState(false);
    const [editRoom, setEditRoom] = React.useState(props);
    const [user, setUser] = React.useState({
        id: 0,
        username: ''
    })
    const [room, setRoom] = React.useState(
        {description: '', id: 0, price: 0, rate: 0, subtitle: '', title: ''}
    );

    /**
     * Редактирует отзыв
     */
    const putReview = ()=>{
        if(props.id){
            axios.put(`/review/${props.id}`, {
                review_text: editRoom.text,
                rate: editRoom.rate
            })
            .then((res) => {
                if(props.onChange && props.value!==undefined){
                    props.onChange(props.value + 1);
                }
                setIsEditing(false);
            })
        }
    }

    /**
     * Удаляет отзыв
     */
    const deleteReview = ()=>{
        if(props.id)
        {axios.delete(`/review/${props.id}`)
            .then(
                res=>
            { 
                setIsEditing(false);
                if(props.onChange && props.value!==undefined){
                    props.onChange(props.value + 1);
                }}
            )
            .catch(error=>{
                
            })
            
        }
    }
    React.useEffect(()=>{
        axios.get('/user/'+props.userId)
        .then(res=>{
            setUser(res.data);
            })
        .catch((error) => {
            if(!error.response) toast.error(`Ошибка на сервере. `+error);
            if (error.response!.status === 404){
                toast.error(`Пользователь не найден `);
            }
            else
            toast.error(`Ошибка на сервере. `+error);
            });

        if(props.roomId){
            axios.get('/rooms/'+props.roomId)
            .then(res=>{
                setRoom(res.data);
                })
            .catch((error) => {
                
            });
        }
    }, [])
    return (
        <>
        {(props.short)?(
            <ShortReview sx={isEditing?{overflowY: 'auto'}:{}}>
                <Box sx={{display: 'flex', flexDirection: 'row', marginBottom: '1vh'}}>
                    <a href={"/profile/" + String(props.userId)} style={{textDecoration: 'none'}}><Avatar sx={{width: '5vh', height: '5vh',
                background: BgAvatar(user.username)}}>
                        {user.username?(user.username[0].toUpperCase()):''}
                        </Avatar></a>
                    <Box sx={{display: 'inline-flex', flexFlow: 'column'}}>
                    <Typography sx={{marginLeft: '1rem', textOverflow: 'ellipsis'}}>{user.username}</Typography>
                    {props.roomId?
                    (
                        <a style={{marginLeft: '1rem', textOverflow: 'ellipsis', fontWeight: 'bold', textDecoration: 'none', color: 'black'}} href={`/details/${props.roomId}`}>{room.title}</a>
                    ):<></>    
                }
                    </Box>
                    <Box sx={{marginLeft: 'auto', display: String(props.userId)===localStorage.getItem('userId')?'block':'none'}}>
                        {
                            isEditing?<>
                            <Tooltip title="Отменить">
                                <IconButton>
                                    <CloseIcon onClick={()=>{setIsEditing(false)}}/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Сохранить">
                                <IconButton>
                                    <CheckIcon onClick={()=>{putReview();}}/>
                                </IconButton>
                            </Tooltip>
                            </>:
                            <>

                    <Tooltip title="Удалить">
                        <IconButton>
                            <DeleteOutlineIcon onClick={deleteReview}/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Редактировать">
                        <IconButton>
                            <EditIcon onClick={()=>{setIsEditing(true)}}/>
                        </IconButton>
                    </Tooltip>
                            </>
                        }

                    </Box>
                </Box>
                {
                    isEditing?
                    <>
                    <Rating
                        name="simple-controlled"
                        value={editRoom.rate}
                        onChange={(event, newValue) => {
                        setEditRoom({...editRoom, rate: (newValue || 1)})
                        }}
                    />
                    <TextField
                    sx={{width: '100%'}}
                    color="secondary"
                    defaultValue={props.text}
                    multiline
                    onChange={(e)=>{setEditRoom({...editRoom, text: e.target.value || ''})}}/>
                    </>
                    :
                    <>
                    <Typography sx={{fontSize: '1.5rem'}}>&#9733; {props.rate}</Typography>
                    <ShortText>{props.text}</ShortText>
                    </>
                }
            </ShortReview>
        ):(
            <FullReview item>
                <Box sx={{display: 'flex', flexDirection: 'row', marginBottom: '1vh'}}>
                <a href={"/profile/" + String(props.userId)} style={{textDecoration: 'none'}}><Avatar sx={{width: '5vh', height: '5vh',
                background: BgAvatar(user.username)}}>
                        {user.username?(user.username[0].toUpperCase()):''}
                        </Avatar></a>
                    <Typography sx={{marginLeft: '1rem', textOverflow: 'ellipsis'}}>{user.username}</Typography>
                    <Box sx={{marginLeft: 'auto', display: String(props.userId)===localStorage.getItem('userId')?'block':'none'}}>
                        {
                            isEditing?<>
                            <Tooltip title="Отменить">
                                <IconButton>
                                    <CloseIcon onClick={()=>{setIsEditing(false)}}/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Сохранить">
                                <IconButton>
                                    <CheckIcon onClick={()=>{putReview();}}/>
                                </IconButton>
                            </Tooltip>
                            </>:
                            <>

                    <Tooltip title="Удалить">
                        <IconButton>
                            <DeleteOutlineIcon onClick={deleteReview}/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Редактировать">
                        <IconButton>
                            <EditIcon onClick={()=>{setIsEditing(true)}}/>
                        </IconButton>
                    </Tooltip>
                            </>
                        }

                    </Box>
                </Box>
                {
                    isEditing?
                    <>
                    <Rating
                        name="simple-controlled"
                        value={editRoom.rate}
                        onChange={(event, newValue) => {
                        setEditRoom({...editRoom, rate: (newValue || 1)})
                        }}
                    />
                    <TextField
                    sx={{width: '100%'}}
                    color="secondary"
                    defaultValue={props.text}
                    multiline
                    onChange={(e)=>{setEditRoom({...editRoom, text: e.target.value || ''})}}/>
                    </>
                    :
                    <>
                    <Typography sx={{fontSize: '1.5rem'}}>&#9733; {props.rate}</Typography>
                    <FullText>{props.text}</FullText>
                    </>
                }
            </FullReview>
        )}
    </>
    )
}