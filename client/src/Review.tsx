import * as React from 'react';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import { Grid, Avatar } from '@mui/material';
import { styled } from '@mui/system';

const ShortText = styled(Typography)({
    height: '20vh', overflow: 'scroll', textOverflow: 'ellipsis', overflowX: 'hidden', '&::-webkit-scrollbar':{ display: 'none'}
}),
FullText = styled(Typography)({
    height: 'auto',
    marginBottom: '2vh'
}),
ShortReview = styled(Grid)({
    width: '40%', minHeight: '30vh', marginRight: '10%'
}),
FullReview = styled(Grid)({
    width: '100%'
});

type ReviewParams = {
    userId: number,
    rate: number,
    text: string,
    short: boolean
}

export default function Review(props: ReviewParams){
    return (
        <>
        {(props.short)?(
            <ShortReview item>
                <Box sx={{display: 'flex', flexDirection: 'row', marginBottom: '1vh'}}>
                    <a href={"/profile/" + String(props.userId)} style={{textDecoration: 'none'}}><Avatar sx={{width: '5vh', height: '5vh'}}>J</Avatar></a>
                    <Typography sx={{marginLeft: '1rem', textOverflow: 'ellipsis'}}>Jwwgwrg</Typography>
                </Box>
                <Typography sx={{fontSize: '1.5rem'}}>&#9733; {props.rate}</Typography>
                <ShortText>{props.text}</ShortText>
            </ShortReview>
        ):(
            <FullReview item>
                <Box sx={{display: 'flex', flexDirection: 'row', marginBottom: '1vh'}}>
                    <a href={"/profile/" + String(props.userId)} style={{textDecoration: 'none'}}><Avatar sx={{width: '5vh', height: '5vh'}}>J</Avatar></a>
                    <Typography sx={{marginLeft: '1rem', textOverflow: 'ellipsis'}}>Jwwgwrg</Typography>
                </Box>
                <Typography sx={{fontSize: '1.5rem'}}>&#9733; {props.rate}</Typography>
                <FullText>{props.text}</FullText>
            </FullReview>
        )}
    </>
    )
}