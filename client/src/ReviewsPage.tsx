import * as React from 'react';
import Typography from '@mui/material/Typography';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/system';
import { styled } from '@mui/system';
import {ReviewsBlock} from './ReviewsBlock';
import Review from './Review';
import axios from 'axios';
import { toast } from 'react-toastify';

const MainBox = styled(Box)({
    width: '72vw', marginLeft: '14vw', marginTop: '5vh', backgroundColor: 'none', marginBottom: '10vh'
}),
Line = styled(Box)({
    width: '100%', height: '0.1vh', backgroundColor: 'gray', marginTop: '2vh', marginBottom: '3vh'
})

type Review = {
    user_id: number,
    review: string,
    rate: number
}


export default function ReviewPage(){
    const {id} = useParams();
    const [reviewsList, setRList] = React.useState(Array<Review>);
    const [room, setRoom] = React.useState(
        {description: '', id: 0, price: 0, rate: 0, subtitle: '', title: ''}
    );
    React.useEffect(
        ()=>{
            axios.get('/rooms/'+id)
            .then(res=>{
                setRoom(res.data);
                })
            .catch((error) => {
                if(!error.response) toast.error('Ошибка на сервере. '+error)
                else if (error.response!.status === 404){
                    toast.error(`Жилье не найдено`);
                }
                else{
                    toast.error('Ошибка на сервере. '+error)
                }
            });
            axios.get('/reviews/'+id
            )
            .then(res=>{
                setRList(res.data.reviews);
                })
            .catch((error) => {
                if(!error.response) toast.error('Ошибка на сервере. '+error)
                else if (error.response.status !== 404){
                    toast.error('Ошибка на сервере. '+error);
                }
                });
        },
        []
    )
    return (
    <MainBox>
        <Typography sx={{fontSize: '2rem'}}>{room.title}</Typography>
        <Typography sx={{fontSize: '1.5rem'}}>&#9733; {(reviewsList.reduce(function(sum : number, elem : Review){
                return sum + elem.rate;
            }, 0) / (reviewsList.length==0?1:reviewsList.length))} &#183; {reviewsList.length} отзывов</Typography>
        <Line></Line>
        <ReviewsBlock container>
        {
                    reviewsList.map(r=>(
                        <Review
                        userId={r.user_id}
                        rate={r.rate}
                        text={r.review}
                        short = {true}
                        key={r.user_id}
                        />
                    ))
                }
            </ReviewsBlock>
    </MainBox>)
}